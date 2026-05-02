import { useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Modal from './Modal.jsx';
import { useBookings, useLang } from '../store.jsx';
import { useToast } from './Toast.jsx';
import { useT } from '../lib/i18n.js';

export const SAMPLE_SLOTS = [
  'Tomorrow · 11:30 AM',
  'Tomorrow · 4:00 PM',
  'Saturday · 10:00 AM',
  'Saturday · 2:30 PM',
  'Sunday · 1:00 PM',
];

const SAMPLE_SLOTS_ES = [
  'Mañana · 11:30 AM',
  'Mañana · 4:00 PM',
  'Sábado · 10:00 AM',
  'Sábado · 2:30 PM',
  'Domingo · 1:00 PM',
];

export function hoursUntil(ts) {
  if (!ts) return Infinity;
  return (ts - Date.now()) / (3600 * 1000);
}

export default function BookingActions({ booking, onClose, onChanged }) {
  const { cancel, reschedule } = useBookings();
  const toast = useToast();
  const t = useT();
  const { lang } = useLang();
  const [mode, setMode] = useState(booking?._action || 'cancel');
  const [newSlotIdx, setNewSlotIdx] = useState(0);
  const [reason, setReason] = useState('');

  if (!booking) return null;

  const hours = hoursUntil(booking.appointmentAt);
  const lateCancel = hours < 24 && hours > 0;
  const refundAmount = lateCancel
    ? Math.round(booking.total * 0.5 * 100) / 100
    : booking.total;
  const kept = booking.total - refundAmount;

  const slots = lang === 'es' ? SAMPLE_SLOTS_ES : SAMPLE_SLOTS;
  const newSlot = slots[newSlotIdx];

  const onCancel = () => {
    cancel(booking.id, { refund: refundAmount, kept });
    if (lang === 'es') {
      toast(lateCancel
        ? `Cancelado · $${refundAmount.toFixed(2)} reembolsado, el salón se queda con $${kept.toFixed(2)}.`
        : `Cancelado · reembolso completo de $${refundAmount.toFixed(2)} emitido.`,
        { tone: 'success' });
    } else {
      toast(lateCancel
        ? `Cancelled · $${refundAmount.toFixed(2)} refunded, salon keeps $${kept.toFixed(2)}.`
        : `Cancelled · full $${refundAmount.toFixed(2)} refund issued.`,
        { tone: 'success' });
    }
    onChanged?.();
    onClose?.();
  };

  const onReschedule = () => {
    reschedule(booking.id, newSlot);
    toast(lang === 'es' ? `Reagendado para ${newSlot}.` : `Rescheduled to ${newSlot}.`, { tone: 'success' });
    onChanged?.();
    onClose?.();
  };

  const isCancel = mode === 'cancel';

  return (
    <Modal
      open={true}
      onClose={onClose}
      eyebrow={isCancel ? t('CANCEL APPOINTMENT', 'CANCELAR CITA') : t('RESCHEDULE', 'REAGENDAR')}
      title={booking.salonName}
      width={520}
      footer={
        <>
          <button onClick={onClose} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>
            {t('Keep appointment', 'Mantener cita')}
          </button>
          {isCancel ? (
            <button onClick={onCancel} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {lateCancel
                ? (lang === 'es' ? `Cancelar · queda $${kept.toFixed(0)}` : `Cancel · keep $${kept.toFixed(0)}`)
                : t('Cancel · full refund', 'Cancelar · reembolso completo')}
            </button>
          ) : (
            <button onClick={onReschedule} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('Confirm reschedule', 'Confirmar reagendado')}
            </button>
          )}
        </>
      }
    >
      {/* Mode toggle */}
      <div style={{ display: 'inline-flex', background: p.bg, borderRadius: 99, border: `0.5px solid ${p.line}`, padding: 3, marginBottom: 18 }}>
        {[
          { id: 'cancel', l: t('Cancel', 'Cancelar') },
          { id: 'reschedule', l: t('Reschedule', 'Reagendar') },
        ].map(o => {
          const a = mode === o.id;
          return (
            <button key={o.id} onClick={() => setMode(o.id)} style={{
              padding: '7px 16px', borderRadius: 99, border: 0,
              background: a ? p.ink : 'transparent', color: a ? p.bg : p.ink,
              fontFamily: type.body, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            }}>{o.l}</button>
          );
        })}
      </div>

      {/* Booking summary */}
      <div style={{ padding: '12px 14px', background: p.bg, borderRadius: 12, border: `0.5px solid ${p.line}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: p.inkMuted }}>{t('Service', 'Servicio')}</span>
          <span style={{ color: p.ink, fontWeight: 600 }}>{booking.service}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: p.inkMuted }}>{t('When', 'Cuándo')}</span>
          <span style={{ color: p.ink, fontWeight: 600, fontFamily: type.mono }}>{booking.slot}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: p.inkMuted }}>{t('Paid', 'Pagado')}</span>
          <span style={{ color: p.ink, fontWeight: 600, fontFamily: type.mono }}>${(booking.total || 0).toFixed(2)}</span>
        </div>
      </div>

      {isCancel ? (
        <>
          {/* 24-hr warning */}
          <div style={{
            marginTop: 14, padding: '14px 16px', borderRadius: 12,
            background: lateCancel ? p.accent + '1f' : p.success + '14',
            border: `0.5px solid ${lateCancel ? p.accent + '55' : p.success + '40'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: lateCancel ? p.accent : p.success }} />
              <div style={{ fontFamily: type.body, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', color: lateCancel ? p.accent : p.success }}>
                {lateCancel
                  ? t('LATE CANCEL · 50% KEPT', 'CANCELACIÓN TARDÍA · 50% RETENIDO')
                  : t('FREE CANCEL', 'CANCELACIÓN GRATIS')}
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5 }}>
              {hours <= 0 ? (
                lang === 'es'
                  ? <>La cita ya empezó. Puede que la cancelación no genere reembolso.</>
                  : <>Appointment has already started. Cancellation may not refund.</>
              ) : lateCancel ? (
                lang === 'es'
                  ? <>Estás cancelando dentro de las 24 hrs antes de la cita. ${kept.toFixed(2)} se quedan con el salón como depósito; ${refundAmount.toFixed(2)} se reembolsan a tu tarjeta.</>
                  : <>You're cancelling within 24 hrs of your appointment. ${kept.toFixed(2)} stays with the salon as a deposit; ${refundAmount.toFixed(2)} is refunded to your card.</>
              ) : (
                lang === 'es'
                  ? <>Estás fuera de la ventana de 24 hrs. Los ${refundAmount.toFixed(2)} completos vuelven a tu tarjeta en 1–2 días hábiles.</>
                  : <>You're outside the 24-hr window. Full ${refundAmount.toFixed(2)} returns to your card in 1–2 business days.</>
              )}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t('REASON · OPTIONAL', 'MOTIVO · OPCIONAL')}</div>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder={t("Helps Glossi improve. The salon won't see this.", 'Ayuda a Glossi a mejorar. El salón no verá esto.')} rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 13, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </>
      ) : (
        <>
          <div style={{ marginTop: 14, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{t('PICK A NEW SLOT', 'ELIGE UN HORARIO NUEVO')}</div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {slots.map((s, i) => {
              const sel = newSlotIdx === i;
              return (
                <button key={s} onClick={() => setNewSlotIdx(i)} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: sel ? p.surface : 'transparent',
                  border: `0.5px solid ${sel ? p.ink : p.line}`,
                  boxShadow: sel ? `inset 0 0 0 1px ${p.ink}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: p.ink }}>{s}</span>
                  <div style={{ width: 16, height: 16, borderRadius: 99, border: `1.5px solid ${sel ? p.ink : p.line}`, background: sel ? p.ink : 'transparent' }} />
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12, padding: '10px 12px', background: p.accentSoft, borderRadius: 10, fontSize: 12, color: p.ink, lineHeight: 1.5 }}>
            {t('Reschedules are free. The salon is notified and your card stays on hold for the new slot.', 'Reagendar es gratis. Se notifica al salón y tu tarjeta queda retenida para el nuevo horario.')}
          </div>
        </>
      )}
    </Modal>
  );
}
