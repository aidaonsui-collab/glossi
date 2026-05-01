-- 20260501000017_phase9_notifications.sql
--
-- Phase 9: in-app + email notifications.
--
-- Schema: per-user notifications inbox (id, kind, title, body, link,
-- read_at, email_sent_at). RLS gates SELECT/UPDATE to the row owner.
-- Realtime added so the bell badge updates live.
--
-- Triggers populate the inbox automatically on key events:
--   * quote_bids INSERT     → customer: 'X bid $Y'
--   * quote_bids → countered → salon:    'Customer countered $Y'
--   * quote_bids countered → active     → customer: 'Salon accepted your $Y'
--   * bookings INSERT       → both:     paid + new booking
--   * bookings → completed  → customer: review prompt
--   * bookings → cancelled  → other side
--   * bookings → no_show    → customer
--   * reviews INSERT        → salon:    new N★ review
--
-- queue_notification(...) is the single insert helper. Frontend reads
-- come through unread_notifications_count() / mark_notifications_read().
-- The actual email send lives in the next migration (the pg_net bridge).

create extension if not exists pg_net with schema extensions;

create table if not exists public.notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  kind          text not null,
  title         text not null,
  body          text,
  link          text,
  read_at       timestamptz,
  email_sent_at timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, read_at, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications_owner_select" on public.notifications;
