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
import { useT } from '../lib/i18n.js';
import { useLang } from '../store.jsx';

const fmtMoney = cents => `$${((cents || 0) / 100).toFixed(2)}`;
const fmtPriceShort = cents => `$${Math.round((cents || 0) / 100)}`;
const fmtHours = (h, lang) => h == null ? '—'
  : lang === 'es'
    ? (h < 1 ? `${Math.round(h * 60)} min` : h < 48 ? `${h.toFixed(1)} hr` : `${Math.floor(h / 24)} ${Math.floor(h / 24) === 1 ? 'día' : 'días'}`)
    : (h < 1 ? `${Math.round(h * 60)} min` : h < 48 ? `${h.toFixed(1)} hr` : `${Math.floor(h / 24)} day${Math.floor(h / 24) === 1 ? '' : 's'}`);
const fmtServices = slugs => (slugs || []).map(s => s.replace('-', ' & ')).join(', ');
const fmtWhen = (ts, lang) => ts
  ? new Date(ts).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  : null;

// Compact card every confirmation modal renders so the user can
// double-check what they're acting on before tapping the verb.
// callerRole='salon' shows customerName; 'customer' shows salonName.
function BookingSummary({ booking, callerRole }) {
  const t = useT();
  const { lang } = useLang();
  const headline = callerRole === 'salon'
    ? (booking.customerName || t('Customer', 'Cliente'))
    : (booking.salonName || t('Salon', 'Salón'));
  const service = booking.serviceSummary || fmtServices(booking.serviceSlugs);
  const when = fmtWhen(booking.scheduledAt, lang);
  return (
    <div style={{ padding: '14px 16px', background: p.bg, borderRadius: 12, border: `0.5px solid ${p.line}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{headline}</div>
          {service && <div style={{ fontSize: 12.5, color: p.inkSoft, marginTop: 2 }}>{service}</div>}
          {when && <div style={{ fontSize: 12, color: p.inkMuted, marginTop: 2 }}>{when}</div>}
        </div>
        {booking.priceCents != null && (
          <div style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 600, color: p.ink, letterSpacing: '-0.02em' }}>
            {fmtPriceShort(booking.priceCents)}
          </div>
        )}
      </div>
    </div>
  );
}

// Drives all post-payment booking actions for whichever side is open.
//
// mode = 'cancel' | 'complete' | 'no_show' | 'review'
// callerRole = 'customer' | 'salon'
//
// onClosed(refresh: boolean) is called from every exit path so the caller
// can tell whether to refetch.
export default function BookingLifecycleModal({ booking, mode, callerRole, onClose, onLocalReview }) {
  const toast = useToast();
  const t = useT();
  const { lang } = useLang();
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
      toast(lang === 'es' ? `Cancelado · ${fmtMoney(r.refundAmountCents)} reembolsado.` : `Cancelled · ${fmtMoney(r.refundAmountCents)} refunded.`, { tone: 'success' });
    } else {
      toast(t('Cancelled — no refund (within 24h).', 'Cancelado — sin reembolso (dentro de 24h).'), { tone: 'warn' });
    }
    close(true);
  };

  const onComplete = async () => {
    setSubmitting(true);
    const r = await markBookingComplete(booking.id);
    setSubmitting(false);
    if (!r.ok) { toast(r.error, { tone: 'warn' }); return; }
    toast(t('Marked complete.', 'Marcado como completado.'), { tone: 'success' });
    close(true);
  };

  const onNoShow = async () => {
    setSubmitting(true);
    const r = await markBookingNoShow(booking.id);
    setSubmitting(false);
    if (!r.ok) { toast(r.error, { tone: 'warn' }); return; }
    toast(t('Marked no-show.', 'Marcado como no asistió.'), { tone: 'success' });
    close(true);
  };

  const onReview = async () => {
    if (!rating) { toast(t('Tap a star.', 'Toca una estrella.'), { tone: 'warn' }); return; }
    setSubmitting(true);
    const r = await submitReview({ bookingId: booking.id, rating, body });
    setSubmitting(false);
    if (!r.ok) { toast(r.error, { tone: 'warn' }); return; }
    // Flip the row's button to stars immediately so the customer
    // can't double-submit while the explicit refresh + realtime
    // catch up. The realtime + refresh still run via close(true).
    onLocalReview?.({ bookingId: booking.id, rating, body });
    toast(lang === 'es' ? `Gracias — publicaste ${rating}★.` : `Thanks — ${rating}★ posted.`, { tone: 'success' });
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
        eyebrow={t('CANCEL', 'CANCELAR')}
        title={t('Cancel this booking?', '¿Cancelar esta reservación?')}
        width={520}
        footer={(
          <>
            <button onClick={() => close(false)} disabled={submitting} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>{t('Keep booking', 'Mantener reservación')}</button>
            <button onClick={onCancel} disabled={submitting || !preview?.cancelable_by_caller} style={{
              background: p.accent, color: p.ink, border: 0,
              padding: '11px 22px', borderRadius: 99,
              fontSize: 13, fontWeight: 600,
              cursor: (submitting || !preview?.cancelable_by_caller) ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: (submitting || !preview?.cancelable_by_caller) ? 0.6 : 1,
            }}>
              {submitting ? t('Cancelling…', 'Cancelando…') : eligible ? (lang === 'es' ? `Cancelar · reembolso de ${fmtMoney(amount)}` : `Cancel · ${fmtMoney(amount)} refund`) : t('Cancel · no refund', 'Cancelar · sin reembolso')}
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
          <div style={{ padding: 20, color: p.inkMuted, fontSize: 13 }}>{t('Checking refund eligibility…', 'Verificando elegibilidad de reembolso…')}</div>
        )}
        {preview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <BookingSummary booking={booking} callerRole={callerRole} />
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: eligible ? p.success + '14' : p.accent + '1f',
              border: `0.5px solid ${eligible ? p.success + '40' : p.accent + '55'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: eligible ? p.success : p.accent }} />
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', color: eligible ? p.success : p.accent }}>
                  {eligible
                    ? (isSalon ? t('FULL REFUND', 'REEMBOLSO COMPLETO') : t('FREE CANCEL', 'CANCELACIÓN GRATIS'))
                    : t('NO REFUND', 'SIN REEMBOLSO')}
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5 }}>
                {isSalon
                  ? (lang === 'es'
                      ? `Las cancelaciones del salón siempre reembolsan al cliente al 100% — ${fmtMoney(preview.price_cents)} de regreso a su tarjeta.`
                      : `Salon cancels always refund the customer in full — ${fmtMoney(preview.price_cents)} back to their card.`)
                  : eligible
                    ? (lang === 'es'
                        ? `La cita es en ${fmtHours(hours, lang)}. ${fmtMoney(preview.price_cents)} regresa a tu tarjeta en 1–2 días hábiles.`
                        : `Appointment is in ${fmtHours(hours, lang)}. ${fmtMoney(preview.price_cents)} returns to your card in 1–2 business days.`)
                    : (lang === 'es'
                        ? `La cita es en ${fmtHours(hours, lang)} — dentro de nuestra ventana de 24 horas, así que no se puede emitir reembolso.`
                        : `Appointment is in ${fmtHours(hours, lang)} — under our 24-hour window, so no refund can be issued.`)
                }
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t('REASON · OPTIONAL', 'MOTIVO · OPCIONAL')}</div>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                placeholder={isSalon
                  ? t('Helps the customer understand why.', 'Ayuda al cliente a entender por qué.')
                  : t("Helps Glossi improve. The salon won't see this.", 'Ayuda a Glossi a mejorar. El salón no verá esto.')}
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
        eyebrow={t('MARK COMPLETE', 'MARCAR COMPLETADA')}
        title={t('Confirm appointment', 'Confirmar cita')}
        width={460}
        footer={(
          <>
            <button onClick={() => close(false)} disabled={submitting} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>{t('Cancel', 'Cancelar')}</button>
            <button onClick={onComplete} disabled={submitting} style={{ background: p.success, color: '#fff', border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
              {submitting ? t('Saving…', 'Guardando…') : t('Mark complete', 'Marcar completada')}
            </button>
          </>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BookingSummary booking={booking} callerRole={callerRole} />
          <div style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.55 }}>
            {t("The customer will be invited to leave a review. This can't be undone.", 'Se invitará al cliente a dejar una reseña. Esto no se puede deshacer.')}
          </div>
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
        eyebrow={t('NO-SHOW', 'NO ASISTIÓ')}
        title={t("Customer didn't show?", '¿El cliente no se presentó?')}
        width={460}
        footer={(
          <>
            <button onClick={() => close(false)} disabled={submitting} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>{t('Cancel', 'Cancelar')}</button>
            <button onClick={onNoShow} disabled={submitting} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
              {submitting ? t('Saving…', 'Guardando…') : t('Mark no-show', 'Marcar no asistió')}
            </button>
          </>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BookingSummary booking={booking} callerRole={callerRole} />
          <div style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.55 }}>
            {lang === 'es'
              ? `Te quedas con los ${fmtPriceShort(booking.priceCents)} completos — sin reembolso. Úsalo con moderación; los no-asistió marcados se registran.`
              : `You keep the full ${fmtPriceShort(booking.priceCents)} — no refund. Use this sparingly; flagged no-shows are tracked.`}
          </div>
        </div>
      </Modal>
    );
  }

  // ── Review (customer) ────────────────────────────────────────────
  if (mode === 'review') {
    const labelsEn = ['Tap a star', 'Bad', 'Meh', 'Fine', 'Great', 'Excellent'];
    const labelsEs = ['Toca una estrella', 'Mal', 'Más o menos', 'Bien', 'Muy bien', 'Excelente'];
    const label = (lang === 'es' ? labelsEs : labelsEn)[hover || rating];
    return (
      <Modal
        open
        onClose={() => !submitting && close(false)}
        eyebrow={t('LEAVE A REVIEW', 'DEJA UNA RESEÑA')}
        title={booking.salonName || t('Salon', 'Salón')}
        width={460}
        footer={(
          <>
            <button onClick={() => close(false)} disabled={submitting} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>{t('Maybe later', 'Tal vez después')}</button>
            <button onClick={onReview} disabled={submitting || !rating} style={{ background: rating ? p.ink : p.line, color: p.bg, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: (submitting || !rating) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: (submitting || !rating) ? 0.6 : 1 }}>
              {submitting ? t('Posting…', 'Publicando…') : rating ? (lang === 'es' ? `Publicar · ${rating}★` : `Post · ${rating}★`) : t('Pick a rating', 'Elige una calificación')}
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
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t('YOUR REVIEW · OPTIONAL', 'TU RESEÑA · OPCIONAL')}</div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={4}
              placeholder={t('What was the vibe? Did the result match what you asked for?', '¿Cómo fue la experiencia? ¿El resultado coincidió con lo que pediste?')}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 13, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </Modal>
    );
  }

  return null;
}
