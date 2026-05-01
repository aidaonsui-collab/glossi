-- 20260501000012_phase7_booking_lifecycle.sql
--
-- Phase 7: end-to-end booking lifecycle.
--
-- Phase 6 took a customer from "accept bid" → paid Stripe destination
-- charge → bookings row with status='confirmed'. Funds settle to the
-- salon's connected account at charge time (destination charges, not
-- escrow), but nothing flips the booking past 'confirmed' afterwards.
-- This phase wires the rest of the loop:
--
--   confirmed → completed   (salon marks done; customer can review)
--   confirmed → no_show     (salon flags; salon keeps payment)
--   confirmed → cancelled   (either side; refund logic in edge fn)
--
-- Cancellation refund policy mirrors the Pay & book copy:
--   * customer cancels >24h pre-appointment  → full refund + reverse transfer
--   * customer cancels  <24h pre-appointment → no refund
--   * salon cancels at any time              → full refund + reverse transfer
--
-- Stripe operations (refund / reverse_transfer) live in the
-- cancel-booking edge function — this migration only writes DB state.

alter table public.bookings
  add column if not exists completed_at           timestamptz,
  add column if not exists no_show_at             timestamptz,
  add column if not exists cancellation_reason    text,
  add column if not exists stripe_refund_id       text,
  add column if not exists refunded_at            timestamptz,
  add column if not exists refunded_amount_cents  int;

create index if not exists bookings_status_scheduled_idx
  on public.bookings (status, scheduled_at);

-- =======================================================================
-- reviews — customer leaves a 1-5 + text on a completed booking
-- =======================================================================
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null unique references public.bookings(id) on delete cascade,
  customer_id   uuid not null references auth.users(id),
  business_id   uuid not null references public.businesses(id),
  rating        int  not null check (rating between 1 and 5),
  body          text,
  salon_reply   text,
  salon_replied_at timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists reviews_business_idx on public.reviews (business_id, created_at desc);
create index if not exists reviews_customer_idx on public.reviews (customer_id);

alter table public.reviews enable row level security;

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read"
  on public.reviews for select
  using (true);

drop policy if exists "reviews_customer_insert" on public.reviews;
create policy "reviews_customer_insert"
  on public.reviews for insert
  with check (
    auth.uid() = customer_id
    and exists (
      select 1 from public.bookings bk
      where bk.id = reviews.booking_id
        and bk.customer_id = auth.uid()
        and bk.status = 'completed'
    )
  );

drop policy if exists "reviews_customer_update" on public.reviews;
create policy "reviews_customer_update"
  on public.reviews for update
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

-- Salon owners can patch their own reply onto a review (handled via
-- a dedicated RPC below to lock down which columns are writable).

