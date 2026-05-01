import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';

// ── Generic localStorage hook ──────────────────────────────────────
export function useLocalState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? defaultValue : JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  });

  const persist = useCallback(v => {
    setValue(prev => {
      const next = typeof v === 'function' ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, [key]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = e => {
      if (e.key !== key) return;
      try { setValue(e.newValue === null ? defaultValue : JSON.parse(e.newValue)); }
      catch { /* noop */ }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, defaultValue]);

  return [value, persist];
}

// ── Auth ───────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = {
  customer: { type: 'customer', name: 'Sofia Martínez', initials: 'SM', email: 'sofia@example.com', city: 'Pharr, TX', avatar: 'linear-gradient(135deg,#E8B7A8,#B8893E)' },
  salon: { type: 'salon', name: 'Casa de Belleza', initials: 'MR', email: 'marisol@casadebelleza.com', city: 'Pharr · 4.9★', avatar: 'linear-gradient(135deg,#C28A6B,#8B4F3A)' },
};

const initialsFrom = s => (s || 'You').split(/[\s@]+/).map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
const avatarFor = role => role === 'salon'
  ? 'linear-gradient(135deg,#C28A6B,#8B4F3A)'
  : 'linear-gradient(135deg,#E8B7A8,#B8893E)';

// Map a Supabase auth user + profile row → the shape the rest of the app expects
const buildProfile = (authUser, profileRow) => {
  if (!authUser) return null;
  const meta = authUser.user_metadata || {};
  const name = profileRow?.full_name || meta.full_name || authUser.email?.split('@')[0] || 'Member';
  const role = profileRow?.is_business || meta.role === 'salon' ? 'salon' : 'customer';
  return {
    id: authUser.id,
    type: role,
    name,
    initials: initialsFrom(name),
    email: authUser.email,
    city: role === 'salon' ? 'New salon' : (profileRow?.home_zip ? `ZIP ${profileRow.home_zip}` : 'Pharr, TX'),
    avatar: profileRow?.avatar_url || avatarFor(role),
    createdAt: Date.parse(authUser.created_at) || Date.now(),
  };
};

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // Demo-mode fallback when Supabase env vars are missing (e.g. local dev without .env.local)
  const [demoUser, setDemoUser] = useLocalState('glossi.auth', DEMO_ACCOUNTS.customer);
  const [supaUser, setSupaUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Subscribe to Supabase auth state — runs once when configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    const hydrate = async session => {
      if (!session?.user) { if (!cancelled) { setSupaUser(null); setLoading(false); } return; }
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, home_zip, avatar_url, is_business, preferred_lang')
        .eq('id', session.user.id)
        .maybeSingle();
      if (!cancelled) { setSupaUser(buildProfile(session.user, profile)); setLoading(false); }
    };

    supabase.auth.getSession().then(({ data }) => hydrate(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => hydrate(session));
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, home_zip, avatar_url, is_business, preferred_lang')
      .eq('id', session.user.id)
      .maybeSingle();
    setSupaUser(buildProfile(session.user, profile));
  }, []);

  const user = isSupabaseConfigured ? supaUser : demoUser;

  const signIn = useCallback(role => {
    // Demo-mode role swap; no-op when using real auth (caller should use signInWithEmail)
    if (!isSupabaseConfigured && DEMO_ACCOUNTS[role]) setDemoUser(DEMO_ACCOUNTS[role]);
  }, [setDemoUser]);

  const signInWithEmail = useCallback(async (email, password, role = 'customer') => {
    if (!isSupabaseConfigured) {
      setDemoUser({ ...DEMO_ACCOUNTS[role], email: email || DEMO_ACCOUNTS[role].email });
      return { ok: true };
    }
    if (!password) return { ok: false, error: 'Password required.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, [setDemoUser]);

  const signUp = useCallback(async ({ name, email, password, role = 'customer' }) => {
    if (!isSupabaseConfigured) {
      setDemoUser({ type: role, name: name || 'New member', initials: initialsFrom(name || email), email, city: role === 'salon' ? 'New salon' : 'Pharr, TX', avatar: avatarFor(role), isNew: true, createdAt: Date.now() });
      return { ok: true };
    }
    if (!password) return { ok: false, error: 'Password required.' };
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role } },
    });
    if (error) return { ok: false, error: error.message };
    // Update is_business flag on the profile row that the trigger just created
    if (role === 'salon' && data.user) {
      await supabase.from('profiles').update({ is_business: true }).eq('id', data.user.id);
    }
    return { ok: true, needsConfirmation: !data.session };
  }, [setDemoUser]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    else setDemoUser(null);
  }, [setDemoUser]);

  const value = useMemo(() => ({
    user,
    loading,
    isCustomer: user?.type === 'customer',
    isSalon: user?.type === 'salon',
    signIn, signInWithEmail, signUp, signOut, refreshProfile,
  }), [user, loading, signIn, signInWithEmail, signUp, signOut, refreshProfile]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// ── Saved salons ───────────────────────────────────────────────────
export function useSaved() {
  const [ids, setIds] = useLocalState('glossi.saved', ['b1', 'b2', 'b3']);
  const isSaved = useCallback(id => ids.includes(id), [ids]);
  const toggle = useCallback(id => setIds(curr => curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]), [setIds]);
  const remove = useCallback(id => setIds(curr => curr.filter(x => x !== id)), [setIds]);
  return { ids, isSaved, toggle, remove };
}

