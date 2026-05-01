import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import { useAuth } from '../store.jsx';
import { invokeEdgeFunction, isStripeConfigured, stripePromise, PLATFORM_FEE_PCT } from '../lib/stripe.js';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

const fmtMoney = cents => `$${((cents || 0) / 100).toFixed(2)}`;

// The actual card form. Lives inside <Elements> so it has access to
// the Stripe + Elements instances. Submit triggers stripe.confirmPayment;
// if the card requires 3DS, Stripe handles the redirect dance via the
// return_url we set below.
function PaymentForm({ amount, fee, salonName, serviceSummary, returnTo, paymentIntentId, bidId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    // Confirm without redirect first; if the card needs 3DS, Stripe
    // tells us via the next_action and we let it redirect.
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}${returnTo}` },
      redirect: 'if_required',
    });
    if (result.error) {
      setError(result.error.message || 'Payment failed.');
      setSubmitting(false);
      return;
    }
    if (result.paymentIntent?.status === 'succeeded') {
      // Webhook fires asynchronously to commit the booking.
      // Poll the bookings table briefly for the row to appear, then
      // navigate to /bookings. We bail after 8s either way.
      setWaiting(true);
      const start = Date.now();
      while (Date.now() - start < 8000) {
        const { data } = await supabase
          .from('bookings')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .maybeSingle();
        if (data?.id) break;
        await new Promise(r => setTimeout(r, 700));
      }
      toast(`Booked with ${salonName}.`, { tone: 'success' });
      navigate('/bookings');
    } else {
      setError(`Unexpected status: ${result.paymentIntent?.status || 'unknown'}`);
      setSubmitting(false);
    }
  };

  const inputBox = {
    padding: '14px 16px', borderRadius: 12, background: p.bg,
    border: `0.5px solid ${p.line}`,
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={inputBox}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && (
        <div style={{ padding: '12px 14px', background: '#FFE6E6', color: '#B23A3A', borderRadius: 10, fontSize: 13 }}>
          {error}
        </div>
      )}
      <div style={{ padding: '14px 16px', background: p.surface2, borderRadius: 12, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.55 }}>
        Glossi charges your card now and releases funds to <strong style={{ color: p.ink }}>{salonName}</strong> after the appointment. Cancel up to 24 hours before for a full refund.
      </div>
      <button type="submit" disabled={!stripe || submitting || waiting} style={{
        background: p.ink, color: p.bg, border: 0,
        padding: '15px 24px', borderRadius: 99,
        fontSize: 14.5, fontWeight: 600, cursor: (!stripe || submitting || waiting) ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        opacity: (!stripe || submitting || waiting) ? 0.6 : 1,
      }}>
        {waiting ? 'Confirming booking…' : submitting ? 'Charging card…' : `Pay ${fmtMoney(amount)} & book ${serviceSummary}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { bidId } = useParams();
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();

  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (isSupabaseConfigured && !authLoading && !user) navigate('/signup', { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!bidId) return;
    if (!isSupabaseConfigured || !isStripeConfigured) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await invokeEdgeFunction('create-payment-intent', { bidId });
      if (cancelled) return;
      if (!result.ok) {
        setErr(result.error || 'Could not start payment.');
      } else {
        setIntent(result.data);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [bidId]);

  const elementsOptions = useMemo(() => intent?.clientSecret ? {
    clientSecret: intent.clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: p.accent,
        colorBackground: p.bg,
        colorText: p.ink,
        fontFamily: type.body,
        borderRadius: '10px',
      },
    },
  } : null, [intent]);

  return (
    <CustomerLayout active="quotes" mobileTitle="Pay & book">
      <div style={{ padding: isPhone ? '20px 18px 60px' : '34px 40px 60px', maxWidth: 640 }}>
        <Link to={`/quotes`} style={{ fontSize: 12, color: p.inkMuted, textDecoration: 'none', fontWeight: 600 }}>← Back to quotes</Link>
        <div style={{ marginTop: 16, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>CHECKOUT</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Pay &amp; book.</h1>

        {!isStripeConfigured && (
          <div style={{ marginTop: 22, padding: 18, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
            Stripe isn't configured — set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in Vercel and redeploy.
          </div>
        )}

        {isStripeConfigured && loading && (
          <div style={{ marginTop: 22, color: p.inkMuted, fontSize: 14 }}>Setting up your payment…</div>
        )}

        {isStripeConfigured && err && (
          <div style={{ marginTop: 22, padding: 18, background: '#FFE6E6', color: '#7a2828', borderRadius: 14, fontSize: 13.5, lineHeight: 1.5 }}>
            {err}
          </div>
        )}

        {isStripeConfigured && intent?.clientSecret && (
          <>
            <div style={{ marginTop: 22, padding: '20px 22px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 24, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.015em' }}>{intent.salonName}</div>
                  <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>{intent.serviceSummary}</div>
                </div>
                <div style={{ fontFamily: type.mono, fontSize: 32, fontWeight: 600, color: p.ink, letterSpacing: '-0.02em' }}>
                  {fmtMoney(intent.amount)}
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `0.5px dashed ${p.line}`, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: p.inkMuted }}>
                <span>Glossi platform fee · {PLATFORM_FEE_PCT}%</span>
                <span style={{ fontFamily: type.mono }}>{fmtMoney(intent.platformFeeCents)}</span>
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <Elements stripe={stripePromise} options={elementsOptions}>
                <PaymentForm
                  amount={intent.amount}
                  fee={intent.platformFeeCents}
                  salonName={intent.salonName}
                  serviceSummary={intent.serviceSummary}
                  returnTo="/bookings"
                  paymentIntentId={intent.paymentIntentId}
                  bidId={bidId}
                />
              </Elements>
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  );
}
