import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { useAuth, useCustomerProfile } from '../store.jsx';
import { createQuoteRequest } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { ZIP_CENTROIDS } from '../lib/geocode.js';

const SERVICES = [
  { slug: 'haircut', label: 'Haircut', icon: '💇‍♀️' },
  { slug: 'hairstyle', label: 'Hairstyle', icon: '💁‍♀️' },
  { slug: 'color', label: 'Color', icon: '🎨' },
  { slug: 'nails', label: 'Nails', icon: '💅' },
  { slug: 'lashes-brows', label: 'Lashes & Brows', icon: '👁️' },
  { slug: 'hair-removal', label: 'Hair Removal', icon: '🪒' },
  { slug: 'facials', label: 'Facials', icon: '🧖‍♀️' },
  { slug: 'massage', label: 'Massage', icon: '💆‍♀️' },
  { slug: 'med-spa', label: 'Med Spa', icon: '💉' },
  { slug: 'makeup', label: 'Makeup', icon: '💄' },
  { slug: 'tanning', label: 'Tanning', icon: '🌞' },
];

const RADII = [5, 10, 15, 25];

export default function RequestQuote() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useCustomerProfile();
  const [params] = useSearchParams();

  const [picked, setPicked] = useState(() => {
    const slugs = (params.get('services') || '').split(',').map(s => s.trim()).filter(Boolean);
    const valid = new Set(SERVICES.map(s => s.slug));
    return new Set(slugs.filter(s => valid.has(s)));
  });
  const [zip, setZip] = useState('');
  const [radius, setRadius] = useState(10);
  const [notes, setNotes] = useState('');
  const [earliestDate, setEarliestDate] = useState('');
  const [latestDate, setLatestDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Prefill ZIP from profile once loaded
  useEffect(() => {
    if (!zip && profile?.zip) setZip(profile.zip);
  }, [profile, zip]);

  // If not signed in (after auth has settled), send them to sign up
  useEffect(() => {
    if (isSupabaseConfigured && !authLoading && !user) navigate('/signup', { replace: true });
  }, [user, authLoading, navigate]);

  const togglePicked = slug => setPicked(curr => {
    const next = new Set(curr);
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    return next;
  });

  const submit = async e => {
    e?.preventDefault();
    setSubmitting(true);
    // Hard 15s ceiling so the button can't get truly stuck if the RPC hangs.
    const watchdog = setTimeout(() => {
      setSubmitting(false);
      toast('Posting is taking too long. Check your connection and try again.', { tone: 'warn' });
    }, 15000);
    try {
      const result = await createQuoteRequest({
        serviceSlugs: Array.from(picked),
        zip,
        radius,
        notes,
        earliestDate: earliestDate || null,
        latestDate: latestDate || null,
      });
      if (!result.ok) {
        console.error('createQuoteRequest failed:', result.error);
        toast(result.error || 'Could not post request.', { tone: 'warn' });
        return;
      }
      toast('Request posted — salons within your radius will see it shortly.', { tone: 'success' });
      navigate(`/quotes/${result.id}`);
    } catch (err) {
      console.error('submit error:', err);
      toast(err?.message || 'Something went wrong.', { tone: 'warn' });
    } finally {
      clearTimeout(watchdog);
      setSubmitting(false);
    }
  };

  const validZip = Boolean(ZIP_CENTROIDS[zip]) || (zip.length === 5 && /^(75|76|78|79)/.test(zip));
  const canSubmit = picked.size > 0 && validZip && !submitting;

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `0.5px solid ${p.line}`, background: p.surface,
    fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <CustomerLayout active="quotes" mobileTitle="Post a request">
      <form onSubmit={submit} style={{ padding: isPhone ? '20px 18px 60px' : '34px 40px 60px', maxWidth: 720 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>NEW REQUEST</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Post a request.</h1>
        <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
          Pick what you're booking. Salons within your radius will see it for the next 72 hours and send bids.
        </p>

        {/* Services */}
        <section style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>01 · WHAT</div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
            {SERVICES.map(s => {
              const sel = picked.has(s.slug);
              return (
                <button key={s.slug} type="button" onClick={() => togglePicked(s.slug)} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: sel ? p.ink : p.surface, color: sel ? p.bg : p.ink,
                  border: `0.5px solid ${sel ? p.ink : p.line}`, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Location */}
        <section style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>02 · WHERE</div>
          <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '160px 1fr', gap: 12, marginTop: 10 }}>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>ZIP</div>
              <input value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} inputMode="numeric" placeholder="78577" style={{ ...inputStyle, fontFamily: type.mono, letterSpacing: '0.1em' }} />
              {zip.length === 5 && !validZip && (
                <div style={{ fontSize: 11.5, color: '#B23A3A', marginTop: 6 }}>Glossi launches in TX (Dallas, Austin, San Antonio, RGV).</div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Radius</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {RADII.map(r => {
                  const a = radius === r;
                  return (
                    <button key={r} type="button" onClick={() => setRadius(r)} style={{
                      flex: 1, padding: '12px 8px', borderRadius: 10,
                      background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                      border: `0.5px solid ${a ? p.ink : p.line}`,
                      cursor: 'pointer', fontFamily: type.mono, fontSize: 13, fontWeight: 600,
                    }}>{r} mi</button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Window */}
        <section style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>03 · WHEN <span style={{ color: p.inkMuted, fontWeight: 500, letterSpacing: '0.04em' }}>· OPTIONAL</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Earliest</div>
              <input type="date" value={earliestDate} onChange={e => setEarliestDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Latest</div>
              <input type="date" value={latestDate} onChange={e => setLatestDate(e.target.value)} min={earliestDate || undefined} style={inputStyle} />
            </div>
          </div>
        </section>

        {/* Notes */}
        <section style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>04 · DETAILS <span style={{ color: p.inkMuted, fontWeight: 500, letterSpacing: '0.04em' }}>· OPTIONAL</span></div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tell salons what you're looking for. Reference photos help — paste links or describe."
            rows={4}
            style={{ ...inputStyle, marginTop: 10, fontFamily: type.body, lineHeight: 1.5, resize: 'vertical' }}
          />
        </section>

        {/* CTA */}
        <div style={{ marginTop: 32, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="submit" disabled={!canSubmit} style={{
            background: canSubmit ? p.ink : p.line, color: p.bg, border: 0,
            padding: '15px 24px', borderRadius: 99, fontSize: 14.5, fontWeight: 600,
            cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
          }}>
            {submitting ? 'Posting…' : 'Post request →'}
          </button>
          <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.1em' }}>
            {picked.size > 0 ? `${picked.size} SERVICE${picked.size === 1 ? '' : 'S'} · ${radius} MI · 72H WINDOW` : 'PICK AT LEAST ONE SERVICE'}
          </span>
        </div>
      </form>
    </CustomerLayout>
  );
}
