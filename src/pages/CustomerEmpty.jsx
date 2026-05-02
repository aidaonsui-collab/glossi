import { Link, useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import { useT } from '../lib/i18n.js';

export default function CustomerEmpty() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const t = useT();
  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, padding: isPhone ? '24px 18px' : '48px 64px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 22, color: p.accent, textDecoration: 'none', fontFamily: type.display, fontStyle: 'italic', fontWeight: type.displayWeight, letterSpacing: '-0.02em' }}><span style={{ fontFamily: type.body, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>←</span>glossi</Link>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('YOUR QUOTES', 'TUS OFERTAS')}</div>
      <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 34 : 54, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>{t('Nothing in flight.', 'Nada en proceso.')}</h1>
      <div style={{ marginTop: isPhone ? 22 : 32, padding: isPhone ? '24px' : '40px', borderRadius: 18, border: `1px dashed ${p.inkMuted}`, background: p.surface, display: 'flex', flexDirection: isPhone ? 'column' : 'row', alignItems: 'center', gap: isPhone ? 16 : 30 }}>
        <div style={{ width: isPhone ? 80 : 120, height: isPhone ? 80 : 120, borderRadius: 99, background: p.bg, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 44 : 64, color: p.accent, fontWeight: type.displayWeight }}>$</div>
        <div style={{ flex: 1, textAlign: isPhone ? 'center' : 'left' }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 32, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1.05 }}>{t("Post a request, we'll do the rest.", 'Publica una solicitud, nosotros hacemos el resto.')}</div>
          <div style={{ marginTop: 8, fontSize: isPhone ? 13 : 14, color: p.inkSoft, lineHeight: 1.55, maxWidth: 480 }}>{t("Tell us the service, your budget range, and when you're free. Salons within 5 miles will start sending bids — usually within 10 minutes.", 'Dinos el servicio, tu rango de presupuesto y cuándo estás libre. Los salones dentro de 5 millas empezarán a enviar ofertas — usualmente dentro de 10 minutos.')}</div>
          <Link to="/quotes/waiting" style={{ display: 'inline-block', marginTop: 14, background: p.ink, color: p.bg, border: 0, padding: '13px 20px', borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{t('Post a request →', 'Publicar solicitud →')}</Link>
        </div>
      </div>
      <div style={{ marginTop: 24, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>{t('SUGGESTED · BASED ON YOUR AREA', 'SUGERIDO · SEGÚN TU ZONA')}</div>
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 8 }}>
        {[
          t('Color & balayage', 'Color y balayage'),
          t('Cut + style', 'Corte + peinado'),
          t('Lashes', 'Pestañas'),
          t('Mani · Pedi', 'Mani · Pedi'),
        ].map(s => (
          <button key={s} onClick={() => { toast(t(`Starting a ${s} request…`, `Iniciando una solicitud de ${s}…`)); navigate('/quotes/waiting'); }} style={{ padding: '14px 16px', borderRadius: 12, background: p.surface, border: `0.5px solid ${p.line}`, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink }}>{s} <span style={{ float: 'right', color: p.inkMuted }}>→</span></button>
        ))}
      </div>
    </div>
  );
}
