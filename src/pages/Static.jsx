// Static legal/info pages — Terms, Privacy, Help, Cities. Same chrome as Marketing.
import { Link, useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';

function Shell({ children }) {
  const isPhone = useNarrow();
  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 64px', gap: 14, borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 5 }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <div style={{ flex: 1 }} />
        <Link to="/" style={{ fontSize: 13, color: p.inkSoft, fontWeight: 500, textDecoration: 'none' }}>← Back</Link>
      </div>
      {children}
      <div style={{ padding: isPhone ? '24px 18px' : '40px 64px', borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: p.inkMuted }}>GLOSSI · 2026</div>
        <div style={{ fontSize: 11.5, color: p.inkMuted, display: 'flex', gap: 18 }}>
          <Link to="/privacy" style={{ color: p.inkMuted, textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ color: p.inkMuted, textDecoration: 'none' }}>Terms</Link>
          <Link to="/help" style={{ color: p.inkMuted, textDecoration: 'none' }}>Help</Link>
        </div>
      </div>
    </div>
  );
}

function Hero({ eyebrow, title, sub }) {
  const isPhone = useNarrow();
  return (
    <div style={{ padding: isPhone ? '40px 18px 16px' : '80px 64px 32px', maxWidth: 880 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>{eyebrow}</div>
      <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 44 : 72, fontWeight: type.displayWeight, letterSpacing: '-0.035em', lineHeight: 0.95, margin: '14px 0 0', textWrap: 'balance' }}>{title}</h1>
      {sub && <p style={{ fontSize: isPhone ? 15 : 18, color: p.inkSoft, lineHeight: 1.55, margin: '16px 0 0', maxWidth: 640, textWrap: 'pretty' }}>{sub}</p>}
    </div>
  );
}

function Body({ children }) {
  const isPhone = useNarrow();
  return (
    <div style={{ padding: isPhone ? '12px 18px 60px' : '20px 64px 80px', maxWidth: 720, fontSize: isPhone ? 14.5 : 16, color: p.inkSoft, lineHeight: 1.7 }}>
      {children}
    </div>
  );
}

const H = ({ children }) => {
  const isPhone = useNarrow();
  return <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 30, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '36px 0 12px' }}>{children}</h2>;
};

export function Terms() {
  return (
    <Shell>
      <Hero eyebrow="LEGAL" title="Terms of Service." sub="Last updated April 30, 2026. By using Glossi you agree to these terms — read them once, then forget about them." />
      <Body>
        <H>1. The marketplace</H>
        <p>Glossi is a marketplace that connects customers with independent salons in the Rio Grande Valley. Glossi is not a salon and does not perform beauty services. Bookings, services, and the relationship around them are between you and the salon.</p>
        <H>2. Your account</H>
        <p>You're responsible for keeping your password confidential and for everything that happens on your account. Tell us right away if anyone uses your account without permission. Email <span style={{ color: p.ink, fontWeight: 600 }}>support@glossi.app</span>.</p>
        <H>3. Bookings & payments</H>
        <p>When you book through Glossi, you authorize us to charge your card the day of your appointment. Free cancellation up to 24 hours before; same-day cancels forfeit a 50% deposit. Refunds for service quality issues are handled case by case — reach out within 7 days.</p>
        <H>4. Reviews & content</H>
        <p>Reviews must reflect a real visit. We remove reviews that contain hate speech, personal information about stylists, or are clearly fake. Photos you upload to a review can be displayed publicly on the salon's profile.</p>
        <H>5. Salons</H>
        <p>Salons set their own prices, hours, and service area. Glossi takes a percentage of confirmed bookings (8% Starter, 6% Pro). Salons are responsible for their own licensing, insurance, and tax obligations. Glossi is not an employer.</p>
        <H>6. What we won't do</H>
        <p>Glossi will not share your email or phone with salons until you book. We don't sell your data. We don't show ads inside the app. If we ever change either of those, we'll tell you first and give you a way out.</p>
        <H>7. Changes</H>
        <p>We may update these terms from time to time. We'll email you 30 days before any meaningful change, and the in-app banner will tell you what changed.</p>
        <H>8. Disputes</H>
        <p>If something goes wrong, email us first — most issues resolve in a day. If we can't agree, disputes are handled by binding arbitration in Hidalgo County, Texas.</p>
      </Body>
    </Shell>
  );
}

