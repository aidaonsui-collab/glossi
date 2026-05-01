-- 20260501000003_accept_bid_creates_booking.sql
--
-- Two issues with the original accept_bid (migration 0011):
--
-- 1. SECURITY INVOKER + RLS made the bid status updates silently
--    no-op. Customers have no UPDATE policy on quote_bids — only the
--    business owner can touch their own bids. So an accepting
--    customer's call flipped quote_requests.status to 'booked' (they
--    own the request) but the quote_bids UPDATEs returned zero rows.
--    Result: a "booked" request whose chosen bid was still 'active',
--    and competing bids that were never marked 'rejected'. Switching
--    to SECURITY DEFINER bypasses RLS while keeping safety: the
--    function still gates on qr.customer_id = auth.uid() in the
--    initial lookup.
--
-- 2. The original migration deliberately skipped the bookings row
--    insert ("we'll add scheduling later"). The customer UI now
--    shows a Bookings tab and expects accepted bids there, so we
--    insert a row at accept time using earliest_slot if the salon
--    set one, or now() + 1 day as a placeholder the salon can
--    nudge later.
--
-- Returns the new booking id so a future deposit/checkout flow can
-- redirect straight to /checkout/<bookingId>.

drop function if exists public.accept_bid(uuid);

create or replace function public.accept_bid(p_bid_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user_id     uuid := auth.uid();
  v_request_id  uuid;
  v_req_status  text;
  v_business_id uuid;
  v_provider_id uuid;
  v_price_cents int;
  v_duration    int;
  v_earliest    timestamptz;
  v_deposit_pct int;
  v_deposit     int;
  v_booking_id  uuid;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select qb.request_id, qr.status,
         qb.business_id, qb.provider_id,
         qb.price_cents, qb.estimated_duration, qb.earliest_slot
    into v_request_id, v_req_status,
         v_business_id, v_provider_id,
         v_price_cents, v_duration, v_earliest
  from public.quote_bids qb
  join public.quote_requests qr on qr.id = qb.request_id
  where qb.id = p_bid_id
    and qb.status = 'active'
    and qr.customer_id = v_user_id;

  if v_request_id is null then
    raise exception 'bid not found or not yours'
      using errcode = '42501';
  end if;

  -- Allow re-running on a request that's already 'booked' (recovery
  -- path for the no-op-update bug above) but reject closed/expired.
  if v_req_status not in ('open', 'booked') then
    raise exception 'request is no longer accepting responses'
      using errcode = '22023';
  end if;

  select coalesce(b.deposit_pct, 0)
    into v_deposit_pct
  from public.businesses b
  where b.id = v_business_id;

  v_deposit := round(v_price_cents * coalesce(v_deposit_pct, 0) / 100.0)::int;

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

  insert into public.bookings (
    bid_id, customer_id, business_id, provider_id,
    scheduled_at, duration_min, price_cents, deposit_cents,
    status
  ) values (
    p_bid_id, v_user_id, v_business_id, v_provider_id,
    coalesce(v_earliest, now() + interval '1 day'),
    v_duration, v_price_cents, v_deposit,
    'confirmed'
  )
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

grant execute on function public.accept_bid(uuid) to authenticated;
