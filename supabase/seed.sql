-- supabase/seed.sql
--
-- Dev seed data. Idempotent — safe to re-run. Apply via:
--   supabase db reset --linked      # wipes + re-applies migrations + seed
--   or paste into the SQL editor for a live project
--
-- Seeds one placeholder owner in auth.users (password `seedpass123`), four
-- published businesses — one per Texas launch market — and a starter set
-- of business_services so the /search page has something to render.

-- -----------------------------------------------------------------------
-- 1. Seed user. crypt() comes from pgcrypto, which migration 0001
--    installs into the extensions schema.
-- -----------------------------------------------------------------------
-- The text-column defaults below are load-bearing: GoTrue's Go row scanner
-- declares confirmation_token / recovery_token / email_change* / phone_change*
-- / reauthentication_token as plain `string`, not sql.NullString, so any NULL
-- in those columns makes `auth.getUser()` crash with a masked
-- "Database error querying schema" 500 before it ever checks the password.
-- supabase.auth.signUp() fills them with '' for you; a direct INSERT has to
-- do it explicitly.
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  phone_change,
  phone_change_token,
  reauthentication_token
)
values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'seed@glossi.test',
  extensions.crypt('seedpass123', extensions.gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Glossi Seed Owner"}'::jsonb,
  false,
  '', '', '', '', '', '', '', ''
)
on conflict (id) do nothing;

-- Modern Supabase GoTrue looks users up by (provider, provider_id) in the
-- `auth.identities` table — not by email in `auth.users` directly. A user
-- without a matching identity row can exist in auth.users but silently
-- fails sign-in with a masked "Database error querying schema" error.
-- When you use the regular `supabase.auth.signUp()` API this row is
-- created for you; when you INSERT directly into auth.users you have to
-- create it yourself.
insert into auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'email',
  jsonb_build_object(
    'sub',            '00000000-0000-0000-0000-000000000001',
    'email',          'seed@glossi.test',
    'email_verified', true,
    'phone_verified', false
  ),
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do nothing;

-- -----------------------------------------------------------------------
-- 2. Four published businesses — one per metro. Locations are the same
--    centroids src/lib/geocode.ts uses, so a ZIP in any launch market
--    will find the matching business within 15 mi.
-- -----------------------------------------------------------------------
insert into public.businesses (
  id, owner_id, slug, name, bio_en, bio_es,
  address_line1, city, state, postal_code,
  location,
  price_tier, deposit_pct, cancellation_hours,
  published, verified
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'tulip-nail-bar-dallas',
    'Tulip Nail Bar',
    'Gel, dip, and nail art by a team of Dallas-born pros.',
    'Gel, dip y arte de uñas por un equipo de profesionales de Dallas.',
    '1905 N Henderson Ave', 'Dallas', 'TX', '75206',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-96.7700, 32.8310), 4326)::extensions.geography,
    '$$', 20, 24, true, true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000001',
    'lush-lash-studio-austin',
    'Lush Lash Studio',
    'Classic, hybrid, and volume lash extensions on South Congress.',
    'Extensiones de pestañas clásicas, híbridas y de volumen en South Congress.',
    '1200 S Congress Ave', 'Austin', 'TX', '78704',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-97.7660, 30.2423), 4326)::extensions.geography,
    '$$', 25, 24, true, true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000001',
    'petal-and-polish-sa',
    'Petal & Polish',
    'Facials, brows, and everyday glam in Alamo Heights.',
    'Faciales, cejas y maquillaje para todos los días en Alamo Heights.',
    '5100 Broadway St', 'San Antonio', 'TX', '78209',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-98.4660, 29.4720), 4326)::extensions.geography,
    '$', 15, 24, true, true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000001',
    'glow-spa-mcallen',
    'Glow Spa McAllen',
    'Microblading, ombré brows, lip blush, and med spa services.',
    'Microblading, cejas ombré, labios y servicios de spa médico.',
    '2200 S 10th St', 'McAllen', 'TX', '78503',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-98.2170, 26.1960), 4326)::extensions.geography,
    '$$', 25, 48, true, true
  )
on conflict (id) do nothing;

-- -----------------------------------------------------------------------
-- 3. Services each business offers. Prices are in cents.
-- -----------------------------------------------------------------------
insert into public.business_services (
  id, business_id, service_slug, name, duration_minutes, price_cents, active
)
values
  -- Tulip Nail Bar
  ('a1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'nails', 'Gel Manicure', 60, 4500, true),
  ('a1111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'nails', 'Dip Powder Full Set', 90, 6000, true),

  -- Lush Lash Studio
  ('a2222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'lashes-brows', 'Classic Full Set', 120, 14000, true),
  ('a2222222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
   'lashes-brows', 'Volume Full Set',  150, 18000, true),

  -- Petal & Polish
  ('a3333333-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333',
   'facials', 'Signature Facial', 60, 8500, true),
  ('a3333333-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333',
   'makeup', 'Soft Glam', 75, 9500, true),
  ('a3333333-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333',
   'lashes-brows', 'Brow Lamination', 45, 6500, true),

  -- Glow Spa McAllen
  ('a4444444-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444',
   'lashes-brows', 'Microblading', 180, 45000, true),
  ('a4444444-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444',
   'facials', 'Hydrafacial', 60, 15000, true),
  ('a4444444-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444',
   'med-spa', 'Botox Consultation', 30, 10000, true),
  ('a4444444-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444',
   'nails', 'Gel Manicure', 60, 5000, true)
on conflict (id) do nothing;
