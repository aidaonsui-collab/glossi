-- 20260501000018_notifications_email_bridge.sql
--
-- After every notification insert, fire pg_net.http_post to the
-- send-notification-email edge function (Resend transactional email).
-- Body matches Supabase's database-webhook payload shape so the same
-- function handles both invocation paths.

create or replace function public.trg_send_notification_email()
returns trigger
language plpgsql
security definer
set search_path = public, net
as $$
declare
  v_url     text := 'https://zarhlaoqqfgxpvbgqlwu.supabase.co/functions/v1/send-notification-email';
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

  -- Fire and forget. Edge function is idempotent via email_sent_at.
  perform net.http_post(
    url     := v_url,
    body    := v_payload,
    headers := jsonb_build_object('Content-Type', 'application/json')
  );
  return new;
end;
$$;

drop trigger if exists send_notification_email on public.notifications;
create trigger send_notification_email
  after insert on public.notifications
  for each row execute function public.trg_send_notification_email();
