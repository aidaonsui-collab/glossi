import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { BIDS } from '../ios/data.js';
import SalonProfile from '../components/SalonProfile.jsx';
import Offer from '../ios/screens/Offer.jsx';
import { useToast } from '../components/Toast.jsx';

export default function SalonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const bid = BIDS.find(b => b.id === id);
  const [offerOpen, setOfferOpen] = useState(false);

  if (!bid) {
    return (
      <CustomerLayout mobileTitle="Salon">
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36 }}>Salon not found</h1>
          <button onClick={() => navigate('/quotes')} style={{ marginTop: 24, padding: '12px 22px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, fontSize: 14, cursor: 'pointer' }}>Back to quotes</button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout mobileTitle={bid.name}>
      <div style={{ position: 'relative', maxWidth: 760 }}>
        <SalonProfile
          p={p} type={type} lang="en" surface="web" bid={bid}
          onBack={() => navigate(-1)}
          onMessage={b => navigate(`/inbox/${b.id}`)}
          onMakeOffer={() => setOfferOpen(true)}
          onBook={b => navigate(`/checkout/${b.id}`)}
        />
        {offerOpen && (
          <Offer
            p={p} type={type} lang="en" salon={bid}
            onClose={() => setOfferOpen(false)}
            onSend={({ price }) => {
              toast(`Offer sent to ${bid.name} — $${price}.`, { tone: 'success' });
              setOfferOpen(false);
            }}
          />
        )}
      </div>
    </CustomerLayout>
  );
}
