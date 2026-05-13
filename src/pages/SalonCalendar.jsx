import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import { useMyBusinesses, useSalonBookingsList } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 15-min granularity matches what Booksy / Vagaro / Fresha / GlossGenius
// all default to. The old 1-hour grid silently dropped collisions because
// the cell lookup was a `find()` keyed on (day, hour). Absolute-positioned
// blocks on a 15-min grid render correctly regardless of overlap.
const HOUR_START = 9;
const HOUR_END = 19;            // 7 PM
const SLOTS_PER_HOUR = 4;        // every 15 min
const SLOT_HEIGHT_DESKTOP = 18;  // px per 15-min slot — total 11h × 72 = 792px
const SLOT_HEIGHT_PHONE = 14;
const SLOTS_TOTAL = (HOUR_END - HOUR_START) * SLOTS_PER_HOUR;

// Service-to-color map. Subtle palette, drawn from the brand bible:
// gold/copper/rose/plum/sage. The block body stays neutral; only a
// 3px left stripe is tinted. This is what makes Fresha/Vagaro look
// "professional" — instantly readable category by glance.
const SERVICE_COLORS = {
  haircut:        '#B8893E', // ochre — the brand accent
  hairstyle:      '#B8893E',
  color:          '#A85D2C', // copper
  nails:          '#D89A7E', // rose
  'lashes-brows': '#7B4F8B', // plum
  'hair-removal': '#8B6F47', // walnut
  facials:        '#6B8E7C', // sage
  massage:        '#6B8E7C',
  'med-spa':      '#6B8E7C',
  makeup:         '#3F3A3A', // ink-graphite
  tanning:        '#D4A86A', // brass
};
const colorForServices = slugs => {
  const first = (slugs || [])[0];
  return SERVICE_COLORS[first] || p.accent;
};

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dow);
  return d;
}
function dayHeaders(weekStart) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return DAY_LABELS.map((label, idx) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + idx);
    return {
      label,
      dateNum: d.getDate(),
      monthShort: d.toLocaleString('en-US', { month: 'short' }),
      isToday: d.getTime() === today.getTime(),
      isWeekend: idx >= 5,
      dateObj: d,
    };
  });
}
function fmtWeekRange(weekStart) {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const sameMonth = weekStart.getMonth() === end.getMonth();
  if (sameMonth) return `${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.getDate()}`;
  return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}
function fmtDay(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
const fmtServices = slugs => (slugs || []).map(s => s.replace('-', ' & ')).join(', ') || 'Appointment';
const fmtPrice = cents => `$${Math.round((cents || 0) / 100)}`;
const fmtTime = d => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(' ', '').toLowerCase();

const statusMeta = (palette, status) => {
  if (status === 'completed') return { color: palette.success, label: 'COMPLETED', dim: false };
  if (status === 'cancelled') return { color: '#C7402F',        label: 'CANCELLED', dim: true };
  if (status === 'no_show')   return { color: palette.inkMuted, label: 'NO-SHOW',   dim: true };
  return { color: '#D4A437', label: 'PENDING', dim: false };
};

// Project a booking onto a 15-min-resolution slot offset within the
// visible 9am–7pm window. Returns null if out of range.
function placeBooking(booking) {
  const t = new Date(booking.scheduled_at);
  const hour = t.getHours() + t.getMinutes() / 60;
  if (hour < HOUR_START || hour >= HOUR_END) return null;
  const slotsFromStart = Math.round((hour - HOUR_START) * SLOTS_PER_HOUR);
  const slotsSpan = Math.max(1, Math.round((booking.duration_min || 60) / 15));
  const dayIdx = (t.getDay() + 6) % 7;
  return { dayIdx, slotsFromStart, slotsSpan, dateObj: t };
}

// Now-line position (returns null if outside the 9am–7pm window or
// today isn't in the visible week / isn't the selected day).
function nowSlots() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  if (hour < HOUR_START || hour >= HOUR_END) return null;
  return (hour - HOUR_START) * SLOTS_PER_HOUR;
}

