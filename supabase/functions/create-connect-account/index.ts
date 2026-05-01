// create-connect-account
//
// Phase 6 onboarding endpoint. Called from Salon Settings "Connect with
// Stripe" button. Creates an Express connected account if the salon
// doesn't have one yet, then returns a fresh account_link URL the
// frontend redirects to.
//
// We mark the function verify_jwt=true so only authenticated users
// can call it. Inside, we re-verify the caller owns the business
// they're trying to onboard.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = Deno.env.get("APP_URL") ?? "https://glossi.cc";

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

    const { businessId } = await req.json().catch(() => ({}));
    if (!businessId) throw new Error("businessId required");

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data: biz, error: bizErr } = await admin
      .from("businesses")
      .select("id, owner_id, name, stripe_account_id")
      .eq("id", businessId)
      .maybeSingle();
    if (bizErr) throw bizErr;
    if (!biz || biz.owner_id !== user.id) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    let accountId = biz.stripe_account_id;
    if (!accountId) {
      const acct = await stripeForm("accounts", {
        "type": "express",
        "country": "US",
        "email": user.email ?? "",
        "capabilities[card_payments][requested]": "true",
        "capabilities[transfers][requested]": "true",
        "business_type": "individual",
        "metadata[glossi_business_id]": biz.id,
        "metadata[glossi_owner_id]": user.id,
      });
      accountId = acct.id;
      await admin.rpc("update_business_stripe_status", {
        p_business_id: biz.id,
        p_stripe_account_id: accountId,
        p_charges_enabled: !!acct.charges_enabled,
        p_payouts_enabled: !!acct.payouts_enabled,
        p_details_submitted: !!acct.details_submitted,
      });
    }

    const link = await stripeForm("account_links", {
      "account": accountId!,
      "refresh_url": `${APP_URL}/salon/settings?stripe=refresh`,
      "return_url": `${APP_URL}/salon/settings?stripe=return`,
      "type": "account_onboarding",
    });

    return new Response(
      JSON.stringify({ url: link.url, accountId }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("create-connect-account error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }
});
