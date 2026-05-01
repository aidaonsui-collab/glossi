-- 20260414000004_init_businesses.sql
--
-- Businesses, their artists (business_providers), and the services they
-- offer (business_services). Texas-only at launch — enforced via CHECK.
--
-- The `business_providers` table is the Wildside-Nails-style multi-artist
-- support: booth-rent salons where each artist has their own brand, pricing
-- tiers ("Rising" / "Advanced" / "Master"), and instagram. Every price
-- quote carries the provider that priced it.

-- -----------------------------------------------------------------------
-- businesses
-- -----------------------------------------------------------------------
create table if not exists public.businesses (
  id                     uuid primary key default gen_random_uuid(),
  owner_id               uuid not null references auth.users(id) on delete cascade,
  slug                   text unique not null,
  name                   text not null,
  bio_en                 text,
  bio_es                 text,
  hero_image_url         text,

  -- Location
  address_line1          text not null,
  address_line2          text,
  city                   text not null,
  state                  text not null default 'TX' check (state = 'TX'),
  postal_code            text not null,
  -- Fully-qualified reference to PostGIS geography type. We install PostGIS
  -- in the `extensions` schema (see migration 0001), and `supabase db push`
  -- doesn't always inherit the search_path that would let us omit the
  -- schema qualifier. Explicit is safer than implicit here.
  location               extensions.geography(point, 4326) not null,

  -- Contact
  phone                  text,
  website                text,
  instagram              text,
  price_tier             text check (price_tier in ('$','$$','$$$','$$$$')),

  -- Deposit policy. Glossi caps first-booking deposits at 25% — this is
  -- our explicit differentiator vs. Square Go, where some merchants require
  -- 100% pre-pay at checkout.
  deposit_cents          int not null default 0 check (deposit_cents >= 0),
  deposit_pct            int not null default 0 check (deposit_pct between 0 and 25),

  -- Cancellation policy. Surfaced on the quote card *before* the customer
  -- picks a time — another Square Go pain point (theirs shows at checkout).
  cancellation_hours     int not null default 24 check (cancellation_hours >= 0),
  cancellation_policy_en text,
  cancellation_policy_es text,

  published              boolean not null default false,
  verified               boolean not null default false,  -- Glossi team verified
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists businesses_location_gix
  on public.businesses using gist (location);
create index if not exists businesses_city_published_idx
  on public.businesses (city) where published = true;
create index if not exists businesses_owner_idx
  on public.businesses (owner_id);

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------
-- business_providers — multi-artist booth-rent support
-- -----------------------------------------------------------------------
create table if not exists public.business_providers (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references public.businesses(id) on delete cascade,
  display_name  text not null,
  bio           text,
  tier          text,                    -- 'Rising' | 'Advanced' | 'Master'
  avatar_url    text,
  instagram     text,
  active        boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists business_providers_business_idx
  on public.business_providers (business_id);

-- -----------------------------------------------------------------------
-- business_services — what's offered, optionally scoped to a provider
-- -----------------------------------------------------------------------
create table if not exists public.business_services (
  id                uuid primary key default gen_random_uuid(),
  business_id       uuid not null references public.businesses(id) on delete cascade,
  provider_id       uuid references public.business_providers(id) on delete cascade,
  service_slug      text not null references public.service_catalog(slug),
  name              text not null,
  description       text,
  duration_minutes  int  not null check (duration_minutes > 0),
  price_cents       int  check (price_cents >= 0),
  price_max_cents   int  check (price_max_cents is null or price_max_cents >= price_cents),
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

create index if not exists business_services_business_idx
  on public.business_services (business_id);
create index if not exists business_services_slug_active_idx
  on public.business_services (service_slug) where active = true;