export default function SalonCalendar() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { businesses, loading: bizLoading } = useMyBusinesses();
  const businessId = businesses[0]?.id;
  const { bookings, loading } = useSalonBookingsList(businessId);

  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState('week'); // 'day' | 'week'
  const [dayIdx, setDayIdx] = useState(() => (new Date().getDay() + 6) % 7);
  const [peek, setPeek] = useState(null); // booking object being previewed
  const [tick, setTick] = useState(0);

  // Repaint the now-line every 60s so it slides down without a full reload.
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const weekStart = useMemo(() => {
    const s = startOfWeek(new Date());
    s.setDate(s.getDate() + weekOffset * 7);
    return s;
  }, [weekOffset]);

  const headers = useMemo(() => dayHeaders(weekStart), [weekStart]);
  const slotHeight = isPhone ? SLOT_HEIGHT_PHONE : SLOT_HEIGHT_DESKTOP;

  // Project bookings; bookings whose `scheduled_at` falls inside the
  // currently-visible week (any day, 9am–7pm) get a `place`.
  const visible = useMemo(() => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return bookings
      .filter(b => {
        const t = new Date(b.scheduled_at);
        return t >= weekStart && t < weekEnd;
      })
      .map(b => ({ ...b, place: placeBooking(b) }))
      .filter(b => b.place !== null);
  }, [bookings, weekStart]);

  const totalBookings = visible.length;
  const totalRevenue = visible.reduce((sum, b) => sum + (b.price_cents || 0), 0);
  const utilizationPct = Math.min(100, Math.round((visible.reduce((sum, b) => sum + (b.place?.slotsSpan || 4), 0) / (SLOTS_TOTAL * 7)) * 100));

  const week = weekOffset === 0 ? 'This week' : weekOffset === 1 ? 'Next week' : weekOffset === -1 ? 'Last week' : `${weekOffset > 0 ? '+' : ''}${weekOffset} weeks`;
  const weekRange = fmtWeekRange(weekStart);

  const showEmpty = isSupabaseConfigured && !bizLoading && businessId && !loading && visible.length === 0;

  const openBookingDetail = id => { setPeek(null); navigate(`/salon/booking/${id}`); };
  const onQuickAdd = () => toast('Walk-in booking — coming soon. Until then, accept an incoming bid to create a confirmed booking.', { tone: 'info' });

  const dayApps = dayIdx != null ? visible.filter(b => b.place.dayIdx === dayIdx).sort((a, b) => a.place.slotsFromStart - b.place.slotsFromStart) : [];
  const selectedDayHeader = headers[dayIdx];
  const showNowLine = (() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    if (t < weekStart || t >= weekEnd) return null;
    const todayIdx = (t.getDay() + 6) % 7;
    const slots = nowSlots();
    if (slots == null) return null;
    return { todayIdx, slots };
  })();

  void tick;

  return (
    <SalonLayout active="calendar" mobileTitle="Calendar">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        {/* Header — title + view toggle + nav + quick-add */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>CALENDAR · {weekRange.toUpperCase()}</div>
            <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>{week}.</h1>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {!isPhone && (
              <div style={{ display: 'flex', background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 99, padding: 2, marginRight: 4 }}>
                {['day', 'week'].map(m => (
                  <button key={m} onClick={() => setViewMode(m)} style={{
                    padding: '7px 14px', borderRadius: 99,
                    background: viewMode === m ? p.ink : 'transparent',
                    color: viewMode === m ? p.bg : p.ink,
                    border: 0, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                  }}>{m}</button>
                ))}
              </div>
            )}
            <button onClick={() => setWeekOffset(w => w - 1)} style={navBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => { setWeekOffset(0); setDayIdx((new Date().getDay() + 6) % 7); }} disabled={weekOffset === 0} style={{ padding: '9px 16px', borderRadius: 99, background: weekOffset === 0 ? p.surface2 : p.surface, border: `0.5px solid ${p.line}`, cursor: weekOffset === 0 ? 'default' : 'pointer', fontSize: 12.5, fontWeight: 600, color: p.ink, fontFamily: 'inherit' }}>Today</button>
            <button onClick={() => setWeekOffset(w => w + 1)} style={navBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={onQuickAdd} style={{ marginLeft: 4, padding: '9px 14px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>+ New</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <StatCard label="BOOKINGS" value={totalBookings} />
          <StatCard label="REVENUE" value={fmtPrice(totalRevenue)} color={p.success} />
          <StatCard label="UTILIZATION" value={`${utilizationPct}%`} color={p.accent} />
        </div>

        {showEmpty && (
          <div style={{ marginTop: 22, padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
            No appointments this week. New bookings show up here automatically when a customer accepts your bid.
          </div>
        )}

        {!showEmpty && visible.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'PENDING', color: '#D4A437' },
              { label: 'COMPLETED', color: p.success },
              { label: 'NO-SHOW', color: p.inkMuted },
              { label: 'CANCELLED', color: '#C7402F' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: p.inkMuted }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Mobile: per-day list (kept) */}
        {isPhone ? (
          <MobileDayList visible={visible} headers={headers} onPeek={setPeek} />
        ) : viewMode === 'day' ? (
          /* DAY VIEW */
          <DayView
            day={selectedDayHeader}
            dayIdx={dayIdx}
            setDayIdx={setDayIdx}
            headers={headers}
            appts={dayApps}
            slotHeight={slotHeight}
            showNow={showNowLine && showNowLine.todayIdx === dayIdx ? showNowLine.slots : null}
            onPeek={setPeek}
          />
        ) : (
          /* WEEK VIEW */
          <WeekView
            headers={headers}
            visible={visible}
            slotHeight={slotHeight}
            showNow={showNowLine}
            onPeek={setPeek}
          />
        )}
      </div>

      {/* Peek card — desktop popover, mobile bottom sheet */}
      {peek && (
        <PeekCard booking={peek} isPhone={isPhone} onOpen={() => openBookingDetail(peek.booking_id)} onClose={() => setPeek(null)} />
      )}
    </SalonLayout>
  );
}

const navBtn = { width: 38, height: 38, borderRadius: 99, background: p.surface, border: `0.5px solid ${p.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' };

function StatCard({ label, value, color = p.ink }) {
  return (
    <div style={{ padding: '14px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{label}</div>
      <div style={{ fontFamily: type.mono, fontSize: 26, fontWeight: 600, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function HourGutter({ slotHeight }) {
  return (
    <div style={{ width: 60, borderRight: `0.5px solid ${p.line}`, position: 'relative' }}>
      {Array.from({ length: HOUR_END - HOUR_START }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', top: i * SLOTS_PER_HOUR * slotHeight, right: 8, fontFamily: type.mono, fontSize: 10, color: p.inkMuted, transform: 'translateY(-50%)' }}>
          {((HOUR_START + i) % 12 || 12) + ' ' + (HOUR_START + i < 12 ? 'AM' : 'PM')}
        </div>
      ))}
      <div style={{ height: SLOTS_TOTAL * slotHeight }} />
    </div>
  );
}

function GridLines({ slotHeight }) {
  return (
    <>
      {Array.from({ length: HOUR_END - HOUR_START + 1 }).map((_, i) => (
        <div key={`h${i}`} style={{ position: 'absolute', top: i * SLOTS_PER_HOUR * slotHeight, left: 0, right: 0, borderTop: `0.5px solid ${p.line}` }} />
      ))}
      {/* Subtle 15-min minor gridlines */}
      {Array.from({ length: SLOTS_TOTAL }).map((_, i) => i % SLOTS_PER_HOUR !== 0 && (
        <div key={`m${i}`} style={{ position: 'absolute', top: i * slotHeight, left: 0, right: 0, borderTop: `0.5px dashed ${p.line}`, opacity: 0.4 }} />
      ))}
    </>
  );
}

function NowLine({ slots, slotHeight }) {
  return (
    <div style={{ position: 'absolute', top: slots * slotHeight, left: 0, right: 0, zIndex: 3, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: -5, top: -4, width: 8, height: 8, borderRadius: 99, background: p.accent }} />
      <div style={{ height: 1.5, background: p.accent, opacity: 0.85 }} />
    </div>
  );
}

function Block({ a, slotHeight, onPeek }) {
  const meta = statusMeta(p, a.status);
  const stripeColor = colorForServices(a.service_slugs);
  return (
    <button onClick={() => onPeek(a)} style={{
      position: 'absolute',
      top: a.place.slotsFromStart * slotHeight + 1,
      height: a.place.slotsSpan * slotHeight - 2,
      left: 2, right: 2,
      background: meta.dim ? p.surface2 : p.bg,
      border: `0.5px solid ${p.line}`,
      borderLeft: `3px solid ${stripeColor}`,
      borderRadius: 8,
      padding: '6px 8px',
      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', gap: 2,
      overflow: 'hidden',
      opacity: meta.dim ? 0.7 : 1,
      textDecoration: a.status === 'cancelled' ? 'line-through' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: p.ink, lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.customer_name || 'Customer'}</span>
        <span style={{ fontFamily: type.mono, fontSize: 10, fontWeight: 700, color: stripeColor, flexShrink: 0 }}>{fmtPrice(a.price_cents)}</span>
      </div>
      <div style={{ fontSize: 10, color: p.inkSoft, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fmtServices(a.service_slugs)}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
        <span style={{ width: 5, height: 5, borderRadius: 99, background: meta.color }} />
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: meta.color }}>{meta.label}</span>
      </div>
    </button>
  );
}

function WeekView({ headers, visible, slotHeight, showNow, onPeek }) {
  return (
    <div style={{ marginTop: 22, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
      {/* Day-name header */}
      <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: `0.5px solid ${p.line}`, background: p.surface2 }}>
        <div />
        {headers.map((h, i) => (
          <div key={i} style={{ padding: '12px 8px 10px', textAlign: 'center', borderLeft: i ? `0.5px solid ${p.line}` : 'none', background: h.isToday ? p.bg : 'transparent' }}>
            <div style={{ fontFamily: type.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: h.isWeekend ? p.inkMuted : p.inkSoft }}>{h.label.toUpperCase()}</div>
            <div style={{ marginTop: 4, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 600, color: h.isToday ? p.accent : p.ink, letterSpacing: '-0.02em' }}>{h.dateNum}</span>
              <span style={{ fontSize: 10, color: p.inkMuted, fontWeight: 500 }}>{h.monthShort}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Grid body */}
      <div style={{ display: 'flex' }}>
        <HourGutter slotHeight={slotHeight} />
        {DAY_LABELS.map((_, di) => {
          const dayAppts = visible.filter(b => b.place.dayIdx === di);
          return (
            <div key={di} style={{ flex: 1, borderRight: di < 6 ? `0.5px solid ${p.line}` : 'none', position: 'relative', minHeight: SLOTS_TOTAL * slotHeight }}>
              <GridLines slotHeight={slotHeight} />
              {showNow && showNow.todayIdx === di && <NowLine slots={showNow.slots} slotHeight={slotHeight} />}
              {dayAppts.map(a => <Block key={a.booking_id} a={a} slotHeight={slotHeight} onPeek={onPeek} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayView({ day, dayIdx, setDayIdx, headers, appts, slotHeight, showNow, onPeek }) {
  return (
    <div style={{ marginTop: 22, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
      {/* Day picker strip */}
      <div style={{ display: 'flex', borderBottom: `0.5px solid ${p.line}`, background: p.surface2 }}>
        {headers.map((h, i) => (
          <button key={i} onClick={() => setDayIdx(i)} style={{
            flex: 1, padding: '14px 8px', background: dayIdx === i ? p.bg : 'transparent', border: 0, borderRight: i < 6 ? `0.5px solid ${p.line}` : 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
            borderTop: dayIdx === i ? `2px solid ${p.accent}` : '2px solid transparent',
          }}>
            <div style={{ fontFamily: type.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: h.isWeekend ? p.inkMuted : p.inkSoft }}>{h.label.toUpperCase()}</div>
            <div style={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 600, color: h.isToday ? p.accent : (dayIdx === i ? p.ink : p.inkSoft), letterSpacing: '-0.02em' }}>{h.dateNum}</span>
              <span style={{ fontSize: 10, color: p.inkMuted, fontWeight: 500 }}>{h.monthShort}</span>
            </div>
          </button>
        ))}
      </div>
      {/* Day grid */}
      <div style={{ padding: '14px 18px 8px', borderBottom: `0.5px solid ${p.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, letterSpacing: '-0.02em' }}>{fmtDay(day.dateObj)}</div>
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted }}>{appts.length} {appts.length === 1 ? 'appt' : 'appts'}</div>
      </div>
      <div style={{ display: 'flex' }}>
        <HourGutter slotHeight={slotHeight} />
        <div style={{ flex: 1, position: 'relative', minHeight: SLOTS_TOTAL * slotHeight }}>
          <GridLines slotHeight={slotHeight} />
          {showNow != null && <NowLine slots={showNow} slotHeight={slotHeight} />}
          {appts.map(a => <Block key={a.booking_id} a={a} slotHeight={slotHeight * 2.2} onPeek={onPeek} />)}
        </div>
      </div>
    </div>
  );
}

