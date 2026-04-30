import { Link } from 'react-router-dom';
import { useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import Modal from '../components/Modal.jsx';
import { useToast } from '../components/Toast.jsx';

export default function SalonEmpty() {
  const isPhone = useNarrow();
  const toast = useToast();
  const [showManual, setShowManual] = useState(false);
  const [showAvail, setShowAvail] = useState(false);
  const [client, setClient] = useState('');
  const [service, setService] = useState('Color & balayage');
  const [price, setPrice] = useState(110);
  const [days, setDays] = useState({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false });
  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, padding: isPhone ? '24px 18px' : '40px 64px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: 24, fontSize: 12, color: p.inkMuted, textDecoration: 'none', letterSpacing: '0.18em', fontWeight: 700 }}>← GLOSSI</Link>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>CASA DE BELLEZA · INBOX</div>
      <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', margin: '8px 0 0', lineHeight: 1 }}>All caught up.</h1>
      <div style={{ marginTop: isPhone ? 22 : 32, padding: isPhone ? '24px' : '40px', borderRadius: 18, background: p.surface, border: `0.5px solid ${p.line}`, display: 'flex', flexDirection: isPhone ? 'column' : 'row', alignItems: 'center', gap: isPhone ? 16 : 30 }}>
        <div style={{ width: 80, height: 80, borderRadius: 99, background: p.success + '1f', color: p.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
        </div>
        <div style={{ flex: 1, textAlign: isPhone ? 'center' : 'left' }}>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 30, fontWeight: type.displayWeight, letterSpacing: '-0.015em' }}>No new requests right now.</div>
          <div style={{ marginTop: 8, fontSize: 14, color: p.inkSoft, lineHeight: 1.55 }}>Average request volume in your area is 12 / day. New requests will appear here automatically — usually busiest 9–11am and 4–6pm.</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setShowManual(true)} style={{ background: p.ink, color: p.bg, border: 0, cursor: 'pointer', padding: '12px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>+ Manual quote</button>
            <button onClick={() => setShowAvail(true)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '12px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>Edit availability</button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: isPhone ? 20 : 32, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>WHILE YOU WAIT</div>
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : 'repeat(3,1fr)', gap: 10 }}>
        {[
          { k: 'Profile completeness', v: '88%', d: 'Add 2 service photos to hit 100%' },
          { k: 'Response medal', v: 'Top 12%', d: 'Stay under 10 min to keep it' },
          { k: 'This week', v: '$1,284', d: '7 bookings · 3 reviews left' },
        ].map((s, i) => (
          <button key={i} onClick={() => toast(`${s.k}: ${s.v} — ${s.d}`)} style={{ padding: '18px', borderRadius: 14, background: p.surface, border: `0.5px solid ${p.line}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 32, fontWeight: type.displayWeight, marginTop: 4, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.v}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: p.inkSoft }}>{s.d}</div>
          </button>
        ))}
      </div>

      <Modal open={showManual} onClose={() => setShowManual(false)} eyebrow="MANUAL QUOTE" title="Send to a regular client" footer={
        <>
          <button onClick={() => setShowManual(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>Cancel</button>
          <button onClick={() => { if (!client) { toast('Add a client name first.', { tone: 'warn' }); return; } toast(`Quote sent to ${client} — $${price} · ${service}.`, { tone: 'success' }); setShowManual(false); setClient(''); }} style={{ background: p.accent, color: p.ink, border: 0, cursor: 'pointer', padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Send quote</button>
        </>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>CLIENT NAME OR PHONE</div>
            <input value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. Maria López · 956-555-0102" style={{ marginTop: 6, width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }} />
          </label>
          <label>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>SERVICE</div>
            <select value={service} onChange={e => setService(e.target.value)} style={{ marginTop: 6, width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }}>
              {['Color & balayage', 'Cut & style', 'Lashes', 'Mani · Pedi', 'Brows', 'Barber'].map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>PRICE — ${price}</div>
            <input type="range" min={30} max={250} value={price} onChange={e => setPrice(Number(e.target.value))} style={{ marginTop: 6, width: '100%', accentColor: p.accent }} />
          </div>
        </div>
      </Modal>

      <Modal open={showAvail} onClose={() => setShowAvail(false)} eyebrow="AVAILABILITY" title="Working days" footer={
        <>
          <button onClick={() => setShowAvail(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>Cancel</button>
          <button onClick={() => { toast('Availability saved.', { tone: 'success' }); setShowAvail(false); }} style={{ background: p.ink, color: p.bg, border: 0, cursor: 'pointer', padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Save</button>
        </>
      }>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
          {Object.entries(days).map(([d, on]) => (
            <button key={d} onClick={() => setDays(curr => ({ ...curr, [d]: !curr[d] }))} style={{ padding: '12px 0', borderRadius: 10, background: on ? p.ink : p.bg, color: on ? p.bg : p.inkMuted, border: `0.5px solid ${on ? p.ink : p.line}`, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>{d}</button>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.55 }}>
          {Object.values(days).filter(Boolean).length} day(s) on. Requests for off-days will skip your inbox automatically.
        </div>
      </Modal>
    </div>
  );
}
