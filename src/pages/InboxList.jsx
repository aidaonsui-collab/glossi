import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';

export default function InboxList() {
  const isPhone = useNarrow();

  return (
    <CustomerLayout active="inbox" mobileTitle="Inbox">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px', maxWidth: 760 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>INBOX</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 24px' }}>Conversations.</h1>

        <div style={{ padding: 28, background: p.surface, borderRadius: 16, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 14, lineHeight: 1.6 }}>
          Direct messaging is coming soon. Until then, salons reach you through your bid acceptance — your contact details unlock for them once you accept their bid, and they can text or email you to confirm a time.
        </div>
      </div>
    </CustomerLayout>
  );
}
