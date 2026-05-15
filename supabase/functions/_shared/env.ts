// Shared env-var validation for edge functions.
//
// Every function in this repo reads secrets with Deno.env.get("X")! at
// module load. The `!` is purely a TypeScript type assertion — at
// runtime, a missing secret resolves to undefined and the function
// silently misbehaves (Stripe calls auth as "Bearer undefined", Twilio
// fails opaquely, etc.). requireEnv(...) makes those failures loud at
// cold start instead of mysterious at runtime, which is the whole
// point of catching this category of bug at boot.
//
// Usage:
//
//   import { requireEnv } from "../_shared/env.ts";
//   requireEnv(["STRIPE_SECRET_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
//   const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
//
// We throw rather than calling Deno.exit() so the runtime surfaces the
// error in Supabase function logs instead of crashing the worker
// silently. Either way, the function returns 500 on the first request
// after a deploy with missing secrets — which is what we want.

export function requireEnv(names: string[]): void {
  const missing = names.filter((n) => !Deno.env.get(n));
  if (missing.length > 0) {
    const msg = `[env] Missing required env vars: ${missing.join(", ")}`;
    console.error(msg);
    throw new Error(msg);
  }
}
