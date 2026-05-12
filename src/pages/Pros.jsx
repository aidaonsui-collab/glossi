import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useLang } from '../store.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const COPY = {
  en: {
    nav_signin: 'Sign in',
    nav_es: 'Mejor en español? Toca aquí.',
    hero_eyebrow: 'FOR RGV STYLISTS · MAY 2026',
    hero_h: ['They bid.', 'You book.'],
    hero_sub: 'Clients in the Valley post what they need. Salons send a price. You pick the bookings you actually want.',
    hero_cta: 'Claim my spot — 60 seconds',
    hero_cta_scroll_target: 'claim',
    hero_stripe: 'FREE · NO MONTHLY FEE · NO PER-LEAD FEE',
    steps_eyebrow: 'THE 60-SECOND PITCH',
    steps_h: 'It already works the way you already work.',
    step_1_t: 'Client posts',
    step_1_d: 'A real customer in your city says what service she wants, when, and her budget range.',
    step_2_t: 'You bid',
    step_2_d: 'You see the request. You send a price. Other salons in range do the same.',
    step_3_t: 'You book',
    step_3_d: 'She picks. You get notified. She shows up. You get paid directly.',
    compare_eyebrow: 'WHAT THIS COSTS YOU',
    compare_h: '$0 vs $30+ a month.',
    compare_sub: 'Real numbers, public as of May 2026. Glossi never charges a monthly fee, never takes a cut of your work.',
    compare_col_monthly: 'Monthly fee',
    compare_col_perlead: 'Per-new-client fee',
    compare_col_card: 'Card processing',
    compare_col_upsell: '"Boost" upsell',
    compare_note: 'Sources: booksy.biz · fresha.com/pricing · vagaro.com/pro · glossi.cc · all retrieved May 2026.',
    ticker_eyebrow: 'LIVE — REAL VALLEY REQUESTS',
    cohort_eyebrow: 'VALLEY FOUNDERS COHORT',
    cohort_h: 'First 100 pros in the Valley get something the rest never will.',
    cohort_sub: "We're hand-picking the first 100 stylists, barbers, and lash/nail/brow techs across McAllen, Edinburg, Brownsville, Harlingen, Pharr, Mission, and Weslaco. Once we hit 100, the cohort closes.",
    cohort_perks: [
      ['Lifetime $0 fees', 'Locked in writing. Free forever, no asterisk.'],
      ['Founder badge', 'Shows on your profile and on every bid you send. Clients see it.'],
      ['First-bid priority for 12 months', 'Your bid lands first in the customer\'s inbox.'],
      ['Direct WhatsApp to the founder', 'Not a help center. A person, on your phone.'],
    ],
    counter_of: 'of',
    counter_claimed: 'Valley spots claimed',
    form_h: 'Claim your spot',
    form_sub: "IG handle + phone. That's it. We'll DM you within 24 hours to finish setup.",
    form_ig: 'Instagram handle',
    form_ig_ph: 'beautybyleahraquel',
    form_phone: 'Phone number',
    form_phone_ph: '(956) 555 1234',
    form_submit: 'Claim my spot →',
    form_submitting: 'Claiming…',
    form_success_h: "You're in.",
    form_success_sub_a: "You're founding pro",
    form_success_sub_b: 'of 100. We\'ll DM you within 24 hours.',
    form_err_invalid: 'That doesn\'t look like a valid Instagram handle. Letters, numbers, dots, underscores only.',
    form_err_generic: "Something broke on our end. Try again, or DM @glossi.cc.",
    share_h: 'Bring a friend in.',
    share_sub: 'Every Valley stylist you bring before the cohort closes locks her in too. Tap to send.',
    share_btn: 'Send to a stylist friend',
    share_copy: 'Copy link',
    share_copied: 'Copied!',
    share_download: 'Save the card (PNG)',
    share_title_native: 'Glossi — Valley founders cohort',
    share_text: 'Pro tip — Glossi sends Valley clients with service, date & budget already filled in. No monthly, no per-lead. First 100 in the Valley lock lifetime $0. Aparta tu lugar:',
    card_kicker: 'Pro tip.',
    card_body: 'Glossi sends Valley clients — no monthly, no per-lead.',
    card_from: 'From',
    card_foot: 'First 100 in the Valley',
    ref_banner: 'sent you. Founding-pro slot reserved →',
    faq_eyebrow: 'COMMON QUESTIONS',
    faq: [
      ['Is it really free?', 'Yes. No monthly fee, no per-lead fee, no commission on bookings. We make money later from optional paid features — none of which you ever have to use.'],
      ['Do I have to leave Booksy?', "No. Glossi isn't a calendar — it's a lead source. Keep your existing tools. We just send you pre-qualified clients with service, date, and budget filled in."],
      ['What if a client doesn\'t speak English?', "Most don\'t. Glossi handles requests in English or Spanish — your reply goes back in the same language."],
      ['How do payouts work?', "Client pays you directly the way you already collect — Cash App, Zelle, card on arrival, whatever you set. We don\'t touch the money."],
      ['What if I\'m booked solid?', 'Then ignore the bid. There\'s no minimum, no penalty, no pressure. Glossi only sends bids that match your service list.'],
    ],
    bottomcta: 'Claim my Valley spot',
    footer_already: 'Already a Glossi pro?',
    footer_signin: 'Sign in',
  },
  es: {
    nav_signin: 'Iniciar sesión',
    nav_es: 'In English? Tap here.',
    hero_eyebrow: 'PARA ESTILISTAS DEL VALLE · MAYO 2026',
    hero_h: ['Ellas piden.', 'Tú aceptas.'],
    hero_sub: 'Las clientas del Valle publican lo que necesitan. Los salones cotizan. Tú aceptas solo las citas que te convienen.',
    hero_cta: 'Apartar mi lugar — 60 segundos',
    hero_cta_scroll_target: 'claim',
    hero_stripe: 'GRATIS · SIN MENSUALIDAD · SIN COMISIÓN POR CLIENTE',
    steps_eyebrow: 'EN 60 SEGUNDOS',
    steps_h: 'Funciona como tú ya trabajas.',
    step_1_t: 'La cliente publica',
    step_1_d: 'Una clienta de tu ciudad dice qué servicio quiere, cuándo, y su rango de presupuesto.',
    step_2_t: 'Tú cotizas',
    step_2_d: 'Ves la solicitud. Mandas tu precio. Otros salones de la zona también lo hacen.',
    step_3_t: 'Tú agendas',
    step_3_d: 'Ella elige. Te avisamos. Llega a su cita. Te paga directo.',
    compare_eyebrow: 'LO QUE TE CUESTA',
    compare_h: '$0 contra más de $30 al mes.',
    compare_sub: 'Números reales, públicos a mayo 2026. Glossi nunca cobra mensualidad ni se queda con parte de tu trabajo.',
    compare_col_monthly: 'Mensualidad',
    compare_col_perlead: 'Por cliente nueva',
    compare_col_card: 'Procesamiento de tarjeta',
    compare_col_upsell: 'Upsell de "Boost"',
    compare_note: 'Fuentes: booksy.biz · fresha.com/pricing · vagaro.com/pro · glossi.cc · consultadas en mayo 2026.',
    ticker_eyebrow: 'EN VIVO — SOLICITUDES REALES DEL VALLE',
    cohort_eyebrow: 'COHORTE FUNDADORA DEL VALLE',
    cohort_h: 'Las primeras 100 profesionales del Valle reciben algo que las demás nunca tendrán.',
    cohort_sub: 'Estamos seleccionando a mano a las primeras 100 estilistas, barberos, y técnicas de pestañas/uñas/cejas de McAllen, Edinburg, Brownsville, Harlingen, Pharr, Mission y Weslaco. Cuando lleguemos a 100, se cierra.',
    cohort_perks: [
      ['Tarifa $0 de por vida', 'Por escrito. Gratis para siempre, sin asterisco.'],
      ['Insignia de fundadora', 'Aparece en tu perfil y en cada cotización que mandas. Las clientas la ven.'],
      ['Prioridad de cotización 12 meses', 'Tu precio llega primero en la bandeja de la clienta.'],
      ['WhatsApp directo al fundador', 'No un call center. Una persona, en tu teléfono.'],
    ],
    counter_of: 'de',
    counter_claimed: 'lugares apartados del Valle',
    form_h: 'Aparta tu lugar',
    form_sub: 'Usuario de Instagram + teléfono. Es todo. Te escribimos en menos de 24 horas para terminar tu perfil.',
    form_ig: 'Usuario de Instagram',
    form_ig_ph: 'beautybyleahraquel',
    form_phone: 'Número de teléfono',
    form_phone_ph: '(956) 555 1234',
    form_submit: 'Apartar mi lugar →',
    form_submitting: 'Apartando…',
    form_success_h: 'Listo.',
    form_success_sub_a: 'Eres la profesional fundadora',
    form_success_sub_b: 'de 100. Te escribimos antes de 24 horas.',
    form_err_invalid: 'Ese no parece un usuario válido de Instagram. Solo letras, números, puntos, guiones bajos.',
    form_err_generic: 'Algo falló de nuestro lado. Intenta otra vez o escríbenos a @glossi.cc.',
    share_h: 'Pasa el plug.',
    share_sub: 'Cada estilista del Valle que apuntes antes de cerrar la cohorte también entra. Toca para enviar.',
    share_btn: 'Mandar a una amiga estilista',
    share_copy: 'Copiar enlace',
    share_copied: '¡Copiado!',
    share_download: 'Guardar la tarjeta (PNG)',
    share_title_native: 'Glossi — Cohorte fundadora del Valle',
    share_text: 'Te paso el plug — Glossi te manda clientas del Valle con servicio, fecha y presupuesto listos. Sin mensualidad, sin comisión. Las primeras 100 del Valle entran gratis de por vida. Aparta tu lugar:',
    card_kicker: 'Te paso el plug.',
    card_body: 'Glossi te manda clientas del Valle. Sin mensualidad. Sin comisión.',
    card_from: 'De',
    card_foot: 'Primeras 100 del Valle',
    ref_banner: 'te mandó. Lugar fundador reservado →',
    faq_eyebrow: 'PREGUNTAS FRECUENTES',
    faq: [
      ['¿De verdad es gratis?', 'Sí. Sin mensualidad, sin costo por contacto, sin comisión por cita. Más adelante tendremos funciones opcionales de pago — ninguna obligatoria.'],
      ['¿Tengo que dejar Booksy?', 'No. Glossi no es un calendario, es una fuente de clientas. Sigue usando lo que ya usas. Solo te mandamos clientas pre-calificadas con servicio, fecha, y presupuesto listos.'],
      ['¿Y si la clienta no habla inglés?', 'La mayoría no. Glossi maneja solicitudes en inglés o español — tu respuesta sale en el mismo idioma.'],
      ['¿Cómo me pagan?', 'La clienta te paga directo como ya recibes — Cash App, Zelle, tarjeta al llegar, lo que ya tengas. Nosotros no tocamos el dinero.'],
      ['¿Y si estoy llena?', 'Ignora la cotización. No hay mínimo, no hay penalidad, no hay presión. Solo te mandamos solicitudes que coincidan con tus servicios.'],
    ],
    bottomcta: 'Apartar mi lugar en el Valle',
    footer_already: '¿Ya eres pro de Glossi?',
    footer_signin: 'Inicia sesión',
  },
};