create policy "notifications_owner_select"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "notifications_owner_update" on public.notifications;
create policy "notifications_owner_update"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.queue_notification(
  p_user_id uuid,
  p_kind    text,
  p_title   text,
  p_body    text default null,
  p_link    text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id uuid;
begin
  if p_user_id is null then return null; end if;
  insert into public.notifications (user_id, kind, title, body, link)
  values (p_user_id, p_kind, p_title, p_body, p_link)
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.queue_notification(uuid, text, text, text, text) from public;

-- Bid received
create or replace function public.trg_notify_on_bid_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_customer_id uuid;
  v_biz_name    text;
  v_dollars     int := round(new.price_cents / 100.0);
begin
  if new.status <> 'active' then return new; end if;
  select customer_id into v_customer_id from public.quote_requests where id = new.request_id;
  select name into v_biz_name from public.businesses where id = new.business_id;
  perform public.queue_notification(
    v_customer_id, 'bid_received',
    coalesce(v_biz_name, 'A salon') || ' bid $' || v_dollars,
    'Open the request to compare bids.',
    '/quotes/' || new.request_id
  );
  return new;
end; $$;

drop trigger if exists notify_on_bid_insert on public.quote_bids;
create trigger notify_on_bid_insert after insert on public.quote_bids
  for each row execute function public.trg_notify_on_bid_insert();

-- Counter received / counter accepted
create or replace function public.trg_notify_on_bid_update()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_customer_id uuid; v_owner_id uuid; v_biz_name text; v_dollars int;
begin
  if new.status = 'countered' and old.status is distinct from 'countered' then
    select b.owner_id, b.name into v_owner_id, v_biz_name
    from public.businesses b where b.id = new.business_id;
    v_dollars := round(new.counter_offer_cents / 100.0);
    perform public.queue_notification(
      v_owner_id, 'counter_received',
      'Customer countered $' || v_dollars,
      coalesce(new.counter_message, 'Open the bid to respond.'),
      '/salon/bids'
    );
  end if;
  if new.status = 'active' and old.status = 'countered' then
    select customer_id into v_customer_id from public.quote_requests where id = new.request_id;
    select name into v_biz_name from public.businesses where id = new.business_id;
    v_dollars := round(new.price_cents / 100.0);
    perform public.queue_notification(
      v_customer_id, 'counter_accepted',
      coalesce(v_biz_name, 'A salon') || ' accepted your $' || v_dollars,
      'Open the request to pay and book.',
      '/quotes/' || new.request_id
    );
  end if;
  return new;
end; $$;

drop trigger if exists notify_on_bid_update on public.quote_bids;
create trigger notify_on_bid_update after update on public.quote_bids
  for each row execute function public.trg_notify_on_bid_update();

-- Booking created (both sides)
create or replace function public.trg_notify_on_booking_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_owner_id uuid; v_biz_name text; v_dollars int := round(new.price_cents / 100.0);
begin
  select owner_id, name into v_owner_id, v_biz_name
  from public.businesses where id = new.business_id;
  perform public.queue_notification(
    v_owner_id, 'booking_paid',
    'New booking · $' || v_dollars,
    'Customer paid. Open the booking to confirm details.',
    '/salon/booking/' || new.id
  );
  perform public.queue_notification(
    new.customer_id, 'booking_confirmed',
    'You''re booked at ' || coalesce(v_biz_name, 'the salon'),
    'See the appointment under your bookings.',
    '/bookings'
  );
  return new;
end; $$;

drop trigger if exists notify_on_booking_insert on public.bookings;
create trigger notify_on_booking_insert after insert on public.bookings
  for each row execute function public.trg_notify_on_booking_insert();

-- Booking lifecycle (complete / cancel / no_show)
create or replace function public.trg_notify_on_booking_update()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_owner_id uuid; v_biz_name text;
begin
  select owner_id, name into v_owner_id, v_biz_name
  from public.businesses where id = new.business_id;

  if new.status = 'completed' and old.status is distinct from 'completed' then
    perform public.queue_notification(
      new.customer_id, 'booking_completed',
      'How was your visit to ' || coalesce(v_biz_name, 'the salon') || '?',
      'Tap to leave a review.',
      '/bookings'
    );
  end if;

  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    if new.cancelled_by = new.customer_id then
      perform public.queue_notification(
        v_owner_id, 'booking_cancelled_by_customer',
        'Customer cancelled their booking',
        coalesce('Reason: ' || new.cancellation_reason, 'No reason provided.'),
        '/salon/booking/' || new.id
      );
    else
      perform public.queue_notification(
        new.customer_id, 'booking_cancelled_by_salon',
        coalesce(v_biz_name, 'The salon') || ' cancelled your booking',
        coalesce('Reason: ' || new.cancellation_reason, 'You''ve been refunded in full.'),
        '/bookings'
      );
    end if;
  end if;

  if new.status = 'no_show' and old.status is distinct from 'no_show' then
    perform public.queue_notification(
      new.customer_id, 'booking_no_show',
      coalesce(v_biz_name, 'The salon') || ' marked you as a no-show',
      'Contact the salon if this looks wrong.',
      '/bookings'
    );
  end if;

  return new;
end; $$;

drop trigger if exists notify_on_booking_update on public.bookings;
create trigger notify_on_booking_update after update on public.bookings
  for each row execute function public.trg_notify_on_booking_update();

-- Review received
create or replace function public.trg_notify_on_review_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_owner_id uuid;
begin
  select owner_id into v_owner_id from public.businesses where id = new.business_id;
  perform public.queue_notification(
    v_owner_id, 'review_received',
    'New ' || new.rating || '★ review',
    coalesce(new.body, 'Tap to read and reply.'),
    '/salon/reviews'
  );
  return new;
end; $$;

drop trigger if exists notify_on_review_insert on public.reviews;
create trigger notify_on_review_insert after insert on public.reviews
  for each row execute function public.trg_notify_on_review_insert();

-- Frontend RPCs
create or replace function public.unread_notifications_count()
returns int language sql stable security definer set search_path = public
as $$
  select coalesce(count(*), 0)::int from public.notifications
  where user_id = auth.uid() and read_at is null;
$$;
revoke all on function public.unread_notifications_count() from public;
grant execute on function public.unread_notifications_count() to authenticated;

create or replace function public.mark_notifications_read(p_ids uuid[] default null)
returns void language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then return; end if;
  if p_ids is null then
    update public.notifications set read_at = now()
     where user_id = auth.uid() and read_at is null;
  else
    update public.notifications set read_at = now()
     where user_id = auth.uid() and id = any(p_ids) and read_at is null;
  end if;
end;
$$;
revoke all on function public.mark_notifications_read(uuid[]) from public;
grant execute on function public.mark_notifications_read(uuid[]) to authenticated;

alter publication supabase_realtime add table public.notifications;
