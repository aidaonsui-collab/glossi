-- 20260511000003_outreach_prospects.sql
--
-- Outreach CRM for the founder's manual IG-DM campaign to the 280 RGV
-- beauty pros scraped via scripts/scrape-rgv-stylists.mjs.
--
-- Workflow: prospects start `not_contacted` → founder DMs them and marks
-- `dm_sent` → reply / no-reply tracked → if they sign up via /pros their
-- row in founding_signups triggers an auto-link to `signed_up`.
--
-- Access: admin-only via a small `admin_emails` whitelist table. Add an
-- email to it in the Supabase Dashboard SQL editor:
--   insert into public.admin_emails (email) values ('you@example.com');

create table if not exists public.admin_emails (
  email      text primary key,
  added_at   timestamptz not null default now()
);

alter table public.admin_emails enable row level security;
-- No SELECT policy — only RPCs use it. Service role can still manage.

create or replace function public.is_glossi_admin()
returns boolean
language sql security definer set search_path = public, auth stable
as $$
  select exists (
    select 1 from public.admin_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_glossi_admin() to anon, authenticated;

create table if not exists public.outreach_prospects (
  id               uuid primary key default gen_random_uuid(),
  ig_handle        text not null,
  full_name        text,
  follower_count   integer,
  bio              text,
  service_guess    text,
  language_guess   text default 'en',
  rgv_match        boolean default false,
  city_guess       text,
  external_url     text,
  is_business      boolean default false,
  verified         boolean default false,
  source_hashtags  text,
  sample_location  text,

  status           text not null default 'not_contacted'
    check (status in ('not_contacted','dm_sent','replied','signed_up','declined','ghosted','blocked')),
  notes            text,
  dm_sent_at       timestamptz,
  replied_at       timestamptz,
  signed_up_at     timestamptz,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create unique index if not exists outreach_prospects_handle_lower_idx
  on public.outreach_prospects (lower(ig_handle));
create index if not exists outreach_prospects_status_idx
  on public.outreach_prospects (status);
create index if not exists outreach_prospects_priority_idx
  on public.outreach_prospects (rgv_match desc, follower_count desc nulls last);

alter table public.outreach_prospects enable row level security;

drop policy if exists "outreach_admin_read" on public.outreach_prospects;
create policy "outreach_admin_read" on public.outreach_prospects
  for select using (public.is_glossi_admin());

drop policy if exists "outreach_admin_write" on public.outreach_prospects;
create policy "outreach_admin_write" on public.outreach_prospects
  for all using (public.is_glossi_admin()) with check (public.is_glossi_admin());

-- Keep updated_at fresh on every change
create or replace function public.touch_outreach_updated()
returns trigger language plpgsql
as $$
begin new.updated_at := now(); return new; end;
$$;

drop trigger if exists touch_outreach_updated_trg on public.outreach_prospects;
create trigger touch_outreach_updated_trg
  before update on public.outreach_prospects
  for each row execute function public.touch_outreach_updated();

-- Auto-link a prospect to signed_up when they appear in founding_signups
create or replace function public.link_signup_to_prospect()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  update public.outreach_prospects
  set status = 'signed_up',
      signed_up_at = now(),
      updated_at = now()
  where lower(ig_handle) = lower(new.ig_handle)
    and status not in ('signed_up');
  return new;
end;
$$;

drop trigger if exists link_signup_to_prospect_trg on public.founding_signups;
create trigger link_signup_to_prospect_trg
  after insert on public.founding_signups
  for each row execute function public.link_signup_to_prospect();

-- Bulk seed RPC — admin calls this once from the import script with the
-- 280 scraped rows as a JSONB array. Idempotent on ig_handle.
create or replace function public.seed_outreach_prospects(p_rows jsonb)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  v_inserted integer;
begin
  if not public.is_glossi_admin() then
    raise exception 'admin_required';
  end if;

  insert into public.outreach_prospects (
    ig_handle, full_name, follower_count, bio,
    service_guess, language_guess, rgv_match, city_guess,
    external_url, is_business, verified, source_hashtags, sample_location
  )
  select
    r->>'ig_handle',
    nullif(r->>'full_name', ''),
    nullif(r->>'follower_count', '')::integer,
    nullif(r->>'bio', ''),
    nullif(r->>'service_guess', ''),
    coalesce(nullif(r->>'language_guess', ''), 'en'),
    coalesce((r->>'rgv_match')::boolean, false),
    nullif(r->>'city_guess', ''),
    nullif(r->>'external_url', ''),
    coalesce((r->>'is_business')::boolean, false),
    coalesce((r->>'verified')::boolean, false),
    nullif(r->>'source_hashtags', ''),
    nullif(r->>'sample_location', '')
  from jsonb_array_elements(p_rows) as r
  where r->>'ig_handle' is not null
  on conflict ((lower(ig_handle))) do nothing;

  get diagnostics v_inserted = row_count;
  return v_inserted;
end;
$$;

grant execute on function public.seed_outreach_prospects(jsonb) to authenticated;
