// Glossi marketplace flow — Supabase-backed hooks for quote requests,
// bids, and bookings. Mirrors the schema in supabase/migrations.

import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase.js';
import { geocodeZip } from './geocode.js';

const VALID_PRICE_TIERS = new Set(['$', '$$', '$$$', '$$$$']);

// ── Customer side ─────────────────────────────────────────────────

// Create a new quote request. Returns { ok: true, id } or { ok: false, error }.
export async function createQuoteRequest({ serviceSlugs, zip, radius = 10, notes, earliestDate, latestDate }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  if (!serviceSlugs?.length) return { ok: false, error: 'Pick at least one service.' };
  const centroid = geocodeZip(zip);
  if (!centroid) return { ok: false, error: 'ZIP must be inside Texas (Dallas, Austin, San Antonio, RGV).' };
  if (![5, 10, 15, 25].includes(radius)) return { ok: false, error: 'Radius must be 5, 10, 15, or 25 miles.' };

  const { data, error } = await supabase.rpc('create_quote_request', {
    p_service_slugs: serviceSlugs,
    p_lat: centroid.lat,
    p_lng: centroid.lng,
    p_radius_miles: radius,
    p_zip: zip,
    p_notes: notes || null,
    p_earliest_date: earliestDate || null,
    p_latest_date: latestDate || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data, centroid };
}

// Hook: customer's own quote requests with bid counts. Refetches on mount + when refresh() is called.
export function useMyQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('quote_requests')
      .select('id, created_at, expires_at, status, service_slugs, search_zip, radius_miles, notes, quote_bids(count)')
      .order('created_at', { ascending: false });
    if (error) { setError(error.message); setQuotes([]); }
    else { setError(null); setQuotes(data || []); }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { quotes, loading, error, refresh };
}

