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
      .select('id, price_cents, estimated_duration, earliest_slot, message, status, created_at, business_id, businesses(name, slug, city, price_tier, hero_image_url, verified)')
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
      .select('id, slug, name, bio_en, address_line1, city, state, postal_code, phone, website, instagram, price_tier, hero_image_url, published, verified')
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
    // RLS quote_bids_business_all already restricts SELECT to bids on
    // businesses the caller owns — we trust the policy here instead of
    // adding an .eq('businesses.owner_id', ...) filter, because the
    // embedded-filter syntax was returning zero rows for some salons
    // even when the data was clearly there.
    const { data, error } = await supabase
      .from('quote_bids')
      .select('id, price_cents, estimated_duration, earliest_slot, message, status, created_at, business_id, businesses(id, name), quote_requests(id, status, service_slugs, search_zip, notes, created_at, expires_at)')
      .order('created_at', { ascending: false });
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
    // Join bid → request so the row carries service_slugs (the original
    // request) — Bookings.jsx needs this to render "Color, Nails" etc.
    // RLS gates everything via bookings_customer_read on the parent row.
    const { data } = await supabase
      .from('bookings')
      .select('id, scheduled_at, duration_min, price_cents, deposit_cents, status, created_at, business_id, businesses(name, slug, city, hero_image_url), quote_bids(quote_requests(service_slugs))')
      .order('scheduled_at', { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { bookings, loading, refresh };
}
