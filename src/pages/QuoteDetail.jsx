import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { useAuth } from '../store.jsx';
import { useBidsForQuote, acceptBid } from '../lib/quotes.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const fmtPrice = cents => cents == null ? '—' : `$${(cents / 100).toFixed(0)}`;
const fmtDur = min => min ? (min < 60 ? `${min} min` : `${Math.round(min / 60 * 10) / 10} hr`) : '—';
const fmtAgo = ts => {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function QuoteDetail() {
  const isPhone = useNarrow();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { bids, loading: bidsLoading, refresh } = useBidsForQuote(id);

  const [quote, setQuote] = useState(null);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    if (isSupabaseConfigured && user === null) navigate('/signup', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!isSupabaseConfigured || !id) return;
    let cancel = false;
    supabase.from('quote_requests').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!cancel) setQuote(data);
    });
    return () => { cancel = true; };
  }, [id]);

  const onAccept = async bid => {
    if (!confirm(`Accept ${bid.businesses?.name || 'this salon'}'s bid for ${fmtPrice(bid.price_cents)}? This will book your appointment.`)) return;
    setAccepting(bid.id);
    const result = await acceptBid(bid.id);
    setAccepting(null);
    if (!result.ok) { toast(result.error, { tone: 'warn' }); return; }
    toast(`Booked with ${bid.businesses?.name}.`, { tone: 'success' });
    await refresh();
    navigate('/bookings');
  };

  if (!quote) {
    return (
      <CustomerLayout active="quotes" mobileTitle="Request">
        <div style={{ padding: '40px 30px', color: p.inkMuted, fontSize: 14 }}>
          {isSupabaseConfigured ? 'Loading…' : 'Sign in with a Supabase-backed account to view real quotes.'}
        </div>
      </CustomerLayout>
    );
  }

  const isBooked = quote.status === 'booked';
  const isClosed = quote.status === 'closed' || quote.status === 'expired';
  const expiresIn = Math.max(0, Math.floor((new Date(quote.expires_at).getTime() - Date.now()) / 3600000));

  return (
    <CustomerLayout active="quotes" mobileTitle="Request">
      <div style={{ padding: isPhone ? '20px 18px 60px' : '34px 40px 60px', maxWidth: 720 }}>
        <Link to="/quotes" style={{ fontSize: 12, color: p.inkMuted, textDecoration: 'none', fontWeight: 600 }}>← All requests</Link>

        <div style={{ marginTop: 16, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>
          REQUEST · {quote.search_zip || '—'} · {quote.radius_miles}MI · {isBooked ? 'BOOKED' : isClosed ? 'CLOSED' : `${expiresIn}H LEFT`}
        </div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 42, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '8px 0 0' }}>
          {quote.service_slugs.map(s => s.replace('-', ' & ')).join(', ')}
        </h1>
        {quote.notes && (
          <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '12px 0 0', maxWidth: 560, fontStyle: 'italic' }}>
            "{quote.notes}"
          </p>
        )}

        <div style={{ marginTop: 28, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>
          BIDS · {bids.length}
        </div>

        {bidsLoading && bids.length === 0 ? (
          <div style={{ padding: 30, color: p.inkMuted, fontSize: 14 }}>Loading bids…</div>
        ) : bids.length === 0 ? (
          <div style={{ marginTop: 14, padding: 24, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, textAlign: 'center', color: p.inkSoft, fontSize: 14, lineHeight: 1.5 }}>
            No bids yet. Salons usually respond within an hour. We'll send you a notification.
          </div>
        ) : (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bids.map(b => {
              const isAccepted = b.status === 'accepted';
              const isWithdrawable = !isBooked && !isClosed && b.status === 'active';
              return (
                <div key={b.id} style={{
                  padding: '16px', background: p.surface, borderRadius: 14,
                  border: `0.5px solid ${isAccepted ? p.success : p.line}`,
                  boxShadow: isAccepted ? `inset 0 0 0 1px ${p.success}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 10, background: b.businesses?.hero_image_url ? `url(${b.businesses.hero_image_url}) center/cover` : 'linear-gradient(135deg, #C28A6B, #8B4F3A)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{b.businesses?.name || 'Salon'}</span>
                        {b.businesses?.verified && <span style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.1em' }}>VERIFIED</span>}
                      </div>
                      <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 2 }}>
                        {b.businesses?.city || ''}{b.businesses?.price_tier ? ` · ${b.businesses.price_tier}` : ''} · {fmtAgo(b.created_at)}
                      </div>
                      {b.message && (
                        <div style={{ marginTop: 8, fontSize: 13, color: p.inkSoft, lineHeight: 1.5, fontStyle: 'italic' }}>
                          "{b.message}"
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: type.mono, fontSize: 22, fontWeight: 600, color: p.ink, letterSpacing: '-0.02em' }}>{fmtPrice(b.price_cents)}</div>
                      <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 2 }}>{fmtDur(b.estimated_duration)}</div>
                    </div>
                  </div>
                  {isWithdrawable && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${p.line}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => onAccept(b)} disabled={accepting === b.id} style={{
                        background: p.ink, color: p.bg, border: 0, padding: '10px 18px', borderRadius: 99,
                        fontSize: 13, fontWeight: 600, cursor: accepting === b.id ? 'wait' : 'pointer', fontFamily: 'inherit',
                      }}>
                        {accepting === b.id ? 'Booking…' : `Accept · ${fmtPrice(b.price_cents)}`}
                      </button>
                    </div>
                  )}
                  {isAccepted && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${p.line}`, fontSize: 12.5, color: p.success, fontWeight: 600 }}>
                      ✓ Accepted — see your booking
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
