import { useState } from 'react';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';

const INITIAL_BIDS = [
  { id: 'mb1', client: 'Sofia M.', service: 'Color & balayage', bid: 95, status: 'won', sent: '2h ago', slot: 'Today, 4:00 PM', initials: 'SM', note: 'Caramel balayage, soft, low-maintenance. 3 hr block, includes wash + blow.' },
  { id: 'mb2', client: 'Daniela R.', service: 'Lash · Hybrid set', bid: 145, status: 'pending', sent: '14m ago', initials: 'DR', competing: 4, note: 'Hybrid set, natural look. Allergy to standard adhesive — using sensitive formula.', slot: 'This week' },
  { id: 'mb3', client: 'Maritza C.', service: 'Gel mani + pedi', bid: 52, status: 'pending', sent: '38m ago', initials: 'MC', competing: 6, note: 'Wedding guest. Soft nude or blush. Sat AM works best.', slot: 'Sat, 9:30 AM' },
  { id: 'mb4', client: 'Kevin O.', service: 'Barber + beard', bid: 38, status: 'lost', sent: '4h ago', initials: 'KO', note: 'Skin fade + beard line-up. Last cut went too short on top.', slot: 'Today after 5 PM' },
  { id: 'mb5', client: 'Ana V.', service: 'Cut & style', bid: 65, status: 'won', sent: '1d ago', slot: 'Tomorrow, 11:30 AM', initials: 'AV', note: 'Trim + face-frame layers. No bangs.' },
  { id: 'mb6', client: 'Camila P.', service: 'Color refresh', bid: 110, status: 'won', sent: '2d ago', slot: 'Sat, 2:00 PM', initials: 'CP', note: 'Root touch-up + gloss. Cool tones — no brassy.' },
  { id: 'mb7', client: 'Jasmin O.', service: 'Brazilian blowout', bid: 175, status: 'lost', sent: '3d ago', initials: 'JO', note: 'First-time, fine hair. Wants 3-month smoothness.', slot: 'Flexible' },
];

const TABS = [
  { id: 'all', l: 'All' },
  { id: 'pending', l: 'Pending' },
  { id: 'won', l: 'Won' },
  { id: 'lost', l: 'Lost' },
];

const STATUS_COLOR = (p, s) => ({
  won: p.success, pending: p.accent, lost: p.inkMuted,
})[s];

