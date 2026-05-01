# Supabase setup

The migrations and seed file in this directory came from the previous
Glossi prototype (Next.js). They define the full schema for a
quote-request marketplace: profiles, businesses + providers + services,
quote requests, quote bids, bookings, RLS policies, and search RPCs.

## What you need to do (one-time)

1. Create a new Supabase project at <https://app.supabase.com>.
2. In the project's **Settings → API**, copy:
   - Project URL  → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
3. Create `.env.local` in the repo root by copying `.env.example` and
   pasting those two values.
4. Apply the schema. Two ways:
   - **Easy (recommended for first run):** Open Supabase **SQL Editor**,
     paste each `migrations/*.sql` file in numerical order, click Run.
     Then paste `seed.sql` last.
   - **CLI:** `npx supabase link --project-ref <ref>` then
     `npx supabase db push` (requires Supabase CLI + project linked).
5. Add the same two env vars to Vercel: **Project Settings → Environment
   Variables** → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   for **Production** and **Preview**.
6. Re-deploy: `vercel --prod` or push a commit.

## Schema overview

```
service_catalog      — canonical 11 service slugs (haircut, color, nails…)
profiles             — auth.users row mirror with display name, role
businesses           — salon/business with location (PostGIS), hours, policy
business_providers   — multi-artist support (booth-rent salons)
business_services    — what each business offers (price, duration)
quote_requests       — customer asks for pricing in an area
quote_bids           — businesses respond with a price
bookings             — created when a customer accepts a bid
```

The current Vite app uses a different mental model (browse → book
directly). The schema above is a superset — direct bookings can be
modeled as "auto-accept the only bid" or by inserting straight into
`bookings`. We'll wire this in incrementally; until then, the app keeps
running on localStorage as before.

## Migration order

Files are timestamped with deliberate gaps (e.g. `20260414000001`,
`...000002`) so we can wedge new migrations between them later. Don't
renumber existing files — Supabase tracks them by name.