// ── Bookings history ───────────────────────────────────────────────
// Best-effort parser for slot strings like "Today, 4:00 PM" / "Tomorrow, 11:30 AM" / "Sat, 2:00 PM".
function parseSlotToTimestamp(slot) {
  if (!slot) return Date.now() + 36 * 3600 * 1000;
  const m = String(slot).match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)/);
  let hour = 14, minute = 0;
  if (m) {
    hour = parseInt(m[1], 10);
    minute = m[2] ? parseInt(m[2], 10) : 0;
    if (/pm/i.test(m[3]) && hour < 12) hour += 12;
    if (/am/i.test(m[3]) && hour === 12) hour = 0;
  }
  const d = new Date();
  if (/today/i.test(slot)) {
    /* same day */
  } else if (/tomorrow|mañana/i.test(slot)) {
    d.setDate(d.getDate() + 1);
  } else if (/sat|sáb/i.test(slot)) {
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  } else if (/sun|dom/i.test(slot)) {
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
  } else {
    d.setDate(d.getDate() + 3);
  }
  d.setHours(hour, minute, 0, 0);
  return d.getTime();
}

export function useBookings() {
  const [bookings, setBookings] = useLocalState('glossi.bookings', []);
  const [, setNotifs] = useLocalState('glossi.notifications', SEED_NOTIFICATIONS);
  const pushNotif = (notif) => setNotifs(curr => [{ id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, ts: Date.now(), read: false, ...notif }, ...curr].slice(0, 50));

  const add = useCallback(record => {
    const entry = {
      id: `bk_${Date.now()}`, createdAt: Date.now(), status: 'upcoming',
      appointmentAt: parseSlotToTimestamp(record.slot),
      ...record,
    };
    setBookings(curr => [entry, ...curr]);
    pushNotif({
      type: 'booking',
      title: `Booked at ${record.salonName}`,
      body: `${record.service} · ${record.slot} · $${(record.total || 0).toFixed(2)}`,
      link: `/salon/${record.salonId}`,
    });
    return entry;
  }, [setBookings, setNotifs]);
  const remove = useCallback(id => setBookings(curr => curr.filter(b => b.id !== id)), [setBookings]);
  const markReviewed = useCallback((id, rating) => {
    setBookings(curr => {
      const found = curr.find(b => b.id === id);
      if (found) {
        pushNotif({
          type: 'review',
          title: `Review posted to ${found.salonName}`,
          body: `Thanks — ${rating}★ rating helps other customers find them.`,
          link: `/salon/${found.salonId}`,
        });
      }
      return curr.map(b => b.id === id ? { ...b, rating, status: 'completed' } : b);
    });
  }, [setBookings, setNotifs]);
  const cancel = useCallback((id, opts = {}) => {
    setBookings(curr => {
      const found = curr.find(b => b.id === id);
      if (found) {
        pushNotif({
          type: 'refund',
          title: `Cancelled · ${found.salonName}`,
          body: opts.refund != null ? `Refunded $${opts.refund.toFixed(2)} to your card · arrives in 1–2 days` : 'Refund processing.',
          link: '/bookings',
        });
      }
      return curr.map(b => b.id === id ? { ...b, status: 'cancelled', cancelledAt: Date.now(), refund: opts.refund } : b);
    });
  }, [setBookings, setNotifs]);
  const reschedule = useCallback((id, slot) => {
    setBookings(curr => {
      const found = curr.find(b => b.id === id);
      if (found) {
        pushNotif({
          type: 'booking',
          title: `Rescheduled · ${found.salonName}`,
          body: `New slot: ${slot}`,
          link: '/bookings',
        });
      }
      return curr.map(b => b.id === id ? { ...b, slot, appointmentAt: parseSlotToTimestamp(slot), rescheduledAt: Date.now() } : b);
    });
  }, [setBookings, setNotifs]);
  return { bookings, add, remove, markReviewed, cancel, reschedule };
}

