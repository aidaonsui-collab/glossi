-- 20260501000004_salons_read_requests_they_bid_on.sql
--
-- After a bid is accepted, quote_requests.status flips to 'booked'.
-- The salon-side read policy from migration 0009 only matches rows
-- where status = 'open', so the bidding salon lost read access to a
-- request the moment they won it. Symptom: the salon's "My bids"
-- page rendered "Service" as a literal placeholder and notes as "—"
-- because the embedded quote_requests join returned null under RLS.
--
-- This adds a second SELECT policy: a salon owner can read a request
-- they have an active, accepted, or rejected bid on. Withdrawn bids
-- don't unlock reads, so a salon that backed out doesn't keep
-- peeking at a customer's notes.

drop policy if exists "quote_requests_business_read_bid_history" on public.quote_requests;
create policy "quote_requests_business_read_bid_history"
  on public.quote_requests for select
  using (
    exists (
      select 1
      from public.quote_bids qb
      join public.businesses b on b.id = qb.business_id
      where qb.request_id = quote_requests.id
        and b.owner_id = auth.uid()
        and qb.status in ('active', 'accepted', 'rejected')
    )
  );
