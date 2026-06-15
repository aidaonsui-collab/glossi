import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Marketing from './pages/Marketing.jsx';
import { useAuth } from './store.jsx';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';

// React Router preserves window scroll position across navigations, so
// jumping from a scrolled-down page (e.g. a service tile far down the
// marketing page) to /request or /signup would land mid-page. Reset to
// the top on every pathname change. One component covers every route.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// OAuth (Google/Apple/Facebook) sign-in lands here. The provider's
// redirect URL has to be fixed at click time — before we know the
// account type — so the social buttons all point here. This route
// resolves the authoritative type from profiles.is_business (the same
// source of truth as email sign-in) and forwards to the right home.
// Falls back to "/" if no session lands (e.g. an OAuth error).
function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSupabaseConfigured) { navigate('/', { replace: true }); return; }
    let done = false;
    const route = async session => {
      if (done) return;
      done = true;
      if (!session?.user) { navigate('/', { replace: true }); return; }
      const { data: profile } = await supabase
        .from('profiles').select('is_business')
        .eq('id', session.user.id).maybeSingle();
      const isSalon = profile?.is_business || session.user.user_metadata?.role === 'salon';
      navigate(isSalon ? '/salon/inbox' : '/quotes', { replace: true });
    };
    // The session may already be parsed from the callback URL hash, or
    // it may land a beat later via the auth event — handle both.
    supabase.auth.getSession().then(({ data }) => { if (data.session) route(data.session); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { if (session) route(session); });
    const fallback = setTimeout(() => { if (!done) { done = true; navigate('/', { replace: true }); } }, 8000);
    return () => { sub.subscription.unsubscribe(); clearTimeout(fallback); };
  }, [navigate]);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif', color: '#5C5651', fontSize: 14 }}>
      Signing you in…
    </div>
  );
}

// At "/", the marketing landing page is for visitors. A logged-in
// salon hitting "/" — by clicking the logo, deep-linking, or via a
// stale bookmark — would otherwise see the customer-flavored
// "Post a request" landing, which is confusing. Bounce them to
// the salon inbox instead. Customers stay on the marketing page
// (it doubles as their "find a salon" entry point pre-quote).
function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return null; // brief blank while auth hydrates — way less than first paint
  if (user?.type === 'salon') return <Navigate to="/salon/inbox" replace />;
  return <Marketing />;
}
import Customer from './pages/Customer.jsx';
import CustomerEmpty from './pages/CustomerEmpty.jsx';
import CustomerLoading from './pages/CustomerLoading.jsx';
// Salon was the marketing-style stub-with-fake-data dashboard. Real
// salon dashboards live under /salon/inbox /salon/bids etc., so we
// redirect /salon there instead of rendering the stub.
import SalonEmpty from './pages/SalonEmpty.jsx';
import OnboardingCustomer from './pages/OnboardingCustomer.jsx';
import OnboardingSalon from './pages/OnboardingSalon.jsx';
import IOS from './pages/IOS.jsx';
import MarketingA from './pages/MarketingA.jsx';
import MarketingC from './pages/MarketingC.jsx';
import SalonDetail from './pages/SalonDetail.jsx';
import InboxList from './pages/InboxList.jsx';
import ConversationPage from './pages/ConversationPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import Explore from './pages/Explore.jsx';
import Saved from './pages/Saved.jsx';
import Editorial from './pages/Editorial.jsx';
import Article from './pages/Article.jsx';
import SalonBids from './pages/SalonBids.jsx';
import SalonCalendar from './pages/SalonCalendar.jsx';
import SalonBookingDetail from './pages/SalonBookingDetail.jsx';
import SalonClients from './pages/SalonClients.jsx';
import SalonReviews from './pages/SalonReviews.jsx';
import SalonEarnings from './pages/SalonEarnings.jsx';
import Bookings from './pages/Bookings.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import CustomerSettings from './pages/CustomerSettings.jsx';
import SalonSettings from './pages/SalonSettings.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import Me from './pages/Me.jsx';
import SignUp from './pages/SignUp.jsx';
import { Terms, Privacy, Help, Cities } from './pages/Static.jsx';
import RequestQuote from './pages/RequestQuote.jsx';
import QuoteDetail from './pages/QuoteDetail.jsx';
import SalonInbox from './pages/SalonInbox.jsx';
import SalonInboxDetail from './pages/SalonInboxDetail.jsx';
import Pros from './pages/Pros.jsx';
import AdminOutreach from './pages/AdminOutreach.jsx';
import RepOnboard from './pages/RepOnboard.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/quotes" element={<Customer />} />
        <Route path="/quotes/empty" element={<CustomerEmpty />} />
        <Route path="/quotes/waiting" element={<CustomerLoading />} />
        <Route path="/salon" element={<Navigate to="/salon/inbox" replace />} />
        <Route path="/salon/empty" element={<SalonEmpty />} />
        <Route path="/onboarding/customer" element={<OnboardingCustomer />} />
        <Route path="/onboarding/salon" element={<OnboardingSalon />} />
        <Route path="/ios" element={<IOS />} />
        <Route path="/marketing/a" element={<MarketingA />} />
        <Route path="/marketing/c" element={<MarketingC />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
        <Route path="/inbox" element={<InboxList />} />
        <Route path="/inbox/:id" element={<ConversationPage /> } />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/pay/:bidId" element={<PaymentPage />} />
        {/* Browse surface hidden pre-launch (mock catalog) — quote-first only. */}
        <Route path="/explore" element={<Navigate to="/quotes" replace />} />
        <Route path="/saved" element={<Navigate to="/quotes" replace />} />
        <Route path="/editorial" element={<Editorial />} />
        <Route path="/editorial/:id" element={<Article />} />
        <Route path="/salon/bids" element={<SalonBids />} />
        <Route path="/salon/calendar" element={<SalonCalendar />} />
        <Route path="/salon/booking/:id" element={<SalonBookingDetail />} />
        <Route path="/salon/clients" element={<SalonClients />} />
        <Route path="/salon/reviews" element={<SalonReviews />} />
        <Route path="/salon/earnings" element={<SalonEarnings />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/review/:id" element={<ReviewPage />} />
        <Route path="/settings" element={<CustomerSettings />} />
        <Route path="/salon/settings" element={<SalonSettings />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/me" element={<Me />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/help" element={<Help />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/request" element={<RequestQuote />} />
        <Route path="/quotes/:id" element={<QuoteDetail />} />
        <Route path="/salon/inbox" element={<SalonInbox />} />
        <Route path="/salon/inbox/:id" element={<SalonInboxDetail />} />
        <Route path="/pros" element={<Pros />} />
        <Route path="/admin/outreach" element={<AdminOutreach />} />
        <Route path="/r" element={<RepOnboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
