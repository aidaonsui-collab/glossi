-- 20260414000008_create_quote_request.sql
--
-- create_quote_request(services, lat, lng, zip, radius, notes, earliest, latest)
--
-- The write side of the marketplace. A signed-in customer calls this to
-- post a new quote request; eligible businesses then see it via the
-- quote_requests_business_read_open RLS policy from migration 0006 and
-- respond with bids.
--
-- We wrap the insert in an RPC (instead of a plain postgrest .insert())
-- for three reasons:
--   1. geography(point) values are awkward to marshal through the
--      postgrest JSON path. Building the point inside SQL with
--      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography is the
--      canonical PostGIS approach and matches migration 0007.
--   2. We stamp customer_id from auth.uid() so the client can't forge it
--      (the quote_requests_customer_all RLS policy would reject a
--      mismatch anyway — belt + suspenders).
--   3. Returning the new row id in one round trip lets the server action
--      redirect straight to /account/quotes/<id> without a follow-up
--      SELECT.
--
-- SECURITY INVOKER so the caller's JWT still drives RLS. The auth.uid()
-- check at the top is a fast fail: anon users get a clean error instead
-- of tripping the policy later.

create or replace function public.create_quote_request(
  p_service_slugs text[],
  p_lat           double precision,
  p_lng           double precision,
  p_radius_miles  integer,
  p_zip           text default null,
  p_notes         text default null,
  p_earliest_date date default null,
  p_latest_date   date default null
)
returns uuid
language plpgsql
security invoker
set search_path = public, extensions
as $$
declare
  v_user_id uuid := auth.uid();
  v_request_id uuid;
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

  insert into public.quote_requests (
    customer_id,
    service_slugs,
    search_location,
    search_zip,
    radius_miles,
    notes,
    earliest_date,
    latest_date
  ) values (
    v_user_id,
    p_service_slugs,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography,
    p_zip,
    p_radius_miles,
    nullif(trim(p_notes), ''),
    p_earliest_date,
    p_latest_date
  )
  returning id into v_request_id;

  return v_request_id;
end;
$$;

-- Only authenticated users can create requests. Anon calls short-circuit
-- on the auth.uid() null check above, but an explicit execute revoke is
-- cleaner than relying on runtime failure.
revoke all on function
  public.create_quote_request(text[], double precision, double precision, integer, text, text, date, date)
  from public;

grant execute on function
  public.create_quote_request(text[], double precision, double precision, integer, text, text, date, date)
  to authenticated;
