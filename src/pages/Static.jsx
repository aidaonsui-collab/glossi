// Static legal/info pages — Terms, Privacy, Help, Cities. Same chrome as Marketing.
import { Link, useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useT } from '../lib/i18n.js';

function Shell({ children }) {
  const isPhone = useNarrow();
  const t = useT();
  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 64px', gap: 14, borderBottom: `0.5px solid ${p.line}`, position: 'sticky', top: 0, background: p.bg, zIndex: 5 }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <div style={{ flex: 1 }} />
        <Link to="/" style={{ fontSize: 13, color: p.inkSoft, fontWeight: 500, textDecoration: 'none' }}>{t('← Back', '← Atrás')}</Link>
      </div>
      {children}
      <div style={{ padding: isPhone ? '24px 18px' : '40px 64px', borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: p.inkMuted }}>GLOSSI · 2026</div>
        <div style={{ fontSize: 11.5, color: p.inkMuted, display: 'flex', gap: 18 }}>
          <Link to="/privacy" style={{ color: p.inkMuted, textDecoration: 'none' }}>{t('Privacy', 'Privacidad')}</Link>
          <Link to="/terms" style={{ color: p.inkMuted, textDecoration: 'none' }}>{t('Terms', 'Términos')}</Link>
          <Link to="/help" style={{ color: p.inkMuted, textDecoration: 'none' }}>{t('Help', 'Ayuda')}</Link>
        </div>
      </div>
    </div>
  );
}

function Hero({ eyebrow, title, sub }) {
  const isPhone = useNarrow();
  return (
    <div style={{ padding: isPhone ? '40px 18px 16px' : '80px 64px 32px', maxWidth: 880 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>{eyebrow}</div>
      <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 44 : 72, fontWeight: type.displayWeight, letterSpacing: '-0.035em', lineHeight: 0.95, margin: '14px 0 0', textWrap: 'balance' }}>{title}</h1>
      {sub && <p style={{ fontSize: isPhone ? 15 : 18, color: p.inkSoft, lineHeight: 1.55, margin: '16px 0 0', maxWidth: 640, textWrap: 'pretty' }}>{sub}</p>}
    </div>
  );
}

function Body({ children }) {
  const isPhone = useNarrow();
  return (
    <div style={{ padding: isPhone ? '12px 18px 60px' : '20px 64px 80px', maxWidth: 720, fontSize: isPhone ? 14.5 : 16, color: p.inkSoft, lineHeight: 1.7 }}>
      {children}
    </div>
  );
}

const H = ({ children }) => {
  const isPhone = useNarrow();
  return <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 30, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '36px 0 12px' }}>{children}</h2>;
};