// ── Notifications ──────────────────────────────────────────────────
const SEED_NOTIFICATIONS = [
  { id: 'n_seed1', type: 'bid', title: 'New bid from Studio Onyx', body: '$108 for Color & balayage · Tomorrow 11:30 AM', ts: Date.now() - 2 * 60 * 1000, read: false, link: '/salon/b2' },
  { id: 'n_seed2', type: 'message', title: 'Casa de Belleza confirmed your slot', body: 'See you today at 4:00 PM. Parking on the side.', ts: Date.now() - 14 * 60 * 1000, read: false, link: '/inbox/b1' },
  { id: 'n_seed3', type: 'promo', title: 'La Reina · 30% off this week', body: 'New on Glossi · introductory promo expires tonight', ts: Date.now() - 60 * 60 * 1000, read: true, link: '/salon/b3' },
];

export function useNotifications() {
  const [items, setItems] = useLocalState('glossi.notifications', SEED_NOTIFICATIONS);
  const unreadCount = items.filter(n => !n.read).length;

  const push = useCallback(notif => {
    const entry = { id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, ts: Date.now(), read: false, ...notif };
    setItems(curr => [entry, ...curr].slice(0, 50));
    return entry;
  }, [setItems]);

  const markRead = useCallback(id => setItems(curr => curr.map(n => n.id === id ? { ...n, read: true } : n)), [setItems]);
  const markAllRead = useCallback(() => setItems(curr => curr.map(n => ({ ...n, read: true }))), [setItems]);
  const clear = useCallback(() => setItems([]), [setItems]);

  return { items, unreadCount, push, markRead, markAllRead, clear };
}

// ── Reviews ───────────────────────────────────────────────────────
export function useReviews() {
  const [reviews, setReviews] = useLocalState('glossi.reviews', {});
  const add = useCallback((salonId, review) => {
    const entry = { id: `rv_${Date.now()}`, createdAt: Date.now(), ...review };
    setReviews(curr => ({ ...curr, [salonId]: [entry, ...(curr[salonId] || [])] }));
    return entry;
  }, [setReviews]);
  const forSalon = useCallback(salonId => reviews[salonId] || [], [reviews]);
  return { reviews, add, forSalon };
}

// ── Language ───────────────────────────────────────────────────────
export function useLang() {
  const [lang, setLang] = useLocalState('glossi.lang', 'en');
  const toggle = useCallback(() => setLang(l => l === 'en' ? 'es' : 'en'), [setLang]);
  return { lang, setLang, toggle };
}

// ── Customer profile (editable contact + prefs) ────────────────────
const DEFAULT_CUSTOMER_PROFILE = {
  name: 'Sofia Martínez',
  email: 'sofia@example.com',
  phone: '(956) 555-0124',
  zip: '78577',
  city: 'Pharr, TX',
  notifications: { bids: true, reminders: true, drops: false, news: true, sound: true },
};

