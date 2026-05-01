-- 20260501000008_phase6_stripe.sql
--
-- Phase 6: Stripe Connect + escrow payments. Salons onboard via Stripe
-- Express, customers pay full amount on bid acceptance with Glossi
-- taking a 7% application fee, funds settle to the salon's connected
-- account on the standard Stripe schedule.
--
-- Schema: track Connect account state on businesses, payment status
-- and the fee we collected on bookings.
--
-- RPCs: split the old accept_bid into prepare/commit so an Edge
-- Function can atomically gate booking creation on
-- payment_intent.succeeded. commit_bid_acceptance is service_role
-- only — the webhook calls it; clients can't bypass payment.

alter table public.businesses
  add column if not exists stripe_account_id        text,
  add column if not exists stripe_charges_enabled   boolean not null default false,
  add column if not exists stripe_payouts_enabled   boolean not null default false,
  add column if not exists stripe_details_submitted boolean not null default false;

create index if not exists businesses_stripe_account_idx
  on public.businesses (stripe_account_id)
  where stripe_account_id is not null;

alter table public.bookings
  add column if not exists stripe_payment_intent_id text,
  add column if not exists payment_status           text not null default 'pending'
    check (payment_status in ('pending', 'succeeded', 'failed', 'refunded')),
  add column if not exists platform_fee_cents       int  not null default 0;

create index if not exists bookings_stripe_pi_idx
  on public.bookings (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create or replace function public.prepare_bid_acceptance(p_bid_id uuid)
returns table (
  bid_id              uuid,
  request_id          uuid,
  business_id         uuid,
  business_name       text,
  stripe_account_id   text,
  stripe_ready        boolean,
  price_cents         int,
  service_summary     text
)
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  return query
    select
      qb.id,
      qr.id,
      b.id,
      b.name,
      b.stripe_account_id,
      (b.stripe_account_id is not null
        and b.stripe_charges_enabled = true
        and b.stripe_payouts_enabled = true) as stripe_ready,
      qb.price_cents,
      array_to_string(qr.service_slugs, ', ') as service_summary
    from public.quote_bids qb
    join public.quote_requests qr on qr.id = qb.request_id
    join public.businesses b      on b.id  = qb.business_id
    where qb.id = p_bid_id
      and qb.status = 'active'
      and qr.status = 'open'
      and qr.customer_id = v_user_id
    limit 1;
end;
$$;

revoke all on function public.prepare_bid_acceptance(uuid) from public;
grant execute on function public.prepare_bid_acceptance(uuid) to authenticated;

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
   where request_id = v_request_id and id <> p_bid_id and status = 'active';

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

create or replace function public.update_business_stripe_status(
  p_business_id            uuid,
  p_stripe_account_id      text,
  p_charges_enabled        boolean,
  p_payouts_enabled        boolean,
  p_details_submitted      boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.businesses
     set stripe_account_id        = p_stripe_account_id,
         stripe_charges_enabled   = p_charges_enabled,
         stripe_payouts_enabled   = p_payouts_enabled,
         stripe_details_submitted = p_details_submitted,
         updated_at               = now()
   where id = p_business_id;
end;
$$;

revoke all on function public.update_business_stripe_status(uuid, text, boolean, boolean, boolean) from public;
revoke all on function public.update_business_stripe_status(uuid, text, boolean, boolean, boolean) from authenticated;
grant execute on function public.update_business_stripe_status(uuid, text, boolean, boolean, boolean) to service_role;
