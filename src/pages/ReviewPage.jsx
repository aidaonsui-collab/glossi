import { useNavigate, useParams } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Review from '../components/Review.jsx';
import { useBookings } from '../store.jsx';

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return (
      <CustomerLayout active="bookings" mobileTitle="Review">
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36 }}>Booking not found</h1>
          <button onClick={() => navigate('/bookings')} style={{ marginTop: 24, padding: '12px 22px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, fontSize: 14, cursor: 'pointer' }}>Back to bookings</button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout active="bookings" mobileTitle="Leave a review">
      <div style={{ maxWidth: 720 }}>
        <Review surface="web" booking={booking} onBack={() => navigate('/bookings')} onSubmitted={() => navigate(`/salon/${booking.salonId}`)} />
      </div>
    </CustomerLayout>
  );
}
