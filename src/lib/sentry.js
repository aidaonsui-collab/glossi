// Sentry init — frontend error reporting.
//
// Initialized at the very top of main.jsx so it can capture errors
// from React's lifecycle, our routing, and async network calls. If
// VITE_SENTRY_DSN isn't set (local dev without Sentry configured, or
// a fork that hasn't wired up a Sentry project) initialization
// silently no-ops and the rest of the app behaves identically — no
// errors get sent, no crashes from a missing DSN.
//
// Setup (one-time):
//   1. Create a project at sentry.io (free tier: 5k errors/mo, fine
//      for early-stage). Pick "React" as the SDK.
//   2. Copy the DSN from the project's Client Keys page.
//   3. Add VITE_SENTRY_DSN=<dsn> to .env.local (local) and the
//      Vercel project's environment variables (production).
//   4. Optionally set VITE_SENTRY_ENVIRONMENT (defaults to "development"
//      in dev, "production" in build) and VITE_SENTRY_TRACES_RATE
//      (defaults to 0.1 = 10% of transactions traced).
//
// What gets captured:
//   - Uncaught JS exceptions (window.onerror / unhandledrejection)
//   - Errors thrown inside React render or lifecycle (forwarded
//     manually from src/components/ErrorBoundary.jsx)
//   - Manual captures via Sentry.captureException() if we add them
//
// What we do NOT send to Sentry: anything in dev mode (gated below)
// or PII beyond the user's auth id. Sentry's default scrubbing
// strips IPs and emails from request data; we don't enrich with user
// data here. If we want to attach the signed-in user later, set
// Sentry.setUser({ id }) inside the auth listener in store.jsx.

import * as Sentry from '@sentry/react';

let initialized = false;

export function initSentry() {
  if (initialized) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    // No DSN configured — silent no-op. Don't warn in production
    // (clutters console for forks); only warn in dev so the
    // developer knows reporting is off.
    if (import.meta.env.DEV) {
      console.info('[sentry] VITE_SENTRY_DSN not set — error reporting disabled.');
    }
    return;
  }
  if (import.meta.env.DEV) {
    // Skip in dev so noisy local crashes don't burn the monthly
    // quota. Flip this if you want to test the Sentry pipeline.
    console.info('[sentry] dev mode — error reporting disabled.');
    return;
  }
  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    // 10% of routes traced by default. Bump if we want richer
    // performance data; lower if we're hitting quota.
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_RATE ?? '0.1'),
    // Default integrations include BrowserTracing + Replay; the
    // SDK auto-enables what makes sense. We add no extras yet.
    integrations: [Sentry.browserTracingIntegration()],
    // Reject errors from third-party scripts we don't control
    // (Chrome extensions, ad-blocker noise, etc.) so the dashboard
    // doesn't fill up with stuff we can't fix.
    ignoreErrors: [
      /ResizeObserver loop limit exceeded/,
      /ResizeObserver loop completed with undelivered notifications/,
      /Non-Error promise rejection captured/,
    ],
  });
  initialized = true;
}

// Forward an error from React's componentDidCatch to Sentry. Safe to
// call even when Sentry is uninitialized — captureException is a
// no-op in that case.
export function reportError(error, info) {
  Sentry.captureException(error, {
    extra: info ? { componentStack: info.componentStack } : undefined,
  });
}
