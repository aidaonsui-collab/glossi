import { useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Modal from './Modal.jsx';
import { useBookings } from '../store.jsx';
import { useToast } from './Toast.jsx';

export const SAMPLE_SLOTS = [
  'Tomorrow · 11:30 AM',
  'Tomorrow · 4:00 PM',
  'Saturday · 10:00 AM',
  'Saturday · 2:30 PM',
  'Sunday · 1:00 PM',
];

export function hoursUntil(ts) {
  if (!ts) return Infinity;
  return (ts - Date.now()) / (3600 * 1000);
}

export default function BookingActions({ booking, onClose, onChanged }) {
  const { cancel, reschedule } = useBookings();
  const toast = useToast();
  const [mode, setMode] = useState(booking?._action || 'cancel');
  const [newSlot, setNewSlot] = useState(SAMPLE_SLOTS[0]);
  const [reason, setReason] = useState('');

  if (!booking) return null;

  const hours = hoursUntil(booking.appointmentAt);
  const lateCancel = hours < 24 && hours > 0;
  const refundAmount = lateCancel
    ? Math.round(booking.total * 0.5 * 100) / 100
    : booking.total;
  const kept = booking.total - refundAmount;

  const onCancel = () => {
    cancel(booking.id, { refund: refundAmount, kept });
    toast(lateCancel
      ? `Cancelled · $${refundAmount.toFixed(2)} refunded, salon keeps $${kept.toFixed(2)}.`
      : `Cancelled · full $${refundAmount.toFixed(2)} refund issued.`,
      { tone: 'success' });
    onChanged?.();
    onClose?.();
  };

  const onReschedule = () => {
    reschedule(booking.id, newSlot);
    toast(`Rescheduled to ${newSlot}.`, { tone: 'success' });
    onChanged?.();
    onClose?.();
  };

  const isCancel = mode === 'cancel';

  return (
    <Modal
      open={true}
      onClose={onClose}
      eyebrow={isCancel ? 'CANCEL APPOINTMENT' : 'RESCHEDULE'}
      title={booking.salonName}
      width={520}
      footer={
        <>
          <button onClick={onClose} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>
            Keep appointment
          </button>
          {isCancel ? (
            <button onClick={onCancel} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {lateCancel ? `Cancel · keep $${kept.toFixed(0)}` : 'Cancel · full refund'}
            </button>
          ) : (
            <button onClick={onReschedule} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Confirm reschedule
            </button>
          )}
        </>
      }
    >
      {/* Mode toggle */}
      <div style={{ display: 'inline-flex', background: p.bg, borderRadius: 99, border: `0.5px solid ${p.line}`, padding: 3, marginBottom: 18 }}>
        {[
          { id: 'cancel', l: 'Cancel' },
          { id: 'reschedule', l: 'Reschedule' },
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
          <span style={{ color: p.inkMuted }}>Service</span>
          <span style={{ color: p.ink, fontWeight: 600 }}>{booking.service}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: p.inkMuted }}>When</span>
          <span style={{ color: p.ink, fontWeight: 600, fontFamily: type.mono }}>{booking.slot}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: p.inkMuted }}>Paid</span>
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
                {lateCancel ? 'LATE CANCEL · 50% KEPT' : 'FREE CANCEL'}
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5 }}>
              {hours <= 0 ? (
                <>Appointment has already started. Cancellation may not refund.</>
              ) : lateCancel ? (
                <>You're cancelling within 24 hrs of your appointment. $${kept.toFixed(2)} stays with the salon as a deposit; $${refundAmount.toFixed(2)} is refunded to your card.</>
              ) : (
                <>You're outside the 24-hr window. Full $${refundAmount.toFixed(2)} returns to your card in 1–2 business days.</>
              )}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>REASON · OPTIONAL</div>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Helps Glossi improve. The salon won't see this." rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 13, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </>
      ) : (
        <>
          <div style={{ marginTop: 14, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>PICK A NEW SLOT</div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SAMPLE_SLOTS.map(s => {
              const sel = newSlot === s;
              return (
                <button key={s} onClick={() => setNewSlot(s)} style={{
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
            Reschedules are free. The salon is notified and your card stays on hold for the new slot.
          </div>
        </>
      )}
    </Modal>
  );
}
