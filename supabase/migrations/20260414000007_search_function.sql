-- 20260414000007_search_function.sql
--
-- search_businesses(lat, lng, radius_m, service_slugs[])
--
-- The read side of the marketplace. Given a point and a list of services,
-- return every published business within `radius_m` meters that offers at
-- least one of the requested services, ordered by distance. Each row also
-- includes the cheapest active price_cents for any of the matching services
-- so the /search UI can show a "starts at $X" hint before the customer
-- actually requests a quote.
--
-- Notes:
--  - SECURITY INVOKER so the existing RLS policy `businesses_public_read`
--    still gates who can see what. The function does not bypass RLS.
--  - We build the probe point with `ST_SetSRID(ST_MakePoint(lng, lat), 4326)`
--    and cast to `geography` so distance is in meters, not degrees.
--  - extensions.* schema qualifiers are deliberate (see migrations 0001 +
--    0004 for the rationale). Don't remove them.

create or replace function public.search_businesses(
  p_lat           double precision,
  p_lng           double precision,
  p_radius_m      integer,
  p_service_slugs text[]
)
returns table (
  id              uuid,
  slug            text,
  name            text,
  city            text,
  price_tier      text,
  hero_image_url  text,
  distance_m      double precision,
  min_price_cents integer
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  with probe as (
    select
      extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography as g
  )
  select
    b.id,
    b.slug,
    b.name,
    b.city,
    b.price_tier,
    b.hero_image_url,
    extensions.ST_Distance(b.location, probe.g)::double precision as distance_m,
    min(bs.price_cents)::int as min_price_cents
  from public.businesses b
  join public.business_services bs
    on bs.business_id = b.id
   and bs.active = true
   and bs.service_slug = any(p_service_slugs)
  cross join probe
  where
    b.published = true
    and extensions.ST_DWithin(b.location, probe.g, p_radius_m)
  group by b.id, probe.g
  order by distance_m asc
  limit 60;
$$;

-- Supabase anon / authenticated roles don't inherit public function execute
-- privileges by default. Grant explicitly so .rpc() calls work from the
-- browser client and from our server components.
grant execute on function
  public.search_businesses(double precision, double precision, integer, text[])
  to anon, authenticated;
