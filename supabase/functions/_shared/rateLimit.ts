// Shared rate-limit helper for edge functions.
//
// Calls the public.check_rate_limit() RPC (defined in
// migrations/20260515000001_edge_rate_limits.sql) which upserts a single
// (key, bucket) counter row and returns true if the caller is under the
// limit. The RPC is service-role only.
//
// Failure modes:
//   - `failClosed: true` (default) — if the RPC errors (DB down, RPC
//     missing), return false (deny). Use for cost-bearing operations
//     like SMS sending where letting it through could rack up real
//     money during an outage.
//   - `failClosed: false` — if the RPC errors, return true (allow) and
//     log loudly. Use for UX-sensitive paths like payment intent
//     creation where blocking honest checkouts during a transient
//     DB hiccup is worse than letting a few extra requests through.
//
// Typical call sites construct namespaced keys like `sms:${userId}`
// or `pay:${userId}` so two different functions don't collide.

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export type RateLimitOptions = {
  /** Max calls allowed in the window. Default 10. */
  max?: number;
  /** Window length in seconds. Default 60. */
  windowSeconds?: number;
  /** On RPC error: false = deny (default), true = allow + log. */
  failClosed?: boolean;
};

export async function checkRateLimit(
  supabase: SupabaseClient,
  key: string,
  opts: RateLimitOptions = {},
): Promise<boolean> {
  const max = opts.max ?? 10;
  const windowSeconds = opts.windowSeconds ?? 60;
  const failClosed = opts.failClosed ?? true;

  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error(`[rate-limit] RPC error for key=${key}:`, error);
    return !failClosed; // failClosed=true → false (deny). failClosed=false → true (allow).
  }
  return data === true;
}
