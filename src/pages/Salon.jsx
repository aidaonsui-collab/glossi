import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import Modal from '../components/Modal.jsx';
import { useToast } from '../components/Toast.jsx';

const requestsSeed = [
  { id: 'r1', name: 'Sofia M.', initials: 'SM', service: 'Color & balayage', when: 'ASAP · Today/tomorrow', distance: '0.8 mi', posted: '2 min', note: 'Shoulder-length, dark brown. Want soft caramel balayage, low-maintenance.', bidsCount: 1, urgent: true, photos: 2, customerOffer: 85 },
  { id: 'r2', name: 'Daniela R.', initials: 'DR', service: 'Lash · Hybrid set', when: 'This week', distance: '1.4 mi', posted: '14 min', note: 'Hybrid set, natural look, first-time. Allergy to standard adhesive.', bidsCount: 4, urgent: false, photos: 3 },
  { id: 'r3', name: 'Maritza C.', initials: 'MC', service: 'Gel mani + pedi', when: 'Saturday', distance: '2.1 mi', posted: '38 min', note: 'Wedding guest Sunday. Soft nude or blush.', bidsCount: 6, urgent: false, photos: 1 },
  { id: 'r4', name: 'Kevin O.', initials: 'KO', service: 'Barber + beard', when: 'Today after 5pm', distance: '3.2 mi', posted: '1 hr', note: 'Skin fade, beard line-up.', bidsCount: 2, urgent: true, photos: 2 },
];

const FILTERS = ['All', 'ASAP', 'This week'];
const SLOTS = ['Today 3p', 'Tomorrow 11a', 'Sat 10a'];

const SIDEBAR = [
  { l: 'Inbox', badge: 4, to: '/salon' },
  { l: 'My bids', to: '/salon/bids' },
  { l: 'Calendar', to: '/salon/calendar' },
  { l: 'Clients', to: '/salon/clients' },
  { l: 'Earnings', to: '/salon/earnings' },
  { l: 'Settings', to: '/pricing' },
];

