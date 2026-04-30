import { useState } from 'react';
import SalonPhoto from '../../components/SalonPhoto.jsx';
import { IOSStatusBar } from '../IOSFrame.jsx';
import { Pulse } from '../atoms.jsx';
import { REQUESTS } from '../data.js';

export function BizInbox({ p, type, lang, onOpen }) {
  return (
    <div style={{ background: p.bg, minHeight: '100%', paddingBottom: 36 }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>CASA DE BELLEZA · PHARR</div>
          <div style={{ fontFamily: type.display, fontSize: 30, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.025em', fontStyle: 'italic', marginTop: 4, lineHeight: 1 }}>
            {lang === 'en' ? "Today's requests" : 'Solicitudes de hoy'}
          </div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: 'linear-gradient(135deg,#C28A6B,#8B4F3A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 14, fontWeight: 700, border: `1.5px solid ${p.accent}` }}>MR</div>
      </div>

      <div style={{ margin: '18px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { k: lang === 'en' ? 'Open' : 'Abiertas', v: 4, c: p.accent },
          { k: lang === 'en' ? 'Won today' : 'Ganadas hoy', v: 3, c: p.success },
          { k: lang === 'en' ? 'Win rate' : 'Tasa', v: '34%', c: p.ink },
        ].map((s, i) => (
          <div key={i} style={{ padding: '12px', background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}` }}>
            <div style={{ fontFamily: type.body, fontSize: 9.5, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.1em' }}>{s.k.toUpperCase()}</div>
            <div style={{ fontFamily: type.mono, fontSize: 22, color: s.c, fontWeight: 600, marginTop: 2, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '22px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>
          {lang === 'en' ? '4 NEW · WITHIN 5 MI' : '4 NUEVAS · A 8 KM'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: type.body, fontSize: 10, color: p.success, fontWeight: 700, letterSpacing: '0.14em' }}>
          <Pulse color={p.success} /><span>LIVE</span>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {REQUESTS.map(r => {
          const note = lang === 'en' ? r.note : r.note_es;
          const service = lang === 'en' ? r.service : r.service_es;
          const when = lang === 'en' ? r.when : r.when_es;
          return (
            <button key={r.id} onClick={() => onOpen(r)} style={{
              border: `0.5px solid ${r.urgent ? p.accent : p.line}`, background: p.surface, cursor: 'pointer',
              borderRadius: 16, padding: '14px 16px', textAlign: 'left', position: 'relative', width: '100%',
              fontFamily: 'inherit', boxShadow: r.urgent ? `inset 0 0 0 1px ${p.accent}55` : 'none',
            }}>
              {r.urgent && (
                <div style={{ position: 'absolute', top: 0, right: 14, background: p.accent, color: p.bg, fontFamily: type.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', padding: '4px 8px', borderRadius: '0 0 6px 6px' }}>
                  {lang === 'en' ? 'ASAP' : 'YA'}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>{r.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: type.body, fontSize: 13, color: p.ink, fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontFamily: type.body, fontSize: 11, color: p.inkMuted, display: 'flex', gap: 6, marginTop: 1 }}>
                    <span style={{ fontFamily: type.mono }}>{r.distance} mi</span><span>·</span><span>{r.posted}</span><span>·</span>
                    <span>{r.photos} {lang === 'en' ? 'photos' : 'fotos'}</span>
                  </div>
                </div>
                <div style={{ fontFamily: type.mono, fontSize: 10, color: p.inkSoft, background: p.surface2, padding: '4px 8px', borderRadius: 99, fontWeight: 600 }}>
                  {r.bidsCount} {lang === 'en' ? 'bids' : 'ofs'}
                </div>
              </div>
              {r.customerOffer && (
                <div style={{ marginTop: 10, padding: '10px 12px', background: p.accent + '1f', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, border: `0.5px solid ${p.accent}55` }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: p.accent }} />
                  <span style={{ fontFamily: type.body, fontSize: 11.5, color: p.ink, fontWeight: 600 }}>
                    {lang === 'en' ? `Customer offered $${r.customerOffer}` : `Cliente ofreció $${r.customerOffer}`}
                  </span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: type.body, fontSize: 10.5, color: p.accent, fontWeight: 700, letterSpacing: '0.08em' }}>
                    {lang === 'en' ? 'RESPOND →' : 'RESPONDER →'}
                  </span>
                </div>
              )}
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${p.line}` }}>
                <div style={{ fontFamily: type.display, fontSize: 16, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em', fontStyle: 'italic', lineHeight: 1.1 }}>{service}</div>
                <div style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkSoft, marginTop: 3 }}>{when}</div>
                <div style={{ marginTop: 8, fontFamily: type.body, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.45 }}>"{note}"</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BizBid({ p, type, lang, request, onBack, onSend }) {
  const r = request || REQUESTS[0];
  const [price, setPrice] = useState(95);
  const [slot, setSlot] = useState(0);
  const slots = lang === 'en'
    ? [{ l: 'Today', t: '4:00 PM' }, { l: 'Today', t: '6:30 PM' }, { l: 'Tomorrow', t: '10:00 AM' }]
    : [{ l: 'Hoy', t: '4:00 PM' }, { l: 'Hoy', t: '6:30 PM' }, { l: 'Mañana', t: '10:00 AM' }];
  const band = price < 90 ? 'low' : price > 135 ? 'high' : 'sweet';
  const bandLabel = {
    low: lang === 'en' ? 'Aggressive · 64% win · slim margin' : 'Agresivo · 64% gana · margen bajo',
    sweet: lang === 'en' ? 'Sweet spot · 41% win · healthy' : 'Punto dulce · 41% gana · sano',
    high: lang === 'en' ? 'Premium · 18% win · best margin' : 'Premium · 18% gana · mejor margen',
  };
  const bandColor = { low: p.accent, sweet: p.success, high: p.inkSoft };

  return (
    <div style={{ background: p.bg, minHeight: '100%' }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{ border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: p.surface, boxShadow: `inset 0 0 0 0.5px ${p.line}` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ fontFamily: type.mono, fontSize: 10.5, color: p.inkMuted, letterSpacing: '0.12em', fontWeight: 600 }}>
          {lang === 'en' ? 'SEND BID' : 'ENVIAR OFERTA'}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '14px 20px 24px' }}>
        <div style={{ background: p.surface, borderRadius: 14, padding: '14px', border: `0.5px solid ${p.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>{r.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: type.body, fontSize: 13, color: p.ink, fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontFamily: type.body, fontSize: 11, color: p.inkMuted }}>
                {lang === 'en' ? r.service : r.service_es} · {r.distance} mi
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontFamily: type.body, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.45 }}>"{lang === 'en' ? r.note : r.note_es}"</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[1, 2, 5].slice(0, r.photos).map((m, i) => <SalonPhoto key={i} mood={m} h={50} style={{ width: 50, borderRadius: 8 }} />)}
          </div>
        </div>

        <div style={{ marginTop: 14, padding: '12px 14px', background: p.accentSoft, borderRadius: 12 }}>
          <div style={{ fontFamily: type.body, fontSize: 9.5, color: p.accent, fontWeight: 700, letterSpacing: '0.14em' }}>◆ GLOSSI INSIGHT</div>
          <div style={{ fontFamily: type.body, fontSize: 12, color: p.ink, lineHeight: 1.45, marginTop: 4 }}>
            {lang === 'en'
              ? <>Color in <b>78501</b> wins at <b style={{ fontFamily: type.mono }}>$95–$135</b>. Under $90: 64% win, 4.6★ avg.</>
              : <>Color en <b>78501</b> gana con <b style={{ fontFamily: type.mono }}>$95–$135</b>. Bajo $90: 64% gana, 4.6★.</>}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>01 · {lang === 'en' ? 'YOUR PRICE' : 'TU PRECIO'}</div>
          <div style={{ marginTop: 10, padding: '22px 20px 18px', background: p.ink, color: p.bg, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'center' }}>
              <span style={{ fontFamily: type.mono, fontSize: 18, opacity: 0.6 }}>$</span>
              <span style={{ fontFamily: type.mono, fontSize: 54, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', lineHeight: 1 }}>{price}</span>
            </div>
            <input type="range" min="60" max="180" step="5" value={price} onChange={e => setPrice(+e.target.value)} style={{ width: '100%', accentColor: p.accent, marginTop: 14 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: type.mono, fontSize: 9.5, color: 'rgba(255,255,255,0.5)', marginTop: 2, letterSpacing: '0.04em' }}>
              <span>$60</span><span>$95</span><span>$135</span><span>$180</span>
            </div>
            <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', fontFamily: type.body, fontSize: 11, color: bandColor[band], fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: bandColor[band] }} />
              <span>{bandLabel[band]}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>02 · {lang === 'en' ? 'EARLIEST SLOT' : 'PRIMER TURNO'}</div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {slots.map((s, i) => (
              <button key={i} onClick={() => setSlot(i)} style={{
                border: `0.5px solid ${slot === i ? p.ink : p.line}`,
                background: slot === i ? p.ink : p.surface, color: slot === i ? p.bg : p.ink,
                borderRadius: 12, padding: '10px 8px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              }}>
                <div style={{ fontFamily: type.body, fontSize: 10, fontWeight: 600, opacity: 0.7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.l}</div>
                <div style={{ fontFamily: type.mono, fontSize: 13, fontWeight: 600, marginTop: 2 }}>{s.t}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>03 · {lang === 'en' ? 'A NOTE TO SOFIA' : 'NOTA PARA SOFIA'}</div>
          <div style={{ marginTop: 10, padding: '12px 14px', background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}`, fontFamily: type.body, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5, fontStyle: 'italic' }}>
            {lang === 'en' ? '"We can fit you in. Includes wash + blow dry. Marisol — 12 yrs in balayage."' : '"Te acomodamos. Incluye lavado y secado. Marisol — 12 años en balayage."'}
          </div>
        </div>

        <button onClick={() => onSend({ price, slot: slots[slot] })} style={{ marginTop: 22, width: '100%', border: 0, cursor: 'pointer', background: p.accent, color: p.ink, padding: '16px 18px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: type.display, fontWeight: type.displayWeight, fontSize: 18, fontStyle: 'italic' }}>{lang === 'en' ? 'Send bid' : 'Enviar oferta'}</span>
            <span style={{ fontFamily: type.mono, fontSize: 11, opacity: 0.7, fontWeight: 500 }}>${price} · {slots[slot].l} {slots[slot].t}</span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

export function BizSent({ p, type, lang, request, sentBid, onBack }) {
  const r = request || REQUESTS[0];
  const others = [
    { name: 'Studio Onyx', price: 145, your: false },
    { name: 'Brisa Hair Bar', price: 110, your: false },
    { name: 'You', price: sentBid?.price || 95, your: true },
    { name: 'La Reina Salon', price: 78, your: false },
  ].sort((a, b) => a.price - b.price);
  return (
    <div style={{ background: p.bg, minHeight: '100%' }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0' }}>
        <button onClick={onBack} style={{ border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: p.surface, boxShadow: `inset 0 0 0 0.5px ${p.line}` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div style={{ padding: '30px 22px 0' }}>
        <div style={{ width: 54, height: 54, borderRadius: 999, background: p.success + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={p.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontFamily: type.display, fontSize: 36, lineHeight: 1, marginTop: 18, color: p.ink, fontWeight: type.displayWeight, fontStyle: 'italic', letterSpacing: '-0.025em' }}>
          {lang === 'en' ? 'Bid sent.' : 'Oferta enviada.'}
        </div>
        <div style={{ fontFamily: type.body, fontSize: 13, color: p.inkSoft, marginTop: 6, lineHeight: 1.45 }}>
          {lang === 'en'
            ? `Sofia sees your bid live. ${others.length - 1} other salons are competing.`
            : `Sofia ve tu oferta en vivo. ${others.length - 1} otros salones compitiendo.`}
        </div>
      </div>
      <div style={{ padding: '22px 20px 0' }}>
        <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>
          {lang === 'en' ? 'COMPETING BIDS · LIVE' : 'OFERTAS · EN VIVO'}
        </div>
        <div style={{ marginTop: 10, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
          {others.map((o, i) => (
            <div key={i} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: i ? `0.5px solid ${p.line}` : 'none', background: o.your ? p.accentSoft : 'transparent',
            }}>
              <div>
                <div style={{ fontFamily: type.body, fontSize: 9, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>#{i + 1}</div>
                <div style={{ fontFamily: type.display, fontSize: 15, fontWeight: type.displayWeight, color: p.ink, marginTop: 2 }}>{o.name}{o.your ? ` ${lang === 'en' ? '· you' : '· tú'}` : ''}</div>
              </div>
              <div style={{ fontFamily: type.mono, fontSize: 22, fontWeight: 600, color: o.your ? p.accent : p.ink, letterSpacing: '-0.02em' }}>${o.price}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontFamily: type.body, fontSize: 11.5, color: p.inkMuted, lineHeight: 1.5 }}>
          {lang === 'en'
            ? "We'll notify you the moment Sofia picks. You can edit your bid anytime."
            : 'Te avisamos cuando Sofia elija. Puedes editar tu oferta cuando quieras.'}
        </div>
      </div>
    </div>
  );
}
