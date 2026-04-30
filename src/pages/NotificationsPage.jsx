import CustomerLayout from '../components/CustomerLayout.jsx';
import NotificationsPanel from '../components/NotificationsPanel.jsx';
import { defaultPalette as p } from '../theme.js';
import { useNarrow } from '../hooks.js';

export default function NotificationsPage() {
  const isPhone = useNarrow();
  return (
    <CustomerLayout mobileTitle="Notifications">
      <div style={{ padding: isPhone ? '20px 18px 32px' : '34px 40px 60px', maxWidth: 720 }}>
        <NotificationsPanel variant="page" />
      </div>
    </CustomerLayout>
  );
}
