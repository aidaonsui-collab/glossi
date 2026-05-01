import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import SalonLayout from '../components/SalonLayout.jsx';
import { useAuth } from '../store.jsx';
import { useMyBusinesses, useSalonInbox } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const fmtPrice = cents => cents == null ? '—' : `$${(cents / 100).toFixed(0)}`;
const fmtMiles = meters => meters == null ? '—' : `${(meters / 1609.34).toFixed(1)} mi`;
const fmtAgo = ts => {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d`;
};

export default function SalonInbox() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { businesses, loading: bizLoading } = useMyBusinesses();
  const [activeBizId, setActiveBizId] = useState(null);

  useEffect(() => {
    if (isSupabaseConfigured && !authLoading && !user) navigate('/signup?role=salon', { replace: true });
  }, [user, navigate]);

  // Auto-select first business
  useEffect(() => {
    if (!activeBizId && businesses.length > 0) setActiveBizId(businesses[0].id);
  }, [businesses, activeBizId]);

  const { items, loading } = useSalonInbox(activeBizId);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      // Items where I haven't bid yet first, then by recency
      if (a.already_bid !== b.already_bid) return a.already_bid ? 1 : -1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [items]);

  if (!isSupabaseConfigured) {
    return (
      <SalonLayout active="inbox" mobileTitle="Inbox">
        <div style={{ padding: 40, color: p.inkMuted, fontSize: 14 }}>Supabase isn't configured — inbox needs a backend.</div>
      </SalonLayout>
    );
  }

  if (bizLoading) {
    return (
      <SalonLayout active="inbox" mobileTitle="Inbox">
        <div style={{ padding: 40, color: p.inkMuted, fontSize: 14 }}>Loading…</div>
      </SalonLayout>
    );
  }

  if (businesses.length === 0) {
    return (
      <SalonLayout active="inbox" mobileTitle="Inbox">
        <div style={{ padding: isPhone ? '20px 18px' : '34px 40px', maxWidth: 600 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>NO BUSINESS YET</div>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '8px 0 12px' }}>Set up your salon.</h1>
          <p style={{ fontSize: 14, color: p.inkSoft, lineHeight: 1.55, margin: '0 0 20px' }}>
            You need a published business listing to receive quote requests. We'll walk you through it in a minute.
          </p>
          <button onClick={() => navigate('/onboarding/salon')} style={{ background: p.ink, color: p.bg, border: 0, padding: '14px 22px', borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Create salon listing →
          </button>
        </div>
      </SalonLayout>
    );
  }

  return (
    <SalonLayout active="inbox" mobileTitle="Inbox">
      <div style={{ padding: isPhone ? '20px 18px 60px' : '34px 40px 60px', maxWidth: 920 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>INBOX</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Open requests.</h1>
        <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
          Customers near you posting now. Send a bid in under a minute — speed matters.
        </p>

        {/* Business switcher */}
        {businesses.length > 1 && (
          <div style={{ marginTop: 18, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {businesses.map(b => {
              const a = activeBizId === b.id;
              return (
                <button key={b.id} onClick={() => setActiveBizId(b.id)} style={{
                  padding: '8px 14px', borderRadius: 99,
                  background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                  border: `0.5px solid ${a ? p.ink : p.line}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                }}>{b.name}</button>
              );
            })}
          </div>
        )}

        {/* Inbox list */}
        <div style={{ marginTop: 22 }}>
          {loading ? (
            <div style={{ padding: 30, color: p.inkMuted, fontSize: 14 }}>Loading…</div>
          ) : sortedItems.length === 0 ? (
            <div style={{ padding: 30, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, textAlign: 'center', color: p.inkSoft, fontSize: 14, lineHeight: 1.5 }}>
              No open requests in your area right now. We'll notify you when one comes in.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sortedItems.map(r => {
                const expired = new Date(r.expires_at).getTime() < Date.now();
                const targeted = r.target_business_id != null;
                return (
                  <button key={r.request_id} onClick={() => navigate(`/salon/inbox/${r.request_id}?biz=${activeBizId}`)} style={{
                    width: '100%', textAlign: 'left', padding: 16, background: p.surface, borderRadius: 14,
                    border: `0.5px solid ${r.already_bid ? p.accent : p.line}`,
                    boxShadow: r.already_bid ? `inset 0 0 0 1px ${p.accent}` : 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start',
                    opacity: expired ? 0.6 : 1,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>
                        <span>{(r.service_slugs || []).map(s => s.replace('-', ' & ')).join(', ')}</span>
                        {targeted && <span style={{ fontSize: 9, color: p.accent, fontWeight: 700, letterSpacing: '0.12em', fontStyle: 'normal' }}>· TARGETED</span>}
                        {expired && <span style={{ fontSize: 9, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.12em', fontStyle: 'normal' }}>· EXPIRED</span>}
                      </div>
                      <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 4 }}>
                        {r.search_zip || '—'} · {fmtMiles(r.distance_m)} · {fmtAgo(r.created_at)}
                        {r.offer_price_cents != null ? ` · offer ${fmtPrice(r.offer_price_cents)}` : ''}
                      </div>
                      {r.notes && <div style={{ fontSize: 12.5, color: p.inkSoft, marginTop: 6, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontStyle: 'italic' }}>"{r.notes}"</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {r.already_bid ? (
                        <div>
                          <div style={{ fontSize: 9.5, color: p.accent, fontWeight: 700, letterSpacing: '0.14em' }}>YOUR BID</div>
                          <div style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 600, color: p.ink, marginTop: 2 }}>{fmtPrice(r.current_bid_cents)}</div>
                        </div>
                      ) : !expired ? (
                        <div style={{ fontSize: 12, color: p.accent, fontWeight: 600 }}>Send bid →</div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SalonLayout>
  );
}
