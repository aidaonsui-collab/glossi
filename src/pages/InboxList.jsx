import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { INBOX_LIST } from '../ios/details.js';

export default function InboxList() {
  const isPhone = useNarrow();
  const navigate = useNavigate();

  return (
    <CustomerLayout active="inbox" mobileTitle="Inbox">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px', maxWidth: 760 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>INBOX</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 24px' }}>Conversations.</h1>

        <div style={{ display: 'flex', flexDirection: 'column', background: p.surface, borderRadius: 18, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
          {INBOX_LIST.map((m, i) => (
            <button key={m.id} onClick={() => navigate(`/inbox/${m.id}`)} style={{
              display: 'flex', gap: 14, padding: '16px 20px',
              borderTop: i ? `0.5px solid ${p.line}` : 'none',
              background: 'transparent', border: 0, cursor: 'pointer',
              width: '100%', textAlign: 'left', fontFamily: 'inherit',
              color: p.ink, alignItems: 'center',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, flexShrink: 0, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 14, fontWeight: 700 }}>
                {m.salon.split(' ').map(s => s[0]).slice(0, 2).join('')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontFamily: type.display, fontSize: 17, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{m.salon}</div>
                  <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted }}>{m.t}</div>
                </div>
                <div style={{ fontFamily: type.body, fontSize: 13, color: m.unread ? p.ink : p.inkSoft, fontWeight: m.unread ? 500 : 400, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.last_en}</div>
              </div>
              {m.unread && <span style={{ width: 8, height: 8, borderRadius: 99, background: p.accent, flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
