import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import SalonPhoto from '../components/SalonPhoto.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { GUIDES } from '../ios/data.js';
import { GUIDE_BODIES } from '../ios/guideBodies.js';

export default function Article() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const { id } = useParams();
  const idx = Number(id);
  const g = GUIDES[idx];
  const body = GUIDE_BODIES[idx]?.en;

  if (!g || !body) {
    return (
      <CustomerLayout active="editorial">
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36 }}>Article not found</h1>
          <Link to="/editorial" style={{ display: 'inline-block', marginTop: 16, color: p.accent, textDecoration: 'none', fontWeight: 600 }}>← Back to editorial</Link>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout active="editorial" mobileTitle="Article">
      <div style={{ maxWidth: 720, margin: '0 auto', padding: isPhone ? '0' : '0 40px' }}>
        {/* Hero */}
        <div style={{ position: 'relative', height: isPhone ? 280 : 400, overflow: 'hidden', borderRadius: isPhone ? 0 : 20, marginTop: isPhone ? 0 : 24 }}>
          <SalonPhoto mood={g.mood} h={isPhone ? 280 : 400} style={{ borderRadius: 0, position: 'absolute', inset: 0, width: '100%' }} />
          <button onClick={() => navigate('/editorial')} style={{
            position: 'absolute', top: 18, left: 18, width: 38, height: 38, borderRadius: 99,
            border: 0, cursor: 'pointer', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ position: 'absolute', bottom: 22, left: 20, right: 20, color: '#fff' }}>
            <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.85)' }}>{g.kicker_en}</div>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 30 : 44, fontWeight: type.displayWeight, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.02, marginTop: 8, textWrap: 'balance' }}>
              {g.t_en}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: isPhone ? '24px 18px 48px' : '32px 0 64px' }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 18 : 22, fontWeight: type.displayWeight, color: p.ink, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
            {body.dek}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22, paddingTop: 16, borderTop: `0.5px solid ${p.line}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>
              {body.author.split(' ').map(s => s[0]).slice(0, 2).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: p.ink }}>{body.author}</div>
              <div style={{ fontSize: 12, color: p.inkMuted }}>{body.authorRole}</div>
            </div>
          </div>

          {body.sections.map((s, i) => (
            <div key={i} style={{ marginTop: 32 }}>
              {s.h && <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 30, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 10px' }}>{s.h}</h2>}
              {s.p && <p style={{ fontFamily: type.body, fontSize: isPhone ? 15 : 16, color: p.inkSoft, lineHeight: 1.65, margin: 0 }}>{s.p}</p>}
              {s.list && (
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {s.list.map(([term, def], j) => (
                    <div key={j} style={{ paddingLeft: 16, borderLeft: `2px solid ${p.accent}` }}>
                      <div style={{ fontFamily: type.display, fontSize: isPhone ? 17 : 19, color: p.ink, fontWeight: 600, letterSpacing: '-0.01em' }}>{term}</div>
                      <div style={{ fontFamily: type.body, fontSize: isPhone ? 14 : 15, color: p.inkSoft, marginTop: 4, lineHeight: 1.55 }}>{def}</div>
                    </div>
                  ))}
                </div>
              )}
              {s.table && (
                <div style={{ marginTop: 6, borderRadius: 14, overflow: 'hidden', border: `0.5px solid ${p.line}`, background: p.surface }}>
                  {s.table.map((row, j) => (
                    <div key={j} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 8, padding: '14px 18px', borderTop: j ? `0.5px solid ${p.line}` : 'none', background: j === 0 ? p.surface2 : 'transparent' }}>
                      {row.map((cell, k) => (
                        <div key={k} style={{
                          fontFamily: j === 0 ? type.body : (k === 0 ? type.body : type.mono),
                          fontSize: j === 0 ? 11 : 14,
                          fontWeight: j === 0 ? 700 : (k === 0 ? 600 : 500),
                          letterSpacing: j === 0 ? '0.08em' : 0,
                          textTransform: j === 0 ? 'uppercase' : 'none',
                          color: j === 0 ? p.inkMuted : p.ink,
                          textAlign: k === 0 ? 'left' : 'right',
                        }}>{cell}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {s.pull && (
                <blockquote style={{ marginTop: 14, padding: isPhone ? '20px 22px' : '24px 28px', borderRadius: 16, background: p.accentSoft, color: p.ink, fontFamily: type.display, fontSize: isPhone ? 20 : 24, lineHeight: 1.3, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{s.pull}</blockquote>
              )}
            </div>
          ))}

          {/* Footer */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: `0.5px solid ${p.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/editorial" style={{ fontSize: 13, color: p.inkMuted, textDecoration: 'none', fontWeight: 600 }}>← All guides</Link>
            <div style={{ display: 'flex', gap: 8 }}>
              {GUIDES.map((_, i) => i !== idx && (
                <Link key={i} to={`/editorial/${i}`} style={{ fontSize: 12, color: p.accent, textDecoration: 'none', padding: '6px 12px', background: p.accentSoft, borderRadius: 99, fontWeight: 600 }}>
                  {GUIDES[i].kicker_en.split(' · ')[0]} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
