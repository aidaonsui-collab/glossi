import { useNavigate, useParams } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Review from '../components/Review.jsx';
import { useBookings } from '../store.jsx';
import { useT } from '../lib/i18n.js';

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const { bookings } = useBookings();
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return (
      <CustomerLayout active="bookings" mobileTitle={t('Review', 'Reseña')}>
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36 }}>{t('Booking not found', 'Reservación no encontrada')}</h1>
          <button onClick={() => navigate('/bookings')} style={{ marginTop: 24, padding: '12px 22px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, fontSize: 14, cursor: 'pointer' }}>{t('Back to bookings', 'Volver a reservaciones')}</button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout active="bookings" mobileTitle={t('Leave a review', 'Dejar reseña')}>
      <div style={{ maxWidth: 720 }}>
        <Review surface="web" booking={booking} onBack={() => navigate('/bookings')} onSubmitted={() => navigate(`/salon/${booking.salonId}`)} />
      </div>
    </CustomerLayout>
  );
}
