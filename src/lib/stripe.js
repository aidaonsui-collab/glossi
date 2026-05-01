import { loadStripe } from '@stripe/stripe-js';
import { supabase, isSupabaseConfigured } from './supabase.js';

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// loadStripe is heavy and async; share one instance across the app.
export const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;
export const isStripeConfigured = Boolean(PUBLISHABLE_KEY);

// Helper: invoke a Supabase Edge Function with the current user's JWT
// attached. Used by Settings (Connect onboarding) and the customer
// payment flow (PaymentIntent creation).
export async function invokeEdgeFunction(name, body) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    // FunctionsHttpError exposes context with the body the function returned
    const msg = error.context?.errorMessage || error.message || 'Edge function failed';
    return { ok: false, error: msg, raw: error };
  }
  return { ok: true, data };
}

export const PLATFORM_FEE_PCT = 7;
