import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { defaultPalette as p, defaultType as type, PHOTOS } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import { useAuth } from '../store.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const SERVICE_OPTIONS = [
  'Color & balayage', 'Cut & style', 'Lashes', 'Mani · Pedi',
  'Brows', 'Barber', 'Facial', 'Bridal',
];

export default function OnboardingCustomer() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, refreshProfile } = useAuth();
  const step = 1;
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [zip, setZip] = useState('');
  const [services, setServices] = useState(new Set());

  // Once the auth user finishes loading, prefill the name (unless user already typed)
  useEffect(() => {
    if (!nameTouched && user?.name && user.name !== 'Sofia Martínez') setName(user.name);
  }, [user, nameTouched]);

  const toggle = s => setServices(curr => {
    const next = new Set(curr);
    if (next.has(s)) next.delete(s); else next.add(s);
    return next;
  });

  const onContinue = async () => {
    if (!name.trim()) { toast('Add your name to continue.', { tone: 'warn' }); return; }
    if (!/^\d{5}$/.test(zip)) { toast('ZIP must be 5 digits.', { tone: 'warn' }); return; }
    if (services.size === 0) { toast('Pick at least one service.', { tone: 'warn' }); return; }
    if (isSupabaseConfigured && user?.id) {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim(), home_zip: zip })
        .eq('id', user.id);
      if (error) { toast(error.message, { tone: 'warn' }); return; }
      await refreshProfile?.();
    }
    toast(`Welcome, ${name.split(' ')[0]}.`, { tone: 'success' });
    navigate('/quotes');
  };

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: isPhone ? '18px' : '24px 40px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: `0.5px solid ${p.line}` }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, fontWeight: 600 }}>STEP {step} / 3</div>
        <div style={{ width: 80, height: 3, borderRadius: 2, background: p.line, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${(step / 3) * 100}%`, background: p.accent }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.05fr 1fr' }}>
        <div style={{ padding: isPhone ? '28px 18px' : '70px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 600 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>WELCOME</div>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 40 : 64, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '12px 0 0', textWrap: 'balance' }}>Let's find your <span style={{ color: p.accent }}>look.</span></h1>
          <p style={{ fontSize: isPhone ? 15 : 17, color: p.inkSoft, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 480, textWrap: 'pretty' }}>Tell us a bit about what you book and we'll tune the salons we show. You can change this anytime.</p>

          <div style={{ marginTop: isPhone ? 22 : 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>YOUR NAME</div>
              <input value={name} onChange={e => { setName(e.target.value); setNameTouched(true); }} style={{ marginTop: 6, width: '100%', padding: '14px 16px', border: `0.5px solid ${p.line}`, borderRadius: 12, background: p.surface, fontFamily: type.body, fontSize: 15, color: p.ink, outline: 'none' }} />
            </label>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>ZIP CODE · WE'LL MATCH NEARBY SALONS</div>
              <input value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} inputMode="numeric" style={{ marginTop: 6, width: '100%', padding: '14px 16px', border: `0.5px solid ${p.line}`, borderRadius: 12, background: p.surface, fontFamily: type.mono, fontSize: 18, color: p.ink, outline: 'none', letterSpacing: '0.1em' }} />
            </label>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>WHAT DO YOU BOOK MOST? <span style={{ color: services.size ? p.accent : p.inkMuted }}>· {services.size} selected</span></div>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SERVICE_OPTIONS.map(s => {
                  const sel = services.has(s);
                  return (
                    <button key={s} onClick={() => toggle(s)} style={{ padding: '9px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, background: sel ? p.ink : 'transparent', color: sel ? p.bg : p.ink, border: `0.5px solid ${sel ? p.ink : p.line}`, cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop: isPhone ? 22 : 32, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={onContinue} style={{ background: p.accent, color: p.ink, border: 0, padding: '14px 22px', borderRadius: 99, fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Continue →</button>
            <button onClick={() => { toast("We'll ask later."); navigate('/quotes/empty'); }} style={{ background: 'transparent', border: 0, fontSize: 12, color: p.inkMuted, cursor: 'pointer', fontFamily: 'inherit' }}>Skip · we'll ask later</button>
          </div>
        </div>

        {!isPhone && (
          <div style={{ background: p.surface, borderLeft: `0.5px solid ${p.line}`, padding: '70px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{name.split(' ')[0]?.toUpperCase() || 'YOUR'} FUTURE FEED</div>
            <div style={{ marginTop: 12, fontFamily: type.display, fontStyle: 'italic', fontSize: 30, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1 }}>3 salons within 2 mi.</div>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { n: 'Casa de Belleza', m: 0, r: 4.9, miles: '0.8 mi' },
                { n: 'Studio Onyx', m: 3, r: 4.8, miles: '1.4 mi' },
                { n: 'La Reina Salon', m: 1, r: 4.6, miles: '2.6 mi' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', background: p.bg, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
                  <div style={{ width: 50, height: 50, borderRadius: 10, backgroundImage: `url(${PHOTOS[s.m]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, letterSpacing: '-0.01em' }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 2 }}>★ {s.r} · {s.miles} · ZIP {zip || '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
