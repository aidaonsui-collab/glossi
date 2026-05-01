import { useEffect, useMemo, useState } from 'react';
import SalonLayout from '../components/SalonLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import { useMyBids } from '../lib/quotes.js';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

const TABS = [
  { id: 'all', l: 'All' },
  { id: 'pending', l: 'Pending' },
  { id: 'won', l: 'Won' },
  { id: 'lost', l: 'Lost' },
];

const STATUS_COLOR = (p, s) => ({
  won: p.success, pending: p.accent, lost: p.inkMuted,
})[s];

const fmtAgo = ts => {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const fmtSlot = ts => ts ? new Date(ts).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null;

// active → pending (still in bidding window)
// accepted → won (customer chose us)
// rejected → lost (customer chose someone else)
// withdrawn → lost (we backed out — kept under Lost so the salon can see the audit trail)
// expired → lost
const mapStatus = s => s === 'accepted' ? 'won' : s === 'active' ? 'pending' : 'lost';

// Derive a placeholder customer label until contact reveal lands.
// "Customer · #abc123" gives the salon a stable handle without
// leaking PII before the bid is accepted.
const customerLabel = bid => {
  if (bid.customer_full_name) return bid.customer_full_name;
  const tag = (bid.quote_requests?.id || bid.id || '').slice(0, 6);
  return `Customer · #${tag}`;
};

const initialsFromLabel = s => (s || 'C').split(/[\s·#]+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();

// Translate a Supabase quote_bids row into the shape the existing
// list/modal renderers expect. Keeps the visual layout intact while
// the underlying data source flips to real.
const toRow = bid => {
  const req = bid.quote_requests;
  const status = mapStatus(bid.status);
  const services = req?.service_slugs || [];
  const service = services.length
    ? services.map(s => s.replace('-', ' & ')).join(', ')
    : 'Service';
  const label = customerLabel(bid);
  return {
    id: bid.id,
    raw: bid,
    client: label,
    service,
    bid: Math.round((bid.price_cents || 0) / 100),
    status,
    sent: fmtAgo(bid.created_at),
    slot: fmtSlot(bid.earliest_slot),
    initials: initialsFromLabel(label),
    note: bid.message || req?.notes || '—',
    requestZip: req?.search_zip,
  };
};

export default function SalonBids() {
  const isPhone = useNarrow();
  const toast = useToast();
  const [tab, setTab] = useState('all');
  const { bids: rawBids, loading, refresh } = useMyBids();
  const [openBid, setOpenBid] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const [acting, setActing] = useState(false);
  // Cache resolved customer contact info per request_id so we don't
  // re-fetch every time the salon opens the same modal.
  const [contacts, setContacts] = useState({});

  // When the salon opens a modal, fetch the real customer contact via
  // request_customer_contact (RPC gates on the bid being active or
  // accepted, so it works for both pending and won bids in this view).
  useEffect(() => {
    if (!isSupabaseConfigured || !openBid?.raw) return;
    const requestId = openBid.raw.quote_requests?.id;
    if (!requestId || contacts[requestId] !== undefined) return;
    let cancelled = false;
    supabase.rpc('request_customer_contact', { p_request_id: requestId }).then(({ data }) => {
      if (cancelled) return;
      setContacts(curr => ({ ...curr, [requestId]: data?.[0] || null }));
    });
    return () => { cancelled = true; };
  }, [openBid, contacts]);

  const bids = useMemo(() => rawBids.map(toRow), [rawBids]);
  const list = bids.filter(b => tab === 'all' || b.status === tab);

  const counts = {
    all: bids.length,
    pending: bids.filter(b => b.status === 'pending').length,
    won: bids.filter(b => b.status === 'won').length,
    lost: bids.filter(b => b.status === 'lost').length,
  };
  const winRate = bids.length === 0 ? 0 : Math.round((counts.won / bids.length) * 100);
  const totalEarned = bids.filter(b => b.status === 'won').reduce((sum, b) => sum + b.bid, 0);

  const openModal = bid => {
    setOpenBid(bid);
    setEditDraft({ ...bid });
    setEditing(bid.status === 'pending');
    setConfirmWithdraw(false);
  };

  // Edit re-submits via submit_bid (which withdraws the old active bid
  // and inserts a new one — see migration 0010 header). Slot is a
  // free-text field on the local draft, so we ignore it here for now;
  // wire it to earliest_slot when we add a date picker.
  const saveEdit = async () => {
    if (!isSupabaseConfigured || !openBid?.raw) return;
    const priceCents = Math.round(Number(editDraft.bid) * 100);
    if (!Number.isFinite(priceCents) || priceCents < 0) {
      toast('Enter a valid price.', { tone: 'warn' });
      return;
    }
    setActing(true);
    const { error } = await supabase.rpc('submit_bid', {
      p_business_id: openBid.raw.business_id,
      p_request_id: openBid.raw.quote_requests?.id,
      p_price_cents: priceCents,
      p_estimated_duration: openBid.raw.estimated_duration,
      p_earliest_slot: openBid.raw.earliest_slot || null,
      p_message: editDraft.note || null,
      p_provider_id: null,
    });
    setActing(false);
    if (error) { toast(error.message, { tone: 'warn' }); return; }
    toast(`Bid updated · $${editDraft.bid}.`, { tone: 'success' });
    setOpenBid(null);
    refresh();
  };

  const withdraw = async () => {
    if (!isSupabaseConfigured || !openBid?.raw) return;
    setActing(true);
    const { error } = await supabase.rpc('withdraw_bid', { p_bid_id: openBid.raw.id });
    setActing(false);
    if (error) { toast(error.message, { tone: 'warn' }); return; }
    toast(`Bid withdrawn from ${openBid.client}.`);
    setOpenBid(null);
    refresh();
  };

  return (
    <SalonLayout active="bids" mobileTitle="My bids">
      <div style={{ padding: isPhone ? '20px 18px 24px' : '34px 40px 48px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>MY BIDS</div>
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
          {!isSupabaseConfigured ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5 }}>
              Supabase isn't configured — bids need a backend.
            </div>
          ) : loading ? (
            <div style={{ padding: 22, color: p.inkMuted, fontSize: 13.5 }}>Loading…</div>
          ) : list.length === 0 ? (
            <div style={{ padding: 22, background: p.surface, borderRadius: 14, border: `0.5px dashed ${p.line}`, color: p.inkSoft, fontSize: 13.5, lineHeight: 1.55 }}>
              {tab === 'all'
                ? "No bids yet. Open a request from your inbox and send one — speed wins."
                : `No ${tab} bids.`}
            </div>
          ) : null}
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

      {(() => null)()}
      {openBid && (() => {
        // Resolve customer name/email/phone from the contact cache.
        // request_customer_contact (post-migration 0501_002) reveals
        // on any active or accepted bid by the caller; rejected bids
        // get the masked label only.
        const requestId = openBid.raw?.quote_requests?.id;
        const contact = requestId ? contacts[requestId] : null;
        const showContact = openBid.status !== 'lost' && contact;
        const headerName = showContact && contact.full_name ? contact.full_name : openBid.client;
        const headerInitials = showContact && contact.full_name
          ? contact.full_name.split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
          : openBid.initials;
        return (
      <Modal
        open
        onClose={() => setOpenBid(null)}
        eyebrow={openBid.status === 'pending' ? (editing ? 'EDIT BID' : 'BID DETAIL') : openBid.status === 'won' ? 'WON · BOOKED' : 'BID DETAIL'}
        title={`${headerName} · ${openBid.service}`}
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
        {!confirmWithdraw && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Client header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 14, fontWeight: 700 }}>{headerInitials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: type.body, fontSize: 14, fontWeight: 600 }}>{headerName}</div>
                <div style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkMuted, marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: STATUS_COLOR(p, openBid.status) }} />
                  <span style={{ color: STATUS_COLOR(p, openBid.status), fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{openBid.status}</span>
                  <span>· sent {openBid.sent}</span>
                  {openBid.competing && <span>· {openBid.competing} competing</span>}
                </div>
                {showContact && (contact.email || contact.phone) && (
                  <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 4 }}>
                    {contact.email}{contact.phone ? ` · ${contact.phone}` : ''}
                  </div>
                )}
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
        {confirmWithdraw && (
          <div>
            <div style={{ fontSize: 14, color: p.ink, lineHeight: 1.5, fontWeight: 500 }}>
              Withdraw your bid for {headerName}?
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.5 }}>
              {headerName} won't see your offer anymore. You can re-bid if the request is still open.
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmWithdraw(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '10px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Keep bid</button>
              <button onClick={withdraw} style={{ background: p.accent, color: p.ink, border: 0, padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Withdraw</button>
            </div>
          </div>
        )}
      </Modal>
        );
      })()}
    </SalonLayout>
  );
}
