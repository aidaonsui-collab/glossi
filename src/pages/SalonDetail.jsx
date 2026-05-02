import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { BIDS } from '../ios/data.js';
import SalonProfile from '../components/SalonProfile.jsx';
import Offer from '../ios/screens/Offer.jsx';
import { useToast } from '../components/Toast.jsx';
import { useNarrow } from '../hooks.js';
import { usePublicBusinessReviews } from '../lib/quotes.js';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';
import { useT } from '../lib/i18n.js';
import { useLang } from '../store.jsx';

export default function SalonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isPhone = useNarrow();
  const t = useT();
  const { lang } = useLang();

  // Try the demo catalog first (BIDS predates Phase 6 — those entries
  // have rich gallery/services data via SALON_DETAILS).
  const bid = BIDS.find(b => b.id === id);

  // If not in BIDS, fall back to a Supabase business by slug. Real
  // businesses (the post-onboarding ones) live there. We render a
  // minimal real-business profile rather than crash with "not found".
  const [supaBiz, setSupaBiz] = useState(null);
  const [loadingBiz, setLoadingBiz] = useState(!bid && isSupabaseConfigured);
  useEffect(() => {
    if (bid || !isSupabaseConfigured) return;
    let cancel = false;
    supabase.from('businesses')
      .select('id, slug, name, city, hero_image_url, published, verified, bio_en, price_tier')
      .eq('slug', id)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        if (cancel) return;
        setSupaBiz(data);
        setLoadingBiz(false);
      });
    return () => { cancel = true; };
  }, [id, bid]);

  const [offerOpen, setOfferOpen] = useState(false);

  if (bid) {
    return (
      <CustomerLayout mobileTitle={bid.name}>
        <div style={{ position: 'relative', maxWidth: 760 }}>
          <SalonProfile
            p={p} type={type} lang={lang} surface="web" bid={bid}
            onBack={() => navigate(-1)}
            onMessage={b => navigate(`/inbox/${b.id}`)}
            onMakeOffer={() => setOfferOpen(true)}
            onBook={b => navigate(`/checkout/${b.id}`)}
          />
          {offerOpen && (
            <Offer
              p={p} type={type} lang={lang} salon={bid}
              onClose={() => setOfferOpen(false)}
              onSend={({ price }) => {
                toast(lang === 'es' ? `Oferta enviada a ${bid.name} — $${price}.` : `Offer sent to ${bid.name} — $${price}.`, { tone: 'success' });
                setOfferOpen(false);
              }}
            />
          )}
        </div>
      </CustomerLayout>
    );
  }

  if (loadingBiz) {
    return (
      <CustomerLayout mobileTitle={t('Salon', 'Salón')}>
        <div style={{ padding: '40px 30px', color: p.inkMuted, fontSize: 14 }}>{t('Loading…', 'Cargando…')}</div>
      </CustomerLayout>
    );
  }

  if (!supaBiz) {
    return (
      <CustomerLayout mobileTitle={t('Salon', 'Salón')}>
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36 }}>{t('Salon not found', 'Salón no encontrado')}</h1>
          <button onClick={() => navigate('/explore')} style={{ marginTop: 24, padding: '12px 22px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, fontSize: 14, cursor: 'pointer' }}>{t('Back to explore', 'Volver a explorar')}</button>
        </div>
      </CustomerLayout>
    );
  }

  return <RealSalonProfile biz={supaBiz} navigate={navigate} isPhone={isPhone} />;
}

// Minimal real-business profile. Shows name + city + bio, real
// reviews via public_business_reviews, and a "Get a quote" CTA that
// drops the customer into /request prefilled with the business in
// mind. Doesn't try to mimic the demo profile's gallery / services
// tabs — those need their own data model first.
function RealSalonProfile({ biz, navigate, isPhone }) {
  const t = useT();
  const { lang } = useLang();
  const { reviews, loading: reviewsLoading } = usePublicBusinessReviews(biz.id);

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null;

  return (
    <CustomerLayout mobileTitle={biz.name}>
      <div style={{ maxWidth: 760, padding: isPhone ? '20px 18px 60px' : '34px 40px 60px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 0, padding: 0, fontSize: 12, color: p.inkMuted, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t('← Back', '← Atrás')}</button>

        {/* Hero */}
        <div style={{
          marginTop: 14,
          height: isPhone ? 180 : 260,
          borderRadius: 18, overflow: 'hidden',
          background: biz.hero_image_url
            ? `url(${biz.hero_image_url}) center/cover`
            : 'linear-gradient(135deg, #C28A6B, #8B4F3A)',
        }} />

        {/* Header */}
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 240px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 42, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1.05, margin: 0 }}>{biz.name}</h1>
              {biz.verified && <span style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.12em' }}>{t('VERIFIED', 'VERIFICADO')}</span>}
            </div>
            <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 6 }}>
              {biz.city}{biz.price_tier ? ` · ${biz.price_tier}` : ''}
              {avg != null && ` · ${avg.toFixed(1)}★ (${reviews.length})`}
            </div>
            {biz.bio_en && (
              <p style={{ fontSize: 14, color: p.inkSoft, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 540 }}>
                {biz.bio_en}
              </p>
            )}
          </div>
          <button onClick={() => navigate('/request')} style={{
            background: p.ink, color: p.bg, border: 0,
            padding: '14px 22px', borderRadius: 99,
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            flexShrink: 0,
          }}>
            {t('Get a quote →', 'Pide cotización →')}
          </button>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>
            {t('REVIEWS', 'RESEÑAS')}{reviews.length ? ` · ${reviews.length}` : ''}
          </div>
          <div style={{ marginTop: 14 }}>
            {reviewsLoading ? (
              <div style={{ padding: 22, color: p.inkMuted, fontSize: 13 }}>{t('Loading reviews…', 'Cargando reseñas…')}</div>
            ) : reviews.length === 0 ? (
              <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
                {t('No reviews yet. Be the first — book and leave one after.', 'Aún no hay reseñas. Sé la primera — reserva y deja una después.')}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.map(r => (
                  <div key={r.review_id} style={{ padding: '16px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: p.ink }}>{r.reviewer_label}</div>
                        <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 2 }}>{new Date(r.created_at).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <div style={{ color: p.accent, fontSize: 14, letterSpacing: '0.05em' }}>
                        {'★'.repeat(r.rating)}<span style={{ color: p.line }}>{'★'.repeat(5 - r.rating)}</span>
                      </div>
                    </div>
                    {r.body && (
                      <div style={{ marginTop: 10, fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55, fontStyle: 'italic' }}>
                        "{r.body}"
                      </div>
                    )}
                    {r.salon_reply && (
                      <div style={{ marginTop: 10, padding: '10px 12px', background: p.bg, borderRadius: 10, borderLeft: `3px solid ${p.accent}` }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.accent }}>{t('SALON REPLY', 'RESPUESTA DEL SALÓN')}</div>
                        <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4, lineHeight: 1.5 }}>{r.salon_reply}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