// Hook: bids for a single quote request — used on the request-detail page so the customer can pick.
export function useBidsForQuote(requestId) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(Boolean(requestId && isSupabaseConfigured));

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !requestId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('quote_bids')
      .select('id, price_cents, estimated_duration, earliest_slot, message, status, created_at, business_id, counter_offer_cents, counter_message, counter_at, businesses(name, slug, city, price_tier, hero_image_url, verified)')
      .eq('request_id', requestId)
      .neq('status', 'withdrawn')
      .order('price_cents', { ascending: true });
    setBids(data || []);
    setLoading(false);
  }, [requestId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Subscribe to realtime inserts/updates on bids for this request
  useEffect(() => {
    if (!isSupabaseConfigured || !requestId) return;
    const ch = supabase
      .channel(`quote-bids-${requestId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_bids', filter: `request_id=eq.${requestId}` }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [requestId, refresh]);

  return { bids, loading, refresh };
}

// Accept a bid → server creates the booking row and closes the request.
export async function acceptBid(bidId) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  const { error } = await supabase.rpc('accept_bid', { p_bid_id: bidId });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Customer proposes a different price on a salon's bid.
export async function counterBid({ bidId, counterCents, message }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  if (counterCents == null || counterCents < 0) return { ok: false, error: 'Enter a counter price.' };
  const { error } = await supabase.rpc('counter_bid', {
    p_bid_id: bidId,
    p_counter_cents: counterCents,
    p_counter_message: message || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Booking lifecycle (Phase 7) ───────────────────────────────────

// Read-only: pull the cancellation policy decision for a booking from
// the same RPC the cancel-booking edge function uses, so the UI shows
// the exact refund amount that will land.
export async function fetchCancellationPreview(bookingId) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  const { data, error } = await supabase.rpc('prepare_cancellation', { p_booking_id: bookingId });
  if (error) return { ok: false, error: error.message };
  const row = (data || [])[0];
  if (!row) return { ok: false, error: 'Booking not found.' };
  return { ok: true, preview: row };
}

// Cancels via the cancel-booking edge function so the Stripe refund
// (with reverse_transfer) and the DB write happen together.
export async function cancelBooking({ bookingId, reason }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return { ok: false, error: 'Sign in to cancel.' };
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-booking`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookingId, reason: reason || null }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, error: j.message || j.error || 'Cancellation failed.' };
  return { ok: true, ...j };
}

export async function markBookingComplete(bookingId) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  const { error } = await supabase.rpc('mark_booking_complete', { p_booking_id: bookingId });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function markBookingNoShow(bookingId) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  const { error } = await supabase.rpc('mark_booking_no_show', { p_booking_id: bookingId });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function submitReview({ bookingId, rating, body }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  if (!rating || rating < 1 || rating > 5) return { ok: false, error: 'Pick 1–5 stars.' };
  const { data, error } = await supabase.rpc('submit_review', {
    p_booking_id: bookingId,
    p_rating: rating,
    p_body: body || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data };
}

export async function replyToReview({ reviewId, reply }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  const { error } = await supabase.rpc('reply_to_review', {
    p_review_id: reviewId,
    p_reply: reply ?? null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Hook: every review the salon's primary business has received, joined
// with the booking it came from. Realtime subscribed so a freshly-
// posted review surfaces without a refresh.
export function useBusinessReviews(businessId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(Boolean(businessId && isSupabaseConfigured));

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !businessId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc('business_reviews', { p_business_id: businessId });
    if (error) { console.error('business_reviews error', error); setReviews([]); }
    else setReviews(data || []);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!isSupabaseConfigured || !businessId) return;
    const ch = supabase
      .channel(`business-reviews-${businessId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews', filter: `business_id=eq.${businessId}` }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [businessId, refresh]);

  return { reviews, loading, refresh };
}

// Hook: small badge count of reviews newer than businesses.reviews_seen_at.
// Polled via realtime on the reviews table so the nav badge updates live.
export function useUnseenReviewsCount(businessId) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !businessId) { setCount(0); return; }
    const { data, error } = await supabase.rpc('unseen_reviews_count', { p_business_id: businessId });
    if (error) { console.error('unseen_reviews_count error', error); return; }
    setCount(typeof data === 'number' ? data : 0);
  }, [businessId]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!isSupabaseConfigured || !businessId) return;
    const ch = supabase
      .channel(`unseen-reviews-${businessId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews', filter: `business_id=eq.${businessId}` }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [businessId, refresh]);

  return { count, refresh };
}

export async function markReviewsSeen(businessId) {
  if (!isSupabaseConfigured || !businessId) return { ok: false };
  const { error } = await supabase.rpc('mark_reviews_seen', { p_business_id: businessId });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Hook: anon-callable list for the public salon profile page.
export function usePublicBusinessReviews(businessId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(Boolean(businessId && isSupabaseConfigured));

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !businessId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.rpc('public_business_reviews', { p_business_id: businessId });
    setReviews(data || []);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { reviews, loading, refresh };
}

// ── Salon side ────────────────────────────────────────────────────

// Hook: get the businesses the current user owns. Salons need this to know what
// inbox to show (a user could in theory own multiple businesses).
export function useMyBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    // RLS lets anyone read published businesses (the public Explore page needs that),
    // so we have to filter to the caller explicitly here — otherwise the inbox switcher
    // shows every salon in the DB. Use getSession() (local cache) instead of getUser()
    // (network call) so the inbox isn't blocked by a slow/stuck token-refresh round trip.
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) { setBusinesses([]); setLoading(false); return; }
    const { data } = await supabase
      .from('businesses')
      .select('id, slug, name, city, hero_image_url, published, verified')
      .eq('owner_id', userId)
      .order('created_at', { ascending: true });
    setBusinesses(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { businesses, loading, refresh };
}

// Hook: full row for the salon owner's primary business — used by Settings.
// Returns the row, a save() that calls update_business, plus loading/error state.
export function useMyBusinessProfile() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) { setBusiness(null); setLoading(false); return; }
    const { data, error } = await supabase
      .from('businesses')
      .select('id, slug, name, bio_en, address_line1, city, state, postal_code, phone, website, instagram, price_tier, hero_image_url, published, verified, stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, stripe_details_submitted')
      .eq('owner_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) { setError(error.message); setBusiness(null); }
    else { setError(null); setBusiness(data || null); }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Save name/bio/address/contact/price_tier. Geocodes the postal_code so the
  // PostGIS location stays consistent — same approach as create_business.
  const save = useCallback(async patch => {
    if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
    if (!business?.id) return { ok: false, error: 'No business to update.' };
    const next = { ...business, ...patch };
    if (!next.name?.trim()) return { ok: false, error: 'Salon name required.' };
    const tier = next.price_tier && VALID_PRICE_TIERS.has(next.price_tier) ? next.price_tier : '$$';
    const centroid = next.postal_code ? geocodeZip(next.postal_code) : null;
    if (next.postal_code && !centroid) return { ok: false, error: 'ZIP must be inside Texas (Dallas, Austin, San Antonio, RGV).' };
    const { error } = await supabase.rpc('update_business', {
      p_business_id: business.id,
      p_name: next.name.trim(),
      p_bio: next.bio_en ?? null,
      p_address: next.address_line1 ?? null,
      p_city: next.city ?? null,
      p_postal_code: next.postal_code ?? null,
      p_lat: centroid?.lat ?? 0,
      p_lng: centroid?.lng ?? 0,
      p_phone: next.phone ?? null,
      p_website: next.website ?? null,
      p_instagram: next.instagram ?? null,
      p_price_tier: tier,
    });
    if (error) return { ok: false, error: error.message };
    await refresh();
    return { ok: true };
  }, [business, refresh]);

  return { business, loading, error, save, refresh };
}

// Hook: a salon's inbox of nearby quote requests with their bid status.
export function useSalonInbox(businessId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(businessId && isSupabaseConfigured));

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !businessId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc('business_inbox', { p_business_id: businessId });
    if (error) { console.error('business_inbox error', error); setItems([]); }
    else setItems(data || []);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime: any new quote_request OR bid status change in this business's area
  useEffect(() => {
    if (!isSupabaseConfigured || !businessId) return;
    const ch = supabase
      .channel(`salon-inbox-${businessId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_bids' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [businessId, refresh]);

  return { items, loading, refresh };
}

// Hook: every bid the salon owner has submitted across all their
// businesses, joined with the request so the list can render service
// + ZIP + posted-at without a second round-trip. Used by /salon/bids.
export function useMyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    // Single RPC pulls bid + request + customer contact in one round
    // trip (see migration 0501_007). Direct quote_bids select with
    // embeds left names blank in the list because customer info
    // lives in auth.users / profiles which are RLS-locked to the
    // caller. The RPC bypasses that with SECURITY DEFINER + an
    // ownership check.
    const { data, error } = await supabase.rpc('salon_bids');
    if (error) { console.error('useMyBids error', error); setBids([]); }
    else setBids(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime: any bid status change on the salon's businesses or any
  // request flip (open → booked) refreshes the list so the salon sees
  // a "won" badge appear without needing to reload.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const ch = supabase
      .channel('my-bids')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_bids' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [refresh]);

  return { bids, loading, refresh };
}

// Submit (or update) a bid on a quote request.
export async function submitBid({ businessId, requestId, priceCents, durationMin, earliestSlot, message, providerId }) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase not configured.' };
  if (priceCents == null || priceCents < 0) return { ok: false, error: 'Price required.' };
  if (durationMin == null || durationMin <= 0) return { ok: false, error: 'Duration required.' };
  const { data, error } = await supabase.rpc('submit_bid', {
    p_business_id: businessId,
    p_request_id: requestId,
    p_price_cents: priceCents,
    p_estimated_duration: durationMin,
    p_earliest_slot: earliestSlot || null,
    p_message: message || null,
    p_provider_id: providerId || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data };
}

// Hook: bookings for one of the salon owner's businesses, joined with
// the customer (name/email/phone) and the original request
// (service_slugs, notes, ZIP) on the server. Used by Calendar /
// Clients / Earnings — one query feeds all three pages.
export function useSalonBookingsList(businessId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(Boolean(businessId && isSupabaseConfigured));

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !businessId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc('salon_bookings', { p_business_id: businessId });
    if (error) { console.error('salon_bookings error', error); setBookings([]); }
    else setBookings(data || []);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime: refresh when a new booking lands or when an existing one
  // changes status (cancelled, completed). Scoped to the business id.
  useEffect(() => {
    if (!isSupabaseConfigured || !businessId) return;
    const ch = supabase
      .channel(`salon-bookings-${businessId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `business_id=eq.${businessId}` }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [businessId, refresh]);

  return { bookings, loading, refresh };
}

// ── Bookings (for /bookings list) ─────────────────────────────────

export function useSupabaseBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    // SECURITY DEFINER RPC bundles the booking + business + service +
    // review joins in one round trip. Replaces a PostgREST embed that
    // silently returned empty review arrays when the schema-cache
    // FK lookup misfired, leaving 'Leave a review' stuck on already-
    // reviewed bookings.
    const { data, error } = await supabase.rpc('my_bookings');
    if (error) console.error('my_bookings error', error);
    setBookings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime: refresh when this customer's bookings change (e.g. a salon
  // marks complete, a cancellation lands) OR when a review is inserted
  // (so the "Leave a review" button on the row flips to stars without
  // a manual reload). RLS gates the read so other customers' rows
  // can't leak in.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const ch = supabase
      .channel('my-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [refresh]);

  // Optimistic merge so the UI doesn't have to wait on the explicit
  // refresh after a review submit — the BookingLifecycleModal calls
  // this with { bookingId, rating, body } the moment the RPC succeeds.
  const applyLocalReview = useCallback(({ bookingId, rating, body }) => {
    setBookings(curr => curr.map(b => b.booking_id === bookingId
      ? { ...b, review_id: b.review_id || 'local', review_rating: rating, review_body: body }
      : b
    ));
  }, []);

  return { bookings, loading, refresh, applyLocalReview };
}
