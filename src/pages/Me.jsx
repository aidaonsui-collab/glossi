import { Link, useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import SalonPhoto from '../components/SalonPhoto.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useAuth, useBookings, useNotifications, useSaved, useLang } from '../store.jsx';
import { Stars } from '../ios/atoms.jsx';
import { BIDS } from '../ios/data.js';
import { useToast } from '../components/Toast.jsx';
import { useT } from '../lib/i18n.js';

function timeAgo(ts, lang) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (lang === 'es') {
    if (s < 60) return 'ahora mismo';
    if (s < 3600) return `hace ${Math.floor(s / 60)}m`;
    if (s < 86400) return `hace ${Math.floor(s / 3600)}h`;
    return new Date(ts).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  }
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Me() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const t = useT();
  const { lang } = useLang();
  const { user, signOut } = useAuth();
  const { bookings } = useBookings();
  const { ids: savedIds } = useSaved();
  const { items: notifs } = useNotifications();

  const upcoming = bookings.find(b => b.status === 'upcoming');
  const completed = bookings.filter(b => b.status === 'completed');
  const totalSaved = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => {
      const original = BIDS.find(x => x.id === b.salonId);
      const fullPrice = original?.originalPrice || b.subtotal || b.total || 0;
      return sum + Math.max(0, fullPrice - (b.subtotal || b.total || 0));
    }, 0) + 142; // baseline from earlier history
  const savedSalons = BIDS.filter(b => savedIds.includes(b.id)).slice(0, 3);
  const recentNotifs = notifs.slice(0, 4);

  const Section = ({ title, eyebrow, action, children }) => (
    <section style={{ marginTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          {eyebrow && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{eyebrow}</div>}
          {title && <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 30, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1.05, margin: '4px 0 0' }}>{title}</h2>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );

  return (
    <CustomerLayout active="me" mobileTitle={t('Me', 'Yo')}>
      <div style={{ padding: isPhone ? '20px 18px 32px' : '34px 40px 60px', maxWidth: 1040 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('YOUR ACCOUNT', 'TU CUENTA')}</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 56, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 0.95, margin: '8px 0 0', textWrap: 'balance' }}>
          {t(`Hi ${user?.name?.split(' ')[0] || 'there'}.`, `Hola ${user?.name?.split(' ')[0] || 'qué tal'}.`)}
        </h1>

        {/* Profile + stats */}
        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.2fr 1fr', gap: isPhone ? 14 : 18 }}>
          <div style={{ padding: '22px', background: p.surface, borderRadius: 18, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: user?.avatar || 'linear-gradient(135deg,#E8B7A8,#B8893E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 22, fontWeight: 700, flexShrink: 0 }}>{user?.initials || 'G'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 24, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em' }}>{user?.name || t('Guest', 'Invitada')}</div>
              <div style={{ fontSize: 12.5, color: p.inkMuted, marginTop: 2 }}>{user?.email}{user?.city ? ` · ${user.city}` : ''}</div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginTop: 6 }}>{t('Member since', 'Miembro desde')} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(lang === 'es' ? 'es-MX' : undefined, { month: 'long', year: 'numeric' }) : '—'}</div>
            </div>
            <Link to="/settings" style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, textDecoration: 'none' }}>{t('Edit profile', 'Editar perfil')}</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              { k: t('Bookings', 'Reservas'), v: completed.length, sub: t(`${bookings.length} total`, `${bookings.length} totales`) },
              { k: t('Saved', 'Guardados'), v: savedIds.length, sub: t('salons', 'salones') },
              { k: t('Reviews', 'Reseñas'), v: completed.filter(b => b.rating).length, sub: t('left', 'dejadas') },
              { k: t('Saved $', 'Ahorro $'), v: `$${totalSaved.toFixed(0)}`, sub: t('vs walk-in', 'vs sin reserva'), accent: true },
            ].map((s, i) => (
              <div key={i} style={{ padding: '16px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
                <div style={{ fontFamily: type.mono, fontSize: 28, fontWeight: 600, color: s.accent ? p.success : p.ink, letterSpacing: '-0.02em', marginTop: 4 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: p.inkSoft, marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        {upcoming ? (
          <Section eyebrow={t('UPCOMING', 'PRÓXIMA')} title={t('Your next booking.', 'Tu próxima reserva.')} action={
            <Link to="/bookings" style={{ fontSize: 12.5, color: p.accent, fontWeight: 600, textDecoration: 'none' }}>{t('All bookings →', 'Todas las reservas →')}</Link>
          }>
            <button onClick={() => navigate(`/bookings`)} style={{
              width: '100%', display: 'flex', gap: 16, padding: '20px', background: p.ink, color: p.bg,
              borderRadius: 18, border: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              alignItems: 'center', flexWrap: 'wrap',
            }}>
              <SalonPhoto mood={upcoming.mood ?? 0} h={72} style={{ width: 72, borderRadius: 12, flexShrink: 0 }} />
              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <div style={{ fontFamily: type.body, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.accent }}>{upcoming.slot?.toUpperCase() || t('UPCOMING', 'PRÓXIMA')}</div>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, marginTop: 4 }}>{upcoming.service}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{upcoming.salonName}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span onClick={e => { e.stopPropagation(); navigate('/bookings'); }} style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{t('Reschedule', 'Reagendar')}</span>
                <span onClick={e => { e.stopPropagation(); navigate(`/salon/${upcoming.salonId}`); }} style={{ background: p.accent, color: p.ink, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{t('View salon →', 'Ver salón →')}</span>
              </div>
            </button>
          </Section>
        ) : (
          <Section eyebrow={t('UPCOMING', 'PRÓXIMA')} title={t('Nothing in flight.', 'Nada en proceso.')}>
            <div style={{ padding: '24px', borderRadius: 18, border: `1px dashed ${p.inkMuted}`, background: p.surface, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55, minWidth: 220 }}>
                {t('Post a request and salons within 5 mi will start sending bids — usually within 10 minutes.', 'Publica una solicitud y los salones dentro de 5 mi empezarán a enviar ofertas — usualmente dentro de 10 minutos.')}
              </div>
              <Link to="/quotes" style={{ background: p.ink, color: p.bg, padding: '12px 20px', borderRadius: 99, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{t('Post a request →', 'Publicar solicitud →')}</Link>
            </div>
          </Section>
        )}

        {/* Two-column: saved + activity */}
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.3fr 1fr', gap: isPhone ? 28 : 22 }}>
          {/* Saved */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('SAVED', 'GUARDADOS')}</div>
                <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, letterSpacing: '-0.015em', margin: '4px 0 0' }}>{t('Your shortlist.', 'Tu lista corta.')}</h3>
              </div>
              <Link to="/saved" style={{ fontSize: 12.5, color: p.accent, fontWeight: 600, textDecoration: 'none' }}>{t(`See all (${savedIds.length}) →`, `Ver todos (${savedIds.length}) →`)}</Link>
            </div>
            {savedSalons.length === 0 ? (
              <div style={{ padding: '24px', borderRadius: 14, background: p.surface, border: `0.5px solid ${p.line}`, fontSize: 13, color: p.inkMuted, textAlign: 'center' }}>
                {t('Nothing saved yet — tap the heart on any salon profile.', 'Aún nada guardado — toca el corazón en cualquier perfil de salón.')}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                {savedSalons.map(s => (
                  <button key={s.id} onClick={() => navigate(`/salon/${s.id}`)} style={{
                    minWidth: 220, flex: '0 0 auto',
                    background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`,
                    overflow: 'hidden', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink, padding: 0,
                  }}>
                    <SalonPhoto mood={s.mood} h={120} style={{ borderRadius: 0 }} />
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 16, fontWeight: type.displayWeight, color: p.ink }}>{s.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: p.inkMuted, marginTop: 3 }}>
                        <Stars n={s.rating} color={p.accent} size={10} />
                        <span style={{ color: p.ink, fontWeight: 600 }}>{s.rating}</span>
                        <span>·</span><span>{s.neighborhood}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Activity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('ACTIVITY', 'ACTIVIDAD')}</div>
                <h3 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, letterSpacing: '-0.015em', margin: '4px 0 0' }}>{t('Recent.', 'Reciente.')}</h3>
              </div>
              <Link to="/notifications" style={{ fontSize: 12.5, color: p.accent, fontWeight: 600, textDecoration: 'none' }}>{t('All →', 'Todas →')}</Link>
            </div>
            {recentNotifs.length === 0 ? (
              <div style={{ padding: '24px', borderRadius: 14, background: p.surface, border: `0.5px solid ${p.line}`, fontSize: 13, color: p.inkMuted, textAlign: 'center' }}>
                {t('Quiet so far.', 'Todo tranquilo por ahora.')}
              </div>
            ) : (
              <div style={{ background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
                {recentNotifs.map((n, i) => (
                  <button key={n.id} onClick={() => n.link && navigate(n.link)} style={{
                    padding: '12px 14px', borderTop: i ? `0.5px solid ${p.line}` : 'none',
                    background: !n.read ? p.bg : 'transparent', cursor: 'pointer',
                    width: '100%', textAlign: 'left', fontFamily: 'inherit', color: p.ink, border: 0,
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: p.ink, lineHeight: 1.3 }}>{n.title}</div>
                      {n.body && <div style={{ fontSize: 11.5, color: p.inkSoft, marginTop: 3, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.body}</div>}
                      <div style={{ fontFamily: type.mono, fontSize: 10, color: p.inkMuted, marginTop: 4 }}>{timeAgo(n.ts, lang)}</div>
                    </div>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: 99, background: p.accent, marginTop: 6, flexShrink: 0 }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <Section eyebrow={t('QUICK ACTIONS', 'ACCIONES RÁPIDAS')}>
          <div style={{ display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2,1fr)' : 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { l: t('Settings', 'Ajustes'), sub: t('Profile · notifications', 'Perfil · notificaciones'), to: '/settings', i: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z' },
              { l: t('Payment', 'Pago'), sub: t('Cards · billing', 'Tarjetas · facturación'), to: '/settings', i: 'M3 6h18M5 6v12a2 2 0 002 2h10a2 2 0 002-2V6M16 14h2' },
              { l: t('Help', 'Ayuda'), sub: t('FAQ · support', 'FAQ · soporte'), to: '/help', i: 'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z' },
              { l: t('Sign out', 'Cerrar sesión'), sub: t('See you soon', 'Hasta pronto'), onClick: () => { signOut(); toast(t('Signed out.', 'Sesión cerrada.')); navigate('/'); }, i: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9', accent: true },
            ].map((a, i) => {
              const inner = (
                <>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: a.accent ? p.accent + '1f' : p.bg, color: a.accent ? p.accent : p.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.i} /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: a.accent ? p.accent : p.ink }}>{a.l}</div>
                    <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 1 }}>{a.sub}</div>
                  </div>
                </>
              );
              const style = {
                display: 'flex', flexDirection: isPhone ? 'column' : 'row',
                alignItems: isPhone ? 'flex-start' : 'center',
                gap: 12, padding: '14px 16px',
                background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`,
                cursor: 'pointer', textDecoration: 'none', color: p.ink, fontFamily: 'inherit', textAlign: 'left',
              };
              return a.to ? (
                <Link key={i} to={a.to} style={style}>{inner}</Link>
              ) : (
                <button key={i} onClick={a.onClick} style={{ ...style, border: `0.5px solid ${p.line}` }}>{inner}</button>
              );
            })}
          </div>
        </Section>
      </div>
    </CustomerLayout>
  );
}
