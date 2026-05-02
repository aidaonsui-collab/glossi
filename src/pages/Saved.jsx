import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import SalonPhoto from '../components/SalonPhoto.jsx';
import TrustBadge from '../components/TrustBadge.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { BIDS } from '../ios/data.js';
import { Stars } from '../ios/atoms.jsx';
import { useToast } from '../components/Toast.jsx';
import { useSaved } from '../store.jsx';
import { useT } from '../lib/i18n.js';

export default function Saved() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const t = useT();
  const { ids, remove: unsave } = useSaved();
  const list = BIDS.filter(b => ids.includes(b.id));

  const remove = (e, id) => {
    e.stopPropagation();
    const salon = BIDS.find(b => b.id === id);
    unsave(id);
    toast(t(`Removed ${salon?.name} from saved.`, `${salon?.name} eliminado de guardados.`));
  };

  return (
    <CustomerLayout active="saved" mobileTitle={t('Saved', 'Guardados')}>
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('SAVED', 'GUARDADOS')}</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 54, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>{t('Your salons.', 'Tus salones.')}</h1>
        <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
          {list.length === 0
            ? t('Tap the heart on any salon profile to save them here. Salons you save get prioritized in your bid feed.', 'Toca el corazón en cualquier perfil de salón para guardarlo aquí. Los salones que guardas tienen prioridad en tu feed de ofertas.')
            : t(`${list.length} saved · we ping these first when you post a request.`, `${list.length} guardados · les avisamos primero cuando publicas una solicitud.`)}
        </p>

        {list.length === 0 ? (
          <div style={{ marginTop: 28, padding: '40px', borderRadius: 18, border: `1px dashed ${p.inkMuted}`, background: p.surface, textAlign: 'center' }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink }}>{t('Nothing saved yet.', 'Aún no hay nada guardado.')}</div>
            <button onClick={() => navigate('/explore')} style={{ marginTop: 14, background: p.ink, color: p.bg, border: 0, padding: '12px 22px', borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Browse salons →', 'Explorar salones →')}</button>
          </div>
        ) : (
          <div style={{ marginTop: 22, display: 'grid', gap: isPhone ? 14 : 18, gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {list.map(s => (
              <button key={s.id} onClick={() => navigate(`/salon/${s.id}`)} style={{
                background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 18, overflow: 'hidden',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink, padding: 0, position: 'relative',
              }}>
                <SalonPhoto mood={s.mood} h={160} style={{ borderRadius: 0 }}>
                  <button onClick={e => remove(e, s.id)} style={{
                    position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 99,
                    border: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={p.accent} stroke={p.accent} strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  </button>
                </SalonPhoto>
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 19, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: p.inkMuted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Stars n={s.rating} color={p.accent} size={11} />
                    <span style={{ color: p.ink, fontWeight: 600 }}>{s.rating}</span>
                    <span>·</span><span>{s.neighborhood}</span><span>·</span>
                    <span style={{ fontFamily: type.mono }}>{s.distance} {t('mi', 'mi')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {(s.badges || []).map(b => <TrustBadge key={b} kind={b} p={p} type={type} />)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