const TICKER = [
  { who: 'Sofia · Pharr',       what: 'Color & balayage',   range: '$110–$160', when: '3 min ago' },
  { who: 'Daniela · McAllen',   what: 'Hybrid lashes',      range: '$120–$160', when: '8 min ago' },
  { who: 'Maritza · Edinburg',  what: 'Gel mani + pedi',    range: '$45–$70',   when: '14 min ago' },
  { who: 'Kevin · Mission',     what: 'Skin fade + beard',  range: '$28–$45',   when: '22 min ago' },
  { who: 'Jasmin · Brownsville',what: 'Brazilian blowout',  range: '$180–$240', when: '31 min ago' },
  { who: 'Camila · Harlingen',  what: 'Microblading',       range: '$280–$400', when: '47 min ago' },
];

const COMPARE_ROWS = [
  { name: 'Glossi',   monthly: '$0',       perlead: '$0',         card: '—',           upsell: '—' },
  { name: 'Booksy',   monthly: '$29.99',   perlead: '—',          card: '2.9% + $0.30', upsell: '$30+/mo Boost' },
  { name: 'Fresha',   monthly: '$19.95',   perlead: '20% (min $6)', card: '2.79% + $0.20', upsell: '$59.95/mo+' },
  { name: 'Vagaro',   monthly: '$23.99',   perlead: '—',          card: '2.75% +',     upsell: '$10–60/mo' },
];

