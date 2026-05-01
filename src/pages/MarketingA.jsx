import { Link, useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';

export default function MarketingA() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      {/* Nav */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 64px', gap: 14,
        borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 5,
      }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <div style={{ flex: 1 }} />
        {!isPhone && (
          <div style={{ display: 'flex', gap: 24 }}>
            <Link to="/" style={navLink}>Direction B</Link>
            <Link to="/marketing/c" style={navLink}>Direction C</Link>
            <Link to="/pricing" style={navLink}>Pricing</Link>
            <Link to="/ios" style={navLink}>iOS preview</Link>
          </div>
        )}
        <button onClick={() => navigate('/onboarding/customer')} style={{ background: p.ink, color: p.bg, border: 0, padding: isPhone ? '8px 14px' : '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{isPhone ? 'App' : 'Get the app'}</button>
      </div>

      {/* Hero — soft editorial photo stack */}
      <div style={{
        padding: isPhone ? '36px 18px 28px' : '88px 64px 60px',
        display: 'grid', gap: isPhone ? 28 : 56,
        gridTemplateColumns: isPhone ? '1fr' : '1.05fr 1fr', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: p.accent }} />
            <span>BEAUTY MARKETPLACE · 1,400+ SALONS</span>
          </div>
          <h1 style={{
            fontFamily: type.display, fontStyle: 'italic',
            fontSize: isPhone ? 54 : 92, fontWeight: type.displayWeight,
            letterSpacing: '-0.035em', lineHeight: 0.92, margin: '14px 0 0', textWrap: 'balance',
          }}>Beauty,<br /><span style={{ color: p.accent }}>on your terms.</span></h1>
          <p style={{ fontSize: isPhone ? 15 : 18, color: p.inkSoft, lineHeight: 1.55, margin: '18px 0 0', maxWidth: 520, textWrap: 'pretty' }}>
            Post what you want, name your price. Local salons compete for your booking. The best offer wins — usually within an hour.
          </p>
          <div style={{ marginTop: isPhone ? 22 : 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/onboarding/customer')} style={{ background: p.ink, color: p.bg, border: 0, cursor: 'pointer', padding: isPhone ? '14px 20px' : '16px 26px', borderRadius: 99, fontSize: isPhone ? 14 : 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>Post a request <span>→</span></button>
            <button onClick={() => navigate('/onboarding/salon')} style={{ background: 'transparent', color: p.ink, cursor: 'pointer', border: `0.5px solid ${p.line}`, padding: isPhone ? '14px 20px' : '16px 26px', borderRadius: 99, fontSize: isPhone ? 14 : 15, fontWeight: 600, fontFamily: 'inherit' }}>For salons</button>
          </div>
          <div style={{ marginTop: isPhone ? 22 : 36, display: 'flex', alignItems: 'center', gap: 14, fontFamily: type.mono, fontSize: 11.5, color: p.inkMuted, fontWeight: 500 }}>
            <div style={{ display: 'flex' }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: 99, marginLeft: i ? -8 : 0, backgroundImage: `url(${PHOTOS[i]})`, backgroundSize: 'cover', backgroundPosition: 'center', border: `2px solid ${p.bg}` }} />
              ))}
            </div>
            <span>2,847 BOOKINGS THIS WEEK</span>
          </div>
        </div>

        {/* Hero image stack */}
        <div style={{ position: 'relative', height: isPhone ? 320 : 540 }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: isPhone ? '70%' : '65%', aspectRatio: '4/5', borderRadius: 24, overflow: 'hidden', backgroundImage: `url(${PHOTOS[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.18)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: isPhone ? '62%' : '55%', aspectRatio: '3/4', borderRadius: 24, overflow: 'hidden', backgroundImage: `url(${PHOTOS[1]})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.22)', border: `6px solid ${p.bg}` }} />
          <div style={{ position: 'absolute', bottom: isPhone ? '42%' : '10%', right: isPhone ? -4 : -20, background: p.surface, borderRadius: 16, padding: '14px 16px', boxShadow: '0 14px 30px rgba(0,0,0,0.12)', border: `0.5px solid ${p.line}`, maxWidth: isPhone ? 180 : 240 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>NEW BID · 4 MIN AGO</div>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 20 : 24, fontWeight: type.displayWeight, marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1 }}>$92<span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, marginLeft: 6, fontWeight: 500, textDecoration: 'line-through' }}>$140</span></div>
            <div style={{ fontSize: 11, color: p.inkSoft, marginTop: 4 }}>Casa de Belleza · 4.9★</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: isPhone ? '28px 18px' : '80px 64px', background: p.surface, borderTop: `0.5px solid ${p.line}`, borderBottom: `0.5px solid ${p.line}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>HOW IT WORKS</div>
        <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 34 : 56, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '12px 0 0', textWrap: 'balance' }}>
          Salons bid. <span style={{ color: p.inkMuted }}>You choose.</span>
        </h2>
        <div style={{ marginTop: isPhone ? 24 : 48, display: 'grid', gap: isPhone ? 14 : 24, gridTemplateColumns: isPhone ? '1fr' : 'repeat(3, 1fr)' }}>
          {[
            { n: '01', t: 'Post', d: 'A request takes 30 seconds. Service, photos, when you\'re free, what you\'re willing to pay.' },
            { n: '02', t: 'Compare', d: 'Salons within 5 miles see your post and send bids in real time. Photos, rating, slot, price.' },
            { n: '03', t: 'Book', d: 'Pick the bid you like. Glossi handles payment, reminders, and a free reschedule window.' },
          ].map(s => (
            <div key={s.n} style={{ padding: isPhone ? '18px' : '24px', borderRadius: 18, background: p.bg, border: `0.5px solid ${p.line}` }}>
              <div style={{ fontFamily: type.mono, fontSize: 11, color: p.accent, fontWeight: 600, letterSpacing: '0.1em' }}>{s.n}</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 26 : 36, fontWeight: type.displayWeight, letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1 }}>{s.t}</div>
              <div style={{ marginTop: isPhone ? 8 : 12, fontSize: isPhone ? 13 : 14, color: p.inkSoft, lineHeight: 1.55 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial */}
      <div style={{ padding: isPhone ? '28px 18px' : '80px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>EDITORIAL</div>
            <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 30 : 44, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '10px 0 0' }}>This week in beauty.</h2>
          </div>
          {!isPhone && <Link to="/editorial" style={{ background: 'transparent', border: 0, fontSize: 13, color: p.inkSoft, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>See all guides →</Link>}
        </div>
        <div style={{ marginTop: isPhone ? 20 : 32, display: 'grid', gap: isPhone ? 14 : 18, gridTemplateColumns: isPhone ? '1fr' : 'repeat(3, 1fr)' }}>
          {[
            { n: 'GUIDE · 6 MIN', t: 'The honest balayage guide', m: 0, idx: 0 },
            { n: 'INTERVIEW · 4 MIN', t: 'Inside Casa de Belleza', m: 7, idx: 1 },
            { n: 'GUIDE · 5 MIN', t: 'How to brief a colorist', m: 5, idx: 2 },
          ].map((g, i) => (
            <Link key={i} to={`/editorial/${g.idx}`} style={{ cursor: 'pointer', background: 'transparent', border: 0, padding: 0, textAlign: 'left', fontFamily: 'inherit', color: p.ink, textDecoration: 'none' }}>
              <div style={{ aspectRatio: isPhone ? '16/10' : '4/5', borderRadius: 14, overflow: 'hidden', backgroundImage: `url(${PHOTOS[g.m]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ marginTop: 10, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{g.n}</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 22 : 26, fontWeight: type.displayWeight, letterSpacing: '-0.015em', marginTop: 4, lineHeight: 1.05, textWrap: 'balance' }}>{g.t}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Salons CTA */}
      <div style={{ margin: isPhone ? '0 18px 28px' : '0 64px 80px', background: p.ink, color: p.bg, borderRadius: 24, padding: isPhone ? '28px 22px' : '52px 56px', display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.2fr 1fr', gap: isPhone ? 18 : 36, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>FOR SALONS</div>
          <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 34 : 56, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '12px 0 0', color: p.bg, textWrap: 'balance' }}>Fill empty chairs. <span style={{ color: p.accent }}>On your schedule.</span></h2>
          <p style={{ fontSize: isPhone ? 14 : 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, margin: '14px 0 0', maxWidth: 480 }}>Get matched to clients within 5 miles, ready to book today. No subscription, no lead fees — pay only when you win the booking.</p>
          <div style={{ marginTop: isPhone ? 18 : 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/onboarding/salon')} style={{ background: p.accent, color: p.ink, border: 0, cursor: 'pointer', padding: isPhone ? '13px 18px' : '15px 24px', borderRadius: 99, fontSize: isPhone ? 13.5 : 15, fontWeight: 600, fontFamily: 'inherit' }}>Join Glossi for salons</button>
            <button onClick={() => navigate('/pricing')} style={{ background: 'transparent', color: p.bg, border: `0.5px solid rgba(255,255,255,0.3)`, cursor: 'pointer', padding: isPhone ? '13px 18px' : '15px 24px', borderRadius: 99, fontSize: isPhone ? 13.5 : 15, fontWeight: 600, fontFamily: 'inherit' }}>See pricing</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {[
            { k: 'Avg. response time', v: '11 min' },
            { k: 'Win rate', v: '34%' },
            { k: 'Booking value', v: '$92' },
            { k: 'Glossi fee', v: '8%' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 16px', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>{s.k.toUpperCase()}</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 36, fontWeight: type.displayWeight, color: p.bg, marginTop: 4, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: isPhone ? '24px 18px' : '40px 64px', borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: p.inkMuted }}>GLOSSI · 2026 · DIRECTION A</div>
        <div style={{ fontSize: 11.5, color: p.inkMuted, display: 'flex', gap: 18 }}>
          <Link to="/" style={{ color: p.inkMuted, textDecoration: 'none' }}>Direction B (default)</Link>
          <Link to="/marketing/c" style={{ color: p.inkMuted, textDecoration: 'none' }}>Direction C</Link>
        </div>
      </div>
    </div>
  );
}

const navLink = { fontSize: 13, color: '#5C544B', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' };
