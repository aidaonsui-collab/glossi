import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import { useAuth, useLang } from '../store.jsx';
import { useT } from '../lib/i18n.js';
import SignInModal from '../components/SignInModal.jsx';

// Service category entry tiles. Customers tap a category → bid-request form
// pre-filled. Photo index maps into PHOTOS in theme.js. Salon counts are
// illustrative pre-launch; pull from `businesses` grouped by primary service
// once we have real data. No unit prices on this page — surfaces aggregate
// activity (`VALLEY_PULSE` below) instead, so we don't anchor customers to
// a specific dollar figure or pin a salon to a public price floor.
const CATEGORIES = [
  { slug: 'haircut',      labelEn: 'Hair',    labelEs: 'Cabello',   salons: 84, photo: 0 },
  { slug: 'color',        labelEn: 'Color',   labelEs: 'Color',     salons: 47, photo: 1 },
  { slug: 'nails',        labelEn: 'Nails',   labelEs: 'Uñas',      salons: 76, photo: 7 },
  { slug: 'lashes-brows', labelEn: 'Lashes',  labelEs: 'Pestañas',  salons: 52, photo: 3 },
  { slug: 'lashes-brows', labelEn: 'Brows',   labelEs: 'Cejas',     salons: 67, photo: 4 },
  { slug: 'haircut',      labelEn: 'Barber',  labelEs: 'Barbería',  salons: 30, photo: 2 },
  { slug: 'makeup',       labelEn: 'Makeup',  labelEs: 'Maquillaje',salons: 23, photo: 6 },
  { slug: 'facials',      labelEn: 'Skin',    labelEs: 'Piel',      salons: 11, photo: 5 },
];

// Aggregate marketplace health. Conveys liquidity + competition without
// exposing individual prices or pinning salons to historic price floors.
// Numbers are placeholders pre-launch; will be live counts post-launch.
const VALLEY_PULSE = [
  { num: '84',  en: 'Bookings in the Valley this week', es: 'Reservas en el Valle esta semana' },
  { num: '312', en: 'Salons accepting requests',         es: 'Salones aceptando solicitudes' },
  { num: '4',   en: 'Bids per request, on average',      es: 'Ofertas por solicitud, en promedio' },
  { num: '14m', en: 'Median time-to-first-bid',          es: 'Tiempo mediano a la primera oferta' },
];

