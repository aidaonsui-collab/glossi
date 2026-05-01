-- 20260414000003_init_profiles.sql
--
-- User profile — 1:1 extension of auth.users. Auto-created on signup via a
-- trigger on auth.users so every signed-in user always has a profile row.

create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  phone           text,
  home_zip        text,
  avatar_url      text,
  preferred_lang  text not null default 'en' check (preferred_lang in ('en','es')),
  is_business     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Generic updated_at bump — reused by businesses and future tables.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth.users row lands.
-- `security definer` so the function runs with owner privileges and can
-- insert regardless of the caller's RLS context. `set search_path = public`
-- is the standard Supabase safety net against search_path hijacking.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
