-- 20260414000001_init_extensions.sql
--
-- Postgres extensions Glossi depends on.
--   postgis  → geography(Point, 4326) + ST_DWithin for radius search
--   pgcrypto → gen_random_uuid() for table primary keys
--
-- Both live in the `extensions` schema per Supabase convention so they're
-- reachable from the default search_path but don't clutter `public`.

create extension if not exists "postgis" with schema "extensions";
create extension if not exists "pgcrypto" with schema "extensions";
