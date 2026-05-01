import { loadStripe } from '@stripe/stripe-js';
import { supabase, isSupabaseConfigured } from './supabase.js';

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// loadStripe is heavy and async; share one instance across the app.
export const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;
export const isStripeConfigured = Boolean(PUBLISHABLE_KEY);

// Helper: invoke a Supabase Edge Function with the current user's JWT
// attached. Used by Settings (Connect onboarding) and the customer
// payment flow (PaymentIntent creation).
//
// On non-2xx, supabase-js wraps the response in FunctionsHttpError
// with the raw Response object on `context`. The actual error
// message lives in the response body, so we have to read it
// ourselves — supabase-js doesn't surface it.
export async function invokeEdgeFunction(name, body) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let msg = error.message || 'Edge function failed';
    try {
      const resp = error.context;
      if (resp && typeof resp.json === 'function') {
        const payload = await resp.clone().json();
        if (payload?.message) msg = payload.message;
        else if (payload?.error) msg = payload.error;
      }
    } catch { /* keep generic message */ }
    return { ok: false, error: msg, raw: error };
  }
  return { ok: true, data };
}

export const PLATFORM_FEE_PCT = 7;
