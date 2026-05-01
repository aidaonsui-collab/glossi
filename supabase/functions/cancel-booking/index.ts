// cancel-booking
//
// Phase 7. Either side cancels a booking. We:
//
//   1. prepare_cancellation() under the caller's JWT to:
//        - confirm the row exists and the caller can cancel it
//        - read the policy decision (full refund vs no refund) from
//          the same code path the UI uses, so the math can never drift
//      Returns the payment intent + refund amount.
//   2. If refund_amount > 0, hit the Stripe API to refund the charge
//      with refund_application_fee=true and reverse_transfer=true
//      so both Glossi's 7% and the salon's destination payout get
//      pulled back atomically.
//   3. commit_booking_cancellation() under the service role to flip
//      the bookings row to status='cancelled' + record refund id.
//
// We split the read (RPC) and the write (RPC) around the Stripe call
// so a failed refund never leaves the booking in a half-cancelled
// state. If Stripe errors, we surface the message to the client and
// the row stays 'confirmed'.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function stripeForm(path: string, params: Record<string, string>) {
  const body = new URLSearchParams(params);
  const r = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-09-30.acacia",
    },
    body,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || `Stripe ${path} failed`);
  return j;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });

  try {
    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");

    const authHeader = req.headers.get("authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const { bookingId, reason } = await req.json().catch(() => ({}));
    if (!bookingId) throw new Error("bookingId required");

    const { data: prep, error: prepErr } = await userClient.rpc("prepare_cancellation", {
      p_booking_id: bookingId,
    });
    if (prepErr) throw prepErr;

    const row = (prep ?? [])[0];
    if (!row) throw new Error("booking not found");
    if (!row.cancelable_by_caller) {
      return new Response(JSON.stringify({
        error: "not_cancelable",
        message: row.status === "confirmed"
          ? "You can't cancel this booking."
          : `Booking is already ${row.status}.`,
      }), { status: 409, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    let refundId = "";
    let refundAmount = 0;

    if (row.refund_eligible && row.refund_amount_cents > 0 && row.stripe_payment_intent_id) {
      const refund = await stripeForm("refunds", {
        "payment_intent": row.stripe_payment_intent_id,
        "amount": String(row.refund_amount_cents),
        "refund_application_fee": "true",
        "reverse_transfer": "true",
        "metadata[glossi_booking_id]": bookingId,
        "metadata[glossi_caller_id]": user.id,
        "metadata[glossi_caller_role]": row.caller_role,
      });
      refundId = refund.id;
      refundAmount = row.refund_amount_cents;
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    const { error: commitErr } = await adminClient.rpc("commit_booking_cancellation", {
      p_booking_id: bookingId,
      p_caller_id: user.id,
      p_reason: reason ?? null,
      p_refund_id: refundId,
      p_refund_amount: refundAmount,
    });
    if (commitErr) throw commitErr;

    return new Response(JSON.stringify({
      ok: true,
      refundEligible: row.refund_eligible,
      refundAmountCents: refundAmount,
      refundId: refundId || null,
      callerRole: row.caller_role,
    }), { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("cancel-booking error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }
});
