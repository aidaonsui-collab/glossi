-- 20260501000010_salon_bids_counter_fields.sql
--
-- Extend salon_bids() to include the customer's counter fields so
-- /salon/bids can render "Customer countered $X" badges and the modal
-- can show Accept-counter / Reject-counter buttons without a second
-- round trip.

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
      -- Reveal contact on countered bids too — the salon needs to be
      -- able to message the customer to negotiate.
      case when qb.status in ('active', 'accepted', 'countered')
        then coalesce(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
        else null end,
      case when qb.status in ('active', 'accepted', 'countered')
        then u.email::text else null end,
      case when qb.status in ('active', 'accepted', 'countered')
        then p.phone else null end
    from public.quote_bids qb
    join public.businesses b      on b.id  = qb.business_id
    join public.quote_requests qr on qr.id = qb.request_id
    join auth.users u             on u.id  = qr.customer_id
    left join public.profiles p   on p.id  = qr.customer_id
    where b.owner_id = v_user_id
    order by qb.created_at desc;
end;
$$;

revoke all on function public.salon_bids() from public;
grant execute on function public.salon_bids() to authenticated;
