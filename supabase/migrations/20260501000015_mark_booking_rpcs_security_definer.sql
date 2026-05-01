-- 20260501000015_mark_booking_rpcs_security_definer.sql
--
-- Bug from Phase 7 dogfood: clicking Mark complete in the salon's
-- booking detail page returned a "Marked complete" toast but the
-- booking row never changed in the DB.
--
-- Root cause: mark_booking_complete + mark_booking_no_show were
-- declared SECURITY INVOKER. Bookings has SELECT policies in RLS
-- (bookings_customer_read, bookings_business_read) but no UPDATE
-- policy at all — Phase 5 was deliberate about routing all writes
-- through SECURITY DEFINER RPCs (accept_bid, commit_bid_acceptance).
-- INVOKER mode meant the UPDATE matched 0 rows, the function
-- returned cleanly, and the client thought it had won.
--
-- Flip both to SECURITY DEFINER. They already verify ownership via
-- the businesses join in the WHERE clause, so no privilege escalation.

create or replace function public.mark_booking_complete(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_status  text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select bk.status into v_status
  from public.bookings bk
  join public.businesses b on b.id = bk.business_id
  where bk.id = p_booking_id
    and b.owner_id = v_user_id;

  if v_status is null then
    raise exception 'booking not found or not yours' using errcode = '42501';
  end if;

  if v_status <> 'confirmed' then
    raise exception 'booking is not confirmed (status=%)', v_status using errcode = '22023';
  end if;

  update public.bookings
     set status = 'completed',
         completed_at = now()
   where id = p_booking_id;
end;
$$;

revoke all on function public.mark_booking_complete(uuid) from public;
grant execute on function public.mark_booking_complete(uuid) to authenticated;

create or replace function public.mark_booking_no_show(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_status  text;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select bk.status into v_status
  from public.bookings bk
  join public.businesses b on b.id = bk.business_id
  where bk.id = p_booking_id
    and b.owner_id = v_user_id;

  if v_status is null then
    raise exception 'booking not found or not yours' using errcode = '42501';
  end if;

  if v_status <> 'confirmed' then
    raise exception 'booking is not confirmed (status=%)', v_status using errcode = '22023';
  end if;

  update public.bookings
     set status = 'no_show',
         no_show_at = now()
   where id = p_booking_id;
end;
$$;

revoke all on function public.mark_booking_no_show(uuid) from public;
grant execute on function public.mark_booking_no_show(uuid) to authenticated;
