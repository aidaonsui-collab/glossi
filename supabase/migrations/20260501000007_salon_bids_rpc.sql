-- 20260501000007_salon_bids_rpc.sql
--
-- salon_bids() — returns every bid the caller's businesses have ever
-- placed, joined with the request and the customer's contact info,
-- in one round trip. Used by /salon/bids so the list row shows the
-- real customer name instead of "Customer · #abc123".
--
-- The salon already gets contact reveal on any active/accepted bid
-- via request_customer_contact; this RPC is the same gate at scale.
-- Withdrawn / rejected bids leave name+email+phone NULL so a salon
-- that backed out doesn't keep a directory of customer contacts.
--
-- SECURITY DEFINER for the auth.users join (clients have no RLS
-- access). The b.owner_id = auth.uid() filter at the top excludes
-- any bid whose business isn't owned by the caller, so this can't
-- be used to enumerate other salons' bids.

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
      qr.id,
      qr.status,
      qr.service_slugs,
      qr.search_zip,
      qr.notes,
      qr.created_at,
      qr.expires_at,
      qr.customer_id,
      case when qb.status in ('active', 'accepted')
        then coalesce(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
        else null end,
      case when qb.status in ('active', 'accepted')
        then u.email::text else null end,
      case when qb.status in ('active', 'accepted')
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
