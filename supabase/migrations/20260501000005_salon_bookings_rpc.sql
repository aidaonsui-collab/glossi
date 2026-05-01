-- 20260501000005_salon_bookings_rpc.sql
--
-- salon_bookings(p_business_id) — single round-trip read for the
-- salon dashboard's Calendar / Clients / Earnings pages. Joins
-- bookings -> bid -> request -> customer profile/auth.
--
-- RLS on bookings_business_read already enforces owner access on the
-- parent row; customer_id is unmasked because by the time a booking
-- exists the bid was accepted, which is the same gate
-- request_customer_contact uses. No information leaked beyond what
-- /salon/inbox/:id already reveals.
--
-- SECURITY DEFINER is needed for the auth.users join (RLS on
-- auth.users locks it to nothing for clients). The WHERE clause does
-- its own ownership check before any data is returned.

create or replace function public.salon_bookings(p_business_id uuid)
returns table (
  booking_id        uuid,
  scheduled_at      timestamptz,
  duration_min      int,
  price_cents       int,
  deposit_cents     int,
  status            text,
  created_at        timestamptz,
  customer_id       uuid,
  customer_name     text,
  customer_email    text,
  customer_phone    text,
  service_slugs     text[],
  request_id        uuid,
  request_notes     text,
  search_zip        text
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

  if not exists (
    select 1 from public.businesses
    where id = p_business_id and owner_id = v_user_id
  ) then
    return;
  end if;

  return query
    select
      bk.id,
      bk.scheduled_at,
      bk.duration_min,
      bk.price_cents,
      bk.deposit_cents,
      bk.status,
      bk.created_at,
      bk.customer_id,
      coalesce(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name') as customer_name,
      u.email::text as customer_email,
      p.phone as customer_phone,
      qr.service_slugs,
      qr.id,
      qr.notes,
      qr.search_zip
    from public.bookings bk
    join public.quote_bids qb     on qb.id = bk.bid_id
    join public.quote_requests qr on qr.id = qb.request_id
    join auth.users u             on u.id  = bk.customer_id
    left join public.profiles p   on p.id  = bk.customer_id
    where bk.business_id = p_business_id
    order by bk.scheduled_at asc;
end;
$$;

revoke all on function public.salon_bookings(uuid) from public;
grant execute on function public.salon_bookings(uuid) to authenticated;
