import { useMemo } from 'react';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import { useMyBusinessProfile, useSalonBookingsList } from '../lib/quotes.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const fmtMoney = cents => `$${Math.round((cents || 0) / 100).toLocaleString()}`;
const fmtMoneyDec = cents => `$${((cents || 0) / 100).toFixed(2)}`;

// Bucket bookings into the last 8 weeks. Index 7 = current week, 0 = 7 weeks ago.
function weeklyBuckets(bookings) {
  const buckets = Array(8).fill(0);
  const now = Date.now();
  // Anchor: start of "this week" (Mon 00:00) so week boundaries are stable.
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const start = monday.getTime() - 7 * WEEK_MS;
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    const t = new Date(b.scheduled_at || b.created_at).getTime();
    const idx = Math.floor((t - start) / WEEK_MS);
    if (idx >= 0 && idx < 8) buckets[idx] += (b.price_cents || 0);
  }
  return buckets;
}

export default function SalonEarnings() {
  const isPhone = useNarrow();
  const toast = useToast();
  const { business } = useMyBusinessProfile();
  const businessId = business?.id;
  const { bookings, loading } = useSalonBookingsList(businessId);
  const stripeReady = business?.stripe_charges_enabled && business?.stripe_payouts_enabled;
  const stripePending = business?.stripe_account_id && !stripeReady;

  const stats = useMemo(() => {
    const completed = bookings.filter(b => b.status !== 'cancelled');
    const lifetime = completed.reduce((s, b) => s + (b.price_cents || 0), 0);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const thisMonth = completed
      .filter(b => new Date(b.scheduled_at || b.created_at).getTime() >= monthStart)
      .reduce((s, b) => s + (b.price_cents || 0), 0);
    const avg = completed.length ? Math.round(lifetime / completed.length) : 0;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const cancelRate = bookings.length ? (cancelled / bookings.length) * 100 : 0;
    return { lifetime, thisMonth, avg, cancelRate, count: completed.length, totalRows: bookings.length };
  }, [bookings]);

  const weekly = useMemo(() => weeklyBuckets(bookings), [bookings]);
  const maxWeekly = Math.max(...weekly, 1);
  const eightWeekTotal = weekly.reduce((s, v) => s + v, 0);
  const eightWeekDelta = weekly[7] && weekly[0]
    ? Math.round(((weekly[7] - weekly[0]) / Math.max(weekly[0], 1)) * 100)
    : null;

  const exportCSV = () => {
    const rows = [['Date', 'Customer', 'Service', 'Amount', 'Status']];
    for (const b of bookings) {
      rows.push([
        new Date(b.scheduled_at || b.created_at).toISOString().slice(0, 10),
        b.customer_name || 'Customer',
        (b.service_slugs || []).join(';'),
        ((b.price_cents || 0) / 100).toFixed(2),
        b.status,
      ]);
    }
    const csv = rows.map(r => r.map(c => /[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `glossi-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast(`${bookings.length} bookings exported.`, { tone: 'success' });
  };

  return (
    <SalonLayout active="earnings" mobileTitle="Earnings">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>EARNINGS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Your take.</h1>

        {/* Lifetime hero — Stripe payouts arrive in Phase 6, until then we
            show real revenue so the salon owner has visibility on what
            they've actually booked. */}
        <div style={{ marginTop: 22, padding: isPhone ? '24px 22px' : '32px 36px', background: p.ink, color: p.bg, borderRadius: 20, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: isPhone ? 18 : 32, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>LIFETIME REVENUE</div>
            <div style={{ fontFamily: type.mono, fontSize: isPhone ? 52 : 72, fontWeight: 600, color: p.bg, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 8 }}>
              {fmtMoney(stats.lifetime)}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8, lineHeight: 1.5 }}>
              {stats.count} confirmed booking{stats.count === 1 ? '' : 's'} across {bookings.length} total.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>PAYOUTS</div>
              {stripeReady ? (
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)' }}>
                  Stripe verified. Funds settle to your bank 1–2 business days after each booking.
                  <span style={{ display: 'block', marginTop: 4, fontFamily: type.mono, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{business?.stripe_account_id?.slice(-8)}</span>
                </div>
              ) : stripePending ? (
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)' }}>
                  Onboarding incomplete — finish in Settings → Payouts. Customers can't accept your bids until Stripe verifies your details.
                </div>
              ) : (
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)' }}>
                  Connect your bank in Settings → Payouts to start receiving payouts. Until then, bookings show in your history but money can't move.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isPhone ? 8 : 12 }}>
          {[
            { k: 'This month', v: fmtMoney(stats.thisMonth), c: p.accent },
            { k: 'Lifetime', v: fmtMoney(stats.lifetime), c: p.ink },
            { k: 'Avg / booking', v: stats.count ? fmtMoney(stats.avg) : '—', c: p.ink },
            { k: 'Cancel rate', v: bookings.length ? `${stats.cancelRate.toFixed(1)}%` : '—', c: stats.cancelRate <= 5 ? p.success : p.accent },
          ].map((s, i) => (
            <div key={i} style={{ padding: isPhone ? 14 : 18, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
              <div style={{ fontFamily: type.mono, fontSize: isPhone ? 22 : 28, fontWeight: 600, color: s.c, marginTop: 4, letterSpacing: '-0.025em' }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div style={{ marginTop: 22, padding: isPhone ? '20px 18px' : '26px 28px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>WEEKLY · LAST 8 WEEKS</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, marginTop: 4 }}>
                {eightWeekTotal === 0 ? 'Just getting started.' : eightWeekDelta != null && eightWeekDelta > 0 ? 'Trending up.' : 'Steady.'}
              </div>
            </div>
            {eightWeekDelta != null && (
              <div style={{ fontFamily: type.mono, fontSize: 12, color: eightWeekDelta >= 0 ? p.success : p.accent, fontWeight: 600 }}>
                {eightWeekDelta >= 0 ? '+' : ''}{eightWeekDelta}% / 8wk
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
            {weekly.map((cents, i) => {
              const h = (cents / maxWeekly) * 100;
              const isLatest = i === weekly.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontFamily: type.mono, fontSize: 9.5, color: p.inkMuted }}>{cents > 0 ? `$${Math.round(cents / 100)}` : '—'}</div>
                  <div style={{
                    width: '100%', height: cents > 0 ? `${h}%` : '4px', minHeight: 4,
                    background: isLatest ? p.accent : p.ink,
                    borderRadius: '6px 6px 0 0',
                    opacity: cents > 0 ? (isLatest ? 1 : 0.85) : 0.15,
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {weekly.map((_, i) => (
              <div key={i} style={{ flex: 1, fontFamily: type.mono, fontSize: 9.5, color: p.inkMuted, textAlign: 'center' }}>
                {i === weekly.length - 1 ? 'now' : `−${weekly.length - 1 - i}w`}
              </div>
            ))}
          </div>
        </div>

        {/* Booking history (replaces fake payout history) */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>BOOKING HISTORY</div>
            {bookings.length > 0 && (
              <button onClick={exportCSV} style={{ background: 'transparent', border: 0, color: p.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Export CSV →</button>
            )}
          </div>
          <div style={{ background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
            {!isSupabaseConfigured ? (
              <div style={{ padding: 32, textAlign: 'center', color: p.inkSoft }}>Supabase isn't configured.</div>
            ) : loading ? (
              <div style={{ padding: 32, textAlign: 'center', color: p.inkMuted }}>Loading…</div>
            ) : bookings.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: p.inkSoft, lineHeight: 1.55 }}>
                No bookings yet. Send bids from your inbox — when a customer accepts, the booking lands here.
              </div>
            ) : bookings.slice().reverse().map((b, i) => (
              <div key={b.booking_id} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, borderTop: i ? `0.5px solid ${p.line}` : 'none', flexWrap: 'wrap', opacity: b.status === 'cancelled' ? 0.6 : 1 }}>
                <div style={{ flex: '1 1 160px' }}>
                  <div style={{ fontSize: 13, color: p.ink, fontWeight: 600 }}>
                    {new Date(b.scheduled_at || b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 1 }}>
                    {b.customer_name || 'Customer'} · {(b.service_slugs || []).map(s => s.replace('-', ' & ')).join(', ') || 'Appointment'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: b.status === 'cancelled' ? p.inkMuted : p.success }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: b.status === 'cancelled' ? p.inkMuted : p.success }} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{b.status}</span>
                </div>
                <div style={{ fontFamily: type.mono, fontSize: 17, fontWeight: 600, color: p.ink, textDecoration: b.status === 'cancelled' ? 'line-through' : 'none' }}>
                  {fmtMoneyDec(b.price_cents)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SalonLayout>
  );
}
