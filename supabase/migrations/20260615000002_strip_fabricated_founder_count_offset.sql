-- The founding-cohort counter was fabricated: founder_count() and
-- claim_founder_spot() both returned "23 + count(*)", inflating the public
-- "N salons in the founding cohort" number by 23. Pre-launch the real count is
-- ~0, so this misrepresented traction to recruited salons. Strip the offset so
-- the counter reflects reality. (Applied to remote DB 2026-06-15.)

CREATE OR REPLACE FUNCTION public.founder_count()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select count(*)::integer from public.founding_signups
$function$;

CREATE OR REPLACE FUNCTION public.claim_founder_spot(p_ig_handle text, p_phone text DEFAULT NULL::text, p_language text DEFAULT 'en'::text, p_city_guess text DEFAULT NULL::text, p_referred_by text DEFAULT NULL::text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  select count(*)::integer into v_count from public.founding_signups;
  return v_count;
end;
$function$;
