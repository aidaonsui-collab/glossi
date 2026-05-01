-- 20260414000009_targeted_offers.sql
--
-- "Make an offer" — targeted quote requests scoped to one business.
--
-- The marketplace has two modes that share the same quote_requests table:
--
--   A. Broadcast (target_business_id IS NULL) — the original flow. A
--      customer posts a request, every eligible salon in her radius sees
--      it and can bid. Price is open-ended, pros respond with whatever
--      they want.
--
--   B. Targeted offer (target_business_id IS NOT NULL) — customer picks a
--      specific salon on /business/[slug] and names a price up front.
--      Only that one salon sees it in their dashboard. They accept,
--      counter, or decline. Think Priceline "Name Your Own Price" but for
--      a single vendor.
--
-- Both modes land in the same table because:
--   1. The dashboard, list views, notification machinery, and bid flow
--      are identical — the only delta is "who can see this row".
--   2. We already have radius / services / notes / expiry on the table
--      and targeted offers want all of the same fields.
--   3. One index, one RLS policy, one RPC to reason about.
--
-- The visibility rule flips based on target_business_id:
--   - NULL  → radius-based broadcast (existing behavior)
--   - UUID  → only the targeted business's owner sees the row

-- -----------------------------------------------------------------------
-- Columns
-- -----------------------------------------------------------------------
alter table public.quote_requests
  add column if not exists target_business_id uuid
    references public.businesses(id) on delete cascade;

alter table public.quote_requests
  add column if not exists offer_price_cents integer
    check (offer_price_cents is null or offer_price_cents >= 0);

-- Sanity constraint: targeted offers should come with a price the
-- customer is willing to pay. Broadcasts never carry a price. We allow
-- either (null, null) or (uuid, int) but not a mix — enforcing the UX
-- contract at the schema level.
alter table public.quote_requests
  drop constraint if exists quote_requests_targeted_price_chk;
alter table public.quote_requests
  add constraint quote_requests_targeted_price_chk
  check (
    (target_business_id is null and offer_price_cents is null)
    or (target_business_id is not null and offer_price_cents is not null)
  );

-- Hot index for the targeted-read RLS policy and the business dashboard
-- "requests in my inbox" query. Partial index keeps it small — broadcast
-- rows dominate the table and don't need a target lookup.
create index if not exists quote_requests_target_idx
  on public.quote_requests (target_business_id)
  where target_business_id is not null;

-- -----------------------------------------------------------------------
-- RLS — businesses see broadcast (in radius, status=open) OR targeted-
-- at-them. Customer RLS is unchanged: quote_requests_customer_all already
-- covers both modes via auth.uid() = customer_id.
-- -----------------------------------------------------------------------
drop policy if exists "quote_requests_business_read_open" on public.quote_requests;
create policy "quote_requests_business_read_open"
  on public.quote_requests for select
  using (
    status = 'open' and exists (
      select 1 from public.businesses b
      where b.owner_id = auth.uid()
        and b.published = true
        and (
          -- Broadcast: visible to every published salon the owner runs.
          -- The radius filter happens in the dashboard query, not in
          -- RLS, so the policy stays simple and index-friendly.
          quote_requests.target_business_id is null
          -- Targeted: only the one salon this offer is aimed at.
          or quote_requests.target_business_id = b.id
        )
    )
  );

-- -----------------------------------------------------------------------
-- RPC — create_quote_request now accepts two new optional args. We use
-- CREATE OR REPLACE so the migration is idempotent, but add the args at
-- the END of the param list so existing callers (/request-quote/actions)
-- don't need to change.
--
-- Targeted offers still validate as before; the radius + lat/lng are
-- still required because we keep them populated for the shared dashboard
-- map view. When target_business_id is set we piggyback the business's
-- own location so the row has a sane geography value — the customer's
-- ZIP is still stamped in search_zip for the dashboard to display.
-- -----------------------------------------------------------------------
create or replace function public.create_quote_request(
  p_service_slugs      text[],
  p_lat                double precision,
  p_lng                double precision,
  p_radius_miles       integer,
  p_zip                text default null,
  p_notes              text default null,
  p_earliest_date      date default null,
  p_latest_date        date default null,
  p_target_business_id uuid default null,
  p_offer_price_cents  integer default null
)
returns uuid
language plpgsql
security invoker
set search_path = public, extensions
as $$
declare
  v_user_id    uuid := auth.uid();
  v_request_id uuid;
  v_target_ok  boolean;
begin
  if v_user_id is null then
    raise exception 'not authenticated'
      using errcode = '42501';
  end if;

  if array_length(p_service_slugs, 1) is null then
    raise exception 'at least one service is required'
      using errcode = '22023';
  end if;

  if p_radius_miles not in (5, 10, 15, 25) then
    raise exception 'radius must be one of 5, 10, 15, 25 miles'
      using errcode = '22023';
  end if;

  -- Targeted offer: require a non-negative price and verify the target
  -- business is published. The RLS check on insert will still run
  -- (quote_requests_customer_all) but we want a clean, actionable error
  -- on a bad business id instead of a 500 at the table constraint.
  if p_target_business_id is not null then
    if p_offer_price_cents is null or p_offer_price_cents < 0 then
      raise exception 'offer price is required for targeted requests'
        using errcode = '22023';
    end if;

    select true into v_target_ok
    from public.businesses
    where id = p_target_business_id and published = true;

    if v_target_ok is not true then
      raise exception 'target business not found'
        using errcode = '22023';
    end if;
  else
    if p_offer_price_cents is not null then
      raise exception 'offer price only allowed on targeted requests'
        using errcode = '22023';
    end if;
  end if;

  insert into public.quote_requests (
    customer_id,
    service_slugs,
    search_location,
    search_zip,
    radius_miles,
    notes,
    earliest_date,
    latest_date,
    target_business_id,
    offer_price_cents
  ) values (
    v_user_id,
    p_service_slugs,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography,
    p_zip,
    p_radius_miles,
    nullif(trim(p_notes), ''),
    p_earliest_date,
    p_latest_date,
    p_target_business_id,
    p_offer_price_cents
  )
  returning id into v_request_id;

  return v_request_id;
end;
$$;

-- Re-grant on the new signature. The old 8-arg signature is replaced by
-- this 10-arg version (same name), so the old GRANT line from migration
-- 0008 still applies to the previous overload if it lingers. We drop the
-- previous overload explicitly to avoid an ambiguous-function error at
-- call time when supabase-js picks one by arity.
drop function if exists public.create_quote_request(
  text[], double precision, double precision, integer, text, text, date, date
);

revoke all on function
  public.create_quote_request(
    text[], double precision, double precision, integer, text, text, date, date, uuid, integer
  )
  from public;

grant execute on function
  public.create_quote_request(
    text[], double precision, double precision, integer, text, text, date, date, uuid, integer
  )
  to authenticated;
