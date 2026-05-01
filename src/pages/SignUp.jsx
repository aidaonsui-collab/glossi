import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useAuth } from '../store.jsx';
import { useToast } from '../components/Toast.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const OAUTH_PROVIDER = { apple: 'apple', google: 'google', fb: 'facebook' };

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
  const { signUp } = useAuth();
  const [params] = useSearchParams();

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
    const result = await signUp({ name: name.trim(), email, password, role });
    setSubmitting(false);
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
        <Link to="/" style={{ fontFamily: type.body, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: p.ink, textDecoration: 'none' }}>GLOSSI</Link>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0', fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>
              <span style={{ flex: 1, height: 0.5, background: p.line }} />
              <span>OR</span>
              <span style={{ flex: 1, height: 0.5, background: p.line }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { id: 'apple', l: 'Apple', svg: <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor" /> },
                { id: 'google', l: 'Google', svg: <><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></> },
                { id: 'fb', l: 'Facebook', svg: <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" fill="#1877F2" /> },
              ].map(s => (
                <button key={s.id} type="button" onClick={async () => {
                  if (!isSupabaseConfigured) {
                    toast(`Single sign-on with ${s.l} requires a connected provider. Use email to continue.`, { tone: 'warn' });
                    return;
                  }
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: OAUTH_PROVIDER[s.id],
                    options: { redirectTo: `${window.location.origin}/onboarding/${role}` },
                  });
                  if (error) {
                    if (/provider is not enabled|Unsupported provider/i.test(error.message)) {
                      toast(`${s.l} sign-in isn't enabled yet. Ask the Glossi team to turn it on.`, { tone: 'warn' });
                    } else {
                      toast(error.message, { tone: 'warn' });
                    }
                  }
                }} style={{
                  padding: '12px 14px', borderRadius: 12,
                  border: `0.5px solid ${p.line}`, background: p.surface, cursor: 'pointer',
                  fontFamily: type.body, fontSize: 13, fontWeight: 600, color: p.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24">{s.svg}</svg>
                  <span>{s.l}</span>
                </button>
              ))}
            </div>
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
                Beauty,<br />negotiated.
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
