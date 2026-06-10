// send-notification-email
//
// Phase 9. Triggered by a DB webhook on notifications.INSERT (configured
// in Supabase Studio → Database → Webhooks → "send-notification-email"
// → POST {URL}/functions/v1/send-notification-email, payload type
// "application/json", payload "WHOLE record"). Body looks like:
//
//   { type: "INSERT", table: "notifications",
//     record: { id, user_id, kind, title, body, link, ... } }
//
// We:
//   1. Look up auth.users.email for the row's user_id (service-role).
//   2. Send a Resend transactional email (lightweight HTML).
//   3. Stamp notifications.email_sent_at so we don't double-send if
//      the webhook ever fires twice.
//
// verify_jwt is FALSE on this function — the pg_net DB trigger that
// invokes it doesn't ship a Supabase JWT. Authentication is via the
// x-notify-secret header (NOTIFY_WEBHOOK_SECRET), compared in constant
// time; see _shared/notifyAuth.ts and migration
// 20260610000001_notification_webhook_secret.sql for the one-time setup.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { requireEnv } from "../_shared/env.ts";
import { verifyNotifySecret } from "../_shared/notifyAuth.ts";

requireEnv(["RESEND_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "NOTIFY_WEBHOOK_SECRET"]);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const NOTIFY_WEBHOOK_SECRET = Deno.env.get("NOTIFY_WEBHOOK_SECRET")!;
const APP_URL = Deno.env.get("APP_URL") || "https://glossi.cc";
const FROM = Deno.env.get("RESEND_FROM") || "Glossi <onboarding@resend.dev>";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type, x-supabase-webhook-source, x-notify-secret",
};

function emailHtml({ title, body, ctaUrl, ctaLabel }: {
  title: string; body?: string | null; ctaUrl: string; ctaLabel: string;
}) {
  const safe = (s: string | null | undefined) => (s || "").replace(/[<>&]/g, c => (
    { "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!
  ));
  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#FAF7F2;padding:32px 16px;color:#1A1714">
<div style="max-width:520px;margin:0 auto;background:#FFFCF7;border-radius:18px;padding:32px;border:0.5px solid #E8E0D5">
  <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;color:#B68B6B">GLOSSI</div>
  <h1 style="font-family:Georgia,serif;font-style:italic;font-size:26px;font-weight:600;letter-spacing:-0.02em;margin:8px 0 14px">${safe(title)}</h1>
  ${body ? `<p style="font-size:14px;line-height:1.55;color:#5C5651;margin:0 0 22px">${safe(body)}</p>` : ""}
  <a href="${safe(ctaUrl)}" style="display:inline-block;background:#1A1714;color:#FFFCF7;text-decoration:none;padding:13px 22px;border-radius:99px;font-size:13px;font-weight:600">${safe(ctaLabel)} →</a>
  <div style="margin-top:32px;padding-top:18px;border-top:0.5px solid #E8E0D5;font-size:11px;color:#A39A8E;line-height:1.5">
    You're getting this because of activity on your Glossi account.
    <br><a href="${APP_URL}/notifications" style="color:#A39A8E">Manage notifications</a>
  </div>
</div>
</body></html>`;
}

async function sendResend(to: string, subject: string, html: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || `Resend ${r.status}`);
  return j;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  // Shared-secret gate. verify_jwt is false on this function, so this is
  // the only thing standing between the public internet and our Resend
  // credentials + arbitrary email content. Reject before any work.
  if (!verifyNotifySecret(req, NOTIFY_WEBHOOK_SECRET)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  try {
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
    const payload = await req.json().catch(() => ({} as Record<string, unknown>));
    const record = (payload as { record?: Record<string, unknown> }).record;
    if (!record || !record.id || !record.user_id) {
      throw new Error("missing notification record");
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Already sent? bail. Webhook double-fires happen.
    const { data: row } = await admin
      .from("notifications")
      .select("email_sent_at")
      .eq("id", record.id as string)
      .maybeSingle();
    if (row?.email_sent_at) {
      return new Response(JSON.stringify({ ok: true, skipped: "already_sent" }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const { data: { user } } = await admin.auth.admin.getUserById(record.user_id as string);
    if (!user?.email) {
      return new Response(JSON.stringify({ ok: true, skipped: "no_email" }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const link = (record.link as string) || "/notifications";
    const ctaUrl = link.startsWith("http") ? link : `${APP_URL}${link}`;
    const html = emailHtml({
      title: record.title as string,
      body: record.body as string | null,
      ctaUrl,
      ctaLabel: "Open Glossi",
    });

    // Fire-and-forget the Resend call + email_sent_at stamp. Same
    // reasoning as send-notification-sms: pg_net just needs us to
    // return 200 quickly, and there's no value in blocking the DB
    // trigger on a 500–1500ms HTTP call to Resend. Stamp only on
    // success — if Resend errors we log and the row stays unstamped.
    const notificationId = record.id as string;
    const recipientEmail = user.email;
    const subject = record.title as string;
    EdgeRuntime.waitUntil((async () => {
      try {
        await sendResend(recipientEmail, subject, html);
        await admin
          .from("notifications")
          .update({ email_sent_at: new Date().toISOString() })
          .eq("id", notificationId);
      } catch (err) {
        console.error(`[email] async send failed for notification=${notificationId}:`, err);
      }
    })());

    return new Response(JSON.stringify({ ok: true, queued: true, to: recipientEmail }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-notification-email error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
