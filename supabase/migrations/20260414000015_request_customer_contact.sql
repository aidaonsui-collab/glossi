-- 20260414000015_request_customer_contact.sql
--
-- request_customer_contact(p_request_id uuid)
--
-- Thumbtack-style customer contact reveal. Business owners see the
-- customer's name / phone / email only after the customer has
-- accepted one of their bids on a quote request. Before that, the
-- business works off the request alone (services, notes, ZIP,
-- radius) — same pattern Thumbtack / HomeAdvisor use so customers
-- don't get spam-called the instant they post a request.
--
-- Returns zero rows when the caller hasn't earned the reveal (no
-- accepted bid on this request from a business they own). One row
-- when they have. We don't raise on the "not authorized" path
-- because the UI renders a graceful "waiting on accept" fallback
-- and an exception would just pollute logs.
--
-- SECURITY DEFINER is load-bearing here. Default RLS locks
-- public.profiles to the caller's own row and auth.users to nothing
-- — a business owner reading another user's profile would normally
-- fail. The function escalates to the owner's privileges, but the
-- WHERE clause does its own authorization: the row can only be
-- returned if the caller owns a business that holds an accepted bid
-- on this request. That's equivalent to an RLS policy, just written
-- inside the function body instead of on the underlying tables.
--
-- `set search_path = public, extensions, auth` is the standard
-- Supabase safety net against search_path hijacking on SECURITY
-- DEFINER functions — a hostile user with CREATE on the public
-- schema can't shadow pg_catalog lookups inside this body.

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
    join public.profiles p         on p.id  = qr.customer_id
    join auth.users u              on u.id  = qr.customer_id
    join public.businesses b       on b.id  = qb.business_id
    where qr.id = p_request_id
      and qb.status = 'accepted'
      and b.owner_id = v_user_id
    limit 1;
end;
$$;

revoke all on function public.request_customer_contact(uuid) from public;
grant execute on function public.request_customer_contact(uuid) to authenticated;
