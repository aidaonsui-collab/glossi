import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useAuth } from '../store.jsx';
import { useToast } from '../components/Toast.jsx';
import SocialSignIn from '../components/SocialSignIn.jsx';

const PASSWORD_MIN = 8;

function strength(pw) {
  let s = 0;
  if (pw.length >= PASSWORD_MIN) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}

const STRENGTH_LABEL = ['', 'Weak', 'Okay', 'Strong', 'Excellent'];

export default function SignUp() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { signUp, user } = useAuth();
  const [params] = useSearchParams();

  // If already signed in, redirect to the right dashboard.
  useEffect(() => {
    if (user) navigate(user.type === 'salon' ? '/salon' : '/quotes', { replace: true });
  }, [user, navigate]);

  const [role, setRole] = useState(params.get('role') === 'salon' ? 'salon' : 'customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pwStrength = strength(password);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = name.trim().length >= 2 && emailValid && password.length >= PASSWORD_MIN && agree;

  const submit = async e => {
    e?.preventDefault();
    if (!canSubmit) {
      if (!agree) toast('Please accept the terms to continue.', { tone: 'warn' });
      else if (!emailValid) toast('Check the email format.', { tone: 'warn' });
      else if (password.length < PASSWORD_MIN) toast(`Password needs ${PASSWORD_MIN}+ characters.`, { tone: 'warn' });
      else if (name.trim().length < 2) toast('Add your name.', { tone: 'warn' });
      return;
    }
    setSubmitting(true);
    try {
      const result = await signUp({ name: name.trim(), email, password, role });
      if (!result?.ok) {
        toast(result?.error || 'Sign up failed.', { tone: 'warn' });
        return;
      }
      if (result.needsConfirmation) {
        toast('Check your email to confirm your account.', { tone: 'success' });
        return;
      }
      toast(`Welcome, ${name.split(' ')[0]}!`, { tone: 'success' });
      navigate(role === 'salon' ? '/onboarding/salon' : '/onboarding/customer');
    } catch (err) {
      console.error('signUp error', err);
      toast(err?.message || 'Sign up failed unexpectedly.', { tone: 'warn' });
    } finally {
      setSubmitting(false);
    }
  };

  const input = {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    border: `0.5px solid ${p.line}`, background: p.surface,
    fontFamily: type.body, fontSize: 15, color: p.ink, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: isPhone ? '18px' : '22px 64px', display: 'flex', alignItems: 'center', borderBottom: `0.5px solid ${p.line}` }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, color: p.inkMuted }}>Already a member?</span>
        <Link to="/?signin=1" style={{ marginLeft: 10, fontSize: 13, color: p.ink, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', alignItems: 'stretch' }}>
        {/* Form column */}
        <div style={{ padding: isPhone ? '32px 18px 48px' : '64px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 600 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>JOIN GLOSSI</div>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 44 : 64, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '12px 0 0', textWrap: 'balance' }}>
            Create your <span style={{ color: p.accent }}>account.</span>
          </h1>
          <p style={{ fontSize: isPhone ? 14.5 : 16, color: p.inkSoft, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 460 }}>
            Free to join. Customers post requests, salons send bids — no monthly subscription either way.
          </p>

          {/* Role picker */}
          <div style={{ marginTop: isPhone ? 24 : 32 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 8 }}>I'M JOINING AS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { id: 'customer', l: 'Customer', sub: 'Book salons, get bids' },
                { id: 'salon', l: 'Salon', sub: 'Send bids, fill chairs' },
              ].map(r => {
                const a = role === r.id;
                return (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)} style={{
                    padding: '16px 18px', borderRadius: 14,
                    background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                    border: `0.5px solid ${a ? p.ink : p.line}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}>
                    <div style={{ fontFamily: type.body, fontSize: 15, fontWeight: 600 }}>{r.l}</div>
                    <div style={{ fontSize: 12, opacity: a ? 0.75 : 0.65, marginTop: 4 }}>{r.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={submit} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{role === 'salon' ? 'SALON OR OWNER NAME' : 'YOUR NAME'}</div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={role === 'salon' ? 'e.g. Casa de Belleza' : 'e.g. Sofia Martínez'} autoFocus autoComplete="name" style={input} />
            </label>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>EMAIL</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value.trim())} placeholder="you@email.com" autoComplete="email" style={input} />
            </label>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>PASSWORD</div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={`At least ${PASSWORD_MIN} characters`} autoComplete="new-password" style={input} />
              {password.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: n <= pwStrength
                          ? (pwStrength <= 1 ? p.accent : pwStrength <= 2 ? p.blush : p.success)
                          : p.line,
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: p.inkMuted, fontWeight: 600, minWidth: 64, textAlign: 'right' }}>{STRENGTH_LABEL[pwStrength]}</div>
                </div>
              )}
            </label>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 8 }}>
              <button type="button" onClick={() => setAgree(v => !v)} aria-pressed={agree} aria-label="Agree to terms" style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0, padding: 0,
                background: agree ? p.ink : 'transparent',
                border: `1.5px solid ${agree ? p.ink : p.inkMuted}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.bg, marginTop: 1,
                cursor: 'pointer',
              }}>
                {agree && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}
              </button>
              <span onClick={e => { if (e.target.tagName !== 'A') setAgree(v => !v); }} style={{ fontSize: 12.5, color: p.inkSoft, lineHeight: 1.55, cursor: 'pointer', userSelect: 'none' }}>
                I agree to Glossi's <Link to="/terms" target="_blank" rel="noopener" style={{ color: p.ink, textDecoration: 'underline', fontWeight: 600 }}>Terms of Service</Link> and <Link to="/privacy" target="_blank" rel="noopener" style={{ color: p.ink, textDecoration: 'underline', fontWeight: 600 }}>Privacy Policy</Link>. Glossi may send appointment reminders and bid updates by email and SMS — you can opt out anytime in settings.
              </span>
            </div>

            <button type="submit" disabled={submitting} style={{
              marginTop: 10, padding: '16px 22px', borderRadius: 14,
              background: canSubmit ? p.ink : p.line, color: p.bg, border: 0,
              cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
              fontFamily: type.body, fontSize: 15, fontWeight: 600,
              opacity: submitting ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            }}>
              <span>{submitting ? 'Creating account…' : 'Create account'}</span>
              {!submitting && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>

            <SocialSignIn redirectTo={`/onboarding/${role}`} />
          </form>
        </div>

        {/* Editorial column (desktop only) */}
        {!isPhone && (
          <div style={{ position: 'relative', overflow: 'hidden', backgroundImage: `url(${PHOTOS[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,23,20,0.10) 0%, rgba(26,23,20,0.55) 70%, rgba(26,23,20,0.85) 100%)' }} />
            <div style={{ position: 'absolute', top: 32, left: 36, right: 36, color: p.bg, fontFamily: type.mono, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em' }}>
              ISSUE 04 · APR 2026
            </div>
            <div style={{ position: 'absolute', left: 36, right: 36, bottom: 40, color: p.bg }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 64, fontWeight: type.displayWeight, lineHeight: 0.95, letterSpacing: '-0.03em', textWrap: 'balance' }}>
                They bid.<br />You book.
              </div>
              <div style={{ marginTop: 18, padding: '14px 16px', background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: p.accent }}>WHAT YOU GET</div>
                <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    role === 'salon' ? '6–8% per booking · no monthly fee' : 'Bids in your inbox in 5–15 min',
                    role === 'salon' ? 'Stripe payouts within 2 days' : 'Save 20–40% off menu prices',
                    role === 'salon' ? 'Real chair-fillers, not "leads"' : 'Real slots, real prices, real people',
                  ].map(line => (
                    <li key={line} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: type.body, fontSize: 13.5, color: 'rgba(255,255,255,0.92)' }}>
                      <span style={{ width: 16, height: 16, borderRadius: 99, background: p.accent, color: p.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
