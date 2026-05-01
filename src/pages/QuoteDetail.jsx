import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import CustomerLayout from '../components/CustomerLayout.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../store.jsx';
import { useBidsForQuote, counterBid } from '../lib/quotes.js';
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
  const { user, loading: authLoading } = useAuth();
  const { bids, loading: bidsLoading, refresh } = useBidsForQuote(id);

  const [quote, setQuote] = useState(null);
  const [accepting, setAccepting] = useState(null);
  const [counterTarget, setCounterTarget] = useState(null);
  const [counterDraft, setCounterDraft] = useState({ price: 0, message: '' });
  const [submittingCounter, setSubmittingCounter] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && !authLoading && !user) navigate('/signup', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!isSupabaseConfigured || !id) return;
    let cancel = false;
    supabase.from('quote_requests').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!cancel) setQuote(data);
    });
    return () => { cancel = true; };
  }, [id]);

  // Phase 6: accepting now means paying. We hand off to /pay/:bidId
  // which calls the create-payment-intent Edge Function and shows
  // the Stripe Elements card form. The actual bid → booking flip
  // happens server-side after payment_intent.succeeded fires.
  const onAccept = async bid => {
    const name = bid.businesses?.name || 'this salon';
    if (!confirm(`Pay ${fmtPrice(bid.price_cents)} to book with ${name}? Glossi holds the funds and releases them after your appointment.`)) return;
    navigate(`/pay/${bid.id}`);
  };

  const openCounter = bid => {
    // Default suggestion: 90% of salon's ask, rounded to nearest $5,
    // clamped to at least $1 below the ask.
    const ask = Math.round((bid.price_cents || 0) / 100);
    const suggested = Math.max(1, Math.min(ask - 1, Math.round(ask * 0.9 / 5) * 5));
    setCounterDraft({ price: suggested, message: '' });
    setCounterTarget(bid);
  };

  const submitCounter = async () => {
    if (!counterTarget) return;
    const ask = Math.round((counterTarget.price_cents || 0) / 100);
    const price = Number(counterDraft.price);
    if (!Number.isFinite(price) || price <= 0) {
      toast('Enter a valid counter price.', { tone: 'warn' });
      return;
    }
    if (price >= ask) {
      toast(`Counter must be below $${ask}.`, { tone: 'warn' });
      return;
    }
    setSubmittingCounter(true);
    const result = await counterBid({
      bidId: counterTarget.id,
      counterCents: Math.round(price * 100),
      message: counterDraft.message,
    });
    setSubmittingCounter(false);
    if (!result.ok) { toast(result.error, { tone: 'warn' }); return; }
    toast(`Counter sent · $${price}.`, { tone: 'success' });
    setCounterTarget(null);
    refresh();
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
              const isCountered = b.status === 'countered';
              const isActionable = !isBooked && !isClosed && (b.status === 'active' || isCountered);
              return (
                <div key={b.id} style={{
                  padding: '16px', background: p.surface, borderRadius: 14,
                  border: `0.5px solid ${isAccepted ? p.success : isCountered ? p.accent : p.line}`,
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
                  {isCountered && (
                    <div style={{ marginTop: 12, padding: '10px 12px', background: p.bg, borderRadius: 10, border: `0.5px solid ${p.accent}`, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5 }}>
                      <span style={{ color: p.accent, fontWeight: 700, letterSpacing: '0.1em', fontSize: 10.5 }}>YOUR COUNTER · {fmtPrice(b.counter_offer_cents)}</span>
                      {b.counter_message && <div style={{ marginTop: 4, fontStyle: 'italic' }}>"{b.counter_message}"</div>}
                      <div style={{ marginTop: 4, color: p.inkMuted, fontSize: 11.5 }}>Sent {fmtAgo(b.counter_at)} · waiting for {b.businesses?.name || 'salon'}</div>
                    </div>
                  )}
                  {isActionable && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${p.line}`, display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {!isCountered && (
                        <button onClick={() => openCounter(b)} style={{
                          background: 'transparent', color: p.ink, border: `0.5px solid ${p.line}`,
                          padding: '10px 16px', borderRadius: 99,
                          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                          Counter
                        </button>
                      )}
                      {isCountered && (
                        <button onClick={() => openCounter(b)} style={{
                          background: 'transparent', color: p.ink, border: `0.5px solid ${p.line}`,
                          padding: '10px 16px', borderRadius: 99,
                          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                          Edit counter
                        </button>
                      )}
                      <button onClick={() => onAccept(b)} disabled={accepting === b.id || isCountered} style={{
                        background: isCountered ? p.surface2 : p.ink, color: isCountered ? p.inkMuted : p.bg, border: 0,
                        padding: '10px 18px', borderRadius: 99,
                        fontSize: 13, fontWeight: 600,
                        cursor: (accepting === b.id || isCountered) ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                        opacity: isCountered ? 0.6 : 1,
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

      {counterTarget && (() => {
        const ask = Math.round((counterTarget.price_cents || 0) / 100);
        const price = Number(counterDraft.price);
        const validPrice = Number.isFinite(price) && price > 0 && price < ask;
        return (
          <Modal
            open
            onClose={() => !submittingCounter && setCounterTarget(null)}
            eyebrow="COUNTER OFFER"
            title={`Propose a price to ${counterTarget.businesses?.name || 'this salon'}`}
            width={460}
            footer={(
              <>
                <button onClick={() => setCounterTarget(null)} disabled={submittingCounter} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submittingCounter ? 'wait' : 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button onClick={submitCounter} disabled={submittingCounter || !validPrice} style={{ background: p.ink, color: p.bg, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: (submittingCounter || !validPrice) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: (submittingCounter || !validPrice) ? 0.6 : 1 }}>
                  {submittingCounter ? 'Sending…' : `Send · $${price || 0}`}
                </button>
              </>
            )}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.5 }}>
                Their ask is <strong style={{ color: p.ink }}>${ask}</strong>. Propose what you'd be willing to pay — they can accept it, decline (their original price stands), or come back with a new bid.
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 8 }}>YOUR COUNTER</div>
                <div style={{ padding: '20px 18px', background: p.ink, color: p.bg, borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'center' }}>
                    <span style={{ fontFamily: type.mono, fontSize: 18, opacity: 0.6 }}>$</span>
                    <span style={{ fontFamily: type.mono, fontSize: 48, fontWeight: 600, letterSpacing: '-0.03em' }}>{counterDraft.price}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={Math.max(2, ask - 1)}
                    step={1}
                    value={counterDraft.price}
                    onChange={e => setCounterDraft({ ...counterDraft, price: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: p.accent, marginTop: 12 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, opacity: 0.6, marginTop: 4 }}>
                    <span>$1</span>
                    <span>${ask - 1}</span>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 8 }}>NOTE TO SALON · OPTIONAL</div>
                <textarea
                  value={counterDraft.message}
                  onChange={e => setCounterDraft({ ...counterDraft, message: e.target.value })}
                  rows={3}
                  placeholder="e.g. Repeat client, can come on a slow day"
                  style={{ width: '100%', padding: '11px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 13, color: p.ink, outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>
          </Modal>
        );
      })()}
    </CustomerLayout>
  );
}
