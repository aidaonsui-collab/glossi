import { useEffect, useMemo, useState } from 'react';
import SalonPhoto from '../../components/SalonPhoto.jsx';
import TrustBadge from '../../components/TrustBadge.jsx';
import { IOSStatusBar } from '../IOSFrame.jsx';
import { Eyebrow, Pulse, Stars, Price } from '../atoms.jsx';
import { T, BIDS } from '../data.js';

function BidCard({ bid, p, type, lang, t, isNew, onPick, onOffer, onProfile }) {
  const slot = lang === 'en' ? bid.slot_en : bid.slot_es;
  const note = lang === 'en' ? bid.note_en : bid.note_es;
  const save = bid.originalPrice - bid.price;
  return (
    <div onClick={() => onProfile?.(bid)} style={{ background: p.surface, borderRadius: 20, overflow: 'hidden', border: `0.5px solid ${p.line}`, position: 'relative', animation: isNew ? 'glossiSlideIn .4s ease-out' : 'none', cursor: 'pointer' }}>
      <SalonPhoto mood={bid.mood} h={120}>
        {isNew && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: p.bg, color: p.ink, fontFamily: type.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pulse color={p.success} />
            <span>{lang === 'en' ? 'JUST IN' : 'NUEVO'}</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)', padding: '6px 10px', borderRadius: 10, color: '#fff' }}>
          <div style={{ fontFamily: type.mono, fontSize: 9.5, color: 'rgba(255,255,255,.7)', letterSpacing: '0.06em' }}>{t.youSave.toUpperCase()}</div>
          <div style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 700 }}>${save}</div>
        </div>
      </SalonPhoto>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{bid.name}</div>
            <div style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkMuted, marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Stars n={bid.rating} color={p.accent} size={9} />
              <span style={{ color: p.ink, fontWeight: 600 }}>{bid.rating}</span>
              <span>({bid.reviews})</span><span>·</span><span>{bid.neighborhood}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Price value={bid.price} mono={type.mono} color={p.ink} size={26} weight={500} />
            <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, textDecoration: 'line-through' }}>${bid.originalPrice}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontFamily: type.body, fontSize: 12, color: p.inkSoft, lineHeight: 1.5 }}>{note}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
          {(bid.badges || []).map(b => <TrustBadge key={b} kind={b} p={p} type={type} />)}
          <span style={{ fontFamily: type.body, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em', color: p.inkSoft, padding: '3px 7px', borderRadius: 99, background: p.surface2, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: p.accent }} />
            {bid.responseMin}{t.minAgo} · {bid.artist}, {bid.years}{t.yrs}
          </span>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: type.body, fontSize: 10.5, color: p.inkMuted, fontWeight: 500, letterSpacing: '0.05em' }}>{t.nextSlot.toUpperCase()}</div>
            <div style={{ fontFamily: type.body, fontSize: 12.5, color: p.ink, fontWeight: 600, marginTop: 1 }}>{slot}</div>
          </div>
          <button onClick={e => { e.stopPropagation(); onOffer(bid); }} style={{ border: `0.5px solid ${p.line}`, background: 'transparent', color: p.ink, cursor: 'pointer', padding: '10px 12px', borderRadius: 99, fontFamily: type.body, fontSize: 12, fontWeight: 600 }}>
            {lang === 'en' ? 'Counter' : 'Contraoferta'}
          </button>
          <button onClick={e => { e.stopPropagation(); onPick(bid); }} style={{ border: 0, background: p.ink, color: p.bg, cursor: 'pointer', padding: '10px 16px', borderRadius: 99, fontFamily: type.body, fontSize: 12.5, fontWeight: 600 }}>{t.book}</button>
        </div>
      </div>
    </div>
  );
}

export default function Bids({ p, type, lang, onBack, onPick, onOffer, onProfile }) {
  const t = T[lang];
  const [count, setCount] = useState(1);
  const [sort, setSort] = useState('price');

  useEffect(() => {
    if (count >= BIDS.length) return;
    const tm = setTimeout(() => setCount(c => Math.min(BIDS.length, c + 1)), 1200);
    return () => clearTimeout(tm);
  }, [count]);

  const sorted = useMemo(() => {
    const arr = BIDS.slice(0, count);
    return arr.sort((a, b) => {
      if (sort === 'price') return a.price - b.price;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'fastest') return a.distance - b.distance;
      return a.responseMin - b.responseMin;
    });
  }, [count, sort]);

  return (
    <div style={{ background: p.bg, minHeight: '100%' }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{ border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: p.surface, boxShadow: `inset 0 0 0 0.5px ${p.line}` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: p.success + '22', padding: '5px 10px', borderRadius: 99 }}>
          <Pulse color={p.success} />
          <span style={{ fontFamily: type.body, fontSize: 10.5, color: p.success, fontWeight: 700, letterSpacing: '0.1em' }}>{lang === 'en' ? 'LIVE' : 'EN VIVO'}</span>
        </div>
      </div>

      <div style={{ padding: '18px 20px 10px' }}>
        <Eyebrow c={p.inkMuted}>{lang === 'en' ? 'YOUR REQUEST · COLOR & BALAYAGE' : 'TU SOLICITUD · COLOR Y BALAYAGE'}</Eyebrow>
        <div style={{ fontFamily: type.display, fontSize: 36, lineHeight: 0.98, color: p.ink, marginTop: 6, fontWeight: type.displayWeight, letterSpacing: '-0.025em', fontStyle: 'italic' }}>{t.bidsRolling}</div>
        <div style={{ fontFamily: type.body, fontSize: 13, color: p.inkSoft, marginTop: 8 }}>{t.bidsSub(count)}</div>
      </div>

      <div style={{ padding: '8px 20px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { id: 'price', label: t.sortPrice },
          { id: 'rating', label: t.sortRating },
          { id: 'fastest', label: t.sortFastest },
          { id: 'soonest', label: t.sortSoonest },
        ].map(s => (
          <button key={s.id} onClick={() => setSort(s.id)} style={{
            border: `0.5px solid ${sort === s.id ? p.ink : p.line}`,
            background: sort === s.id ? p.ink : p.surface, color: sort === s.id ? p.bg : p.ink,
            padding: '7px 12px', borderRadius: 99, fontFamily: type.body, fontSize: 11.5, fontWeight: 500,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{s.label}</button>
        ))}
      </div>

      <div style={{ padding: '14px 20px 110px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map((bid, i) => (
          <BidCard key={bid.id} bid={bid} p={p} type={type} lang={lang} t={t} isNew={i === sorted.length - 1 && count > 1} onPick={onPick} onOffer={onOffer} onProfile={onProfile} />
        ))}
        {count < BIDS.length && (
          <div style={{ padding: '20px', textAlign: 'center', fontFamily: type.body, fontSize: 12, color: p.inkMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Pulse color={p.accent} />
            <span>{lang === 'en' ? 'Waiting for more bids…' : 'Esperando más ofertas…'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
