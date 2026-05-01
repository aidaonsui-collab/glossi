import { useState } from 'react';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];

const APPTS = [
  { day: 0, start: 0, span: 3, client: 'Sofia M.', service: 'Color & balayage', price: 95, status: 'confirmed' },
  { day: 0, start: 5, span: 1, client: 'Daniela R.', service: 'Cut & style', price: 60, status: 'confirmed' },
  { day: 1, start: 1, span: 1, client: 'Maritza C.', service: 'Gel manicure', price: 42, status: 'pending' },
  { day: 1, start: 4, span: 2, client: 'Ana V.', service: 'Highlights', price: 130, status: 'confirmed' },
  { day: 2, start: 2, span: 3, client: 'Camila P.', service: 'Balayage', price: 145, status: 'confirmed' },
  { day: 3, start: 0, span: 1, client: 'Jasmin O.', service: 'Cut + color', price: 110, status: 'confirmed' },
  { day: 3, start: 6, span: 1, client: 'Walk-in', service: 'Blowout', price: 35, status: 'pending' },
  { day: 4, start: 3, span: 2, client: 'Marisol T.', service: 'Bridal trial', price: 130, status: 'confirmed' },
  { day: 5, start: 1, span: 4, client: 'Carmen P.', service: 'Color correction', price: 220, status: 'confirmed' },
];

