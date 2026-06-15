// Marketing.jsx — the live `/` homepage.
//
// Rebuild based on the Claude Design handoff bundle `glossi-update` (May 2026).
// The design ships a Babel-CDN React prototype with 4 jsx files + styles.css;
// this file ports that layout into our actual stack (Vite + react-router + useT/useLang).
//
// Locked-in design choices (no Tweaks panel in prod):
//   palette: rose-gold/peach/sage  cardStyle: saturated (photo-led)
//   heroLayout: split               energy: 6 (medium motion)
//
// CTAs route to the real /request flow (?services=<slug>), not the
// prototype's simulated bid modal. SignInModal flow stays.
//
// Previous Marketing.jsx is kept as `.pre-redesign.bak` next to this file.

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useAuth, useLang } from '../store.jsx';
import { useT } from '../lib/i18n.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import SignInModal from '../components/SignInModal.jsx';

// ── Per-card accent palette (rose-gold / peach / sage from design data.js) ──
// Eight colors → one per service card, in the order SERVICES is declared.
// All share similar chroma so the grid reads as one family, not eight stickers.
const ACCENTS = ['#E8B4A0', '#D89B7A', '#F5D5C8', '#C9A87A', '#B8C9A9', '#E5C7B0', '#D4A5C9', '#A8B89A'];

