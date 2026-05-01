import { useMemo, useState } from 'react';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import { useMyBusinesses, useSalonBookingsList } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];
const HOUR_START = 9;

// Monday of the week containing `date` (in local TZ), at 00:00.
function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // shift Sun(0) → 6 so Mon = 0
  d.setDate(d.getDate() - dow);
  return d;
}

const fmtServices = slugs => (slugs || []).map(s => s.replace('-', ' & ')).join(', ') || 'Appointment';
const fmtPrice = cents => `$${Math.round((cents || 0) / 100)}`;

// Project a booking onto the (day 0-6, start 0-10, span 1-N) grid
// relative to the week-of view. Bookings outside the visible 9am-7pm
// window get clamped — span is truncated rather than dropped so the
// salon still sees them.
function placeOnGrid(booking, weekStart) {
  const t = new Date(booking.scheduled_at);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  if (t < weekStart || t >= weekEnd) return null;
  const day = (t.getDay() + 6) % 7;
  const hour = t.getHours() + t.getMinutes() / 60;
  if (hour >= HOUR_START + HOURS.length) return null;
  const start = Math.max(0, Math.floor(hour - HOUR_START));
  const span = Math.max(1, Math.min(HOURS.length - start, Math.ceil((booking.duration_min || 60) / 60)));
  return { day, start, span };
}

