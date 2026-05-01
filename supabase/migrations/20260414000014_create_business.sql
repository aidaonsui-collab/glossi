-- 20260414000014_create_business.sql
--
-- create_business(slug, name, bio, address, city, postal_code, lat, lng,
--                 phone, website, instagram, price_tier,
--                 service_slugs[], service_prices_cents[], service_durations[])
--
-- The write side of business onboarding. A signed-in owner calls this
-- from /business/new; the RPC inserts the business row (PostGIS point
-- constructed in SQL from lat/lng), bulk-inserts their starting service
-- catalog, and flips profiles.is_business so future UI can branch on
-- "this account runs a salon".
--
-- Why one RPC instead of three separate client calls:
--
--   1. geography(point, 4326) values don't marshal through the
--      postgrest JSON path cleanly — building the point inside SQL
--      with ST_SetSRID(ST_MakePoint(lng, lat), 4326) matches the
--      same pattern migration 0008 uses for quote_requests.
--
--   2. businesses + business_services + profiles is three writes.
--      Doing them in one transaction means a failure halfway through
--      doesn't leave an orphan business with no services (which
--      would then be invisible to the dashboard forever).
--
--   3. Returning the new business_id in one round trip lets the
--      server action redirect straight to /business/dashboard without
--      a follow-up SELECT.
--
-- SECURITY INVOKER so the caller's JWT still drives RLS. The
-- businesses_owner_insert policy from migration 0006 enforces
-- owner_id = auth.uid(); we stamp owner_id from auth.uid() inside
-- the function so the client can't forge it either (belt +
-- suspenders, same as create_quote_request).
--
-- Service names are sourced from service_catalog.label_en so owners
-- don't have to retype the canonical label on onboarding; they can
-- rename per-service rows from the dashboard later when that UI
-- ships.
--
-- ---------------------------------------------------------------------
-- Dollar-quoting note: the function body uses $body$ delimiters, NOT
-- the default $$. The price_tier CHECK list includes the literals
-- '$$$' and '$$$$', and inside a $$...$$ block Postgres's lexer
-- greedily scans for the next $$ — so '$$$' closes the outer
-- dollar-quoted string at character 2 and blows up the parse. A
-- uniquely-named tag like $body$ sidesteps the collision entirely.
-- ---------------------------------------------------------------------

-- Drop before recreating so parameter-signature changes from earlier
-- revisions of this migration get cleanly replaced. CREATE OR REPLACE
-- FUNCTION can't change a function's argument list in place.
drop function if exists public.create_business(
  text, text, text, text, text, text, double precision, double precision,
  text, text, text, text, text[], integer[], integer[]
);

create or replace function public.create_business(
  p_slug                  text,
  p_name                  text,
  p_bio                   text,
  p_address               text,
  p_city                  text,
  p_postal_code           text,
  p_lat                   double precision,
  p_lng                   double precision,
  p_phone                 text,
  p_website               text,
  p_instagram             text,
  p_price_tier            text,
  p_service_slugs         text[],
  p_service_prices_cents  integer[],
  p_service_durations     integer[]
)
returns uuid
language plpgsql
security invoker
set search_path = public, extensions
as $body$
declare
  v_user_id     uuid := auth.uid();
  v_business_id uuid;
  v_count       integer;
  i             integer;
begin
  if v_user_id is null then
    raise exception 'not authenticated'
      using errcode = '42501';
  end if;

  if coalesce(trim(p_name), '') = '' then
    raise exception 'name is required' using errcode = '22023';
  end if;

  if coalesce(trim(p_slug), '') = '' then
    raise exception 'slug is required' using errcode = '22023';
  end if;

  if p_price_tier not in ('$','$$','$$$','$$$$') then
    raise exception 'price_tier must be $, $$, $$$, or $$$$'
      using errcode = '22023';
  end if;

  if coalesce(array_length(p_service_slugs, 1), 0) = 0 then
    raise exception 'at least one service is required'
      using errcode = '22023';
  end if;

  -- Single-business per owner for MVP — reject a second onboarding
  -- attempt at the RPC layer. The page and server action both guard
  -- this too; this is the final defense-in-depth check.
  select count(*) into v_count
  from public.businesses
  where owner_id = v_user_id and published = true;

  if v_count > 0 then
    raise exception 'you already have a published business'
      using errcode = '22023';
  end if;

  insert into public.businesses (
    owner_id, slug, name, bio_en, address_line1, city, state, postal_code,
    location, phone, website, instagram, price_tier, published, verified
  ) values (
    v_user_id, p_slug, p_name, p_bio, p_address, p_city, 'TX', p_postal_code,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography,
    p_phone, p_website, p_instagram, p_price_tier, true, false
  )
  returning id into v_business_id;

  -- Flip the profile marker so future UI can branch on "runs a salon".
  -- profiles_update_own RLS already scopes this to the caller's row.
  update public.profiles
  set is_business = true
  where id = v_user_id;

  -- Loop-based bulk insert. One INSERT...SELECT per service slug, with
  -- the canonical label_en from service_catalog used as the display
  -- name so owners don't retype anything on onboarding. A forged slug
  -- that doesn't match the catalog silently drops (the join returns
  -- zero rows); the form only surfaces catalog-backed chips so this
  -- isn't reachable from the UI.
  for i in 1..coalesce(array_length(p_service_slugs, 1), 0)
  loop
    insert into public.business_services (
      business_id, service_slug, name, price_cents, duration_minutes, active
    )
    select
      v_business_id,
      p_service_slugs[i],
      sc.label_en,
      p_service_prices_cents[i],
      p_service_durations[i],
      true
    from public.service_catalog sc
    where sc.slug = p_service_slugs[i];
  end loop;

  return v_business_id;
end;
$body$;

revoke all on function
  public.create_business(
    text, text, text, text, text, text,
    double precision, double precision,
    text, text, text, text,
    text[], integer[], integer[]
  )
  from public;

grant execute on function
  public.create_business(
    text, text, text, text, text, text,
    double precision, double precision,
    text, text, text, text,
    text[], integer[], integer[]
  )
  to authenticated;
