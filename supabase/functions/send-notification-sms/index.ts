// send-notification-sms
//
// Phase A. Triggered from the same notifications.INSERT pattern as
// send-notification-email — DB trigger trg_send_notification_sms fires
// pg_net to this function with payload:
//
//   { type: "INSERT", table: "notifications",
//     record: { id, user_id, kind, title, body, link } }
//
// Flow:
//   1. Skip if notifications.sms_sent_at already stamped (idempotency
//      against webhook double-fires).
//   2. Look up profiles.{phone, sms_notifications}. Skip if no phone,
//      or sms_notifications is false.
//   3. Send via Twilio (form-encoded POST to Messages.json).
//   4. Stamp notifications.sms_sent_at.
//
// Setup (one-time, manual):
//   - Twilio account + US number purchased + A2P 10DLC brand
//     registration approved.
//   - Set these Supabase Function secrets:
//       TWILIO_ACCOUNT_SID
//       TWILIO_AUTH_TOKEN
//       TWILIO_MESSAGING_SERVICE_SID  (preferred — required for
//                                      10DLC compliance)
//     or fall back to:
//       TWILIO_FROM_NUMBER            (E.164 format, e.g. +18885551234)
//   - Deploy: `supabase functions deploy send-notification-sms`
//
// SMS template (kept under ~320 chars = 2 segments worst case):
//
//   [Glossi] {title}
//   {body, truncated}
//   Open: {APP_URL}{link}
//
//   Reply STOP to opt out.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
const TWILIO_MESSAGING_SERVICE_SID = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = Deno.env.get("APP_URL") || "https://glossi.cc";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type, x-supabase-webhook-source",
};

// Normalize a US phone to E.164. Accepts "(956) 555-1234", "9565551234",
// "+19565551234", etc. Returns null if it can't be parsed.
function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (raw.startsWith("+") && digits.length >= 11) return `+${digits}`;
  return null;
}

function buildSmsBody(title: string, body: string | null, link: string | null): string {
  const url = link
    ? (link.startsWith("http") ? link : `${APP_URL}${link}`)
    : APP_URL;
  // Truncate body so the total stays around 2 SMS segments worst-case.
  // GSM-7 segments are 160 chars (153 in multi-segment); we aim for ≤320.
  const maxBodyLen = 90;
  const trimmedBody = body && body.length > maxBodyLen
    ? body.slice(0, maxBodyLen - 1).trimEnd() + "…"
    : (body || "");
  const lines = [
    `[Glossi] ${title}`,
    trimmedBody,
    `Open: ${url}`,
    "",
    "Reply STOP to opt out.",
  ].filter(Boolean);
  return lines.join("\n");
}

async function sendTwilio(to: string, body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio credentials not configured");
  }
  if (!TWILIO_MESSAGING_SERVICE_SID && !TWILIO_FROM_NUMBER) {
    throw new Error("Twilio sender not configured (set MESSAGING_SERVICE_SID or FROM_NUMBER)");
  }
  const params = new URLSearchParams({ To: to, Body: body });
  if (TWILIO_MESSAGING_SERVICE_SID) {
    params.set("MessagingServiceSid", TWILIO_MESSAGING_SERVICE_SID);
  } else if (TWILIO_FROM_NUMBER) {
    params.set("From", TWILIO_FROM_NUMBER);
  }
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || `Twilio ${r.status}: ${j.error_message || "send failed"}`);
  return j;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  try {
    const payload = await req.json().catch(() => ({} as Record<string, unknown>));
    const record = (payload as { record?: Record<string, unknown> }).record;
    if (!record || !record.id || !record.user_id) {
      throw new Error("missing notification record");
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Idempotency: already sent this SMS?
    const { data: row } = await admin
      .from("notifications")
      .select("sms_sent_at")
      .eq("id", record.id as string)
      .maybeSingle();
    if (row?.sms_sent_at) {
      return new Response(JSON.stringify({ ok: true, skipped: "already_sent" }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Look up the recipient's phone + opt-in preference.
    const { data: profile } = await admin
      .from("profiles")
      .select("phone, sms_notifications")
      .eq("id", record.user_id as string)
      .maybeSingle();

    if (!profile?.sms_notifications) {
      return new Response(JSON.stringify({ ok: true, skipped: "opted_out" }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
    const to = toE164(profile.phone);
    if (!to) {
      return new Response(JSON.stringify({ ok: true, skipped: "no_phone" }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const body = buildSmsBody(
      record.title as string,
      (record.body as string | null) ?? null,
      (record.link as string | null) ?? null,
    );

    await sendTwilio(to, body);

    await admin
      .from("notifications")
      .update({ sms_sent_at: new Date().toISOString() })
      .eq("id", record.id as string);

    return new Response(JSON.stringify({ ok: true, to }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-notification-sms error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