export default function SalonBids() {
  const isPhone = useNarrow();
  const toast = useToast();
  const [tab, setTab] = useState('all');
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [openBid, setOpenBid] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  const list = bids.filter(b => tab === 'all' || b.status === tab);

  const counts = {
    all: bids.length,
    pending: bids.filter(b => b.status === 'pending').length,
    won: bids.filter(b => b.status === 'won').length,
    lost: bids.filter(b => b.status === 'lost').length,
  };
  const winRate = Math.round((counts.won / bids.length) * 100);
  const totalEarned = bids.filter(b => b.status === 'won').reduce((sum, b) => sum + b.bid, 0);

  const openModal = bid => {
    setOpenBid(bid);
    setEditDraft({ ...bid });
    setEditing(bid.status === 'pending');
    setConfirmWithdraw(false);
  };

  const saveEdit = () => {
    setBids(curr => curr.map(b => b.id === openBid.id ? { ...b, ...editDraft } : b));
    toast(`Bid updated · $${editDraft.bid}.`, { tone: 'success' });
    setOpenBid(null);
  };

  const withdraw = () => {
    setBids(curr => curr.filter(b => b.id !== openBid.id));
    toast(`Bid withdrawn from ${openBid.client}.`);
    setOpenBid(null);
  };

  return (
    <SalonLayout active="bids" mobileTitle="My bids">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>CASA DE BELLEZA · MY BIDS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>The bid book.</h1>

        {/* Stats row */}
        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isPhone ? 8 : 12 }}>
          {[
            { k: 'Total bids', v: counts.all, c: p.ink },
            { k: 'Win rate', v: `${winRate}%`, c: p.success },
            { k: 'Earned (won)', v: `$${totalEarned}`, c: p.accent },
            { k: 'Pending', v: counts.pending, c: p.inkSoft },
          ].map((s, i) => (
            <div key={i} style={{ padding: isPhone ? 14 : 18, background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
              <div style={{ fontFamily: type.mono, fontSize: isPhone ? 26 : 32, fontWeight: 600, color: s.c, marginTop: 4, letterSpacing: '-0.025em' }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 22, display: 'flex', gap: 6, borderBottom: `0.5px solid ${p.line}` }}>
          {TABS.map(t => {
            const a = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: 'transparent', border: 0, padding: '12px 16px',
                borderBottom: `2px solid ${a ? p.ink : 'transparent'}`, marginBottom: -1,
                cursor: 'pointer', fontFamily: type.body, fontSize: 13.5,
                fontWeight: a ? 600 : 500, color: a ? p.ink : p.inkMuted,
              }}>{t.l} <span style={{ color: p.inkMuted, fontFamily: type.mono, fontSize: 11, marginLeft: 4 }}>{counts[t.id]}</span></button>
            );
          })}
        </div>

        {/* List */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((b, i) => (
            <div key={i} style={{ padding: '14px 18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, flexShrink: 0, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>{b.initials}</div>
              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: p.ink }}>{b.client}</div>
                <div style={{ fontSize: 12, color: p.inkMuted, marginTop: 1 }}>{b.service}</div>
              </div>
              <div style={{ minWidth: 100 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: p.inkMuted }}>BID</div>
                <div style={{ fontFamily: type.mono, fontSize: 17, fontWeight: 600, color: p.ink, marginTop: 1 }}>${b.bid}</div>
              </div>
              <div style={{ minWidth: 130 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: p.inkMuted }}>{b.status === 'won' ? 'BOOKED' : 'STATUS'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: STATUS_COLOR(p, b.status) }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLOR(p, b.status), textTransform: 'capitalize' }}>
                    {b.status === 'won' ? b.slot : b.status === 'pending' ? `${b.competing} competing` : 'Lost · ' + b.sent}
                  </span>
                </div>
              </div>
              <button onClick={() => openModal(b)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: p.ink, fontFamily: 'inherit' }}>
                {b.status === 'pending' ? 'Edit' : 'View'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={!!openBid}
        onClose={() => setOpenBid(null)}
        eyebrow={openBid?.status === 'pending' ? (editing ? 'EDIT BID' : 'BID DETAIL') : openBid?.status === 'won' ? 'WON · BOOKED' : 'BID DETAIL'}
        title={openBid ? `${openBid.client} · ${openBid.service}` : ''}
        width={520}
        footer={openBid?.status === 'pending' ? (
          editing ? (
            <>
              <button onClick={() => setConfirmWithdraw(true)} style={{ background: 'transparent', border: `0.5px solid ${p.accent}`, padding: '11px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.accent, cursor: 'pointer', fontFamily: 'inherit' }}>Withdraw</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setOpenBid(null)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={saveEdit} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Save · ${editDraft?.bid}</button>
            </>
          ) : (
            <>
              <button onClick={() => setOpenBid(null)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
              <button onClick={() => setEditing(true)} style={{ background: p.ink, color: p.bg, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Edit bid</button>
            </>
          )
        ) : (
          <button onClick={() => setOpenBid(null)} style={{ background: p.ink, color: p.bg, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
        )}
      >
        {openBid && !confirmWithdraw && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Client header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 14, fontWeight: 700 }}>{openBid.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: type.body, fontSize: 14, fontWeight: 600 }}>{openBid.client}</div>
                <div style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkMuted, marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: STATUS_COLOR(p, openBid.status) }} />
                  <span style={{ color: STATUS_COLOR(p, openBid.status), fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{openBid.status}</span>
                  <span>· sent {openBid.sent}</span>
                  {openBid.competing && <span>· {openBid.competing} competing</span>}
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 14px', background: p.bg, borderRadius: 12, border: `0.5px solid ${p.line}`, fontSize: 13, color: p.inkSoft, lineHeight: 1.5, fontStyle: 'italic' }}>
              "{openBid.note}"
            </div>

            {editing && openBid.status === 'pending' ? (
              <>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 8 }}>YOUR PRICE</div>
                  <div style={{ padding: '20px 18px', background: p.ink, color: p.bg, borderRadius: 14, textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'center' }}>
                      <span style={{ fontFamily: type.mono, fontSize: 18, opacity: 0.6 }}>$</span>
                      <span style={{ fontFamily: type.mono, fontSize: 48, fontWeight: 600, letterSpacing: '-0.03em' }}>{editDraft.bid}</span>
                    </div>
                    <input type="range" min={20} max={300} value={editDraft.bid} onChange={e => setEditDraft({ ...editDraft, bid: Number(e.target.value) })} style={{ width: '100%', accentColor: p.accent, marginTop: 12 }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 8 }}>SLOT</div>
                  <input value={editDraft.slot || ''} onChange={e => setEditDraft({ ...editDraft, slot: e.target.value })} placeholder="e.g. Today 4:00 PM" style={{ width: '100%', padding: '11px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 8 }}>NOTE TO CLIENT</div>
                  <textarea value={editDraft.note || ''} onChange={e => setEditDraft({ ...editDraft, note: e.target.value })} rows={3} style={{ width: '100%', padding: '11px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 13, color: p.ink, outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }} />
                </div>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { k: 'YOUR BID', v: `$${openBid.bid}`, mono: true, color: p.ink },
                  { k: openBid.status === 'won' ? 'BOOKED FOR' : 'PROPOSED SLOT', v: openBid.slot || '—' },
                  { k: 'SENT', v: openBid.sent },
                  { k: 'STATUS', v: openBid.status, capitalize: true, color: STATUS_COLOR(p, openBid.status) },
                ].map((row, i) => (
                  <div key={i} style={{ padding: '12px 14px', background: p.bg, borderRadius: 10, border: `0.5px solid ${p.line}` }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{row.k}</div>
                    <div style={{ fontFamily: row.mono ? type.mono : type.body, fontSize: 16, fontWeight: 600, color: row.color || p.ink, marginTop: 2, textTransform: row.capitalize ? 'capitalize' : 'none' }}>{row.v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {openBid && confirmWithdraw && (
          <div>
            <div style={{ fontSize: 14, color: p.ink, lineHeight: 1.5, fontWeight: 500 }}>
              Withdraw your bid for {openBid.client}?
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5 }}>
              {openBid.client} won't see your offer anymore. You can re-bid if the request is still open.
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmWithdraw(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '10px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Keep bid</button>
              <button onClick={withdraw} style={{ background: p.accent, color: p.ink, border: 0, padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Withdraw</button>
            </div>
          </div>
        )}
      </Modal>
    </SalonLayout>
  );
}
