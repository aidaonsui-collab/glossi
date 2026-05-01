-- 20260501000011_salon_bids_privacy_and_dedupe.sql
--
-- Two fixes to /salon/bids surfaced in early dogfood:
--
-- 1. Privacy: customer name/email/phone leaked on every active or
--    countered bid. A spam-bidding salon could harvest the full
--    contact directory of every quote in their service area. Tighten
--    to "only reveal once the customer has actually paid for the
--    booking" — that's the existing Thumbtack-style guarantee from
--    request_customer_contact, applied here too.
--
-- 2. Dedupe: when a salon edits their bid, submit_bid withdraws the
--    old row and inserts a new one. Both rows came back from
--    salon_bids, so the old one rendered as "Customer · #abc · Lost"
--    next to the live bid. Filter out withdrawn bids that have a
--    newer non-withdrawn sibling on the same (request, business).
--    Manually-withdrawn rows with no replacement still show up so
--    the audit trail isn't lost.

create or replace function public.salon_bids()
returns table (
  bid_id              uuid,
  business_id         uuid,
  business_name       text,
  status              text,
  price_cents         int,
  estimated_duration  int,
  earliest_slot       timestamptz,
  message             text,
  created_at          timestamptz,
  counter_offer_cents int,
  counter_message     text,
  counter_at          timestamptz,
  request_id          uuid,
  request_status      text,
  service_slugs       text[],
  search_zip          text,
  request_notes       text,
  request_created_at  timestamptz,
  request_expires_at  timestamptz,
  customer_id         uuid,
  customer_name       text,
  customer_email      text,
  customer_phone      text
)
language plpgsql
stable
security definer
set search_path = public, extensions, auth
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return;
  end if;

  return query
    with paid_bids as (
      -- A bid earns the contact reveal only when its booking has
      -- collected payment. Mirrors the gate in
      -- request_customer_contact (post-Phase-6 escrow).
      -- Aliased to paid_bid_id because the function's RETURNS TABLE
      -- already declares a column named bid_id — Postgres flags the
      -- bare reference as ambiguous in the CASE/IN clauses below.
      select bk.bid_id as paid_bid_id
      from public.bookings bk
      where bk.payment_status = 'succeeded'
    )
    select
      qb.id,
      qb.business_id,
      b.name,
      qb.status,
      qb.price_cents,
      qb.estimated_duration,
      qb.earliest_slot,
      qb.message,
      qb.created_at,
      qb.counter_offer_cents,
      qb.counter_message,
      qb.counter_at,
      qr.id,
      qr.status,
      qr.service_slugs,
      qr.search_zip,
      qr.notes,
      qr.created_at,
      qr.expires_at,
      qr.customer_id,
      case when qb.id in (select paid_bid_id from paid_bids)
        then coalesce(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
        else null end,
      case when qb.id in (select paid_bid_id from paid_bids)
        then u.email::text else null end,
      case when qb.id in (select paid_bid_id from paid_bids)
        then p.phone else null end
    from public.quote_bids qb
    join public.businesses b      on b.id  = qb.business_id
    join public.quote_requests qr on qr.id = qb.request_id
    join auth.users u             on u.id  = qr.customer_id
    left join public.profiles p   on p.id  = qr.customer_id
    where b.owner_id = v_user_id
      -- Drop withdrawn rows that were superseded by a newer bid on
      -- the same (request, business). Keeps the manually-retracted
      -- audit rows but kills the "edit-bid leaves a Lost twin" UX.
      and not (
        qb.status = 'withdrawn'
        and exists (
          select 1 from public.quote_bids qb2
          where qb2.request_id = qb.request_id
            and qb2.business_id = qb.business_id
            and qb2.id <> qb.id
            and qb2.created_at > qb.created_at
            and qb2.status <> 'withdrawn'
        )
      )
    order by qb.created_at desc;
end;
$$;

revoke all on function public.salon_bids() from public;
grant execute on function public.salon_bids() to authenticated;
