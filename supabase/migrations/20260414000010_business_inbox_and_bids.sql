-- 20260414000010_business_inbox_and_bids.sql
--
-- Business dashboard backing RPCs.
--
-- Three verbs the dashboard needs, plus one read:
--   - business_inbox(p_business_id)        → unified feed of actionable rows
--   - submit_bid(...)                      → create/replace a bid
--   - withdraw_bid(p_bid_id)               → owner retracts a bid
--   - decline_offer(p_request_id, p_biz)   → decline a targeted "make an offer"
--
-- Visibility is still gated by migration 0006 + 0009 RLS — these RPCs are
-- all SECURITY INVOKER so a compromised browser JWT can't reach across
-- businesses. Every function also re-verifies ownership explicitly as a
-- belt-and-suspenders check, which also lets us raise clean 42501 errors
-- instead of tripping a policy later.

-- =======================================================================
-- business_inbox — what can the owner act on right now?
-- =======================================================================
--
-- Returns open quote_requests that are either:
--   (a) targeted at this business (qr.target_business_id = p_business_id), or
--   (b) broadcast (qr.target_business_id IS NULL) AND
--       - within qr.radius_miles of the business's location, AND
--       - at least one service slug overlaps with what the business offers.
--
-- Ordering: targeted offers first (they're higher-intent — the customer
-- already chose us), then newest broadcasts. The `already_bid` flag lets
-- the UI render a subtle "Bid submitted" state instead of repeating the
-- same bid form.
create or replace function public.business_inbox(p_business_id uuid)
returns table (
  request_id          uuid,
  created_at          timestamptz,
  expires_at          timestamptz,
  service_slugs       text[],
  search_zip          text,
  radius_miles        int,
  notes               text,
  target_business_id  uuid,
  offer_price_cents   int,
  distance_m          double precision,
  already_bid         boolean,
  current_bid_cents   int
)
language plpgsql
stable
security invoker
set search_path = public, extensions
as $$
declare
  v_user_id  uuid := auth.uid();
  v_location extensions.geography;
  v_services text[];
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  -- Ownership + location lookup. NULL location means "not owned by this
  -- user" either because the business doesn't exist or because owner_id
  -- doesn't match — either way, no inbox for you.
  select b.location into v_location
  from public.businesses b
  where b.id = p_business_id and b.owner_id = v_user_id;

  if v_location is null then
    raise exception 'business not found or not owned'
      using errcode = '42501';
  end if;

  -- The business's active service catalog, collapsed to distinct slugs.
  -- Used for the array-overlap filter on broadcasts below.
  select array_agg(distinct bs.service_slug)
    into v_services
  from public.business_services bs
  where bs.business_id = p_business_id and bs.active = true;

  return query
  select
    qr.id,
    qr.created_at,
    qr.expires_at,
    qr.service_slugs,
    qr.search_zip,
    qr.radius_miles,
    qr.notes,
    qr.target_business_id,
    qr.offer_price_cents,
    extensions.ST_Distance(qr.search_location, v_location)::double precision
      as distance_m,
    exists (
      select 1 from public.quote_bids qb
      where qb.request_id = qr.id
        and qb.business_id = p_business_id
        and qb.status = 'active'
    ) as already_bid,
    (
      select qb.price_cents from public.quote_bids qb
      where qb.request_id = qr.id
        and qb.business_id = p_business_id
        and qb.status = 'active'
      order by qb.created_at desc
      limit 1
    ) as current_bid_cents
  from public.quote_requests qr
  where qr.status = 'open'
    and qr.expires_at > now()
    and (
      -- Targeted offers are visible regardless of the broadcast service
      -- overlap — the customer already chose this business.
      qr.target_business_id = p_business_id
      or (
        qr.target_business_id is null
        and extensions.ST_DWithin(
          qr.search_location,
          v_location,
          qr.radius_miles * 1609.34
        )
        and qr.service_slugs && coalesce(v_services, array[]::text[])
      )
    )
  order by
    -- Targeted first so "someone's waiting on YOU specifically" floats
    -- above the broadcast firehose.
    (qr.target_business_id = p_business_id) desc,
    qr.created_at desc
  limit 100;
