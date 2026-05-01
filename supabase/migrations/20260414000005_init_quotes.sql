-- 20260414000005_init_quotes.sql
--
-- The bidding / quote-first marketplace: customers post a request, eligible
-- businesses respond with a price, customer accepts one → booking is born.
-- This is the core differentiator vs. Square Go's fixed-price model.

-- -----------------------------------------------------------------------
-- quote_requests — customer asks for pricing on one or more services
-- -----------------------------------------------------------------------
create table if not exists public.quote_requests (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid not null references auth.users(id) on delete cascade,
  service_slugs    text[] not null check (array_length(service_slugs, 1) > 0),
  -- See migration 0004 for why this is fully qualified as extensions.geography.
  search_location  extensions.geography(point, 4326) not null,
  search_zip       text,
  radius_miles     int not null check (radius_miles in (5, 10, 15, 25)),
  notes            text,
  earliest_date    date,
  latest_date      date,
  status           text not null default 'open'
                   check (status in ('open','closed','expired','booked')),
  expires_at       timestamptz not null default (now() + interval '72 hours'),
  created_at       timestamptz not null default now()
);

create index if not exists quote_requests_location_gix
  on public.quote_requests using gist (search_location);
create index if not exists quote_requests_customer_idx
  on public.quote_requests (customer_id);
create index if not exists quote_requests_status_expires_idx
  on public.quote_requests (status, expires_at);

-- -----------------------------------------------------------------------
-- quote_bids — business (optionally an artist) responds with a price
-- -----------------------------------------------------------------------
create table if not exists public.quote_bids (
  id                  uuid primary key default gen_random_uuid(),
  request_id          uuid not null references public.quote_requests(id) on delete cascade,
  business_id         uuid not null references public.businesses(id) on delete cascade,
  provider_id         uuid references public.business_providers(id) on delete set null,
  price_cents         int not null check (price_cents >= 0),
  estimated_duration  int not null check (estimated_duration > 0),
  earliest_slot       timestamptz,
  message             text,
  status              text not null default 'active'
                      check (status in ('active','withdrawn','accepted','rejected','expired')),
  created_at          timestamptz not null default now(),
  -- One bid per (request, business, provider) combo. A business with two
  -- artists can still submit two different bids on the same request.
  unique (request_id, business_id, provider_id)
);

create index if not exists quote_bids_request_idx  on public.quote_bids (request_id);
create index if not exists quote_bids_business_idx on public.quote_bids (business_id);

-- -----------------------------------------------------------------------
-- bookings — once a customer accepts a bid
-- -----------------------------------------------------------------------
create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  bid_id         uuid not null references public.quote_bids(id),
  customer_id    uuid not null references auth.users(id),
  business_id    uuid not null references public.businesses(id),
  provider_id    uuid references public.business_providers(id),
  scheduled_at   timestamptz not null,
  duration_min   int not null check (duration_min > 0),
  price_cents    int not null check (price_cents >= 0),
  deposit_cents  int not null default 0 check (deposit_cents >= 0),
  status         text not null default 'confirmed'
                 check (status in ('confirmed','completed','cancelled','no_show')),
  cancelled_at   timestamptz,
  cancelled_by   uuid references auth.users(id),
  created_at     timestamptz not null default now()
);

create index if not exists bookings_customer_idx
  on public.bookings (customer_id);
create index if not exists bookings_business_schedule_idx
  on public.bookings (business_id, scheduled_at);
