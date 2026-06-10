-- 20260610000001_notification_webhook_secret.sql
--
-- SECURITY FIX. The send-notification-email and send-notification-sms
-- edge functions run with verify_jwt=false (the pg_net triggers below
-- don't carry a Supabase JWT) and previously performed no authentication
-- of their own. Because the email/SMS title, body, link and target
-- user_id are all read from the request body, the endpoints were public
-- relays: anyone who reached the URL could send attacker-controlled
-- phishing content to our users on our Resend/Twilio credentials and run
-- up the bill.
--
-- Fix: the edge functions now require an x-notify-secret header that
-- matches the NOTIFY_WEBHOOK_SECRET function secret (constant-time
-- compare; see supabase/functions/_shared/notifyAuth.ts). These triggers
-- read the same value from Supabase Vault and attach it to the pg_net
-- request.
--
-- ONE-TIME SETUP (do this, then redeploy the two functions):
--   1. Generate a strong random secret:
--        openssl rand -hex 32
--   2. Store it in Vault (read by the triggers below):
--        select vault.create_secret(
--          '<secret>', 'notify_webhook_secret',
--          'Shared secret for notification edge-function triggers');
--      To rotate later:
--        update vault.secrets set secret = '<new-secret>'
--          where name = 'notify_webhook_secret';
--   3. Set the matching edge-function secret to the SAME value:
--        supabase secrets set NOTIFY_WEBHOOK_SECRET=<secret>
--   4. Redeploy both functions:
--        supabase functions deploy send-notification-email
--        supabase functions deploy send-notification-sms
--
-- Until the Vault secret exists the header is empty and the functions
-- reject the call, so email/SMS won't go out — but in-app notifications
-- are unaffected (the notifications row is inserted regardless of whether
-- the outbound channel succeeds).

create extension if not exists supabase_vault with schema vault;

-- Helper: fetch the notify webhook secret from Vault. SECURITY DEFINER so
-- it runs as the migration owner (which can read vault.decrypted_secrets);
-- locked down to no callable role since only the SECURITY DEFINER triggers
-- below invoke it. Returns '' when unset so callers degrade safely.
create or replace function public.notify_webhook_secret()
returns text
language sql
stable
security definer
set search_path = public, vault
as $$
  select coalesce(
    (select decrypted_secret
       from vault.decrypted_secrets
      where name = 'notify_webhook_secret'
      limit 1),
    ''
  );
$$;

revoke all on function public.notify_webhook_secret() from public, anon, authenticated;

-- Email trigger — now attaches x-notify-secret.
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
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-notify-secret', public.notify_webhook_secret()
    )
  );
  return new;
end;
$$;

-- SMS trigger — now attaches x-notify-secret.
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
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-notify-secret', public.notify_webhook_secret()
    )
  );
  return new;
end;
$$;
