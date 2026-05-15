-- Edge function rate limits.
--
-- Backs the check_rate_limit() RPC used by Stripe-charging and Twilio-
-- sending edge functions to keep abuse off the bill. Single table with a
-- (key, bucket) primary key and an UPSERT-with-increment in one round trip,
-- so a typical call is one INSERT-or-UPDATE. Buckets are snapped to the
-- start of each window, so all calls within a window collide on the same
-- row and the counter accumulates cleanly.
--
-- Keys are caller-constructed and namespaced by function (e.g.
-- "sms:<user_id>", "pay:<user_id>"). The RPC is service-role only;
-- frontend code can't call it directly, only edge functions can.
--
-- We intentionally don't auto-cleanup here. Each row is ~40 bytes and the
-- table grows by ~one row per unique key per window. At the early-stage
-- traffic Glossi sees, that's negligible for years. cleanup_edge_rate_
-- limits() is provided so we can wire pg_cron later if needed.

create table if not exists public.edge_rate_limits (
  key text not null,
  bucket timestamptz not null,
  count integer not null default 0,
  primary key (key, bucket)
);

create index if not exists edge_rate_limits_bucket_idx
  on public.edge_rate_limits (bucket);

-- Lock down: RLS on, no policies. Service role bypasses RLS, so edge
-- functions reach it; everyone else is denied.
alter table public.edge_rate_limits enable row level security;

create or replace function public.check_rate_limit(
  p_key text,
  p_max int default 10,
  p_window_seconds int default 60
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bucket timestamptz;
  v_count  int;
begin
  -- Snap to the start of the current window so all calls within the
  -- window land on the same row.
  v_bucket := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.edge_rate_limits (key, bucket, count)
  values (p_key, v_bucket, 1)
  on conflict (key, bucket) do update
    set count = edge_rate_limits.count + 1
  returning count into v_count;

  return v_count <= p_max;
end;
$$;

revoke all on function public.check_rate_limit(text, int, int)
  from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, int, int)
  to service_role;

-- Manual / pg_cron cleanup. Keep last hour for ad-hoc debugging.
create or replace function public.cleanup_edge_rate_limits()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.edge_rate_limits where bucket < now() - interval '1 hour';
$$;

revoke all on function public.cleanup_edge_rate_limits()
  from public, anon, authenticated;
grant execute on function public.cleanup_edge_rate_limits() to service_role;
