import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import Modal from '../components/Modal.jsx';
import { useToast } from '../components/Toast.jsx';

const initialServices = [
  { name: 'Color & balayage', from: 90, to: 160, dur: '2–3 hrs', sel: true },
  { name: 'Cut & style', from: 45, to: 75, dur: '45 min', sel: true },
  { name: 'Hybrid lash set', from: 120, to: 180, dur: '2 hrs', sel: false },
  { name: 'Brow lamination', from: 65, to: 95, dur: '45 min', sel: false },
];

export default function OnboardingSalon() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const step = 2;

  const [items, setItems] = useState(initialServices);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ name: '', from: 50, to: 90, dur: '1 hr' });

  const toggle = i => setItems(curr => curr.map((it, idx) => idx === i ? { ...it, sel: !it.sel } : it));
  const updateField = (i, field, value) => setItems(curr => curr.map((it, idx) => idx === i ? { ...it, [field]: value } : it));
  const updatePrice = (i, field, raw) => {
    const n = raw === '' ? '' : Math.max(0, parseInt(raw.replace(/\D/g, ''), 10) || 0);
    updateField(i, field, n);
  };
  const addService = () => {
    if (!draft.name.trim()) { toast('Service needs a name.', { tone: 'warn' }); return; }
    if (draft.to <= draft.from) { toast('Max price must be higher than min.', { tone: 'warn' }); return; }
    setItems(curr => [...curr, { ...draft, sel: true }]);
    toast(`${draft.name} added.`, { tone: 'success' });
    setShowAdd(false);
    setDraft({ name: '', from: 50, to: 90, dur: '1 hr' });
  };

  const onContinue = () => {
    const selected = items.filter(i => i.sel);
    if (selected.length === 0) { toast('Pick at least one service.', { tone: 'warn' }); return; }
    toast(`${selected.length} service${selected.length === 1 ? '' : 's'} saved. Next: photos.`, { tone: 'success' });
    navigate('/salon');
  };

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: isPhone ? '18px' : '24px 40px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: `0.5px solid ${p.line}` }}>
        <Link to="/" style={{ fontFamily: type.body, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: p.ink, textDecoration: 'none' }}>GLOSSI</Link>
        <span style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.18em' }}>FOR SALONS</span>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, fontWeight: 600 }}>STEP {step} / 4 · BUSINESS</div>
        <div style={{ width: 80, height: 3, borderRadius: 2, background: p.line, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${(step / 4) * 100}%`, background: p.accent }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', alignItems: 'stretch' }}>
        <div style={{ padding: isPhone ? '28px 18px' : '70px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>SERVICES & PRICING</div>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 40 : 60, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '12px 0 0' }}>What do you offer?</h1>
          <p style={{ fontSize: isPhone ? 15 : 16, color: p.inkSoft, lineHeight: 1.55, margin: '12px 0 0', maxWidth: 480 }}>Add your menu — clients see your typical price next to every bid you send. You can adjust per-bid at the moment of quoting.</p>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, background: s.sel ? p.surface : 'transparent', border: `0.5px solid ${s.sel ? p.ink : p.line}`, color: p.ink, width: '100%' }}>
                <button onClick={() => toggle(i)} aria-label={s.sel ? 'Unselect' : 'Select'} style={{ width: 22, height: 22, borderRadius: 4, background: s.sel ? p.ink : 'transparent', border: `1.5px solid ${s.sel ? p.ink : p.inkMuted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.bg, flexShrink: 0, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  {s.sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}
                </button>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <input value={s.name} onChange={e => updateField(i, 'name', e.target.value)} style={{ background: 'transparent', border: 0, outline: 0, fontSize: 14, fontWeight: 600, fontFamily: type.body, color: p.ink, padding: 0, width: '100%' }} />
                  <input value={s.dur} onChange={e => updateField(i, 'dur', e.target.value)} placeholder={isPhone ? 'Duration' : 'e.g. 1 hr'} style={{ background: 'transparent', border: 0, outline: 0, fontSize: 11, color: p.inkMuted, padding: 0, fontFamily: type.body, width: '100%' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: type.mono, fontSize: 13, fontWeight: 600, color: s.sel ? p.ink : p.inkMuted, flexShrink: 0 }}>
                  <span>$</span>
                  <input
                    inputMode="numeric"
                    value={s.from}
                    onChange={e => updatePrice(i, 'from', e.target.value)}
                    placeholder="—"
                    style={{ width: 44, background: p.bg, border: `0.5px solid ${p.line}`, borderRadius: 6, outline: 0, padding: '4px 6px', textAlign: 'right', fontFamily: type.mono, fontSize: 13, fontWeight: 600, color: p.ink }}
                  />
                  <span style={{ color: p.inkMuted }}>–$</span>
                  <input
                    inputMode="numeric"
                    value={s.to}
                    onChange={e => updatePrice(i, 'to', e.target.value)}
                    placeholder="—"
                    style={{ width: 44, background: p.bg, border: `0.5px solid ${p.line}`, borderRadius: 6, outline: 0, padding: '4px 6px', textAlign: 'right', fontFamily: type.mono, fontSize: 13, fontWeight: 600, color: p.ink }}
                  />
                </div>
              </div>
            ))}
            <button onClick={() => setShowAdd(true)} style={{ alignSelf: 'flex-start', background: 'transparent', border: `0.5px dashed ${p.inkMuted}`, color: p.inkSoft, cursor: 'pointer', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}>+ Add another service</button>
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '14px 18px', borderRadius: 99, fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>← Back</button>
            <button onClick={onContinue} style={{ background: p.accent, color: p.ink, border: 0, padding: '14px 22px', borderRadius: 99, fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Continue · upload photos</button>
          </div>
        </div>

        {!isPhone && (
          <div style={{ background: p.ink, color: p.bg, padding: '70px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>HOW YOUR BIDS WILL LOOK</div>
            <div style={{ marginTop: 24, padding: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 18, border: '0.5px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 99, background: 'linear-gradient(135deg,#C28A6B,#8B4F3A)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontStyle: 'italic', fontSize: 14, fontWeight: type.displayWeight, border: `1.5px solid ${p.accent}` }}>CB</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight }}>Casa de Belleza</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>★ 4.9 · 0.8 mi · Fast reply</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                "{items[0]?.name} is my specialty — low maintenance, rich tones."
              </div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: type.mono, fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em' }}>${items[0]?.from + 20 || 110}</span>
                <span style={{ fontFamily: type.mono, fontSize: 12, color: p.accent, fontWeight: 600 }}>{items[0]?.dur || '3 hr'} · Today 4pm</span>
              </div>
            </div>
            <div style={{ marginTop: 18, fontFamily: type.mono, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>PREVIEW · UPDATES IN REAL TIME</div>
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} eyebrow="ADD SERVICE" title="New menu item" footer={
        <>
          <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>Cancel</button>
          <button onClick={addService} style={{ background: p.accent, color: p.ink, border: 0, cursor: 'pointer', padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Add</button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>SERVICE NAME</div>
            <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Keratin treatment" style={{ marginTop: 6, width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>FROM ${draft.from}</div>
              <input type="range" min={20} max={300} value={draft.from} onChange={e => setDraft({ ...draft, from: Number(e.target.value) })} style={{ marginTop: 8, width: '100%', accentColor: p.accent }} />
            </label>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>TO ${draft.to}</div>
              <input type="range" min={20} max={400} value={draft.to} onChange={e => setDraft({ ...draft, to: Number(e.target.value) })} style={{ marginTop: 8, width: '100%', accentColor: p.accent }} />
            </label>
          </div>
          <label>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>DURATION</div>
            <input value={draft.dur} onChange={e => setDraft({ ...draft, dur: e.target.value })} placeholder="e.g. 1 hr" style={{ marginTop: 6, width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }} />
          </label>
        </div>
      </Modal>
    </div>
  );
}
