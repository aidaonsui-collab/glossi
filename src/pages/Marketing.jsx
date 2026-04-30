import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import { useAuth } from '../store.jsx';
import SignInModal from '../components/SignInModal.jsx';

export default function Marketing() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const howRef = useRef(null);
  const compareRef = useRef(null);
  const salonRef = useRef(null);

  const scrollTo = ref => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const Nav = () => (
    <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 64px', gap: 14, borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 5 }}>
      <Link to="/" style={{ fontFamily: type.body, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: p.ink, textDecoration: 'none' }}>GLOSSI</Link>
      <div style={{ flex: 1 }} />
      {!isPhone && (
        <div style={{ display: 'flex', gap: 24 }}>
          <button onClick={() => scrollTo(howRef)} style={navBtn}>How it works</button>
          <button onClick={() => scrollTo(salonRef)} style={navBtn}>For salons</button>
          <Link to="/pricing" style={navBtn}>Pricing</Link>
          <Link to="/ios" style={navBtn}>iOS preview</Link>
          <button onClick={() => toast('Glossi is live in 4 Texas cities — more coming soon.')} style={navBtn}>Cities</button>
        </div>
      )}
      {user ? (
        <button onClick={() => navigate(user.type === 'salon' ? '/salon' : '/quotes')} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '6px 6px 6px 12px', fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{user.name.split(' ')[0]}</span>
          <span style={{ width: 28, height: 28, borderRadius: 99, background: user.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 11, fontWeight: 700 }}>{user.initials}</span>
        </button>
      ) : (
        <button onClick={() => setSignInOpen(true)} style={{ background: 'transparent', border: 0, padding: '8px 12px', fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer' }}>Sign in</button>
      )}
      <button onClick={() => navigate('/signup')} style={{ background: p.accent, color: p.ink, border: 0, padding: isPhone ? '8px 14px' : '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{isPhone ? 'Sign up' : 'Get started'}</button>
    </div>
  );

  const ticker = [
    { who: 'Sofia · Pharr', what: 'Color & balayage', save: '$48' },
    { who: 'Daniela · McAllen', what: 'Hybrid lashes', save: '$22' },
    { who: 'Maritza · Edinburg', what: 'Gel mani + pedi', save: '$15' },
    { who: 'Kevin · Mission', what: 'Skin fade + beard', save: '$18' },
    { who: 'Jasmin · Brownsville', what: 'Brazilian blowout', save: '$76' },
    { who: 'Camila · Harlingen', what: 'Microblading', save: '$120' },
  ];

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      <Nav />

      <div style={{ padding: isPhone ? '12px 18px 0' : '20px 64px 0' }}>
        <div style={{ position: 'relative', borderRadius: isPhone ? 20 : 24, overflow: 'hidden', aspectRatio: isPhone ? '4/5' : '21/9', backgroundImage: `url(${PHOTOS[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(26,23,20,0) 0%, rgba(26,23,20,0.05) 50%, rgba(26,23,20,0.7) 100%)' }} />
          <div style={{ position: 'absolute', top: isPhone ? 16 : 28, left: isPhone ? 16 : 32, color: p.bg, fontFamily: type.mono, fontSize: isPhone ? 10 : 12, fontWeight: 600, letterSpacing: '0.18em' }}>
            ISSUE 04 · APR 2026
          </div>
          <div style={{ position: 'absolute', top: isPhone ? 16 : 28, right: isPhone ? 16 : 32, color: p.bg, fontFamily: type.mono, fontSize: isPhone ? 10 : 12, fontWeight: 600, letterSpacing: '0.18em' }}>
            VOL. 1 · BEAUTY MARKETPLACE
          </div>
          <div style={{ position: 'absolute', left: isPhone ? 20 : 48, right: isPhone ? 20 : 48, bottom: isPhone ? 22 : 42, color: p.bg }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? '13vw' : '7.5vw', fontWeight: type.displayWeight, letterSpacing: '-0.04em', lineHeight: 0.9, textWrap: 'balance', margin: 0 }}>
              Beauty,<br />negotiated.
            </div>
            <div style={{ marginTop: isPhone ? 12 : 18, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/signup')} style={{ background: p.bg, color: p.ink, border: 0, padding: isPhone ? '12px 18px' : '14px 22px', borderRadius: 99, fontSize: isPhone ? 13.5 : 14, fontWeight: 600, cursor: 'pointer' }}>Post a request</button>
              <span style={{ fontFamily: type.mono, fontSize: isPhone ? 11 : 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>1,400+ SALONS · 4 CITIES</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={howRef} style={{ padding: isPhone ? '40px 18px 30px' : '80px 64px 80px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: p.accent }} />
          <span>AVERAGE GLOSSI USER SAVES</span>
        </div>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? '25vw' : '19vw', fontWeight: type.displayWeight, letterSpacing: '-0.06em', lineHeight: 0.82, margin: '8px 0 0', color: p.ink }}>$34</div>
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.4fr 1fr', gap: isPhone ? 20 : 60, marginTop: isPhone ? 20 : 30, alignItems: 'flex-end' }}>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 54, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.95, margin: 0, textWrap: 'balance' }}>
            per booking, vs. walking in <span style={{ color: p.accent }}>cold.</span>
          </h1>
          <p style={{ fontSize: isPhone ? 14 : 16, color: p.inkSoft, lineHeight: 1.55, margin: 0, textWrap: 'pretty' }}>
            You post what you want. Salons send bids. The right one wins. It's how every other industry works — finally, beauty too.
          </p>
        </div>
        <div style={{ marginTop: isPhone ? 28 : 42, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => navigate('/signup')} style={{ background: p.ink, color: p.bg, border: 0, padding: isPhone ? '14px 22px' : '18px 30px', borderRadius: 99, fontSize: isPhone ? 14 : 16, fontWeight: 600, cursor: 'pointer' }}>Post your first request →</button>
          <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, fontWeight: 500, letterSpacing: '0.1em' }}>FREE · 30 SECONDS · NO ACCOUNT NEEDED</span>
        </div>
      </div>

      <div style={{ background: p.ink, color: p.bg, padding: isPhone ? '14px 0' : '18px 0', overflow: 'hidden', borderTop: `0.5px solid ${p.line}`, borderBottom: `0.5px solid ${p.line}` }}>
        <div style={{ display: 'flex', gap: isPhone ? 28 : 48, fontFamily: type.mono, fontSize: isPhone ? 11 : 13, fontWeight: 500, letterSpacing: '0.04em', whiteSpace: 'nowrap', alignItems: 'center', padding: '0 24px', width: 'max-content', animation: 'glossiTicker 60s linear infinite' }}>
          {[...ticker, ...ticker].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: p.accent }} />
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t.who}</span>
              <span>{t.what}</span>
              <span style={{ color: p.accent, fontWeight: 600 }}>saved {t.save}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={compareRef} style={{ padding: isPhone ? '36px 18px' : '90px 64px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>THE OLD WAY VS. GLOSSI</div>
        <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '10px 0 0', textWrap: 'balance' }}>
          Why are you the one shopping?
        </h2>
        <div style={{ marginTop: isPhone ? 22 : 40, display: 'grid', gap: isPhone ? 12 : 18, gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr' }}>
          {[
            { tag: 'BEFORE GLOSSI', tone: 'old', t: 'You scroll, DM, get ghosted, accept a price.', items: ['Hours scrolling Instagram', 'DM five places, hear from one', 'Whatever the menu price is', '"Are you available Saturday?" "no sorry"'] },
            { tag: 'WITH GLOSSI', tone: 'new', t: 'You post once. Salons compete for you.', items: ['30 seconds to post a request', '4–8 bids in your inbox', 'Often 20–40% under menu price', 'Real slots, real prices, real people'] },
          ].map((c, i) => (
            <div key={i} style={{
              padding: isPhone ? '20px' : '30px',
              borderRadius: 18,
              background: c.tone === 'new' ? p.ink : p.surface,
              color: c.tone === 'new' ? p.bg : p.ink,
              border: c.tone === 'new' ? 'none' : `0.5px solid ${p.line}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: c.tone === 'new' ? p.accent : p.inkMuted }}>{c.tag}</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 22 : 30, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 8, textWrap: 'balance' }}>{c.t}</div>
              <div style={{ marginTop: isPhone ? 14 : 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.items.map((line, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: isPhone ? 13 : 14, lineHeight: 1.5, color: c.tone === 'new' ? 'rgba(255,255,255,0.85)' : p.inkSoft }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 99,
                      background: c.tone === 'new' ? p.accent : 'transparent',
                      border: c.tone === 'new' ? 'none' : `0.5px solid ${p.inkMuted}`,
                      color: c.tone === 'new' ? p.ink : p.inkMuted,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 2, fontSize: 11, fontWeight: 700,
                    }}>{c.tone === 'new' ? '✓' : '·'}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={salonRef} style={{ padding: isPhone ? '30px 18px 40px' : '80px 64px 100px', background: p.surface, borderTop: `0.5px solid ${p.line}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: isPhone ? 20 : 50, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>SALONS — READ THIS</div>
            <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.98, margin: '10px 0 0', textWrap: 'balance' }}>You set your floor. We bring the chair.</h2>
            <p style={{ fontSize: isPhone ? 14 : 16, color: p.inkSoft, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 480 }}>
              No subscription. No lead fees. Pay 8% only when you win a booking. Set your minimum price, your service area, your hours — we route requests that match.
            </p>
            <button onClick={() => navigate('/signup?role=salon')} style={{ marginTop: 18, background: p.ink, color: p.bg, border: 0, padding: isPhone ? '14px 20px' : '15px 24px', borderRadius: 99, fontSize: isPhone ? 13.5 : 15, fontWeight: 600, cursor: 'pointer' }}>Apply for salons →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {[
              { k: 'Avg. response', v: '11 min' },
              { k: 'Win rate', v: '34%' },
              { k: 'No-show rate', v: '2.1%' },
              { k: 'Glossi fee', v: '8%' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '18px 18px', background: p.bg, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 26 : 36, fontWeight: type.displayWeight, marginTop: 4, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <div style={{ padding: isPhone ? '24px 18px' : '40px 64px', borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: p.inkMuted }}>GLOSSI · 2026</div>
        <div style={{ fontSize: 11.5, color: p.inkMuted, display: 'flex', gap: 18 }}>
          <button onClick={() => toast('Privacy policy — coming soon.')} style={footerBtn}>Privacy</button>
          <button onClick={() => toast('Terms of service — coming soon.')} style={footerBtn}>Terms</button>
          <button onClick={() => toast('Help center — coming soon.')} style={footerBtn}>Help</button>
        </div>
      </div>
    </div>
  );
}

const navBtn = { background: 'transparent', border: 0, fontSize: 13, color: '#5C544B', fontWeight: 500, textDecoration: 'none', cursor: 'pointer', fontFamily: 'inherit' };
const footerBtn = { background: 'transparent', border: 0, fontSize: 11.5, color: '#9A9088', cursor: 'pointer', padding: 0, fontFamily: 'inherit' };
