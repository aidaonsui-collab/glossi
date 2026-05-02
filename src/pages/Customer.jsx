import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import NotificationsPanel from '../components/NotificationsPanel.jsx';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { useAuth, useLang, useNotifications } from '../store.jsx';
import { useMyQuotes } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const SERVICES = [
  { l: 'Color', slug: 'color' },
  { l: 'Cut & style', slug: 'haircut' },
  { l: 'Lashes', slug: 'lashes-brows' },
  { l: 'Nails', slug: 'nails' },
  { l: 'Brows', slug: 'lashes-brows' },
  { l: 'Barber', slug: 'haircut' },
];

const fmtAgo = ts => {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const fmtServices = slugs => (slugs || [])
  .map(s => s.replace('-', ' & '))
  .join(', ');

export default function Customer() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang: storedLang, toggle: toggleLang } = useLang();
  const lang = storedLang === 'es' ? 'ES' : 'EN';
  const [pickedServices, setPickedServices] = useState(new Set(['Color']));
  const togglePicked = label => setPickedServices(curr => {
    const next = new Set(curr);
    if (next.has(label)) next.delete(label); else next.add(label);
    return next;
  });
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotifications();
  const { quotes, loading } = useMyQuotes();

  const compose = (
    <div style={{
      background: p.ink, color: p.bg, borderRadius: 20, padding: isPhone ? '24px 20px' : '32px 32px',
      display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.4fr 1fr', gap: isPhone ? 20 : 32, alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>POST A REQUEST</div>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.95, marginTop: 8, textWrap: 'balance' }}>What are you looking for, <span style={{ color: p.accent }}>today?</span></div>
        <div style={{ marginTop: isPhone ? 14 : 18, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SERVICES.map(s => {
            const active = pickedServices.has(s.l);
            return (
              <button key={s.l} onClick={() => togglePicked(s.l)} style={{
                padding: '7px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                background: active ? p.accent : 'rgba(255,255,255,0.08)', color: active ? p.ink : p.bg,
                cursor: 'pointer', border: 0, fontFamily: 'inherit',
              }}>{s.l}</button>
            );
          })}
        </div>
      </div>
      <button onClick={() => {
        const slugs = Array.from(new Set(SERVICES.filter(s => pickedServices.has(s.l)).map(s => s.slug)));
        const qs = slugs.length ? `?services=${slugs.join(',')}` : '';
        navigate(`/request${qs}`);
      }} style={{
        background: p.accent, color: p.ink, border: 0, cursor: 'pointer',
        padding: isPhone ? '14px 18px' : '16px 20px', borderRadius: 14,
        fontSize: isPhone ? 14 : 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontFamily: 'inherit',
      }}>
        <span>{pickedServices.size === 0 ? 'Pick at least one service' : `Start a request · ${pickedServices.size} service${pickedServices.size === 1 ? '' : 's'}`}</span>
        <span>→</span>
      </button>
    </div>
  );

  const quotesSection = (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>YOUR REQUESTS · {quotes.length}</div>
          <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 38, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>
            {quotes.some(q => (q.quote_bids?.[0]?.count ?? 0) > 0) ? 'Bids rolling in.' : 'Open requests.'}
          </h2>
        </div>
      </div>

      {!isSupabaseConfigured ? (
        <div style={{ marginTop: 18, padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.5 }}>
          Supabase isn't configured — quote requests need a backend.
        </div>
      ) : loading ? (
        <div style={{ marginTop: 18, padding: 22, color: p.inkMuted, fontSize: 13.5 }}>Loading…</div>
      ) : quotes.length === 0 ? (
        <div style={{ marginTop: 18, padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.5 }}>
          No requests yet. Pick a service above and post one — salons within your radius will see it for 72 hours.
        </div>
      ) : (
        <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
          {quotes.map(q => {
            const bidCount = q.quote_bids?.[0]?.count ?? 0;
            const expired = q.expires_at && new Date(q.expires_at).getTime() < Date.now();
            const closed = q.status !== 'open' || expired;
            return (
              <button key={q.id} onClick={() => navigate(`/quotes/${q.id}`)} style={{
                width: '100%', textAlign: 'left',
                background: p.surface, borderRadius: 14, border: `0.5px solid ${bidCount > 0 ? p.accent : p.line}`,
                padding: 16, cursor: 'pointer', fontFamily: 'inherit',
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start',
                opacity: closed ? 0.65 : 1,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>
                    <span>{fmtServices(q.service_slugs) || '—'}</span>
                    {q.status === 'booked' && <span style={{ fontSize: 9, color: p.accent, fontWeight: 700, letterSpacing: '0.12em', fontStyle: 'normal' }}>· BOOKED</span>}
                    {q.status === 'closed' && <span style={{ fontSize: 9, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.12em', fontStyle: 'normal' }}>· CLOSED</span>}
                    {expired && q.status === 'open' && <span style={{ fontSize: 9, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.12em', fontStyle: 'normal' }}>· EXPIRED</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 4 }}>
                    {q.search_zip || '—'} · {q.radius_miles ?? 10} mi · {fmtAgo(q.created_at)}
                  </div>
                  {q.notes && (
                    <div style={{ fontSize: 12.5, color: p.inkSoft, marginTop: 6, lineHeight: 1.4, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      "{q.notes}"
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9.5, color: bidCount > 0 ? p.accent : p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>BIDS</div>
                  <div style={{ fontFamily: type.mono, fontSize: 22, fontWeight: 600, color: p.ink, marginTop: 2 }}>{bidCount}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <CustomerLayout active="quotes" mobileTitle="My quotes">
      <div style={{ padding: isPhone ? '18px' : '34px 40px', display: 'flex', flexDirection: 'column', gap: isPhone ? 20 : 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{lang === 'EN' ? 'WELCOME BACK' : 'BIENVENIDA'}</div>
            <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 54, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '6px 0 0', textWrap: 'balance' }}>
              {lang === 'EN' ? `Hi ${user?.name?.split(' ')[0] || 'there'}.` : `Hola ${user?.name?.split(' ')[0] || 'amiga'}.`}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
            <button onClick={() => toggleLang()} style={{ background: p.surface, border: `0.5px solid ${p.line}`, padding: isPhone ? '8px 12px' : '10px 14px', borderRadius: 99, fontSize: isPhone ? 12 : 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ color: lang === 'EN' ? p.ink : p.inkMuted }}>EN</span> · <span style={{ color: lang === 'ES' ? p.ink : p.inkMuted }}>ES</span>
            </button>
            {!isPhone && (
              <>
                <button onClick={() => setShowNotifs(v => !v)} style={{ background: p.surface, border: `0.5px solid ${p.line}`, width: 42, height: 42, borderRadius: 99, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.7"><path d="M15 17h5l-1.4-1.4A6.7 6.7 0 0 0 18 12V8a6 6 0 1 0-12 0v4a6.7 6.7 0 0 0-.6 3.6L4 17h5m6 0a3 3 0 1 1-6 0" /></svg>
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: 4, right: 4,
                      minWidth: 16, height: 16, padding: '0 4px',
                      borderRadius: 99, background: p.accent, color: p.ink,
                      fontFamily: type.mono, fontSize: 9.5, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1.5px solid ${p.surface}`,
                    }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>
                {showNotifs && (
                  <div style={{ position: 'absolute', top: 50, right: 0 }}>
                    <NotificationsPanel variant="dropdown" onClose={() => setShowNotifs(false)} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {compose}
        {quotesSection}
      </div>
    </CustomerLayout>
  );
}
