-- 20260414000016_update_business.sql
--
-- update_business(p_business_id, name, bio, address, city, postal_code,
--                 lat, lng, phone, website, instagram, price_tier)
--
-- Edit-side counterpart to create_business (migration 0014). Owners
-- coming from /business/dashboard/edit call this to change display
-- name, bio, address, contact details, or price tier after
-- onboarding. Services are deliberately out of scope for this cut —
-- the business_services table can have multiple rows per slug for
-- multi-artist salons, so safe editing needs a per-row UI and its
-- own dedicated RPC. Ship the 80% first.
--
-- Slug is immutable. A name change would ripple through every
-- existing /business/<slug> bookmark and search result, so we treat
-- the slug as a permanent URL identity — the display name is what
-- changes on the card, the slug stays put.
--
-- Address edits always re-stamp the PostGIS location. The server
-- action geocodes the new ZIP before calling, same pattern
-- create_business uses — avoids duplicating the geocode table in
-- SQL and keeps the RPC focused on writes.
--
-- SECURITY INVOKER so the businesses_owner_update RLS policy from
-- migration 0006 still gates the write. The function adds its own
-- auth.uid() = owner_id check as defense in depth so an unauth'd
-- call short-circuits cleanly instead of falling through to a
-- policy failure deeper in the stack.

create or replace function public.update_business(
  p_business_id  uuid,
  p_name         text,
  p_bio          text,
  p_address      text,
  p_city         text,
  p_postal_code  text,
  p_lat          double precision,
  p_lng          double precision,
  p_phone        text,
  p_website      text,
  p_instagram    text,
  p_price_tier   text
)
returns uuid
language plpgsql
security invoker
set search_path = public, extensions
as $body$
declare
  v_user_id uuid := auth.uid();
  v_owner   uuid;
begin
  if v_user_id is null then
    raise exception 'not authenticated'
      using errcode = '42501';
  end if;

  if coalesce(trim(p_name), '') = '' then
    raise exception 'name is required' using errcode = '22023';
  end if;

  if p_price_tier not in ('$','$$','$$$','$$$$') then
    raise exception 'price_tier must be $, $$, $$$, or $$$$'
      using errcode = '22023';
  end if;

  -- Ownership check. RLS also enforces this but we want a clean
  -- error before we touch row data. Unknown-id case (nothing
  -- owned by this user with that id) falls through to the UPDATE
  -- which will match zero rows.
  select owner_id into v_owner
  from public.businesses
  where id = p_business_id;

  if v_owner is null then
    raise exception 'business not found'
      using errcode = '02000';
  end if;

  if v_owner <> v_user_id then
    raise exception 'not authorized to edit this business'
      using errcode = '42501';
  end if;

  update public.businesses
  set name         = p_name,
      bio_en       = p_bio,
      address_line1 = p_address,
      city         = p_city,
      postal_code  = p_postal_code,
      location     = extensions.ST_SetSRID(
                       extensions.ST_MakePoint(p_lng, p_lat),
                       4326
                     )::extensions.geography,
      phone        = p_phone,
      website      = p_website,
      instagram    = p_instagram,
      price_tier   = p_price_tier,
      updated_at   = now()
  where id = p_business_id
    and owner_id = v_user_id;

  return p_business_id;
end;
$body$;

revoke all on function
  public.update_business(
    uuid, text, text, text, text, text,
    double precision, double precision,
    text, text, text, text
  )
  from public;

grant execute on function
  public.update_business(
    uuid, text, text, text, text, text,
    double precision, double precision,
    text, text, text, text
  )
  to authenticated;
