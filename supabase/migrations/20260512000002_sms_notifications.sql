-- 20260512000002_sms_notifications.sql
--
-- Phase A of notifications expansion: SMS via Twilio.
--
-- Adds:
--   1. notifications.sms_sent_at — idempotency stamp, matches the
--      email_sent_at pattern from migration 0018.
--   2. profiles.sms_notifications — user-controlled opt-in toggle,
--      defaulted to true (we collect a phone at signup, so consent
--      is implicit — TCPA opt-out via STOP keyword is handled
--      automatically by Twilio).
--   3. trg_send_notification_sms — pg_net trigger that POSTs the
--      notification record to the send-notification-sms edge
--      function. Runs alongside the existing email trigger so a
--      single notifications.INSERT fans out to both channels.

alter table public.notifications
  add column if not exists sms_sent_at timestamptz;

alter table public.profiles
  add column if not exists sms_notifications boolean not null default true;

create or replace function public.trg_send_notification_sms()
returns trigger
language plpgsql
security definer
set search_path = public, net
as $$
declare
  v_url     text := 'https://zarhlaoqqfgxpvbgqlwu.supabase.co/functions/v1/send-notification-sms';
  v_payload jsonb;
begin
  v_payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'notifications',
    'record', jsonb_build_object(
      'id', new.id,
      'user_id', new.user_id,
      'kind', new.kind,
      'title', new.title,
      'body', new.body,
      'link', new.link
    )
  );

  -- Fire and forget. Edge function gates on profiles.sms_notifications,
  -- profiles.phone presence, and sms_sent_at idempotency, so safe to
  -- invoke on every notification — non-eligible rows no-op.
  perform net.http_post(
    url     := v_url,
    body    := v_payload,
    headers := jsonb_build_object('Content-Type', 'application/json')
  );
  return new;
end;
$$;

drop trigger if exists send_notification_sms on public.notifications;
create trigger send_notification_sms
  after insert on public.notifications
  for each row execute function public.trg_send_notification_sms();
