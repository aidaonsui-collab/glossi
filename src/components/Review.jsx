import { useRef, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { IOSStatusBar } from '../ios/IOSFrame.jsx';
import SalonPhoto from './SalonPhoto.jsx';
import { useAuth, useBookings, useReviews } from '../store.jsx';
import { useToast } from './Toast.jsx';

// surface = 'web' | 'ios'
export default function Review({ surface, booking, onBack, onSubmitted }) {
  const isIOS = surface === 'ios';
  const toast = useToast();
  const { user } = useAuth();
  const { add: addReview } = useReviews();
  const { markReviewed } = useBookings();
  const fileRef = useRef(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState([]);
  const [tags, setTags] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  if (!booking) return null;

  const onPhoto = e => {
    const files = Array.from(e.target.files || []).slice(0, 4 - photos.length);
    const readers = files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(f);
    }));
    Promise.all(readers).then(urls => setPhotos(curr => [...curr, ...urls].slice(0, 4)));
  };

  const toggleTag = t => setTags(curr => {
    const next = new Set(curr);
    if (next.has(t)) next.delete(t); else next.add(t);
    return next;
  });

  const submit = () => {
    if (rating === 0) { toast('Tap a star to rate.', { tone: 'warn' }); return; }
    setSubmitting(true);
    setTimeout(() => {
      addReview(booking.salonId, {
        name: user?.name || 'Guest', initials: user?.initials || 'G',
        rating, body, photos, tags: Array.from(tags),
        service: booking.service,
      });
      markReviewed(booking.id, rating);
      toast(`Review posted to ${booking.salonName}.`, { tone: 'success' });
      onSubmitted?.();
    }, 500);
  };

  const TAGS = ['On time', 'Clean', 'Skilled', 'Friendly', 'Worth the price', 'Will rebook', 'Photos matched'];
  const ratingLabel = ['Tap a star', 'Bad', 'Meh', 'Fine', 'Great', 'Excellent'][hover || rating];

  return (
    <div style={{ background: p.bg, minHeight: '100%', color: p.ink, fontFamily: type.body, paddingBottom: isIOS ? 110 : 40 }}>
      {isIOS && <IOSStatusBar />}

      {/* Header */}
      <div style={{ padding: isIOS ? '54px 20px 12px' : '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `0.5px solid ${p.line}` }}>
        <button onClick={onBack} disabled={submitting} style={{
          border: 0, cursor: submitting ? 'not-allowed' : 'pointer', width: 36, height: 36, borderRadius: 999,
          background: p.surface, boxShadow: `inset 0 0 0 0.5px ${p.line}`, opacity: submitting ? 0.5 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.14em', fontWeight: 600 }}>RATE YOUR VISIT</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: isIOS ? '20px 20px' : '28px 32px 32px', maxWidth: 600, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Salon card */}
        <div style={{ display: 'flex', gap: 12, padding: '14px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
          <SalonPhoto mood={booking.mood ?? 0} h={60} style={{ width: 60, borderRadius: 10 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{booking.salonName}</div>
            <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 2 }}>{booking.service}{booking.slot ? ` · ${booking.slot}` : ''}</div>
          </div>
        </div>

        {/* Stars */}
        <div style={{ marginTop: 26, textAlign: 'center' }}>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isIOS ? 28 : 36, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.025em', lineHeight: 1.05, margin: 0 }}>
            How was it?
          </h1>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 10 }}>
            {[1, 2, 3, 4, 5].map(n => {
              const filled = n <= (hover || rating);
              return (
                <button key={n} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} style={{
                  background: 'transparent', border: 0, cursor: 'pointer', padding: 4, fontFamily: 'inherit',
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill={filled ? p.accent : 'none'} stroke={p.accent} strokeWidth="1.5">
                    <path d="M12 2l3 7 7.5.5-5.5 5 1.5 7.5L12 18l-6.5 4 1.5-7.5-5.5-5L9 9z" strokeLinejoin="round" />
                  </svg>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 8, fontFamily: type.mono, fontSize: 12, color: p.inkMuted, letterSpacing: '0.06em' }}>
            {ratingLabel.toUpperCase()}
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginTop: 26 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>WHAT STOOD OUT</div>
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TAGS.map(t => {
              const sel = tags.has(t);
              return (
                <button key={t} onClick={() => toggleTag(t)} style={{
                  padding: '8px 14px', borderRadius: 99,
                  background: sel ? p.ink : 'transparent', color: sel ? p.bg : p.ink,
                  border: `0.5px solid ${sel ? p.ink : p.line}`, cursor: 'pointer',
                  fontFamily: type.body, fontSize: 12.5, fontWeight: 600,
                }}>{sel ? '✓ ' : ''}{t}</button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>YOUR REVIEW <span style={{ color: p.inkMuted, fontWeight: 500, letterSpacing: 0 }}>· optional</span></div>
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="What was the vibe? Was the result what you asked for? Anything future clients should know?"
            rows={5}
            style={{ marginTop: 8, width: '100%', padding: '14px 16px', borderRadius: 12, border: `0.5px solid ${p.line}`, background: p.surface, fontFamily: type.body, fontSize: 14, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ fontFamily: type.mono, fontSize: 10.5, color: p.inkMuted, marginTop: 4, textAlign: 'right' }}>{body.length} / 500</div>
        </div>

        {/* Photos */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>ADD PHOTOS <span style={{ color: p.inkMuted, fontWeight: 500, letterSpacing: 0 }}>· optional</span></div>
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[0, 1, 2, 3].map(i => {
              const url = photos[i];
              if (url) {
                return (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 12, overflow: 'hidden', backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <button onClick={() => setPhotos(curr => curr.filter((_, idx) => idx !== i))} style={{
                      position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 99, border: 0,
                      background: 'rgba(0,0,0,0.7)', color: '#fff', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', fontSize: 12,
                    }}>×</button>
                  </div>
                );
              }
              if (i === photos.length) {
                return (
                  <button key={i} onClick={() => fileRef.current?.click()} style={{
                    aspectRatio: '1', borderRadius: 12, border: `1px dashed ${p.inkMuted}`, background: p.surface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: p.inkMuted,
                    fontFamily: 'inherit',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                );
              }
              return (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 12, border: `1px dashed ${p.line}`, background: p.surface }} />
              );
            })}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={onPhoto} style={{ display: 'none' }} />
        </div>

        {/* Submit */}
        <button onClick={submit} disabled={submitting} style={{
          marginTop: 26, width: '100%', padding: '16px 18px', borderRadius: 14, border: 0,
          cursor: submitting ? 'wait' : 'pointer',
          background: rating ? p.ink : p.line, color: p.bg, opacity: submitting ? 0.7 : 1,
          fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight,
        }}>
          {submitting ? 'Posting…' : (rating ? `Post review · ${rating}★` : 'Pick a rating')}
        </button>

        <div style={{ marginTop: 10, fontSize: 11.5, color: p.inkMuted, lineHeight: 1.5, textAlign: 'center' }}>
          Reviews appear on {booking.salonName}'s profile under your first name.
        </div>
      </div>
    </div>
  );
}
