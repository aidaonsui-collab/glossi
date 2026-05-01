-- 20260501000006_fix_rls_recursion_quote_bids.sql
--
-- Migration 0501_004 added a SELECT policy on quote_requests that
-- read from quote_bids. quote_bids itself has a customer-side
-- policy (quote_bids_customer_read) that reads from quote_requests.
-- Together they form a cycle:
--
--   query quote_bids
--     → quote_bids_customer_read fires
--     → reads quote_requests
--       → quote_requests_business_read_bid_history fires
--       → reads quote_bids
--         → infinite recursion (Postgres aborts)
--
-- This broke (a) the customer Bookings list, since the
-- bookings → quote_bids → quote_requests embed touched the
-- recursive policy chain, and (b) the salon's My bids list, since
-- a direct select on quote_bids tripped the same cycle on the
-- customer-read evaluation path.
--
-- Fix: replace the recursive inline subquery with a SECURITY
-- DEFINER helper that does the exists() lookup with elevated privs,
-- bypassing RLS on the inner read. The helper runs auth.uid() so
-- it's no less safe than the original subquery — just non-recursive.

drop policy if exists "quote_requests_business_read_bid_history" on public.quote_requests;

create or replace function public.caller_has_bid_on_request(p_request_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.quote_bids qb
    join public.businesses b on b.id = qb.business_id
    where qb.request_id = p_request_id
      and b.owner_id = auth.uid()
      and qb.status in ('active', 'accepted', 'rejected')
  );
$$;

revoke all on function public.caller_has_bid_on_request(uuid) from public;
grant execute on function public.caller_has_bid_on_request(uuid) to authenticated;

create policy "quote_requests_business_read_bid_history"
  on public.quote_requests for select
  using ( public.caller_has_bid_on_request(quote_requests.id) );