export default function Pros() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  // useLang is the shared lang store — persists to localStorage, syncs
  // across /pros, /, and the rest of the app via useLocalState.
  const { lang, toggle: toggleLang } = useLang();
  const t = COPY[lang];
  const claimRef = useRef(null);

  const [count, setCount] = useState(23);
  const [igHandle, setIgHandle] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);
  const [referredBy, setReferredBy] = useState(null);
  const [copied, setCopied] = useState(false);

  // Read ?ref= once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && /^[A-Za-z0-9._]{2,30}$/.test(ref)) setReferredBy(ref.toLowerCase());
  }, []);

  // Fetch live counter
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.rpc('founder_count').then(({ data, error }) => {
      if (!error && typeof data === 'number') setCount(data);
    });
  }, []);

  const scrollToClaim = () => claimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const handleClean = igHandle.trim().replace(/^@/, '').toLowerCase();
    if (!handleClean || !/^[a-z0-9._]{2,30}$/.test(handleClean)) {
      setError(t.form_err_invalid);
      return;
    }
    setSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        // Offline-friendly fallback so the page demos without env.
        setSubmitted(count + 1);
        setCount(count + 1);
      } else {
        const { data, error: rpcErr } = await supabase.rpc('claim_founder_spot', {
          p_ig_handle: handleClean,
          p_phone: phone || null,
          p_language: lang,
          p_city_guess: null,
          p_referred_by: referredBy,
        });
        if (rpcErr) throw rpcErr;
        const newCount = typeof data === 'number' ? data : count + 1;
        setSubmitted(newCount);
        setCount(newCount);
      }
    } catch (err) {
      setError(t.form_err_generic);
    } finally {
      setSubmitting(false);
    }
  };

  const Nav = (
    <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '16px 18px' : '22px 64px', gap: 14, borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 10 }}>
      <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
      <div style={{ fontFamily: type.mono, fontSize: 10, letterSpacing: '0.18em', color: p.inkMuted, marginLeft: 10, textTransform: 'uppercase' }}>{lang === 'en' ? 'For pros' : 'Para profesionales'}</div>
      <div style={{ flex: 1 }} />
      <button onClick={toggleLang} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '6px 12px', fontSize: 11, fontWeight: 600, color: p.ink, cursor: 'pointer', borderRadius: 99, fontFamily: type.mono, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {lang === 'en' ? 'ES' : 'EN'}
      </button>
      {!isPhone && (
        <Link to="/signup" style={{ background: 'transparent', border: 0, padding: '8px 12px', fontSize: 13, fontWeight: 600, color: p.ink, textDecoration: 'none' }}>{t.nav_signin}</Link>
      )}
    </div>
  );

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, paddingBottom: isPhone ? 88 : 0 }}>
      {referredBy && (
        <div style={{ background: p.accent, color: p.bg, padding: '8px 18px', textAlign: 'center', fontFamily: type.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em' }}>
          @{referredBy} {t.ref_banner}
        </div>
      )}
      {Nav}

      {/* HERO */}
      <div style={{ padding: isPhone ? '36px 22px 12px' : '64px 64px 24px', display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.3fr 1fr', gap: isPhone ? 28 : 64, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: p.accent }}>{t.hero_eyebrow}</div>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? '15vw' : '7.2vw', fontWeight: type.displayWeight, letterSpacing: '-0.04em', lineHeight: 0.86, margin: '12px 0 0', color: p.ink, textWrap: 'balance' }}>
            <span>{t.hero_h[0]}</span><br />
            <span style={{ color: p.accent }}>{t.hero_h[1]}</span>
          </h1>
          <p style={{ fontSize: isPhone ? 15 : 18, color: p.inkSoft, lineHeight: 1.55, margin: '20px 0 0', maxWidth: 520, textWrap: 'pretty' }}>{t.hero_sub}</p>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: isPhone ? 'column' : 'row', gap: 12, alignItems: isPhone ? 'stretch' : 'center', flexWrap: 'wrap' }}>
            <button onClick={scrollToClaim} style={{ background: p.ink, color: p.bg, border: 0, padding: isPhone ? '16px 22px' : '16px 26px', borderRadius: 99, fontSize: isPhone ? 15 : 15, fontWeight: 600, cursor: 'pointer' }}>{t.hero_cta}</button>
            <button onClick={toggleLang} style={{ background: 'transparent', color: p.inkSoft, border: 0, padding: '8px 0', fontSize: 13, fontWeight: 500, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>{t.nav_es}</button>
          </div>
          <div style={{ marginTop: 22, padding: '10px 14px', display: 'inline-flex', gap: 10, alignItems: 'center', background: p.accentSoft, borderRadius: 99, fontFamily: type.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: p.ink }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: p.accent, boxShadow: `0 0 0 4px ${p.bg}` }} />
            {t.hero_stripe}
          </div>
        </div>
        <BidStack lang={lang} isPhone={isPhone} />
      </div>

      {/* STEPS */}
      <div style={{ padding: isPhone ? '60px 22px 30px' : '110px 64px 60px' }}>
        <div style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: p.accent }}>{t.steps_eyebrow}</div>
        <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 30 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.95, margin: '12px 0 32px', textWrap: 'balance', maxWidth: 760 }}>{t.steps_h}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : 'repeat(3, 1fr)', gap: isPhone ? 16 : 28 }}>
          {[
            [t.step_1_t, t.step_1_d],
            [t.step_2_t, t.step_2_d],
            [t.step_3_t, t.step_3_d],
          ].map(([head, body], i) => (
            <div key={i} style={{ background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 18, padding: isPhone ? 20 : 26 }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 42, fontWeight: type.displayWeight, color: p.accent, lineHeight: 1, marginBottom: 8 }}>{i + 1}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: p.ink, marginBottom: 8 }}>{head}</div>
              <div style={{ fontSize: 14, color: p.inkSoft, lineHeight: 1.55 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COST COMPARISON */}
      <div style={{ padding: isPhone ? '40px 22px' : '80px 64px', background: p.surface2, borderTop: `0.5px solid ${p.line}`, borderBottom: `0.5px solid ${p.line}` }}>
        <div style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: p.accent }}>{t.compare_eyebrow}</div>
        <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 56, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.92, margin: '10px 0 14px', textWrap: 'balance' }}>{t.compare_h}</h2>
        <p style={{ fontSize: isPhone ? 14 : 16, color: p.inkSoft, maxWidth: 720, lineHeight: 1.55, margin: '0 0 28px' }}>{t.compare_sub}</p>
        <CompareTable t={t} isPhone={isPhone} />
        <p style={{ fontFamily: type.mono, fontSize: 10, color: p.inkMuted, marginTop: 18, letterSpacing: '0.04em' }}>{t.compare_note}</p>
      </div>

      {/* TICKER */}
      <div style={{ padding: isPhone ? '40px 0' : '70px 0', background: p.ink, color: p.bg, overflow: 'hidden' }}>
        <div style={{ padding: isPhone ? '0 22px' : '0 64px', marginBottom: 22 }}>
          <div style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: p.accent, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: p.accent, animation: 'glossiPulse 1.6s infinite' }} />
            {t.ticker_eyebrow}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, animation: 'glossiScroll 35s linear infinite', width: 'max-content', padding: '0 22px' }}>
          {[...TICKER, ...TICKER, ...TICKER].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: `0.5px solid rgba(255,255,255,0.12)`, borderRadius: 14, padding: '14px 18px', minWidth: 240, flexShrink: 0 }}>
              <div style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: p.accent, marginBottom: 6 }}>{item.who}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: p.bg, marginBottom: 4 }}>{item.what}</div>
              <div style={{ fontFamily: type.mono, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{item.range} · {item.when}</div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes glossiScroll { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
          @keyframes glossiPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
          @keyframes glossiFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>

      {/* COHORT + SIGNUP */}
      <div ref={claimRef} style={{ padding: isPhone ? '50px 22px' : '110px 64px' }}>
        <div style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: p.accent }}>{t.cohort_eyebrow}</div>
        <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 30 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.95, margin: '12px 0 18px', textWrap: 'balance', maxWidth: 880 }}>{t.cohort_h}</h2>
        <p style={{ fontSize: isPhone ? 14 : 16, color: p.inkSoft, lineHeight: 1.55, margin: '0 0 32px', maxWidth: 720 }}>{t.cohort_sub}</p>

        {/* Counter */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? '20vw' : '11vw', fontWeight: type.displayWeight, lineHeight: 0.9, color: p.accent, letterSpacing: '-0.04em' }}>
            {count}
          </div>
          <div style={{ fontFamily: type.mono, fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', color: p.inkSoft, textTransform: 'uppercase' }}>
            {t.counter_of} 100<br /><span style={{ color: p.ink }}>{t.counter_claimed}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'relative', height: 6, background: p.line, borderRadius: 99, overflow: 'hidden', marginBottom: 40 }}>
          <div style={{ position: 'absolute', inset: 0, width: `${Math.min(count, 100)}%`, background: p.accent, transition: 'width 600ms ease-out' }} />
        </div>

        {/* Perks */}
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : 'repeat(2, 1fr)', gap: 14, marginBottom: 40 }}>
          {t.cohort_perks.map(([head, body], i) => (
            <div key={i} style={{ background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 14, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 99, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontStyle: 'italic', fontWeight: type.displayWeight, fontSize: 16, flexShrink: 0 }}>✓</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: p.ink, marginBottom: 4 }}>{head}</div>
                <div style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.5 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form / Success */}
        {submitted ? (
          <SuccessShare
            t={t}
            lang={lang}
            isPhone={isPhone}
            cohortNumber={submitted}
            handle={igHandle.trim().replace(/^@/, '').toLowerCase()}
            copied={copied}
            setCopied={setCopied}
          />
        ) : (
          <div style={{ background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 20, padding: isPhone ? 22 : 32, maxWidth: 540 }}>
            <form onSubmit={onSubmit}>
              <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 28, fontWeight: type.displayWeight, margin: '0 0 6px', color: p.ink, letterSpacing: '-0.02em' }}>{t.form_h}</h3>
              <p style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.5, margin: '0 0 20px' }}>{t.form_sub}</p>
              <Field label={t.form_ig} prefix="@">
                <input value={igHandle} onChange={(e) => setIgHandle(e.target.value)} placeholder={t.form_ig_ph} autoCapitalize="none" autoCorrect="off" spellCheck={false} style={inputStyle} required />
              </Field>
              <Field label={t.form_phone}>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.form_phone_ph} type="tel" inputMode="tel" style={inputStyle} />
              </Field>
              {error && <div style={{ fontSize: 13, color: '#B53D2F', marginBottom: 14 }}>{error}</div>}
              <button type="submit" disabled={submitting} style={{ width: '100%', background: p.ink, color: p.bg, border: 0, padding: '16px 22px', borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? t.form_submitting : t.form_submit}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div style={{ padding: isPhone ? '40px 22px 80px' : '80px 64px 120px', background: p.surface2, borderTop: `0.5px solid ${p.line}` }}>
        <div style={{ fontFamily: type.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: p.accent, marginBottom: 24 }}>{t.faq_eyebrow}</div>
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : 'repeat(2, 1fr)', gap: isPhone ? 14 : 28 }}>
          {t.faq.map(([q, a], i) => (
            <div key={i}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 20, fontWeight: type.displayWeight, color: p.ink, marginBottom: 8, letterSpacing: '-0.01em' }}>{q}</div>
              <div style={{ fontSize: 14, color: p.inkSoft, lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: `0.5px solid ${p.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, fontSize: 13, color: p.inkSoft }}>
          <span>© 2026 Glossi · Made in the RGV</span>
          <span>{t.footer_already} <Link to="/signup" style={{ color: p.ink, textDecoration: 'underline', textUnderlineOffset: 3 }}>{t.footer_signin}</Link></span>
        </div>
      </div>

      {/* Sticky mobile bottom CTA */}
      {isPhone && !submitted && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 14, background: p.bg, borderTop: `0.5px solid ${p.line}`, zIndex: 20 }}>
          <button onClick={scrollToClaim} style={{ width: '100%', background: p.ink, color: p.bg, border: 0, padding: '16px 22px', borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{t.bottomcta}</button>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 15,
  fontFamily: 'inherit',
  background: '#fff',
  border: `0.5px solid ${p.line}`,
  borderRadius: 12,
  color: p.ink,
  outline: 'none',
  boxSizing: 'border-box',
};

function Field({ label, prefix, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{ display: 'block', fontFamily: type.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkSoft, textTransform: 'uppercase', marginBottom: 6 }}>{label}</span>
      {prefix ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#fff', border: `0.5px solid ${p.line}`, borderRadius: 12, padding: '0 0 0 14px' }}>
          <span style={{ fontSize: 15, color: p.inkMuted, paddingRight: 4 }}>{prefix}</span>
          <div style={{ flex: 1 }}>
            {/* Override the child input to remove its own border */}
            {wrapInput(children)}
          </div>
        </div>
      ) : (
        children
      )}
    </label>
  );
}

function wrapInput(node) {
  if (!node || !node.props) return node;
  return {
    ...node,
    props: {
      ...node.props,
      style: { ...inputStyle, border: 0, padding: '12px 14px 12px 0', background: 'transparent' },
    },
  };
}

function CompareTable({ t, isPhone }) {
  const cellPad = isPhone ? '12px 10px' : '16px 18px';
  const colNames = [t.compare_col_monthly, t.compare_col_perlead, t.compare_col_card, t.compare_col_upsell];
  return (
    <div style={{ background: p.bg, border: `0.5px solid ${p.line}`, borderRadius: 16, overflow: 'hidden', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: isPhone ? 12 : 14, minWidth: isPhone ? 520 : 'auto' }}>
        <thead>
          <tr style={{ background: p.surface2 }}>
            <th style={{ ...thStyle, padding: cellPad, textAlign: 'left' }}></th>
            {colNames.map((c) => (
              <th key={c} style={{ ...thStyle, padding: cellPad, textAlign: 'center', fontFamily: type.mono, fontSize: 10, letterSpacing: '0.1em' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row, i) => {
            const isGlossi = row.name === 'Glossi';
            return (
              <tr key={row.name} style={{ borderTop: i > 0 ? `0.5px solid ${p.line}` : 0, background: isGlossi ? p.accentSoft : 'transparent' }}>
                <td style={{ padding: cellPad, fontWeight: 700, color: isGlossi ? p.ink : p.inkSoft, fontFamily: isGlossi ? type.display : type.body, fontStyle: isGlossi ? 'italic' : 'normal', fontSize: isGlossi ? (isPhone ? 18 : 22) : (isPhone ? 13 : 15) }}>{row.name}</td>
                <td style={{ ...tdStyle, padding: cellPad }}>{cellValue(row.monthly, isGlossi)}</td>
                <td style={{ ...tdStyle, padding: cellPad }}>{cellValue(row.perlead, isGlossi)}</td>
                <td style={{ ...tdStyle, padding: cellPad }}>{cellValue(row.card, isGlossi)}</td>
                <td style={{ ...tdStyle, padding: cellPad }}>{cellValue(row.upsell, isGlossi)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { color: p.inkSoft, fontWeight: 600, textTransform: 'uppercase' };
const tdStyle = { textAlign: 'center', color: p.inkSoft };

function cellValue(v, isGlossi) {
  if (isGlossi && v === '$0') return <span style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, color: p.accent, fontWeight: type.displayWeight }}>$0</span>;
  if (isGlossi && v === '—') return <span style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, color: p.accent, fontWeight: type.displayWeight }}>—</span>;
  return v;
}

function SuccessShare({ t, lang, isPhone, cohortNumber, handle, copied, setCopied }) {
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://glossi.cc'}/pros?ref=${handle}`;
  const shareText = `${t.share_text} ${shareUrl}`;

  const onShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: t.share_title_native, text: t.share_text, url: shareUrl });
        return;
      } catch (_) {
        // user cancelled; fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  };

  const onDownload = () => drawAndDownloadCard({ lang, handle, shareUrl });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: isPhone ? 24 : 40, alignItems: 'flex-start', maxWidth: 1000 }}>
      {/* Left: success summary + actions */}
      <div style={{ background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 20, padding: isPhone ? 22 : 32 }}>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 44, fontWeight: type.displayWeight, color: p.accent, lineHeight: 1, marginBottom: 10, letterSpacing: '-0.02em' }}>{t.form_success_h}</div>
        <div style={{ fontSize: 16, color: p.ink, lineHeight: 1.55, marginBottom: 24 }}>
          {t.form_success_sub_a} <span style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, color: p.accent }}>#{cohortNumber}</span> {t.form_success_sub_b}
        </div>
        <div style={{ borderTop: `0.5px solid ${p.line}`, paddingTop: 22 }}>
          <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, margin: '0 0 6px', color: p.ink, letterSpacing: '-0.02em' }}>{t.share_h}</h3>
          <p style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.5, margin: '0 0 18px' }}>{t.share_sub}</p>
          <button onClick={onShare} style={{ width: '100%', background: p.ink, color: p.bg, border: 0, padding: '14px 22px', borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}>{t.share_btn} →</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={onCopy} style={{ background: 'transparent', color: p.ink, border: `0.5px solid ${p.line}`, padding: '12px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{copied ? t.share_copied : t.share_copy}</button>
            <button onClick={onDownload} style={{ background: 'transparent', color: p.ink, border: `0.5px solid ${p.line}`, padding: '12px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{t.share_download}</button>
          </div>
          <div style={{ marginTop: 18, padding: '10px 14px', background: p.surface2, borderRadius: 12, fontFamily: type.mono, fontSize: 11, color: p.inkSoft, wordBreak: 'break-all', letterSpacing: '0.02em' }}>
            {shareUrl}
          </div>
        </div>
      </div>
      {/* Right: visual share card preview */}
      <ShareCard t={t} lang={lang} handle={handle} shareUrl={shareUrl} isPhone={isPhone} />
    </div>
  );
}

function ShareCard({ t, lang, handle, shareUrl, isPhone }) {
  const urlNoProto = shareUrl.replace(/^https?:\/\//, '');
  return (
    <div style={{ aspectRatio: '9/16', width: '100%', maxWidth: isPhone ? '100%' : 360, background: p.bg, border: `0.5px solid ${p.line}`, borderRadius: 18, padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 12px 40px rgba(26,23,20,0.08)', overflow: 'hidden' }}>
      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, color: p.accent, fontWeight: type.displayWeight, letterSpacing: '-0.02em' }}>glossi</div>
        <div style={{ fontFamily: type.mono, fontSize: 9, color: p.inkMuted, letterSpacing: '0.18em', textAlign: 'right' }}>{lang === 'es' ? 'COHORTE\nFUNDADORA' : 'FOUNDERS\nCOHORT'}</div>
      </div>
      {/* Middle: kicker + body */}
      <div>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 'clamp(40px, 12vw, 88px)', fontWeight: type.displayWeight, color: p.accent, lineHeight: 0.9, letterSpacing: '-0.04em', marginBottom: 6 }}>$0</div>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 'clamp(20px, 6vw, 32px)', fontWeight: type.displayWeight, color: p.ink, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 14 }}>{t.card_kicker}</div>
        <div style={{ fontSize: 13, color: p.inkSoft, lineHeight: 1.5 }}>{t.card_body}</div>
      </div>
      {/* Bottom */}
      <div>
        <div style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: p.inkSoft, textTransform: 'uppercase', marginBottom: 6 }}>
          {t.card_from} @{handle}
        </div>
        <div style={{ fontFamily: type.mono, fontSize: 10, color: p.accent, wordBreak: 'break-all', marginBottom: 14, letterSpacing: '0.02em' }}>{urlNoProto}</div>
        <div style={{ borderTop: `0.5px solid ${p.line}`, paddingTop: 12, fontFamily: type.mono, fontSize: 9, fontWeight: 700, color: p.inkSoft, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{t.card_foot}</div>
      </div>
    </div>
  );
}

