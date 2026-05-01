import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from './Toast.jsx';
import { useAuth } from '../store.jsx';
import SignInModal from './SignInModal.jsx';

const NAV = [
  { id: 'inbox', l: 'Inbox', badge: 4, to: '/salon/inbox' },
  { id: 'bids', l: 'My bids', to: '/salon/bids' },
  { id: 'calendar', l: 'Calendar', to: '/salon/calendar' },
  { id: 'clients', l: 'Clients', to: '/salon/clients' },
  { id: 'earnings', l: 'Earnings', to: '/salon/earnings' },
  { id: 'settings', l: 'Settings', to: '/salon/settings' },
];

export default function SalonLayout({ active, children, mobileTitle }) {
  const isPhone = useNarrow();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const resolved = active || NAV.find(n => location.pathname === n.to)?.id;

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
      <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', padding: '4px 12px 4px', color: p.accent, textDecoration: 'none' }}>glossi</Link>
      <div style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.18em', padding: '0 12px 14px' }}>FOR SALONS</div>
      {NAV.map(it => {
        const isActive = it.id === resolved;
        return (
          <Link key={it.id} to={it.to} style={{
            padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
            background: isActive ? p.bg : 'transparent', color: p.ink, fontSize: 13.5, fontWeight: isActive ? 600 : 500,
            border: isActive ? `0.5px solid ${p.line}` : '0.5px solid transparent', textDecoration: 'none', fontFamily: 'inherit',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: isActive ? p.accent : p.inkMuted }} />
            <span style={{ flex: 1 }}>{it.l}</span>
            {it.badge && <span style={{ fontFamily: type.mono, fontSize: 10, color: p.bg, background: p.accent, padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{it.badge}</span>}
          </Link>
        );
      })}
      <div style={{ flex: 1 }} />
      {user ? (
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(v => !v)} style={{ padding: '14px 12px', borderRadius: 12, background: p.bg, border: `0.5px solid ${p.line}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, background: user.type === 'salon' ? user.avatar : 'linear-gradient(135deg,#C28A6B,#8B4F3A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>{user.type === 'salon' ? user.initials : 'MR'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.type === 'salon' ? user.name : 'Casa de Belleza'}</div>
                <div style={{ fontSize: 10.5, color: p.inkMuted }}>{user.type === 'salon' ? user.city : 'Pharr · 4.9★'}</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.inkMuted} strokeWidth="2" style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .12s' }}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, right: 0, background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}`, padding: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.10)', zIndex: 10 }}>
              <button onClick={() => { setMenuOpen(false); navigate('/salon/settings'); }} style={salonMenuItem}>Salon profile</button>
              <button onClick={onSignOut} style={{ ...salonMenuItem, color: p.accent }}>Sign out</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => setSignInOpen(true)} style={{ padding: '12px 14px', borderRadius: 12, background: p.ink, color: p.bg, border: 0, cursor: 'pointer', fontFamily: type.body, fontSize: 13.5, fontWeight: 600 }}>Sign in</button>
      )}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} defaultRole="salon" />
    </div>
  );

  if (isPhone) {
    return (
      <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 5 }}>
          <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
          <span style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.18em' }}>FOR SALONS</span>
          {mobileTitle && <span style={{ fontSize: 12, color: p.inkMuted, marginLeft: 4 }}>· {mobileTitle}</span>}
          <div style={{ flex: 1 }} />
          {user ? (
            <button onClick={() => setMenuOpen(v => !v)} style={{ width: 34, height: 34, borderRadius: 99, background: user.type === 'salon' ? user.avatar : 'linear-gradient(135deg,#C28A6B,#8B4F3A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>{user.type === 'salon' ? user.initials : 'MR'}</button>
          ) : (
            <button onClick={() => setSignInOpen(true)} style={{ padding: '7px 14px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>Sign in</button>
          )}
        </div>
        {user && menuOpen && (
          <div style={{ position: 'fixed', top: 60, right: 14, width: 200, background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}`, padding: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.10)', zIndex: 50 }}>
            <button onClick={() => { setMenuOpen(false); navigate('/salon/settings'); }} style={salonMenuItem}>Salon profile</button>
            <button onClick={onSignOut} style={{ ...salonMenuItem, color: p.accent }}>Sign out</button>
          </div>
        )}
        <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} defaultRole="salon" />
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
                <span style={{ width: 6, height: 6, borderRadius: 99, background: isActive ? p.accent : p.inkMuted, marginTop: 8 }} />
                <div style={{ fontSize: 9.5, fontWeight: isActive ? 600 : 500 }}>{it.l}</div>
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

const salonMenuItem = {
  display: 'block', width: '100%', textAlign: 'left',
  padding: '10px 12px', borderRadius: 8,
  background: 'transparent', border: 0, cursor: 'pointer',
  fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: '#1A1714',
};
