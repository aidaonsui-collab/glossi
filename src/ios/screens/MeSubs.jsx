import { useState } from 'react';
import SalonPhoto from '../../components/SalonPhoto.jsx';
import TrustBadge from '../../components/TrustBadge.jsx';
import { IOSStatusBar } from '../IOSFrame.jsx';
import { Stars } from '../atoms.jsx';
import { useBookings, useSaved } from '../../store.jsx';
import { BIDS } from '../data.js';
import BookingActions from '../../components/BookingActions.jsx';
import Modal from '../../components/Modal.jsx';
import { useToast } from '../../components/Toast.jsx';

const FALLBACK_HISTORY = [
  { id: 'h1', salonName: 'Studio Onyx', service: 'Lash · Hybrid', service_es: 'Pestañas · Híbridas', total: 135, rating: 4, createdAt: new Date('2026-02-21').getTime(), mood: 3, salonId: 'b2' },
  { id: 'h2', salonName: 'Brisa Hair Bar', service: 'Cut + style', service_es: 'Corte + peinado', total: 65, rating: 5, createdAt: new Date('2026-02-02').getTime(), mood: 4, salonId: 'b5' },
  { id: 'h3', salonName: 'La Reina Salon', service: 'Gel manicure', service_es: 'Manicura gel', total: 42, rating: 4, createdAt: new Date('2026-01-18').getTime(), mood: 5, salonId: 'b3' },
];

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { weekday: 'short' }) + ' · ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SubBack({ onClick, p, type, title }) {
  return (
    <div style={{ padding: '54px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onClick} style={{
        border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999,
        background: p.surface, boxShadow: `inset 0 0 0 0.5px ${p.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div style={{ fontFamily: type.display, fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em', fontStyle: 'italic' }}>{title}</div>
    </div>
  );
}

export function Saved({ p, type, lang, onBack }) {
  const { ids, remove } = useSaved();
  const list = BIDS.filter(b => ids.includes(b.id));
  return (
    <div style={{ background: p.bg, minHeight: '100%', paddingBottom: 24 }}>
      <IOSStatusBar />
      <SubBack onClick={onBack} p={p} type={type} title={lang === 'en' ? 'Saved salons' : 'Guardados'} />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.length === 0 && (
          <div style={{ padding: 32, borderRadius: 14, border: `1px dashed ${p.inkMuted}`, background: p.surface, textAlign: 'center', fontSize: 13, color: p.inkMuted }}>
            {lang === 'en' ? 'No saved salons yet — tap the heart on any profile.' : 'Sin salones guardados — toca el corazón en cualquier perfil.'}
          </div>
        )}
        {list.map(s => (
          <div key={s.id} style={{ background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <SalonPhoto mood={s.mood} h={130} />
              <button onClick={() => remove(s.id)} style={{
                position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 999,
                border: 0, background: 'rgba(0,0,0,0.5)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={p.accent} stroke={p.accent} strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              </button>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: type.display, fontSize: 17, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{s.name}</div>
              <div style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkMuted, marginTop: 2 }}>
                ★ {s.rating} · {s.neighborhood} · <span style={{ fontFamily: type.mono }}>{s.distance} mi</span>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                {(s.badges || []).map(b => <TrustBadge key={b} kind={b} p={p} type={type} />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function History({ p, type, lang, onBack, onReview, onRebook }) {
  const { bookings } = useBookings();
  const [actionFor, setActionFor] = useState(null);
  const merged = [...bookings, ...FALLBACK_HISTORY];
  return (
    <div style={{ background: p.bg, minHeight: '100%', paddingBottom: 24 }}>
      <IOSStatusBar />
      <SubBack onClick={onBack} p={p} type={type} title={lang === 'en' ? 'Past bookings' : 'Historial'} />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {merged.map((h, i) => {
          const upcoming = h.status === 'upcoming';
          const cancelled = h.status === 'cancelled';
          return (
            <div key={h.id || i} style={{ padding: '14px 16px', background: p.surface, borderRadius: 14, border: `0.5px solid ${upcoming ? p.accent : p.line}`, opacity: cancelled ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: type.body, fontSize: 10, color: cancelled ? p.inkMuted : upcoming ? p.accent : p.inkMuted, fontWeight: 700, letterSpacing: '0.12em' }}>
                  {cancelled ? (lang === 'en' ? 'CANCELLED · ' : 'CANCELADA · ') : upcoming ? (lang === 'en' ? 'UPCOMING · ' : 'PRÓXIMA · ') : ''}{fmtDate(h.createdAt).toUpperCase()}
                </div>
                <div style={{ fontFamily: type.mono, fontSize: 14, color: cancelled ? p.success : p.ink, fontWeight: 600 }}>${((cancelled ? (h.refund ?? h.total) : h.total) || 0).toFixed(0)}</div>
              </div>
              <div style={{ marginTop: 6, fontFamily: type.display, fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em', fontStyle: 'italic', lineHeight: 1.1, textDecoration: cancelled ? 'line-through' : 'none' }}>{lang === 'en' ? h.service : (h.service_es || h.service)}</div>
              <div style={{ marginTop: 2, fontFamily: type.body, fontSize: 12.5, color: p.inkSoft }}>{h.salonName}{h.slot ? ` · ${h.slot}` : ''}</div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${p.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {upcoming ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setActionFor({ ...h, _action: 'reschedule' })} style={{ border: `0.5px solid ${p.line}`, background: 'transparent', cursor: 'pointer', padding: '6px 12px', borderRadius: 99, fontFamily: type.body, fontSize: 11, fontWeight: 600, color: p.ink }}>
                      {lang === 'en' ? 'Reschedule' : 'Cambiar'}
                    </button>
                    <button onClick={() => setActionFor({ ...h, _action: 'cancel' })} style={{ border: `0.5px solid ${p.accent}`, background: 'transparent', cursor: 'pointer', padding: '6px 12px', borderRadius: 99, fontFamily: type.body, fontSize: 11, fontWeight: 600, color: p.accent }}>
                      {lang === 'en' ? 'Cancel' : 'Cancelar'}
                    </button>
                  </div>
                ) : h.rating ? (
                  <Stars n={h.rating} color={p.accent} size={12} />
                ) : !cancelled ? (
                  <button onClick={() => onReview?.(h)} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5, color: p.accent, fontStyle: 'italic', fontWeight: 600, padding: 0 }}>
                    {lang === 'en' ? 'Leave a review →' : 'Reseña →'}
                  </button>
                ) : <span style={{ fontSize: 11, color: p.inkMuted, fontStyle: 'italic' }}>{lang === 'en' ? `Refunded $${(h.refund ?? 0).toFixed(0)}` : `Reembolso $${(h.refund ?? 0).toFixed(0)}`}</span>}
                {!upcoming && !cancelled && h.salonId && (
                  <button onClick={() => onRebook?.(h)} style={{ border: `0.5px solid ${p.line}`, background: p.bg, cursor: 'pointer', padding: '6px 12px', borderRadius: 99, fontFamily: type.body, fontSize: 11.5, fontWeight: 600, color: p.ink }}>
                    {lang === 'en' ? 'Book again' : 'Reservar de nuevo'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {actionFor && <BookingActions booking={actionFor} onClose={() => setActionFor(null)} />}
    </div>
  );
}

export function Payment({ p, type, lang, onBack }) {
  const toast = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [card, setCard] = useState({ name: '', number: '', exp: '', cvc: '' });
  const last4 = card.number.replace(/\s/g, '').slice(-4);
  const submitCard = () => {
    if (card.number.replace(/\s/g, '').length < 12) { toast(lang === 'en' ? 'Card number looks too short.' : 'Número incompleto.', { tone: 'warn' }); return; }
    if (!/^\d{2}\/\d{2}$/.test(card.exp)) { toast(lang === 'en' ? 'Use MM/YY for expiry.' : 'Usa MM/AA.', { tone: 'warn' }); return; }
    if (card.cvc.length < 3) { toast(lang === 'en' ? 'CVC needs 3+ digits.' : 'CVC mínimo 3 dígitos.', { tone: 'warn' }); return; }
    toast(lang === 'en' ? `Card ending ${last4} added.` : `Tarjeta •••• ${last4} agregada.`, { tone: 'success' });
    setShowAdd(false);
    setCard({ name: '', number: '', exp: '', cvc: '' });
  };
  return (
    <div style={{ background: p.bg, minHeight: '100%', paddingBottom: 24 }}>
      <IOSStatusBar />
      <SubBack onClick={onBack} p={p} type={type} title={lang === 'en' ? 'Payment' : 'Pagos'} />
      <div style={{ padding: '0 20px' }}>
        <div style={{ padding: '22px', background: 'linear-gradient(135deg, #1A1614 0%, #3A2A24 100%)', color: '#fff', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 18, right: 22, fontFamily: type.display, fontSize: 14, fontStyle: 'italic', fontWeight: 700, letterSpacing: '0.04em' }}>VISA</div>
          <div style={{ fontFamily: type.body, fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.16em' }}>{lang === 'en' ? 'PRIMARY CARD' : 'TARJETA PRINCIPAL'}</div>
          <div style={{ fontFamily: type.mono, fontSize: 18, marginTop: 42, letterSpacing: '0.12em', fontWeight: 500 }}>•••• •••• •••• 4729</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
            <div>
              <div style={{ fontFamily: type.body, fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.14em' }}>{lang === 'en' ? 'CARDHOLDER' : 'TITULAR'}</div>
              <div style={{ fontFamily: type.body, fontSize: 12, fontWeight: 600, marginTop: 2 }}>SOFIA MARTINEZ</div>
            </div>
            <div>
              <div style={{ fontFamily: type.body, fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.14em' }}>{lang === 'en' ? 'EXPIRES' : 'VENCE'}</div>
              <div style={{ fontFamily: type.mono, fontSize: 12, fontWeight: 600, marginTop: 2 }}>09/27</div>
            </div>
          </div>
        </div>

        <button onClick={() => setShowAdd(true)} style={{
          marginTop: 14, width: '100%', padding: '14px', borderRadius: 12, cursor: 'pointer',
          background: p.surface, border: `0.5px dashed ${p.line}`, color: p.ink,
          fontFamily: type.body, fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 300 }}>+</span>
          <span>{lang === 'en' ? 'Add new card' : 'Añadir tarjeta'}</span>
        </button>

        <div style={{ marginTop: 24, fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>{lang === 'en' ? 'BILLING' : 'FACTURACIÓN'}</div>
        <div style={{ marginTop: 10 }}>
          {[
            { l: lang === 'en' ? 'Total spent on Glossi' : 'Gastado total', v: '$284' },
            { l: lang === 'en' ? 'Saved vs walk-in pricing' : 'Ahorrado vs walk-in', v: '$142', ok: true },
            { l: lang === 'en' ? 'Receipts' : 'Recibos', v: '14' },
          ].map((r, i) => (
            <div key={i} style={{ padding: '14px 0', borderTop: i ? `0.5px solid ${p.line}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: type.body, fontSize: 13.5, color: p.ink, fontWeight: 500 }}>{r.l}</div>
              <div style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600, color: r.ok ? p.success : p.ink }}>{r.v}</div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} eyebrow={lang === 'en' ? 'NEW CARD' : 'NUEVA TARJETA'} title={lang === 'en' ? 'Add a payment method' : 'Añadir tarjeta'} footer={
        <>
          <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>{lang === 'en' ? 'Cancel' : 'Cancelar'}</button>
          <button onClick={submitCard} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{lang === 'en' ? 'Add card' : 'Añadir'}</button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{lang === 'en' ? 'CARDHOLDER' : 'TITULAR'}</div>
            <input value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="SOFIA MARTINEZ" autoFocus style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box' }} />
          </label>
          <label>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{lang === 'en' ? 'CARD NUMBER' : 'NÚMERO'}</div>
            <input
              value={card.number}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                const grouped = digits.replace(/(.{4})/g, '$1 ').trim();
                setCard(c => ({ ...c, number: grouped }));
              }}
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.mono, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box', letterSpacing: '0.04em' }}
            />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{lang === 'en' ? 'EXPIRES' : 'VENCE'}</div>
              <input
                value={card.exp}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                  setCard(c => ({ ...c, exp: v }));
                }}
                inputMode="numeric" placeholder="MM/YY"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.mono, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box' }}
              />
            </label>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>CVC</div>
              <input
                value={card.cvc}
                onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                inputMode="numeric" placeholder="123"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.mono, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box' }}
              />
            </label>
          </div>
          <div style={{ fontSize: 11, color: p.inkMuted, lineHeight: 1.5, marginTop: 4 }}>
            {lang === 'en'
              ? 'Demo · the prototype does not store card data. Real Glossi sends this through Stripe Elements with PCI-compliant tokenization.'
              : 'Demo · el prototipo no guarda datos. Glossi real usa Stripe Elements.'}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function Notifications({ p, type, lang, onBack }) {
  const [prefs, setPrefs] = useState({ bids: true, reminders: true, drops: false, news: true, sound: true });
  const items = lang === 'en' ? [
    { k: 'bids', l: 'New bids on my requests', d: 'Real-time notifications when salons respond' },
    { k: 'reminders', l: 'Booking reminders', d: '24h and 1h before your appointment' },
    { k: 'drops', l: 'Price drops near me', d: 'When a saved salon offers a deal' },
    { k: 'news', l: 'Glossi guides & tips', d: 'Editorial picks, weekly' },
    { k: 'sound', l: 'Sound', d: 'Ping when a bid arrives' },
  ] : [
    { k: 'bids', l: 'Nuevas ofertas', d: 'Cuando los salones respondan' },
    { k: 'reminders', l: 'Recordatorios', d: '24h y 1h antes' },
    { k: 'drops', l: 'Bajadas de precio', d: 'Cuando un salón guardado ofrezca' },
    { k: 'news', l: 'Guías Glossi', d: 'Editorial, semanal' },
    { k: 'sound', l: 'Sonido', d: 'Ping al recibir oferta' },
  ];
  return (
    <div style={{ background: p.bg, minHeight: '100%', paddingBottom: 24 }}>
      <IOSStatusBar />
      <SubBack onClick={onBack} p={p} type={type} title={lang === 'en' ? 'Notifications' : 'Notificaciones'} />
      <div style={{ padding: '0 20px' }}>
        {items.map((it, i) => (
          <div key={it.k} style={{ padding: '16px 0', borderTop: i ? `0.5px solid ${p.line}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: type.body, fontSize: 14, color: p.ink, fontWeight: 600 }}>{it.l}</div>
              <div style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkSoft, marginTop: 2, lineHeight: 1.45 }}>{it.d}</div>
            </div>
            <button onClick={() => setPrefs(s => ({ ...s, [it.k]: !s[it.k] }))} style={{
              width: 42, height: 24, borderRadius: 99, position: 'relative', cursor: 'pointer',
              background: prefs[it.k] ? p.success : p.line, transition: 'background 0.2s',
              border: 0, padding: 0, fontFamily: 'inherit',
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 99, background: '#fff', position: 'absolute', top: 3, left: prefs[it.k] ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
