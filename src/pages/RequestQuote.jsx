import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { useAuth, useCustomerProfile, useLang } from '../store.jsx';
import { createQuoteRequest } from '../lib/quotes.js';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';
import { ZIP_CENTROIDS } from '../lib/geocode.js';
import { useT } from '../lib/i18n.js';

// Read the last-used ZIP synchronously from localStorage so the form
// renders with it on the very first paint — no flash-of-disabled-button
// while the customer profile hydrates. Falls through to the user's
// home_zip in the profile row (handled by the prefill effect below).
function readCachedZip() {
  if (typeof window === 'undefined') return '';
  try {
    const v = localStorage.getItem('glossi.lastQuoteZip');
    return v && /^\d{5}$/.test(v) ? v : '';
  } catch { return ''; }
}

const SERVICES = [
  { slug: 'haircut', label: 'Haircut', labelEs: 'Corte de cabello', icon: '💇‍♀️' },
  { slug: 'hairstyle', label: 'Hairstyle', labelEs: 'Peinado', icon: '💁‍♀️' },
  { slug: 'color', label: 'Color', labelEs: 'Color', icon: '🎨' },
  { slug: 'nails', label: 'Nails', labelEs: 'Uñas', icon: '💅' },
  { slug: 'lashes-brows', label: 'Lashes & Brows', labelEs: 'Pestañas y cejas', icon: '👁️' },
  { slug: 'hair-removal', label: 'Hair Removal', labelEs: 'Depilación', icon: '🪒' },
  { slug: 'facials', label: 'Facials', labelEs: 'Faciales', icon: '🧖‍♀️' },
  { slug: 'massage', label: 'Massage', labelEs: 'Masaje', icon: '💆‍♀️' },
  { slug: 'med-spa', label: 'Med Spa', labelEs: 'Med Spa', icon: '💉' },
  { slug: 'makeup', label: 'Makeup', labelEs: 'Maquillaje', icon: '💄' },
  { slug: 'tanning', label: 'Tanning', labelEs: 'Bronceado', icon: '🌞' },
];

const RADII = [5, 10, 15, 25];

export default function RequestQuote() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const t = useT();
  const { lang } = useLang();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useCustomerProfile();
  const [params] = useSearchParams();

  const [picked, setPicked] = useState(() => {
    const slugs = (params.get('services') || '').split(',').map(s => s.trim()).filter(Boolean);
    const valid = new Set(SERVICES.map(s => s.slug));
    return new Set(slugs.filter(s => valid.has(s)));
  });
  // Initial value: cached ZIP if we have one. Falls back to profile
  // .zip via the effect below once auth hydrates.
  const [zip, setZip] = useState(readCachedZip);
  const [radius, setRadius] = useState(10);
  const [notes, setNotes] = useState('');
  const [earliestDate, setEarliestDate] = useState('');
  const [latestDate, setLatestDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Prefill ZIP from the customer profile once it hydrates — only if
  // the local cache didn't already give us one.
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
      toast(t('Posting is taking too long. Check your connection and try again.', 'La publicación está tardando demasiado. Revisa tu conexión e inténtalo de nuevo.'), { tone: 'warn' });
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
        toast(result.error || t('Could not post request.', 'No se pudo publicar la solicitud.'), { tone: 'warn' });
        return;
      }
      toast(t('Request posted — salons within your radius will see it shortly.', 'Solicitud publicada — los salones dentro de tu radio la verán pronto.'), { tone: 'success' });
      // Cache the ZIP so the next /request visit pre-fills the field
      // (avoids the disabled-button-on-first-land friction). Also
      // best-effort backfill the profile.home_zip so the cache works
      // across browsers.
      try { localStorage.setItem('glossi.lastQuoteZip', zip); } catch { /* noop */ }
      if (isSupabaseConfigured && user?.id) {
        supabase.from('profiles').update({ home_zip: zip }).eq('id', user.id).then(() => {});
      }
      navigate(`/quotes/${result.id}`);
    } catch (err) {
      console.error('submit error:', err);
      toast(err?.message || t('Something went wrong.', 'Algo salió mal.'), { tone: 'warn' });
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
    <CustomerLayout active="quotes" mobileTitle={t('Post a request', 'Publica una solicitud')}>
      <form onSubmit={submit} style={{ padding: isPhone ? '20px 18px 60px' : '34px 40px 60px', maxWidth: 720 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('NEW REQUEST', 'NUEVA SOLICITUD')}</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>{t('Post a request.', 'Publica una solicitud.')}</h1>
        <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
          {t("Pick what you're booking. Salons within your radius will see it for the next 72 hours and send bids.", 'Elige lo que vas a reservar. Los salones dentro de tu radio lo verán durante las próximas 72 horas y enviarán cotizaciones.')}
        </p>

        {/* Services */}
        <section style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('01 · WHAT', '01 · QUÉ')}</div>
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
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t(s.label, s.labelEs)}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Location */}
        <section style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('02 · WHERE', '02 · DÓNDE')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '160px 1fr', gap: 12, marginTop: 10 }}>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>{t('ZIP', 'Código postal')}</div>
              <input value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} inputMode="numeric" placeholder="78577" style={{ ...inputStyle, fontFamily: type.mono, letterSpacing: '0.1em' }} />
              {zip.length === 5 && !validZip && (
                <div style={{ fontSize: 11.5, color: '#B23A3A', marginTop: 6 }}>{t('Glossi launches in TX (Dallas, Austin, San Antonio, RGV).', 'Glossi se lanza en TX (Dallas, Austin, San Antonio, RGV).')}</div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>{t('Radius', 'Radio')}</div>
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
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('03 · WHEN', '03 · CUÁNDO')} <span style={{ color: p.inkMuted, fontWeight: 500, letterSpacing: '0.04em' }}>{t('· OPTIONAL', '· OPCIONAL')}</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>{t('Earliest', 'Lo más pronto')}</div>
              <input type="date" value={earliestDate} onChange={e => setEarliestDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>{t('Latest', 'Lo más tarde')}</div>
              <input type="date" value={latestDate} onChange={e => setLatestDate(e.target.value)} min={earliestDate || undefined} style={inputStyle} />
            </div>
          </div>
        </section>

        {/* Notes */}
        <section style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('04 · DETAILS', '04 · DETALLES')} <span style={{ color: p.inkMuted, fontWeight: 500, letterSpacing: '0.04em' }}>{t('· OPTIONAL', '· OPCIONAL')}</span></div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t("Tell salons what you're looking for. Reference photos help — paste links or describe.", 'Cuéntale a los salones qué buscas. Las fotos de referencia ayudan — pega enlaces o descríbelo.')}
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
            {submitting ? t('Posting…', 'Publicando…') : t('Post request →', 'Publicar solicitud →')}
          </button>
          <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.1em' }}>
            {picked.size > 0
              ? (lang === 'es'
                ? `${picked.size} ${picked.size === 1 ? 'SERVICIO' : 'SERVICIOS'} · ${radius} MI · VENTANA DE 72H`
                : `${picked.size} SERVICE${picked.size === 1 ? '' : 'S'} · ${radius} MI · 72H WINDOW`)
              : t('PICK AT LEAST ONE SERVICE', 'ELIGE AL MENOS UN SERVICIO')}
          </span>
        </div>
      </form>
    </CustomerLayout>
  );
}