export function Terms() {
  const t = useT();
  return (
    <Shell>
      <Hero eyebrow={t('LEGAL', 'LEGAL')} title={t('Terms of Service.', 'Términos de Servicio.')} sub={t('Last updated April 30, 2026. By using Glossi you agree to these terms — read them once, then forget about them.', 'Última actualización 30 de abril de 2026. Al usar Glossi aceptas estos términos — léelos una vez y olvídate de ellos.')} />
      <Body>
        <H>{t('1. The marketplace', '1. El mercado')}</H>
        <p>{t('Glossi is a marketplace that connects customers with independent salons in the Rio Grande Valley. Glossi is not a salon and does not perform beauty services. Bookings, services, and the relationship around them are between you and the salon.', 'Glossi es un mercado que conecta a clientes con salones independientes en el Valle del Río Grande. Glossi no es un salón y no realiza servicios de belleza. Las reservas, servicios y la relación que los rodea son entre tú y el salón.')}</p>
        <H>{t('2. Your account', '2. Tu cuenta')}</H>
        <p>
          {t("You're responsible for keeping your password confidential and for everything that happens on your account. Tell us right away if anyone uses your account without permission. Email ", 'Eres responsable de mantener tu contraseña confidencial y de todo lo que pase en tu cuenta. Avísanos de inmediato si alguien usa tu cuenta sin permiso. Escríbenos a ')}
          <span style={{ color: p.ink, fontWeight: 600 }}>support@glossi.cc</span>.
        </p>
        <H>{t('3. Bookings & payments', '3. Reservas y pagos')}</H>
        <p>{t('When you book through Glossi, you authorize us to charge your card the day of your appointment. Free cancellation up to 24 hours before; same-day cancels forfeit a 50% deposit. Refunds for service quality issues are handled case by case — reach out within 7 days.', 'Cuando reservas por Glossi, nos autorizas a cobrar tu tarjeta el día de tu cita. Cancelación gratis hasta 24 horas antes; las cancelaciones del mismo día pierden el 50% de depósito. Los reembolsos por problemas de calidad se manejan caso por caso — contáctanos dentro de 7 días.')}</p>
        <H>{t('4. Reviews & content', '4. Reseñas y contenido')}</H>
        <p>{t("Reviews must reflect a real visit. We remove reviews that contain hate speech, personal information about stylists, or are clearly fake. Photos you upload to a review can be displayed publicly on the salon's profile.", 'Las reseñas deben reflejar una visita real. Eliminamos reseñas que contengan discurso de odio, información personal sobre estilistas o que claramente sean falsas. Las fotos que subas a una reseña pueden mostrarse públicamente en el perfil del salón.')}</p>
        <H>{t('5. Salons', '5. Salones')}</H>
        <p>{t('Salons set their own prices, hours, and service area. Glossi takes 7% of each confirmed booking. Salons are responsible for their own licensing, insurance, and tax obligations. Glossi is not an employer.', 'Los salones fijan sus propios precios, horarios y área de servicio. Glossi toma el 7% de cada reserva confirmada. Los salones son responsables de sus propias licencias, seguros y obligaciones fiscales. Glossi no es un empleador.')}</p>
        <H>{t("6. What we won't do", '6. Lo que no haremos')}</H>
        <p>{t("Glossi will not share your email or phone with salons until you book. We don't sell your data. We don't show ads inside the app. If we ever change either of those, we'll tell you first and give you a way out.", 'Glossi no compartirá tu correo ni teléfono con los salones hasta que reserves. No vendemos tus datos. No mostramos anuncios dentro de la app. Si alguna vez cambiamos algo de eso, te avisaremos primero y te daremos una forma de salir.')}</p>
        <H>{t('7. Changes', '7. Cambios')}</H>
        <p>{t("We may update these terms from time to time. We'll email you 30 days before any meaningful change, and the in-app banner will tell you what changed.", 'Podemos actualizar estos términos de vez en cuando. Te enviaremos un correo 30 días antes de cualquier cambio importante, y el banner dentro de la app te dirá qué cambió.')}</p>
        <H>{t('8. Disputes', '8. Disputas')}</H>
        <p>{t("If something goes wrong, email us first — most issues resolve in a day. If we can't agree, disputes are handled by binding arbitration in Hidalgo County, Texas.", 'Si algo sale mal, escríbenos primero — la mayoría de los problemas se resuelven en un día. Si no podemos llegar a un acuerdo, las disputas se manejan por arbitraje vinculante en el Condado de Hidalgo, Texas.')}</p>
      </Body>
    </Shell>
  );
}