export function Privacy() {
  return (
    <Shell>
      <Hero eyebrow="LEGAL" title="Privacy Policy." sub="What we collect, what we don't, and what we do with the rest. Plain English." />
      <Body>
        <H>What we collect</H>
        <p>Your name, email, phone, ZIP, and the things you do in the app: requests posted, bids received, bookings made, salons saved, reviews written. If you upload photos to a review or request, those go into our storage too.</p>
        <H>What we don't</H>
        <p>We don't track you across other apps and websites. We don't run third-party advertising trackers. We don't sell anything. We never read your messages with salons except when you flag a thread for support.</p>
        <H>Who sees what</H>
        <p>Salons see your first name, your ZIP, your service request, and any photos you attached. They see your phone number after you book — not before. Reviews appear with your first name and last initial.</p>
        <H>Storage</H>
        <p>Your data lives in Postgres on Supabase (US East). Photos are in Cloudflare R2. Payment data never touches our servers — Stripe handles all of it with PCI-compliant tokenization. Local prototype data lives in your browser's localStorage and is wiped if you clear it.</p>
        <H>Your rights</H>
        <p>Email <span style={{ color: p.ink, fontWeight: 600 }}>privacy@glossi.app</span> to download everything we have on you, correct anything that's wrong, or delete your account. We respond within 30 days. Texas residents have additional rights under Texas Data Privacy and Security Act — same email, same response.</p>
        <H>Cookies</H>
        <p>We use a single cookie to keep you signed in. That's it. No analytics cookies, no tracking pixels.</p>
        <H>Kids</H>
        <p>Glossi isn't for anyone under 16. If we learn we've collected information from a minor, we delete it.</p>
      </Body>
    </Shell>
  );
}

