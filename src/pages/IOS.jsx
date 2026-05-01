import { useState } from 'react';
import { Link } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import IOSDevice from '../ios/IOSFrame.jsx';
import { TabBar } from '../ios/atoms.jsx';
import Home from '../ios/screens/Home.jsx';
import Compose from '../ios/screens/Compose.jsx';
import Bids from '../ios/screens/Bids.jsx';
import Booked from '../ios/screens/Booked.jsx';
import { Explore, Inbox as InboxScreen, Me } from '../ios/screens/Tabs.jsx';
import { BizInbox, BizBid, BizSent } from '../ios/screens/Biz.jsx';
import Guide from '../ios/screens/Guide.jsx';
import Offer from '../ios/screens/Offer.jsx';
import { Saved, History, Payment, Notifications } from '../ios/screens/MeSubs.jsx';
import Welcome from '../ios/screens/Welcome.jsx';
import SalonProfile from '../components/SalonProfile.jsx';
import Conversation from '../components/Conversation.jsx';
import Checkout from '../components/Checkout.jsx';
import Review from '../components/Review.jsx';
import { BIDS } from '../ios/data.js';
import { useToast } from '../components/Toast.jsx';
import { useNarrow } from '../hooks.js';
import { useAuth, useBookings, useLang } from '../store.jsx';

const SCREEN_TO_TAB = {
  home: 'home', compose: 'home', guide: 'home', profile: 'home',
  explore: 'explore', bids: 'quotes', checkout: 'quotes', booked: 'quotes',
  inbox: 'inbox', conversation: 'inbox',
  me: 'me', saved: 'me', history: 'me', payment: 'me', notifications: 'me', review: 'me',
};

