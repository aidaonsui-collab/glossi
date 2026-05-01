import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import SalonLayout from '../components/SalonLayout.jsx';
import BookingLifecycleModal from '../components/BookingLifecycleModal.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useMyBusinesses, useSalonBookingsList } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const fmtPrice = cents => `$${Math.round((cents || 0) / 100)}`;
const fmtServices = slugs => (slugs || []).map(s => s.replace('-', ' & ')).join(', ') || 'Appointment';
const fmtDateTime = ts => ts
  ? new Date(ts).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  : '—';
const fmtDuration = min => !min ? '—' : min < 60 ? `${min} min` : `${Math.round(min / 60 * 10) / 10} hr`;

const STATUS_TONE = (palette, status) => ({
  confirmed: { bg: palette.accentSoft, fg: palette.accent, label: 'CONFIRMED' },
  completed: { bg: palette.success + '22', fg: palette.success, label: 'COMPLETED' },
  no_show:   { bg: palette.inkMuted + '22', fg: palette.inkMuted, label: 'NO-SHOW' },
  cancelled: { bg: palette.line, fg: palette.inkMuted, label: 'CANCELLED' },
}[status] || { bg: palette.line, fg: palette.inkMuted, label: (status || '').toUpperCase() });

export default function SalonBookingDetail() {
  const { id } = useParams();
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const { businesses } = useMyBusinesses();
  const businessId = businesses[0]?.id;
  const { bookings, loading, refresh } = useSalonBookingsList(businessId);

  const [lifecycleAction, setLifecycleAction] = useState(null);

  const booking = useMemo(
    () => bookings.find(b => b.booking_id === id) || null,
    [bookings, id],
  );

  // If the booking doesn't exist for this salon, send them back rather
  // than rendering an indefinite empty page.
  useEffect(() => {
    if (!loading && businessId && bookings.length > 0 && !booking) {
      navigate('/salon/calendar', { replace: true });
    }
  }, [loading, businessId, bookings, booking, navigate]);

  if (!isSupabaseConfigured) {
    return (
      <SalonLayout active="calendar" mobileTitle="Booking">
        <div style={{ padding: 40, color: p.inkMuted, fontSize: 14 }}>Supabase isn't configured.</div>
      </SalonLayout>
    );
  }

  if (loading || !booking) {
    return (
      <SalonLayout active="calendar" mobileTitle="Booking">
        <div style={{ padding: 40, color: p.inkMuted, fontSize: 14 }}>Loading…</div>
      </SalonLayout>
    );
  }

  const tone = STATUS_TONE(p, booking.status);
  const isConfirmed = booking.status === 'confirmed';
  const lifecycleBooking = {
    id: booking.booking_id,
    customerName: booking.customer_name,
    salonName: businesses.find(x => x.id === businessId)?.name,
    scheduledAt: booking.scheduled_at,
    priceCents: booking.price_cents,
    serviceSlugs: booking.service_slugs,
  };
  const openAction = mode => setLifecycleAction({ booking: lifecycleBooking, mode });

  return (
    <SalonLayout active="calendar" mobileTitle="Booking">
      <div style={{ padding: isPhone ? '20px 18px 80px' : '34px 40px 60px', maxWidth: 760 }}>
        <Link to="/salon/calendar" style={{ fontSize: 12, color: p.inkMuted, textDecoration: 'none', fontWeight: 600 }}>← Back to calendar</Link>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: '5px 10px', borderRadius: 99, background: tone.bg, color: tone.fg, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em' }}>
            {tone.label}
          </div>
          {booking.refunded_amount_cents > 0 && (
            <div style={{ padding: '5px 10px', borderRadius: 99, background: p.surface2, color: p.inkSoft, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em' }}>
              {fmtPrice(booking.refunded_amount_cents)} REFUNDED
            </div>
          )}
        </div>

        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '12px 0 0' }}>
          {booking.customer_name || 'Customer'}
        </h1>
        <div style={{ fontSize: 14, color: p.inkSoft, marginTop: 4 }}>
          {fmtServices(booking.service_slugs)}
        </div>

        {/* Primary actions */}
        {isConfirmed && (
          <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => openAction('complete')} style={{
              background: p.success, color: '#fff', border: 0,
              padding: '14px 22px', borderRadius: 99,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Mark complete
            </button>
            <button onClick={() => openAction('no_show')} style={{
              background: p.surface, color: p.ink, border: `0.5px solid ${p.line}`,
              padding: '14px 20px', borderRadius: 99,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              No-show
            </button>
            <button onClick={() => openAction('cancel')} style={{
              background: 'transparent', color: p.accent, border: `0.5px solid ${p.accent}`,
              padding: '14px 20px', borderRadius: 99,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Cancel booking
            </button>
          </div>
        )}

        {/* Booking facts */}
        <div style={{ marginTop: 24, padding: '20px 22px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
            <Field label="WHEN" value={fmtDateTime(booking.scheduled_at)} />
            <Field label="DURATION" value={fmtDuration(booking.duration_min)} />
            <Field label="PRICE" mono value={fmtPrice(booking.price_cents)} />
            <Field label="PAYMENT" value={booking.payment_status || '—'} capitalize />
            {booking.completed_at && <Field label="COMPLETED AT" value={fmtDateTime(booking.completed_at)} />}
            {booking.no_show_at && <Field label="MARKED NO-SHOW" value={fmtDateTime(booking.no_show_at)} />}
            {booking.cancelled_at && <Field label="CANCELLED AT" value={fmtDateTime(booking.cancelled_at)} />}
          </div>

          {booking.request_notes && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: p.bg, borderRadius: 12, border: `0.5px solid ${p.line}`, fontSize: 13, color: p.inkSoft, fontStyle: 'italic', lineHeight: 1.5 }}>
              "{booking.request_notes}"
            </div>
          )}
        </div>

        {/* Customer */}
        <div style={{ marginTop: 18, padding: '20px 22px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}` }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>CUSTOMER</div>
          <div style={{ marginTop: 8, fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.015em' }}>
            {booking.customer_name || 'Customer'}
          </div>
          {(booking.customer_email || booking.customer_phone) && (
            <div style={{ marginTop: 6, fontSize: 13, color: p.inkSoft }}>
              {booking.customer_email}
              {booking.customer_email && booking.customer_phone ? ' · ' : ''}
              {booking.customer_phone}
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 12, color: p.inkMuted }}>ZIP {booking.search_zip || '—'}</div>
        </div>

        {/* Review */}
        {booking.review_rating && (
          <div style={{ marginTop: 18, padding: '20px 22px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.accent }}>CUSTOMER REVIEW</div>
            <div style={{ marginTop: 8, fontSize: 22, color: p.accent, letterSpacing: '0.05em' }}>
              {'★'.repeat(booking.review_rating)}<span style={{ color: p.line }}>{'★'.repeat(5 - booking.review_rating)}</span>
            </div>
            {booking.review_body && (
              <div style={{ marginTop: 10, fontSize: 14, color: p.inkSoft, lineHeight: 1.55, fontStyle: 'italic' }}>
                "{booking.review_body}"
              </div>
            )}
          </div>
        )}
      </div>

      {lifecycleAction && (
        <BookingLifecycleModal
          booking={lifecycleAction.booking}
          mode={lifecycleAction.mode}
          callerRole="salon"
          onClose={shouldRefresh => {
            setLifecycleAction(null);
            if (shouldRefresh) refresh?.();
          }}
        />
      )}
    </SalonLayout>
  );
}

function Field({ label, value, mono, capitalize }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{label}</div>
      <div style={{
        marginTop: 4,
        fontFamily: mono ? type.mono : type.body,
        fontSize: mono ? 22 : 15,
        fontWeight: 600,
        color: p.ink,
        textTransform: capitalize ? 'capitalize' : 'none',
        letterSpacing: mono ? '-0.02em' : 'normal',
      }}>{value}</div>
    </div>
  );
}
