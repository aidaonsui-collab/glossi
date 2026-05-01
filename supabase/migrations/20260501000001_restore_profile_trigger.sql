-- 20260501000001_restore_profile_trigger.sql
--
-- The on_auth_user_created trigger from migration 0003 went missing
-- in the live DB at some point (function intact, trigger gone), so
-- new auth.users rows weren't getting matching public.profiles rows.
-- Re-create idempotently and backfill any orphaned users.

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, full_name, is_business)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  coalesce(u.raw_user_meta_data->>'role', '') = 'salon'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
