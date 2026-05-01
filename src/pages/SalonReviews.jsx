import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import {
  useMyBusinesses,
  useBusinessReviews,
  markReviewsSeen,
  replyToReview,
} from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const fmtServices = slugs => (slugs || []).map(s => s.replace('-', ' & ')).join(', ') || 'Appointment';
const fmtPrice = cents => `$${Math.round((cents || 0) / 100)}`;
const fmtDate = ts => ts ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const initialsFrom = name => (name || 'C').split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();

const FILTERS = [
  { id: 'all',     l: 'All' },
  { id: 'unreplied', l: 'Need reply' },
  { id: '5',       l: '★★★★★' },
  { id: 'low',     l: '≤ 3 stars' },
];

function Stars({ n, size = 14 }) {
  return (
    <span style={{ color: p.accent, fontSize: size, letterSpacing: '0.05em' }}>
      {'★'.repeat(n)}<span style={{ color: p.line }}>{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export default function SalonReviews() {
  const isPhone = useNarrow();
  const toast = useToast();
  const { businesses, loading: bizLoading } = useMyBusinesses();
  const businessId = businesses[0]?.id;
  const { reviews, loading, refresh } = useBusinessReviews(businessId);

  const [filter, setFilter] = useState('all');
  const [replyDraft, setReplyDraft] = useState({});  // { [reviewId]: text }
  const [replying, setReplying] = useState(null);    // reviewId

  // Mark reviews seen on mount so the nav badge clears.
  useEffect(() => {
    if (!businessId) return;
    markReviewsSeen(businessId);
  }, [businessId]);

  const stats = useMemo(() => {
    if (!reviews.length) return { count: 0, avg: 0, replied: 0 };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const replied = reviews.filter(r => r.salon_reply).length;
    return {
      count: reviews.length,
      avg: Math.round((sum / reviews.length) * 10) / 10,
      replied,
    };
  }, [reviews]);

  const filtered = useMemo(() => {
    if (filter === 'all') return reviews;
    if (filter === 'unreplied') return reviews.filter(r => !r.salon_reply);
    if (filter === '5') return reviews.filter(r => r.rating === 5);
    if (filter === 'low') return reviews.filter(r => r.rating <= 3);
    return reviews;
  }, [reviews, filter]);

  const sendReply = async reviewId => {
    const text = (replyDraft[reviewId] || '').trim();
    if (!text) { toast('Type a reply first.', { tone: 'warn' }); return; }
    setReplying(reviewId);
    const r = await replyToReview({ reviewId, reply: text });
    setReplying(null);
    if (!r.ok) { toast(r.error, { tone: 'warn' }); return; }
    toast('Reply posted.', { tone: 'success' });
    setReplyDraft(d => ({ ...d, [reviewId]: '' }));
    refresh();
  };

  return (
    <SalonLayout active="reviews" mobileTitle="Reviews">
      <div style={{ padding: isPhone ? '20px 18px 60px' : '34px 40px 60px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>REVIEWS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>What clients said.</h1>

        {/* Stats */}
        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: isPhone ? 'repeat(3,1fr)' : 'repeat(3, max-content)', gap: 12 }}>
          {[
            { k: 'Average', v: stats.count ? `${stats.avg.toFixed(1)}★` : '—', c: p.accent },
            { k: 'Reviews', v: stats.count, c: p.ink },
            { k: 'Replied', v: stats.count ? `${stats.replied}/${stats.count}` : '0', c: p.success },
          ].map((s, i) => (
            <div key={i} style={{ padding: '14px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
              <div style={{ fontFamily: type.mono, fontSize: isPhone ? 22 : 28, fontWeight: 600, color: s.c, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div style={{ marginTop: 22, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const a = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '8px 14px', borderRadius: 99,
                background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                border: `0.5px solid ${a ? p.ink : p.line}`, cursor: 'pointer',
                fontFamily: type.body, fontSize: 12.5, fontWeight: 600,
              }}>{f.l}</button>
            );
          })}
        </div>

        {/* List */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!isSupabaseConfigured ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5 }}>
              Supabase isn't configured — reviews need a backend.
            </div>
          ) : bizLoading || loading ? (
            <div style={{ padding: 22, color: p.inkMuted, fontSize: 13.5 }}>Loading…</div>
          ) : !businessId ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
              Set up your salon listing first — reviews land here once your customers post them.
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
              No reviews yet. After you mark a booking complete the customer gets a Leave-a-review prompt — those land here.
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5 }}>
              No reviews match that filter.
            </div>
          ) : filtered.map(r => {
            const draft = replyDraft[r.review_id] ?? r.salon_reply ?? '';
            const hasReply = Boolean(r.salon_reply);
            return (
              <div key={r.review_id} style={{ padding: '18px 20px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}` }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 999, flexShrink: 0, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>
                    {initialsFrom(r.customer_name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: p.ink }}>{r.customer_name || 'Customer'}</span>
                      <Stars n={r.rating} />
                    </div>
                    <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 2 }}>
                      {fmtDate(r.created_at)} · {fmtServices(r.service_slugs)} · {fmtPrice(r.price_cents)}
                    </div>
                  </div>
                  {r.booking_id && (
                    <Link to={`/salon/booking/${r.booking_id}`} style={{ fontSize: 11.5, color: p.inkMuted, textDecoration: 'none', fontWeight: 600 }}>Open booking →</Link>
                  )}
                </div>

                {/* Body */}
                {r.body && (
                  <div style={{ marginTop: 12, padding: '12px 14px', background: p.bg, borderRadius: 10, border: `0.5px solid ${p.line}`, fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55, fontStyle: 'italic' }}>
                    "{r.body}"
                  </div>
                )}

                {/* Reply */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: hasReply ? p.success : p.inkMuted, marginBottom: 6 }}>
                    {hasReply ? `YOUR REPLY · ${fmtDate(r.salon_replied_at)}` : 'YOUR REPLY · OPTIONAL'}
                  </div>
                  <textarea
                    value={draft}
                    onChange={e => setReplyDraft(d => ({ ...d, [r.review_id]: e.target.value }))}
                    rows={2}
                    placeholder="Thank them, address concerns, invite them back…"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 13, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                      onClick={() => sendReply(r.review_id)}
                      disabled={replying === r.review_id || !draft.trim() || draft.trim() === r.salon_reply}
                      style={{
                        background: p.ink, color: p.bg, border: 0,
                        padding: '9px 16px', borderRadius: 99,
                        fontSize: 12.5, fontWeight: 600,
                        cursor: (replying === r.review_id || !draft.trim() || draft.trim() === r.salon_reply) ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        opacity: (replying === r.review_id || !draft.trim() || draft.trim() === r.salon_reply) ? 0.5 : 1,
                      }}
                    >
                      {replying === r.review_id ? 'Posting…' : hasReply ? 'Update reply' : 'Post reply'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SalonLayout>
  );
}