export default function IOS() {
  const isPhone = useNarrow(560);
  const toast = useToast();

  const [side, setSide] = useState('customer');
  const { lang, setLang } = useLang();
  const { add: addBooking } = useBookings();
  const { user, signOut } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  // Customer flow state
  const [tab, setTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [picked, setPicked] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [guideIndex, setGuideIndex] = useState(0);
  const [offerSalon, setOfferSalon] = useState(null);
  const [profileBid, setProfileBid] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  // Salon flow state
  const [bizScreen, setBizScreen] = useState('inbox');
  const [bizRequest, setBizRequest] = useState(null);
  const [sentBid, setSentBid] = useState(null);

  const goTab = id => {
    setTab(id);
    if (id === 'home') setScreen('home');
    else if (id === 'quotes') setScreen('bids');
    else if (id === 'explore') setScreen('explore');
    else if (id === 'inbox') setScreen('inbox');
    else if (id === 'me') setScreen('me');
  };

  // ── Customer screens ────────────────────────────────────────────
  const onMeRow = k => {
    if (k === 'lang') setLang(lang === 'en' ? 'es' : 'en');
    else if (k === 'saved') setScreen('saved');
    else if (k === 'history') setScreen('history');
    else if (k === 'payment') setScreen('payment');
    else if (k === 'notifications') setScreen('notifications');
    else if (k === 'signout') { signOut(); toast(lang === 'en' ? 'Signed out.' : 'Cerrado sesión.'); }
    else if (k === 'help') {
      window.open('/help', '_blank', 'noopener');
      toast(lang === 'en' ? 'Opening help center…' : 'Abriendo ayuda…');
    }
    else toast(`${k} — coming soon.`);
  };

  const [profileFrom, setProfileFrom] = useState('home');
  const openProfile = bidOrSalon => {
    const fullBid = BIDS.find(b => b.id === (bidOrSalon.id || bidOrSalon)) || bidOrSalon;
    setProfileBid(fullBid);
    setProfileFrom(screen);
    setScreen('profile');
  };
  const openThread = id => { setThreadId(id); setScreen('conversation'); };

  const downloadICS = bid => {
    if (!bid) return;
    const slot = bid.slot_en || 'Today';
    const m = slot.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)/);
    let hour = 14, minute = 0;
    if (m) {
      hour = parseInt(m[1], 10);
      minute = m[2] ? parseInt(m[2], 10) : 0;
      if (/pm/i.test(m[3]) && hour < 12) hour += 12;
      if (/am/i.test(m[3]) && hour === 12) hour = 0;
    }
    const start = new Date();
    if (/tomorrow|mañana/i.test(slot)) start.setDate(start.getDate() + 1);
    else if (/sat/i.test(slot)) start.setDate(start.getDate() + ((6 - start.getDay() + 7) % 7 || 7));
    else if (/sun/i.test(slot)) start.setDate(start.getDate() + ((7 - start.getDay()) % 7 || 7));
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start.getTime() + 3 * 3600 * 1000);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Glossi//Booking//EN',
      'BEGIN:VEVENT',
      `UID:glossi-${bid.id}-${Date.now()}@glossi.app`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${bid.name} · Glossi booking`,
      `LOCATION:${bid.neighborhood}, TX`,
      `DESCRIPTION:Booking confirmed via Glossi. Stylist: ${bid.artist || 'TBD'}.`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `glossi-${bid.name.replace(/\s+/g, '-').toLowerCase()}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const openDirections = bid => {
    if (!bid) return;
    const q = encodeURIComponent(`${bid.name} ${bid.neighborhood} TX`);
    // Apple Maps on iOS, Google Maps elsewhere — use a universal URL that handles both.
    const url = `https://maps.apple.com/?q=${q}`;
    window.open(url, '_blank', 'noopener');
  };

  const renderCustomer = () => {
    if (showWelcome) return <Welcome p={p} type={type} lang={lang} onComplete={() => { setShowWelcome(false); toast(lang === 'en' ? 'Welcome to Glossi.' : 'Bienvenida a Glossi.', { tone: 'success' }); }} onSkip={() => setShowWelcome(false)} />;
    if (screen === 'compose') return <Compose p={p} type={type} lang={lang} onBack={() => { setScreen('home'); setTab('home'); }} onSubmit={() => { toast(lang === 'en' ? 'Request sent · waiting for bids.' : 'Solicitud enviada.', { tone: 'success' }); setScreen('bids'); setTab('quotes'); }} />;
    if (screen === 'checkout') return <Checkout p={p} type={type} lang={lang} surface="ios" bid={picked} onBack={() => setScreen('bids')} onConfirm={r => {
      addBooking({
        salonId: picked.id, salonName: picked.name, mood: picked.mood,
        service: lang === 'en' ? 'Color & balayage' : 'Color y balayage',
        slot: lang === 'en' ? picked.slot_en : picked.slot_es,
        subtotal: picked.price, tipAmt: r.tipAmt, tax: r.tax, tipPct: r.tipPct, total: r.total,
        paymentId: r.paymentId,
      });
      setReceipt(r);
      toast(lang === 'en' ? `Charged $${r.total.toFixed(2)} · booked.` : `Cobrado $${r.total.toFixed(2)} · reservado.`, { tone: 'success' });
      setScreen('booked');
    }} />;
    if (screen === 'booked') return <Booked p={p} type={type} lang={lang} bid={picked} receipt={receipt} onBack={() => { setScreen('home'); setTab('home'); }} onAddCal={() => { downloadICS(picked); toast(lang === 'en' ? 'Calendar event downloaded.' : 'Evento descargado.', { tone: 'success' }); }} onDirections={() => { openDirections(picked); toast(lang === 'en' ? 'Opening Maps…' : 'Abriendo Maps…'); }} />;
    if (screen === 'guide') return <Guide p={p} type={type} lang={lang} guideIndex={guideIndex} onBack={() => { setScreen('home'); setTab('home'); }} />;
    if (screen === 'saved') return <Saved p={p} type={type} lang={lang} onBack={() => setScreen('me')} />;
    if (screen === 'history') return <History p={p} type={type} lang={lang} onBack={() => setScreen('me')} onReview={b => { setReviewBooking(b); setScreen('review'); }} onRebook={b => { if (b.salonId) openProfile(b.salonId); }} />;
    if (screen === 'review') return <Review surface="ios" booking={reviewBooking} onBack={() => setScreen('history')} onSubmitted={() => setScreen('history')} />;
    if (screen === 'payment') return <Payment p={p} type={type} lang={lang} onBack={() => setScreen('me')} />;
    if (screen === 'notifications') return <Notifications p={p} type={type} lang={lang} onBack={() => setScreen('me')} />;
    if (screen === 'profile') return <SalonProfile p={p} type={type} lang={lang} surface="ios" bid={profileBid} onBack={() => setScreen(profileFrom)} onMessage={b => openThread(b.id)} onMakeOffer={b => setOfferSalon(b)} onBook={b => { setPicked(b); setScreen('checkout'); }} />;
    if (screen === 'conversation') return <Conversation p={p} type={type} lang={lang} surface="ios" threadId={threadId} onBack={() => setScreen('inbox')} onOpenProfile={id => openProfile(id)} />;
    if (screen === 'home') return <Home p={p} type={type} lang={lang} setLang={setLang} onPostRequest={() => setScreen('compose')} onOpenGuide={i => { setGuideIndex(i); setScreen('guide'); }} onOpenSalon={s => openProfile(s)} />;
    if (screen === 'bids') return <Bids p={p} type={type} lang={lang} onBack={() => { setScreen('home'); setTab('home'); }} onPick={b => { setPicked(b); setScreen('checkout'); }} onOffer={b => setOfferSalon(b)} onProfile={b => openProfile(b)} />;
    if (screen === 'explore') return <Explore p={p} type={type} lang={lang} onOpenSalon={s => openProfile(s)} />;
    if (screen === 'inbox') return <InboxScreen p={p} type={type} lang={lang} onOpenThread={openThread} />;
    if (screen === 'me') return <Me p={p} type={type} lang={lang} onRow={onMeRow} user={user} onSignIn={() => setShowWelcome(true)} />;
    return null;
  };

  const SUB_SCREENS = ['guide', 'saved', 'history', 'payment', 'notifications', 'profile', 'conversation', 'review'];

  const showTabBar = side === 'customer' && !SUB_SCREENS.includes(screen) && !showWelcome;
  const activeTab = SCREEN_TO_TAB[screen] || tab;

  // ── Salon screens ────────────────────────────────────────────
  const renderSalon = () => {
    if (bizScreen === 'sent') return <BizSent p={p} type={type} lang={lang} request={bizRequest} sentBid={sentBid} onBack={() => setBizScreen('inbox')} />;
    if (bizScreen === 'bid') return <BizBid p={p} type={type} lang={lang} request={bizRequest} onBack={() => setBizScreen('inbox')} onSend={bid => { setSentBid(bid); toast(lang === 'en' ? `Bid sent · $${bid.price}` : `Oferta · $${bid.price}`, { tone: 'success' }); setBizScreen('sent'); }} />;
    return <BizInbox p={p} type={type} lang={lang} onOpen={r => { setBizRequest(r); setBizScreen('bid'); }} />;
  };

  const phoneWidth = isPhone ? Math.min(390, window.innerWidth - 32) : 402;
  const phoneHeight = isPhone ? Math.min(844, window.innerHeight - 200) : 874;

  return (
    <div style={{ background: '#1a1714', minHeight: '100vh', color: '#fff', padding: isPhone ? '20px 16px 40px' : '40px 32px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isPhone ? 16 : 28 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(232, 183, 168, 0.85)', textDecoration: 'none', fontFamily: type.display, fontStyle: 'italic', fontSize: 18, fontWeight: type.displayWeight, letterSpacing: '-0.02em' }}><span style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.5)' }}>←</span>glossi web</Link>
        <div style={{ flex: 1 }} />
        {side === 'customer' && (
          <button onClick={() => setShowWelcome(s => !s)} style={{
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)',
            border: 0, padding: '6px 14px', borderRadius: 99, cursor: 'pointer',
            fontFamily: type.body, fontSize: 12, fontWeight: 600,
          }}>{showWelcome ? 'Hide welcome' : 'Show welcome'}</button>
        )}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.08)', borderRadius: 99, padding: 3, gap: 0 }}>
          {[
            { id: 'customer', l: 'Customer' },
            { id: 'salon', l: 'Salon' },
          ].map(s => (
            <button key={s.id} onClick={() => setSide(s.id)} style={{
              border: 0, background: side === s.id ? '#fff' : 'transparent',
              color: side === s.id ? '#1a1714' : 'rgba(255,255,255,0.7)',
              padding: '6px 14px', borderRadius: 99, cursor: 'pointer',
              fontFamily: type.body, fontSize: 12, fontWeight: 600,
            }}>{s.l}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', marginBottom: isPhone ? 20 : 32 }}>
        <div style={{ fontFamily: type.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.4)' }}>iOS PROTOTYPE</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0', color: '#fff', textWrap: 'balance' }}>
          {side === 'customer' ? (lang === 'en' ? 'Customer flow.' : 'Flujo cliente.') : (lang === 'en' ? 'Salon flow.' : 'Flujo salón.')}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: '12px auto 0', maxWidth: 480 }}>
          {side === 'customer'
            ? (lang === 'en' ? 'Tap "Post a request" on the home screen to walk through compose → live bids → booked.' : 'Toca "Publicar solicitud" en inicio para recorrer compose → ofertas → reservado.')
            : (lang === 'en' ? 'Tap a request to see the bid composer with Glossi insight, then send to view the live leaderboard.' : 'Toca una solicitud para ver el compositor de oferta y enviar para ver el ranking en vivo.')}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <IOSDevice width={phoneWidth} height={phoneHeight}>
          <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {side === 'customer' ? renderCustomer() : renderSalon()}
            </div>
            {showTabBar && <TabBar p={p} type={type} lang={lang} current={activeTab} onTab={goTab} />}
          </div>
          {side === 'customer' && offerSalon && (
            <Offer
              p={p} type={type} lang={lang} salon={offerSalon}
              onClose={() => setOfferSalon(null)}
              onSend={({ price }) => {
                toast(lang === 'en' ? `Offer sent to ${offerSalon.name} — $${price}.` : `Oferta enviada a ${offerSalon.name} — $${price}.`, { tone: 'success' });
                setOfferSalon(null);
              }}
            />
          )}
        </IOSDevice>
      </div>
    </div>
  );
}
