-- Fix: the notification triggers called the edge functions via pg_net with no
-- Authorization header, so verify_jwt=true rejected every call with 401 — SMS
-- and email notifications via trigger never actually fired. Read the service-role
-- JWT from Vault (secret name 'edge_auth_key') and send it as the bearer token so
-- the functions accept the call and only these triggers can invoke them.
--
-- Prereq (set once, out of band, NOT in this migration):
--   select vault.create_secret('<service_role_key>', 'edge_auth_key', '...');

CREATE OR REPLACE FUNCTION public.trg_send_notification_sms()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'net'
AS $function$
declare
  v_url     text := 'https://zarhlaoqqfgxpvbgqlwu.supabase.co/functions/v1/send-notification-sms';
  v_key     text;
  v_payload jsonb;
begin
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'edge_auth_key';

  v_payload := jsonb_build_object(
    'type', 'INSERT', 'table', 'notifications',
    'record', jsonb_build_object(
      'id', new.id, 'user_id', new.user_id, 'kind', new.kind,
      'title', new.title, 'body', new.body, 'link', new.link
    )
  );

  perform net.http_post(
    url     := v_url,
    body    := v_payload,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(v_key, '')
    )
  );
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.trg_send_notification_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'net'
AS $function$
declare
  v_url     text := 'https://zarhlaoqqfgxpvbgqlwu.supabase.co/functions/v1/send-notification-email';
  v_key     text;
  v_payload jsonb;
begin
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'edge_auth_key';

  v_payload := jsonb_build_object(
    'type', 'INSERT', 'table', 'notifications',
    'record', jsonb_build_object(
      'id', new.id, 'user_id', new.user_id, 'kind', new.kind,
      'title', new.title, 'body', new.body, 'link', new.link
    )
  );

  perform net.http_post(
    url     := v_url,
    body    := v_payload,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(v_key, '')
    )
  );
  return new;
end;
$function$;
