import { useState } from 'react';
import SalonPhoto from '../../components/SalonPhoto.jsx';

export default function Offer({ p, type, lang, salon, onClose, onSend }) {
  const [price, setPrice] = useState(85);
  const [when, setWhen] = useState(0);
  const slots = lang === 'en'
    ? [{ l: 'This week' }, { l: 'Next week' }, { l: 'Flexible' }]
    : [{ l: 'Esta semana' }, { l: 'Próxima' }, { l: 'Flexible' }];
  const service = lang === 'en' ? 'Color & balayage' : 'Color y balayage';

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      animation: 'glossiBackdropIn 0.18s ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: p.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '14px 22px 28px', maxHeight: '85%', overflow: 'auto',
        animation: 'glossiSlideIn 0.22s ease-out',
      }}>
        <div style={{ width: 36, height: 4, background: p.line, borderRadius: 99, margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <SalonPhoto mood={salon?.mood ?? 1} h={42} style={{ width: 42, borderRadius: 8 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>{lang === 'en' ? 'OFFER TO' : 'OFERTA A'}</div>
            <div style={{ fontFamily: type.display, fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em', fontStyle: 'italic' }}>
              {salon?.name || 'Casa de Belleza'}
            </div>
          </div>
        </div>

        <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>01 · {lang === 'en' ? 'SERVICE' : 'SERVICIO'}</div>
        <div style={{ marginTop: 8, padding: '12px 14px', background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}`, fontFamily: type.body, fontSize: 14, color: p.ink, fontWeight: 500 }}>{service}</div>

        <div style={{ marginTop: 18, fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>02 · {lang === 'en' ? 'YOUR OFFER' : 'TU OFERTA'}</div>
        <div style={{ marginTop: 10, padding: '20px 18px 16px', background: p.ink, color: p.bg, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'center' }}>
            <span style={{ fontFamily: type.mono, fontSize: 18, opacity: 0.6 }}>$</span>
            <span style={{ fontFamily: type.mono, fontSize: 54, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{price}</span>
          </div>
          <input type="range" min="50" max="200" step="5" value={price} onChange={e => setPrice(+e.target.value)} style={{ width: '100%', accentColor: p.accent, marginTop: 12 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontFamily: type.mono, fontSize: 9.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>
            <span>$50</span>
            <span>{lang === 'en' ? `Their typical: $${salon?.originalPrice || 130}` : `Suelen: $${salon?.originalPrice || 130}`}</span>
            <span>$200</span>
          </div>
        </div>

        <div style={{ marginTop: 18, fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>03 · {lang === 'en' ? 'WHEN' : 'CUÁNDO'}</div>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {slots.map((s, i) => (
            <button key={i} onClick={() => setWhen(i)} style={{
              border: `0.5px solid ${when === i ? p.ink : p.line}`,
              background: when === i ? p.ink : p.surface, color: when === i ? p.bg : p.ink,
              borderRadius: 12, padding: '10px 8px', cursor: 'pointer',
              fontFamily: type.body, fontSize: 12, fontWeight: 600,
            }}>{s.l}</button>
          ))}
        </div>

        <button onClick={() => onSend({ price, service, when: slots[when].l })} style={{
          marginTop: 22, width: '100%', border: 0, cursor: 'pointer',
          background: p.accent, color: p.ink, padding: '16px 18px', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: type.display, fontSize: 18, fontWeight: type.displayWeight, fontStyle: 'italic',
        }}>
          {lang === 'en' ? `Send $${price} offer` : `Enviar oferta $${price}`}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={onClose} style={{ marginTop: 8, width: '100%', border: 0, background: 'transparent', cursor: 'pointer', fontFamily: type.body, fontSize: 12.5, color: p.inkMuted, fontWeight: 500, padding: '10px' }}>
          {lang === 'en' ? 'Cancel' : 'Cancelar'}
        </button>
      </div>
    </div>
  );
}
