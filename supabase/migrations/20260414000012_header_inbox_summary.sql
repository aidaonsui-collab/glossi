-- 20260414000012_header_inbox_summary.sql
--
-- Global-nav inbox badge backing RPC.
--
-- The business-side header shows a little inbox icon with an unread
-- count (requests/offers the owner hasn't responded to yet). HeaderAuth
-- is rendered on every page, so we need this in ONE roundtrip instead
-- of a "fetch first business + fetch count" two-step.
--
-- Returns:
--   - zero rows   → caller doesn't own a business; HeaderAuth renders
--                   the default customer nav (no inbox icon).
--   - one row     → caller owns at least one business. The row carries
--                   the first business's slug (for the link target)
--                   plus the unread count.
--
-- Unread = open + unexpired requests the business CAN bid on that
-- don't already have an active bid from this business. This matches
-- the "needs action" rows in business_inbox; we exclude already_bid
-- rows because those are "sent, waiting on the customer" state.
--
-- SECURITY INVOKER so RLS still runs on every read — the function
-- doesn't escalate privileges, it just bundles the two queries into
-- one call site so the header isn't making two round trips per page.

create or replace function public.header_inbox_summary()
returns table (
  business_slug text,
  unread_count  integer
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
  v_count      integer;
begin
  if v_user_id is null then
    return;
  end if;

  -- Pick the owner's first business — same "first by created_at"
  -- convention business_inbox uses. Multi-business selector is
  -- Session 4 work.
  select b.id, b.slug, b.location
    into v_biz_id, v_biz_slug, v_location
  from public.businesses b
  where b.owner_id = v_user_id
  order by b.created_at asc
  limit 1;

  if v_biz_id is null then
    return;
  end if;

  -- The business's active service catalog, distinct slugs. Used for
  -- the array-overlap filter on broadcasts.
  select array_agg(distinct bs.service_slug) into v_services
  from public.business_services bs
  where bs.business_id = v_biz_id and bs.active = true;

  -- Count open requests this business can act on AND hasn't already
  -- bid on. Same visibility rules as business_inbox but wrapped in
  -- a NOT EXISTS for the active-bid exclusion.
  select count(*)::integer into v_count
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

  return query select v_biz_slug, coalesce(v_count, 0);
end;
$$;

grant execute on function public.header_inbox_summary() to authenticated;
