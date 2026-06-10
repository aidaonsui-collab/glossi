-- 20260610000002_tiered_contact_reveal.sql
--
-- PRIVACY FIX. Migration 20260501000002 relaxed request_customer_contact
-- to reveal the customer's full_name + phone + email on any 'active' bid
-- (not just an 'accepted' one). Combined with the businesses_read_open
-- RLS policy — which lets any published business read every open quote
-- request — that meant any salon account could bulk-harvest the name,
-- phone and email of every customer who posted a request, simply by
-- placing a bid. That's exactly the spam-call vector the original
-- accepted-only gate (Thumbtack pattern) was designed to prevent.
--
-- The relaxation's goal was legitimate: let a pro personalize and
-- coordinate before the customer commits. We keep that, but tier the
-- reveal so the sensitive identifiers stay protected:
--
--   * active bid (caller owns it)   → first name only. No phone/email.
--   * accepted bid (caller owns it) → full name + phone + email.
--   * no qualifying bid             → no rows.
--
-- The function returns a contact_unlocked flag so the UI can render the
-- right state. Adding a column to the RETURNS TABLE changes the return
-- type, so we DROP before CREATE (CREATE OR REPLACE can't do that).

drop function if exists public.request_customer_contact(uuid);

create or replace function public.request_customer_contact(p_request_id uuid)
returns table (
  full_name        text,
  phone            text,
  email            text,
  contact_unlocked boolean
)
language plpgsql
stable
security definer
set search_path = public, extensions, auth
as $$
declare
  v_user_id      uuid := auth.uid();
  v_customer_id  uuid;
  v_has_accepted boolean;
begin
  if v_user_id is null then
    return;
  end if;

  -- Find the customer behind this request and whether the caller owns an
  -- ACCEPTED bid on it. Authorization lives here, in the WHERE clause:
  -- we only consider bids on businesses the caller owns, and only
  -- active/accepted ones. No qualifying bid → v_customer_id is null →
  -- we return zero rows (the UI shows "send a bid to unlock").
  select qr.customer_id,
         bool_or(qb.status = 'accepted')
    into v_customer_id, v_has_accepted
  from public.quote_bids qb
  join public.quote_requests qr on qr.id = qb.request_id
  join public.businesses b      on b.id  = qb.business_id
  where qr.id = p_request_id
    and b.owner_id = v_user_id
    and qb.status in ('active', 'accepted')
  group by qr.customer_id;

  if v_customer_id is null then
    return;
  end if;

  -- LEFT JOIN profiles (handle_new_user trigger has gone missing in prod
  -- before; a missing profile row shouldn't blank out the auth email the
  -- salon needs once the booking is real).
  if coalesce(v_has_accepted, false) then
    -- Customer committed: hand over full contact.
    return query
      select coalesce(p.full_name, '')::text,
             p.phone,
             u.email::text,
             true
      from auth.users u
      left join public.profiles p on p.id = u.id
      where u.id = v_customer_id
      limit 1;
  else
    -- Active bid only: first name for personalization, nothing more.
    return query
      select split_part(coalesce(p.full_name, ''), ' ', 1)::text,
             null::text,
             null::text,
             false
      from auth.users u
      left join public.profiles p on p.id = u.id
      where u.id = v_customer_id
      limit 1;
  end if;
end;
$$;

revoke all on function public.request_customer_contact(uuid) from public;
grant execute on function public.request_customer_contact(uuid) to authenticated;