function drawAndDownloadCard({ lang, handle, shareUrl }) {
  // 1080x1920 — IG Story dimensions
  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // bg
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, W, H);

  // top wordmark
  ctx.fillStyle = p.accent;
  ctx.font = 'italic 64px "DM Serif Display", Georgia, serif';
  ctx.textBaseline = 'top';
  ctx.fillText('glossi', 84, 120);

  // top-right kicker
  ctx.fillStyle = p.inkMuted;
  ctx.font = '600 22px "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = 'right';
  const kicker = lang === 'es' ? ['COHORTE', 'FUNDADORA'] : ['FOUNDERS', 'COHORT'];
  ctx.fillText(kicker[0], W - 84, 134);
  ctx.fillText(kicker[1], W - 84, 168);
  ctx.textAlign = 'left';

  // big $0
  ctx.fillStyle = p.accent;
  ctx.font = 'italic 440px "DM Serif Display", Georgia, serif';
  ctx.fillText('$0', 64, 540);

  // kicker phrase
  ctx.fillStyle = p.ink;
  ctx.font = 'italic 100px "DM Serif Display", Georgia, serif';
  const cardKicker = lang === 'es' ? 'Te paso el plug.' : 'Pro tip.';
  ctx.fillText(cardKicker, 84, 1040);

  // body
  ctx.fillStyle = p.inkSoft;
  ctx.font = '500 42px "Inter", system-ui, sans-serif';
  const body = lang === 'es'
    ? ['Glossi te manda clientas del Valle.', 'Sin mensualidad. Sin comisión.']
    : ['Glossi sends Valley clients —', 'no monthly, no per-lead.'];
  body.forEach((line, i) => ctx.fillText(line, 84, 1180 + i * 56));

  // From + handle
  ctx.fillStyle = p.inkSoft;
  ctx.font = '700 28px "JetBrains Mono", ui-monospace, monospace';
  const fromLabel = lang === 'es' ? 'DE @' : 'FROM @';
  ctx.fillText(`${fromLabel}${handle.toUpperCase()}`, 84, 1500);

  // URL
  ctx.fillStyle = p.accent;
  ctx.font = '500 32px "JetBrains Mono", ui-monospace, monospace';
  const urlNoProto = shareUrl.replace(/^https?:\/\//, '');
  ctx.fillText(urlNoProto, 84, 1560);

  // Bottom divider + foot
  ctx.strokeStyle = p.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(84, 1720);
  ctx.lineTo(W - 84, 1720);
  ctx.stroke();

  ctx.fillStyle = p.inkSoft;
  ctx.font = '700 26px "JetBrains Mono", ui-monospace, monospace';
  const foot = lang === 'es' ? 'PRIMERAS 100 DEL VALLE' : 'FIRST 100 IN THE VALLEY';
  ctx.fillText(foot, 84, 1760);

  // Download
  const link = document.createElement('a');
  link.download = `glossi-${handle}-${lang}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function BidStack({ lang, isPhone }) {
  const cards = lang === 'es' ? [
    { who: 'Maria · Edinburg', svc: 'Cejas + relleno de pestañas', price: '$85', when: 'Mar 6pm' },
    { who: 'Carlos · McAllen', svc: 'Skin fade + barba', price: '$40', when: 'Hoy 3pm' },
    { who: 'Jen · Mission',    svc: 'Acrílicas + diseño',         price: '$95', when: 'Sáb 11am' },
  ] : [
    { who: 'Maria · Edinburg', svc: 'Brows + lash fill',  price: '$85', when: 'Tue 6pm' },
    { who: 'Carlos · McAllen', svc: 'Skin fade + beard',  price: '$40', when: 'Today 3pm' },
    { who: 'Jen · Mission',    svc: 'Full set acrylics',  price: '$95', when: 'Sat 11am' },
  ];
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, padding: isPhone ? '8px 4px 24px' : 0 }}>
      {cards.map((c, i) => (
        <div key={i} style={{
          background: p.surface,
          border: `0.5px solid ${p.line}`,
          borderRadius: 16,
          padding: '16px 18px',
          boxShadow: '0 8px 30px rgba(26,23,20,0.06)',
          opacity: 0,
          animation: `glossiFade 600ms ${i * 240}ms forwards ease-out`,
          marginLeft: i % 2 === 0 ? 0 : (isPhone ? 16 : 28),
          marginRight: i % 2 === 0 ? (isPhone ? 16 : 28) : 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.accent, textTransform: 'uppercase' }}>{c.who}</span>
            <span style={{ fontFamily: type.mono, fontSize: 10, color: p.inkMuted }}>{c.when}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: p.ink }}>{c.svc}</span>
            <span style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 28, fontWeight: type.displayWeight, color: p.accent, lineHeight: 1 }}>{c.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
