import { Link } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import SalonPhoto from '../components/SalonPhoto.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { GUIDES } from '../ios/data.js';
import { GUIDE_BODIES } from '../ios/guideBodies.js';

export default function Editorial() {
  const isPhone = useNarrow();
  return (
    <CustomerLayout active="editorial" mobileTitle="Editorial">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 60px', maxWidth: 1100 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>THE GLOSSI FIELD GUIDE</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 40 : 64, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '8px 0 0', textWrap: 'balance' }}>
          Texas beauty,<br />by neighborhood.
        </h1>
        <p style={{ fontSize: isPhone ? 14 : 17, color: p.inkSoft, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 640 }}>
          Pricing data, salon picks, and how-to-talk-to-your-colorist guides — written by people in the chair, every week.
        </p>

        {/* Featured (first guide) */}
        {GUIDES[0] && (
          <Link to="/editorial/0" style={{
            display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.2fr 1fr',
            gap: isPhone ? 14 : 32, marginTop: isPhone ? 24 : 36, alignItems: 'center',
            padding: isPhone ? 16 : 24, background: p.surface, borderRadius: 18,
            border: `0.5px solid ${p.line}`, textDecoration: 'none', color: p.ink, cursor: 'pointer',
          }}>
            <SalonPhoto mood={GUIDES[0].mood} h={isPhone ? 200 : 320} style={{ borderRadius: 14 }} />
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.accent }}>FEATURED · {GUIDES[0].kicker_en}</div>
              <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 40, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '10px 0 0', textWrap: 'balance' }}>
                {GUIDES[0].t_en}
              </h2>
              <p style={{ fontSize: isPhone ? 13.5 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '12px 0 0' }}>
                {GUIDE_BODIES[0]?.en.dek}
              </p>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 11, fontWeight: 700 }}>MT</div>
                <div style={{ fontSize: 12, color: p.inkSoft }}>{GUIDE_BODIES[0]?.en.author} · {GUIDE_BODIES[0]?.en.authorRole}</div>
              </div>
            </div>
          </Link>
        )}

        <div style={{ marginTop: isPhone ? 24 : 40, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>MORE GUIDES</div>
        <div style={{ marginTop: 14, display: 'grid', gap: isPhone ? 14 : 22, gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {GUIDES.slice(1).map((g, i) => {
            const idx = i + 1;
            return (
              <Link key={idx} to={`/editorial/${idx}`} style={{ textDecoration: 'none', color: p.ink, cursor: 'pointer' }}>
                <SalonPhoto mood={g.mood} h={isPhone ? 180 : 220} style={{ borderRadius: 14 }} />
                <div style={{ marginTop: 12, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{g.kicker_en}</div>
                <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 22 : 26, fontWeight: type.displayWeight, letterSpacing: '-0.015em', margin: '6px 0 0', lineHeight: 1.1, textWrap: 'balance' }}>
                  {g.t_en}
                </h3>
                <p style={{ fontSize: 13.5, color: p.inkSoft, lineHeight: 1.5, margin: '8px 0 0' }}>{GUIDE_BODIES[idx]?.en.dek}</p>
              </Link>
            );
          })}
        </div>

        {/* Newsletter strip */}
        <div style={{ marginTop: isPhone ? 32 : 48, padding: isPhone ? '24px' : '36px 40px', background: p.ink, color: p.bg, borderRadius: 20, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.4fr 1fr', gap: isPhone ? 14 : 28, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>WEEKLY DROP</div>
            <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 26 : 36, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '8px 0 0' }}>One guide a week. No noise.</h3>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, margin: '10px 0 0' }}>Every Thursday morning, by editors who actually book in the Valley.</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); }} style={{ display: 'flex', gap: 8 }}>
            <input type="email" placeholder="you@email.com" style={{ flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 12, border: 0, background: 'rgba(255,255,255,0.08)', color: p.bg, fontFamily: type.body, fontSize: 14, outline: 'none' }} />
            <button type="submit" style={{ background: p.accent, color: p.ink, border: 0, padding: '12px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Subscribe</button>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}
