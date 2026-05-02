import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Modal from './Modal.jsx';
import { useAuth } from '../store.jsx';
import { useToast } from './Toast.jsx';
import { isSupabaseConfigured } from '../lib/supabase.js';
import SocialSignIn from './SocialSignIn.jsx';
import { useT } from '../lib/i18n.js';

export default function SignInModal({ open, onClose, defaultRole = 'customer' }) {
  const { signInWithEmail, user } = useAuth();
  const t = useT();

  // If user is already signed in when modal opens, close it.
  useEffect(() => {
    if (open && user) onClose?.();
  }, [open, user, onClose]);
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState(isSupabaseConfigured ? '' : 'sofia@example.com');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim()) { toast(t('Email required.', 'Correo requerido.'), { tone: 'warn' }); return; }
    if (isSupabaseConfigured && !password) { toast(t('Password required.', 'Contraseña requerida.'), { tone: 'warn' }); return; }
    setBusy(true);
    // Hard 15s ceiling so the spinner can never get truly stuck even if the
    // network or Supabase hangs. The actual sign-in continues in the background;
    // we just stop blocking the UI.
    const watchdog = setTimeout(() => {
      setBusy(false);
      toast(t('Sign-in is taking too long. Check your connection or try again.', 'El inicio de sesión está tardando demasiado. Revisa tu conexión o intenta de nuevo.'), { tone: 'warn' });
    }, 15000);
    try {
      const result = await signInWithEmail(email.trim(), password, role);
      if (!result?.ok) { toast(result?.error || t('Sign in failed.', 'Falló el inicio de sesión.'), { tone: 'warn' }); return; }
      toast(t('Signed in.', 'Sesión iniciada.'), { tone: 'success' });
      onClose?.();
    } catch (err) {
      console.error('signIn error', err);
      toast(err?.message || t('Sign in failed unexpectedly.', 'El inicio de sesión falló inesperadamente.'), { tone: 'warn' });
    } finally {
      clearTimeout(watchdog);
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} eyebrow={t('WELCOME BACK', 'BIENVENIDA DE NUEVO')} title={t('Sign in to Glossi', 'Inicia sesión en Glossi')} footer={
      <button onClick={submit} disabled={busy} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1, fontFamily: 'inherit' }}>
        {busy ? t('Signing in…', 'Iniciando sesión…') : t('Sign in →', 'Iniciar sesión →')}
      </button>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t("I'M SIGNING IN AS", 'INICIO SESIÓN COMO')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { id: 'customer', l: t('Customer', 'Cliente'), sub: t('Book salons', 'Reserva salones') },
              { id: 'salon', l: t('Salon', 'Salón'), sub: t('Send bids', 'Envía ofertas') },
            ].map(r => {
              const a = role === r.id;
              return (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  padding: '14px 14px', borderRadius: 12,
                  background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                  border: `0.5px solid ${a ? p.ink : p.line}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}>
                  <div style={{ fontFamily: type.body, fontSize: 14, fontWeight: 600 }}>{r.l}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{r.sub}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t('EMAIL', 'CORREO')}</div>
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            type="email" autoFocus autoComplete="email"
            style={{ width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }}
          />
        </div>
        {isSupabaseConfigured && (
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t('PASSWORD', 'CONTRASEÑA')}</div>
            <input
              value={password} onChange={e => setPassword(e.target.value)}
              type="password" autoComplete="current-password"
              onKeyDown={e => { if (e.key === 'Enter') submit(); }}
              style={{ width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }}
            />
          </div>
        )}
        {!isSupabaseConfigured && (
          <div style={{ fontSize: 11.5, color: p.inkMuted, lineHeight: 1.5 }}>
            {t('Demo · click "Sign in" with any email. Your booking history and saved salons are stored locally on this device.', 'Demo · haz clic en "Iniciar sesión" con cualquier correo. Tu historial de reservas y salones guardados se guardan localmente en este dispositivo.')}
          </div>
        )}
        <SocialSignIn redirectTo={role === 'salon' ? '/salon' : '/quotes'} compact />
        <div style={{ marginTop: 4, paddingTop: 12, borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 12.5, color: p.inkSoft }}>{t("Don't have an account?", '¿No tienes cuenta?')}</span>
          <button onClick={() => { onClose?.(); navigate(`/signup${role === 'salon' ? '?role=salon' : ''}`); }} style={{ background: 'transparent', border: 0, fontSize: 13, color: p.accent, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
            {t('Create one →', 'Crea una →')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
