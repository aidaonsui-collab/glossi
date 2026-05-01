import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import SalonPhoto from '../components/SalonPhoto.jsx';
import TrustBadge from '../components/TrustBadge.jsx';
import Modal from '../components/Modal.jsx';
import { useToast } from '../components/Toast.jsx';
import { useAuth, useLang, useNotifications } from '../store.jsx';
import NotificationsPanel from '../components/NotificationsPanel.jsx';

const navItems = [
  { l: 'Home', i: 'M3 11l9-8 9 8M5 10v10h14V10', to: '/quotes' },
  { l: 'Explore', i: 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', to: '/explore' },
  { l: 'My quotes', badge: 3, i: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', to: '/quotes' },
  { l: 'Inbox', badge: 2, i: 'M4 4h16v16H4zM4 4l8 8 8-8', to: '/inbox' },
  { l: 'Saved', i: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z', to: '/saved' },
  { l: 'Editorial', i: 'M4 4h16v4H4zM4 12h10v8H4zM18 12h2v8h-2z', to: '/editorial' },
];

const SERVICES = ['Color', 'Cut & style', 'Lashes', 'Nails', 'Brows', 'Barber'];
const SORTS = ['Price', 'Rating', 'Soonest'];

const initialBids = [
  { id: 'b1', name: 'Casa de Belleza', price: 92, was: 140, mood: 0, rating: 4.9, slot: 'Today · 4:00 PM', area: 'Pharr · 0.8 mi', badges: ['verified', 'licensed'], slotTs: 1 },
  { id: 'b2', name: 'Studio Onyx', price: 108, was: 140, mood: 3, rating: 4.8, slot: 'Tomorrow · 11:30 AM', area: 'McAllen · 1.4 mi', badges: ['verified', 'top'], slotTs: 2 },
  { id: 'b3', name: 'La Reina Salon', price: 98, was: 140, mood: 2, rating: 4.7, slot: 'Sat · 2:00 PM', area: 'Edinburg · 2.6 mi', badges: ['licensed'], slotTs: 4 },
  { id: 'b5', name: 'Brisa Hair Bar', price: 115, was: 140, mood: 5, rating: 4.9, slot: 'Sun · 10:00 AM', area: 'McAllen · 3.0 mi', badges: ['verified', 'fast'], slotTs: 5 },
];

export default function Customer() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();

  const { user } = useAuth();
  const { lang: storedLang, toggle: toggleLang } = useLang();
  const lang = storedLang === 'es' ? 'ES' : 'EN';
  const [activeService, setActiveService] = useState('Color');
  const [sort, setSort] = useState('Price');
  const [showNotifs, setShowNotifs] = useState(false);
  const { unreadCount } = useNotifications();
  const [bids, setBids] = useState(initialBids);
  const [counterFor, setCounterFor] = useState(null);
  const [counterPrice, setCounterPrice] = useState(0);

  const sortedBids = useMemo(() => {
    const copy = [...bids];
    if (sort === 'Price') copy.sort((a, b) => a.price - b.price);
    if (sort === 'Rating') copy.sort((a, b) => b.rating - a.rating);
    if (sort === 'Soonest') copy.sort((a, b) => a.slotTs - b.slotTs);
    return copy;
  }, [bids, sort]);

  const openCounter = b => { setCounterFor(b); setCounterPrice(Math.max(60, b.price - 10)); };
  const submitCounter = () => {
    setBids(curr => curr.map(b => b.id === counterFor.id ? { ...b, price: counterPrice, was: b.was } : b));
    toast(`Counter sent to ${counterFor.name} — $${counterPrice}.`, { tone: 'success' });
    setCounterFor(null);
  };
  const openBook = b => navigate(`/checkout/${b.id}`);

  const sidebar = (
    <div style={{
      width: 240, padding: '24px 18px', borderRight: `0.5px solid ${p.line}`, background: p.surface,
      display: 'flex', flexDirection: 'column', gap: 6, minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', padding: '4px 12px 18px', color: p.accent, textDecoration: 'none' }}>glossi</Link>
      {navItems.map((it) => {
        const active = it.l === 'Home' || it.l === 'My quotes';
        return (
          <Link key={it.l} to={it.to} style={{
            padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
            background: active ? p.bg : 'transparent', color: p.ink, fontSize: 13.5, fontWeight: active ? 600 : 500,
            border: active ? `0.5px solid ${p.line}` : '0.5px solid transparent', textDecoration: 'none', fontFamily: 'inherit',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={it.i} /></svg>
            <span style={{ flex: 1 }}>{it.l}</span>
            {it.badge && <span style={{ fontFamily: type.mono, fontSize: 10, color: p.accent, background: p.accentSoft, padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{it.badge}</span>}
          </Link>
        );
      })}
      <div style={{ flex: 1 }} />
      <button onClick={() => navigate('/me')} style={{ padding: '14px 12px', borderRadius: 12, background: p.bg, border: `0.5px solid ${p.line}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 99, background: user?.avatar || 'linear-gradient(135deg,#E8B7A8,#B8893E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>{user?.initials || 'SM'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{user?.name?.split(' ').slice(0, 2).join(' ') || 'Sofia M.'}</div>
            <div style={{ fontSize: 10.5, color: p.inkMuted }}>{user?.city || 'Pharr, TX'}</div>
          </div>
        </div>
      </button>
    </div>
  );

  const compose = (
    <div style={{
      background: p.ink, color: p.bg, borderRadius: 20, padding: isPhone ? '24px 20px' : '32px 32px',
      display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.4fr 1fr', gap: isPhone ? 20 : 32, alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>POST A REQUEST</div>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.95, marginTop: 8, textWrap: 'balance' }}>What are you looking for, <span style={{ color: p.accent }}>today?</span></div>
        <div style={{ marginTop: isPhone ? 14 : 18, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SERVICES.map(s => {
            const active = activeService === s;
            return (
              <button key={s} onClick={() => setActiveService(s)} style={{
                padding: '7px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                background: active ? p.accent : 'rgba(255,255,255,0.08)', color: active ? p.ink : p.bg,
                cursor: 'pointer', border: 0, fontFamily: 'inherit',
              }}>{s}</button>
            );
          })}
        </div>
      </div>
      <button onClick={() => navigate('/request')} style={{
        background: p.accent, color: p.ink, border: 0, cursor: 'pointer',
        padding: isPhone ? '14px 18px' : '16px 20px', borderRadius: 14,
        fontSize: isPhone ? 14 : 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontFamily: 'inherit',
      }}>
        <span>Start a request · {activeService}</span>
        <span>→</span>
      </button>
    </div>
  );

  const quotesGrid = (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>YOUR ACTIVE QUOTES · {bids.length}</div>
          <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 38, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Bids rolling in.</h2>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {SORTS.map(s => {
            const active = s === sort;
            return (
              <button key={s} onClick={() => setSort(s)} style={{
                padding: '6px 11px', borderRadius: 99, fontSize: 11.5, fontWeight: 600,
                background: active ? p.ink : p.surface, color: active ? p.bg : p.ink,
                border: active ? `0.5px solid ${p.ink}` : `0.5px solid ${p.line}`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{s}</button>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gap: 14, gridTemplateColumns: isPhone ? '1fr' : 'repeat(2, 1fr)' }}>
        {sortedBids.map(b => (
          <div key={b.id} onClick={() => navigate(`/salon/${b.id}`)} style={{ background: p.surface, borderRadius: 18, border: `0.5px solid ${p.line}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: 0 }}>
              <SalonPhoto mood={b.mood} h={140} style={{ width: 140, borderRadius: 0, flexShrink: 0 }} />
              <div style={{ flex: 1, padding: '14px 16px' }}>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, letterSpacing: '-0.01em' }}>{b.name}</div>
                <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 3 }}>★ {b.rating} · {b.area}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>{b.badges.map(x => <TrustBadge key={x} kind={x} p={p} type={type} />)}</div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: type.mono, fontSize: 28, fontWeight: 600, color: p.ink, letterSpacing: '-0.02em' }}>${b.price}</span>
                  <span style={{ fontFamily: type.mono, fontSize: 12, color: p.inkMuted, textDecoration: 'line-through' }}>${b.was}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: p.inkMuted }}>NEXT SLOT</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 1 }}>{b.slot}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); openCounter(b); }} style={{ border: `0.5px solid ${p.line}`, background: 'transparent', cursor: 'pointer', padding: '9px 13px', borderRadius: 99, fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>Counter</button>
              <button onClick={e => { e.stopPropagation(); openBook(b); }} style={{ border: 0, background: p.ink, color: p.bg, cursor: 'pointer', padding: '9px 14px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit' }}>Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const main = (
    <div style={{ flex: 1, padding: isPhone ? '18px' : '34px 40px', display: 'flex', flexDirection: 'column', gap: isPhone ? 20 : 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{lang === 'EN' ? 'WELCOME BACK' : 'BIENVENIDA'}</div>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 54, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '6px 0 0', textWrap: 'balance' }}>{lang === 'EN' ? `Hi ${user?.name?.split(' ')[0] || 'there'}.` : `Hola ${user?.name?.split(' ')[0] || 'amiga'}.`}</h1>
        </div>
        {!isPhone && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
            <button onClick={() => toggleLang()} style={{ background: p.surface, border: `0.5px solid ${p.line}`, padding: '10px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ color: lang === 'EN' ? p.ink : p.inkMuted }}>EN</span> · <span style={{ color: lang === 'ES' ? p.ink : p.inkMuted }}>ES</span>
            </button>
            <button onClick={() => setShowNotifs(v => !v)} style={{ background: p.surface, border: `0.5px solid ${p.line}`, width: 42, height: 42, borderRadius: 99, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.7"><path d="M15 17h5l-1.4-1.4A6.7 6.7 0 0 0 18 12V8a6 6 0 1 0-12 0v4a6.7 6.7 0 0 0-.6 3.6L4 17h5m6 0a3 3 0 1 1-6 0" /></svg>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  minWidth: 16, height: 16, padding: '0 4px',
                  borderRadius: 99, background: p.accent, color: p.ink,
                  fontFamily: type.mono, fontSize: 9.5, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${p.surface}`,
                }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>
            {showNotifs && (
              <div style={{ position: 'absolute', top: 50, right: 0 }}>
                <NotificationsPanel variant="dropdown" onClose={() => setShowNotifs(false)} />
              </div>
            )}
          </div>
        )}
      </div>
      {compose}
      {quotesGrid}
    </div>
  );

  const counterModal = (
    <Modal open={!!counterFor} onClose={() => setCounterFor(null)} eyebrow="MAKE A COUNTER OFFER" title={counterFor?.name} footer={
      <>
        <button onClick={() => setCounterFor(null)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Cancel</button>
        <button onClick={submitCounter} style={{ background: p.ink, color: p.bg, border: 0, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Send counter</button>
      </>
    }>
      {counterFor && (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'center', padding: '14px 0' }}>
            <span style={{ fontFamily: type.mono, fontSize: 14, color: p.inkMuted }}>$</span>
            <span style={{ fontFamily: type.mono, fontSize: 56, fontWeight: 600, color: p.ink, letterSpacing: '-0.03em' }}>{counterPrice}</span>
          </div>
          <input type="range" min={50} max={counterFor.price} step={1} value={counterPrice} onChange={e => setCounterPrice(Number(e.target.value))} style={{ width: '100%', accentColor: p.accent }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: type.mono, fontSize: 11, color: p.inkMuted, marginTop: 4 }}>
            <span>$50 floor</span>
            <span>their bid: ${counterFor.price}</span>
          </div>
          <div style={{ marginTop: 14, padding: '10px 12px', background: p.bg, borderRadius: 10, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5 }}>
            They typically charge ${counterFor.was}. Your counter goes to {counterFor.name} — they can accept, decline, or send back another counter.
          </div>
        </>
      )}
    </Modal>
  );


  if (isPhone) {
    return (
      <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `0.5px solid ${p.line}` }}>
          <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
          <div style={{ flex: 1 }} />
          <button onClick={() => toggleLang()} style={{ background: 'transparent', border: 0, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>{lang}</button>
          <button onClick={() => navigate('/me')} style={{ width: 34, height: 34, borderRadius: 99, background: user?.avatar || 'linear-gradient(135deg,#E8B7A8,#B8893E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>{user?.initials || 'SM'}</button>
        </div>
        {main}
        {counterModal}
      </div>
    );
  }

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', alignItems: 'flex-start' }}>
      {sidebar}
      {main}
      {counterModal}
    </div>
  );
}