export default function SalonCalendar() {
  const isPhone = useNarrow();
  const toast = useToast();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    if (!draft.trim()) { toast('Type a message first.', { tone: 'warn' }); return; }
    toast(`Message sent to ${selected.client}.`, { tone: 'success' });
    setMessageOpen(false);
    setDraft('');
    setSelected(null);
  };

  const totalBookings = APPTS.length;
  const totalRevenue = APPTS.reduce((sum, a) => sum + a.price, 0);

  const week = weekOffset === 0 ? 'This week' : weekOffset === 1 ? 'Next week' : weekOffset === -1 ? 'Last week' : `${weekOffset > 0 ? '+' : ''}${weekOffset} weeks`;

  return (
    <SalonLayout active="calendar" mobileTitle="Calendar">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>CALENDAR</div>
            <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>{week}.</h1>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={() => setWeekOffset(w => w - 1)} style={{ width: 38, height: 38, borderRadius: 99, background: p.surface, border: `0.5px solid ${p.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => setWeekOffset(0)} disabled={weekOffset === 0} style={{ padding: '9px 16px', borderRadius: 99, background: weekOffset === 0 ? p.surface2 : p.surface, border: `0.5px solid ${p.line}`, cursor: weekOffset === 0 ? 'default' : 'pointer', fontSize: 12.5, fontWeight: 600, color: p.ink, fontFamily: 'inherit' }}>Today</button>
            <button onClick={() => setWeekOffset(w => w + 1)} style={{ width: 38, height: 38, borderRadius: 99, background: p.surface, border: `0.5px solid ${p.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ padding: '14px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>BOOKINGS</div>
            <div style={{ fontFamily: type.mono, fontSize: 26, fontWeight: 600, color: p.ink, marginTop: 2 }}>{totalBookings}</div>
          </div>
          <div style={{ padding: '14px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>REVENUE</div>
            <div style={{ fontFamily: type.mono, fontSize: 26, fontWeight: 600, color: p.success, marginTop: 2 }}>${totalRevenue.toLocaleString()}</div>
          </div>
          <div style={{ padding: '14px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>UTILIZATION</div>
            <div style={{ fontFamily: type.mono, fontSize: 26, fontWeight: 600, color: p.accent, marginTop: 2 }}>72%</div>
          </div>
        </div>

        {/* Week grid */}
        {isPhone ? (
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {DAYS.map((d, di) => {
              const dayAppts = APPTS.filter(a => a.day === di).sort((a, b) => a.start - b.start);
              if (dayAppts.length === 0) return null;
              return (
                <div key={di}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted, marginBottom: 8 }}>{d.toUpperCase()}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {dayAppts.map((a, i) => (
                      <button key={i} onClick={() => setSelected(a)} style={{ padding: '12px 14px', background: p.surface, borderRadius: 12, border: `0.5px solid ${a.status === 'pending' ? p.accent : p.line}`, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink }}>
                        <div style={{ fontFamily: type.mono, fontSize: 12, fontWeight: 600, color: p.ink, minWidth: 50 }}>{HOURS[a.start]}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{a.client}</div>
                          <div style={{ fontSize: 11.5, color: p.inkMuted }}>{a.service}</div>
                        </div>
                        <div style={{ fontFamily: type.mono, fontSize: 13, fontWeight: 600 }}>${a.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ marginTop: 22, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: `0.5px solid ${p.line}`, background: p.surface2 }}>
              <div />
              {DAYS.map(d => (
                <div key={d} style={{ padding: '14px 8px', fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textAlign: 'center' }}>{d.toUpperCase()}</div>
              ))}
            </div>
            {/* Hour rows */}
            {HOURS.map((h, hi) => (
              <div key={h} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderTop: hi ? `0.5px solid ${p.line}` : 'none', minHeight: 56 }}>
                <div style={{ padding: '6px 8px', fontFamily: type.mono, fontSize: 10, color: p.inkMuted, textAlign: 'right', borderRight: `0.5px solid ${p.line}` }}>{h}</div>
                {DAYS.map((_, di) => {
                  const a = APPTS.find(x => x.day === di && x.start === hi);
                  return (
                    <div key={di} style={{ borderRight: di < 6 ? `0.5px solid ${p.line}` : 'none', padding: 4, position: 'relative' }}>
                      {a && (
                        <button onClick={() => setSelected(a)} style={{
                          position: 'absolute', inset: 4,
                          height: `calc(${a.span * 100}% + ${(a.span - 1) * 0.5}px - 8px)`,
                          padding: '6px 8px', borderRadius: 8,
                          background: a.status === 'pending' ? p.accentSoft : p.ink,
                          color: a.status === 'pending' ? p.ink : p.bg,
                          border: a.status === 'pending' ? `0.5px solid ${p.accent}` : 0,
                          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', overflow: 'hidden',
                          display: 'flex', flexDirection: 'column', gap: 2,
                        }}>
                          <div style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.1 }}>{a.client}</div>
                          <div style={{ fontSize: 9.5, opacity: a.status === 'pending' ? 0.7 : 0.6, lineHeight: 1.2 }}>{a.service}</div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Detail strip */}
        {selected && (
          <div style={{ marginTop: 16, padding: '16px 18px', background: p.ink, color: p.bg, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontFamily: type.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)' }}>{DAYS[selected.day]} · {HOURS[selected.start]}</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, marginTop: 4 }}>{selected.client} · {selected.service}</div>
            </div>
            <div style={{ fontFamily: type.mono, fontSize: 24, fontWeight: 600 }}>${selected.price}</div>
            <button onClick={() => { setDraft(`Hi ${selected.client.split(' ')[0]} — `); setMessageOpen(true); }} style={{ background: 'rgba(255,255,255,0.1)', border: 0, padding: '10px 18px', borderRadius: 99, color: p.bg, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Message</button>
            <button onClick={() => setSelected(null)} style={{ background: p.accent, color: p.ink, border: 0, padding: '10px 18px', borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Close</button>
          </div>
        )}
      </div>

      <Modal open={messageOpen} onClose={() => { setMessageOpen(false); setDraft(''); }} eyebrow="MESSAGE CLIENT" title={selected?.client || ''} footer={
        <>
          <button onClick={() => { setMessageOpen(false); setDraft(''); }} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={sendMessage} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Send</button>
        </>
      }>
        {selected && (
          <div>
            <div style={{ padding: '10px 12px', background: p.bg, borderRadius: 10, fontSize: 12, color: p.inkSoft, marginBottom: 12 }}>
              {DAYS[selected.day]} · {HOURS[selected.start]} · {selected.service}
            </div>
            <textarea value={draft} onChange={e => setDraft(e.target.value)} autoFocus rows={5} placeholder="Confirmation, slot change, what to bring…" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        )}
      </Modal>
    </SalonLayout>
  );
}