export default function Marketing() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { lang, toggle: toggleLang } = useLang();
  const t = useT();
  const [signInOpen, setSignInOpen] = useState(false);
  const howRef = useRef(null);
  const compareRef = useRef(null);
  const salonRef = useRef(null);

  const scrollTo = ref => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const Nav = () => (
    <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 64px', gap: 14, borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 5 }}>
      <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
      <div style={{ flex: 1 }} />
      {!isPhone && (
        <div style={{ display: 'flex', gap: 24 }}>
          <button onClick={() => scrollTo(salonRef)} style={navBtn}>{t('For salons', 'Para salones')}</button>
          <Link to="/ios" style={navBtn}>{t('iOS preview', 'Vista previa iOS')}</Link>
        </div>
      )}
      {user ? (
        <button onClick={() => navigate(user.type === 'salon' ? '/salon' : '/quotes')} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '6px 6px 6px 12px', fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{user.name.split(' ')[0]}</span>
          <span style={{ width: 28, height: 28, borderRadius: 99, background: user.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 11, fontWeight: 700 }}>{user.initials}</span>
        </button>
      ) : (
        <button onClick={() => setSignInOpen(true)} style={{ background: 'transparent', border: 0, padding: '8px 12px', fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer' }}>{t('Sign in', 'Iniciar sesión')}</button>
      )}
      <button onClick={() => navigate(user ? '/quotes' : '/signup')} style={{ background: p.accent, color: p.ink, border: 0, padding: isPhone ? '8px 14px' : '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{isPhone ? t('Sign up', 'Registrarse') : t('Get started', 'Comenzar')}</button>
    </div>
  );

  // Avoid surfacing per-booking dollar savings publicly — it anchors
  // customers to a specific price and pins salons to historical floors.
  // Use bid-count + time-to-book instead: signals liquidity without
  // exposing units.
  const ticker = [
    { who: 'Sofia · Pharr',        what: t('Color & balayage', 'Color y balayage'),    metaEn: '5 bids · booked in 12 min', metaEs: '5 ofertas · reservada en 12 min' },
    { who: 'Daniela · McAllen',    what: t('Hybrid lashes', 'Pestañas híbridas'),      metaEn: '4 bids · booked in 8 min',  metaEs: '4 ofertas · reservada en 8 min' },
    { who: 'Maritza · Edinburg',   what: t('Gel mani + pedi', 'Mani gel + pedi'),      metaEn: '6 bids · booked in 21 min', metaEs: '6 ofertas · reservada en 21 min' },
    { who: 'Kevin · Mission',      what: t('Skin fade + beard', 'Corte fade + barba'), metaEn: '7 bids · booked in 5 min',  metaEs: '7 ofertas · reservada en 5 min' },
    { who: 'Jasmin · Brownsville', what: t('Brazilian blowout', 'Alisado brasileño'),  metaEn: '4 bids · booked in 14 min', metaEs: '4 ofertas · reservada en 14 min' },
    { who: 'Camila · Harlingen',   what: t('Microblading', 'Microblading'),            metaEn: '3 bids · booked in 38 min', metaEs: '3 ofertas · reservada en 38 min' },
  ];

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      <Nav />

      <div style={{ padding: isPhone ? '12px 18px 0' : '20px 64px 0' }}>
        <div style={{ position: 'relative', borderRadius: isPhone ? 20 : 24, overflow: 'hidden', aspectRatio: isPhone ? '4/5' : '21/9', background: '#1a1714' }}>
          <video autoPlay muted loop playsInline preload="auto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(26,23,20,0) 0%, rgba(26,23,20,0.05) 50%, rgba(26,23,20,0.7) 100%)' }} />
          <div style={{ position: 'absolute', top: isPhone ? 16 : 28, left: isPhone ? 16 : 32, color: p.bg, fontFamily: type.mono, fontSize: isPhone ? 10 : 12, fontWeight: 600, letterSpacing: '0.18em' }}>
            {t('ISSUE 04 · APR 2026', 'EDICIÓN 04 · ABR 2026')}
          </div>
          <div style={{ position: 'absolute', top: isPhone ? 16 : 28, right: isPhone ? 16 : 32, color: p.bg, fontFamily: type.mono, fontSize: isPhone ? 10 : 12, fontWeight: 600, letterSpacing: '0.18em' }}>
            {t('VOL. 1 · BEAUTY MARKETPLACE', 'VOL. 1 · MERCADO DE BELLEZA')}
          </div>
          <div style={{ position: 'absolute', left: isPhone ? 20 : 48, right: isPhone ? 20 : 48, bottom: isPhone ? 22 : 42, color: p.bg }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? '13vw' : '7.5vw', fontWeight: type.displayWeight, letterSpacing: '-0.04em', lineHeight: 0.9, textWrap: 'balance', margin: 0, color: p.accent }}>
              {lang === 'es' ? <>Ellos ofertan.<br />Tú reservas.</> : <>They bid.<br />You book.</>}
            </div>
            <div style={{ marginTop: isPhone ? 12 : 18, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/request')} style={{ background: p.bg, color: p.ink, border: 0, padding: isPhone ? '12px 18px' : '14px 22px', borderRadius: 99, fontSize: isPhone ? 13.5 : 14, fontWeight: 600, cursor: 'pointer' }}>{t('Post a request', 'Publica una solicitud')}</button>
              <span style={{ fontFamily: type.mono, fontSize: isPhone ? 11 : 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{t('1,400+ SALONS · 4 CITIES', '1,400+ SALONES · 4 CIUDADES')}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={howRef} style={{ padding: isPhone ? '40px 18px 30px' : '80px 64px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1.6fr', gap: isPhone ? 18 : 60, alignItems: 'flex-end', marginBottom: isPhone ? 28 : 44 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: type.mono }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: p.accent, boxShadow: `0 0 0 4px ${p.bg}` }} />
              <span>{t('VALLEY PULSE · LIVE', 'PULSO DEL VALLE · EN VIVO')}</span>
            </div>
            <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 62, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.92, margin: 0, textWrap: 'balance', color: p.ink }}>
              {lang === 'es' ? <>El Valle<br /><span style={{ color: p.accent }}>está lleno.</span></> : <>The Valley<br /><span style={{ color: p.accent }}>is booked up.</span></>}
            </h2>
          </div>
          <p style={{ fontSize: isPhone ? 14 : 17, color: p.inkSoft, lineHeight: 1.55, margin: 0, textWrap: 'pretty', maxWidth: 480 }}>
            {t(
              'You post the service, ZIP, and budget. Local salons send real prices. You pick the bid that fits. Pricing is between you and your stylist — Glossi just makes the intro.',
              'Publicas el servicio, el código postal y tu presupuesto. Los salones locales envían precios reales. Tú eliges la oferta. El precio queda entre tú y tu estilista — Glossi solo hace la presentación.'
            )}
          </p>
        </div>

        {/* Aggregate Valley activity — liquidity without unit prices */}
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isPhone ? 10 : 18, marginBottom: isPhone ? 28 : 44, padding: isPhone ? 18 : 28, background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 16 }}>
          {VALLEY_PULSE.map((s, i) => (
            <div key={i} style={{ borderLeft: !isPhone && i > 0 ? `0.5px solid ${p.line}` : 0, paddingLeft: !isPhone && i > 0 ? 20 : 0 }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 54, fontWeight: type.displayWeight, color: p.accent, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 6 }}>{s.num}</div>
              <div style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 600, color: p.inkSoft, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.4 }}>{lang === 'es' ? s.es : s.en}</div>
            </div>
          ))}
        </div>

        {/* Service category tiles — entry into the bid form, no prices */}
        <div style={{ marginBottom: isPhone ? 20 : 24, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 28 : 38, fontWeight: type.displayWeight, letterSpacing: '-0.02em', margin: 0, color: p.ink }}>
            {t('What are you booking?', '¿Qué vas a reservar?')}
          </h3>
          <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.1em' }}>
            {t('TAP TO REQUEST BIDS', 'TOCA PARA PEDIR OFERTAS')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isPhone ? 10 : 14 }}>
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              onClick={() => navigate(`/request?service=${c.slug}`)}
              style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
            >
              <div style={{ position: 'relative', aspectRatio: '1/1', backgroundImage: `url(${PHOTOS[c.photo]})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,23,20,0) 40%, rgba(26,23,20,0.78) 100%)' }} />
                <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
                  <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, color: p.bg, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 4 }}>{lang === 'es' ? c.labelEs : c.labelEn}</div>
                  <div style={{ fontFamily: type.mono, fontSize: 10, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.08em' }}>{c.salons} {t('RGV salons accepting', 'salones del Valle aceptando')}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: isPhone ? 28 : 36, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingTop: isPhone ? 18 : 24, borderTop: `0.5px solid ${p.line}` }}>
          <span style={{ fontFamily: type.mono, fontSize: 12, color: p.inkSoft, letterSpacing: '0.06em' }}>
            {t('FREE · 30 SECONDS · NO ACCOUNT NEEDED · EN / ES', 'GRATIS · 30 SEGUNDOS · SIN CUENTA · EN / ES')}
          </span>
          <button onClick={() => navigate('/request')} style={{ background: p.ink, color: p.bg, border: 0, padding: isPhone ? '14px 22px' : '16px 28px', borderRadius: 99, fontSize: isPhone ? 14 : 15, fontWeight: 600, cursor: 'pointer' }}>
            {t('Post your first request →', 'Publica tu primera solicitud →')}
          </button>
        </div>
      </div>

      <div style={{ background: p.ink, color: p.bg, padding: isPhone ? '14px 0' : '18px 0', overflow: 'hidden', borderTop: `0.5px solid ${p.line}`, borderBottom: `0.5px solid ${p.line}` }}>
        <div style={{ display: 'flex', gap: isPhone ? 28 : 48, fontFamily: type.mono, fontSize: isPhone ? 11 : 13, fontWeight: 500, letterSpacing: '0.04em', whiteSpace: 'nowrap', alignItems: 'center', padding: '0 24px', width: 'max-content', animation: 'glossiTicker 60s linear infinite' }}>
          {[...ticker, ...ticker].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: p.accent }} />
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{row.who}</span>
              <span>{row.what}</span>
              <span style={{ color: p.accent, fontWeight: 600 }}>{lang === 'es' ? row.metaEs : row.metaEn}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={compareRef} style={{ padding: isPhone ? '36px 18px' : '90px 64px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('THE OLD WAY VS. GLOSSI', 'LA FORMA ANTIGUA VS. GLOSSI')}</div>
        <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '10px 0 0', textWrap: 'balance' }}>
          {t('Why are you the one shopping?', '¿Por qué eres tú quien busca?')}
        </h2>
        <div style={{ marginTop: isPhone ? 22 : 40, display: 'grid', gap: isPhone ? 12 : 18, gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr' }}>
          {[
            {
              tag: t('BEFORE GLOSSI', 'ANTES DE GLOSSI'), tone: 'old',
              t: t('You scroll, DM, get ghosted, accept a price.', 'Buscas, mandas DMs, te ignoran, aceptas un precio.'),
              items: [
                t('Hours scrolling Instagram', 'Horas en Instagram'),
                t('DM five places, hear from one', 'Escribes a cinco lugares, te responde uno'),
                t('Whatever the menu price is', 'Lo que diga la lista de precios'),
                t('"Are you available Saturday?" "no sorry"', '"¿Tienes el sábado?" "no, lo siento"'),
              ],
            },
            {
              tag: t('WITH GLOSSI', 'CON GLOSSI'), tone: 'new',
              t: t('You post once. Salons compete for you.', 'Publicas una vez. Los salones compiten por ti.'),
              items: [
                t('30 seconds to post a request', '30 segundos para publicar una solicitud'),
                t('4–8 bids in your inbox', '4–8 ofertas en tu bandeja'),
                t('Often 20–40% under menu price', 'Usualmente 20–40% menos que la lista'),
                t('Real slots, real prices, real people', 'Horarios reales, precios reales, gente real'),
              ],
            },
          ].map((c, i) => (
            <div key={i} style={{
              padding: isPhone ? '20px' : '30px',
              borderRadius: 18,
              background: c.tone === 'new' ? p.ink : p.surface,
              color: c.tone === 'new' ? p.bg : p.ink,
              border: c.tone === 'new' ? 'none' : `0.5px solid ${p.line}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: c.tone === 'new' ? p.accent : p.inkMuted }}>{c.tag}</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 22 : 30, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 8, textWrap: 'balance' }}>{c.t}</div>
              <div style={{ marginTop: isPhone ? 14 : 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.items.map((line, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: isPhone ? 13 : 14, lineHeight: 1.5, color: c.tone === 'new' ? 'rgba(255,255,255,0.85)' : p.inkSoft }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 99,
                      background: c.tone === 'new' ? p.accent : 'transparent',
                      border: c.tone === 'new' ? 'none' : `0.5px solid ${p.inkMuted}`,
                      color: c.tone === 'new' ? p.ink : p.inkMuted,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 2, fontSize: 11, fontWeight: 700,
                    }}>{c.tone === 'new' ? '✓' : '·'}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={salonRef} style={{ padding: isPhone ? '30px 18px 40px' : '80px 64px 100px', background: p.surface, borderTop: `0.5px solid ${p.line}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: isPhone ? 20 : 50, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>{t('SALONS — READ THIS', 'SALONES — LEAN ESTO')}</div>
            <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.98, margin: '10px 0 0', textWrap: 'balance' }}>{t('You set your floor. We bring the chair.', 'Tú pones el piso. Nosotros llenamos la silla.')}</h2>
            <p style={{ fontSize: isPhone ? 14 : 16, color: p.inkSoft, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 480 }}>
              {t(
                'No subscription. No lead fees. Pay 5% only when you win a booking. Set your minimum price, your service area, your hours — we route requests that match.',
                'Sin suscripción. Sin tarifas por contacto. Paga 5% solo cuando ganas una reserva. Define tu precio mínimo, tu área, tus horas — enrutamos las solicitudes que encajen.'
              )}
            </p>
            <button onClick={() => navigate('/signup?role=salon')} style={{ marginTop: 18, background: p.ink, color: p.bg, border: 0, padding: isPhone ? '14px 20px' : '15px 24px', borderRadius: 99, fontSize: isPhone ? 13.5 : 15, fontWeight: 600, cursor: 'pointer' }}>{t('List your business →', 'Lista tu negocio →')}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {[
              { k: t('Avg. response', 'Resp. promedio'), v: t('11 min', '11 min') },
              { k: t('Win rate', 'Tasa de éxito'), v: '34%' },
              { k: t('No-show rate', 'Inasistencia'), v: '2.1%' },
              { k: t('Glossi fee', 'Tarifa Glossi'), v: '5%' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '18px 18px', background: p.bg, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 26 : 36, fontWeight: type.displayWeight, marginTop: 4, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <div style={{ padding: isPhone ? '24px 18px' : '40px 64px', borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: p.inkMuted }}>GLOSSI · 2026</div>
        <div style={{ fontSize: 11.5, color: p.inkMuted, display: 'flex', gap: 18, alignItems: 'center' }}>
          <button onClick={() => toggleLang()} aria-label="Toggle language" style={{ ...footerBtn, display: 'inline-flex', gap: 4 }}>
            <span style={{ color: lang === 'en' ? p.ink : p.inkMuted, fontWeight: lang === 'en' ? 700 : 500 }}>EN</span>
            <span>·</span>
            <span style={{ color: lang === 'es' ? p.ink : p.inkMuted, fontWeight: lang === 'es' ? 700 : 500 }}>ES</span>
          </button>
          <Link to="/privacy" style={{ ...footerBtn, textDecoration: 'none' }}>{t('Privacy', 'Privacidad')}</Link>
          <Link to="/terms" style={{ ...footerBtn, textDecoration: 'none' }}>{t('Terms', 'Términos')}</Link>
          <Link to="/help" style={{ ...footerBtn, textDecoration: 'none' }}>{t('Help', 'Ayuda')}</Link>
        </div>
      </div>
    </div>
  );
}

const navBtn = { background: 'transparent', border: 0, fontSize: 13, color: '#5C544B', fontWeight: 500, textDecoration: 'none', cursor: 'pointer', fontFamily: 'inherit' };
const footerBtn = { background: 'transparent', border: 0, fontSize: 11.5, color: '#9A9088', cursor: 'pointer', padding: 0, fontFamily: 'inherit' };
