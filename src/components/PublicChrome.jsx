import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useLang } from '../store.jsx';
import { useT } from '../lib/i18n.js';
import SignInModal from './SignInModal.jsx';

// Top-nav + footer chrome for public-facing pages (editorial, articles)
// when the visitor is not signed in. Mirrors Marketing.jsx's nav so the
// brand voice carries from the homepage into editorial reads, without
// dropping the visitor into a customer-dashboard sidebar they haven't
// opted into. Signed-in visitors still get CustomerLayout — this is the
// logged-out alternative.
export default function PublicChrome({ children }) {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const { lang, toggle: toggleLang } = useLang();
  const t = useT();
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 64px', gap: 14, borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 5 }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <div style={{ flex: 1 }} />
        {!isPhone && (
          <div style={{ display: 'flex', gap: 24 }}>
            <Link to="/editorial" style={navBtn}>{t('Editorial', 'Editorial')}</Link>
            <Link to="/ios" style={navBtn}>{t('iOS preview', 'Vista previa iOS')}</Link>
          </div>
        )}
        <button onClick={() => setSignInOpen(true)} style={{ background: 'transparent', border: 0, padding: '8px 12px', fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Log in / Sign up', 'Inicia sesión / Regístrate')}</button>
        <button onClick={() => navigate('/signup?role=salon')} style={{ background: p.accent, color: p.ink, border: 0, padding: isPhone ? '8px 14px' : '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{isPhone ? t('List business', 'Mi negocio') : t('List your business', 'Lista tu negocio')}</button>
      </div>

      <div style={{ flex: 1 }}>{children}</div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />

      <div style={{ padding: isPhone ? '24px 18px' : '40px 64px', borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: p.inkMuted }}>GLOSSI · 2026</div>
        <div style={{ fontSize: 11.5, color: p.inkMuted, display: 'flex', gap: 18, alignItems: 'center' }}>
          <button onClick={() => toggleLang()} aria-label="Toggle language" style={{ ...footerBtn, display: 'inline-flex', gap: 4 }}>
            <span style={{ color: lang === 'en' ? p.ink : p.inkMuted, fontWeight: lang === 'en' ? 700 : 500 }}>EN</span>
            <span>·</span>
            <span style={{ color: lang === 'es' ? p.ink : p.inkMuted, fontWeight: lang === 'es' ? 700 : 500 }}>ES</span>
          </button>
          <Link to="/privacy" style={{ ...footerBtn, textDecoration: 'none' }}>{t('Privacy', 'Privacidad')}</Link>
          <Link to="/terms" style={{ ...footerBtn, textDecoration: 'none' }}>{t('Terms', 'Términos')}</Link>
          <Link to="/help" style={{ ...footerBtn, textDecoration: 'none' }}>{t('Help', 'Ayuda')}</Link>
        </div>
      </div>
    </div>
  );
}

const navBtn = { background: 'transparent', border: 0, fontSize: 13, color: '#5C544B', fontWeight: 500, textDecoration: 'none', cursor: 'pointer', fontFamily: 'inherit' };
const footerBtn = { background: 'transparent', border: 0, fontSize: 11.5, color: '#9A9088', cursor: 'pointer', padding: 0, fontFamily: 'inherit' };