export default function SalonCalendar() {
  const isPhone = useNarrow();
  const toast = useToast();
  const { businesses, loading: bizLoading } = useMyBusinesses();
  const businessId = businesses[0]?.id;
  const { bookings, loading } = useSalonBookingsList(businessId);

  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const weekStart = useMemo(() => {
    const s = startOfWeek(new Date());
    s.setDate(s.getDate() + weekOffset * 7);
    return s;
  }, [weekOffset]);

  const visible = useMemo(() => {
    return bookings
      .map(b => ({ ...b, grid: placeOnGrid(b, weekStart) }))
      .filter(b => b.grid !== null);
  }, [bookings, weekStart]);

  const totalBookings = visible.length;
  const totalRevenue = visible.reduce((sum, b) => sum + (b.price_cents || 0), 0);
  const utilizationPct = Math.min(
    100,
    Math.round((visible.reduce((sum, b) => sum + (b.grid?.span || 1), 0) / (HOURS.length * 7)) * 100),
  );

  const sendMessage = () => {
    // Messaging isn't wired to real channels yet — keep the toast so
    // the UI still demonstrates the action. Replace with email/SMS
    // when Phase 7 (notifications) lands.
    if (!draft.trim()) { toast('Type a message first.', { tone: 'warn' }); return; }
    toast(`Message to ${selected.customer_name || 'customer'} — coming soon.`, { tone: 'info' });
    setMessageOpen(false);
    setDraft('');
  };

  const week = weekOffset === 0 ? 'This week' : weekOffset === 1 ? 'Next week' : weekOffset === -1 ? 'Last week' : `${weekOffset > 0 ? '+' : ''}${weekOffset} weeks`;

  // States: no business, loading, no Supabase, no bookings this week.
  const showEmpty = isSupabaseConfigured && !bizLoading && businessId && !loading && visible.length === 0;

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
            <div style={{ fontFamily: type.mono, fontSize: 26, fontWeight: 600, color: p.success, marginTop: 2 }}>{fmtPrice(totalRevenue)}</div>
          </div>
          <div style={{ padding: '14px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>UTILIZATION</div>
            <div style={{ fontFamily: type.mono, fontSize: 26, fontWeight: 600, color: p.accent, marginTop: 2 }}>{utilizationPct}%</div>
          </div>
        </div>

        {showEmpty && (
          <div style={{ marginTop: 22, padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
            No appointments this week. New bookings show up here automatically when a customer accepts your bid.
          </div>
        )}

        {/* Week grid */}
        {isPhone ? (
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {DAY_LABELS.map((d, di) => {
              const dayAppts = visible.filter(a => a.grid.day === di).sort((a, b) => a.grid.start - b.grid.start);
              if (dayAppts.length === 0) return null;
              return (
                <div key={di}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted, marginBottom: 8 }}>{d.toUpperCase()}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {dayAppts.map(a => (
                      <button key={a.booking_id} onClick={() => setSelected(a)} style={{ padding: '12px 14px', background: p.surface, borderRadius: 12, border: `0.5px solid ${a.status === 'cancelled' ? p.line : p.line}`, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink, opacity: a.status === 'cancelled' ? 0.55 : 1 }}>
                        <div style={{ fontFamily: type.mono, fontSize: 12, fontWeight: 600, color: p.ink, minWidth: 50 }}>{HOURS[a.grid.start]}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{a.customer_name || 'Customer'}</div>
                          <div style={{ fontSize: 11.5, color: p.inkMuted }}>{fmtServices(a.service_slugs)}</div>
                        </div>
                        <div style={{ fontFamily: type.mono, fontSize: 13, fontWeight: 600 }}>{fmtPrice(a.price_cents)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ marginTop: 22, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: `0.5px solid ${p.line}`, background: p.surface2 }}>
              <div />
              {DAY_LABELS.map(d => (
                <div key={d} style={{ padding: '14px 8px', fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textAlign: 'center' }}>{d.toUpperCase()}</div>
              ))}
            </div>
            {HOURS.map((h, hi) => (
              <div key={h} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderTop: hi ? `0.5px solid ${p.line}` : 'none', minHeight: 56 }}>
                <div style={{ padding: '6px 8px', fontFamily: type.mono, fontSize: 10, color: p.inkMuted, textAlign: 'right', borderRight: `0.5px solid ${p.line}` }}>{h}</div>
                {DAY_LABELS.map((_, di) => {
                  const a = visible.find(x => x.grid.day === di && x.grid.start === hi);
                  return (
                    <div key={di} style={{ borderRight: di < 6 ? `0.5px solid ${p.line}` : 'none', padding: 4, position: 'relative' }}>
                      {a && (
                        <button onClick={() => setSelected(a)} style={{
                          position: 'absolute', inset: 4,
                          height: `calc(${a.grid.span * 100}% + ${(a.grid.span - 1) * 0.5}px - 8px)`,
                          padding: '6px 8px', borderRadius: 8,
                          background: a.status === 'cancelled' ? p.surface2 : p.ink,
                          color: a.status === 'cancelled' ? p.inkMuted : p.bg,
                          border: a.status === 'cancelled' ? `0.5px solid ${p.line}` : 0,
                          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', overflow: 'hidden',
                          display: 'flex', flexDirection: 'column', gap: 2,
                          textDecoration: a.status === 'cancelled' ? 'line-through' : 'none',
                        }}>
                          <div style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.1 }}>{a.customer_name || 'Customer'}</div>
                          <div style={{ fontSize: 9.5, opacity: 0.7, lineHeight: 1.2 }}>{fmtServices(a.service_slugs)}</div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div style={{ marginTop: 16, padding: '16px 18px', background: p.ink, color: p.bg, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontFamily: type.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)' }}>
                {DAY_LABELS[selected.grid.day]} · {HOURS[selected.grid.start]} · {selected.status?.toUpperCase()}
              </div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, marginTop: 4 }}>
                {selected.customer_name || 'Customer'} · {fmtServices(selected.service_slugs)}
              </div>
              {(selected.customer_email || selected.customer_phone) && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                  {selected.customer_email}{selected.customer_phone ? ` · ${selected.customer_phone}` : ''}
                </div>
              )}
            </div>
            <div style={{ fontFamily: type.mono, fontSize: 24, fontWeight: 600 }}>{fmtPrice(selected.price_cents)}</div>
            <button onClick={() => { setDraft(`Hi ${(selected.customer_name || '').split(' ')[0] || ''} — `); setMessageOpen(true); }} style={{ background: 'rgba(255,255,255,0.1)', border: 0, padding: '10px 18px', borderRadius: 99, color: p.bg, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Message</button>
            <button onClick={() => setSelected(null)} style={{ background: p.accent, color: p.ink, border: 0, padding: '10px 18px', borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Close</button>
          </div>
        )}
      </div>

      <Modal open={messageOpen} onClose={() => { setMessageOpen(false); setDraft(''); }} eyebrow="MESSAGE CLIENT" title={selected?.customer_name || 'Customer'} footer={
        <>
          <button onClick={() => { setMessageOpen(false); setDraft(''); }} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={sendMessage} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Send</button>
        </>
      }>
        {selected && (
          <div>
            <div style={{ padding: '10px 12px', background: p.bg, borderRadius: 10, fontSize: 12, color: p.inkSoft, marginBottom: 12 }}>
              {DAY_LABELS[selected.grid.day]} · {HOURS[selected.grid.start]} · {fmtServices(selected.service_slugs)}
            </div>
            <textarea value={draft} onChange={e => setDraft(e.target.value)} autoFocus rows={5} placeholder="Confirmation, slot change, what to bring…" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        )}
      </Modal>
    </SalonLayout>
  );
}
