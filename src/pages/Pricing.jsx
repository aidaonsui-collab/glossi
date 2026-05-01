import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';

// One flat fee for everyone — keeps the marketplace simple while we
// learn what segments matter. Tiered plans (Starter/Pro/Studio) are
// possible once we have volume to justify them.
const PLATFORM_FEE_PCT = 7;

const FEATURES = [
  'Unlimited requests',
  'Calendar sync',
  'Stripe payouts',
  'Custom service menu',
  'Featured placement',
  'Priority support',
];

export default function Pricing() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const [avgBooking, setAvgBooking] = useState(92);
  const [perWeek, setPerWeek] = useState(8);
  const monthly = Math.round(avgBooking * perWeek * 4.33 * (1 - PLATFORM_FEE_PCT / 100));

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 64px', gap: 14, borderBottom: `0.5px solid ${p.line}` }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <span style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.18em' }}>FOR SALONS</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => navigate('/onboarding/salon')} style={{ background: p.ink, color: p.bg, border: 0, padding: isPhone ? '8px 14px' : '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Apply</button>
      </div>

      <div style={{ padding: isPhone ? '36px 18px 24px' : '80px 64px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>PRICING</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 44 : 80, fontWeight: type.displayWeight, letterSpacing: '-0.035em', lineHeight: 0.95, margin: '10px 0 0', textWrap: 'balance' }}>Pay only when <span style={{ color: p.accent }}>you win.</span></h1>
        <p style={{ fontSize: isPhone ? 15 : 18, color: p.inkSoft, lineHeight: 1.55, margin: '14px auto 0', maxWidth: 560, textWrap: 'pretty' }}>No subscription. No lead fees. No "premium placement" tax. One simple cut on confirmed bookings.</p>
      </div>

      {/* Single tier card */}
      <div style={{ padding: isPhone ? '12px 18px' : '20px 64px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          padding: isPhone ? '28px' : '40px 44px', borderRadius: 22,
          background: p.ink, color: p.bg,
          width: '100%', maxWidth: 520,
          position: 'relative', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 30 : 36, fontWeight: type.displayWeight, letterSpacing: '-0.015em' }}>Glossi for salons</div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: type.mono, fontSize: isPhone ? 64 : 84, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{PLATFORM_FEE_PCT}%</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>per confirmed booking</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8, lineHeight: 1.5 }}>
            No monthly fee. No setup cost. Glossi only earns when you do.
          </div>
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: 10 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, lineHeight: 1.4, color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ width: 14, height: 14, borderRadius: 99, background: p.accent, color: p.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                </span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/onboarding/salon')} style={{ marginTop: 26, background: p.accent, color: p.ink, border: 0, cursor: 'pointer', padding: '15px 18px', borderRadius: 99, fontSize: 14.5, fontWeight: 600, fontFamily: 'inherit' }}>Apply free</button>
        </div>
      </div>

      {/* Calculator */}
      <div style={{ padding: isPhone ? '24px 18px' : '40px 64px 60px' }}>
        <div style={{ background: p.surface2, borderRadius: 20, padding: isPhone ? '22px' : '40px', display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: isPhone ? 20 : 40, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>EARNINGS CALCULATOR</div>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 38, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 8 }}>Win {perWeek} booking{perWeek === 1 ? '' : 's'} a week.</div>
            <div style={{ marginTop: 10, fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55 }}>Average booking ${avgBooking}. After Glossi's cut you keep <span style={{ color: p.ink, fontWeight: 600 }}>${monthly.toLocaleString()}/month</span>. Nothing if you don't book.</div>
          </div>
          <div style={{ background: p.bg, borderRadius: 14, padding: '22px', border: `0.5px solid ${p.line}` }}>
            <div style={{ padding: '10px 0', borderBottom: `0.5px solid ${p.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12.5, color: p.inkSoft }}>Avg booking</span>
                <span style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600, color: p.ink }}>${avgBooking}</span>
              </div>
              <input type="range" min={30} max={250} value={avgBooking} onChange={e => setAvgBooking(Number(e.target.value))} style={{ width: '100%', marginTop: 6, accentColor: p.accent }} />
            </div>
            <div style={{ padding: '10px 0', borderBottom: `0.5px solid ${p.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12.5, color: p.inkSoft }}>Bookings / week</span>
                <span style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600, color: p.ink }}>{perWeek}</span>
              </div>
              <input type="range" min={1} max={30} value={perWeek} onChange={e => setPerWeek(Number(e.target.value))} style={{ width: '100%', marginTop: 6, accentColor: p.accent }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: `0.5px solid ${p.line}` }}>
              <span style={{ fontSize: 12.5, color: p.inkSoft }}>Glossi fee</span>
              <span style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600, color: p.ink }}>{PLATFORM_FEE_PCT}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0' }}>
              <span style={{ fontSize: 12.5, color: p.ink, fontWeight: 700 }}>Your monthly take</span>
              <span style={{ fontFamily: type.mono, fontSize: 28, fontWeight: 600, color: p.accent, letterSpacing: '-0.02em' }}>${monthly.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: isPhone ? '8px 18px 40px' : '20px 64px 80px' }}>
        <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 40, fontWeight: type.displayWeight, letterSpacing: '-0.025em', margin: '0 0 18px' }}>Questions, answered.</h2>
        {[
          { q: 'When do I get paid?', a: 'Stripe payouts hit your bank account 1–2 business days after the appointment.' },
          { q: 'What if a client cancels?', a: 'Free cancels up to 24 hrs before. Same-day cancels: client pays 50% deposit, you keep it.' },
          { q: 'Can I decline a request?', a: 'Always. Glossi never auto-books — you choose what to bid on and at what price.' },
          { q: 'Is there a contract?', a: 'No. Pause or leave anytime. Your client list is yours.' },
        ].map((f, i) => (
          <button key={i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ padding: '18px 0', borderBottom: `0.5px solid ${p.line}`, display: 'flex', gap: isPhone ? 12 : 32, alignItems: 'flex-start', width: '100%', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink }}>
            <div style={{ fontFamily: type.mono, fontSize: 11, color: p.accent, fontWeight: 700, width: isPhone ? 28 : 60, flexShrink: 0 }}>0{i + 1}.</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 20 : 24, fontWeight: type.displayWeight, letterSpacing: '-0.01em' }}>{f.q}</div>
              {openFaq === i && <div style={{ marginTop: 6, fontSize: 14, color: p.inkSoft, lineHeight: 1.55 }}>{f.a}</div>}
            </div>
            <div style={{ fontSize: 22, color: p.inkMuted, lineHeight: 1, marginTop: 4 }}>{openFaq === i ? '−' : '+'}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
