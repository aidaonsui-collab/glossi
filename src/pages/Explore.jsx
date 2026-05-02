import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import SalonPhoto from '../components/SalonPhoto.jsx';
import TrustBadge from '../components/TrustBadge.jsx';
import ExploreMap from '../components/ExploreMap.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { BIDS } from '../ios/data.js';
import { Stars } from '../ios/atoms.jsx';
import { useT } from '../lib/i18n.js';

export default function Explore() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const t = useT();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('rating');
  const [q, setQ] = useState('');
  const [view, setView] = useState('grid');

  const FILTERS = [
    { id: 'all', l: t('All', 'Todos') },
    { id: 'hair', l: t('Hair', 'Cabello') },
    { id: 'nails', l: t('Nails', 'Uñas') },
    { id: 'lashes', l: t('Lashes', 'Pestañas') },
    { id: 'skin', l: t('Skin', 'Piel') },
    { id: 'barber', l: t('Barber', 'Barbería') },
  ];

  const list = useMemo(() => {
    let arr = BIDS;
    if (filter !== 'all') arr = arr.filter(b => (b.categories || []).includes(filter));
    if (q.trim()) arr = arr.filter(b => `${b.name} ${b.neighborhood}`.toLowerCase().includes(q.toLowerCase()));
    if (sort === 'rating') arr = [...arr].sort((a, b) => b.rating - a.rating);
    if (sort === 'distance') arr = [...arr].sort((a, b) => a.distance - b.distance);
    if (sort === 'price') arr = [...arr].sort((a, b) => a.price - b.price);
    return arr;
  }, [filter, q, sort]);

  return (
    <CustomerLayout active="explore" mobileTitle={t('Explore', 'Explorar')}>
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('EXPLORE', 'EXPLORAR')}</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 54, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0', textWrap: 'balance' }}>
          {t('Salons in the Valley.', 'Salones en el Valle.')}
        </h1>
        <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
          {t(`${BIDS.length} salons within 5 miles of 78501 · ratings, prices, and slots updated in real time.`, `${BIDS.length} salones dentro de 5 millas de 78501 · calificaciones, precios y horarios actualizados en tiempo real.`)}
        </p>

        {/* View toggle */}
        <div style={{ marginTop: 22, display: 'inline-flex', background: p.surface, borderRadius: 99, border: `0.5px solid ${p.line}`, padding: 3 }}>
          {[
            { id: 'grid', l: t('Grid', 'Cuadrícula'), i: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
            { id: 'map', l: t('Map', 'Mapa'), i: 'M9 20l-6 -3 V 5l6 3M9 20l6 -3M9 20V8M15 17l6 3V8l-6 -3M15 17V5' },
          ].map(o => {
            const a = view === o.id;
            return (
              <button key={o.id} onClick={() => setView(o.id)} style={{
                padding: '7px 14px', borderRadius: 99, border: 0,
                background: a ? p.ink : 'transparent', color: a ? p.bg : p.ink,
                fontFamily: type.body, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={o.i} /></svg>
                {o.l}
              </button>
            );
          })}
        </div>

        {/* Search + sort */}
        <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 12, minWidth: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.inkMuted} strokeWidth="1.7"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('Search salons or neighborhoods', 'Busca salones o colonias')} style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: type.body, fontSize: 14, color: p.ink }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'rating', l: t('Top rated', 'Mejor calificados') },
              { id: 'distance', l: t('Closest', 'Más cerca') },
              { id: 'price', l: t('Price', 'Precio') },
            ].map(s => {
              const a = sort === s.id;
              return (
                <button key={s.id} onClick={() => setSort(s.id)} style={{
                  padding: '9px 14px', borderRadius: 99,
                  background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                  border: `0.5px solid ${a ? p.ink : p.line}`, cursor: 'pointer',
                  fontFamily: type.body, fontSize: 12.5, fontWeight: 600,
                }}>{s.l}</button>
              );
            })}
          </div>
        </div>

        {/* Category chips */}
        <div style={{ marginTop: 14, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {FILTERS.map(f => {
            const a = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '7px 14px', borderRadius: 99, whiteSpace: 'nowrap',
                background: a ? p.accent : 'transparent', color: a ? p.ink : p.ink,
                border: `0.5px solid ${a ? p.accent : p.line}`, cursor: 'pointer',
                fontFamily: type.body, fontSize: 12, fontWeight: 600,
              }}>{f.l}</button>
            );
          })}
        </div>

        {/* Map */}
        {view === 'map' && (
          <div style={{ marginTop: 22 }}>
            {list.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: p.inkMuted, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
                {t(`No salons match "${q}".`, `Ningún salón coincide con "${q}".`)}
              </div>
            ) : (
              <ExploreMap salons={list} />
            )}
          </div>
        )}

        {/* Grid */}
        {view === 'grid' && <div style={{ marginTop: 22, display: 'grid', gap: isPhone ? 14 : 18, gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {list.map(s => (
            <button key={s.id} onClick={() => navigate(`/salon/${s.id}`)} style={{
              background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 18, overflow: 'hidden',
              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink, padding: 0,
            }}>
              <SalonPhoto mood={s.mood} h={180} style={{ borderRadius: 0 }}>
                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '5px 10px', borderRadius: 8, color: '#fff' }}>
                  <span style={{ fontFamily: type.mono, fontSize: 13, fontWeight: 700 }}>${s.price}</span>
                  <span style={{ fontFamily: type.mono, fontSize: 10, marginLeft: 5, opacity: 0.6, textDecoration: 'line-through' }}>${s.originalPrice}</span>
                </div>
              </SalonPhoto>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 19, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{s.name}</div>
                <div style={{ fontSize: 12, color: p.inkMuted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Stars n={s.rating} color={p.accent} size={11} />
                  <span style={{ color: p.ink, fontWeight: 600 }}>{s.rating}</span>
                  <span>({s.reviews})</span><span>·</span><span>{s.neighborhood}</span><span>·</span>
                  <span style={{ fontFamily: type.mono }}>{s.distance} {t('mi', 'mi')}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                  {(s.badges || []).map(b => <TrustBadge key={b} kind={b} p={p} type={type} />)}
                </div>
              </div>
            </button>
          ))}
          {list.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: p.inkMuted, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
              {t(`No salons match "${q}".`, `Ningún salón coincide con "${q}".`)}
            </div>
          )}
        </div>}
      </div>
    </CustomerLayout>
  );
}
