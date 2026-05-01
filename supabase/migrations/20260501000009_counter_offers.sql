-- 20260501000009_counter_offers.sql
--
-- Customer-side counter offers. Until now the customer's only options on
-- a bid were Accept (pay) or wait for it to expire. Salons in price-
-- sensitive markets (RGV especially) want a back-and-forth, so the
-- customer can now propose a different price and the salon can take it,
-- decline it, or come back with a new bid.
--
-- Lightweight design: the counter rides on the bid row itself rather
-- than a separate negotiation table. Three new columns + a 'countered'
-- status, with three RPCs for the verbs (counter / accept / reject).
-- If multi-step haggling becomes a thing we'll promote to a real history
-- table, but the data so far doesn't suggest it.

alter table public.quote_bids
  add column if not exists counter_offer_cents int
    check (counter_offer_cents is null or counter_offer_cents >= 0),
  add column if not exists counter_message     text,
  add column if not exists counter_at          timestamptz;

-- Status check predates this migration. Drop + recreate to add 'countered'.
alter table public.quote_bids drop constraint if exists quote_bids_status_check;
alter table public.quote_bids add constraint quote_bids_status_check
  check (status in ('active','withdrawn','accepted','rejected','expired','countered'));

-- =======================================================================
-- counter_bid — customer proposes a different price on a salon's bid
-- =======================================================================
create or replace function public.counter_bid(
  p_bid_id            uuid,
  p_counter_cents     integer,
  p_counter_message   text default null
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id    uuid := auth.uid();
  v_request_id uuid;
  v_req_status text;
  v_bid_status text;
  v_orig_price int;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_counter_cents is null or p_counter_cents < 0 then
    raise exception 'counter price must be non-negative' using errcode = '22023';
  end if;

  select qb.request_id, qb.status, qb.price_cents, qr.status
    into v_request_id, v_bid_status, v_orig_price, v_req_status
  from public.quote_bids qb
  join public.quote_requests qr on qr.id = qb.request_id
  where qb.id = p_bid_id
    and qr.customer_id = v_user_id;

  if v_request_id is null then
    raise exception 'bid not found or not yours' using errcode = '42501';
  end if;

  if v_req_status <> 'open' then
    raise exception 'request is no longer accepting responses' using errcode = '22023';
  end if;

  -- Allow re-countering from a previous countered state too.
  if v_bid_status not in ('active','countered') then
    raise exception 'bid is not in a counterable state' using errcode = '22023';
  end if;

  -- Block counters at or above the salon's current ask — that's just
  -- accepting with extra steps, and the prepare_bid_acceptance flow
  -- handles the real Pay handoff.
  if p_counter_cents >= v_orig_price then
    raise exception 'counter must be below the current bid price' using errcode = '22023';
  end if;

  update public.quote_bids
     set status              = 'countered',
         counter_offer_cents = p_counter_cents,
         counter_message     = nullif(trim(p_counter_message), ''),
         counter_at          = now()
   where id = p_bid_id;
end;
$$;

revoke all on function public.counter_bid(uuid, integer, text) from public;
grant execute on function public.counter_bid(uuid, integer, text) to authenticated;

-- =======================================================================
-- accept_counter — salon takes the customer's counter price
-- =======================================================================
-- Flips the bid back to 'active' at the counter price. Customer's next
-- step is to Pay via the existing prepare_bid_acceptance / Stripe flow.
create or replace function public.accept_counter(p_bid_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id     uuid := auth.uid();
  v_business_id uuid;
  v_status      text;
  v_counter     int;
  v_req_status  text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select qb.business_id, qb.status, qb.counter_offer_cents, qr.status
    into v_business_id, v_status, v_counter, v_req_status
  from public.quote_bids qb
  join public.quote_requests qr on qr.id = qb.request_id
  join public.businesses b      on b.id  = qb.business_id
  where qb.id = p_bid_id
    and b.owner_id = v_user_id;

  if v_business_id is null then
    raise exception 'bid not found or not yours' using errcode = '42501';
  end if;

  if v_status <> 'countered' then
    raise exception 'bid has no pending counter' using errcode = '22023';
  end if;

  if v_req_status <> 'open' then
    raise exception 'request is no longer open' using errcode = '22023';
  end if;

  if v_counter is null then
    raise exception 'counter price missing' using errcode = '22023';
  end if;

  update public.quote_bids
     set price_cents         = v_counter,
         status              = 'active',
         counter_offer_cents = null,
         counter_message     = null,
         counter_at          = null
   where id = p_bid_id;
end;
$$;

revoke all on function public.accept_counter(uuid) from public;
grant execute on function public.accept_counter(uuid) to authenticated;

-- =======================================================================
-- reject_counter — salon declines the counter, original price stands
-- =======================================================================
-- Status reverts to 'active' so the customer can either accept the
-- original price, counter again, or pick a different salon.
create or replace function public.reject_counter(p_bid_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id     uuid := auth.uid();
  v_business_id uuid;
  v_status      text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select qb.business_id, qb.status
    into v_business_id, v_status
  from public.quote_bids qb
  join public.businesses b on b.id = qb.business_id
  where qb.id = p_bid_id
    and b.owner_id = v_user_id;

  if v_business_id is null then
    raise exception 'bid not found or not yours' using errcode = '42501';
  end if;

  if v_status <> 'countered' then
    raise exception 'bid has no pending counter' using errcode = '22023';
  end if;

  update public.quote_bids
     set status              = 'active',
         counter_offer_cents = null,
         counter_message     = null,
         counter_at          = null
   where id = p_bid_id;
end;
$$;

revoke all on function public.reject_counter(uuid) from public;
grant execute on function public.reject_counter(uuid) to authenticated;

-- =======================================================================
-- Patch sibling RPCs so they treat 'countered' the same as 'active'
-- =======================================================================
-- accept_bid (customer accepts a *different* bid on the same request):
-- the losing-bids sweep needs to also reject countered bids, otherwise
-- they linger as ghost rows on a booked request. Signature mirrors the
-- post-Phase-6 deployed shape (returns uuid booking_id, SECURITY DEFINER).
create or replace function public.accept_bid(p_bid_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user_id     uuid := auth.uid();
  v_request_id  uuid;
  v_req_status  text;
  v_business_id uuid;
  v_provider_id uuid;
  v_price_cents int;
  v_duration    int;
  v_earliest    timestamptz;
  v_deposit_pct int;
  v_deposit     int;
  v_booking_id  uuid;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select qb.request_id, qr.status,
         qb.business_id, qb.provider_id,
         qb.price_cents, qb.estimated_duration, qb.earliest_slot
    into v_request_id, v_req_status,
         v_business_id, v_provider_id,
         v_price_cents, v_duration, v_earliest
  from public.quote_bids qb
  join public.quote_requests qr on qr.id = qb.request_id
  where qb.id = p_bid_id
    and qb.status = 'active'
    and qr.customer_id = v_user_id;

  if v_request_id is null then
    raise exception 'bid not found or not yours'
      using errcode = '42501';
  end if;

  if v_req_status not in ('open', 'booked') then
    raise exception 'request is no longer accepting responses'
      using errcode = '22023';
  end if;

  select coalesce(b.deposit_pct, 0)
    into v_deposit_pct
  from public.businesses b
  where b.id = v_business_id;

  v_deposit := round(v_price_cents * coalesce(v_deposit_pct, 0) / 100.0)::int;

  update public.quote_bids
     set status = 'accepted'
   where id = p_bid_id;

  update public.quote_bids
     set status = 'rejected'
   where request_id = v_request_id
     and id <> p_bid_id
     and status in ('active','countered');

  update public.quote_requests
     set status = 'booked'
   where id = v_request_id;

  insert into public.bookings (
    bid_id, customer_id, business_id, provider_id,
    scheduled_at, duration_min, price_cents, deposit_cents,
    status
  ) values (
    p_bid_id, v_user_id, v_business_id, v_provider_id,
    coalesce(v_earliest, now() + interval '1 day'),
    v_duration, v_price_cents, v_deposit,
    'confirmed'
  )
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

-- commit_bid_acceptance (Stripe webhook → booking row): same fix.
create or replace function public.commit_bid_acceptance(
  p_bid_id              uuid,
  p_payment_intent_id   text,
  p_platform_fee_cents  int
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_request_id  uuid;
  v_business_id uuid;
  v_provider_id uuid;
  v_customer_id uuid;
  v_price_cents int;
  v_duration    int;
  v_earliest    timestamptz;
  v_deposit_pct int;
  v_deposit     int;
  v_booking_id  uuid;
  v_existing    uuid;
begin
  select id into v_existing from public.bookings where bid_id = p_bid_id;
  if v_existing is not null then
    update public.bookings
       set stripe_payment_intent_id = coalesce(stripe_payment_intent_id, p_payment_intent_id),
           payment_status = 'succeeded',
           platform_fee_cents = coalesce(nullif(platform_fee_cents, 0), p_platform_fee_cents)
     where id = v_existing;
    return v_existing;
  end if;

  select qb.request_id, qb.business_id, qb.provider_id,
         qr.customer_id, qb.price_cents, qb.estimated_duration, qb.earliest_slot
    into v_request_id, v_business_id, v_provider_id,
         v_customer_id, v_price_cents, v_duration, v_earliest
  from public.quote_bids qb
  join public.quote_requests qr on qr.id = qb.request_id
  where qb.id = p_bid_id;

  if v_request_id is null then
    raise exception 'bid not found' using errcode = '22023';
  end if;

  select coalesce(b.deposit_pct, 0) into v_deposit_pct
  from public.businesses b where b.id = v_business_id;

  v_deposit := round(v_price_cents * coalesce(v_deposit_pct, 0) / 100.0)::int;

  update public.quote_bids set status = 'accepted'
   where id = p_bid_id and status = 'active';

  update public.quote_bids set status = 'rejected'
   where request_id = v_request_id and id <> p_bid_id
     and status in ('active','countered');

  update public.quote_requests set status = 'booked'
   where id = v_request_id;

  insert into public.bookings (
    bid_id, customer_id, business_id, provider_id,
    scheduled_at, duration_min, price_cents, deposit_cents,
    status, stripe_payment_intent_id, payment_status, platform_fee_cents
  ) values (
    p_bid_id, v_customer_id, v_business_id, v_provider_id,
    coalesce(v_earliest, now() + interval '1 day'),
    v_duration, v_price_cents, v_deposit,
    'confirmed', p_payment_intent_id, 'succeeded', p_platform_fee_cents
  )
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

revoke all on function public.commit_bid_acceptance(uuid, text, int) from public;
revoke all on function public.commit_bid_acceptance(uuid, text, int) from authenticated;
grant execute on function public.commit_bid_acceptance(uuid, text, int) to service_role;

-- submit_bid: when the salon resubmits, retire any countered bid too.
create or replace function public.submit_bid(
  p_business_id        uuid,
  p_request_id         uuid,
  p_price_cents        integer,
  p_estimated_duration integer,
  p_earliest_slot      timestamptz default null,
  p_message            text        default null,
  p_provider_id        uuid        default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id        uuid := auth.uid();
  v_bid_id         uuid;
  v_request_status text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_price_cents < 0 then
    raise exception 'price must be non-negative' using errcode = '22023';
  end if;

  if p_estimated_duration <= 0 then
    raise exception 'estimated_duration must be positive' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.businesses
    where id = p_business_id and owner_id = v_user_id
  ) then
    raise exception 'business not owned' using errcode = '42501';
  end if;

  select qr.status into v_request_status
  from public.quote_requests qr
  where qr.id = p_request_id;

  if v_request_status is null then
    raise exception 'request not found' using errcode = '22023';
  end if;

  if v_request_status <> 'open' then
    raise exception 'request is no longer accepting bids' using errcode = '22023';
  end if;

  update public.quote_bids
     set status = 'withdrawn'
   where request_id = p_request_id
     and business_id = p_business_id
     and status in ('active','countered');

  insert into public.quote_bids (
    request_id, business_id, provider_id, price_cents,
    estimated_duration, earliest_slot, message, status
  ) values (
    p_request_id, p_business_id, p_provider_id, p_price_cents,
    p_estimated_duration, p_earliest_slot, nullif(trim(p_message), ''), 'active'
  )
  returning id into v_bid_id;

  return v_bid_id;
end;
$$;

revoke all on function public.submit_bid(
  uuid, uuid, integer, integer, timestamptz, text, uuid
) from public;
grant execute on function public.submit_bid(
  uuid, uuid, integer, integer, timestamptz, text, uuid
) to authenticated;
