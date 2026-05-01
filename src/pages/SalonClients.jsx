import { useMemo, useState } from 'react';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import { Stars } from '../ios/atoms.jsx';
import Modal from '../components/Modal.jsx';

const CLIENTS = [
  { name: 'Sofia M.', initials: 'SM', visits: 6, lastVisit: 'Today', spent: 540, top: 'Color & balayage', rating: 5, since: 'Jan 2025', notes: 'Loves caramel tones. No purple hues.' },
  { name: 'Daniela R.', initials: 'DR', visits: 4, lastVisit: '14d ago', spent: 280, top: 'Lash · Hybrid set', rating: 4, since: 'Mar 2025', notes: 'Allergy to standard adhesive.' },
  { name: 'Maritza C.', initials: 'MC', visits: 8, lastVisit: '5d ago', spent: 410, top: 'Gel manicure', rating: 5, since: 'Nov 2024', notes: '' },
  { name: 'Ana V.', initials: 'AV', visits: 12, lastVisit: '2d ago', spent: 1340, top: 'Highlights', rating: 5, since: 'Aug 2024', notes: 'VIP — gets 10% off all bookings.' },
  { name: 'Camila P.', initials: 'CP', visits: 3, lastVisit: '21d ago', spent: 410, top: 'Balayage', rating: 5, since: 'Jul 2025', notes: '' },
  { name: 'Jasmin O.', initials: 'JO', visits: 5, lastVisit: '1mo ago', spent: 565, top: 'Brazilian blowout', rating: 4, since: 'Feb 2025', notes: '' },
  { name: 'Carmen P.', initials: 'CA', visits: 2, lastVisit: '6mo ago', spent: 220, top: 'Cut + style', rating: 4, since: 'Sep 2024', notes: 'Needed re-do once — careful with bangs.' },
];

const SORTS = [
  { id: 'recent', l: 'Most recent' },
  { id: 'top', l: 'Top spenders' },
  { id: 'name', l: 'A–Z' },
];

export default function SalonClients() {
  const isPhone = useNarrow();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('recent');
  const [messageTo, setMessageTo] = useState(null);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    if (!draft.trim()) { toast('Type a message first.', { tone: 'warn' }); return; }
    toast(`Message sent to ${messageTo.name}.`, { tone: 'success' });
    setMessageTo(null);
    setDraft('');
  };

  const list = useMemo(() => {
    let arr = CLIENTS;
    if (q.trim()) arr = arr.filter(c => `${c.name} ${c.top}`.toLowerCase().includes(q.toLowerCase()));
    if (sort === 'top') arr = [...arr].sort((a, b) => b.spent - a.spent);
    if (sort === 'name') arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [q, sort]);

  const totalClients = CLIENTS.length;
  const totalRevenue = CLIENTS.reduce((s, c) => s + c.spent, 0);
  const repeat = CLIENTS.filter(c => c.visits >= 3).length;

  return (
    <SalonLayout active="clients" mobileTitle="Clients">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>CLIENTS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Your book.</h1>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: isPhone ? 'repeat(3,1fr)' : 'repeat(3, max-content)', gap: 12 }}>
          {[
            { k: 'Total clients', v: totalClients, c: p.ink },
            { k: 'Repeat (3+)', v: `${repeat}/${totalClients}`, c: p.success },
            { k: 'Lifetime $', v: `$${totalRevenue.toLocaleString()}`, c: p.accent },
          ].map((s, i) => (
            <div key={i} style={{ padding: '14px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
              <div style={{ fontFamily: type.mono, fontSize: isPhone ? 22 : 28, fontWeight: 600, color: s.c, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 12, minWidth: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.inkMuted} strokeWidth="1.7"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search clients" style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: type.body, fontSize: 14, color: p.ink }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {SORTS.map(s => {
              const a = sort === s.id;
              return (
                <button key={s.id} onClick={() => setSort(s.id)} style={{
                  padding: '9px 14px', borderRadius: 99,
                  background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                  border: `0.5px solid ${a ? p.ink : p.line}`, cursor: 'pointer',
                  fontFamily: type.body, fontSize: 12.5, fontWeight: 600,
                }}>{s.l}</button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 18, background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
          {list.map((c, i) => (
            <div key={c.name} style={{
              padding: isPhone ? '14px 16px' : '18px 22px',
              borderTop: i ? `0.5px solid ${p.line}` : 'none',
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, flexShrink: 0, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 14, fontWeight: 700 }}>{c.initials}</div>
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 17, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{c.name}</div>
                  <Stars n={c.rating} color={p.accent} size={11} />
                </div>
                <div style={{ fontSize: 11.5, color: p.inkMuted, marginTop: 2 }}>{c.top} · client since {c.since}</div>
                {c.notes && <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 6, fontStyle: 'italic', maxWidth: 380 }}>"{c.notes}"</div>}
              </div>
              <div style={{ minWidth: 70 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: p.inkMuted }}>VISITS</div>
                <div style={{ fontFamily: type.mono, fontSize: 15, fontWeight: 600, color: p.ink, marginTop: 1 }}>{c.visits}</div>
              </div>
              <div style={{ minWidth: 80 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: p.inkMuted }}>SPENT</div>
                <div style={{ fontFamily: type.mono, fontSize: 15, fontWeight: 600, color: p.success, marginTop: 1 }}>${c.spent}</div>
              </div>
              <div style={{ minWidth: 80 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: p.inkMuted }}>LAST</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: p.ink, marginTop: 1 }}>{c.lastVisit}</div>
              </div>
              <button onClick={() => { setMessageTo(c); setDraft(`Hi ${c.name.split(' ')[0]} — `); }} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: p.ink, fontFamily: 'inherit' }}>Message</button>
            </div>
          ))}
          {list.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: p.inkMuted }}>No clients match "{q}"</div>
          )}
        </div>
      </div>

      <Modal open={!!messageTo} onClose={() => { setMessageTo(null); setDraft(''); }} eyebrow="MESSAGE CLIENT" title={messageTo?.name || ''} footer={
        <>
          <button onClick={() => { setMessageTo(null); setDraft(''); }} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={sendMessage} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Send</button>
        </>
      }>
        {messageTo && (
          <div>
            <div style={{ padding: '10px 12px', background: p.bg, borderRadius: 10, fontSize: 12, color: p.inkSoft, marginBottom: 12 }}>
              Last visit: {messageTo.lastVisit} · {messageTo.visits} visits · {messageTo.top}
            </div>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              autoFocus
              rows={5}
              placeholder="Quick note, slot offer, or follow-up…"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}
      </Modal>
    </SalonLayout>
  );
}