// Service category tiles. Each maps to a slug the /request page accepts via
// ?services=<slug>. Photos are from the design's data.js (vibrant Unsplash
// beauty/salon stock per the brief — replaces the muted black-and-white
// imagery the prior homepage relied on).
const SERVICES = [
  { slug: 'haircut',      en: 'Hair',    es: 'Cabello',    subEn: 'Cuts, blowouts, treatments',     subEs: 'Cortes, blowouts, tratamientos',   bidsEn: '318 bids today', bidsEs: '318 ofertas hoy', photo: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=80&auto=format&fit=crop' },
  { slug: 'color',        en: 'Color',   es: 'Color',      subEn: 'Balayage, gloss, root touch-up', subEs: 'Balayage, gloss, retoque de raíz', bidsEn: '204 bids today', bidsEs: '204 ofertas hoy', photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80&auto=format&fit=crop' },
  { slug: 'nails',        en: 'Nails',   es: 'Uñas',       subEn: 'Gel, acrylic, structured mani',  subEs: 'Gel, acrílico, manicura estructurada', bidsEn: '411 bids today', bidsEs: '411 ofertas hoy', photo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80&auto=format&fit=crop' },
  { slug: 'lashes-brows', en: 'Lashes',  es: 'Pestañas',   subEn: 'Classic, hybrid, volume',        subEs: 'Clásicas, híbridas, volumen',      bidsEn: '276 bids today', bidsEs: '276 ofertas hoy', photo: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80&auto=format&fit=crop' },
  { slug: 'lashes-brows', en: 'Brows',   es: 'Cejas',      subEn: 'Lamination, wax, tint',          subEs: 'Laminado, cera, tinte',            bidsEn: '182 bids today', bidsEs: '182 ofertas hoy', photo: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=80&auto=format&fit=crop' },
  { slug: 'haircut',      en: 'Barber',  es: 'Barbería',   subEn: 'Fades, beards, hot towel',       subEs: 'Degradados, barba, toalla caliente', bidsEn: '165 bids today', bidsEs: '165 ofertas hoy', photo: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=80&auto=format&fit=crop' },
  { slug: 'makeup',       en: 'Makeup',  es: 'Maquillaje', subEn: 'Bridal, event, lessons',         subEs: 'Novia, evento, clases',            bidsEn: '98 bids today',  bidsEs: '98 ofertas hoy',  photo: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=900&q=80&auto=format&fit=crop' },
  { slug: 'facials',      en: 'Skin',    es: 'Piel',       subEn: 'Facials, peels, microneedling',  subEs: 'Faciales, peelings, microneedling', bidsEn: '144 bids today', bidsEs: '144 ofertas hoy', photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80&auto=format&fit=crop' },
];

// Aggregate marketplace stats. These jitter live below to simulate a real
// feed — same convention as the prior homepage's VALLEY_PULSE.
const PULSE_BASE = [
  { en: 'Bookings today',     es: 'Reservas hoy',           value: 84,  suffix: '' },
  { en: 'Active salons',      es: 'Salones activos',        value: 312, suffix: '' },
  { en: 'Avg. response',      es: 'Respuesta promedio',     value: 11,  suffix: ' min' },
  { en: 'Avg. saved / book',  es: 'Ahorro promedio',        value: 23,  suffix: '%' },
];

// Old way vs Glossi — 4-row narrative comparison. Replaces a generic "how
// it works" walkthrough; framing as "vs. status quo" lands harder than
// numbered steps.
const COMPARE = [
  { oldEn: 'DM seven salons. Two ghost you.',          oldEs: 'Escribes a siete salones. Dos te ignoran.',       newEn: 'Post once. Bids come to you.',            newEs: 'Publicas una vez. Las ofertas llegan a ti.' },
  { oldEn: 'Pay whatever they quote.',                  oldEs: 'Pagas lo que te cobren.',                          newEn: 'You set the floor. They bid down.',       newEs: 'Tú pones el tope. Ellas ofrecen por debajo.' },
  { oldEn: 'Hope the reviews are real.',                oldEs: 'Ojalá las reseñas sean reales.',                   newEn: 'Every salon is licensed + verified.',     newEs: 'Cada salón está licenciado y verificado.' },
  { oldEn: 'Reschedule three times to find a slot.',    oldEs: 'Reagendas tres veces para encontrar hora.',        newEn: 'Bids include open times. Pick one.',      newEs: 'Las ofertas incluyen horarios. Tú eliges.' },
];

// Field Guide editorial — links to /editorial in the live app, copy is
// design-supplied. Photos pull from the design's guide bucket.
const GUIDE = [
  { tagEn: 'Color',     tagEs: 'Color',     titleEn: 'Balayage in the Valley summer',                  titleEs: 'Balayage en el verano del Valle',                 readEn: '6 min read', readEs: '6 min', photo: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&q=80&auto=format&fit=crop' },
  { tagEn: 'Etiquette', tagEs: 'Etiqueta',  titleEn: 'What to bring to a first lash fill',             titleEs: 'Qué llevar a tu primer relleno de pestañas',      readEn: '3 min read', readEs: '3 min', photo: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=900&q=80&auto=format&fit=crop' },
  { tagEn: 'Maps',      tagEs: 'Mapas',     titleEn: 'Where the best blowouts hide in McAllen',        titleEs: 'Dónde se esconden los mejores blowouts en McAllen', readEn: '8 min read', readEs: '8 min', photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80&auto=format&fit=crop' },
  { tagEn: 'Skin',      tagEs: 'Piel',      titleEn: 'SPF, retinol, and the after-facial 48h',         titleEs: 'SPF, retinol y las 48h después de un facial',     readEn: '5 min read', readEs: '5 min', photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80&auto=format&fit=crop' },
];

// Demo modal — mock salon bidders. Names match the live ticker so the
// two feel like the same ecosystem even though this is simulated.
const DEMO_SALONS = [
  { name: 'Studio Rose',  area: 'McAllen',     stars: 4.9, reviews: 142, badge: 'Top pick'  },
  { name: 'Bloom + Co.', area: 'Edinburg',    stars: 4.8, reviews: 97,  badge: 'Fast reply' },
  { name: 'Velvet Chair', area: 'McAllen',     stars: 4.7, reviews: 203, badge: 'Verified'   },
  { name: 'Casa Lúa',     area: 'Harlingen',   stars: 4.9, reviews: 88,  badge: 'Top pick'  },
  { name: 'The Loft RGV', area: 'Brownsville', stars: 4.8, reviews: 156, badge: 'New'        },
];

const TICKER_EN = [
  'Maria booked balayage at Studio Rose — $185',
  'New: 12 lash fills opened in Edinburg',
  'Ana saved 28% on a structured mani in McAllen',
  'Bloom + Co. just accepted a Friday blowout',
  '3 brow lams just bid in Harlingen — starting $42',
  'Velvet Chair quoted a wedding party of 6',
  'Jess locked a hot-towel fade for Saturday',
  'Casa Lúa: 4 new gloss appointments today',
  '12 new salons joined this week',
  'Average response time dropped to 9 minutes',
];
const TICKER_ES = [
  'María reservó un balayage en Studio Rose — $185',
  'Nuevo: 12 rellenos de pestañas abiertos en Edinburg',
  'Ana ahorró 28% en una manicura estructurada en McAllen',
  'Bloom + Co. aceptó un blowout para el viernes',
  '3 laminados de cejas en Harlingen — desde $42',
  'Velvet Chair cotizó un grupo de boda de 6',
  'Jess agendó un degradado con toalla caliente para el sábado',
  'Casa Lúa: 4 nuevas citas de gloss hoy',
  '12 nuevos salones se unieron esta semana',
  'El tiempo de respuesta bajó a 9 minutos',
];

// Hero / Pitch imagery — design-bundle Unsplash IDs.
// HERO_PHOTO is the `full` hero variant from data.js (1800w model + warm
// rose backdrop). Full-bleed treatment behind the headline.
const HERO_PHOTO  = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1800&q=80&auto=format&fit=crop';
const PITCH_PHOTO = 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1400&q=80&auto=format&fit=crop';

// ── Tiny helpers ─────────────────────────────────────────────────────────

// Smooth count-up between integer updates (Valley Pulse). Same eased curve
// as the design's CountUp — 600ms cubic-out, cancels on unmount.
function CountUp({ value }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    const start = prev.current;
    const delta = value - start;
    const t0 = performance.now();
    let frame;
    const step = t => {
      const pp = Math.min(1, (t - t0) / 600);
      setDisplay(Math.round(start + delta * (1 - Math.pow(1 - pp, 3))));
      if (pp < 1) frame = requestAnimationFrame(step);
      else prev.current = value;
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span>{display}</span>;
}

// Deterministic sparkline under each pulse stat. No live data — purely
// decorative texture. Seed-based so the four sparklines all look different
// but never re-shuffle between renders.
function Sparkline({ seed, color }) {
  const pts = [];
  let val = 0.5 + seed * 0.07;
  for (let i = 0; i < 16; i++) {
    const r = Math.sin(seed * 7.1 + i * 1.3) * 0.5 + 0.5;
    val = val * 0.6 + r * 0.4;
    pts.push([i, 1 - val]);
  }
  const path = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1].toFixed(3)}`).join(' ');
  return (
    <svg viewBox="0 0 15 1" preserveAspectRatio="none" style={{ width: '100%', height: 20, marginTop: 6, opacity: 0.7 }}>
      <path d={path} fill="none" stroke={color} strokeWidth="0.04" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function Marketing() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, toggle: toggleLang } = useLang();
  const t = useT();

  // Live founder counter — RPC stays so the homepage stat tracks real
  // signups, same as /pros. Starts at 0 until the RPC resolves; the
  // "{n} salons in the founding cohort" line is hidden while count is 0.
  const [founderCount, setFounderCount] = useState(0);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.rpc('founder_count').then(({ data, error }) => {
      if (!error && typeof data === 'number') setFounderCount(data);
    });
  }, []);

  const [signInOpen, setSignInOpen] = useState(false);
  const [pulse, setPulse] = useState(PULSE_BASE.map(s => s.value));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState(null);

  // Jittered live stats. Each tick nudges one cell by ±1; bookings drift
  // up most often (positive growth feel), response time wobbles tightly.
  useEffect(() => {
    const id = setInterval(() => {
      setPulse(cur =>
        cur.map((v, i) => {
          if (i === 0) return v + (Math.random() > 0.6 ? 1 : 0);
          if (i === 1) return v + (Math.random() > 0.85 ? 1 : 0);
          if (i === 2) return Math.max(8, v + (Math.random() > 0.5 ? -1 : 1) * (Math.random() > 0.7 ? 1 : 0));
          if (i === 3) return Math.max(15, Math.min(35, v + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.8 ? 1 : 0)));
          return v;
        })
      );
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Lock scroll when the demo bid modal is open.
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  // Hero + service-card CTAs open the demo bid modal so visitors can
  // experience the flow without signing up. The modal's success screen
  // links to the real /request flow.
  const openModal = (service = null) => { setModalService(service); setModalOpen(true); };

  // ── Nav ──
  const Nav = () => (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50, background: p.bg,
      borderBottom: `0.5px solid ${p.line}`,
      padding: isPhone ? '14px 18px' : '18px 64px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 22 : 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.ink, textDecoration: 'none' }}>
        glossi<span style={{ color: p.accent }}>.</span>
      </Link>
      <div style={{ flex: 1 }} />
      <button onClick={toggleLang} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, color: p.ink, padding: '6px 10px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer', borderRadius: 99, fontFamily: type.mono }}>
        {lang === 'en' ? 'ES' : 'EN'}
      </button>
      {user ? (
        <button onClick={() => navigate(user.type === 'salon' ? '/salon' : '/quotes')} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '6px 6px 6px 12px', fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{user.name?.split(' ')[0]}</span>
          <span style={{ width: 28, height: 28, borderRadius: 99, background: user.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 11, fontWeight: 700 }}>{user.initials}</span>
        </button>
      ) : (
        <>
          <button onClick={() => setSignInOpen(true)} style={{ background: 'transparent', border: 0, padding: isPhone ? '8px 6px' : '8px 12px', fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {isPhone ? t('Log in', 'Entrar') : t('Log in / Sign up', 'Inicia sesión / Regístrate')}
          </button>
          <button onClick={() => navigate('/signup?role=salon')} style={{ background: p.ink, color: p.bg, border: 0, padding: isPhone ? '8px 14px' : '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {isPhone ? t('List business', 'Mi negocio') : t('List your business', 'Lista tu negocio')}
          </button>
        </>
      )}
    </nav>
  );

  // ── Hero ── (Full-bleed layout)
  // Single big image fills the hero, headline + sub + CTAs sit on top, anchored
  // to the bottom-left. Two stacked overlays make the copy legible without
  // muddying the photo: a vertical dark fade at the bottom (for the headline)
  // and a horizontal cream-to-clear wash on the left (so the kicker / sub /
  // trust row pop against the model's face/hair). 88vh min-height per design.
  const Hero = () => (
    <section style={{ position: 'relative', minHeight: isPhone ? '70vh' : '88vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', background: `linear-gradient(135deg, ${ACCENTS[0]}, ${ACCENTS[3]})` }}>
      <img
        src={HERO_PHOTO}
        alt=""
        loading="eager"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
      {/* Legibility overlays — bottom darken + left cream-wash */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background:
          'linear-gradient(180deg, rgba(26,23,20,0) 30%, rgba(26,23,20,0.55) 100%),' +
          'linear-gradient(90deg, rgba(250,247,242,0.85) 0%, rgba(250,247,242,0.2) 45%, rgba(26,23,20,0) 70%)',
      }} />
      <div style={{ position: 'relative', zIndex: 2, padding: isPhone ? '0 18px 36px' : '0 64px 80px', width: '100%' }}>
        <div style={{ maxWidth: 880 }}>
          <span style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkSoft, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 24, height: 1, background: p.inkSoft, opacity: 0.5 }} />
            {t('The Rio Grande Valley · Beauty Marketplace', 'El Valle del Río Grande · Mercado de belleza')}
          </span>
          <h1 style={{ fontFamily: type.display, fontSize: isPhone ? '15vw' : 'clamp(72px, 9vw, 140px)', fontWeight: type.displayWeight, letterSpacing: '-0.035em', lineHeight: 0.92, margin: '18px 0 0', textWrap: 'balance', color: p.ink }}>
            <span style={{ display: 'inline-block' }}>
              {t('They bid.', 'Ellas ofrecen.')}
              <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 99, background: ACCENTS[0], marginLeft: 6, verticalAlign: 'middle', transform: 'translateY(-0.45em)' }} />
            </span>
            <span style={{ display: 'block', fontStyle: 'italic', color: p.inkSoft }}>
              {t('You book.', 'Tú reservas.')}
            </span>
          </h1>
          <p style={{ fontSize: isPhone ? 15.5 : 19, color: p.inkSoft, lineHeight: 1.5, margin: '28px 0 36px', textWrap: 'pretty', maxWidth: '44ch', fontWeight: 500 }}>
            {t(
              'Post once. Get tailored offers from vetted salons within the hour — at the price you set.',
              'Publica una vez. Recibe ofertas a tu medida de salones verificados en menos de una hora — al precio que tú pones.'
            )}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => openModal()} style={{ background: p.ink, color: p.bg, border: 0, padding: isPhone ? '15px 24px' : '18px 26px', borderRadius: 99, fontSize: isPhone ? 14 : 15, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 0 rgba(184,137,62,0.6), 0 12px 30px -10px rgba(26,23,20,0.4)' }}>
              {t('Post a request', 'Publicar solicitud')}
              <span style={{ fontSize: 16 }}>→</span>
            </button>
            <button onClick={() => navigate('/editorial')} style={{ background: 'rgba(250,247,242,0.7)', color: p.ink, border: `1px solid ${p.line}`, padding: isPhone ? '14px 22px' : '17px 24px', borderRadius: 99, fontSize: isPhone ? 14 : 15, fontWeight: 500, cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              {t('How it works', 'Cómo funciona')}
            </button>
          </div>
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: isPhone ? 10 : 14, flexWrap: 'wrap', fontFamily: type.mono, fontSize: 12, color: p.inkSoft }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: '#7AB388', animation: 'glossiPulse 2s ease-in-out infinite' }} />
              <strong style={{ color: p.ink, fontWeight: 600 }}>1,400+ {t('salons', 'salones')}</strong>
            </span>
            <span style={{ width: 4, height: 4, borderRadius: 99, background: p.line }} />
            <strong style={{ color: p.ink, fontWeight: 600 }}>4 {t('cities', 'ciudades')}</strong>
            <span style={{ width: 4, height: 4, borderRadius: 99, background: p.line }} />
            <span>{t('avg response in 11 min', 'respuesta promedio en 11 min')}</span>
          </div>
        </div>
      </div>
    </section>
  );

  // ── Services grid ──
  // 8 photo cards, 4 cols on desktop / 2 cols on phone. Each card carries
  // its own accent color (from ACCENTS) as the chip + corner swatch tint;
  // the photo itself sits over a same-color base so 404s degrade nicely.
  const ServiceCard = ({ s, color, idx }) => {
    const [hover, setHover] = useState(false);
    return (
      <div
        onClick={() => openModal(lang === 'es' ? s.es : s.en)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative', cursor: 'pointer', overflow: 'hidden',
          borderRadius: 16, background: color,
          aspectRatio: '4/5',
          transform: hover && !isPhone ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hover && !isPhone ? `0 20px 40px rgba(26,23,20,0.16)` : `0 2px 8px rgba(26,23,20,0.04)`,
          transition: 'transform 240ms cubic-bezier(0.2,0.7,0.2,1), box-shadow 240ms ease',
        }}
      >
        <img src={s.photo} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hover && !isPhone ? 'scale(1.04)' : 'scale(1)', transition: 'transform 320ms cubic-bezier(0.2,0.7,0.2,1)' }} />
        {/* Tinted overlay so the photo reads as its accent family */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%), ${color}`, mixBlendMode: 'multiply', opacity: 0.45 }} />
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.92)', color: p.ink, padding: '5px 10px', borderRadius: 99, fontFamily: type.mono, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em', backdropFilter: 'blur(4px)' }}>
          {lang === 'es' ? s.bidsEs : s.bidsEn}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 99, background: color, border: '2px solid rgba(255,255,255,0.85)' }} />
        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, color: '#fff' }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 30, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1 }}>{lang === 'es' ? s.es : s.en}</div>
          <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 4, lineHeight: 1.35 }}>{lang === 'es' ? s.subEs : s.subEn}</div>
        </div>
      </div>
    );
  };

  const Services = () => (
    <section style={{ padding: isPhone ? '48px 18px' : '80px 64px' }}>
      <SectionHead
        kicker={t('What are you booking?', '¿Qué vas a reservar?')}
        title={t('Eight rooms. One front door.', 'Ocho salas. Una sola puerta.')}
        sub={t(
          'Every category is open to the network. Pick what you want, set your floor, watch the bids land.',
          'Cada categoría está abierta a la red. Elige lo que quieres, pon tu tope, mira llegar las ofertas.'
        )}
      />
      <div style={{ display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isPhone ? 12 : 18, marginTop: isPhone ? 28 : 44 }}>
        {SERVICES.map((s, i) => <ServiceCard key={i} s={s} color={ACCENTS[i]} idx={i} />)}
      </div>
    </section>
  );

  // ── Valley Pulse ──
  // Dark band with live count-up stats. Mirror of the prior homepage's
  // section but presented on `p.ink` rather than `p.surface` for higher
  // contrast and an "operations dashboard" feel.
  const Pulse = () => (
    <section style={{ background: p.ink, color: p.bg, padding: isPhone ? '56px 18px' : '96px 64px' }}>
      <SectionHead
        kicker={t('Valley Pulse', 'Pulso del Valle')}
        title={t('Live, from the chairs across the Valley.', 'En vivo, desde las sillas de todo el Valle.')}
        sub={t(
          'Aggregated in real time across McAllen, Edinburg, Brownsville and Harlingen.',
          'Datos en tiempo real de McAllen, Edinburg, Brownsville y Harlingen.'
        )}
        invert
      />
      <div style={{ display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isPhone ? 14 : 24, marginTop: isPhone ? 32 : 48 }}>
        {PULSE_BASE.map((stat, i) => (
          <div key={i} style={{ borderLeft: !isPhone && i > 0 ? `0.5px solid rgba(242,235,224,0.18)` : 0, paddingLeft: !isPhone && i > 0 ? 24 : 0 }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 44 : 64, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 1, color: p.bg }}>
              <CountUp value={pulse[i]} />
              {stat.suffix && <span style={{ fontSize: '0.5em', marginLeft: 4 }}>{stat.suffix}</span>}
            </div>
            <Sparkline seed={i} color={p.accent} />
            <div style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 600, color: 'rgba(242,235,224,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 10, lineHeight: 1.4 }}>
              {lang === 'es' ? stat.es : stat.en}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: isPhone ? 28 : 40, fontFamily: type.mono, fontSize: 11, color: 'rgba(242,235,224,0.55)', letterSpacing: '0.06em', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: '#7AB388', animation: 'glossiPulse 1.8s ease-in-out infinite' }} />
          {t('Updated every 30 seconds', 'Actualizado cada 30 segundos')}
        </span>
        <span>RGV · {new Date().toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    </section>
  );

  // ── Compare table (Old way vs Glossi) ──
  const Compare = () => (
    <section style={{ padding: isPhone ? '48px 18px' : '96px 64px' }}>
      <SectionHead
        kicker={t('Old way vs. Glossi', 'El método viejo vs. Glossi')}
        title={t('Stop hunting. Start choosing.', 'Deja de buscar. Empieza a elegir.')}
      />
      <div style={{ marginTop: isPhone ? 28 : 48, display: 'grid', gap: 0, maxWidth: 960, marginLeft: 'auto', marginRight: 'auto', borderTop: `0.5px solid ${p.line}` }}>
        {COMPARE.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 56px 1fr', alignItems: 'center', borderBottom: `0.5px solid ${p.line}`, padding: isPhone ? '18px 0' : '28px 0', gap: isPhone ? 8 : 0 }}>
            <div style={{ color: p.inkMuted, fontSize: isPhone ? 14 : 17, lineHeight: 1.45, textDecoration: isPhone ? 'none' : 'line-through' }}>{lang === 'es' ? row.oldEs : row.oldEn}</div>
            {!isPhone && <div style={{ textAlign: 'center', color: p.accent, fontSize: 20 }}>→</div>}
            <div style={{ color: p.ink, fontSize: isPhone ? 15.5 : 18, lineHeight: 1.45, fontWeight: 500, fontFamily: type.display, fontStyle: 'italic' }}>{lang === 'es' ? row.newEs : row.newEn}</div>
          </div>
        ))}
      </div>
    </section>
  );

  // ── Field Guide ──
  // 4 editorial cards. First one is the feature (full-width on phone,
  // 2-col on desktop). Routes link out to /editorial — the listing page
  // already exists; the actual articles wire up via add-bylined-article.
  const Guide = () => (
    <section style={{ background: p.surface2, padding: isPhone ? '48px 18px' : '96px 64px' }}>
      <SectionHead
        kicker={t('Field Guide', 'Guía de campo')}
        title={t('From the editors.', 'Desde la redacción.')}
        sub={t(
          'Service maps, color theory, and the quiet etiquette of getting a great chair.',
          'Mapas de servicios, teoría del color y la etiqueta silenciosa de conseguir una buena silla.'
        )}
      />
      {/* 4 uniform cards. Phone = 1-col stack, desktop = 4-across strip so
          each image stays modest (~4/3 at quarter width) and the grid is
          always balanced — no stranded card, no oversized feature. */}
      <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : 'repeat(4, 1fr)', gap: isPhone ? 14 : 20, marginTop: isPhone ? 28 : 44 }}>
        {GUIDE.map((g, i) => (
          <Link
            key={i}
            to="/editorial"
            style={{
              background: p.bg, borderRadius: 16, overflow: 'hidden', textDecoration: 'none', color: p.ink,
              display: 'flex', flexDirection: 'column',
              border: `0.5px solid ${p.line}`,
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={e => { if (!isPhone) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(26,23,20,0.08)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ aspectRatio: '4/3', background: ACCENTS[(i + 2) % ACCENTS.length], overflow: 'hidden', position: 'relative' }}>
              <img src={g.photo} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: isPhone ? 16 : 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: p.accent, textTransform: 'uppercase' }}>{lang === 'es' ? g.tagEs : g.tagEn}</span>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 20, fontWeight: type.displayWeight, letterSpacing: '-0.015em', lineHeight: 1.15, margin: '10px 0 14px', textWrap: 'balance' }}>{lang === 'es' ? g.titleEs : g.titleEn}</div>
              <div style={{ marginTop: 'auto', fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.04em' }}>{lang === 'es' ? g.readEs : g.readEn}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );

  // ── Salon pitch ──
  // Dark recruit section. founderCount stays wired to the supabase RPC so
  // it tracks real signups (same source as /pros).
  const Pitch = () => (
    <section style={{ background: p.ink, color: p.bg, padding: isPhone ? '56px 18px' : '96px 64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: isPhone ? 28 : 64, alignItems: 'center' }}>
        <div style={{ position: 'relative', aspectRatio: isPhone ? '4/3' : '4/5', borderRadius: 20, overflow: 'hidden', background: `linear-gradient(135deg, ${ACCENTS[1]}, ${ACCENTS[5]})`, order: isPhone ? 2 : 1 }}>
          <img src={PITCH_PHOTO} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ order: isPhone ? 1 : 2 }}>
          <span style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent, textTransform: 'uppercase' }}>
            {t('For salon owners', 'Para dueños de salón')}
          </span>
          <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 'clamp(40px, 4.4vw, 64px)', fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.96, margin: '14px 0 18px', textWrap: 'balance', color: p.bg }}>
            {t('You set your floor. We bring the chair.', 'Tú pones tu piso. Nosotros traemos la silla.')}
          </h2>
          <p style={{ fontSize: isPhone ? 14.5 : 17, color: 'rgba(242,235,224,0.78)', lineHeight: 1.55, margin: '0 0 22px', maxWidth: 520 }}>
            {t(
              'Glossi fills your slow hours without touching your full ones. No subscription. No lead fees. You only pay when a chair lifts.',
              'Glossi llena tus horas lentas sin tocar las ocupadas. Sin suscripción. Sin tarifas por lead. Solo pagas cuando una silla se levanta.'
            )}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              t('Quote in 30 seconds — from your phone, between clients.',
                'Cotiza en 30 segundos — desde tu teléfono, entre clientes.'),
              t("Choose which categories, hours, and price floors you'll accept.",
                'Elige qué categorías, horarios y precios mínimos aceptas.'),
              t('Verified, deposit-secured clients only. Cancellation protection built in.',
                'Solo clientas verificadas con depósito. Protección contra cancelaciones incluida.'),
            ].map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 14.5, color: 'rgba(242,235,224,0.92)', lineHeight: 1.5 }}>
                <span style={{ fontFamily: type.mono, color: p.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', minWidth: 24, paddingTop: 3 }}>0{i + 1}</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/signup?role=salon')} style={{ background: p.bg, color: p.ink, border: 0, padding: '14px 22px', borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {t('List your business', 'Inscribe tu salón')}
              <span style={{ fontSize: 15 }}>→</span>
            </button>
            <button onClick={() => navigate('/pros')} style={{ background: 'transparent', color: p.bg, border: '1px solid rgba(242,235,224,0.3)', padding: '13px 20px', borderRadius: 99, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              {t('See the salon dashboard', 'Ver panel del salón')}
            </button>
          </div>
          {founderCount > 0 && (
            <div style={{ marginTop: 22, fontFamily: type.mono, fontSize: 11, color: 'rgba(242,235,224,0.5)', letterSpacing: '0.06em' }}>
              {t(`${founderCount} salons already in the founding cohort`, `${founderCount} salones ya en la cohorte fundadora`)}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  // ── Live ticker ──
  // Single-row marquee; doubled list loops seamlessly via CSS keyframes
  // already declared in index.html (`glossiTicker`).
  const Ticker = () => {
    const items = lang === 'es' ? TICKER_ES : TICKER_EN;
    const doubled = [...items, ...items];
    return (
      <div style={{ background: p.ink, color: p.bg, padding: '14px 0', borderTop: `0.5px solid rgba(242,235,224,0.12)`, borderBottom: `0.5px solid rgba(242,235,224,0.12)`, overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: type.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.accent, position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', background: p.ink, zIndex: 2, paddingRight: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: p.accent, animation: 'glossiPulse 1.4s ease-in-out infinite' }} />
          {t('LIVE', 'EN VIVO')}
        </div>
        <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', width: 'max-content', animation: 'glossiTicker 60s linear infinite', paddingLeft: 96, fontFamily: type.mono, fontSize: isPhone ? 11 : 12.5, letterSpacing: '0.02em' }}>
          {doubled.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'rgba(242,235,224,0.82)' }}>
              <span style={{ width: 4, height: 4, borderRadius: 99, background: p.accent }} />
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // ── Footer ──
  const Footer = () => (
    <footer style={{ background: p.bg, padding: isPhone ? '40px 18px 32px' : '64px 64px 48px', borderTop: `0.5px solid ${p.line}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.4fr 1fr', gap: isPhone ? 28 : 48, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 64 : 96, fontWeight: type.displayWeight, letterSpacing: '-0.04em', lineHeight: 0.9, color: p.ink }}>
            glossi<span style={{ color: p.accent }}>.</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: p.inkSoft, maxWidth: '36ch' }}>
            {t('Glossi — built in the Rio Grande Valley.', 'Glossi — hecho en el Valle del Río Grande.')}
          </div>
        </div>
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.06em', lineHeight: 1.7, textAlign: isPhone ? 'left' : 'right' }}>
          © 2026 · McAllen · Edinburg · Brownsville · Harlingen<br />
          <span style={{ opacity: 0.7 }}>built in the rgv</span>
        </div>
      </div>
    </footer>
  );

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      <Nav />
      <Hero />
      <Services />
      <Pulse />
      <Compare />
      <Guide />
      <Pitch />
      <Ticker />
      <Footer />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      {modalOpen && (
        <BidModal
          lang={lang}
          initialService={modalService}
          onClose={() => setModalOpen(false)}
          onRealRequest={() => { setModalOpen(false); navigate('/request'); }}
        />
      )}
    </div>
  );
}

// ── Demo Bid Modal ────────────────────────────────────────────────────────
// Simulated request-to-bid flow used as the homepage CTA. Visitors can
// post a fake request, watch five bids arrive in real time, and "accept"
// one — all without an account. Success screen routes to the real /request.
function BidModal({ lang, initialService, onClose, onRealRequest }) {
  const isPhone = useNarrow();
  const tl = (en, es) => lang === 'en' ? en : es;

  const serviceList = [
    tl('Hair','Cabello'), tl('Color','Color'), tl('Nails','Uñas'),
    tl('Lashes','Pestañas'), tl('Brows','Cejas'), tl('Barber','Barbería'),
    tl('Makeup','Maquillaje'), tl('Skin','Piel'),
  ];
  const whenList = [tl('Today','Hoy'), tl('This week','Esta semana'), tl('Next week','La próxima semana'), tl('Flexible','Flexible')];

  const defaultService = initialService || tl('Color', 'Color');
  const [service, setService] = useState(serviceList.includes(defaultService) ? defaultService : serviceList[1]);
  const [ceiling, setCeiling] = useState(200);
  const [when, setWhen]   = useState(whenList[0]);
  const [zip, setZip]     = useState('');
  const [stage, setStage] = useState('form'); // form | bidding | success
  const [bids, setBids]   = useState([]);
  const [accepted, setAccepted] = useState(null);

  // Esc to close
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const postRequest = () => {
    setStage('bidding');
    setBids([]);
    const times = [
      tl('Today 4:30p','Hoy 4:30p'), tl('Today 6:15p','Hoy 6:15p'),
      tl('Tomorrow 11a','Mañana 11a'), tl('Tomorrow 2p','Mañana 2p'),
      tl('Fri 10a','Vie 10a'),
    ];
    [600, 1500, 2800, 4400, 6500].forEach((delay, i) => {
      setTimeout(() => {
        const salon = DEMO_SALONS[(i * 3 + 1) % DEMO_SALONS.length];
        const price = Math.round(ceiling * (0.55 + i * 0.07 + Math.random() * 0.06));
        setBids(cur => [...cur, { ...salon, price, time: times[i] }]);
      }, delay);
    });
  };

  const acceptBid = bid => { setAccepted(bid); setStage('success'); };

  const chip = active => ({
    background: active ? p.ink : 'transparent',
    color: active ? p.bg : p.inkSoft,
    border: `0.5px solid ${active ? p.ink : p.line}`,
    padding: '7px 13px', borderRadius: 99,
    fontSize: 12.5, fontWeight: active ? 600 : 400,
    cursor: 'pointer', fontFamily: type.body,
    transition: 'all 140ms ease',
  });

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,23,20,0.6)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isPhone ? 12 : 20,
        animation: 'glossiBackdropIn 180ms ease both',
      }}
    >
      <div style={{
        background: p.surface, borderRadius: 24, width: '100%', maxWidth: 520,
        boxShadow: '0 40px 90px rgba(26,23,20,0.32)',
        display: 'flex', flexDirection: 'column',
        maxHeight: isPhone ? '92vh' : '86vh',
        animation: 'glossiModalIn 220ms cubic-bezier(0.2,0.8,0.2,1) both',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 24px 18px', borderBottom: `0.5px solid ${p.line}`,
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 21, letterSpacing: '-0.02em', color: p.ink }}>
            {stage === 'success'
              ? tl('Booking confirmed', '¡Reserva confirmada!')
              : tl('Post a request', 'Publica una solicitud')}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 0, cursor: 'pointer', color: p.inkMuted, fontSize: 22, lineHeight: 1, padding: '2px 8px' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px 28px', overflowY: 'auto', flex: 1 }}>

          {/* ── FORM ── */}
          {stage === 'form' && (
            <>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.accent, textTransform: 'uppercase', marginBottom: 10 }}>
                  {tl('What service?', '¿Qué servicio?')}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {serviceList.map(s => <button key={s} onClick={() => setService(s)} style={chip(service === s)}>{s}</button>)}
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.accent, textTransform: 'uppercase', marginBottom: 10 }}>
                  {tl('Your budget ceiling', 'Tu presupuesto máximo')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 42, letterSpacing: '-0.03em', color: p.ink, minWidth: 90 }}>${ceiling}</span>
                  <div style={{ flex: 1 }}>
                    <input type="range" min={40} max={500} step={5} value={ceiling}
                      onChange={e => setCeiling(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: p.accent }} />
                    <div style={{ fontFamily: type.mono, fontSize: 10, color: p.inkMuted, marginTop: 4, lineHeight: 1.4 }}>
                      {tl('Salons bid at or below this. You pick the winner.', 'Los salones ofrecen igual o menos. Tú eliges al ganador.')}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.accent, textTransform: 'uppercase', marginBottom: 10 }}>
                  {tl('When & where?', '¿Cuándo y dónde?')}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 10 }}>
                  {whenList.map(w => <button key={w} onClick={() => setWhen(w)} style={chip(when === w)}>{w}</button>)}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder={tl('ZIP code', 'Código postal')}
                  value={zip}
                  onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: p.surface2, border: `0.5px solid ${zip.length === 5 ? p.accent : p.line}`,
                    borderRadius: 10, padding: '11px 14px',
                    fontSize: 14, color: p.ink, fontFamily: type.body,
                    outline: 'none', transition: 'border-color 160ms ease',
                  }}
                />
              </div>

              <button onClick={postRequest} style={{
                width: '100%', background: p.ink, color: p.bg, border: 0,
                padding: '16px 24px', borderRadius: 99, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                {tl('Post request', 'Publicar solicitud')} <span style={{ fontSize: 17 }}>→</span>
              </button>
            </>
          )}

          {/* ── BIDDING ── */}
          {stage === 'bidding' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 12 }}>
                <div>
                  <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, color: p.ink }}>{service} · {zip || tl('your area','tu zona')} · {when}</div>
                  <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, marginTop: 4 }}>
                    {tl('Ceiling', 'Tope')}: ${ceiling}
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: type.mono, fontSize: 11, fontWeight: 600, color: bids.length > 0 ? '#3D7A4E' : p.inkMuted, background: p.surface2, padding: '6px 11px', borderRadius: 99, flexShrink: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: bids.length > 0 ? '#7AB388' : p.line, animation: bids.length > 0 ? 'glossiPulse 1.4s ease-in-out infinite' : 'none' }} />
                  {bids.length} {tl('bid(s)', 'oferta(s)')}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {bids.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '36px 0', color: p.inkMuted, fontFamily: type.mono, fontSize: 12 }}>
                    <div style={{ fontSize: 26, marginBottom: 12 }}>⏳</div>
                    {tl('Sending to salons…', 'Enviando a los salones…')}
                  </div>
                )}
                {bids.map((bid, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '42px 1fr auto auto',
                    alignItems: 'center', gap: 12,
                    padding: '13px 15px', background: p.surface2, borderRadius: 14,
                    border: `0.5px solid ${p.line}`,
                    animation: 'glossiSlideIn 280ms cubic-bezier(0.2,0.8,0.2,1) both',
                  }}>
                    <div style={{ width: 42, height: 42, borderRadius: 99, background: `linear-gradient(135deg, ${ACCENTS[i % ACCENTS.length]}, ${ACCENTS[(i + 3) % ACCENTS.length]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontStyle: 'italic', fontSize: 14, fontWeight: 700, color: p.ink, flexShrink: 0 }}>
                      {bid.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: p.ink }}>{bid.name}</span>
                        <span style={{ color: p.accent, fontSize: 11 }}>★ {bid.stars}</span>
                      </div>
                      <div style={{ fontFamily: type.mono, fontSize: 10.5, color: p.inkMuted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {bid.area} · {bid.reviews} {tl('reviews', 'reseñas')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, letterSpacing: '-0.02em', color: p.ink }}>${bid.price}</div>
                      <div style={{ fontFamily: type.mono, fontSize: 10, color: p.inkMuted }}>{bid.time}</div>
                    </div>
                    <button onClick={() => acceptBid(bid)} style={{
                      background: p.ink, color: p.bg, border: 0,
                      padding: '9px 14px', borderRadius: 99,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                    }}>
                      {tl('Accept', 'Aceptar')}
                    </button>
                  </div>
                ))}
                {bids.length > 0 && bids.length < 5 && (
                  <div style={{ textAlign: 'center', padding: '10px 0', color: p.inkMuted, fontFamily: type.mono, fontSize: 11 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: '#7AB388', animation: 'glossiPulse 1.4s ease-in-out infinite' }} />
                      {tl('More bids arriving…', 'Más ofertas en camino…')}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── SUCCESS ── */}
          {stage === 'success' && accepted && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 99, background: '#EDF5F0', color: '#3D7A4E', fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>✓</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 28, letterSpacing: '-0.02em', color: p.ink, marginBottom: 8 }}>
                {tl('Booking confirmed', '¡Reserva confirmada!')}
              </div>
              <p style={{ color: p.inkSoft, fontSize: 14, lineHeight: 1.5, marginBottom: 24, maxWidth: '34ch', marginLeft: 'auto', marginRight: 'auto' }}>
                {tl("You'd get a confirmation text + deposit link from the salon.", "Recibirías un mensaje de confirmación y enlace de depósito del salón.")}
              </p>
              <div style={{ background: p.surface2, border: `0.5px solid ${p.line}`, borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 99, background: `linear-gradient(135deg, ${ACCENTS[0]}, ${ACCENTS[3]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontStyle: 'italic', fontSize: 18, color: p.ink, flexShrink: 0 }}>
                  {accepted.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: p.ink }}>{accepted.name}</div>
                  <div style={{ fontFamily: type.mono, fontSize: 12, color: p.inkMuted, marginTop: 2 }}>{accepted.area} · {accepted.time}</div>
                </div>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 28, color: p.ink, flexShrink: 0 }}>${accepted.price}</div>
              </div>
              <button onClick={onRealRequest} style={{
                width: '100%', background: p.ink, color: p.bg, border: 0,
                padding: '16px 24px', borderRadius: 99, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                {tl('Try it for real', 'Úsalo de verdad')} <span style={{ fontSize: 16 }}>→</span>
              </button>
              <div style={{ marginTop: 12, fontFamily: type.mono, fontSize: 11, color: p.inkMuted }}>
                {tl('This was a demo — no account needed to try.', 'Esto fue una demo — no necesitas cuenta para probar.')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shared section heading ──
// Same shape used across Services / Pulse / Compare / Guide. `invert` flips
// for dark backgrounds (Pulse, Pitch).
function SectionHead({ kicker, title, sub, invert }) {
  const isPhone = useNarrow();
  const inkColor   = invert ? p.bg                    : p.ink;
  const softColor  = invert ? 'rgba(242,235,224,0.72)' : p.inkSoft;
  const accentColor = invert ? p.accent               : p.accent;
  return (
    <div style={{ maxWidth: 760 }}>
      <span style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: accentColor, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: accentColor }} />
        {kicker}
      </span>
      <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 34 : 'clamp(40px, 4.6vw, 64px)', fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.96, margin: '14px 0 0', textWrap: 'balance', color: inkColor }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: isPhone ? 14.5 : 17, color: softColor, lineHeight: 1.55, margin: '16px 0 0', maxWidth: 580, textWrap: 'pretty' }}>
          {sub}
        </p>
      )}
    </div>
  );
}