export function useCustomerProfile() {
  const [profile, setProfile] = useLocalState('glossi.profile.customer', DEFAULT_CUSTOMER_PROFILE);
  const update = useCallback(patch => setProfile(curr => ({ ...curr, ...patch })), [setProfile]);
  const updateNotifications = useCallback(patch => setProfile(curr => ({ ...curr, notifications: { ...curr.notifications, ...patch } })), [setProfile]);
  return { profile, update, updateNotifications };
}

// ── Salon profile ──────────────────────────────────────────────────
const DEFAULT_SALON_PROFILE = {
  name: 'Casa de Belleza',
  ownerName: 'Marisol Rodríguez',
  email: 'marisol@casadebelleza.com',
  phone: '(956) 555-0142',
  address: '1612 N Cage Blvd',
  city: 'Pharr, TX 78577',
  bio: 'Two chairs, real warmth, and twelve years of color in Pharr. Marisol works small-batch — usually three clients a day.',
  serviceRadius: 5,
  hours: { Mon: '9–6', Tue: '9–6', Wed: '9–6', Thu: '9–8', Fri: '9–8', Sat: '10–4', Sun: 'closed' },
  services: [
    { name: 'Color & balayage', from: 90, to: 160, dur: '2–3 hrs', sel: true },
    { name: 'Cut & style', from: 45, to: 75, dur: '45 min', sel: true },
    { name: 'Toner refresh', from: 35, to: 55, dur: '30 min', sel: true },
    { name: 'Blowout', from: 30, to: 45, dur: '40 min', sel: true },
  ],
  // Mood IDs from the seeded PHOTOS pool. Real uploads append data: URLs to this same array.
  gallery: [
    { kind: 'mood', value: 0 },
    { kind: 'mood', value: 5 },
    { kind: 'mood', value: 6 },
    { kind: 'mood', value: 2 },
  ],
  payouts: { bank: 'Chase •••• 3829', schedule: 'weekly' },
  notifications: { newRequests: true, customerOffers: true, dailySummary: false, payouts: true },
};

export function useSalonProfile() {
  const [profile, setProfile] = useLocalState('glossi.profile.salon', DEFAULT_SALON_PROFILE);
  const update = useCallback(patch => setProfile(curr => ({ ...curr, ...patch })), [setProfile]);
  const updateHours = useCallback((day, value) => setProfile(curr => ({ ...curr, hours: { ...curr.hours, [day]: value } })), [setProfile]);
  const updateService = useCallback((idx, patch) => setProfile(curr => ({ ...curr, services: curr.services.map((s, i) => i === idx ? { ...s, ...patch } : s) })), [setProfile]);
  const addService = useCallback(s => setProfile(curr => ({ ...curr, services: [...curr.services, { sel: true, ...s }] })), [setProfile]);
  const removeService = useCallback(idx => setProfile(curr => ({ ...curr, services: curr.services.filter((_, i) => i !== idx) })), [setProfile]);
  const updateNotifications = useCallback(patch => setProfile(curr => ({ ...curr, notifications: { ...curr.notifications, ...patch } })), [setProfile]);
  const addPhoto = useCallback(dataUrl => setProfile(curr => ({ ...curr, gallery: [...curr.gallery, { kind: 'upload', value: dataUrl }] })), [setProfile]);
  const removePhoto = useCallback(idx => setProfile(curr => ({ ...curr, gallery: curr.gallery.filter((_, i) => i !== idx) })), [setProfile]);
  const movePhoto = useCallback((idx, dir) => setProfile(curr => {
    const next = [...curr.gallery];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return curr;
    [next[idx], next[target]] = [next[target], next[idx]];
    return { ...curr, gallery: next };
  }), [setProfile]);
  const setCoverPhoto = useCallback(idx => setProfile(curr => {
    if (idx === 0) return curr;
    const next = [...curr.gallery];
    const [picked] = next.splice(idx, 1);
    return { ...curr, gallery: [picked, ...next] };
  }), [setProfile]);
  return { profile, update, updateHours, updateService, addService, removeService, updateNotifications, addPhoto, removePhoto, movePhoto, setCoverPhoto };
}
