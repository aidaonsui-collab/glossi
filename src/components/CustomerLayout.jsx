import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from './Toast.jsx';
import { useAuth } from '../store.jsx';
import { useT } from '../lib/i18n.js';
import SignInModal from './SignInModal.jsx';
import NotificationsBell from './NotificationsBell.jsx';

// Sidebar nav. Badges removed — they were hardcoded fake counts that
// claimed activity that didn't exist. When we add unread tracking
// (Phase 7 / messaging) these can come back wired to real data.
const NAV = [
  { id: 'home', en: 'Home', es: 'Inicio', i: 'M3 11l9-8 9 8M5 10v10h14V10', to: '/quotes' },
  { id: 'explore', en: 'Explore', es: 'Explorar', i: 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', to: '/explore' },
  { id: 'quotes', en: 'My quotes', es: 'Mis solicitudes', i: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', to: '/quotes' },
  { id: 'bookings', en: 'Bookings', es: 'Reservas', i: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18', to: '/bookings' },
  { id: 'inbox', en: 'Inbox', es: 'Mensajes', i: 'M4 4h16v16H4zM4 4l8 8 8-8', to: '/inbox' },
  { id: 'saved', en: 'Saved', es: 'Guardados', i: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z', to: '/saved' },
  { id: 'editorial', en: 'Editorial', es: 'Editorial', i: 'M4 4h16v4H4zM4 12h10v8H4zM18 12h2v8h-2z', to: '/editorial' },
];

export default function CustomerLayout({ active, children, mobileTitle }) {
  const isPhone = useNarrow();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const t = useT();
  const [signInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Resolve active id from prop or path
  const resolved = active || NAV.find(n => location.pathname === n.to)?.id || (location.pathname === '/quotes' ? 'quotes' : null);

  const onSignOut = () => {
    signOut();
    setMenuOpen(false);
    toast('Signed out.');
    navigate('/');
  };

  const sidebar = (
    <div style={{
      width: 240, padding: '24px 18px', borderRight: `0.5px solid ${p.line}`, background: p.surface,
      display: 'flex', flexDirection: 'column', gap: 6, minHeight: '100vh', position: 'sticky', top: 0, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px 18px' }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        {user && <NotificationsBell tone="light" />}
      </div>
      {NAV.map(it => {
        const isActive = it.id === resolved;
        return (
          <Link key={it.id} to={it.to} style={{
            padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
            background: isActive ? p.bg : 'transparent', color: p.ink, fontSize: 13.5, fontWeight: isActive ? 600 : 500,
            border: isActive ? `0.5px solid ${p.line}` : '0.5px solid transparent', textDecoration: 'none', fontFamily: 'inherit',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={it.i} /></svg>
            <span style={{ flex: 1 }}>{t(it.en, it.es)}</span>
            {it.badge && <span style={{ fontFamily: type.mono, fontSize: 10, color: p.accent, background: p.accentSoft, padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{it.badge}</span>}
          </Link>
        );
      })}
      <div style={{ flex: 1 }} />
      {user ? (
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(v => !v)} style={{ padding: '14px 12px', borderRadius: 12, background: p.bg, border: `0.5px solid ${p.line}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, background: user.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>{user.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div style={{ fontSize: 10.5, color: p.inkMuted }}>{user.city}</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.inkMuted} strokeWidth="2" style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .12s' }}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, right: 0, background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}`, padding: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.10)', zIndex: 10 }}>
              <button onClick={() => { setMenuOpen(false); navigate('/me'); }} style={menuItem}>{t('View profile', 'Ver perfil')}</button>
              <button onClick={() => { setMenuOpen(false); navigate('/bookings'); }} style={menuItem}>{t('Bookings', 'Reservas')}</button>
              <button onClick={() => { setMenuOpen(false); navigate('/settings'); }} style={menuItem}>{t('Profile settings', 'Configuración del perfil')}</button>
              <button onClick={onSignOut} style={{ ...menuItem, color: p.accent }}>{t('Sign out', 'Cerrar sesión')}</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => setSignInOpen(true)} style={{ padding: '12px 14px', borderRadius: 12, background: p.ink, color: p.bg, border: 0, cursor: 'pointer', fontFamily: type.body, fontSize: 13.5, fontWeight: 600 }}>{t('Sign in', 'Iniciar sesión')}</button>
      )}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} defaultRole="customer" />
    </div>
  );

  if (isPhone) {
    return (
      <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 5 }}>
          <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
          {mobileTitle && <span style={{ fontSize: 12, color: p.inkMuted, marginLeft: 8 }}>· {mobileTitle}</span>}
          <div style={{ flex: 1 }} />
          {user && <NotificationsBell tone="light" />}
          {user ? (
            <button onClick={() => setMenuOpen(v => !v)} style={{ width: 34, height: 34, borderRadius: 99, background: user.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, border: 0, cursor: 'pointer', fontFamily: 'inherit', marginLeft: 8 }}>{user.initials}</button>
          ) : (
            <button onClick={() => setSignInOpen(true)} style={{ padding: '7px 14px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>{t('Sign in', 'Iniciar sesión')}</button>
          )}
        </div>
        {user && menuOpen && (
          <div style={{ position: 'fixed', top: 60, right: 14, width: 200, background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}`, padding: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.10)', zIndex: 50 }}>
            <button onClick={() => { setMenuOpen(false); navigate('/me'); }} style={menuItem}>View profile</button>
            <button onClick={() => { setMenuOpen(false); navigate('/bookings'); }} style={menuItem}>Bookings</button>
            <button onClick={() => { setMenuOpen(false); navigate('/settings'); }} style={menuItem}>Profile settings</button>
            <button onClick={onSignOut} style={{ ...menuItem, color: p.accent }}>Sign out</button>
          </div>
        )}
        <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} defaultRole="customer" />
        <div style={{ flex: 1 }}>{children}</div>
        <div style={{
          position: 'sticky', bottom: 0, background: p.surface,
          borderTop: `0.5px solid ${p.line}`, padding: '8px 4px 14px',
          display: 'flex', justifyContent: 'space-around', zIndex: 5,
        }}>
          {NAV.slice(0, 5).map(it => {
            const isActive = it.id === resolved;
            return (
              <Link key={it.id} to={it.to} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 6px',
                color: isActive ? p.ink : p.inkMuted, textDecoration: 'none', fontFamily: 'inherit',
                flex: 1, position: 'relative',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round"><path d={it.i} /></svg>
                <div style={{ fontSize: 9.5, fontWeight: isActive ? 600 : 500 }}>{t(it.en, it.es)}</div>
                {it.badge && <span style={{ position: 'absolute', top: 0, right: '30%', width: 6, height: 6, borderRadius: 99, background: p.accent }} />}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', alignItems: 'flex-start' }}>
      {sidebar}
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

const menuItem = {
  display: 'block', width: '100%', textAlign: 'left',
  padding: '10px 12px', borderRadius: 8,
  background: 'transparent', border: 0, cursor: 'pointer',
  fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: '#1A1714',
};
