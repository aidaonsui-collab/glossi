import { useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNotifications, useLang } from '../store.jsx';
import { useT } from '../lib/i18n.js';

const ICONS = {
  bid: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  booking: 'M5 13l4 4L19 7',
  message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  cancel: 'M18 6L6 18M6 6l12 12',
  review: 'M12 2l3 7 7.5.5-5.5 5 1.5 7.5L12 18l-6.5 4 1.5-7.5-5.5-5L9 9z',
  promo: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01',
  refund: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
};

const ICON_COLORS = {
  bid: '#B8893E',
  booking: '#3D7A4E',
  message: '#B8893E',
  cancel: '#9A9088',
  review: '#B8893E',
  promo: '#E8B7A8',
  refund: '#3D7A4E',
};

function timeAgo(ts, lang) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (lang === 'es') {
    if (s < 60) return 'ahora';
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    if (s < 604800) return `${Math.floor(s / 86400)}d`;
    return new Date(ts).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  }
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// variant = 'dropdown' | 'page'
export default function NotificationsPanel({ variant = 'dropdown', onClose }) {
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const { items, unreadCount, markRead, markAllRead, clear } = useNotifications();

  const dropdown = variant === 'dropdown';
  const containerStyle = dropdown
    ? { width: 360, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, boxShadow: '0 18px 40px rgba(0,0,0,0.12)', padding: 6, zIndex: 50, maxHeight: 480, overflow: 'auto' }
    : { background: p.surface, borderRadius: 18, border: `0.5px solid ${p.line}`, overflow: 'hidden' };

  const onItemClick = n => {
    markRead(n.id);
    onClose?.();
    if (n.link) navigate(n.link);
  };

  return (
    <div style={containerStyle}>
      <div style={{
        padding: dropdown ? '10px 14px 8px' : '20px 22px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `0.5px solid ${p.line}`,
      }}>
        <div>
          <div style={{ fontSize: dropdown ? 10.5 : 11, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>{t('NOTIFICATIONS', 'NOTIFICACIONES')}</div>
          {!dropdown && <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 32, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em', marginTop: 4 }}>
            {unreadCount > 0
              ? (lang === 'es' ? `${unreadCount} ${unreadCount === 1 ? 'nueva' : 'nuevas'}` : `${unreadCount} new`)
              : t('All caught up.', 'Todo al día.')}
          </div>}
        </div>
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 6 }}>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ background: 'transparent', border: 0, fontSize: 11.5, color: p.accent, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px' }}>
                {t('Mark all read', 'Marcar todo como leído')}
              </button>
            )}
            {!dropdown && (
              <button onClick={clear} style={{ background: 'transparent', border: 0, fontSize: 11.5, color: p.inkMuted, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px' }}>
                {t('Clear all', 'Borrar todo')}
              </button>
            )}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ padding: dropdown ? 28 : 60, textAlign: 'center', color: p.inkMuted, fontSize: 13 }}>
          {t("You're all caught up.", 'Estás al día.')}
        </div>
      ) : (
        <div>
          {items.map((n, i) => {
            const iconPath = ICONS[n.type] || ICONS.booking;
            const iconColor = ICON_COLORS[n.type] || p.accent;
            return (
              <button key={n.id} onClick={() => onItemClick(n)} style={{
                display: 'flex', gap: 12, width: '100%',
                padding: dropdown ? '12px 12px' : '16px 22px',
                borderTop: i ? `0.5px solid ${p.line}` : 'none',
                background: !n.read ? p.bg : 'transparent',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink,
                border: 0, alignItems: 'flex-start',
                borderRadius: dropdown ? 8 : 0,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 99, background: iconColor + '1f', color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={n.type === 'review' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={iconPath} /></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                    <div style={{ fontSize: dropdown ? 13 : 14, fontWeight: 600, color: p.ink, lineHeight: 1.3 }}>{n.title}</div>
                    <div style={{ fontFamily: type.mono, fontSize: 10, color: p.inkMuted, flexShrink: 0 }}>{timeAgo(n.ts, lang)}</div>
                  </div>
                  {n.body && (
                    <div style={{ fontSize: dropdown ? 11.5 : 12.5, color: p.inkSoft, marginTop: 3, lineHeight: 1.45 }}>{n.body}</div>
                  )}
                </div>
                {!n.read && <span style={{ width: 7, height: 7, borderRadius: 99, background: p.accent, marginTop: 8, flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      )}

      {dropdown && items.length > 0 && (
        <div style={{ padding: '6px 4px 2px', borderTop: `0.5px solid ${p.line}`, marginTop: 4 }}>
          <button onClick={() => { onClose?.(); navigate('/notifications'); }} style={{
            width: '100%', padding: '10px', background: 'transparent', border: 0,
            fontSize: 12.5, color: p.accent, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>{t('See all notifications →', 'Ver todas las notificaciones →')}</button>
        </div>
      )}
    </div>
  );
}
