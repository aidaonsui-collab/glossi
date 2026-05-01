import { useState } from 'react';
import SalonPhoto from './SalonPhoto.jsx';
import TrustBadge from './TrustBadge.jsx';
import { Stars } from '../ios/atoms.jsx';
import { IOSStatusBar } from '../ios/IOSFrame.jsx';
import { SALON_DETAILS } from '../ios/details.js';
import { useSaved, useReviews, useSalonProfile } from '../store.jsx';
import { PHOTOS } from '../theme.js';

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Surface = 'web' | 'ios'
export default function SalonProfile({ p, type, lang, surface, bid, onBack, onMessage, onMakeOffer, onBook }) {
  const [activeTab, setActiveTab] = useState('about');
  const [heroIdx, setHeroIdx] = useState(0);
  const { isSaved, toggle: toggleSaved } = useSaved();
  const { forSalon } = useReviews();
  const { profile: salonProfile } = useSalonProfile();
  const d = SALON_DETAILS[bid?.id];
  if (!bid || !d) return null;
  const saved = isSaved(bid.id);
  const userReviews = forSalon(bid.id);
  const allReviews = [...userReviews, ...d.reviews];
  // Casa de Belleza (b1) is the user's own salon — show their uploaded gallery there.
  const galleryItems = bid.id === 'b1' && salonProfile.gallery?.length
    ? salonProfile.gallery
    : d.gallery.map(v => ({ kind: 'mood', value: v }));
  const galleryUrl = item => item.kind === 'upload' ? item.value : PHOTOS[item.value % PHOTOS.length];
  const safeHeroIdx = Math.min(heroIdx, galleryItems.length - 1);

  const isIOS = surface === 'ios';
  const pad = isIOS ? '0 20px' : '0 32px';
  const headerPad = isIOS ? '54px 20px 0' : '24px 32px 0';

  const back = (
    <button onClick={onBack} style={{
      border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontFamily: 'inherit',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );

  const heart = (
    <button onClick={() => toggleSaved(bid.id)} style={{
      border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontFamily: 'inherit',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? p.accent : 'none'} stroke={saved ? p.accent : p.ink} strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
    </button>
  );

  return (
    <div style={{ background: p.bg, minHeight: '100%', color: p.ink, fontFamily: type.body, paddingBottom: isIOS ? 110 : 60 }}>
      {/* Hero gallery */}
      <div style={{ position: 'relative', height: isIOS ? 280 : 380, overflow: 'hidden' }}>
        {isIOS && <IOSStatusBar dark />}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${galleryUrl(galleryItems[safeHeroIdx])})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.18s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(31,24,22,0) 0%, rgba(31,24,22,0.30) 100%)' }} />
        <div style={{ position: 'absolute', top: isIOS ? 54 : 24, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          {back}
          {heart}
        </div>
        <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {galleryItems.map((item, i) => {
            const active = i === safeHeroIdx;
            return (
              <button key={i} onClick={() => setHeroIdx(i)} style={{
                width: 60, height: 60, borderRadius: 10, flexShrink: 0,
                backgroundImage: `url(${galleryUrl(item)})`, backgroundSize: 'cover', backgroundPosition: 'center',
                border: active ? `2px solid ${p.accent}` : '1.5px solid rgba(255,255,255,0.7)',
                cursor: 'pointer', padding: 0, fontFamily: 'inherit',
                transform: active ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.12s ease',
              }} />
            );
          })}
        </div>
      </div>

      {/* Header info */}
      <div style={{ padding: isIOS ? '20px 20px 0' : '28px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isIOS ? 30 : 44, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.025em', lineHeight: 1 }}>{bid.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontFamily: type.body, fontSize: 12.5, color: p.inkMuted }}>
              <Stars n={bid.rating} color={p.accent} size={12} />
              <span style={{ color: p.ink, fontWeight: 600 }}>{bid.rating}</span>
              <span>({bid.reviews})</span><span>·</span><span>{bid.neighborhood}</span><span>·</span>
              <span style={{ fontFamily: type.mono }}>{bid.distance} mi</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
              {(bid.badges || []).map(b => <TrustBadge key={b} kind={b} p={p} type={type} />)}
              <TrustBadge kind="fast" p={p} type={type} />
            </div>
          </div>
          {bid.price && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: type.body, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>YOUR BID</div>
              <div style={{ fontFamily: type.mono, fontSize: isIOS ? 30 : 38, fontWeight: 600, color: p.ink, letterSpacing: '-0.02em', marginTop: 2 }}>${bid.price}</div>
              {bid.originalPrice && <div style={{ fontFamily: type.mono, fontSize: 11.5, color: p.inkMuted, textDecoration: 'line-through' }}>${bid.originalPrice}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: isIOS ? '18px 20px 0' : '22px 32px 0', display: 'flex', gap: 6, borderBottom: `0.5px solid ${p.line}`, marginTop: 16 }}>
        {[
          { id: 'about', l: lang === 'en' ? 'About' : 'Sobre' },
          { id: 'services', l: lang === 'en' ? 'Services' : 'Servicios' },
          { id: 'reviews', l: lang === 'en' ? 'Reviews' : 'Reseñas' },
          { id: 'hours', l: lang === 'en' ? 'Hours' : 'Horario' },
        ].map(t => {
          const a = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              border: 0, background: 'transparent', cursor: 'pointer',
              padding: '10px 14px 12px', marginBottom: -1,
              borderBottom: `2px solid ${a ? p.ink : 'transparent'}`,
              fontFamily: type.body, fontSize: 13, fontWeight: a ? 600 : 500,
              color: a ? p.ink : p.inkMuted,
            }}>{t.l}</button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ padding: isIOS ? '18px 20px 24px' : '24px 32px 32px' }}>
        {activeTab === 'about' && (
          <>
            <p style={{ fontSize: isIOS ? 14 : 15, color: p.inkSoft, lineHeight: 1.6, margin: 0 }}>
              {lang === 'en' ? d.about_en : d.about_es}
            </p>
            <div style={{ marginTop: 18, padding: '14px 16px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.inkSoft} strokeWidth="1.7"><path d="M12 22s-8-7-8-13a8 8 0 1 1 16 0c0 6-8 13-8 13z" /><circle cx="12" cy="9" r="3" /></svg>
                <div style={{ flex: 1, fontSize: 13, color: p.ink, fontWeight: 500 }}>{d.address}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${p.line}` }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.inkSoft} strokeWidth="1.7"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <div style={{ flex: 1, fontFamily: type.mono, fontSize: 13, color: p.ink, fontWeight: 500 }}>{d.phone}</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {d.services.map((s, i) => (
              <div key={i} style={{ padding: '14px 16px', background: p.surface, borderRadius: 12, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.ink }}>{lang === 'en' ? s.name_en : s.name_es}</div>
                  <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 2 }}>{s.dur}</div>
                </div>
                <div style={{ fontFamily: type.mono, fontSize: 13.5, fontWeight: 600, color: p.ink }}>${s.from}–${s.to}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allReviews.length === 0 && (
              <div style={{ padding: 24, borderRadius: 14, border: `1px dashed ${p.inkMuted}`, background: p.surface, textAlign: 'center', fontSize: 13, color: p.inkMuted }}>
                {lang === 'en' ? 'No reviews yet — be the first.' : 'Sin reseñas — sé la primera.'}
              </div>
            )}
            {allReviews.map((r, i) => {
              const isUser = !!r.body && !r.body_en;
              const dateLabel = r.createdAt
                ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : r.date;
              const body = isUser ? r.body : (lang === 'en' ? r.body_en : r.body_es);
              const initials = r.initials || r.name.split(' ').map(s => s[0]).slice(0, 2).join('');
              return (
                <div key={r.id || i} style={{ padding: '16px', background: p.surface, borderRadius: 14, border: `0.5px solid ${isUser ? p.accent : p.line}`, position: 'relative' }}>
                  {isUser && (
                    <div style={{ position: 'absolute', top: -8, right: 14, background: p.accent, color: p.bg, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', padding: '3px 8px', borderRadius: 99 }}>
                      {lang === 'en' ? 'YOUR REVIEW' : 'TU RESEÑA'}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 12, fontWeight: 700 }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: p.ink }}>{r.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                        <Stars n={r.rating} color={p.accent} size={10} />
                        <span style={{ fontFamily: type.mono, fontSize: 10.5, color: p.inkMuted }}>{dateLabel}</span>
                      </div>
                    </div>
                  </div>
                  {body && <div style={{ marginTop: 10, fontSize: 13, color: p.inkSoft, lineHeight: 1.55 }}>{body}</div>}
                  {r.tags?.length > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {r.tags.map(t => (
                        <span key={t} style={{ padding: '3px 9px', borderRadius: 99, background: p.bg, border: `0.5px solid ${p.line}`, fontSize: 10.5, fontWeight: 600, color: p.inkSoft }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {r.photos?.length > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.photos.map((url, j) => (
                        <div key={j} style={{ width: 60, height: 60, borderRadius: 8, backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'hours' && (
          <div style={{ background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
            {DAY_ORDER.map((day, i) => {
              const closed = d.hours[day] === 'closed';
              return (
                <div key={day} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: i ? `0.5px solid ${p.line}` : 'none' }}>
                  <span style={{ fontSize: 13, color: p.ink, fontWeight: 500 }}>{day}</span>
                  <span style={{ fontFamily: type.mono, fontSize: 13, fontWeight: 600, color: closed ? p.inkMuted : p.ink }}>{d.hours[day]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky CTA bar */}
      <div style={{
        position: 'sticky', bottom: 0, marginTop: 16,
        padding: isIOS ? '12px 20px 28px' : '16px 32px 24px',
        background: `linear-gradient(180deg, ${p.bg}00 0%, ${p.bg} 30%)`,
        display: 'flex', gap: 8,
      }}>
        {onMessage && (
          <button onClick={() => onMessage(bid)} style={{
            flex: 0, padding: '14px 16px', borderRadius: 14,
            background: p.surface, border: `0.5px solid ${p.line}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.ink} strokeWidth="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </button>
        )}
        {onMakeOffer && (
          <button onClick={() => onMakeOffer(bid)} style={{
            flex: 1, padding: '14px 18px', borderRadius: 14,
            background: p.surface, border: `0.5px solid ${p.line}`, cursor: 'pointer',
            fontFamily: type.body, fontSize: 14, fontWeight: 600, color: p.ink,
          }}>{lang === 'en' ? 'Make offer' : 'Hacer oferta'}</button>
        )}
        <button onClick={() => onBook?.(bid)} style={{
          flex: 1.4, padding: '14px 18px', borderRadius: 14,
          background: p.ink, color: p.bg, border: 0, cursor: 'pointer',
          fontFamily: type.body, fontSize: 14, fontWeight: 600,
        }}>
          {bid.price ? `${lang === 'en' ? 'Book' : 'Reservar'} · $${bid.price}` : (lang === 'en' ? 'Send request' : 'Enviar solicitud')}
        </button>
      </div>
    </div>
  );
}
