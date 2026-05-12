-- 20260511000002_pros_referrals.sql
--
-- /pros referrals — when a founding-pro signs up they get a shareable link
-- `glossi.cc/pros?ref=<their_ig_handle>`. Anyone landing on that URL who
-- signs up gets attributed back to the referrer via `referred_by_handle`.
--
-- The IG handle itself is the referral code — no separate code column.
-- Simple, memorable, no encoding gotchas (handles are already URL-safe).
--
-- claim_founder_spot() gains an optional p_referred_by parameter. We can't
-- ALTER an existing security-definer function's signature without dropping
-- it first, so we drop + recreate.

alter table public.founding_signups
  add column if not exists referred_by_handle text;

create index if not exists founding_signups_referred_by_idx
  on public.founding_signups (referred_by_handle)
  where referred_by_handle is not null;

drop function if exists public.claim_founder_spot(text, text, text, text);

create or replace function public.claim_founder_spot(
  p_ig_handle    text,
  p_phone        text default null,
  p_language     text default 'en',
  p_city_guess   text default null,
  p_referred_by  text default null
)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  v_handle text;
  v_referrer text;
  v_count  integer;
begin
  v_handle := lower(regexp_replace(coalesce(p_ig_handle, ''), '^@\s*', ''));
  if length(v_handle) < 2 or v_handle !~ '^[a-z0-9._]+$' then
    raise exception 'invalid_handle';
  end if;

  v_referrer := lower(regexp_replace(coalesce(p_referred_by, ''), '^@\s*', ''));
  if length(v_referrer) < 2 or v_referrer = v_handle then
    v_referrer := null;
  end if;

  insert into public.founding_signups (ig_handle, phone, language, city_guess, referred_by_handle)
  values (
    v_handle,
    nullif(trim(coalesce(p_phone, '')), ''),
    coalesce(nullif(p_language, ''), 'en'),
    nullif(trim(coalesce(p_city_guess, '')), ''),
    v_referrer
  )
  on conflict do nothing;

  select 23 + count(*)::integer into v_count from public.founding_signups;
  return v_count;
end;
$$;

grant execute on function public.claim_founder_spot(text, text, text, text, text) to anon, authenticated;
