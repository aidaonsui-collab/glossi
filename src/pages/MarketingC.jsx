import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal.jsx';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';

export default function MarketingC() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const [signInOpen, setSignInOpen] = useState(false);
  const toast = useToast();

  const Nav = () => (
    <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 56px', gap: 14 }}>
      <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 22 : 28, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.ink, textDecoration: 'none' }}>Glossi</Link>
      <div style={{ flex: 1 }} />
      {!isPhone && (
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/marketing/a" style={navLink}>Direction A</Link>
          <Link to="/" style={navLink}>Direction B</Link>
          <Link to="/pricing" style={navLink}>Pricing</Link>
          <Link to="/ios" style={navLink}>iOS preview</Link>
        </div>
      )}
      <button onClick={() => setSignInOpen(true)} style={{ background: p.ink, color: p.bg, border: 0, padding: isPhone ? '8px 14px' : '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Sign in</button>
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      <Nav />

      {/* Hero — magazine cover */}
      <div style={{ padding: isPhone ? '12px 18px 0' : '16px 56px 0' }}>
        <div style={{ position: 'relative', borderRadius: isPhone ? 20 : 28, overflow: 'hidden', aspectRatio: isPhone ? '3/4' : '16/9', backgroundImage: `url(${PHOTOS[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,23,20,0.0) 0%, rgba(26,23,20,0.05) 50%, rgba(26,23,20,0.7) 100%)' }} />
          <div style={{ position: 'absolute', top: isPhone ? 16 : 28, left: isPhone ? 16 : 32, color: p.bg, fontFamily: type.mono, fontSize: isPhone ? 10 : 12, fontWeight: 600, letterSpacing: '0.18em' }}>ISSUE 04 · APR 2026</div>
          <div style={{ position: 'absolute', top: isPhone ? 16 : 28, right: isPhone ? 16 : 32, color: p.bg, fontFamily: type.mono, fontSize: isPhone ? 10 : 12, fontWeight: 600, letterSpacing: '0.18em' }}>VOL. 1 · BEAUTY MARKETPLACE</div>
          <div style={{ position: 'absolute', left: isPhone ? 20 : 48, right: isPhone ? 20 : 48, bottom: isPhone ? 22 : 42, color: p.bg }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? '13vw' : '8.5vw', fontWeight: type.displayWeight, letterSpacing: '-0.04em', lineHeight: 0.9, textWrap: 'balance', margin: 0 }}>
              They bid.<br />You book.
            </div>
            <div style={{ marginTop: isPhone ? 12 : 18, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/onboarding/customer')} style={{ background: p.bg, color: p.ink, border: 0, cursor: 'pointer', padding: isPhone ? '12px 18px' : '14px 22px', borderRadius: 99, fontSize: isPhone ? 13.5 : 14, fontWeight: 600, fontFamily: 'inherit' }}>Post a request</button>
              <span style={{ fontFamily: type.mono, fontSize: isPhone ? 11 : 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>1,400+ SALONS · 4 CITIES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inside this issue */}
      <div style={{ padding: isPhone ? '30px 18px 0' : '70px 56px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, borderBottom: `0.5px solid ${p.line}`, paddingBottom: 10, marginBottom: isPhone ? 16 : 24 }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 22 : 28, fontWeight: type.displayWeight }}>Inside</div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.14em' }}>04 STORIES</div>
        </div>
        <div style={{ display: 'grid', gap: isPhone ? 14 : 24, gridTemplateColumns: isPhone ? '1fr' : '1.4fr 1fr 1fr' }}>
          <Link to="/editorial/2" style={{ cursor: 'pointer', background: 'transparent', border: 0, padding: 0, textAlign: 'left', fontFamily: 'inherit', color: p.ink, textDecoration: 'none' }}>
            <div style={{ aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', backgroundImage: `url(${PHOTOS[7]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ marginTop: 12, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.accent }}>FEATURE · 8 MIN</div>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 38, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 6, textWrap: 'balance' }}>What a balayage actually costs to make.</div>
            <div style={{ marginTop: 8, fontSize: isPhone ? 13 : 14, color: p.inkSoft, lineHeight: 1.5 }}>We followed Maria's morning at Casa de Belleza. Foils, toner, blowout — and the math that makes a $92 booking work.</div>
          </Link>
          {[
            { k: 'GUIDE · 6 MIN', t: 'How to brief a colorist (without a Pinterest board).', m: 5, idx: 0 },
            { k: 'INTERVIEW · 4 MIN', t: 'The barber who fired Instagram.', m: 4, idx: 1 },
          ].map((g, i) => (
            <Link key={i} to={`/editorial/${g.idx}`} style={{ cursor: 'pointer', background: 'transparent', border: 0, padding: 0, textAlign: 'left', fontFamily: 'inherit', color: p.ink, textDecoration: 'none' }}>
              <div style={{ aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', backgroundImage: `url(${PHOTOS[g.m]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ marginTop: 12, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.accent }}>{g.k}</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 22 : 24, fontWeight: type.displayWeight, letterSpacing: '-0.015em', lineHeight: 1.05, marginTop: 6, textWrap: 'balance' }}>{g.t}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* The marketplace, in passing */}
      <div style={{ padding: isPhone ? '34px 18px' : '80px 56px', display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: isPhone ? 20 : 50, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>MARKETPLACE · IN BRIEF</div>
          <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.98, margin: '10px 0 0', textWrap: 'balance' }}>You post. They bid. You pick.</h2>
          <p style={{ fontSize: isPhone ? 14 : 16, color: p.inkSoft, lineHeight: 1.6, margin: '14px 0 0', textWrap: 'pretty' }}>
            Glossi flips the search. Tell us what you want and what you'd pay — local salons compete with real slots and real prices. Most requests get four bids inside an hour.
          </p>
          <div style={{ marginTop: isPhone ? 16 : 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/onboarding/customer')} style={{ background: p.ink, color: p.bg, border: 0, cursor: 'pointer', padding: isPhone ? '13px 18px' : '14px 22px', borderRadius: 99, fontSize: isPhone ? 13.5 : 14, fontWeight: 600, fontFamily: 'inherit' }}>Try it (30 sec)</button>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', color: p.ink, border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: isPhone ? '13px 18px' : '14px 22px', borderRadius: 99, fontSize: isPhone ? 13.5 : 14, fontWeight: 600, fontFamily: 'inherit' }}>How it works →</button>
          </div>
        </div>
        <div style={{ position: 'relative', height: isPhone ? 320 : 420 }}>
          {[
            { name: 'Casa de Belleza', price: 92, was: 140, time: '4 min ago', m: 0, tilt: -3, top: '4%', left: '4%' },
            { name: 'Studio Onyx', price: 108, was: 140, time: '12 min ago', m: 3, tilt: 2, top: '30%', left: '18%' },
            { name: 'Brisa Hair Bar', price: 118, was: 140, time: '18 min ago', m: 5, tilt: -1, top: '58%', left: '2%' },
          ].map((b, i) => (
            <div key={i} style={{
              position: 'absolute', top: b.top, left: b.left,
              width: isPhone ? '78%' : '72%',
              background: p.surface, borderRadius: 14, padding: '14px 16px',
              border: `0.5px solid ${p.line}`, transform: `rotate(${b.tilt}deg)`,
              boxShadow: '0 14px 30px rgba(0,0,0,0.10)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, backgroundImage: `url(${PHOTOS[b.m]})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: type.body, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>NEW BID · {b.time.toUpperCase()}</div>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, marginTop: 2, letterSpacing: '-0.01em' }}>{b.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: type.mono, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>${b.price}</div>
                <div style={{ fontFamily: type.mono, fontSize: 10.5, color: p.inkMuted, textDecoration: 'line-through' }}>${b.was}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For salons strip */}
      <div style={{ padding: isPhone ? '24px 18px 36px' : '60px 56px 80px' }}>
        <div style={{ background: p.ink, color: p.bg, borderRadius: 24, padding: isPhone ? '24px 22px' : '42px 48px', display: 'flex', alignItems: 'center', gap: isPhone ? 14 : 30, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>FOR SALON OWNERS</div>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 42, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, marginTop: 8, textWrap: 'balance' }}>Fill empty chairs. Set your floor.</div>
          </div>
          <button onClick={() => navigate('/onboarding/salon')} style={{ background: p.accent, color: p.ink, border: 0, cursor: 'pointer', padding: isPhone ? '13px 20px' : '15px 26px', borderRadius: 99, fontSize: isPhone ? 14 : 15, fontWeight: 600, fontFamily: 'inherit' }}>Apply for Glossi Pro →</button>
        </div>
      </div>

      <div style={{ padding: isPhone ? '24px 18px' : '40px 56px', borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight }}>Glossi · Direction C</div>
        <div style={{ fontSize: 11.5, color: p.inkMuted, display: 'flex', gap: 18 }}>
          <Link to="/marketing/a" style={{ color: p.inkMuted, textDecoration: 'none' }}>Direction A</Link>
          <Link to="/" style={{ color: p.inkMuted, textDecoration: 'none' }}>Direction B (default)</Link>
        </div>
      </div>
    </div>
  );
}

const navLink = { fontSize: 13, color: '#1A1714', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' };