export function Privacy() {
  const t = useT();
  return (
    <Shell>
      <Hero eyebrow={t('LEGAL', 'LEGAL')} title={t('Privacy Policy.', 'Política de Privacidad.')} sub={t("What we collect, what we don't, and what we do with the rest. Plain English.", 'Qué recopilamos, qué no, y qué hacemos con lo demás. En palabras claras.')} />
      <Body>
        <H>{t('What we collect', 'Qué recopilamos')}</H>
        <p>{t('Your name, email, phone, ZIP, and the things you do in the app: requests posted, bids received, bookings made, salons saved, reviews written. If you upload photos to a review or request, those go into our storage too.', 'Tu nombre, correo, teléfono, código postal y lo que haces en la app: solicitudes publicadas, ofertas recibidas, reservas hechas, salones guardados, reseñas escritas. Si subes fotos a una reseña o solicitud, también van a nuestro almacenamiento.')}</p>
        <H>{t("What we don't", 'Qué no recopilamos')}</H>
        <p>{t("We don't track you across other apps and websites. We don't run third-party advertising trackers. We don't sell anything. We never read your messages with salons except when you flag a thread for support.", 'No te rastreamos por otras apps ni sitios web. No usamos rastreadores publicitarios de terceros. No vendemos nada. Nunca leemos tus mensajes con los salones, excepto cuando reportas un hilo para soporte.')}</p>
        <H>{t('Who sees what', 'Quién ve qué')}</H>
        <p>{t('Salons see your first name, your ZIP, your service request, and any photos you attached. They see your phone number after you book — not before. Reviews appear with your first name and last initial.', 'Los salones ven tu nombre, tu código postal, tu solicitud de servicio y cualquier foto que adjuntes. Ven tu número de teléfono después de que reservas — no antes. Las reseñas aparecen con tu nombre y la inicial del apellido.')}</p>
        <H>{t('Storage', 'Almacenamiento')}</H>
        <p>{t("Your data lives in Postgres on Supabase (US East). Photos are in Cloudflare R2. Payment data never touches our servers — Stripe handles all of it with PCI-compliant tokenization. Local prototype data lives in your browser's localStorage and is wiped if you clear it.", 'Tus datos viven en Postgres en Supabase (US East). Las fotos están en Cloudflare R2. Los datos de pago nunca tocan nuestros servidores — Stripe maneja todo con tokenización compatible con PCI. Los datos del prototipo local viven en el localStorage de tu navegador y se borran si lo limpias.')}</p>
        <H>{t('Your rights', 'Tus derechos')}</H>
        <p>
          {t('Email ', 'Escríbenos a ')}
          <span style={{ color: p.ink, fontWeight: 600 }}>privacy@glossi.app</span>
          {t(" to download everything we have on you, correct anything that's wrong, or delete your account. We respond within 30 days. Texas residents have additional rights under Texas Data Privacy and Security Act — same email, same response.", ' para descargar todo lo que tenemos sobre ti, corregir lo que esté mal o eliminar tu cuenta. Respondemos dentro de 30 días. Los residentes de Texas tienen derechos adicionales bajo la Ley de Privacidad y Seguridad de Datos de Texas — mismo correo, misma respuesta.')}
        </p>
        <H>{t('Cookies', 'Cookies')}</H>
        <p>{t("We use a single cookie to keep you signed in. That's it. No analytics cookies, no tracking pixels.", 'Usamos una sola cookie para mantenerte conectado. Eso es todo. Sin cookies de analítica, sin pixeles de rastreo.')}</p>
        <H>{t('Kids', 'Menores')}</H>
        <p>{t("Glossi isn't for anyone under 16. If we learn we've collected information from a minor, we delete it.", 'Glossi no es para menores de 16 años. Si nos enteramos de que recopilamos información de un menor, la eliminamos.')}</p>
      </Body>
    </Shell>
  );
}

