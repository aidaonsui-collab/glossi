import { useState } from 'react';
import SalonPhoto from '../../components/SalonPhoto.jsx';
import TrustBadge from '../../components/TrustBadge.jsx';
import ExploreMap from '../../components/ExploreMap.jsx';
import { IOSStatusBar } from '../IOSFrame.jsx';
import { Eyebrow, Stars } from '../atoms.jsx';
import { T, BIDS } from '../data.js';
import { INBOX_LIST } from '../details.js';

export function Explore({ p, type, lang, onOpenSalon }) {
  const t = T[lang];
  const [view, setView] = useState('list');
  return (
    <div style={{ background: p.bg, minHeight: '100%' }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0' }}>
        <Eyebrow c={p.inkMuted}>{lang === 'en' ? '02 · NEAR YOU' : '02 · CERCA'}</Eyebrow>
        <div style={{ fontFamily: type.display, fontSize: 36, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.025em', fontStyle: 'italic', lineHeight: 1, marginTop: 6 }}>
          {lang === 'en' ? 'Salons in the Valley' : 'Salones del Valle'}
        </div>
        {/* View toggle */}
        <div style={{ marginTop: 16, display: 'inline-flex', background: p.surface, borderRadius: 99, border: `0.5px solid ${p.line}`, padding: 3 }}>
          {[
            { id: 'list', l: lang === 'en' ? 'List' : 'Lista', i: 'M4 6h16M4 12h16M4 18h10' },
            { id: 'map', l: 'Map', i: 'M9 20l-6 -3 V 5l6 3M9 20l6 -3M9 20V8M15 17l6 3V8l-6 -3M15 17V5' },
          ].map(o => {
            const a = view === o.id;
            return (
              <button key={o.id} onClick={() => setView(o.id)} style={{
                padding: '6px 14px', borderRadius: 99, border: 0,
                background: a ? p.ink : 'transparent', color: a ? p.bg : p.ink,
                fontFamily: type.body, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={o.i} /></svg>
                {o.l}
              </button>
            );
          })}
        </div>
      </div>

      {view === 'map' ? (
        <div style={{ padding: '16px 20px 110px' }}>
          <ExploreMap salons={BIDS} height={460} />
        </div>
      ) : (
        <div style={{ padding: '16px 20px 110px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BIDS.map(s => (
            <button key={s.id} onClick={() => onOpenSalon?.(s)} style={{ background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, overflow: 'hidden', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', padding: 0 }}>
              <SalonPhoto mood={s.mood} h={140} />
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontFamily: type.display, fontSize: 17, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{s.name}</div>
                <div style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkMuted, marginTop: 2, display: 'flex', gap: 6 }}>
                  <Stars n={s.rating} color={p.accent} size={10} />
                  <span>{s.rating}</span><span>·</span><span>{s.neighborhood}</span><span>·</span>
                  <span style={{ fontFamily: type.mono }}>{s.distance} {t.miAway}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                  {(s.badges || []).map(b => <TrustBadge key={b} kind={b} p={p} type={type} />)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Inbox({ p, type, lang, onOpenThread }) {
  return (
    <div style={{ background: p.bg, minHeight: '100%' }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0' }}>
        <div style={{ fontFamily: type.display, fontSize: 36, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.025em', fontStyle: 'italic', lineHeight: 1 }}>
          {lang === 'en' ? 'Inbox' : 'Mensajes'}
        </div>
      </div>
      <div style={{ padding: '20px 0 110px' }}>
        {INBOX_LIST.map((m, i) => (
          <button key={m.id} onClick={() => onOpenThread?.(m.id)} style={{
            display: 'flex', gap: 12, padding: '14px 20px',
            borderTop: i ? `0.5px solid ${p.line}` : 'none',
            background: m.unread ? p.surface : 'transparent',
            width: '100%', textAlign: 'left', border: 0, cursor: 'pointer',
            fontFamily: 'inherit', color: p.ink, alignItems: 'flex-start',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, flexShrink: 0, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>
              {m.salon.split(' ').map(s => s[0]).slice(0, 2).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontFamily: type.display, fontSize: 15, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{m.salon}</div>
                <div style={{ fontFamily: type.mono, fontSize: 10, color: p.inkMuted }}>{m.t}</div>
              </div>
              <div style={{ fontFamily: type.body, fontSize: 12.5, color: m.unread ? p.ink : p.inkSoft, fontWeight: m.unread ? 500 : 400, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lang === 'en' ? m.last_en : m.last_es}
              </div>
            </div>
            {m.unread && <span style={{ width: 8, height: 8, borderRadius: 99, background: p.accent, marginTop: 6, flexShrink: 0 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Me({ p, type, lang, onRow }) {
  const stats = [
    { k: lang === 'en' ? 'Bookings' : 'Reservas', v: 14 },
    { k: lang === 'en' ? 'Saved' : 'Ahorrado', v: '$284' },
    { k: lang === 'en' ? 'Salons' : 'Salones', v: 6 },
  ];
  const rows = lang === 'en' ? [
    { k: 'saved', l: 'Saved salons' }, { k: 'history', l: 'Past bookings' },
    { k: 'payment', l: 'Payment & cards' }, { k: 'notifications', l: 'Notifications' },
    { k: 'lang', l: 'Language · English' }, { k: 'help', l: 'Help & support' },
    { k: 'signout', l: 'Sign out' },
  ] : [
    { k: 'saved', l: 'Salones guardados' }, { k: 'history', l: 'Historial' },
    { k: 'payment', l: 'Pagos y tarjetas' }, { k: 'notifications', l: 'Notificaciones' },
    { k: 'lang', l: 'Idioma · Español' }, { k: 'help', l: 'Ayuda' },
    { k: 'signout', l: 'Cerrar sesión' },
  ];
  return (
    <div style={{ background: p.bg, minHeight: '100%' }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: 'linear-gradient(135deg,#E8B7A8,#B8893E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 22, fontWeight: 700 }}>SM</div>
        <div>
          <div style={{ fontFamily: type.display, fontSize: 24, fontWeight: type.displayWeight, color: p.ink, fontStyle: 'italic', letterSpacing: '-0.02em' }}>Sofia Martínez</div>
          <div style={{ fontFamily: type.body, fontSize: 12, color: p.inkMuted, marginTop: 2 }}>{lang === 'en' ? 'Pharr, TX · Member since 2024' : 'Pharr, TX · Miembro desde 2024'}</div>
        </div>
      </div>
      <div style={{ margin: '20px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '12px', background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}` }}>
            <div style={{ fontFamily: type.body, fontSize: 9.5, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.1em' }}>{s.k.toUpperCase()}</div>
            <div style={{ fontFamily: type.mono, fontSize: 22, color: p.ink, fontWeight: 600, marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '20px 0 110px' }}>
        {rows.map((r, i) => (
          <button key={i} onClick={() => onRow(r.k)} style={{
            padding: '14px 20px', borderTop: `0.5px solid ${p.line}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: type.body, fontSize: 14, color: p.ink, fontWeight: 500,
            cursor: 'pointer', background: 'transparent', border: 0, width: '100%', textAlign: 'left',
          }}>
            <span>{r.l}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={p.inkMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
