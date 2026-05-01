-- 20260414000011_accept_bid.sql
--
-- Customer side of the bid loop: accepting a bid.
--
-- When a customer taps "Accept" on one of their incoming bids we need to
-- atomically flip three things:
--
--   1. The chosen bid  → status = 'accepted'
--   2. The request     → status = 'booked'
--   3. Every OTHER bid → status = 'rejected' (so the inbox stops showing
--                        stale "submit a bid" prompts to salons that were
--                        outbid)
--
-- Doing this in three separate client-side UPDATEs would leak partial
-- states to any observer (RLS reads see open bids on a booked request),
-- so it lives in a single SECURITY INVOKER function that the server
-- action calls. RLS still gates every row touch — the function doesn't
-- escalate privileges, it just bundles the writes into one transaction
-- so nobody sees a half-applied state.
--
-- We deliberately skip creating a bookings row here. The bookings table
-- from migration 0005 requires a scheduled_at timestamp, and we don't
-- have a scheduling handoff flow yet — the customer still coordinates
-- the final appointment time with the salon directly. When we add
-- real scheduling in a later session this function can be extended to
-- also insert into bookings.

create or replace function public.accept_bid(p_bid_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id    uuid := auth.uid();
  v_request_id uuid;
  v_req_status text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  -- Look up the request this bid belongs to, AND verify ownership in
  -- one query. If the customer doesn't own the request OR the bid row
  -- doesn't exist OR it isn't active, we get nothing back and raise
  -- a clean error — the client never learns which of those it was.
  select qb.request_id, qr.status
    into v_request_id, v_req_status
  from public.quote_bids qb
  join public.quote_requests qr on qr.id = qb.request_id
  where qb.id = p_bid_id
    and qb.status = 'active'
    and qr.customer_id = v_user_id;

  if v_request_id is null then
    raise exception 'bid not found or not yours'
      using errcode = '42501';
  end if;

  if v_req_status <> 'open' then
    raise exception 'request is no longer accepting responses'
      using errcode = '22023';
  end if;

  -- Atomic flip. Order matters: flip the target bid first so the losing
  -- bids' UPDATE can exclude it via id <> p_bid_id without needing a
  -- CASE. Wrapping all three in a single function = one statement
  -- boundary from the client's POV, so PostgREST's implicit per-call
  -- transaction keeps them atomic.
  update public.quote_bids
     set status = 'accepted'
   where id = p_bid_id;

  update public.quote_bids
     set status = 'rejected'
   where request_id = v_request_id
     and id <> p_bid_id
     and status = 'active';

  update public.quote_requests
     set status = 'booked'
   where id = v_request_id;
end;
$$;

revoke all on function public.accept_bid(uuid) from public;
grant execute on function public.accept_bid(uuid) to authenticated;
