import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useAuth } from '../store.jsx';
import { useNotifications, markNotificationsRead, useUnreadNotifications } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const fmtAgo = ts => {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const KIND_DOT = (palette, kind) => ({
  bid_received:                palette.accent,
  counter_received:            palette.accent,
  counter_accepted:            palette.success,
  booking_paid:                palette.success,
  booking_confirmed:           palette.success,
  booking_completed:           palette.accent,
  booking_cancelled_by_customer: '#C7402F',
  booking_cancelled_by_salon:    '#C7402F',
  booking_no_show:             palette.inkMuted,
  review_received:             palette.accent,
}[kind] || palette.inkMuted);

export default function NotificationsPage() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, loading, refresh } = useNotifications(50);
  const { refresh: refreshCount } = useUnreadNotifications();

  // Mark all as read on mount so the bell badge clears.
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    markNotificationsRead().then(() => { refreshCount(); refresh(); });
  }, [user]);

  const onItem = n => { if (n.link) navigate(n.link); };

  return (
    <CustomerLayout mobileTitle="Notifications">
      <div style={{ padding: isPhone ? '20px 18px 60px' : '34px 40px 60px', maxWidth: 720 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>NOTIFICATIONS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>What's new.</h1>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!isSupabaseConfigured ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5 }}>
              Supabase isn't configured — notifications need a backend.
            </div>
          ) : !user ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5 }}>
              Sign in to see your notifications.
            </div>
          ) : loading && items.length === 0 ? (
            <div style={{ padding: 22, color: p.inkMuted, fontSize: 13.5 }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
              Nothing yet. Bids, bookings, completions and reviews show up here as they happen.
            </div>
          ) : items.map(n => (
            <button key={n.id} onClick={() => onItem(n)} style={{
              padding: '14px 18px', background: p.surface, borderRadius: 14,
              border: `0.5px solid ${p.line}`,
              cursor: n.link ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'inherit', color: p.ink,
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, marginTop: 6, flexShrink: 0, background: KIND_DOT(p, n.kind) }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.ink, flex: 1 }}>{n.title}</div>
                  <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, flexShrink: 0 }}>{fmtAgo(n.created_at)}</div>
                </div>
                {n.body && (
                  <div style={{ fontSize: 12.5, color: p.inkSoft, marginTop: 4, lineHeight: 1.5 }}>
                    {n.body}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
