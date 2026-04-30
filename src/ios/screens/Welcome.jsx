import { useState } from 'react';
import SalonPhoto from '../../components/SalonPhoto.jsx';
import { IOSStatusBar } from '../IOSFrame.jsx';

function ProgressDots({ step, total, p }) {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          width: i === step ? 20 : 6, height: 6, borderRadius: 99,
          background: i <= step ? p.ink : p.line, transition: 'all 0.2s ease',
        }} />
      ))}
    </div>
  );
}

function SocialIcon({ kind }) {
  if (kind === 'apple') return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>;
  if (kind === 'google') return <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg>;
}

export default function Welcome({ p, type, lang, onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('sofia@example.com');
  const [code, setCode] = useState('');

  // Step 0: brand splash with photo + intent picker
  if (step === 0) {
    return (
      <div style={{ background: p.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <IOSStatusBar dark />
        <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
          <SalonPhoto mood={1} h={380} style={{ position: 'absolute', inset: 0, width: '100%', borderRadius: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${p.bg}55 0%, ${p.bg}cc 70%, ${p.bg} 100%)` }} />
          <div style={{ position: 'absolute', top: 64, left: 20, fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.ink }}>GLOSSI</div>
        </div>
        <div style={{ padding: '0 22px 28px', flex: 1, display: 'flex', flexDirection: 'column', marginTop: -100, position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: type.display, fontSize: 46, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.03em', fontStyle: 'italic', lineHeight: 0.95 }}>
            {lang === 'en' ? <>Beauty,<br />on your terms.</> : <>Belleza,<br />a tu manera.</>}
          </div>
          <div style={{ fontFamily: type.body, fontSize: 14, color: p.inkSoft, lineHeight: 1.5, marginTop: 16, maxWidth: 340 }}>
            {lang === 'en' ? 'Post what you want, name your price. Local salons compete for your booking — the best offer wins.' : 'Pide lo que quieras, pon tu precio. Salones locales compiten por tu cita — la mejor gana.'}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => setStep(1)} style={primaryBtn(p, type)}>
              {lang === 'en' ? "I'm booking — Get started" : 'Quiero reservar'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => setStep(1)} style={secondaryBtn(p, type)}>
              {lang === 'en' ? 'I run a salon — Join Glossi' : 'Tengo un salón — Únete'}
            </button>
            <button onClick={onSkip} style={{ border: 0, background: 'transparent', cursor: 'pointer', fontFamily: type.body, fontSize: 12.5, color: p.inkMuted, fontWeight: 500, marginTop: 6, padding: '8px' }}>
              {lang === 'en' ? 'Already have an account? Sign in' : '¿Ya tienes cuenta?'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: email
  if (step === 1) {
    return (
      <div style={{ background: p.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <IOSStatusBar />
        <div style={{ padding: '54px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setStep(0)} style={backBtn(p)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <ProgressDots step={0} total={3} p={p} />
          <div style={{ width: 36 }} />
        </div>
        <div style={{ padding: '30px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.16em' }}>{lang === 'en' ? '01 · GET STARTED' : '01 · EMPEZAR'}</div>
          <div style={{ fontFamily: type.display, fontSize: 34, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.025em', fontStyle: 'italic', lineHeight: 1, marginTop: 8 }}>
            {lang === 'en' ? 'Get started' : 'Empezar'}
          </div>
          <div style={{ fontFamily: type.body, fontSize: 14, color: p.inkSoft, lineHeight: 1.5, marginTop: 10 }}>
            {lang === 'en' ? 'Create an account or log in to book and manage appointments.' : 'Crea cuenta para reservar y gestionar citas.'}
          </div>
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 10, border: `0.5px solid ${p.line}`, background: p.surface, borderRadius: 14, padding: '14px 16px' }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder={lang === 'en' ? 'Email' : 'Correo'} autoFocus style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: type.body, fontSize: 15, color: p.ink, fontWeight: 500 }} />
          </div>
          <div style={{ flex: 1 }} />
          <button disabled={!email} onClick={() => setStep(2)} style={{ ...primaryBtn(p, type), opacity: email ? 1 : 0.5, cursor: email ? 'pointer' : 'not-allowed' }}>
            {lang === 'en' ? 'Continue' : 'Continuar'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 14px', fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>
            <span style={{ flex: 1, height: 0.5, background: p.line }} />
            <span>{lang === 'en' ? 'OR' : 'O'}</span>
            <span style={{ flex: 1, height: 0.5, background: p.line }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[{ l: lang === 'en' ? 'Continue with Apple' : 'Continuar con Apple', i: 'apple' }, { l: lang === 'en' ? 'Continue with Google' : 'Continuar con Google', i: 'google' }, { l: lang === 'en' ? 'Continue with Facebook' : 'Continuar con Facebook', i: 'fb' }].map(b => (
              <button key={b.i} onClick={() => setStep(2)} style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: `0.5px solid ${p.line}`, background: p.surface, cursor: 'pointer', fontFamily: type.body, fontSize: 13.5, fontWeight: 600, color: p.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <SocialIcon kind={b.i} /><span>{b.l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: 4-digit code
  if (step === 2) {
    const filled = code.length;
    return (
      <div style={{ background: p.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <IOSStatusBar />
        <div style={{ padding: '54px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setStep(1)} style={backBtn(p)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <ProgressDots step={1} total={3} p={p} />
          <div style={{ width: 36 }} />
        </div>
        <div style={{ padding: '30px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.16em' }}>{lang === 'en' ? '02 · VERIFY' : '02 · VERIFICAR'}</div>
          <div style={{ fontFamily: type.display, fontSize: 34, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.025em', fontStyle: 'italic', lineHeight: 1, marginTop: 8 }}>
            {lang === 'en' ? 'Check your email' : 'Revisa tu correo'}
          </div>
          <div style={{ fontFamily: type.body, fontSize: 14, color: p.inkSoft, lineHeight: 1.5, marginTop: 10 }}>
            {lang === 'en' ? `We sent a 4-digit code to ${email}.` : `Mandamos un código de 4 dígitos a ${email}.`}
          </div>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, justifyContent: 'center' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: 56, height: 64, borderRadius: 14, border: `0.5px solid ${i === filled ? p.ink : p.line}`,
                background: p.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: type.mono, fontSize: 28, fontWeight: 600, color: p.ink,
              }}>{code[i] || ''}</div>
            ))}
          </div>
          <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoFocus
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }} />
          <div style={{ marginTop: 14, textAlign: 'center', fontFamily: type.body, fontSize: 12, color: p.inkMuted }}>
            {lang === 'en' ? 'Tap the boxes to enter your code' : 'Toca los recuadros para ingresar'}
          </div>
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <button onClick={() => setCode('1234')} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontFamily: type.body, fontSize: 12, color: p.accent, fontWeight: 600 }}>
              {lang === 'en' ? 'Demo: fill 1234' : 'Demo: rellenar 1234'}
            </button>
          </div>
          <div style={{ flex: 1 }} />
          <button disabled={code.length < 4} onClick={onComplete} style={{ ...primaryBtn(p, type), opacity: code.length >= 4 ? 1 : 0.5, cursor: code.length >= 4 ? 'pointer' : 'not-allowed' }}>
            {lang === 'en' ? 'Verify & continue' : 'Verificar'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const primaryBtn = (p, type) => ({
  width: '100%', padding: '15px 18px', borderRadius: 14, border: 0,
  background: p.ink, color: p.bg, fontFamily: type.body, fontSize: 14, fontWeight: 600,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
});
const secondaryBtn = (p, type) => ({
  width: '100%', padding: '15px 18px', borderRadius: 14, border: `0.5px solid ${p.line}`,
  background: p.surface, color: p.ink, fontFamily: type.body, fontSize: 14, fontWeight: 600,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
});
const backBtn = p => ({
  border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999,
  background: p.surface, boxShadow: `inset 0 0 0 0.5px ${p.line}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
});