export function Help() {
  const t = useT();
  const FAQ = [
    { q: t('How does the bidding work?', '¿Cómo funcionan las ofertas?'), a: t("Post a request — service, photos, when you're free, what you're willing to pay. Salons within 5 miles see it and send bids. You pick. Most requests get 4–8 bids inside an hour.", 'Publica una solicitud — servicio, fotos, cuándo estás libre, cuánto estás dispuesta a pagar. Los salones dentro de 5 millas la ven y envían ofertas. Tú eliges. La mayoría de las solicitudes reciben 4–8 ofertas en una hora.') },
    { q: t('When am I charged?', '¿Cuándo me cobran?'), a: t('When the appointment happens, not when you book. We pre-authorize the card amount to confirm the booking, then charge after the appointment is complete.', 'Cuando ocurre la cita, no cuando reservas. Pre-autorizamos el monto en la tarjeta para confirmar la reserva, luego cobramos después de que la cita se complete.') },
    { q: t('Can I cancel?', '¿Puedo cancelar?'), a: t('Free cancellation up to 24 hours before your appointment. Same-day cancels forfeit a 50% deposit; the salon keeps that to cover the held slot.', 'Cancelación gratis hasta 24 horas antes de tu cita. Las cancelaciones del mismo día pierden el 50% de depósito; el salón lo conserva para cubrir el horario reservado.') },
    { q: t('How do I reschedule?', '¿Cómo reagendo?'), a: t('Open Bookings, tap Reschedule on your upcoming appointment, pick a new slot. Free up to the 24-hour window — within that window, the salon may decline.', 'Abre Reservas, toca Reagendar en tu próxima cita, elige un nuevo horario. Gratis hasta dentro de la ventana de 24 horas — dentro de esa ventana, el salón puede rechazar.') },
    { q: t('What if my hair / nails / lashes are bad?', '¿Y si mi cabello / uñas / pestañas quedaron mal?'), a: t('Reach out within 7 days at support@glossi.cc. We mediate with the salon — most issues end with a partial refund or a free fix-up.', 'Escríbenos dentro de 7 días a support@glossi.cc. Mediamos con el salón — la mayoría de los problemas terminan con un reembolso parcial o un arreglo gratis.') },
    { q: t('Is there a tip on the price?', '¿La propina está incluida en el precio?'), a: t('Tip is added at checkout and goes 100% to the stylist. Glossi never takes a cut of tip.', 'La propina se agrega al pagar y va 100% a la estilista. Glossi nunca toma una parte de la propina.') },
    { q: t('Is Glossi available outside the Valley?', '¿Glossi está disponible fuera del Valle?'), a: t("Right now it's the Rio Grande Valley only — Pharr, McAllen, Edinburg, Mission, Weslaco, and Brownsville. We'll expand once these cities are saturated.", 'Por ahora solo el Valle del Río Grande — Pharr, McAllen, Edinburg, Mission, Weslaco y Brownsville. Nos expandiremos cuando estas ciudades estén saturadas.') },
    { q: t("I'm a salon — how do I sign up?", 'Soy salón — ¿cómo me registro?'), a: t('Tap "Apply for salons" on the homepage or sign up at /signup as Salon. Approval is usually 1–2 business days.', 'Toca "Aplicar para salones" en la página principal o regístrate en /signup como Salón. La aprobación suele tardar 1–2 días hábiles.') },
  ];
  return (
    <Shell>
      <Hero eyebrow={t('HELP CENTER', 'CENTRO DE AYUDA')} title={t('How can we help?', '¿Cómo podemos ayudarte?')} sub={t("The questions we hear the most. If yours isn't here, email support@glossi.cc — we answer in under 4 hours weekdays.", 'Las preguntas que más escuchamos. Si la tuya no está aquí, escribe a support@glossi.cc — respondemos en menos de 4 horas entre semana.')} />
      <Body>
        {FAQ.map((f, i) => (
          <div key={i} style={{ paddingTop: 24, marginTop: 24, borderTop: i ? `0.5px solid ${p.line}` : 'none' }}>
            <H>{f.q}</H>
            <p>{f.a}</p>
          </div>
        ))}
        <div style={{ marginTop: 56, padding: '28px 32px', background: p.surface, borderRadius: 18, border: `0.5px solid ${p.line}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>{t('STILL STUCK?', '¿AÚN ATORADA?')}</div>
          <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 24, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em', margin: '8px 0 6px' }}>{t('Email us — we read every message.', 'Escríbenos — leemos cada mensaje.')}</h3>
          <p style={{ margin: '0 0 14px' }}>{t("Average response time: 3h 42m. We're a small team based in McAllen.", 'Tiempo promedio de respuesta: 3h 42m. Somos un equipo pequeño en McAllen.')}</p>
          <a href="mailto:support@glossi.cc" style={{ display: 'inline-block', background: p.ink, color: p.bg, padding: '11px 20px', borderRadius: 99, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>support@glossi.cc</a>
        </div>
      </Body>
    </Shell>
  );
}

export function Cities() {
  const navigate = useNavigate();
  const isPhone = useNarrow();
  const t = useT();
  const CITIES = [
    { name: 'Pharr', salons: 487, mood: 0, bookings: 312, status: 'live' },
    { name: 'McAllen', salons: 612, mood: 3, bookings: 489, status: 'live' },
    { name: 'Edinburg', salons: 218, mood: 5, bookings: 144, status: 'live' },
    { name: 'Mission', salons: 134, mood: 1, bookings: 88, status: 'live' },
    { name: 'Weslaco', salons: 96, mood: 4, bookings: 51, status: 'live' },
    { name: 'Brownsville', salons: 0, mood: 7, bookings: 0, status: 'soon', when: t('Summer 2026', 'Verano 2026') },
    { name: 'Harlingen', salons: 0, mood: 6, bookings: 0, status: 'soon', when: t('Summer 2026', 'Verano 2026') },
    { name: 'Laredo', salons: 0, mood: 2, bookings: 0, status: 'requested' },
    { name: 'Corpus Christi', salons: 0, mood: 4, bookings: 0, status: 'requested' },
    { name: 'San Antonio', salons: 0, mood: 5, bookings: 0, status: 'requested' },
  ];
  return (
    <Shell>
      <Hero eyebrow={t('WHERE WE OPERATE', 'DÓNDE OPERAMOS')} title={t('Cities.', 'Ciudades.')} sub={t('Glossi is live in the Rio Grande Valley with 1,547 salons. Brownsville and Harlingen are next — request your city to vote it forward.', 'Glossi está activo en el Valle del Río Grande con 1,547 salones. Brownsville y Harlingen siguen — solicita tu ciudad para impulsarla.')} />
      <div style={{ padding: isPhone ? '0 18px 60px' : '0 64px 80px', maxWidth: 1040 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {CITIES.map(c => (
            <div key={c.name} style={{
              background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`,
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ height: 120, backgroundImage: `url(${PHOTOS[c.mood % PHOTOS.length]})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: c.status === 'live' ? 'transparent' : 'rgba(26,23,20,0.45)' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 99, background: c.status === 'live' ? p.accent : c.status === 'soon' ? p.surface : 'rgba(255,255,255,0.92)', color: c.status === 'live' ? p.ink : p.ink, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em' }}>
                  {c.status === 'live' ? t('LIVE', 'EN VIVO') : c.status === 'soon' ? t('COMING SOON', 'PRÓXIMAMENTE') : t('REQUESTED', 'SOLICITADA')}
                </div>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.015em' }}>{c.name}</div>
                {c.status === 'live' ? (
                  <>
                    <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                      <div>
                        <div style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 600, color: p.ink }}>{c.salons}</div>
                        <div style={{ fontSize: 10.5, color: p.inkMuted, fontWeight: 600, letterSpacing: '0.1em' }}>{t('SALONS', 'SALONES')}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 600, color: p.ink }}>{c.bookings}/{t('wk', 'sem')}</div>
                        <div style={{ fontSize: 10.5, color: p.inkMuted, fontWeight: 600, letterSpacing: '0.1em' }}>{t('BOOKINGS', 'RESERVAS')}</div>
                      </div>
                    </div>
                    <button onClick={() => navigate('/explore')} style={{ marginTop: 14, background: p.ink, color: p.bg, border: 0, padding: '9px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t(`Browse ${c.name} →`, `Explora ${c.name} →`)}</button>
                  </>
                ) : c.status === 'soon' ? (
                  <>
                    <div style={{ marginTop: 8, fontSize: 13, color: p.inkSoft }}>{t(`Launching ${c.when}`, `Lanzamiento ${c.when}`)}</div>
                    <button onClick={() => navigate('/signup')} style={{ marginTop: 14, background: p.surface, color: p.ink, border: `0.5px solid ${p.line}`, padding: '9px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Get notified →', 'Avísame →')}</button>
                  </>
                ) : (
                  <>
                    <div style={{ marginTop: 8, fontSize: 13, color: p.inkSoft }}>{t('Requested by 200+ users', 'Solicitada por 200+ usuarios')}</div>
                    <a href={`mailto:hello@glossi.app?subject=${encodeURIComponent('Bring Glossi to ' + c.name)}`} style={{ display: 'inline-block', marginTop: 14, background: 'transparent', color: p.accent, border: `0.5px solid ${p.accent}`, padding: '9px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}>{t(`Vote for ${c.name} →`, `Vota por ${c.name} →`)}</a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36, padding: '28px 32px', background: p.ink, color: p.bg, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>{t('YOUR CITY?', '¿TU CIUDAD?')}</div>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 28, fontWeight: type.displayWeight, marginTop: 4 }}>{t('Tell us where you want Glossi next.', 'Dinos dónde quieres Glossi después.')}</div>
          </div>
          <a href="mailto:hello@glossi.app?subject=City%20request" style={{ background: p.accent, color: p.ink, padding: '12px 22px', borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{t('Email us →', 'Escríbenos →')}</a>
        </div>
      </div>
    </Shell>
  );
}
