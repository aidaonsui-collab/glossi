// create-payment-intent
//
// Phase 6 acceptance endpoint. Customer clicks "Accept bid", frontend
// calls this with the bid_id. We:
//
//   1. prepare_bid_acceptance() validates that the caller owns the
//      request, the bid is still active, and reports the salon's
//      Connect status + price.
//   2. Create a Stripe PaymentIntent with transfer_data[destination]
//      = salon's connected account, application_fee_amount = 7%.
//      capture_method=automatic so funds settle on success; we don't
//      escrow until completion in this MVP.
//   3. Return clientSecret to the frontend so Stripe Elements can
//      confirm the payment in the browser.
//
// State doesn't change until the webhook fires payment_intent.
// succeeded — then commit_bid_acceptance flips the bid + creates
// the booking. That keeps half-paid attempts from leaving stranded
// 'accepted' bids in the DB.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const PLATFORM_FEE_BPS = 700; // 7.00% in basis points

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

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
    if (!user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });

    const { bidId } = await req.json().catch(() => ({}));
    if (!bidId) throw new Error("bidId required");

    const { data, error } = await userClient.rpc("prepare_bid_acceptance", { p_bid_id: bidId });
    if (error) throw error;
    const bid = (data ?? [])[0];
    if (!bid) throw new Error("bid not available");

    if (!bid.stripe_ready) {
      return new Response(JSON.stringify({
        error: "salon_not_payment_ready",
        message: `${bid.business_name} hasn't finished Stripe onboarding yet. Pick another bid or message them to complete setup.`,
      }), { status: 409, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    const amount = bid.price_cents as number;
    const fee = Math.round(amount * PLATFORM_FEE_BPS / 10000);

    const pi = await stripeForm("payment_intents", {
      "amount": String(amount),
      "currency": "usd",
      "capture_method": "automatic",
      "automatic_payment_methods[enabled]": "true",
      "application_fee_amount": String(fee),
      "transfer_data[destination]": bid.stripe_account_id,
      "description": `Glossi booking: ${bid.business_name} · ${bid.service_summary}`,
      "metadata[glossi_bid_id]": bid.bid_id,
      "metadata[glossi_request_id]": bid.request_id,
      "metadata[glossi_business_id]": bid.business_id,
      "metadata[glossi_customer_id]": user.id,
      "metadata[glossi_platform_fee_cents]": String(fee),
    });

    return new Response(
      JSON.stringify({
        clientSecret: pi.client_secret,
        paymentIntentId: pi.id,
        amount,
        platformFeeCents: fee,
        salonName: bid.business_name,
        serviceSummary: bid.service_summary,
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("create-payment-intent error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }
});