function MobileDayList({ visible, headers, onPeek }) {
  return (
    <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {DAY_LABELS.map((d, di) => {
        const dayAppts = visible.filter(a => a.place.dayIdx === di).sort((a, b) => a.place.slotsFromStart - b.place.slotsFromStart);
        if (dayAppts.length === 0) return null;
        const h = headers[di];
        return (
          <div key={di}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: h.isToday ? p.accent : p.inkMuted }}>{d.toUpperCase()}</span>
              <span style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600, color: h.isToday ? p.accent : p.ink, letterSpacing: '-0.01em' }}>{h.dateNum}</span>
              <span style={{ fontSize: 10, color: p.inkMuted, fontWeight: 500 }}>{h.monthShort}</span>
              {h.isToday && <span style={{ fontSize: 9, color: p.accent, fontWeight: 700, letterSpacing: '0.14em' }}>· TODAY</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dayAppts.map(a => {
                const meta = statusMeta(p, a.status);
                const stripe = colorForServices(a.service_slugs);
                return (
                  <button key={a.booking_id} onClick={() => onPeek(a)} style={{
                    background: p.surface, borderRadius: 12,
                    border: `0.5px solid ${p.line}`,
                    borderLeft: `3px solid ${stripe}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink,
                    opacity: meta.dim ? 0.6 : 1,
                    textDecoration: a.status === 'cancelled' ? 'line-through' : 'none',
                  }}>
                    <div style={{ fontFamily: type.mono, fontSize: 12, fontWeight: 600, color: p.ink, minWidth: 56 }}>{fmtTime(new Date(a.scheduled_at))}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.customer_name || 'Customer'}</div>
                      <div style={{ fontSize: 11.5, color: p.inkMuted }}>{fmtServices(a.service_slugs)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <div style={{ fontFamily: type.mono, fontSize: 13, fontWeight: 600 }}>{fmtPrice(a.price_cents)}</div>
                      <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', color: meta.color }}>{meta.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PeekCard({ booking, isPhone, onOpen, onClose }) {
  const meta = statusMeta(p, booking.status);
  const stripe = colorForServices(booking.service_slugs);
  const t = new Date(booking.scheduled_at);
  const dur = booking.duration_min || 60;
  const endT = new Date(t.getTime() + dur * 60_000);
  const ref = useRef(null);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    const onClick = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('keydown', onKey);
    setTimeout(() => document.addEventListener('mousedown', onClick), 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: isPhone ? 'flex-end' : 'center', justifyContent: 'center',
      background: 'rgba(26,23,20,0.36)',
      padding: isPhone ? 0 : 20,
    }}>
      <div ref={ref} style={{
        background: p.bg, borderRadius: isPhone ? '20px 20px 0 0' : 18,
        border: `0.5px solid ${p.line}`,
        borderLeft: `4px solid ${stripe}`,
        width: '100%', maxWidth: 440,
        padding: '22px 22px 18px',
        boxShadow: '0 20px 60px rgba(26,23,20,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: stripe }}>{(booking.service_slugs?.[0] || 'BOOKING').replace('-', ' & ').toUpperCase()}</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: meta.color, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: meta.color }} />
            {meta.label}
          </span>
        </div>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.ink, lineHeight: 1.05, marginBottom: 4 }}>{booking.customer_name || 'Customer'}</div>
        <div style={{ fontFamily: type.mono, fontSize: 11, color: p.inkSoft, marginBottom: 16 }}>
          {fmtDay(t)} · {fmtTime(t)} – {fmtTime(endT)} · {dur} min
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
          <Cell label="SERVICE" value={fmtServices(booking.service_slugs)} />
          <Cell label="PRICE" value={fmtPrice(booking.price_cents)} valueColor={stripe} />
          {booking.customer_phone && <Cell label="PHONE" value={booking.customer_phone} />}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px 14px', borderRadius: 99, background: 'transparent', border: `0.5px solid ${p.line}`, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
          <button onClick={onOpen} style={{ flex: 2, padding: '12px 14px', borderRadius: 99, background: p.ink, color: p.bg, border: 0, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Open booking →</button>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value, valueColor }) {
  return (
    <div style={{ flex: '1 1 130px', minWidth: 100 }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: valueColor || p.ink }}>{value}</div>
    </div>
  );
}