-- =======================================================================
-- mark_booking_complete — salon flips a confirmed booking to completed
-- =======================================================================
create or replace function public.mark_booking_complete(p_booking_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_status  text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select bk.status into v_status
  from public.bookings bk
  join public.businesses b on b.id = bk.business_id
  where bk.id = p_booking_id
    and b.owner_id = v_user_id;

  if v_status is null then
    raise exception 'booking not found or not yours' using errcode = '42501';
  end if;

  if v_status <> 'confirmed' then
    raise exception 'booking is not confirmed (status=%)', v_status using errcode = '22023';
  end if;

  update public.bookings
     set status = 'completed',
         completed_at = now()
   where id = p_booking_id;
end;
$$;

revoke all on function public.mark_booking_complete(uuid) from public;
grant execute on function public.mark_booking_complete(uuid) to authenticated;

-- =======================================================================
-- mark_booking_no_show — salon flags customer didn't show; salon keeps payment
-- =======================================================================
create or replace function public.mark_booking_no_show(p_booking_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_status  text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select bk.status into v_status
  from public.bookings bk
  join public.businesses b on b.id = bk.business_id
  where bk.id = p_booking_id
    and b.owner_id = v_user_id;

  if v_status is null then
    raise exception 'booking not found or not yours' using errcode = '42501';
  end if;

  if v_status <> 'confirmed' then
    raise exception 'booking is not confirmed (status=%)', v_status using errcode = '22023';
  end if;

  update public.bookings
     set status = 'no_show',
         no_show_at = now()
   where id = p_booking_id;
end;
$$;

revoke all on function public.mark_booking_no_show(uuid) from public;
grant execute on function public.mark_booking_no_show(uuid) to authenticated;

-- =======================================================================
-- prepare_cancellation — single source of truth for cancellation policy
-- =======================================================================
-- Read-only helper used by both the cancel-booking edge function (to
-- decide refund amount) and the UI (to render the warning banner).
-- Centralising the math here avoids the customer + salon + edge fn
-- ever disagreeing about whether a cancel is "late".
create or replace function public.prepare_cancellation(p_booking_id uuid)
returns table (
  booking_id              uuid,
  status                  text,
  cancelable_by_caller    boolean,
  caller_role             text,
  scheduled_at            timestamptz,
  hours_until             double precision,
  price_cents             int,
  refund_eligible         boolean,
  refund_amount_cents     int,
  stripe_payment_intent_id text
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_user_id     uuid := auth.uid();
  v_customer_id uuid;
  v_business_id uuid;
  v_status      text;
  v_scheduled   timestamptz;
  v_price       int;
  v_pi          text;
  v_owner_id    uuid;
  v_role        text;
  v_can         boolean := false;
  v_hours       double precision;
  v_eligible    boolean;
  v_refund      int;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select bk.customer_id, bk.business_id, bk.status, bk.scheduled_at,
         bk.price_cents, bk.stripe_payment_intent_id, b.owner_id
    into v_customer_id, v_business_id, v_status, v_scheduled,
         v_price, v_pi, v_owner_id
  from public.bookings bk
  join public.businesses b on b.id = bk.business_id
  where bk.id = p_booking_id;

  if v_status is null then
    raise exception 'booking not found' using errcode = '42501';
  end if;

  if v_user_id = v_customer_id then
    v_role := 'customer';
    v_can  := true;
  elsif v_user_id = v_owner_id then
    v_role := 'salon';
    v_can  := true;
  else
    v_role := null;
    v_can  := false;
  end if;

  v_hours := extract(epoch from (v_scheduled - now())) / 3600.0;

  -- Salon-initiated cancels always refund. Customer cancels only
  -- refund when more than 24h out. No refund means the salon keeps
  -- the destination-charge proceeds; we don't issue a half refund
  -- because the user-facing copy promises full-or-none.
  if v_role = 'salon' then
    v_eligible := true;
  elsif v_role = 'customer' then
    v_eligible := v_hours > 24;
  else
    v_eligible := false;
  end if;

  v_refund := case when v_eligible then v_price else 0 end;

  return query select
    p_booking_id,
    v_status,
    v_can and v_status = 'confirmed',
    v_role,
    v_scheduled,
    v_hours,
    v_price,
    v_eligible,
    v_refund,
    v_pi;
end;
$$;

revoke all on function public.prepare_cancellation(uuid) from public;
grant execute on function public.prepare_cancellation(uuid) to authenticated;

-- =======================================================================
-- commit_booking_cancellation — service-role only, called by edge fn
-- =======================================================================
-- The edge function does the Stripe refund (which may include
-- reverse_transfer + refund_application_fee), then calls this with
-- the resulting refund_id + amount so the DB lands in a consistent
-- state. We deliberately do NOT let clients call this directly —
-- otherwise a hostile caller could mark a booking 'cancelled' without
-- actually triggering the refund.
create or replace function public.commit_booking_cancellation(
  p_booking_id     uuid,
  p_caller_id      uuid,
  p_reason         text,
  p_refund_id      text,
  p_refund_amount  int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.bookings
     set status                = 'cancelled',
         cancelled_at          = now(),
         cancelled_by          = p_caller_id,
         cancellation_reason   = nullif(trim(p_reason), ''),
         stripe_refund_id      = nullif(p_refund_id, ''),
         refunded_at           = case when p_refund_id is not null and p_refund_id <> '' then now() else null end,
         refunded_amount_cents = coalesce(p_refund_amount, 0),
         payment_status        = case when p_refund_amount > 0 then 'refunded' else payment_status end
   where id = p_booking_id;
end;
$$;

revoke all on function public.commit_booking_cancellation(uuid, uuid, text, text, int) from public;
revoke all on function public.commit_booking_cancellation(uuid, uuid, text, text, int) from authenticated;
grant execute on function public.commit_booking_cancellation(uuid, uuid, text, text, int) to service_role;

-- =======================================================================
-- submit_review — customer adds rating + body for a completed booking
-- =======================================================================
-- Wraps the INSERT so we can return a friendlier error than the RLS
-- 42501 if the booking isn't completed yet, and so re-submission
-- updates the existing row rather than failing on the unique idx.
create or replace function public.submit_review(
  p_booking_id  uuid,
  p_rating      int,
  p_body        text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id     uuid := auth.uid();
  v_customer_id uuid;
  v_business_id uuid;
  v_status      text;
  v_review_id   uuid;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'rating must be 1-5' using errcode = '22023';
  end if;

  select customer_id, business_id, status
    into v_customer_id, v_business_id, v_status
  from public.bookings
  where id = p_booking_id;

  if v_customer_id is null then
    raise exception 'booking not found' using errcode = '42501';
  end if;

  if v_customer_id <> v_user_id then
    raise exception 'not your booking' using errcode = '42501';
  end if;

  if v_status <> 'completed' then
    raise exception 'can only review completed bookings (status=%)', v_status using errcode = '22023';
  end if;

  insert into public.reviews (booking_id, customer_id, business_id, rating, body)
  values (p_booking_id, v_user_id, v_business_id, p_rating, nullif(trim(p_body), ''))
  on conflict (booking_id) do update
    set rating = excluded.rating,
        body   = excluded.body
  returning id into v_review_id;

  return v_review_id;
end;
$$;

revoke all on function public.submit_review(uuid, int, text) from public;
grant execute on function public.submit_review(uuid, int, text) to authenticated;

-- =======================================================================
-- reply_to_review — salon owner appends a public reply
-- =======================================================================
create or replace function public.reply_to_review(
  p_review_id uuid,
  p_reply     text
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id     uuid := auth.uid();
  v_business_id uuid;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select business_id into v_business_id
  from public.reviews
  where id = p_review_id;

  if v_business_id is null then
    raise exception 'review not found' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.businesses
    where id = v_business_id and owner_id = v_user_id
  ) then
    raise exception 'not your business' using errcode = '42501';
  end if;

  update public.reviews
     set salon_reply       = nullif(trim(p_reply), ''),
         salon_replied_at  = case when nullif(trim(p_reply), '') is not null then now() else null end
   where id = p_review_id;
end;
$$;

revoke all on function public.reply_to_review(uuid, text) from public;
grant execute on function public.reply_to_review(uuid, text) to authenticated;

-- =======================================================================
-- Refresh useSupabaseBookings query shape: customer page now needs
-- to know the review row (if any) for "leave a review" prompting.
-- The hook fetches via a left join on reviews, so no schema change
-- here — just documenting the contract.
-- =======================================================================
