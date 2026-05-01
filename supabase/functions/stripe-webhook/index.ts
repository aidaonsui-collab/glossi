// stripe-webhook
//
// Phase 6 webhook receiver. Listens for:
//
//   payment_intent.succeeded → commit_bid_acceptance() flips the
//     bid + creates the booking. Idempotent on bid_id.
//   payment_intent.payment_failed → log only; the customer's
//     Stripe Elements form already shows the error to them.
//   account.updated → refresh stripe_charges_enabled /
//     stripe_payouts_enabled / stripe_details_submitted on the
//     business so the Settings UI knows when onboarding is done.
//
// Stripe's v2 "event destinations" UI splits payment events ("Your
// account") and connect events ("Connected and v2 accounts") into
// separate destinations, each with its own signing secret. We
// accept up to two secrets and try them in order — the right one
// for each event will be the one Stripe used to sign it.
//
// verify_jwt is FALSE on this function — Stripe doesn't send a
// Supabase JWT. Authentication is via the Stripe-Signature header.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function collectSecrets(): string[] {
  const out: string[] = [];
  for (const k of ["STRIPE_WEBHOOK_SECRET", "STRIPE_WEBHOOK_SECRET_CONNECT"]) {
    const v = Deno.env.get(k);
    if (v) out.push(v);
  }
  return out;
}

const encoder = new TextEncoder();

async function verifyAgainstSecret(payload: string, sigHeader: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    sigHeader.split(",").map(kv => {
      const [k, ...rest] = kv.split("=");
      return [k, rest.join("=")];
    })
  ) as Record<string, string>;
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  const skew = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  return mismatch === 0 && skew <= 300;
}

async function verifyStripeSignature(payload: string, sigHeader: string, secrets: string[]): Promise<boolean> {
  for (const s of secrets) {
    if (await verifyAgainstSecret(payload, sigHeader, s)) return true;
  }
  return false;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  const secrets = collectSecrets();
  if (secrets.length === 0) {
    console.error("no STRIPE_WEBHOOK_SECRET configured");
    return new Response("misconfigured", { status: 500 });
  }
  if (!sig || !(await verifyStripeSignature(body, sig, secrets))) {
    return new Response("invalid signature", { status: 400 });
  }

  let event: any;
  try { event = JSON.parse(body); } catch { return new Response("bad json", { status: 400 }); }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const bidId = pi.metadata?.glossi_bid_id;
      const fee  = parseInt(pi.metadata?.glossi_platform_fee_cents ?? "0", 10);
      if (!bidId) {
        console.warn("pi.succeeded without glossi_bid_id, skipping", pi.id);
      } else {
        const { error } = await admin.rpc("commit_bid_acceptance", {
          p_bid_id: bidId,
          p_payment_intent_id: pi.id,
          p_platform_fee_cents: fee,
        });
        if (error) {
          console.error("commit_bid_acceptance failed", error);
          return new Response("db error", { status: 500 });
        }
      }
    } else if (event.type === "payment_intent.payment_failed") {
      console.log("payment_intent.payment_failed", event.data.object.id);
    } else if (event.type === "account.updated") {
      const acct = event.data.object;
      const businessId = acct.metadata?.glossi_business_id;
      if (businessId) {
        const { error } = await admin.rpc("update_business_stripe_status", {
          p_business_id: businessId,
          p_stripe_account_id: acct.id,
          p_charges_enabled: !!acct.charges_enabled,
          p_payouts_enabled: !!acct.payouts_enabled,
          p_details_submitted: !!acct.details_submitted,
        });
        if (error) console.error("update_business_stripe_status failed", error);
      } else {
        console.warn("account.updated without glossi_business_id metadata", acct.id);
      }
    }
  } catch (err) {
    console.error("webhook handler error", err);
    return new Response("handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
