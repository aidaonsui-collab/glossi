-- 20260501000002_relax_customer_contact_reveal.sql
--
-- Migration 0015 gated the contact reveal on qb.status = 'accepted'
-- (Thumbtack pattern). The salon UI in SalonInboxDetail.jsx shows the
-- reveal button as soon as a bid is placed and tells the user
-- "Customer contact unlocks once you've sent a bid", so the gate was
-- inconsistent with the UX and the click silently no-op'd.
--
-- For an MVP we want pros to coordinate (scheduling, photo refs)
-- before the customer commits. Reveal on any active or accepted bid
-- by a salon the caller owns. Tighten later if spam emerges.
--
-- Profile join is now LEFT — handle_new_user trigger went missing in
-- prod once already; we don't want a missing profile row to mask the
-- email/phone fields the salon actually needs.

create or replace function public.request_customer_contact(p_request_id uuid)
returns table (
  full_name text,
  phone     text,
  email     text
)
language plpgsql
stable
security definer
set search_path = public, extensions, auth
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return;
  end if;

  return query
    select p.full_name, p.phone, u.email::text
    from public.quote_bids qb
    join public.quote_requests qr on qr.id = qb.request_id
    left join public.profiles p   on p.id  = qr.customer_id
    join auth.users u             on u.id  = qr.customer_id
    join public.businesses b      on b.id  = qb.business_id
    where qr.id = p_request_id
      and qb.status in ('active', 'accepted')
      and b.owner_id = v_user_id
    limit 1;
end;
$$;
