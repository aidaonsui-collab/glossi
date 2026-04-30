import { T } from './data.js';

export const Stars = ({ n, color, size = 11 }) => (
  <span style={{ fontSize: size, color, letterSpacing: 0.6, fontFamily: 'system-ui' }}>
    {'★'.repeat(Math.round(n))}{'☆'.repeat(5 - Math.round(n))}
  </span>
);

export const Eyebrow = ({ children, c, style }) => (
  <div style={{
    fontFamily: '"Inter", system-ui', fontSize: 10.5, fontWeight: 600,
    letterSpacing: '0.16em', textTransform: 'uppercase', color: c, ...style,
  }}>{children}</div>
);

export const Pulse = ({ color }) => (
  <span style={{
    width: 7, height: 7, borderRadius: 999, background: color,
    display: 'inline-block', boxShadow: `0 0 0 0 ${color}88`,
    animation: 'glossiPulse 1.6s ease-out infinite',
  }} />
);

export const Price = ({ value, mono, color, size = 28, weight = 500, style }) => (
  <span style={{
    fontFamily: mono, fontVariantNumeric: 'tabular-nums',
    fontSize: size, fontWeight: weight, color, letterSpacing: '-0.02em',
    ...style,
  }}>${value}</span>
);

export function LangChip({ lang, setLang, p, type }) {
  return (
    <div style={{
      display: 'inline-flex', background: p.surface, borderRadius: 999,
      border: `0.5px solid ${p.line}`, padding: 2, gap: 0,
      fontFamily: type.body, fontSize: 11, fontWeight: 600,
    }}>
      {['en', 'es'].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          border: 0, background: l === lang ? p.ink : 'transparent',
          color: l === lang ? p.bg : p.inkSoft,
          padding: '5px 10px', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 'inherit', fontSize: 'inherit',
          letterSpacing: '0.04em',
        }}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}

export function TabBar({ p, type, lang, current, onTab }) {
  const tabs = [
    { id: 'home', label: T[lang].home, icon: 'M3 11l9-8 9 8M5 10v10h14V10' },
    { id: 'explore', label: T[lang].explore, icon: 'M3 12a9 9 0 1018 0 9 9 0 00-18 0M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18' },
    { id: 'quotes', label: T[lang].quotes, icon: 'M4 6h16M4 12h16M4 18h10' },
    { id: 'inbox', label: T[lang].inbox, icon: 'M4 6l8 6 8-6M4 6v12h16V6' },
    { id: 'me', label: T[lang].me, icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-7 8-7s8 3 8 7' },
  ];
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 40,
      paddingBottom: 28, paddingTop: 10, paddingLeft: 14, paddingRight: 14,
      background: `linear-gradient(180deg, ${p.bg}00 0%, ${p.bg} 50%)`,
      marginTop: 'auto',
    }}>
      <div style={{
        background: p.surface, borderRadius: 22,
        border: `0.5px solid ${p.line}`,
        boxShadow: '0 6px 24px rgba(0,0,0,.06)',
        padding: '8px 4px',
        display: 'flex', justifyContent: 'space-around',
      }}>
        {tabs.map(t => {
          const active = t.id === current;
          return (
            <button key={t.id} onClick={() => onTab(t.id)} style={{
              border: 0, background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '4px 6px', flex: 1, fontFamily: 'inherit',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d={t.icon} stroke={active ? p.ink : p.inkMuted} strokeWidth={active ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{
                fontFamily: type.body, fontSize: 9.5, fontWeight: active ? 600 : 500,
                color: active ? p.ink : p.inkMuted, letterSpacing: '0.02em',
              }}>{t.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
