import { useState } from 'react';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';

const PAYOUTS = [
  { date: 'Mar 15', amount: 612.40, status: 'paid', method: 'Chase ••3829', count: 7 },
  { date: 'Mar 8', amount: 718.10, status: 'paid', method: 'Chase ••3829', count: 9 },
  { date: 'Mar 1', amount: 524.80, status: 'paid', method: 'Chase ••3829', count: 6 },
  { date: 'Feb 22', amount: 891.20, status: 'paid', method: 'Chase ••3829', count: 11 },
  { date: 'Feb 15', amount: 480.50, status: 'paid', method: 'Chase ••3829', count: 5 },
];

const WEEKLY = [410, 524, 718, 891, 480, 524, 718, 612];
const MAX_WEEKLY = Math.max(...WEEKLY);

export default function SalonEarnings() {
  const isPhone = useNarrow();
  const toast = useToast();
  const [showBank, setShowBank] = useState(false);
  const [showInstant, setShowInstant] = useState(false);

  const exportCSV = () => {
    const rows = [['Date', 'Amount', 'Bookings', 'Method', 'Status']];
    PAYOUTS.forEach(r => rows.push([r.date, r.amount.toFixed(2), String(r.count), r.method, r.status]));
    const csv = rows.map(r => r.map(c => /[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `glossi-payouts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast(`${PAYOUTS.length} payouts exported.`, { tone: 'success' });
  };

  const pendingPayout = 384.20;
  const lifetime = PAYOUTS.reduce((s, x) => s + x.amount, 0) + pendingPayout;
  const thisMonth = PAYOUTS.filter(p => p.date.startsWith('Mar')).reduce((s, x) => s + x.amount, 0) + pendingPayout;

  return (
    <SalonLayout active="earnings" mobileTitle="Earnings">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>EARNINGS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Your take.</h1>

        {/* Pending payout hero */}
        <div style={{ marginTop: 22, padding: isPhone ? '24px 22px' : '32px 36px', background: p.ink, color: p.bg, borderRadius: 20, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: isPhone ? 18 : 32, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>NEXT PAYOUT · MAR 22</div>
            <div style={{ fontFamily: type.mono, fontSize: isPhone ? 52 : 72, fontWeight: 600, color: p.bg, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 8 }}>${pendingPayout.toFixed(2)}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8, lineHeight: 1.5 }}>4 confirmed bookings since last payout. Stripe deposits Friday morning.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>BANK ON FILE</div>
              <div style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600, marginTop: 4 }}>Chase •••• 3829</div>
            </div>
            <button onClick={() => setShowBank(true)} style={{ background: p.accent, color: p.ink, border: 0, padding: '12px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Change account</button>
            <button onClick={() => setShowInstant(true)} style={{ background: 'transparent', color: p.bg, border: '0.5px solid rgba(255,255,255,0.2)', padding: '12px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Instant payout · 1% fee</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isPhone ? 8 : 12 }}>
          {[
            { k: 'This month', v: `$${thisMonth.toFixed(0)}`, c: p.accent, sub: '+18% vs Feb' },
            { k: 'Lifetime', v: `$${lifetime.toFixed(0)}`, c: p.ink, sub: `${PAYOUTS.length} payouts` },
            { k: 'Avg / booking', v: '$87', c: p.ink, sub: 'After Glossi 6%' },
            { k: 'Cancel rate', v: '2.1%', c: p.success, sub: 'Top 12% local' },
          ].map((s, i) => (
            <div key={i} style={{ padding: isPhone ? 14 : 18, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
              <div style={{ fontFamily: type.mono, fontSize: isPhone ? 22 : 28, fontWeight: 600, color: s.c, marginTop: 4, letterSpacing: '-0.025em' }}>{s.v}</div>
              <div style={{ fontSize: 11, color: p.inkSoft, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div style={{ marginTop: 22, padding: isPhone ? '20px 18px' : '26px 28px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>WEEKLY · LAST 8 WEEKS</div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, marginTop: 4 }}>Trending up.</div>
            </div>
            <div style={{ fontFamily: type.mono, fontSize: 12, color: p.success, fontWeight: 600 }}>+24% / 8wk</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
            {WEEKLY.map((v, i) => {
              const h = (v / MAX_WEEKLY) * 100;
              const isLatest = i === WEEKLY.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontFamily: type.mono, fontSize: 9.5, color: p.inkMuted }}>${v}</div>
                  <div style={{
                    width: '100%', height: `${h}%`, minHeight: 4,
                    background: isLatest ? p.accent : p.ink,
                    borderRadius: '6px 6px 0 0', opacity: isLatest ? 1 : 0.85,
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {WEEKLY.map((_, i) => (
              <div key={i} style={{ flex: 1, fontFamily: type.mono, fontSize: 9.5, color: p.inkMuted, textAlign: 'center' }}>
                W{i - WEEKLY.length + 1 === 0 ? 'now' : i - WEEKLY.length + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Payout history */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted }}>PAYOUT HISTORY</div>
            <button onClick={exportCSV} style={{ background: 'transparent', border: 0, color: p.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Export CSV →</button>
          </div>
          <div style={{ background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>
            {PAYOUTS.map((row, i) => (
              <div key={i} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, borderTop: i ? `0.5px solid ${p.line}` : 'none', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 120px' }}>
                  <div style={{ fontSize: 13, color: p.ink, fontWeight: 600 }}>{row.date}</div>
                  <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 1 }}>{row.count} bookings · {row.method}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.success }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: p.success }} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Paid</span>
                </div>
                <div style={{ fontFamily: type.mono, fontSize: 17, fontWeight: 600, color: p.ink }}>${row.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={showBank} onClose={() => setShowBank(false)} eyebrow="BANK ACCOUNT" title="Change payout destination" footer={
        <>
          <button onClick={() => setShowBank(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: p.ink }}>Cancel</button>
          <button onClick={() => { toast('Bank verification email sent.', { tone: 'success' }); setShowBank(false); }} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Connect with Plaid</button>
        </>
      }>
        <div style={{ fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55 }}>
          Glossi uses Plaid to securely link your business checking account. Routing and account numbers are never stored on our servers.
        </div>
        <div style={{ marginTop: 14, padding: '14px 16px', background: p.bg, borderRadius: 12, border: `0.5px solid ${p.line}` }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>CURRENT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <div style={{ width: 32, height: 22, background: '#117EB3', borderRadius: 4, color: '#fff', fontFamily: type.display, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>CHASE</div>
            <div style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600 }}>•••• 3829</div>
          </div>
        </div>
      </Modal>

      <Modal open={showInstant} onClose={() => setShowInstant(false)} eyebrow="INSTANT PAYOUT" title={`Send $${pendingPayout.toFixed(2)} now?`} footer={
        <>
          <button onClick={() => setShowInstant(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={() => { toast(`$${(pendingPayout * 0.99).toFixed(2)} on the way to Chase ••3829.`, { tone: 'success' }); setShowInstant(false); }} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Confirm · ${(pendingPayout * 0.99).toFixed(2)}</button>
        </>
      }>
        <div style={{ fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55 }}>
          Skip the wait — Glossi sends your pending balance to your bank in under 30 minutes for a 1% fee.
        </div>
        <div style={{ marginTop: 14, padding: '14px 16px', background: p.bg, borderRadius: 12, border: `0.5px solid ${p.line}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { k: 'Pending', v: `$${pendingPayout.toFixed(2)}` },
            { k: 'Instant fee · 1%', v: `−$${(pendingPayout * 0.01).toFixed(2)}`, c: p.accent },
            { k: 'You receive', v: `$${(pendingPayout * 0.99).toFixed(2)}`, big: true },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: r.big ? 13 : 12, color: r.big ? p.ink : p.inkSoft, fontWeight: r.big ? 700 : 500 }}>{r.k}</span>
              <span style={{ fontFamily: type.mono, fontSize: r.big ? 18 : 13, fontWeight: 600, color: r.c || p.ink }}>{r.v}</span>
            </div>
          ))}
        </div>
      </Modal>
    </SalonLayout>
  );
}
