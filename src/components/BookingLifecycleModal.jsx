import { useEffect, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Modal from './Modal.jsx';
import { useToast } from './Toast.jsx';
import {
  cancelBooking,
  fetchCancellationPreview,
  markBookingComplete,
  markBookingNoShow,
  submitReview,
} from '../lib/quotes.js';

const fmtMoney = cents => `$${((cents || 0) / 100).toFixed(2)}`;
const fmtHours = h => h == null ? '—'
  : h < 1 ? `${Math.round(h * 60)} min`
  : h < 48 ? `${h.toFixed(1)} hr`
  : `${Math.floor(h / 24)} day${Math.floor(h / 24) === 1 ? '' : 's'}`;

// Drives all post-payment booking actions for whichever side is open.
//
// mode = 'cancel' | 'complete' | 'no_show' | 'review'
// callerRole = 'customer' | 'salon'
//
// onClosed(refresh: boolean) is called from every exit path so the caller
// can tell whether to refetch.
export default function BookingLifecycleModal({ booking, mode, callerRole, onClose }) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState('');
  const [preview, setPreview] = useState(null);
  const [previewErr, setPreviewErr] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState('');

  useEffect(() => {
    if (mode !== 'cancel' || !booking?.id) { setPreview(null); return; }
    let cancelled = false;
    fetchCancellationPreview(booking.id).then(r => {
      if (cancelled) return;
      if (!r.ok) setPreviewErr(r.error);
      else setPreview(r.preview);
    });
    return () => { cancelled = true; };
  }, [mode, booking?.id]);

  if (!booking || !mode) return null;

  const close = (refresh = false) => onClose?.(refresh);

  const onCancel = async () => {
    setSubmitting(true);
    const r = await cancelBooking({ bookingId: booking.id, reason });
    setSubmitting(false);
    if (!r.ok) { toast(r.error, { tone: 'warn' }); return; }
    if (r.refundAmountCents > 0) {
      toast(`Cancelled · ${fmtMoney(r.refundAmountCents)} refunded.`, { tone: 'success' });
    } else {
      toast('Cancelled — no refund (within 24h).', { tone: 'warn' });
    }
    close(true);
  };

  const onComplete = async () => {
    setSubmitting(true);
    const r = await markBookingComplete(booking.id);
    setSubmitting(false);
    if (!r.ok) { toast(r.error, { tone: 'warn' }); return; }
    toast('Marked complete.', { tone: 'success' });
    close(true);
  };

  const onNoShow = async () => {
    setSubmitting(true);
    const r = await markBookingNoShow(booking.id);
    setSubmitting(false);
    if (!r.ok) { toast(r.error, { tone: 'warn' }); return; }
    toast('Marked no-show.', { tone: 'success' });
    close(true);
  };

  const onReview = async () => {
    if (!rating) { toast('Tap a star.', { tone: 'warn' }); return; }
    setSubmitting(true);
    const r = await submitReview({ bookingId: booking.id, rating, body });
    setSubmitting(false);
    if (!r.ok) { toast(r.error, { tone: 'warn' }); return; }
    toast(`Thanks — ${rating}★ posted.`, { tone: 'success' });
    close(true);
  };

  // ── Cancel ───────────────────────────────────────────────────────
  if (mode === 'cancel') {
    const eligible = preview?.refund_eligible;
    const amount = preview?.refund_amount_cents;
    const hours = preview?.hours_until;
    const isSalon = callerRole === 'salon';

    return (
      <Modal
        open
        onClose={() => !submitting && close(false)}
        eyebrow="CANCEL APPOINTMENT"
        title={booking.salonName || booking.customerName || 'Booking'}
        width={520}
        footer={(
          <>
            <button onClick={() => close(false)} disabled={submitting} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>Keep booking</button>
            <button onClick={onCancel} disabled={submitting || !preview?.cancelable_by_caller} style={{
              background: p.accent, color: p.ink, border: 0,
              padding: '11px 22px', borderRadius: 99,
              fontSize: 13, fontWeight: 600,
              cursor: (submitting || !preview?.cancelable_by_caller) ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: (submitting || !preview?.cancelable_by_caller) ? 0.6 : 1,
            }}>
              {submitting ? 'Cancelling…' : eligible ? `Cancel · ${fmtMoney(amount)} refund` : 'Cancel · no refund'}
            </button>
          </>
        )}
      >
        {previewErr && (
          <div style={{ padding: '12px 14px', background: '#FFE6E6', color: '#7a2828', borderRadius: 10, fontSize: 13 }}>
            {previewErr}
          </div>
        )}
        {!previewErr && !preview && (
          <div style={{ padding: 20, color: p.inkMuted, fontSize: 13 }}>Checking refund eligibility…</div>
        )}
        {preview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: eligible ? p.success + '14' : p.accent + '1f',
              border: `0.5px solid ${eligible ? p.success + '40' : p.accent + '55'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: eligible ? p.success : p.accent }} />
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', color: eligible ? p.success : p.accent }}>
                  {eligible ? (isSalon ? 'SALON CANCEL · FULL REFUND' : 'FREE CANCEL') : 'LATE CANCEL · NO REFUND'}
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5 }}>
                {isSalon
                  ? `Salon-initiated cancellations always refund the customer in full (${fmtMoney(preview.price_cents)}). Both your destination payout and Glossi's fee are reversed.`
                  : eligible
                    ? `Appointment is in ${fmtHours(hours)}. Full ${fmtMoney(preview.price_cents)} returns to your card in 1–2 business days.`
                    : `Appointment is in ${fmtHours(hours)} — under our 24-hour window. No refund will be issued.`
                }
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>REASON · OPTIONAL</div>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                placeholder={isSalon ? 'Helps the customer understand why.' : "Helps Glossi improve. The salon won't see this."}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 13, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}
      </Modal>
    );
  }

  // ── Complete (salon) ─────────────────────────────────────────────
  if (mode === 'complete') {
    return (
      <Modal
        open
        onClose={() => !submitting && close(false)}
        eyebrow="MARK COMPLETE"
        title={booking.customerName || 'Booking'}
        width={460}
        footer={(
          <>
            <button onClick={() => close(false)} disabled={submitting} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={onComplete} disabled={submitting} style={{ background: p.success, color: '#fff', border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
              {submitting ? 'Saving…' : 'Mark complete'}
            </button>
          </>
        )}
      >
        <div style={{ fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55 }}>
          Marking this appointment complete unlocks the customer's review prompt. Funds already settled to your account when the booking was paid (Phase 6 destination charge), so this is just the lifecycle flip — no Stripe action runs.
        </div>
      </Modal>
    );
  }

  // ── No-show (salon) ──────────────────────────────────────────────
  if (mode === 'no_show') {
    return (
      <Modal
        open
        onClose={() => !submitting && close(false)}
        eyebrow="NO-SHOW"
        title={booking.customerName || 'Booking'}
        width={460}
        footer={(
          <>
            <button onClick={() => close(false)} disabled={submitting} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={onNoShow} disabled={submitting} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
              {submitting ? 'Saving…' : 'Mark no-show'}
            </button>
          </>
        )}
      >
        <div style={{ fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55 }}>
          Flag this customer as a no-show. You keep the full payment — there's no refund. The customer sees the booking marked "No-show" in their history. Use sparingly; abuse can affect your verification.
        </div>
      </Modal>
    );
  }

  // ── Review (customer) ────────────────────────────────────────────
  if (mode === 'review') {
    const label = ['Tap a star', 'Bad', 'Meh', 'Fine', 'Great', 'Excellent'][hover || rating];
    return (
      <Modal
        open
        onClose={() => !submitting && close(false)}
        eyebrow="LEAVE A REVIEW"
        title={booking.salonName || 'Salon'}
        width={460}
        footer={(
          <>
            <button onClick={() => close(false)} disabled={submitting} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>Maybe later</button>
            <button onClick={onReview} disabled={submitting || !rating} style={{ background: rating ? p.ink : p.line, color: p.bg, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: (submitting || !rating) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: (submitting || !rating) ? 0.6 : 1 }}>
              {submitting ? 'Posting…' : rating ? `Post · ${rating}★` : 'Pick a rating'}
            </button>
          </>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {[1, 2, 3, 4, 5].map(n => {
              const filled = n <= (hover || rating);
              return (
                <button key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4, fontFamily: 'inherit' }}
                >
                  <svg width="38" height="38" viewBox="0 0 24 24" fill={filled ? p.accent : 'none'} stroke={p.accent} strokeWidth="1.5">
                    <path d="M12 2l3 7 7.5.5-5.5 5 1.5 7.5L12 18l-6.5 4 1.5-7.5-5.5-5L9 9z" strokeLinejoin="round" />
                  </svg>
                </button>
              );
            })}
          </div>
          <div style={{ fontFamily: type.mono, fontSize: 12, color: p.inkMuted, letterSpacing: '0.06em' }}>{label.toUpperCase()}</div>

          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>YOUR REVIEW · OPTIONAL</div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={4}
              placeholder="What was the vibe? Did the result match what you asked for?"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 13, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </Modal>
    );
  }

  return null;
}
