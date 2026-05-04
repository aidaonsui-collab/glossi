import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth, useSalonProfile } from '../store.jsx';
import { useMyBusinessProfile } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { invokeEdgeFunction } from '../lib/stripe.js';

// Fields that come from Supabase (the real businesses row). Other sections
// of this page — hours, services, photos, payouts, notifications — are
// still localStorage stubs in useSalonProfile.
const EMPTY_BIZ_DRAFT = {
  name: '', bio_en: '', address_line1: '', city: '', postal_code: '',
  phone: '', website: '', instagram: '', price_tier: '$$',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const NOTIFICATION_LABELS = {
  newRequests: { l: 'New requests', d: 'Push when a request lands within your radius' },
  customerOffers: { l: 'Customer counter-offers', d: 'Customers proposing a price' },
  dailySummary: { l: 'Daily summary', d: 'Yesterday at a glance, sent each morning' },
  payouts: { l: 'Payout confirmations', d: "When Stripe deposits hit your bank" },
};

export default function SalonSettings() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { signOut } = useAuth();
  const { profile, update, updateHours, updateService, addService, removeService, updateNotifications, addPhoto, removePhoto, movePhoto, setCoverPhoto } = useSalonProfile();
  const { business, loading: bizLoading, save: saveBiz, refresh: refreshBiz } = useMyBusinessProfile();
  const photoInputRef = useRef(null);

  const onPhotoPick = e => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = () => addPhoto(r.result);
      r.readAsDataURL(f);
    });
    e.target.value = '';
    if (files.length) toast(`${files.length} photo${files.length === 1 ? '' : 's'} added.`, { tone: 'success' });
  };

  const photoUrl = item => item.kind === 'upload' ? item.value : PHOTOS[item.value % PHOTOS.length];

  const [draft, setDraft] = useState(profile);
  const [bizDraft, setBizDraft] = useState(EMPTY_BIZ_DRAFT);
  const [saving, setSaving] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [serviceDraft, setServiceDraft] = useState({ name: '', from: 50, to: 90, dur: '1 hr' });
  const [showAddService, setShowAddService] = useState(false);

  // After Stripe Connect onboarding, the salon comes back with
  // ?stripe=return in the URL. Force-refresh the businesses row so
  // the UI flips from "Connect" → "Verified" without waiting for
  // the realtime subscription. Read the flag straight off
  // window.location to keep the effect's dependency surface simple
  // — using useSearchParams + setSearchParams here introduced a
  // re-render loop that was blanking the page.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const flag = params.get('stripe');
    if (!flag) return;
    refreshBiz();
    if (flag === 'return') toast('Welcome back. Stripe is verifying your details — payouts unlock as soon as they finish.', { tone: 'success' });
    if (flag === 'refresh') toast('That onboarding link expired — start a new one.', { tone: 'warn' });
    // Strip the query param without triggering a router state update,
    // so we don't re-fire this effect or any sibling that depends on
    // useSearchParams.
    params.delete('stripe');
    const qs = params.toString();
    const newUrl = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
    window.history.replaceState(null, '', newUrl);
    // Eslint-disable: we intentionally run once on mount; refreshBiz
    // and toast are stable callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hydrate Business info section from the live row whenever it (re)loads
  useEffect(() => {
    if (!business) return;
    setBizDraft({
      name: business.name || '',
      bio_en: business.bio_en || '',
      address_line1: business.address_line1 || '',
      city: business.city || '',
      postal_code: business.postal_code || '',
      phone: business.phone || '',
      website: business.website || '',
      instagram: business.instagram || '',
      price_tier: business.price_tier || '$$',
    });
  }, [business]);

  const localDirty = JSON.stringify(draft) !== JSON.stringify(profile);
  const bizDirty = business ? Object.keys(bizDraft).some(k => (bizDraft[k] || '') !== (business[k] || (k === 'price_tier' ? '$$' : ''))) : false;
  const dirty = localDirty || bizDirty;

  const save = async () => {
    setSaving(true);
    try {
      if (localDirty) update(draft);
      if (bizDirty && business) {
        const result = await saveBiz(bizDraft);
        if (!result.ok) { toast(result.error || 'Could not save business info.', { tone: 'warn' }); return; }
      }
      toast('Salon settings saved.', { tone: 'success' });
    } finally {
      setSaving(false);
    }
  };

  const onDiscard = () => {
    setDraft(profile);
    if (business) refreshBiz();
  };

  // Stripe Connect onboarding. Calls the Edge Function which creates
  // (or reuses) the salon's Express account and returns a fresh
  // account_link URL. We replace the whole window so Stripe's hosted
  // form can take over; on completion they redirect back to /salon/
  // settings?stripe=return.
  const onConnectStripe = async () => {
    if (!business?.id) {
      toast('Save business info first.', { tone: 'warn' });
      return;
    }
    setConnectLoading(true);
    const result = await invokeEdgeFunction('create-connect-account', { businessId: business.id });
    setConnectLoading(false);
    if (!result.ok) {
      toast(result.error || 'Could not start Stripe onboarding.', { tone: 'warn' });
      return;
    }
    if (result.data?.url) {
      window.location.href = result.data.url;
    } else {
      toast('Stripe did not return an onboarding link.', { tone: 'warn' });
    }
  };

  const stripeReady = business?.stripe_charges_enabled && business?.stripe_payouts_enabled;
  const stripePending = business?.stripe_account_id && !stripeReady;

  const Section = ({ title, eyebrow, children }) => (
    <section style={{ marginTop: 28 }}>
      {eyebrow && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{eyebrow}</div>}
      <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 30, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1.05, margin: '6px 0 14px' }}>{title}</h2>
      <div style={{ background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>{children}</div>
    </section>
  );

  const Field = ({ label, children, last }) => (
    <div style={{ padding: '14px 18px', borderBottom: last ? 0 : `0.5px solid ${p.line}`, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '180px 1fr', gap: isPhone ? 6 : 14, alignItems: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: p.inkSoft }}>{label}</div>
      <div>{children}</div>
    </div>
  );

  const input = {
    width: '100%', padding: '10px 12px', background: p.bg, border: `0.5px solid ${p.line}`, borderRadius: 10,
    fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <SalonLayout active="settings" mobileTitle="Settings">
      <div style={{ padding: isPhone ? '20px 18px 32px' : '34px 40px 60px', maxWidth: 880 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>SETTINGS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Your salon.</h1>
        <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
          Everything customers see on your profile + how Glossi pays you.
        </p>

        {/* Hero — pulls from the live businesses row, not localStorage */}
        <div style={{ marginTop: 22, padding: '20px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 99, background: 'linear-gradient(135deg,#C28A6B,#8B4F3A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 22, fontWeight: 700 }}>
            {(bizDraft.name || '?').split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.015em' }}>
              {bizLoading ? 'Loading…' : (bizDraft.name || 'Set up your salon')}
            </div>
            <div style={{ fontSize: 12.5, color: p.inkMuted, marginTop: 2 }}>
              {[bizDraft.address_line1, bizDraft.city, bizDraft.postal_code].filter(Boolean).join(' · ') || '—'}
            </div>
          </div>
          {business?.slug && (
            <button onClick={() => navigate(`/salon/${business.slug}`)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>View public profile →</button>
          )}
        </div>

        {!isSupabaseConfigured ? (
          <div style={{ marginTop: 18, padding: 16, background: p.surface, borderRadius: 12, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13 }}>
            Supabase isn't configured — Business info needs a backend.
          </div>
        ) : !bizLoading && !business ? (
          <div style={{ marginTop: 18, padding: 16, background: p.surface, borderRadius: 12, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13 }}>
            No salon listing yet. <button onClick={() => navigate('/onboarding/salon')} style={{ background: 'transparent', border: 0, color: p.accent, cursor: 'pointer', fontWeight: 600, padding: 0 }}>Create one →</button>
          </div>
        ) : null}

        <Section title="Business info" eyebrow="01 · BASICS">
          <Field label="Salon name">
            <input value={bizDraft.name} onChange={e => setBizDraft({ ...bizDraft, name: e.target.value })} disabled={!business} style={input} />
          </Field>
          <Field label="Phone">
            <input value={bizDraft.phone} onChange={e => setBizDraft({ ...bizDraft, phone: e.target.value })} disabled={!business} style={input} />
          </Field>
          <Field label="Address">
            <input value={bizDraft.address_line1} onChange={e => setBizDraft({ ...bizDraft, address_line1: e.target.value })} disabled={!business} style={input} />
          </Field>
          <Field label="City">
            <input value={bizDraft.city} onChange={e => setBizDraft({ ...bizDraft, city: e.target.value })} disabled={!business} style={input} />
          </Field>
          <Field label="ZIP">
            <input value={bizDraft.postal_code} onChange={e => setBizDraft({ ...bizDraft, postal_code: e.target.value.replace(/\D/g, '').slice(0, 5) })} inputMode="numeric" disabled={!business} style={{ ...input, fontFamily: type.mono, letterSpacing: '0.1em' }} />
          </Field>
          <Field label="Website">
            <input value={bizDraft.website} onChange={e => setBizDraft({ ...bizDraft, website: e.target.value })} placeholder="https://…" disabled={!business} style={input} />
          </Field>
          <Field label="Instagram">
            <input value={bizDraft.instagram} onChange={e => setBizDraft({ ...bizDraft, instagram: e.target.value })} placeholder="@handle" disabled={!business} style={input} />
          </Field>
          <Field label="Price tier">
            <div style={{ display: 'inline-flex', background: p.bg, borderRadius: 99, border: `0.5px solid ${p.line}`, padding: 3 }}>
              {['$', '$$', '$$$', '$$$$'].map(t => {
                const a = bizDraft.price_tier === t;
                return (
                  <button key={t} type="button" onClick={() => setBizDraft({ ...bizDraft, price_tier: t })} disabled={!business} style={{
                    padding: '7px 14px', borderRadius: 99, border: 0,
                    background: a ? p.ink : 'transparent', color: a ? p.bg : p.ink,
                    fontFamily: type.mono, fontSize: 12.5, fontWeight: 600, cursor: business ? 'pointer' : 'not-allowed',
                  }}>{t}</button>
                );
              })}
            </div>
          </Field>
          <Field label="Bio" last>
            <textarea value={bizDraft.bio_en} onChange={e => setBizDraft({ ...bizDraft, bio_en: e.target.value })} rows={3} disabled={!business} style={{ ...input, resize: 'vertical', lineHeight: 1.5 }} />
          </Field>
        </Section>

        <Section title="Hours" eyebrow="02 · WHEN YOU'RE OPEN">
          {DAYS.map((d, i) => {
            const closed = profile.hours[d] === 'closed';
            return (
              <div key={d} style={{ padding: '14px 18px', borderBottom: i < DAYS.length - 1 ? `0.5px solid ${p.line}` : 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: p.ink, width: 60 }}>{d}</div>
                <button onClick={() => updateHours(d, closed ? '9–5' : 'closed')} style={{
                  width: 42, height: 24, borderRadius: 99, position: 'relative', cursor: 'pointer',
                  background: closed ? p.line : p.success, transition: 'background 0.2s', border: 0, padding: 0, fontFamily: 'inherit',
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: 99, background: '#fff', position: 'absolute', top: 3, left: closed ? 3 : 21, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
                </button>
                {!closed ? (
                  <input value={profile.hours[d]} onChange={e => updateHours(d, e.target.value)} placeholder="9–5" style={{ ...input, fontFamily: type.mono, maxWidth: 140 }} />
                ) : (
                  <span style={{ fontSize: 13, color: p.inkMuted, fontStyle: 'italic' }}>Closed</span>
                )}
              </div>
            );
          })}
        </Section>

        <Section title="Services & pricing" eyebrow="03 · MENU">
          {profile.services.map((s, i) => (
            <div key={i} style={{ padding: '14px 18px', borderBottom: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <input value={s.name} onChange={e => updateService(i, { name: e.target.value })} style={{ ...input, flex: '1 1 200px', fontWeight: 600 }} />
              <input value={s.dur} onChange={e => updateService(i, { dur: e.target.value })} placeholder="duration" style={{ ...input, maxWidth: 100, fontFamily: type.mono, fontSize: 12.5 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: type.mono, fontSize: 13 }}>
                <span>$</span>
                <input type="number" value={s.from} onChange={e => updateService(i, { from: Number(e.target.value) || 0 })} style={{ ...input, width: 60, textAlign: 'right', fontFamily: type.mono }} />
                <span style={{ color: p.inkMuted }}>–$</span>
                <input type="number" value={s.to} onChange={e => updateService(i, { to: Number(e.target.value) || 0 })} style={{ ...input, width: 60, textAlign: 'right', fontFamily: type.mono }} />
              </div>
              <button onClick={() => removeService(i)} style={{ background: 'transparent', border: 0, color: p.inkMuted, cursor: 'pointer', padding: 8, fontFamily: 'inherit' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          ))}
          <button onClick={() => setShowAddService(true)} style={{ width: '100%', padding: '14px', background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: p.accent, textAlign: 'center' }}>+ Add service</button>
        </Section>

        <Section title="Photos" eyebrow="04 · GALLERY">
          <div style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 12.5, color: p.inkSoft, lineHeight: 1.55, marginBottom: 12 }}>
              First photo is your cover — it's the big image at the top of your public profile. Drag with the arrows to reorder, or "Make cover" to promote a photo.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {profile.gallery.map((item, i) => {
                const isCover = i === 0;
                return (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 12, overflow: 'hidden', backgroundImage: `url(${photoUrl(item)})`, backgroundSize: 'cover', backgroundPosition: 'center', border: `0.5px solid ${isCover ? p.accent : p.line}` }}>
                    {isCover && (
                      <div style={{ position: 'absolute', top: 8, left: 8, background: p.accent, color: p.ink, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 99 }}>COVER</div>
                    )}
                    <button onClick={() => removePhoto(i)} title="Remove" style={{
                      position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 99,
                      background: 'rgba(0,0,0,0.6)', color: '#fff', border: 0, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'inherit',
                    }}>×</button>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => movePhoto(i, -1)} disabled={i === 0} title="Move up" style={iconBtn(p, i === 0)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button onClick={() => movePhoto(i, 1)} disabled={i === profile.gallery.length - 1} title="Move down" style={iconBtn(p, i === profile.gallery.length - 1)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <div style={{ flex: 1 }} />
                      {!isCover && (
                        <button onClick={() => setCoverPhoto(i)} style={{
                          background: 'rgba(255,255,255,0.95)', color: p.ink, border: 0, cursor: 'pointer',
                          padding: '4px 10px', borderRadius: 99, fontSize: 10.5, fontWeight: 600, fontFamily: 'inherit',
                        }}>Make cover</button>
                      )}
                    </div>
                  </div>
                );
              })}
              <button onClick={() => photoInputRef.current?.click()} style={{
                aspectRatio: '1', borderRadius: 12, border: `1px dashed ${p.inkMuted}`, background: p.bg,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: p.inkMuted, cursor: 'pointer', fontFamily: 'inherit', gap: 6,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                <span style={{ fontSize: 11.5, fontWeight: 600 }}>Add photos</span>
              </button>
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={onPhotoPick} style={{ display: 'none' }} />
            <div style={{ marginTop: 10, fontSize: 11, color: p.inkMuted }}>{profile.gallery.length} photo{profile.gallery.length === 1 ? '' : 's'} · recommended 4–8</div>
          </div>
        </Section>

        <Section title="Payouts" eyebrow="05 · STRIPE CONNECT">
          <Field label="Status" last>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {stripeReady ? (
                <>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: p.success, flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: p.ink }}>Stripe verified · payouts active</span>
                  <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted }}>{business?.stripe_account_id?.slice(-8)}</span>
                  <div style={{ flex: 1 }} />
                  <button onClick={onConnectStripe} disabled={connectLoading} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: connectLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                    {connectLoading ? 'Loading…' : 'Manage account →'}
                  </button>
                </>
              ) : stripePending ? (
                <>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: p.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: p.ink }}>Onboarding incomplete</span>
                  <span style={{ fontSize: 12, color: p.inkSoft }}>Stripe still needs a few details before you can take payments.</span>
                  <div style={{ flex: 1 }} />
                  <button onClick={onConnectStripe} disabled={connectLoading} style={{ background: p.accent, color: p.ink, border: 0, padding: '8px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: connectLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                    {connectLoading ? 'Loading…' : 'Finish onboarding →'}
                  </button>
                </>
              ) : (
                <>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: p.line, flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: p.ink }}>Not connected</span>
                  <span style={{ fontSize: 12, color: p.inkSoft }}>Customers can't accept your bids until you connect a payout account.</span>
                  <div style={{ flex: 1 }} />
                  <button onClick={onConnectStripe} disabled={connectLoading || !business?.id} style={{ background: p.ink, color: p.bg, border: 0, padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: (connectLoading || !business?.id) ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                    {connectLoading ? 'Loading…' : 'Connect with Stripe →'}
                  </button>
                </>
              )}
            </div>
          </Field>
        </Section>

        <Section title="Notifications" eyebrow="06 · ALERTS">
          {Object.entries(NOTIFICATION_LABELS).map(([k, v], i, arr) => (
            <Field key={k} label={v.l} last={i === arr.length - 1}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <span style={{ fontSize: 12, color: p.inkMuted, lineHeight: 1.45 }}>{v.d}</span>
                <button onClick={() => updateNotifications({ [k]: !profile.notifications[k] })} style={{
                  width: 42, height: 24, borderRadius: 99, position: 'relative', cursor: 'pointer',
                  background: profile.notifications[k] ? p.success : p.line, transition: 'background 0.2s',
                  border: 0, padding: 0, fontFamily: 'inherit', flexShrink: 0,
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: 99, background: '#fff', position: 'absolute', top: 3, left: profile.notifications[k] ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
                </button>
              </div>
            </Field>
          ))}
        </Section>

        <Section title="Account" eyebrow="07 · ACCESS">
          <Field label="Plan">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>5% per confirmed booking</span>
              <span style={{ background: p.accentSoft, color: p.accent, padding: '3px 10px', borderRadius: 99, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em' }}>ACTIVE</span>
              <div style={{ flex: 1 }} />
              <button onClick={() => navigate('/pricing')} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>View pricing</button>
            </div>
          </Field>
          <Field label="Sign out" last>
            <button onClick={() => { signOut(); toast('Signed out.'); navigate('/'); }} style={{ background: p.surface, border: `0.5px solid ${p.line}`, padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
          </Field>
        </Section>

        {/* Save bar */}
        {dirty && (
          <div style={{ position: 'sticky', bottom: 16, marginTop: 24, padding: '14px 18px', background: p.ink, color: p.bg, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 18px 40px rgba(0,0,0,0.18)' }}>
            <div style={{ flex: 1, fontFamily: type.body, fontSize: 13.5, fontWeight: 500 }}>Unsaved changes</div>
            <button onClick={onDiscard} disabled={saving} style={{ background: 'transparent', border: `0.5px solid rgba(255,255,255,0.2)`, padding: '8px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, color: p.bg, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>Discard</button>
            <button onClick={save} disabled={saving} style={{ background: p.accent, color: p.ink, border: 0, padding: '9px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        )}

        <Modal open={showAddService} onClose={() => setShowAddService(false)} eyebrow="ADD SERVICE" title="New menu item" footer={
          <>
            <button onClick={() => setShowAddService(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => { if (!serviceDraft.name.trim()) return toast('Service needs a name.', { tone: 'warn' }); addService(serviceDraft); toast(`${serviceDraft.name} added.`, { tone: 'success' }); setShowAddService(false); setServiceDraft({ name: '', from: 50, to: 90, dur: '1 hr' }); }} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
          </>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>NAME</div>
              <input value={serviceDraft.name} onChange={e => setServiceDraft({ ...serviceDraft, name: e.target.value })} placeholder="e.g. Keratin treatment" style={{ ...input, marginTop: 6 }} />
            </label>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>DURATION</div>
              <input value={serviceDraft.dur} onChange={e => setServiceDraft({ ...serviceDraft, dur: e.target.value })} placeholder="1 hr" style={{ ...input, marginTop: 6 }} />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>FROM ${serviceDraft.from}</div>
                <input type="range" min={20} max={300} value={serviceDraft.from} onChange={e => setServiceDraft({ ...serviceDraft, from: Number(e.target.value) })} style={{ marginTop: 8, width: '100%', accentColor: p.accent }} />
              </label>
              <label>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>TO ${serviceDraft.to}</div>
                <input type="range" min={20} max={400} value={serviceDraft.to} onChange={e => setServiceDraft({ ...serviceDraft, to: Number(e.target.value) })} style={{ marginTop: 8, width: '100%', accentColor: p.accent }} />
              </label>
            </div>
          </div>
        </Modal>

      </div>
    </SalonLayout>
  );
}

const iconBtn = (p, disabled) => ({
  width: 26, height: 26, borderRadius: 99,
  background: 'rgba(255,255,255,0.95)', color: p.ink,
  border: 0, cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: disabled ? 0.4 : 1, fontFamily: 'inherit',
});
