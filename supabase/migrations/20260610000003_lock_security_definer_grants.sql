-- 20260610000003_lock_security_definer_grants.sql
--
-- CRITICAL FIX. Several privileged SECURITY DEFINER functions are
-- executable by the `anon` role (i.e. anyone holding the public anon API
-- key embedded in the web client), despite earlier migrations intending
-- them to be service-role-only.
--
-- Root cause: Supabase's default privileges grant EXECUTE to `anon` and
-- `authenticated` DIRECTLY on every new function created in `public`.
-- `REVOKE EXECUTE ... FROM PUBLIC` (and even FROM authenticated) does not
-- remove that *direct* grant to `anon`, so functions that revoked
-- public/authenticated but not anon stayed callable by anon via
-- /rest/v1/rpc/<fn>.
--
-- Live impact before this fix (all callable with only the public key):
--   * commit_bid_acceptance        → create a confirmed booking with
--                                    payment_status='succeeded' and NO
--                                    payment (it trusts the webhook as
--                                    its only caller and never re-checks
--                                    Stripe). Free bookings.
--   * update_business_stripe_status → overwrite ANY business's
--                                    stripe_account_id (redirect payouts
--                                    to an attacker's Connect account) and
--                                    toggle charges/payouts flags.
--   * commit_booking_cancellation  → cancel ANY booking and forge
--                                    refund/payment_status records
--                                    (caller identity is just a param).
--   * queue_notification           → write to any user's inbox and fan
--                                    out attacker-worded email/SMS.
--
-- Fix: explicitly REVOKE EXECUTE FROM anon (and authenticated/public for
-- the internal-only ones) so the grants match the original intent. These
-- functions are invoked by the Stripe webhook / DB triggers under the
-- service role, which is unaffected. Trigger functions run as the table
-- owner regardless of EXECUTE grants, so revoking them is safe hygiene.

-- ---------------------------------------------------------------------
-- Group A — internal, service-role ONLY. No client should ever call these.
-- ---------------------------------------------------------------------
revoke execute on function public.commit_bid_acceptance(uuid, text, int)         from anon, authenticated, public;
revoke execute on function public.commit_booking_cancellation(uuid, uuid, text, text, int) from anon, authenticated, public;
revoke execute on function public.update_business_stripe_status(uuid, text, boolean, boolean, boolean) from anon, authenticated, public;
revoke execute on function public.queue_notification(uuid, text, text, text, text) from anon, authenticated, public;
grant  execute on function public.commit_bid_acceptance(uuid, text, int)         to service_role;
grant  execute on function public.commit_booking_cancellation(uuid, uuid, text, text, int) to service_role;
grant  execute on function public.update_business_stripe_status(uuid, text, boolean, boolean, boolean) to service_role;
-- queue_notification: triggers call it via the table owner, not as a role,
-- so it needs no role grant at all.

-- ---------------------------------------------------------------------
-- Group B — trigger functions. Never meant to be callable as RPC.
-- ---------------------------------------------------------------------
revoke execute on function public.handle_new_user()                 from anon, authenticated, public;
revoke execute on function public.link_signup_to_prospect()         from anon, authenticated, public;
revoke execute on function public.trg_notify_on_bid_insert()        from anon, authenticated, public;
revoke execute on function public.trg_notify_on_bid_update()        from anon, authenticated, public;
revoke execute on function public.trg_notify_on_booking_insert()    from anon, authenticated, public;
revoke execute on function public.trg_notify_on_booking_update()    from anon, authenticated, public;
revoke execute on function public.trg_notify_on_review_insert()     from anon, authenticated, public;
revoke execute on function public.trg_send_notification_email()     from anon, authenticated, public;
revoke execute on function public.trg_send_notification_sms()       from anon, authenticated, public;

-- ---------------------------------------------------------------------
-- Group C — legitimate signed-in actions. They already enforce identity
-- via auth.uid() internally (anon has a null uid, so these no-op for
-- anon), but anon has no business reaching them.
--
-- NOTE: for these, anon's access comes through the PUBLIC role, not a
-- direct grant — so REVOKE ... FROM anon alone is NOT enough (anon still
-- inherits EXECUTE from PUBLIC). Revoke PUBLIC (and anon), then grant
-- authenticated explicitly so signed-in users keep access.
-- ---------------------------------------------------------------------
revoke execute on function public.accept_bid(uuid)                  from public, anon;
revoke execute on function public.prepare_bid_acceptance(uuid)      from public, anon;
revoke execute on function public.mark_booking_complete(uuid)       from public, anon;
revoke execute on function public.mark_booking_no_show(uuid)        from public, anon;
revoke execute on function public.mark_notifications_read(uuid[])   from public, anon;
revoke execute on function public.unread_notifications_count()      from public, anon;
revoke execute on function public.mark_reviews_seen(uuid)           from public, anon;
revoke execute on function public.unseen_reviews_count(uuid)        from public, anon;
revoke execute on function public.request_customer_contact(uuid)    from public, anon;
revoke execute on function public.my_bookings()                     from public, anon;
revoke execute on function public.salon_bids()                      from public, anon;
revoke execute on function public.salon_bookings(uuid)              from public, anon;
revoke execute on function public.seed_outreach_prospects(jsonb)    from public, anon;

grant execute on function public.accept_bid(uuid)                   to authenticated;
grant execute on function public.prepare_bid_acceptance(uuid)       to authenticated;
grant execute on function public.mark_booking_complete(uuid)        to authenticated;
grant execute on function public.mark_booking_no_show(uuid)         to authenticated;
grant execute on function public.mark_notifications_read(uuid[])    to authenticated;
grant execute on function public.unread_notifications_count()       to authenticated;
grant execute on function public.mark_reviews_seen(uuid)            to authenticated;
grant execute on function public.unseen_reviews_count(uuid)         to authenticated;
grant execute on function public.request_customer_contact(uuid)     to authenticated;
grant execute on function public.my_bookings()                      to authenticated;
grant execute on function public.salon_bids()                       to authenticated;
grant execute on function public.salon_bookings(uuid)               to authenticated;
grant execute on function public.seed_outreach_prospects(jsonb)     to authenticated;

-- ---------------------------------------------------------------------
-- Deliberately left callable by anon (public, read-only, or harmless):
--   business_reviews, public_business_reviews, founder_count,
--   caller_has_bid_on_request, is_glossi_admin (returns false for anon),
--   claim_founder_spot (public founder signup from /pros while logged out).
-- search_businesses is SECURITY INVOKER and stays gated by RLS.
-- ---------------------------------------------------------------------
