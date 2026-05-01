import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import SalonPhoto from '../components/SalonPhoto.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useBookings } from '../store.jsx';
import { Stars } from '../ios/atoms.jsx';
import { BIDS } from '../ios/data.js';
import BookingActions from '../components/BookingActions.jsx';
import BookingLifecycleModal from '../components/BookingLifecycleModal.jsx';
import { useSupabaseBookings } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const FALLBACK = [
  { id: 'h1', salonId: 'b2', salonName: 'Studio Onyx', mood: 3, service: 'Lash · Hybrid', total: 135, rating: 4, createdAt: new Date('2026-02-21').getTime(), slot: 'Fri · Feb 21' },
  { id: 'h2', salonId: 'b5', salonName: 'Brisa Hair Bar', mood: 4, service: 'Cut + style', total: 65, rating: 5, createdAt: new Date('2026-02-02').getTime(), slot: 'Sun · Feb 2' },
  { id: 'h3', salonId: 'b3', salonName: 'La Reina Salon', mood: 5, service: 'Gel manicure', total: 42, rating: 4, createdAt: new Date('2026-01-18').getTime(), slot: 'Sat · Jan 18' },
];

function fmt(ts) {
  return new Date(ts).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Map a Supabase bookings row → the shape BookingRow expects. Mood is a
// stable hash of the business id so the same salon always shows the
// same placeholder photo across the list.
function fromSupabase(row) {
  const slugSeed = row.businesses?.slug || row.business_id || '';
  const mood = [...slugSeed].reduce((a, c) => a + c.charCodeAt(0), 0) % 6;
  const services = row.quote_bids?.quote_requests?.service_slugs || [];
  const service = services.length
    ? services.map(s => s.replace('-', ' & ')).join(', ')
    : 'Appointment';
  const ts = row.scheduled_at ? new Date(row.scheduled_at).getTime() : new Date(row.created_at).getTime();
  const isPast = row.status === 'completed' || row.status === 'no_show'
    || (row.status === 'confirmed' && ts < Date.now());
  const review = (row.reviews || [])[0];
  return {
    id: row.id,
    salonId: row.businesses?.slug,
    salonName: row.businesses?.name || '—',
    mood,
    service,
    serviceSlugs: services,
    priceCents: row.price_cents || 0,
    scheduledAt: row.scheduled_at,
    total: (row.price_cents || 0) / 100,
    slot: row.scheduled_at ? fmt(row.scheduled_at) : null,
    createdAt: new Date(row.created_at).getTime(),
    rawStatus: row.status,
    status: row.status === 'cancelled' ? 'cancelled' : (isPast ? 'past' : 'upcoming'),
    isCompleted: row.status === 'completed',
    isNoShow: row.status === 'no_show',
    refundCents: row.refunded_amount_cents || 0,
    paymentStatus: row.payment_status,
    rating: review?.rating,
    reviewBody: review?.body,
    fromSupabase: true,
  };
}

export default function Bookings() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const { bookings: localBookings } = useBookings();
  const { bookings: supaBookings, loading: supaLoading, refresh: refreshSupa } = useSupabaseBookings();
  const [actionFor, setActionFor] = useState(null);
  const [lifecycleAction, setLifecycleAction] = useState(null);

  // When Supabase is configured, the source of truth is the bookings
  // table — the localStorage list and the demo FALLBACK array are
  // ignored so a real customer doesn't see Studio Onyx / Brisa demos
  // mixed in with their actual appointments. The localStorage path
  // remains for the no-backend dev fallback.
  const merged = isSupabaseConfigured
    ? supaBookings.map(fromSupabase)
    : [...localBookings, ...FALLBACK];

  const upcoming = merged.filter(b => b.status === 'upcoming');
  const past = merged.filter(b => b.status !== 'upcoming');
  const empty = isSupabaseConfigured && !supaLoading && merged.length === 0;

  return (
    <CustomerLayout active="bookings" mobileTitle="Bookings">
      <div style={{ padding: isPhone ? '20px 18px 32px' : '34px 40px 48px', maxWidth: 880 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>BOOKINGS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Your appointments.</h1>

        {empty && (
          <div style={{ marginTop: 28, padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
            No bookings yet. Accept a bid on one of your requests and it'll show up here.
          </div>
        )}

        {upcoming.length > 0 && (
          <>
            <div style={{ marginTop: 28, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.accent }}>UPCOMING · {upcoming.length}</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.map(b => (
                <BookingRow key={b.id} b={b} navigate={navigate} accent
                  onAction={action => {
                    if (b.fromSupabase && action === 'cancel') {
                      // Adapt the BookingRow shape (dollars + pre-formatted
                      // strings) to what BookingLifecycleModal expects.
                      setLifecycleAction({
                        booking: {
                          id: b.id,
                          salonName: b.salonName,
                          serviceSummary: b.service,
                          scheduledAt: b.scheduledAt,
                          priceCents: b.priceCents,
                        },
                        mode: 'cancel',
                      });
                    } else {
                      setActionFor({ ...b, _action: action });
                    }
                  }}
                />
              ))}
            </div>
          </>
        )}

        {past.length > 0 && (
          <>
            <div style={{ marginTop: 28, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>PAST · {past.length}</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {past.map(b => (
                <BookingRow key={b.id} b={b} navigate={navigate}
                  onReview={() => setLifecycleAction({
                    booking: {
                      id: b.id,
                      salonName: b.salonName,
                      serviceSummary: b.service,
                      scheduledAt: b.scheduledAt,
                      priceCents: b.priceCents,
                    },
                    mode: 'review',
                  })}
                />
              ))}
            </div>
          </>
        )}

        {actionFor && (
          <BookingActions booking={actionFor} onClose={() => setActionFor(null)} />
        )}
        {lifecycleAction && (
          <BookingLifecycleModal
            booking={lifecycleAction.booking}
            mode={lifecycleAction.mode}
            callerRole="customer"
            onClose={refresh => {
              setLifecycleAction(null);
              if (refresh) refreshSupa?.();
            }}
          />
        )}
      </div>
    </CustomerLayout>
  );
}

function BookingRow({ b, navigate, accent, onAction, onReview }) {
  const isPhone = useNarrow();
  const original = BIDS.find(x => x.id === b.salonId);
  const cancelled = b.status === 'cancelled';
  return (
    <div style={{ display: 'flex', gap: 14, padding: '16px', background: p.surface, borderRadius: 16, border: `0.5px solid ${cancelled ? p.line : accent ? p.accent : p.line}`, alignItems: isPhone ? 'flex-start' : 'center', flexWrap: 'wrap', opacity: cancelled ? 0.7 : 1 }}>
      <SalonPhoto mood={b.mood ?? original?.mood ?? 0} h={64} style={{ width: 64, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: '1 1 200px', minWidth: 0 }}>
        <div style={{ fontFamily: type.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: cancelled ? p.inkMuted : accent ? p.accent : p.inkMuted }}>
          {cancelled ? 'CANCELLED · ' : accent ? 'UPCOMING · ' : ''}{(b.slot || fmt(b.createdAt)).toUpperCase()}
        </div>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 19, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em', marginTop: 4, textDecoration: cancelled ? 'line-through' : 'none' }}>{b.service}</div>
        <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 2 }}>{b.salonName}</div>
      </div>
      <div style={{ minWidth: 80 }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: p.inkMuted }}>{cancelled ? 'REFUNDED' : 'TOTAL'}</div>
        <div style={{ fontFamily: type.mono, fontSize: 17, fontWeight: 600, color: cancelled ? p.success : p.ink, marginTop: 1 }}>${(cancelled ? (b.refund ?? b.total) : b.total ?? 0).toFixed(0)}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        {accent && !cancelled && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => onAction?.('reschedule')} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Reschedule</button>
            <button onClick={() => onAction?.('cancel')} style={{ background: 'transparent', border: `0.5px solid ${p.accent}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.accent, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        )}
        {!accent && b.rating ? (
          <Stars n={b.rating} color={p.accent} size={13} />
        ) : !accent && !cancelled && b.isCompleted ? (
          <button onClick={() => onReview ? onReview() : navigate(`/review/${b.id}`)} style={{ background: p.ink, color: p.bg, border: 0, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Leave a review →
          </button>
        ) : !accent && !cancelled && b.isNoShow ? (
          <div style={{ fontSize: 11, color: p.inkMuted, fontWeight: 600, letterSpacing: '0.08em' }}>NO-SHOW</div>
        ) : null}
        {/* "View salon" only points at the demo salon catalog (BIDS in
            ios/data.js); real Supabase salons aren't there yet, so the
            link 404s on every Phase-6 booking. Hide for those rows
            until SalonDetail is wired to Supabase. */}
        {b.salonId && !b.fromSupabase && (
          <button onClick={() => navigate(`/salon/${b.salonId}`)} style={{ background: 'transparent', border: 0, padding: 0, fontSize: 11, fontWeight: 600, color: p.inkMuted, cursor: 'pointer', fontFamily: 'inherit' }}>
            View salon →
          </button>
        )}
      </div>
    </div>
  );
}
