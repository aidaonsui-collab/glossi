-- 20260414000013_header_inbox_customer.sql
--
-- Extend header_inbox_summary() to also return a customer-side unread
-- count so the global nav can render an inbox badge for customers who
-- have fresh bids waiting on their requests.
--
-- Drop + recreate because CREATE OR REPLACE FUNCTION can't change a
-- RETURNS TABLE shape. The signature now returns exactly one row for
-- every authenticated caller — NULL business_slug for customers, a
-- populated slug for business owners. Callers that were only reading
-- the old two-column shape need to update (only HeaderAuth reads it).
--
-- Counts:
--   business_unread — open+unexpired requests this biz can act on that
--                     don't already have an active bid. Identical to
--                     the 0012 definition, just moved into the new
--                     one-row shape.
--   customer_unread — active bids (not accepted, withdrawn, rejected)
--                     on all of THIS user's open quote_requests. This
--                     maps to "how many salons responded that I
--                     haven't picked yet".

drop function if exists public.header_inbox_summary();

create or replace function public.header_inbox_summary()
returns table (
  business_slug   text,
  business_unread integer,
  customer_unread integer
)
language plpgsql
stable
security invoker
set search_path = public, extensions
as $$
declare
  v_user_id    uuid := auth.uid();
  v_biz_id     uuid;
  v_biz_slug   text;
  v_location   extensions.geography;
  v_services   text[];
  v_biz_count  integer := 0;
  v_cust_count integer;
begin
  if v_user_id is null then
    -- Anonymous callers still get exactly one row so the client-side
    -- shape is predictable. Both counts are 0.
    return query select null::text, 0, 0;
    return;
  end if;

  -- Customer side always runs — even business owners can have their
  -- own customer requests floating around (a salon owner booking a
  -- competitor or an unrelated service).
  select count(*)::integer into v_cust_count
  from public.quote_bids qb
  join public.quote_requests qr on qr.id = qb.request_id
  where qr.customer_id = v_user_id
    and qr.status = 'open'
    and qr.expires_at > now()
    and qb.status = 'active';

  -- Business side: first owned business, location + services, then
  -- count matching actionable rows. Matches the business_inbox filter
  -- from migration 0010.
  select b.id, b.slug, b.location
    into v_biz_id, v_biz_slug, v_location
  from public.businesses b
  where b.owner_id = v_user_id
  order by b.created_at asc
  limit 1;

  if v_biz_id is not null then
    select array_agg(distinct bs.service_slug) into v_services
    from public.business_services bs
    where bs.business_id = v_biz_id and bs.active = true;

    select count(*)::integer into v_biz_count
    from public.quote_requests qr
    where qr.status = 'open'
      and qr.expires_at > now()
      and not exists (
        select 1 from public.quote_bids qb
        where qb.request_id = qr.id
          and qb.business_id = v_biz_id
          and qb.status = 'active'
      )
      and (
        qr.target_business_id = v_biz_id
        or (
          qr.target_business_id is null
          and extensions.ST_DWithin(
            qr.search_location,
            v_location,
            qr.radius_miles * 1609.34
          )
          and qr.service_slugs && coalesce(v_services, array[]::text[])
        )
      );
  end if;

  return query
    select v_biz_slug, coalesce(v_biz_count, 0), coalesce(v_cust_count, 0);
end;
$$;

grant execute on function public.header_inbox_summary() to authenticated;