export function Help() {
  const FAQ = [
    { q: 'How does the bidding work?', a: 'Post a request — service, photos, when you\'re free, what you\'re willing to pay. Salons within 5 miles see it and send bids. You pick. Most requests get 4–8 bids inside an hour.' },
    { q: 'When am I charged?', a: 'When the appointment happens, not when you book. We pre-authorize the card amount to confirm the booking, then charge after the appointment is complete.' },
    { q: 'Can I cancel?', a: 'Free cancellation up to 24 hours before your appointment. Same-day cancels forfeit a 50% deposit; the salon keeps that to cover the held slot.' },
    { q: 'How do I reschedule?', a: 'Open Bookings, tap Reschedule on your upcoming appointment, pick a new slot. Free up to the 24-hour window — within that window, the salon may decline.' },
    { q: 'What if my hair / nails / lashes are bad?', a: 'Reach out within 7 days at support@glossi.app. We mediate with the salon — most issues end with a partial refund or a free fix-up.' },
    { q: 'Is there a tip on the price?', a: 'Tip is added at checkout and goes 100% to the stylist. Glossi never takes a cut of tip.' },
    { q: 'Is Glossi available outside the Valley?', a: 'Right now it\'s the Rio Grande Valley only — Pharr, McAllen, Edinburg, Mission, Weslaco, and Brownsville. We\'ll expand once these cities are saturated.' },
    { q: 'I\'m a salon — how do I sign up?', a: 'Tap "Apply for salons" on the homepage or sign up at /signup as Salon. Approval is usually 1–2 business days.' },
  ];
  return (
    <Shell>
      <Hero eyebrow="HELP CENTER" title="How can we help?" sub="The questions we hear the most. If yours isn't here, email support@glossi.app — we answer in under 4 hours weekdays." />
      <Body>
        {FAQ.map((f, i) => (
          <div key={i} style={{ paddingTop: 24, marginTop: 24, borderTop: i ? `0.5px solid ${p.line}` : 'none' }}>
            <H>{f.q}</H>
            <p>{f.a}</p>
          </div>
        ))}
        <div style={{ marginTop: 56, padding: '28px 32px', background: p.surface, borderRadius: 18, border: `0.5px solid ${p.line}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>STILL STUCK?</div>
          <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 24, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em', margin: '8px 0 6px' }}>Email us — we read every message.</h3>
          <p style={{ margin: '0 0 14px' }}>Average response time: 3h 42m. We're a small team based in McAllen.</p>
          <a href="mailto:support@glossi.app" style={{ display: 'inline-block', background: p.ink, color: p.bg, padding: '11px 20px', borderRadius: 99, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>support@glossi.app</a>
        </div>
      </Body>
    </Shell>
  );
}

export function Cities() {
  const navigate = useNavigate();
  const isPhone = useNarrow();
  const CITIES = [
    { name: 'Pharr', salons: 487, mood: 0, bookings: 312, status: 'live' },
    { name: 'McAllen', salons: 612, mood: 3, bookings: 489, status: 'live' },
    { name: 'Edinburg', salons: 218, mood: 5, bookings: 144, status: 'live' },
    { name: 'Mission', salons: 134, mood: 1, bookings: 88, status: 'live' },
    { name: 'Weslaco', salons: 96, mood: 4, bookings: 51, status: 'live' },
    { name: 'Brownsville', salons: 0, mood: 7, bookings: 0, status: 'soon', when: 'Summer 2026' },
    { name: 'Harlingen', salons: 0, mood: 6, bookings: 0, status: 'soon', when: 'Summer 2026' },
    { name: 'Laredo', salons: 0, mood: 2, bookings: 0, status: 'requested' },
    { name: 'Corpus Christi', salons: 0, mood: 4, bookings: 0, status: 'requested' },
    { name: 'San Antonio', salons: 0, mood: 5, bookings: 0, status: 'requested' },
  ];
  return (
    <Shell>
      <Hero eyebrow="WHERE WE OPERATE" title="Cities." sub="Glossi is live in the Rio Grande Valley with 1,547 salons. Brownsville and Harlingen are next — request your city to vote it forward." />
      <div style={{ padding: isPhone ? '0 18px 60px' : '0 64px 80px', maxWidth: 1040 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {CITIES.map(c => (
            <div key={c.name} style={{
              background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`,
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ height: 120, backgroundImage: `url(${PHOTOS[c.mood % PHOTOS.length]})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: c.status === 'live' ? 'transparent' : 'rgba(26,23,20,0.45)' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 99, background: c.status === 'live' ? p.accent : c.status === 'soon' ? p.surface : 'rgba(255,255,255,0.92)', color: c.status === 'live' ? p.ink : p.ink, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em' }}>
                  {c.status === 'live' ? 'LIVE' : c.status === 'soon' ? 'COMING SOON' : 'REQUESTED'}
                </div>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.015em' }}>{c.name}</div>
                {c.status === 'live' ? (
                  <>
                    <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                      <div>
                        <div style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 600, color: p.ink }}>{c.salons}</div>
                        <div style={{ fontSize: 10.5, color: p.inkMuted, fontWeight: 600, letterSpacing: '0.1em' }}>SALONS</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 600, color: p.ink }}>{c.bookings}/wk</div>
                        <div style={{ fontSize: 10.5, color: p.inkMuted, fontWeight: 600, letterSpacing: '0.1em' }}>BOOKINGS</div>
                      </div>
                    </div>
                    <button onClick={() => navigate('/explore')} style={{ marginTop: 14, background: p.ink, color: p.bg, border: 0, padding: '9px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Browse {c.name} →</button>
                  </>
                ) : c.status === 'soon' ? (
                  <>
                    <div style={{ marginTop: 8, fontSize: 13, color: p.inkSoft }}>Launching {c.when}</div>
                    <button onClick={() => navigate('/signup')} style={{ marginTop: 14, background: p.surface, color: p.ink, border: `0.5px solid ${p.line}`, padding: '9px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Get notified →</button>
                  </>
                ) : (
                  <>
                    <div style={{ marginTop: 8, fontSize: 13, color: p.inkSoft }}>Requested by 200+ users</div>
                    <a href={`mailto:hello@glossi.app?subject=${encodeURIComponent('Bring Glossi to ' + c.name)}`} style={{ display: 'inline-block', marginTop: 14, background: 'transparent', color: p.accent, border: `0.5px solid ${p.accent}`, padding: '9px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}>Vote for {c.name} →</a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36, padding: '28px 32px', background: p.ink, color: p.bg, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>YOUR CITY?</div>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 28, fontWeight: type.displayWeight, marginTop: 4 }}>Tell us where you want Glossi next.</div>
          </div>
          <a href="mailto:hello@glossi.app?subject=City%20request" style={{ background: p.accent, color: p.ink, padding: '12px 22px', borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Email us →</a>
        </div>
      </div>
    </Shell>
  );
}
