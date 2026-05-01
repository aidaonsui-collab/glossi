import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import Modal from '../components/Modal.jsx';
import { useToast } from '../components/Toast.jsx';

const tiers = [
  { id: 'starter', name: 'Starter', price: '8%', sub: 'per confirmed booking', tone: 'normal', features: ['Unlimited requests', 'Calendar sync', 'Stripe payouts', 'Standard support'], cta: 'Apply free' },
  { id: 'pro', name: 'Pro', price: '6%', sub: 'per booking · $29/mo', tone: 'feature', features: ['Everything in Starter', 'Featured placement', 'Custom service menu', 'Same-day payouts', 'Priority support'], cta: 'Start Pro' },
  { id: 'studio', name: 'Studio', price: 'Custom', sub: 'multi-stylist teams', tone: 'normal', features: ['Everything in Pro', 'Multi-chair routing', 'Per-stylist analytics', 'API access', 'Onboarding manager'], cta: 'Talk to sales' },
];

export default function Pricing() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const [openFaq, setOpenFaq] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [avgBooking, setAvgBooking] = useState(92);
  const [perWeek, setPerWeek] = useState(8);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const monthly = Math.round(avgBooking * perWeek * 4.33 * 0.94);

  const onTier = t => {
    if (t.id === 'studio') setContactOpen(true);
    else { toast(`Starting ${t.name} signup.`); navigate('/onboarding/salon'); }
  };
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

      <div style={{ padding: isPhone ? '12px 18px' : '20px 64px 40px', display: 'grid', gridTemplateColumns: isPhone ? '1fr' : 'repeat(3,1fr)', gap: isPhone ? 14 : 18 }}>
        {tiers.map((tier, i) => {
          const feat = tier.tone === 'feature';
          return (
            <div key={i} style={{
              padding: isPhone ? '24px' : '30px 28px', borderRadius: 20,
              background: feat ? p.ink : p.surface,
              color: feat ? p.bg : p.ink,
              border: feat ? 'none' : `0.5px solid ${p.line}`,
              position: 'relative', display: 'flex', flexDirection: 'column',
            }}>
              {feat && <div style={{ position: 'absolute', top: -10, left: 24, background: p.accent, color: p.ink, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em', padding: '4px 10px', borderRadius: 99 }}>MOST POPULAR</div>}
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 26 : 30, fontWeight: type.displayWeight, letterSpacing: '-0.015em' }}>{tier.name}</div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontFamily: type.mono, fontSize: isPhone ? 44 : 54, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{tier.price}</span>
              </div>
              <div style={{ fontSize: 12.5, color: feat ? 'rgba(255,255,255,0.6)' : p.inkMuted, marginTop: 6 }}>{tier.sub}</div>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                {tier.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, lineHeight: 1.4, color: feat ? 'rgba(255,255,255,0.85)' : p.inkSoft }}>
                    <span style={{ width: 14, height: 14, borderRadius: 99, background: feat ? p.accent : p.success + '24', color: feat ? p.ink : p.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => onTier(tier)} style={{ marginTop: 18, background: feat ? p.accent : p.ink, color: feat ? p.ink : p.bg, border: 0, cursor: 'pointer', padding: '13px 18px', borderRadius: 99, fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit' }}>{tier.cta}</button>
            </div>
          );
        })}
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
              <span style={{ fontSize: 12.5, color: p.inkSoft }}>Glossi fee · Pro</span>
              <span style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600, color: p.ink }}>6%</span>
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
          { q: 'When do I get paid?', a: 'Stripe payouts hit your bank account 1–2 business days after the appointment. Pro tier: same-day for bookings before noon.' },
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

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} eyebrow="STUDIO · TALK TO SALES" title="Tell us about your team" footer={
        <>
          <button onClick={() => setContactOpen(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>Cancel</button>
          <button onClick={() => { if (!email) { toast('Email required.', { tone: 'warn' }); return; } toast(`Thanks ${name || 'there'} — we'll be in touch within a day.`, { tone: 'success' }); setContactOpen(false); setName(''); setEmail(''); }} style={{ background: p.accent, color: p.ink, border: 0, cursor: 'pointer', padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Send</button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>YOUR NAME</div>
            <input value={name} onChange={e => setName(e.target.value)} style={{ marginTop: 6, width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }} />
          </label>
          <label>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>EMAIL</div>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@studio.com" style={{ marginTop: 6, width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }} />
          </label>
        </div>
      </Modal>
    </div>
  );
}