export default function Salon() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();

  const [filter, setFilter] = useState('All');
  const [requests, setRequests] = useState(requestsSeed);
  const [activeReqId, setActiveReqId] = useState('r1');
  const [bidPrice, setBidPrice] = useState(110);
  const [slot, setSlot] = useState('Today 3p');
  const [note, setNote] = useState("Hi Sofia — caramel balayage is my specialty. Soft, low-maintenance, in 3 hrs.");
  const [respondTo, setRespondTo] = useState(null);
  const [counterPrice, setCounterPrice] = useState(0);

  const visibleRequests = useMemo(() => {
    if (filter === 'ASAP') return requests.filter(r => r.urgent);
    if (filter === 'This week') return requests.filter(r => /week|saturday/i.test(r.when));
    return requests;
  }, [requests, filter]);

  const activeReq = requests.find(r => r.id === activeReqId) || requests[0];

  const sendBid = () => {
    toast(`Bid sent to ${activeReq.name} — $${bidPrice} · ${slot}.`, { tone: 'success' });
    setRequests(curr => curr.map(r => r.id === activeReq.id ? { ...r, bidsCount: r.bidsCount + 1 } : r));
  };

  const openRequest = r => {
    if (r.customerOffer) {
      setRespondTo(r);
      setCounterPrice(Math.round((r.customerOffer + 110) / 2));
    } else {
      setActiveReqId(r.id);
      if (isPhone) toast(`Opened ${r.name}'s request.`);
    }
  };

  const acceptOffer = () => {
    toast(`Accepted ${respondTo.name}'s $${respondTo.customerOffer} offer.`, { tone: 'success' });
    setRequests(curr => curr.filter(r => r.id !== respondTo.id));
    setRespondTo(null);
  };
  const declineOffer = () => {
    toast(`Declined ${respondTo.name}'s offer.`);
    setRequests(curr => curr.map(r => r.id === respondTo.id ? { ...r, customerOffer: undefined } : r));
    setRespondTo(null);
  };
  const counterOffer = () => {
    toast(`Counter sent to ${respondTo.name} — $${counterPrice}.`, { tone: 'success' });
    setRequests(curr => curr.map(r => r.id === respondTo.id ? { ...r, customerOffer: undefined, bidsCount: r.bidsCount + 1 } : r));
    setRespondTo(null);
  };

  const sidebar = (
    <div style={{
      width: 240, padding: '24px 18px', borderRight: `0.5px solid ${p.line}`, background: p.surface,
      display: 'flex', flexDirection: 'column', gap: 6, minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', padding: '4px 12px 4px', color: p.accent, textDecoration: 'none' }}>glossi</Link>
      <div style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.18em', padding: '0 12px 14px' }}>FOR SALONS</div>
      {SIDEBAR.map((it) => {
        const active = it.l === 'Inbox';
        return (
          <Link key={it.l} to={it.to} style={{
            padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
            background: active ? p.bg : 'transparent', color: p.ink, fontSize: 13.5, fontWeight: active ? 600 : 500,
            border: active ? `0.5px solid ${p.line}` : '0.5px solid transparent', textDecoration: 'none', fontFamily: 'inherit',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: active ? p.accent : p.inkMuted }} />
            <span style={{ flex: 1 }}>{it.l}</span>
            {it.badge && <span style={{ fontFamily: type.mono, fontSize: 10, color: p.bg, background: p.accent, padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{it.badge}</span>}
          </Link>
        );
      })}
      <div style={{ flex: 1 }} />
      <button onClick={() => navigate('/salon/settings')} style={{ padding: '14px 12px', borderRadius: 12, background: p.bg, border: `0.5px solid ${p.line}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 99, background: 'linear-gradient(135deg,#C28A6B,#8B4F3A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>MR</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Casa de Belleza</div>
            <div style={{ fontSize: 10.5, color: p.inkMuted }}>Pharr · 4.9★</div>
          </div>
        </div>
      </button>
    </div>
  );

  const stats = (
    <div style={{ display: 'grid', gridTemplateColumns: isPhone ? 'repeat(2,1fr)' : 'repeat(4, 1fr)', gap: isPhone ? 8 : 12 }}>
      {[
        { k: 'Open requests', v: String(requests.length), c: p.accent, sub: `${requests.filter(r => r.urgent).length} ASAP`, to: '/salon' },
        { k: 'Won today', v: '3', c: p.success, sub: '$284 total', to: '/salon/bids' },
        { k: 'Win rate', v: '34%', c: p.ink, sub: '+4% vs last wk', to: '/salon/bids' },
        { k: 'Avg. response', v: '9 min', c: p.ink, sub: 'Top 12% local', to: '/salon/earnings' },
      ].map((s, i) => (
        <button key={i} onClick={() => navigate(s.to)} style={{ padding: isPhone ? '14px' : '18px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>{s.k.toUpperCase()}</div>
          <div style={{ fontFamily: type.mono, fontSize: isPhone ? 28 : 36, fontWeight: 600, color: s.c, letterSpacing: '-0.025em', marginTop: 4, lineHeight: 1 }}>{s.v}</div>
          <div style={{ fontSize: 11, color: p.inkSoft, marginTop: 6 }}>{s.sub}</div>
        </button>
      ))}
    </div>
  );

  const composer = (
    <div style={{ background: p.surface, borderRadius: 18, border: `0.5px solid ${p.line}`, padding: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>RESPOND TO {activeReq?.name?.toUpperCase()}</div>
      <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 24, fontWeight: type.displayWeight, marginTop: 6, letterSpacing: '-0.02em' }}>{activeReq?.service}</div>
      <div style={{ marginTop: 16, padding: '18px', background: p.ink, color: p.bg, borderRadius: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>YOUR BID</div>
        <div style={{ fontFamily: type.mono, fontSize: 48, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6 }}>${bidPrice}</div>
        <input type="range" min={70} max={180} step={1} value={bidPrice} onChange={e => setBidPrice(Number(e.target.value))} style={{ width: '100%', marginTop: 10, accentColor: p.accent }} />
        <div style={{ fontSize: 10.5, color: p.accent, fontWeight: 700, marginTop: 4, letterSpacing: '0.1em' }}>{bidPrice < 117 ? `BEATS LOWEST BY $${117 - bidPrice}` : 'ABOVE CURRENT LOWEST'}</div>
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>NEXT SLOT</div>
        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {SLOTS.map(s => (
            <button key={s} onClick={() => setSlot(s)} style={{ padding: '9px 8px', borderRadius: 10, background: s === slot ? p.ink : p.bg, color: s === slot ? p.bg : p.ink, border: `0.5px solid ${s === slot ? p.ink : p.line}`, fontSize: 11.5, fontWeight: 600, textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>NOTE TO CLIENT</div>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} style={{ marginTop: 8, padding: '10px 12px', borderRadius: 10, background: p.bg, border: `0.5px solid ${p.line}`, fontSize: 12.5, color: p.inkSoft, fontStyle: 'italic', lineHeight: 1.5, width: '100%', resize: 'vertical', fontFamily: type.body, outline: 'none' }} />
      </div>
      <button onClick={sendBid} style={{ marginTop: 16, width: '100%', padding: '14px', borderRadius: 12, border: 0, background: p.accent, color: p.ink, cursor: 'pointer', fontFamily: type.display, fontStyle: 'italic', fontSize: 16, fontWeight: type.displayWeight }}>Send bid →</button>
    </div>
  );

  const main = (
    <div style={{ flex: 1, padding: isPhone ? '18px' : '34px 40px', display: 'flex', flexDirection: 'column', gap: isPhone ? 18 : 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>CASA DE BELLEZA · PHARR</div>
          <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 34 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 0.95, margin: '6px 0 0' }}>Today's requests.</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: type.body, fontSize: 11, fontWeight: 700, color: p.success, letterSpacing: '0.14em' }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: p.success, animation: 'glossiPulse 1.6s infinite' }} />
          <span>LIVE</span>
        </div>
      </div>

      {stats}

      <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1.4fr 1fr', gap: isPhone ? 16 : 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{visibleRequests.length} {filter === 'All' ? 'NEW' : filter.toUpperCase()} · WITHIN 5 MI</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {FILTERS.map(s => {
                const active = s === filter;
                return (
                  <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: active ? p.ink : p.surface, color: active ? p.bg : p.ink, border: `0.5px solid ${active ? p.ink : p.line}`, cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibleRequests.length === 0 && (
              <div style={{ padding: '24px', borderRadius: 14, background: p.surface, border: `0.5px solid ${p.line}`, textAlign: 'center', color: p.inkMuted, fontSize: 13 }}>
                Nothing matches that filter right now.
              </div>
            )}
            {visibleRequests.map((r) => {
              const active = r.id === activeReqId && !isPhone;
              return (
                <button key={r.id} onClick={() => openRequest(r)} style={{
                  padding: '14px 16px', background: p.surface, borderRadius: 14,
                  border: `0.5px solid ${active ? p.accent : p.line}`,
                  boxShadow: active ? `inset 0 0 0 1px ${p.accent}55` : 'none',
                  position: 'relative', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: p.ink,
                  width: '100%',
                }}>
                  {r.urgent && (
                    <div style={{ position: 'absolute', top: 0, right: 14, background: p.accent, color: p.bg, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', padding: '4px 8px', borderRadius: '0 0 6px 6px' }}>ASAP</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 99, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 12, fontWeight: 700 }}>{r.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: p.inkMuted, marginTop: 1 }}>{r.distance} · {r.posted} · {r.photos} photos</div>
                    </div>
                    <div style={{ fontFamily: type.mono, fontSize: 10, color: p.inkSoft, background: p.surface2, padding: '4px 8px', borderRadius: 99, fontWeight: 600 }}>{r.bidsCount} bids</div>
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${p.line}` }}>
                    <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 16, fontWeight: type.displayWeight, letterSpacing: '-0.01em' }}>{r.service}</div>
                    <div style={{ fontSize: 11.5, color: p.inkSoft, marginTop: 3 }}>{r.when}</div>
                    <div style={{ marginTop: 7, fontSize: 12.5, color: p.inkSoft, lineHeight: 1.45 }}>"{r.note}"</div>
                  </div>
                  {r.customerOffer && (
                    <div style={{ marginTop: 10, padding: '9px 12px', background: p.accent + '1f', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, border: `0.5px solid ${p.accent}55` }}>
                      <span style={{ width: 7, height: 7, borderRadius: 99, background: p.accent }} />
                      <span style={{ fontSize: 11.5, fontWeight: 600 }}>Customer offered ${r.customerOffer}</span>
                      <span style={{ flex: 1 }} />
                      <span style={{ fontSize: 10.5, color: p.accent, fontWeight: 700, letterSpacing: '0.08em' }}>RESPOND →</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {!isPhone && composer}
      </div>
    </div>
  );

  const respondModal = (
    <Modal open={!!respondTo} onClose={() => setRespondTo(null)} eyebrow="CUSTOMER OFFER" title={`${respondTo?.name} · ${respondTo?.service}`} width={520} footer={
      <>
        <button onClick={declineOffer} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>Decline</button>
        <button onClick={counterOffer} style={{ background: p.surface2, border: `0.5px solid ${p.line}`, cursor: 'pointer', padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: p.ink }}>Counter ${counterPrice}</button>
        <button onClick={acceptOffer} style={{ background: p.accent, color: p.ink, border: 0, cursor: 'pointer', padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Accept ${respondTo?.customerOffer}</button>
      </>
    }>
      {respondTo && (
        <>
          <div style={{ padding: '8px 0', fontSize: 13, color: p.inkSoft, lineHeight: 1.55 }}>"{respondTo.note}"</div>
          <div style={{ marginTop: 14, padding: '12px 14px', background: p.bg, borderRadius: 12, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>THEIR OFFER</span>
            <span style={{ fontFamily: type.mono, fontSize: 28, fontWeight: 600, color: p.accent }}>${respondTo.customerOffer}</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted }}>YOUR COUNTER</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'center', padding: '14px 0' }}>
              <span style={{ fontFamily: type.mono, fontSize: 14, color: p.inkMuted }}>$</span>
              <span style={{ fontFamily: type.mono, fontSize: 48, fontWeight: 600, color: p.ink, letterSpacing: '-0.03em' }}>{counterPrice}</span>
            </div>
            <input type="range" min={respondTo.customerOffer} max={140} step={1} value={counterPrice} onChange={e => setCounterPrice(Number(e.target.value))} style={{ width: '100%', accentColor: p.accent }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: type.mono, fontSize: 11, color: p.inkMuted, marginTop: 4 }}>
              <span>their ${respondTo.customerOffer}</span>
              <span>your typical $140</span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );

  if (isPhone) {
    return (
      <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `0.5px solid ${p.line}` }}>
          <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
          <div style={{ fontSize: 10, color: p.accent, fontWeight: 700, letterSpacing: '0.18em' }}>FOR SALONS</div>
          <div style={{ flex: 1 }} />
          <button onClick={() => navigate('/salon/settings')} style={{ width: 34, height: 34, borderRadius: 99, background: 'linear-gradient(135deg,#C28A6B,#8B4F3A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>MR</button>
        </div>
        {main}
        {respondModal}
      </div>
    );
  }

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, display: 'flex', alignItems: 'flex-start' }}>
      {sidebar}
      {main}
      {respondModal}
    </div>
  );
}
