import { useNavigate, useParams } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Checkout from '../components/Checkout.jsx';
import { BIDS } from '../ios/data.js';
import { useToast } from '../components/Toast.jsx';
import { useBookings, useLang } from '../store.jsx';
import { useT } from '../lib/i18n.js';

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const t = useT();
  const { lang } = useLang();
  const { add: addBooking } = useBookings();
  const bid = BIDS.find(b => b.id === id);

  if (!bid) {
    return (
      <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, padding: '80px 32px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36 }}>{t('Bid not found', 'Cotización no encontrada')}</h1>
        <button onClick={() => navigate('/quotes')} style={{ marginTop: 24, padding: '12px 22px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, fontSize: 14, cursor: 'pointer' }}>{t('Back to quotes', 'Volver a cotizaciones')}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', background: p.bg, minHeight: '100vh' }}>
      <Checkout
        p={p} type={type} lang={lang} surface="web" bid={bid}
        onBack={() => navigate(-1)}
        onConfirm={r => {
          addBooking({
            salonId: bid.id, salonName: bid.name, mood: bid.mood,
            service: 'Color & balayage', slot: bid.slot_en,
            subtotal: bid.price, tipAmt: r.tipAmt, tax: r.tax, tipPct: r.tipPct, total: r.total,
            paymentId: r.paymentId,
          });
          toast(lang === 'es' ? `Cobrados $${r.total.toFixed(2)} · ${bid.name} reservado.` : `Charged $${r.total.toFixed(2)} · ${bid.name} booked.`, { tone: 'success' });
          navigate('/quotes');
        }}
      />
    </div>
  );
}
