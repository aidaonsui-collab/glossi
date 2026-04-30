import SalonPhoto from '../../components/SalonPhoto.jsx';
import { IOSStatusBar } from '../IOSFrame.jsx';
import { Eyebrow, Price } from '../atoms.jsx';
import { T } from '../data.js';

export default function Booked({ p, type, lang, bid, receipt, onBack, onAddCal, onDirections }) {
  const t = T[lang];
  if (!bid) return null;
  const slot = lang === 'en' ? bid.slot_en : bid.slot_es;
  const note = lang === 'en' ? bid.note_en : bid.note_es;
  const save = bid.originalPrice - bid.price;
  const total = receipt?.total ?? bid.price;
  const tipAmt = receipt?.tipAmt ?? 0;
  const tax = receipt?.tax ?? 0;

  return (
    <div style={{ background: p.bg, minHeight: '100%' }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onBack} style={{
          border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: p.surface, boxShadow: `inset 0 0 0 0.5px ${p.line}`,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke={p.ink} strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div style={{ padding: '40px 24px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, margin: '0 auto', background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={p.bg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontFamily: type.display, fontSize: 44, lineHeight: 1, marginTop: 24, color: p.ink, fontWeight: type.displayWeight, fontStyle: 'italic', letterSpacing: '-0.025em' }}>{t.booked}.</div>
        <div style={{ fontFamily: type.body, fontSize: 14, color: p.inkSoft, marginTop: 10, maxWidth: 280, margin: '10px auto 0', lineHeight: 1.5 }}>{t.bookedSub}</div>
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ background: p.surface, borderRadius: 18, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
          <SalonPhoto mood={bid.mood} h={80} style={{ borderRadius: 0 }} />
          <div style={{ padding: '14px 16px 16px' }}>
            <div style={{ fontFamily: type.display, fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{bid.name}</div>
            <div style={{ fontFamily: type.body, fontSize: 12, color: p.inkMuted, marginTop: 2 }}>{bid.neighborhood} · {bid.distance} {t.miAway}</div>

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `0.5px solid ${p.line}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { k: lang === 'en' ? 'When' : 'Cuándo', v: slot, mono: true },
                { k: lang === 'en' ? 'Stylist' : 'Estilista', v: bid.artist, mono: false },
                { k: lang === 'en' ? 'Service' : 'Servicio', v: t.color, mono: false },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontFamily: type.body, fontSize: 12, color: p.inkMuted, fontWeight: 500 }}>{r.k}</div>
                  <div style={{ fontFamily: r.mono ? type.mono : type.body, fontSize: 13, color: p.ink, fontWeight: 600, textAlign: 'right' }}>{r.v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `0.5px solid ${p.line}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { k: lang === 'en' ? 'Subtotal' : 'Subtotal', v: bid.price.toFixed(2) },
                ...(receipt ? [
                  { k: lang === 'en' ? `Tip${receipt.tipPct ? ` (${receipt.tipPct}%)` : ''}` : `Propina${receipt.tipPct ? ` (${receipt.tipPct}%)` : ''}`, v: tipAmt.toFixed(2) },
                  { k: lang === 'en' ? 'Tax' : 'Impuestos', v: tax.toFixed(2) },
                ] : []),
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: type.body, fontSize: 12, color: p.inkMuted, fontWeight: 500 }}>{r.k}</span>
                  <span style={{ fontFamily: type.mono, fontSize: 12, color: p.inkSoft, fontWeight: 500 }}>${r.v}</span>
                </div>
              ))}
              <div style={{ marginTop: 4, paddingTop: 8, borderTop: `0.5px solid ${p.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: type.body, fontSize: 12, color: p.ink, fontWeight: 700 }}>{lang === 'en' ? 'Charged' : 'Cobrado'}</div>
                <Price value={total.toFixed(2)} mono={type.mono} color={p.ink} size={26} weight={500} />
              </div>
            </div>

            <div style={{ marginTop: 10, padding: '10px 12px', background: p.success + '18', borderRadius: 10, fontFamily: type.body, fontSize: 12, color: p.success, fontWeight: 600, textAlign: 'center' }}>
              {t.youSave} <span style={{ fontFamily: type.mono }}>${save}</span> {lang === 'en' ? 'vs walk-in' : 'vs walk-in'} · {Math.round(save / bid.originalPrice * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <Eyebrow c={p.inkMuted}>{lang === 'en' ? 'NOTE FROM' : 'NOTA DE'} {bid.artist.toUpperCase()}</Eyebrow>
        <div style={{ marginTop: 8, padding: '12px 14px', background: p.accentSoft, borderRadius: 12, fontFamily: type.display, fontSize: 14, color: p.ink, lineHeight: 1.5, fontStyle: 'italic' }}>
          "{note}"
        </div>
      </div>

      <div style={{ padding: '20px 20px 36px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={onAddCal} style={{ width: '100%', border: 0, cursor: 'pointer', background: p.ink, color: p.bg, padding: '15px', borderRadius: 14, fontFamily: type.body, fontSize: 14, fontWeight: 600 }}>{t.addCal}</button>
        <button onClick={onDirections} style={{ width: '100%', cursor: 'pointer', background: p.surface, color: p.ink, padding: '15px', border: `0.5px solid ${p.line}`, borderRadius: 14, fontFamily: type.body, fontSize: 14, fontWeight: 600 }}>{t.directions}</button>
      </div>
    </div>
  );
}
