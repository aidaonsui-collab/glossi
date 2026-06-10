// Shared-secret gate for the notification edge functions.
//
// send-notification-email and send-notification-sms run with
// verify_jwt=false — the pg_net DB triggers that invoke them don't carry
// a Supabase JWT. Without an explicit check the endpoints are public
// relays: the email/SMS title, body, link and target user_id all come
// from the request body, so anyone who can reach the URL could send
// attacker-controlled phishing content to our users on our Resend/Twilio
// credentials (and run up the bill).
//
// The DB triggers read NOTIFY_WEBHOOK_SECRET from Supabase Vault and send
// it in the x-notify-secret header. We compare it here in constant time.
// Fail closed: a missing/blank expected secret rejects every request.

export function verifyNotifySecret(req: Request, expected: string | undefined): boolean {
  if (!expected) return false; // misconfigured → deny
  const provided = req.headers.get("x-notify-secret") ?? "";
  return constantTimeEqual(provided, expected);
}

// Length-independent constant-time string compare. Returns false on any
// length mismatch and otherwise XORs every byte so timing doesn't leak
// how many leading characters matched.
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
