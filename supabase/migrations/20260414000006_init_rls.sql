-- 20260414000006_init_rls.sql
--
-- Row Level Security. Default: deny everything, then grant read/write per
-- role. `auth.uid()` returns the signed-in user from the JWT; when it's
-- null (anon requests) the policy fails closed.
--
-- Mental model:
--   public readers → can see published businesses, their providers, their
--                    active services, and the service catalog. Nothing else.
--   signed-in user → can CRUD their own profile, quote requests, and read
--                    bids on their own requests + their own bookings.
--   business owner → full CRUD on their own business rows and children.

alter table public.service_catalog    enable row level security;
alter table public.profiles           enable row level security;
alter table public.businesses         enable row level security;
alter table public.business_providers enable row level security;
alter table public.business_services  enable row level security;
alter table public.quote_requests     enable row level security;
alter table public.quote_bids         enable row level security;
alter table public.bookings           enable row level security;

-- =======================================================================
-- service_catalog — public read of active entries, no writes from client
-- =======================================================================
drop policy if exists "service_catalog_public_read" on public.service_catalog;
create policy "service_catalog_public_read"
  on public.service_catalog for select
  using (active = true);

-- =======================================================================
-- profiles — self read, self update
-- =======================================================================
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =======================================================================
-- businesses — public read of published, owner full access
-- =======================================================================
drop policy if exists "businesses_public_read" on public.businesses;
create policy "businesses_public_read"
  on public.businesses for select
  using (published = true);

drop policy if exists "businesses_owner_read_unpublished" on public.businesses;
create policy "businesses_owner_read_unpublished"
  on public.businesses for select
  using (auth.uid() = owner_id);

drop policy if exists "businesses_owner_insert" on public.businesses;
create policy "businesses_owner_insert"
  on public.businesses for insert
  with check (auth.uid() = owner_id);

drop policy if exists "businesses_owner_update" on public.businesses;
create policy "businesses_owner_update"
  on public.businesses for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "businesses_owner_delete" on public.businesses;
create policy "businesses_owner_delete"
  on public.businesses for delete
  using (auth.uid() = owner_id);

-- =======================================================================
-- business_providers — public read if parent published, owner full access
-- =======================================================================
drop policy if exists "business_providers_public_read" on public.business_providers;
create policy "business_providers_public_read"
  on public.business_providers for select
  using (
    active = true and exists (
      select 1 from public.businesses b
      where b.id = business_providers.business_id and b.published = true
    )
  );

drop policy if exists "business_providers_owner_all" on public.business_providers;
create policy "business_providers_owner_all"
  on public.business_providers for all
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_providers.business_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_providers.business_id and b.owner_id = auth.uid()
    )
  );

-- =======================================================================
-- business_services — same pattern as providers
-- =======================================================================
drop policy if exists "business_services_public_read" on public.business_services;
create policy "business_services_public_read"
  on public.business_services for select
  using (
    active = true and exists (
      select 1 from public.businesses b
      where b.id = business_services.business_id and b.published = true
    )
  );

drop policy if exists "business_services_owner_all" on public.business_services;
create policy "business_services_owner_all"
  on public.business_services for all
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_services.business_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_services.business_id and b.owner_id = auth.uid()
    )
  );

-- =======================================================================
-- quote_requests — customer full access on own; business owners can read
-- open requests to decide whether to bid (radius filter at query time)
-- =======================================================================
drop policy if exists "quote_requests_customer_all" on public.quote_requests;
create policy "quote_requests_customer_all"
  on public.quote_requests for all
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

drop policy if exists "quote_requests_business_read_open" on public.quote_requests;
create policy "quote_requests_business_read_open"
  on public.quote_requests for select
  using (
    status = 'open' and exists (
      select 1 from public.businesses b
      where b.owner_id = auth.uid() and b.published = true
    )
  );

-- =======================================================================
-- quote_bids — business full access on own; customer can read bids on own
-- =======================================================================
drop policy if exists "quote_bids_business_all" on public.quote_bids;
create policy "quote_bids_business_all"
  on public.quote_bids for all
  using (
    exists (
      select 1 from public.businesses b
      where b.id = quote_bids.business_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = quote_bids.business_id and b.owner_id = auth.uid()
    )
  );

drop policy if exists "quote_bids_customer_read" on public.quote_bids;
create policy "quote_bids_customer_read"
  on public.quote_bids for select
  using (
    exists (
      select 1 from public.quote_requests r
      where r.id = quote_bids.request_id and r.customer_id = auth.uid()
    )
  );

-- =======================================================================
-- bookings — read-only from client for both sides. Writes flow through
-- server actions / service role so we can atomically flip the accepted
-- bid + other bids + request status in one transaction.
-- =======================================================================
drop policy if exists "bookings_customer_read" on public.bookings;
create policy "bookings_customer_read"
  on public.bookings for select
  using (auth.uid() = customer_id);

drop policy if exists "bookings_business_read" on public.bookings;
create policy "bookings_business_read"
  on public.bookings for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = bookings.business_id and b.owner_id = auth.uid()
    )
  );
