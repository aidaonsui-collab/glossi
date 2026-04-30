import { useRef, useState } from 'react';
import { IOSStatusBar } from '../IOSFrame.jsx';
import { Eyebrow } from '../atoms.jsx';
import { T, SERVICES } from '../data.js';

export default function Compose({ p, type, lang, onBack, onSubmit }) {
  const t = T[lang];
  const [step, setStep] = useState(0);
  const [service, setService] = useState('color');
  const [when, setWhen] = useState('asap');
  const [details, setDetails] = useState(lang === 'en'
    ? 'Shoulder-length, currently dark brown. Looking for soft caramel balayage, low-maintenance.'
    : 'Largo a los hombros, actualmente castaño oscuro. Quiero balayage caramelo suave.');
  const [photos, setPhotos] = useState([]);
  const fileRef = useRef(null);
  const total = 4;

  const onPhotoPick = e => {
    const files = Array.from(e.target.files || []).slice(0, 4 - photos.length);
    Promise.all(files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(f);
    }))).then(urls => setPhotos(curr => [...curr, ...urls].slice(0, 4)));
    e.target.value = '';
  };
  const removePhoto = i => setPhotos(curr => curr.filter((_, idx) => idx !== i));

  const NextBtn = ({ label, sub, onClick }) => (
    <button onClick={onClick} style={{
      width: '100%', border: 0, cursor: 'pointer', background: p.ink, color: p.bg,
      padding: '16px', borderRadius: 14, fontFamily: type.body, fontSize: 15, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <span>{label}</span>
        {sub && <span style={{ fontSize: 11, color: p.inkMuted, fontWeight: 500 }}>{sub}</span>}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={p.bg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else onSubmit({ service, when, details, photos });
  };

  return (
    <div style={{ background: p.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <IOSStatusBar />
      <div style={{ padding: '54px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => (step === 0 ? onBack() : setStep(step - 1))} style={{
          border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: p.surface, borderWidth: 0,
          boxShadow: `inset 0 0 0 0.5px ${p.line}`,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.08em' }}>
          {String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>

      <div style={{ padding: '12px 20px 0', display: 'flex', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? p.accent : p.line, transition: 'background .2s' }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: '24px 20px 20px' }}>
        {step === 0 && (
          <>
            <Eyebrow c={p.inkMuted}>SERVICE</Eyebrow>
            <div style={{ fontFamily: type.display, fontSize: 32, lineHeight: 1.05, color: p.ink, marginTop: 6, fontWeight: type.displayWeight, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
              {lang === 'en' ? 'What do you want done?' : '¿Qué te quieres hacer?'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22 }}>
              {SERVICES.map(s => (
                <button key={s.id} onClick={() => setService(s.id)} style={{
                  border: `0.5px solid ${service === s.id ? p.ink : p.line}`,
                  background: service === s.id ? p.ink : p.surface,
                  color: service === s.id ? p.bg : p.ink,
                  padding: '10px 14px', borderRadius: 999,
                  fontFamily: type.body, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}>{s[lang]}</button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Eyebrow c={p.inkMuted}>{t.detail.toUpperCase()}</Eyebrow>
            <div style={{ fontFamily: type.display, fontSize: 32, lineHeight: 1.05, color: p.ink, marginTop: 6, fontWeight: type.displayWeight, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
              {lang === 'en' ? 'Tell salons more.' : 'Dales más detalles.'}
            </div>
            <textarea value={details} onChange={e => setDetails(e.target.value)} style={{
              width: '100%', minHeight: 130, marginTop: 22, background: p.surface, border: `0.5px solid ${p.line}`,
              borderRadius: 14, padding: '14px', fontFamily: type.body, fontSize: 14, color: p.ink, lineHeight: 1.5,
              resize: 'none', outline: 'none', boxSizing: 'border-box',
            }} />
            <div style={{ marginTop: 16 }}>
              <Eyebrow c={p.inkMuted}>{t.photos.toUpperCase()}</Eyebrow>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {[0, 1, 2, 3].map(i => {
                  const url = photos[i];
                  if (url) {
                    return (
                      <div key={i} style={{ flex: 1, aspectRatio: '1', borderRadius: 12, position: 'relative', overflow: 'hidden', backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <button onClick={() => removePhoto(i)} style={{
                          position: 'absolute', top: 5, right: 5, width: 22, height: 22, borderRadius: 99, border: 0,
                          background: 'rgba(0,0,0,0.7)', color: '#fff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', fontSize: 13,
                        }}>×</button>
                      </div>
                    );
                  }
                  if (i === photos.length) {
                    return (
                      <button key={i} onClick={() => fileRef.current?.click()} style={{
                        flex: 1, aspectRatio: '1', borderRadius: 12, border: `1px dashed ${p.inkMuted}`, background: p.surface,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.inkMuted, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </button>
                    );
                  }
                  return (
                    <div key={i} style={{
                      flex: 1, aspectRatio: '1', borderRadius: 12, border: `1px dashed ${p.line}`, background: p.surface,
                    }} />
                  );
                })}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" onChange={onPhotoPick} style={{ display: 'none' }} />
              <div style={{ fontFamily: type.body, fontSize: 11, color: p.inkMuted, marginTop: 8 }}>
                {photos.length === 0 ? t.photosOpt : `${photos.length} / 4 added · tap a photo to remove`}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Eyebrow c={p.inkMuted}>{t.when.toUpperCase().replace('?', '').replace('¿', '')}</Eyebrow>
            <div style={{ fontFamily: type.display, fontSize: 32, lineHeight: 1.05, color: p.ink, marginTop: 6, fontWeight: type.displayWeight, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
              {lang === 'en' ? 'When works?' : '¿Cuándo te conviene?'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 22 }}>
              {[
                { id: 'asap', label: t.asap, sub: lang === 'en' ? 'Today or tomorrow' : 'Hoy o mañana' },
                { id: 'week', label: t.thisWeek, sub: lang === 'en' ? 'Next 7 days' : 'Próximos 7 días' },
                { id: 'flex', label: t.flexible, sub: lang === 'en' ? 'Best price wins' : 'El mejor precio gana' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setWhen(opt.id)} style={{
                  border: `0.5px solid ${when === opt.id ? p.ink : p.line}`,
                  background: p.surface, boxShadow: when === opt.id ? `inset 0 0 0 1px ${p.ink}` : 'none',
                  padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  textAlign: 'left', fontFamily: 'inherit',
                }}>
                  <div>
                    <div style={{ fontFamily: type.body, fontSize: 14, fontWeight: 600, color: p.ink }}>{opt.label}</div>
                    <div style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkMuted, marginTop: 2 }}>{opt.sub}</div>
                  </div>
                  <div style={{ width: 18, height: 18, borderRadius: 999, border: `1.5px solid ${when === opt.id ? p.ink : p.line}`, background: when === opt.id ? p.ink : 'transparent' }} />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Eyebrow c={p.inkMuted}>{lang === 'en' ? 'REVIEW' : 'REVISAR'}</Eyebrow>
            <div style={{ fontFamily: type.display, fontSize: 32, lineHeight: 1.05, color: p.ink, marginTop: 6, fontWeight: type.displayWeight, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
              {lang === 'en' ? 'Looks good?' : '¿Todo bien?'}
            </div>
            <div style={{ marginTop: 22, background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, padding: '4px 16px' }}>
              {[
                { k: t.detail, v: SERVICES.find(s => s.id === service)[lang] },
                { k: lang === 'en' ? 'Notes' : 'Notas', v: details.length > 50 ? details.slice(0, 50) + '…' : details },
                { k: t.when, v: when === 'asap' ? t.asap : when === 'week' ? t.thisWeek : t.flexible },
                { k: t.yourZip, v: '78501' },
              ].map((r, i, arr) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: i < arr.length - 1 ? `0.5px solid ${p.line}` : 'none', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontFamily: type.body, fontSize: 12, color: p.inkMuted, fontWeight: 500, minWidth: 70 }}>{r.k}</div>
                  <div style={{ fontFamily: type.body, fontSize: 13, color: p.ink, fontWeight: 500, textAlign: 'right', flex: 1 }}>{r.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: '12px 14px', background: p.accentSoft, borderRadius: 12, fontFamily: type.body, fontSize: 12, color: p.ink, lineHeight: 1.5 }}>
              {lang === 'en' ? '14 salons within 5 mi will see this. First bids land in ~5 min.' : '14 salones a 8 km verán esto. Primeras ofertas en ~5 min.'}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '8px 20px 36px' }}>
        {step < total - 1
          ? <NextBtn label={lang === 'en' ? 'Continue' : 'Continuar'} onClick={next} />
          : <NextBtn label={t.send} sub={t.sendSub} onClick={next} />}
      </div>
    </div>
  );
}
