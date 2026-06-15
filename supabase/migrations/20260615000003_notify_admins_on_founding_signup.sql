-- Alert admins when a salon claims a founding spot on /pros.
-- /pros writes IG handle + phone into founding_signups, but nothing notified
-- the founder — leads could be missed during outreach. This inserts a
-- notification for every admin on signup; the existing notification triggers
-- then deliver SMS + email + the in-app bell. (Applied to remote DB 2026-06-15.)

CREATE OR REPLACE FUNCTION public.notify_admins_on_founding_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  insert into public.notifications (user_id, kind, title, body, link)
  select u.id,
         'lead',
         'New founding pro',
         '@' || new.ig_handle
           || coalesce(' · ' || nullif(new.phone, ''), '')
           || coalesce(' · ' || nullif(new.city_guess, ''), '')
           || coalesce(' (ref @' || nullif(new.referred_by_handle, '') || ')', ''),
         '/admin/outreach'
  from public.admin_emails a
  join auth.users u on lower(u.email) = lower(a.email);
  return new;
end;
$$;

DROP TRIGGER IF EXISTS notify_admins_on_founding_signup_trg ON public.founding_signups;
CREATE TRIGGER notify_admins_on_founding_signup_trg
  AFTER INSERT ON public.founding_signups
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_founding_signup();
