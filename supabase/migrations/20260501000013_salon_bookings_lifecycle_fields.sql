-- 20260501000013_salon_bookings_lifecycle_fields.sql
--
-- Extend salon_bookings() with the Phase-7 lifecycle columns so the
-- salon's Calendar / Clients / Earnings pages can render Mark
-- complete / No-show / Cancel buttons and "$X refunded" badges
-- without a second round trip per row.

drop function if exists public.salon_bookings(uuid);

create or replace function public.salon_bookings(p_business_id uuid)
returns table (
  booking_id            uuid,
  scheduled_at          timestamptz,
  duration_min          int,
  price_cents           int,
  deposit_cents         int,
  status                text,
  payment_status        text,
  completed_at          timestamptz,
  no_show_at            timestamptz,
  cancelled_at          timestamptz,
  cancelled_by          uuid,
  refunded_amount_cents int,
  created_at            timestamptz,
  customer_id           uuid,
  customer_name         text,
  customer_email        text,
  customer_phone        text,
  service_slugs         text[],
  request_id            uuid,
  request_notes         text,
  search_zip            text,
  review_id             uuid,
  review_rating         int,
  review_body           text
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
      bk.payment_status,
      bk.completed_at,
      bk.no_show_at,
      bk.cancelled_at,
      bk.cancelled_by,
      bk.refunded_amount_cents,
      bk.created_at,
      bk.customer_id,
      coalesce(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
      u.email::text,
      p.phone,
      qr.service_slugs,
      qr.id,
      qr.notes,
      qr.search_zip,
      r.id,
      r.rating,
      r.body
    from public.bookings bk
    join public.quote_bids qb     on qb.id = bk.bid_id
    join public.quote_requests qr on qr.id = qb.request_id
    join auth.users u             on u.id  = bk.customer_id
    left join public.profiles p   on p.id  = bk.customer_id
    left join public.reviews r    on r.booking_id = bk.id
    where bk.business_id = p_business_id
    order by bk.scheduled_at asc;
end;
$$;

revoke all on function public.salon_bookings(uuid) from public;
grant execute on function public.salon_bookings(uuid) to authenticated;
