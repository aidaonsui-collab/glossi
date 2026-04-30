import { useNavigate, useParams } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Conversation from '../components/Conversation.jsx';
import { THREADS } from '../ios/details.js';

export default function ConversationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!THREADS[id]) {
    return (
      <CustomerLayout active="inbox" mobileTitle="Conversation">
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36 }}>Conversation not found</h1>
          <button onClick={() => navigate('/inbox')} style={{ marginTop: 24, padding: '12px 22px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, fontSize: 14, cursor: 'pointer' }}>Back to inbox</button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout active="inbox" mobileTitle="Conversation">
      <div style={{ maxWidth: 760, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Conversation
          p={p} type={type} lang="en" surface="web" threadId={id}
          onBack={() => navigate('/inbox')}
          onOpenProfile={salonId => navigate(`/salon/${salonId}`)}
        />
      </div>
    </CustomerLayout>
  );
}
