import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { markNotificationsRead, useNotifications, useUnreadNotifications } from '../lib/quotes.js';
import { useT } from '../lib/i18n.js';
import { useLang } from '../store.jsx';

const fmtAgo = (ts, lang) => {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (lang === 'es') {
    if (m < 1) return 'ya';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  }
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

// Bell + popover dropdown. Used by both CustomerLayout and SalonLayout.
// `tone` selects ring/icon color so the bell blends into either chrome.
export default function NotificationsBell({ tone = 'light' }) {
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const { count, refresh: refreshCount } = useUnreadNotifications();
  const { items, refresh: refreshList } = useNotifications(15);
  const ref = useRef(null);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onOpen = () => {
    setOpen(true);
    refreshList();
  };

  const onItem = async n => {
    setOpen(false);
    if (!n.read_at) {
      await markNotificationsRead([n.id]);
      refreshCount();
      refreshList();
    }
    if (n.link) navigate(n.link);
  };

  const onMarkAll = async () => {
    await markNotificationsRead();
    refreshCount();
    refreshList();
  };

  const ringColor = tone === 'dark' ? 'rgba(255,255,255,0.15)' : p.line;
  const iconColor = tone === 'dark' ? p.bg : p.ink;

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => (open ? setOpen(false) : onOpen())}
        aria-label={t('Notifications', 'Notificaciones')}
        style={{
          width: 36, height: 36, borderRadius: 99,
          background: 'transparent', border: `0.5px solid ${ringColor}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'inherit', position: 'relative',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.7">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {count > 0 && (
          <span style={{
            position: 'absolute', top: -3, right: -3,
            minWidth: 16, height: 16, padding: '0 4px', borderRadius: 99,
            background: p.accent, color: '#fff',
            fontFamily: type.mono, fontSize: 9.5, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
            border: tone === 'dark' ? `1.5px solid ${p.ink}` : `1.5px solid ${p.bg}`,
          }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 360, maxWidth: 'calc(100vw - 32px)', zIndex: 100,
          background: p.surface, color: p.ink,
          borderRadius: 14, border: `0.5px solid ${p.line}`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
          maxHeight: 'min(75vh, 540px)', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{t('NOTIFICATIONS', 'NOTIFICACIONES')}</div>
            {count > 0 && (
              <button onClick={onMarkAll} style={{
                background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, color: p.accent,
              }}>{t('Mark all read', 'Marcar todo leído')}</button>
            )}
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {items.length === 0 ? (
              <div style={{ padding: 28, textAlign: 'center', color: p.inkMuted, fontSize: 13 }}>
                {t('No notifications yet.', 'Aún no hay notificaciones.')}
              </div>
            ) : items.map((n, i) => {
              const unread = !n.read_at;
              return (
                <button
                  key={n.id}
                  onClick={() => onItem(n)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '12px 16px',
                    borderTop: i ? `0.5px solid ${p.line}` : 'none',
                    background: unread ? p.accent + '0e' : 'transparent',
                    border: 'none', borderBottom: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', color: p.ink,
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: 99, marginTop: 6, flexShrink: 0,
                    background: unread ? p.accent : 'transparent',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: unread ? 600 : 500, color: p.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                      <div style={{ fontFamily: type.mono, fontSize: 10.5, color: p.inkMuted, flexShrink: 0 }}>{fmtAgo(n.created_at, lang)}</div>
                    </div>
                    {n.body && (
                      <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 3, lineHeight: 1.45, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {n.body}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ padding: '10px 16px', borderTop: `0.5px solid ${p.line}` }}>
            <button onClick={() => { setOpen(false); navigate('/notifications'); }} style={{
              background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: p.inkMuted,
            }}>{t('See all →', 'Ver todas →')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
