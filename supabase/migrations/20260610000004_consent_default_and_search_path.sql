-- 20260610000004_consent_default_and_search_path.sql
--
-- Two hardening fixes from the security review.
--
-- 1. SMS consent default. profiles.sms_notifications defaulted to TRUE
--    ("consent implicit"). For TCPA, opt-in should be explicit. New rows
--    default to FALSE; the signup flow sets it true only when the user
--    ticks the SMS opt-in box. We deliberately DO NOT mass-flip existing
--    rows here — that's a product/legal call (some users consented via
--    the signup checkbox, and we can't reconstruct who from this column
--    alone). If you want to be maximally conservative, run a one-off:
--      update public.profiles set sms_notifications = false;
--    and re-collect consent.
--
-- 2. Mutable search_path on two trigger helpers (Supabase advisor
--    `function_search_path_mutable`). Pin search_path so a hostile user
--    with CREATE on a schema in the role's path can't shadow the
--    functions these bodies resolve. Both only call now() (pg_catalog),
--    so an empty search_path is safe.

alter table public.profiles
  alter column sms_notifications set default false;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.touch_outreach_updated()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
