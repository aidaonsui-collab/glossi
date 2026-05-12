-- 20260511000001_pros_founding_signups.sql
--
-- /pros landing — Valley Founders Cohort capture.
--
-- Stylists DM'd via the manual outreach playbook land on /pros and submit
-- their IG handle (+ phone, language, optional city) to claim a "founding
-- spot." The 100-pro cohort is the page's scarcity hook.
--
-- claim_founder_spot() inserts and returns the new cohort number. It is
-- callable by `anon` so the page can write without forcing signup.
-- founder_count() is the public read used to render the live counter.
--
-- Counter is offset by 23 so the page launches at "23/100" — represents
-- the pros we expect to onboard via direct/walk-in outreach before the
-- page goes live publicly. Real signups append on top.

create table if not exists public.founding_signups (
  id          uuid primary key default gen_random_uuid(),
  ig_handle   text not null,
  phone       text,
  language    text not null default 'en' check (language in ('en', 'es')),
  city_guess  text,
  source      text not null default 'pros_landing',
  created_at  timestamptz not null default now()
);

create unique index if not exists founding_signups_handle_lower_idx
  on public.founding_signups (lower(ig_handle));

alter table public.founding_signups enable row level security;
-- No SELECT/INSERT policies — table is sealed; access only via RPCs.

create or replace function public.claim_founder_spot(
  p_ig_handle  text,
  p_phone      text default null,
  p_language   text default 'en',
  p_city_guess text default null
)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  v_handle text;
  v_count  integer;
begin
  v_handle := lower(regexp_replace(coalesce(p_ig_handle, ''), '^@\s*', ''));
  if length(v_handle) < 2 or v_handle !~ '^[a-z0-9._]+$' then
    raise exception 'invalid_handle';
  end if;

  insert into public.founding_signups (ig_handle, phone, language, city_guess)
  values (
    v_handle,
    nullif(trim(coalesce(p_phone, '')), ''),
    coalesce(nullif(p_language, ''), 'en'),
    nullif(trim(coalesce(p_city_guess, '')), '')
  )
  on conflict do nothing;

  select 23 + count(*)::integer into v_count from public.founding_signups;
  return v_count;
end;
$$;

create or replace function public.founder_count()
returns integer
language sql security definer set search_path = public stable
as $$
  select 23 + count(*)::integer from public.founding_signups
$$;

grant execute on function public.claim_founder_spot(text, text, text, text) to anon, authenticated;
grant execute on function public.founder_count() to anon, authenticated;