end;
$$;

grant execute on function public.business_inbox(uuid)
  to authenticated;

-- =======================================================================
-- submit_bid — create or replace this business's active bid on a request
-- =======================================================================
--
-- Idempotent by design: if the business already has an active bid on
-- this request, we withdraw it and insert a fresh one. Simpler than
-- trying to UPDATE in place because:
--   1. The unique (request_id, business_id, provider_id) constraint from
--      migration 0005 treats NULL providers as distinct, so an ON CONFLICT
--      upsert wouldn't actually fire on the common "no specific artist"
--      path.
--   2. The withdrawn bid stays in the table as an audit trail of price
--      changes — useful for the "you raised your bid twice" analytics
--      we'll want later.
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
    raise exception 'estimated_duration must be positive'
      using errcode = '22023';
  end if;

  -- Business ownership.
  if not exists (
    select 1 from public.businesses
    where id = p_business_id and owner_id = v_user_id
  ) then
    raise exception 'business not owned' using errcode = '42501';
  end if;

  -- Request must exist and still be open. Also re-checks RLS visibility —
  -- if the owner can't read the request via the business_read_open policy
  -- the SELECT returns no rows and we raise a clean "not found" error.
  select qr.status into v_request_status
  from public.quote_requests qr
  where qr.id = p_request_id;

  if v_request_status is null then
    raise exception 'request not found' using errcode = '22023';
  end if;

  if v_request_status <> 'open' then
    raise exception 'request is no longer accepting bids'
      using errcode = '22023';
  end if;

  -- Retire any existing active bid from this business on this request,
  -- regardless of provider_id. UPSERT doesn't quite work here — see the
  -- header comment for the NULL-provider rationale.
  update public.quote_bids
     set status = 'withdrawn'
   where request_id = p_request_id
     and business_id = p_business_id
     and status = 'active';

  insert into public.quote_bids (
    request_id,
    business_id,
    provider_id,
    price_cents,
    estimated_duration,
    earliest_slot,
    message,
    status
  ) values (
    p_request_id,
    p_business_id,
    p_provider_id,
    p_price_cents,
    p_estimated_duration,
    p_earliest_slot,
    nullif(trim(p_message), ''),
    'active'
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

-- =======================================================================
-- withdraw_bid — retract an active bid
-- =======================================================================
create or replace function public.withdraw_bid(p_bid_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  update public.quote_bids qb
     set status = 'withdrawn'
   where qb.id = p_bid_id
     and qb.status = 'active'
     and exists (
       select 1 from public.businesses b
       where b.id = qb.business_id and b.owner_id = auth.uid()
     );

  if not found then
    raise exception 'bid not found or not yours'
      using errcode = '42501';
  end if;
end;
$$;

grant execute on function public.withdraw_bid(uuid)
  to authenticated;

-- =======================================================================
-- decline_offer — reject a targeted "make an offer" request
-- =======================================================================
--
-- Only works on targeted offers (target_business_id matches), and only
-- when the caller owns the targeted business. Flips the request to
-- 'closed' so it drops out of the inbox feed immediately.
create or replace function public.decline_offer(
  p_request_id  uuid,
  p_business_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  update public.quote_requests qr
     set status = 'closed'
   where qr.id = p_request_id
     and qr.target_business_id = p_business_id
     and qr.status = 'open'
     and exists (
       select 1 from public.businesses b
       where b.id = p_business_id and b.owner_id = auth.uid()
     );

  if not found then
    raise exception 'offer not found or not yours to decline'
      using errcode = '42501';
  end if;
end;
$$;

grant execute on function public.decline_offer(uuid, uuid)
  to authenticated;
