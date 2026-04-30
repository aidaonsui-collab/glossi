import { useState } from 'react';
import { IOSStatusBar } from '../ios/IOSFrame.jsx';
import SalonPhoto from './SalonPhoto.jsx';

const TIP_OPTIONS = [15, 18, 20];

export default function Checkout({ p, type, lang, surface, bid, onBack, onConfirm }) {
  const [tipPct, setTipPct] = useState(18);
  const [customTip, setCustomTip] = useState('');
  const [paymentId, setPaymentId] = useState('visa');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!bid) return null;

  const isIOS = surface === 'ios';
  const subtotal = bid.price;
  const tipAmt = tipPct === 'custom'
    ? Math.max(0, parseFloat(customTip) || 0)
    : Math.round(subtotal * tipPct / 100);
  const discount = promoApplied ? Math.round(subtotal * 0.10) : 0;
  const tax = Math.round((subtotal - discount) * 0.0625 * 100) / 100; // 6.25% TX state sales tax (mock)
  const total = subtotal - discount + tipAmt + tax;

  const slot = lang === 'en' ? bid.slot_en : bid.slot_es;
  const note = lang === 'en' ? bid.note_en : bid.note_es;

  const applyPromo = () => {
    if (!promo) return;
    if (promo.toUpperCase() === 'GLOSSI10') setPromoApplied(true);
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => onConfirm({ bid, tipAmt, tax, total, paymentId, tipPct: tipPct === 'custom' ? null : tipPct }), 700);
  };

  return (
    <div style={{ background: p.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', color: p.ink, fontFamily: type.body }}>
      {isIOS && <IOSStatusBar />}

      {/* Header */}
      <div style={{
        padding: isIOS ? '54px 20px 12px' : '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `0.5px solid ${p.line}`, background: p.bg,
      }}>
        <button onClick={onBack} disabled={submitting} style={{
          border: 0, cursor: submitting ? 'not-allowed' : 'pointer',
          width: 36, height: 36, borderRadius: 999, background: p.surface,
          boxShadow: `inset 0 0 0 0.5px ${p.line}`, opacity: submitting ? 0.5 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.14em', fontWeight: 600 }}>
          {lang === 'en' ? 'CHECKOUT · SECURE' : 'PAGO · SEGURO'}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, padding: isIOS ? '20px 20px 24px' : '28px 32px 32px', maxWidth: 600, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Title */}
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isIOS ? 32 : 44, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '4px 0 0' }}>
          {lang === 'en' ? 'Confirm booking.' : 'Confirma reserva.'}
        </h1>

        {/* Order summary */}
        <div style={{ marginTop: 22, background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 12, padding: '14px' }}>
            <SalonPhoto mood={bid.mood} h={64} style={{ width: 64, borderRadius: 10 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{bid.name}</div>
              <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 2 }}>★ {bid.rating} · {bid.neighborhood}</div>
              <div style={{ marginTop: 6, fontFamily: type.body, fontSize: 12.5, color: p.inkSoft, fontStyle: 'italic', lineHeight: 1.4 }}>"{note}"</div>
            </div>
          </div>
          <div style={{ padding: '12px 14px', borderTop: `0.5px solid ${p.line}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { k: lang === 'en' ? 'Service' : 'Servicio', v: lang === 'en' ? 'Color & balayage' : 'Color y balayage' },
              { k: lang === 'en' ? 'When' : 'Cuándo', v: slot, mono: true },
              { k: lang === 'en' ? 'Stylist' : 'Estilista', v: `${bid.artist} · ${bid.years} ${lang === 'en' ? 'yrs' : 'años'}` },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontFamily: type.body, fontSize: 12, color: p.inkMuted, fontWeight: 500 }}>{r.k}</span>
                <span style={{ fontFamily: r.mono ? type.mono : type.body, fontSize: 13, color: p.ink, fontWeight: 600 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>
            01 · {lang === 'en' ? 'TIP YOUR STYLIST' : 'PROPINA'}
          </div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {TIP_OPTIONS.map(pct => {
              const sel = tipPct === pct;
              return (
                <button key={pct} onClick={() => setTipPct(pct)} style={{
                  padding: '12px 6px', borderRadius: 12,
                  background: sel ? p.ink : p.surface, color: sel ? p.bg : p.ink,
                  border: `0.5px solid ${sel ? p.ink : p.line}`, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <div style={{ fontFamily: type.body, fontSize: 13, fontWeight: 600 }}>{pct}%</div>
                  <div style={{ fontFamily: type.mono, fontSize: 10.5, marginTop: 2, opacity: 0.7 }}>${Math.round(subtotal * pct / 100)}</div>
                </button>
              );
            })}
            <button onClick={() => setTipPct('custom')} style={{
              padding: '12px 6px', borderRadius: 12,
              background: tipPct === 'custom' ? p.ink : p.surface, color: tipPct === 'custom' ? p.bg : p.ink,
              border: `0.5px solid ${tipPct === 'custom' ? p.ink : p.line}`, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <div style={{ fontFamily: type.body, fontSize: 13, fontWeight: 600 }}>{lang === 'en' ? 'Custom' : 'Otro'}</div>
              <div style={{ fontFamily: type.mono, fontSize: 10.5, marginTop: 2, opacity: 0.7 }}>$</div>
            </button>
          </div>
          {tipPct === 'custom' && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 12 }}>
              <span style={{ fontFamily: type.mono, fontSize: 14, color: p.inkMuted }}>$</span>
              <input value={customTip} onChange={e => setCustomTip(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder="0.00" autoFocus style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: type.mono, fontSize: 16, color: p.ink, fontWeight: 600 }} />
            </div>
          )}
        </div>

        {/* Promo code */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>
            02 · {lang === 'en' ? 'PROMO CODE' : 'CÓDIGO'}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <input value={promo} onChange={e => { setPromo(e.target.value); setPromoApplied(false); }} placeholder={lang === 'en' ? 'Try GLOSSI10' : 'Prueba GLOSSI10'} style={{
              flex: 1, padding: '12px 14px', borderRadius: 12,
              border: `0.5px solid ${p.line}`, background: p.surface,
              fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }} />
            <button onClick={applyPromo} disabled={!promo || promoApplied} style={{
              padding: '12px 18px', borderRadius: 12, border: 0, cursor: !promo || promoApplied ? 'not-allowed' : 'pointer',
              background: promoApplied ? p.success : p.ink, color: p.bg,
              fontFamily: type.body, fontSize: 13, fontWeight: 600,
              opacity: !promo ? 0.5 : 1,
            }}>{promoApplied ? (lang === 'en' ? 'Applied ✓' : 'Aplicado ✓') : (lang === 'en' ? 'Apply' : 'Aplicar')}</button>
          </div>
          {promoApplied && (
            <div style={{ marginTop: 6, fontFamily: type.body, fontSize: 11.5, color: p.success, fontWeight: 600 }}>
              GLOSSI10 — 10% off subtotal
            </div>
          )}
        </div>

        {/* Payment method */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>
            03 · {lang === 'en' ? 'PAYMENT' : 'PAGO'}
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'visa', l: 'Visa •••• 4729', sub: lang === 'en' ? 'Expires 09/27' : 'Vence 09/27', icon: 'card' },
              { id: 'apple', l: 'Apple Pay', sub: lang === 'en' ? 'Touch ID required' : 'Touch ID requerido', icon: 'apple' },
              { id: 'add', l: lang === 'en' ? 'Add new card' : 'Añadir tarjeta', sub: '', icon: 'plus' },
            ].map(opt => {
              const sel = opt.id === paymentId;
              return (
                <button key={opt.id} onClick={() => setPaymentId(opt.id)} style={{
                  padding: '14px', borderRadius: 12, cursor: 'pointer',
                  background: p.surface,
                  border: `0.5px solid ${sel ? p.ink : p.line}`,
                  boxShadow: sel ? `inset 0 0 0 1px ${p.ink}` : 'none',
                  display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit', textAlign: 'left',
                }}>
                  <div style={{ width: 40, height: 28, borderRadius: 6, background: opt.id === 'visa' ? 'linear-gradient(135deg, #1A1614 0%, #3A2A24 100%)' : opt.id === 'apple' ? '#000' : p.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 10, fontStyle: 'italic', fontWeight: 700, border: opt.id === 'add' ? `0.5px dashed ${p.inkMuted}` : 0 }}>
                    {opt.id === 'visa' && 'VISA'}
                    {opt.id === 'apple' && <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>}
                    {opt.id === 'add' && <span style={{ color: p.inkMuted, fontSize: 18, fontStyle: 'normal' }}>+</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: type.body, fontSize: 14, fontWeight: 600, color: p.ink }}>{opt.l}</div>
                    {opt.sub && <div style={{ fontFamily: type.body, fontSize: 11, color: p.inkMuted, marginTop: 1 }}>{opt.sub}</div>}
                  </div>
                  <div style={{ width: 18, height: 18, borderRadius: 999, border: `1.5px solid ${sel ? p.ink : p.line}`, background: sel ? p.ink : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {sel && <div style={{ width: 8, height: 8, borderRadius: 999, background: p.bg }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total breakdown */}
        <div style={{ marginTop: 22, padding: '16px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { k: lang === 'en' ? 'Subtotal' : 'Subtotal', v: subtotal },
              ...(promoApplied ? [{ k: 'GLOSSI10', v: -discount, color: p.success }] : []),
              { k: lang === 'en' ? `Tip${tipPct === 'custom' ? '' : ` (${tipPct}%)`}` : `Propina${tipPct === 'custom' ? '' : ` (${tipPct}%)`}`, v: tipAmt },
              { k: lang === 'en' ? 'Tax' : 'Impuestos', v: tax },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, color: p.inkSoft, fontWeight: 500 }}>{r.k}</span>
                <span style={{ fontFamily: type.mono, fontSize: 13, fontWeight: 600, color: r.color || p.ink }}>{r.v < 0 ? '−' : ''}${Math.abs(r.v).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, paddingTop: 12, borderTop: `0.5px solid ${p.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, color: p.ink }}>
              {lang === 'en' ? 'Total today' : 'Total hoy'}
            </span>
            <span style={{ fontFamily: type.mono, fontSize: 26, fontWeight: 600, color: p.ink, letterSpacing: '-0.02em' }}>${total.toFixed(2)}</span>
          </div>
          <div style={{ marginTop: 8, fontFamily: type.body, fontSize: 11, color: p.inkMuted, lineHeight: 1.5 }}>
            {lang === 'en'
              ? "We won't charge your card until your appointment. Free cancellation up to 24 hrs before."
              : 'No te cobramos hasta tu cita. Cancelación gratis hasta 24h antes.'}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'sticky', bottom: 0,
        padding: isIOS ? '14px 20px 28px' : '16px 32px 24px',
        background: `linear-gradient(180deg, ${p.bg}00 0%, ${p.bg} 30%)`,
      }}>
        <button onClick={submit} disabled={submitting} style={{
          width: '100%', padding: '16px 18px', borderRadius: 14, border: 0,
          cursor: submitting ? 'wait' : 'pointer',
          background: submitting ? p.inkSoft : p.ink, color: p.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'inherit',
        }}>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <span style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight }}>
              {submitting ? (lang === 'en' ? 'Booking…' : 'Reservando…') : (lang === 'en' ? 'Confirm & book' : 'Confirmar y reservar')}
            </span>
            {!submitting && (
              <span style={{ fontFamily: type.mono, fontSize: 11, opacity: 0.7, fontWeight: 500 }}>
                {paymentId === 'apple' ? 'Apple Pay' : paymentId === 'visa' ? 'Visa •••• 4729' : (lang === 'en' ? 'New card' : 'Nueva tarjeta')}
              </span>
            )}
          </span>
          <span style={{ fontFamily: type.mono, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
            ${total.toFixed(2)}
          </span>
        </button>
        <div style={{ marginTop: 8, textAlign: 'center', fontFamily: type.body, fontSize: 10.5, color: p.inkMuted, letterSpacing: '0.04em' }}>
          🔒 {lang === 'en' ? 'PAYMENTS PROCESSED BY STRIPE' : 'PAGOS PROCESADOS POR STRIPE'}
        </div>
      </div>
    </div>
  );
}
