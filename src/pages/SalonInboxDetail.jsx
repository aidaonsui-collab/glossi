import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import SalonLayout from '../components/SalonLayout.jsx';
import { useAuth } from '../store.jsx';
import { submitBid } from '../lib/quotes.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const fmtMiles = m => m == null ? '—' : `${m.toFixed(1)} mi`;
const fmtAgo = ts => {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function SalonInboxDetail() {
  const isPhone = useNarrow();
  const { id } = useParams();
  const [params] = useSearchParams();
  const businessId = params.get('biz');
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [contact, setContact] = useState(null);
  const [myBid, setMyBid] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('60');
  const [slot, setSlot] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && user === null) navigate('/signup?role=salon', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    let cancel = false;
    async function load() {
      if (!isSupabaseConfigured || !id || !businessId) { setLoading(false); return; }
      setLoading(true);
      const { data: req } = await supabase.from('quote_requests').select('*').eq('id', id).maybeSingle();
      if (cancel) return;
      setRequest(req);

      // Get my existing bid (if any) — RLS lets the business owner read its own bids
      const { data: bids } = await supabase
        .from('quote_bids')
        .select('id, price_cents, estimated_duration, earliest_slot, message, status')
        .eq('request_id', id)
        .eq('business_id', businessId)
        .neq('status', 'withdrawn');
      const mine = bids?.[0];
      if (cancel) return;
      if (mine) {
        setMyBid(mine);
        setPrice(String(Math.round(mine.price_cents / 100)));
        setDuration(String(mine.estimated_duration));
        setSlot(mine.earliest_slot ? new Date(mine.earliest_slot).toISOString().slice(0, 16) : '');
        setMessage(mine.message || '');
      }
      setLoading(false);
    }
    load();
    return () => { cancel = true; };
  }, [id, businessId]);

  const onRevealContact = async () => {
    const { data, error } = await supabase.rpc('request_customer_contact', { p_request_id: id });
    if (error) { toast(error.message, { tone: 'warn' }); return; }
    setContact(data?.[0] || null);
  };

  const onSubmit = async e => {
    e?.preventDefault();
    const priceCents = Math.round(parseFloat(price) * 100);
    const durationMin = parseInt(duration, 10);
    if (!Number.isFinite(priceCents) || priceCents < 0) { toast('Enter a valid price.', { tone: 'warn' }); return; }
    if (!Number.isFinite(durationMin) || durationMin <= 0) { toast('Enter a valid duration.', { tone: 'warn' }); return; }

    setSubmitting(true);
    try {
      const result = await submitBid({
        businessId,
        requestId: id,
        priceCents,
        durationMin,
        earliestSlot: slot ? new Date(slot).toISOString() : null,
        message: message || null,
      });
      if (!result.ok) { toast(result.error, { tone: 'warn' }); return; }
      toast(myBid ? 'Bid updated.' : 'Bid sent.', { tone: 'success' });
      navigate('/salon/inbox');
    } catch (err) {
      toast(err?.message || 'Failed to send bid.', { tone: 'warn' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `0.5px solid ${p.line}`, background: p.surface,
    fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box',
  };

  if (!businessId) {
    return (
      <SalonLayout active="inbox" mobileTitle="Bid">
        <div style={{ padding: 40, color: p.inkMuted, fontSize: 14 }}>Missing business context — go back to inbox.</div>
      </SalonLayout>
    );
  }

  if (loading) {
    return (
      <SalonLayout active="inbox" mobileTitle="Bid">
        <div style={{ padding: 40, color: p.inkMuted, fontSize: 14 }}>Loading…</div>
      </SalonLayout>
    );
  }

  if (!request) {
    return (
      <SalonLayout active="inbox" mobileTitle="Bid">
        <div style={{ padding: 40, color: p.inkMuted, fontSize: 14 }}>Request not found.</div>
      </SalonLayout>
    );
  }

  const expiresIn = Math.max(0, Math.floor((new Date(request.expires_at).getTime() - Date.now()) / 3600000));
  const isOpen = request.status === 'open';

  return (
    <SalonLayout active="inbox" mobileTitle="Bid">
      <form onSubmit={onSubmit} style={{ padding: isPhone ? '20px 18px 60px' : '34px 40px 60px', maxWidth: 720 }}>
        <Link to="/salon/inbox" style={{ fontSize: 12, color: p.inkMuted, textDecoration: 'none', fontWeight: 600 }}>← Inbox</Link>

        <div style={{ marginTop: 16, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>
          REQUEST · {request.search_zip || '—'} · {fmtAgo(request.created_at)} · {isOpen ? `${expiresIn}H LEFT` : request.status?.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 30 : 40, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '8px 0 0' }}>
          {(request.service_slugs || []).map(s => s.replace('-', ' & ')).join(', ')}
        </h1>
        {request.notes && (
          <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '12px 0 0', maxWidth: 560, fontStyle: 'italic' }}>
            "{request.notes}"
          </p>
        )}

        {(request.earliest_date || request.latest_date) && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 12, fontSize: 12.5, color: p.inkSoft }}>
            <strong style={{ color: p.ink }}>When:</strong> {request.earliest_date || '—'} → {request.latest_date || '—'}
          </div>
        )}

        {/* Contact reveal — only after a bid is placed (RLS gates this) */}
        <div style={{ marginTop: 18 }}>
          {contact ? (
            <div style={{ padding: '12px 14px', background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 12, fontSize: 13, color: p.ink }}>
              <div style={{ fontSize: 9.5, color: p.inkMuted, fontWeight: 700, letterSpacing: '0.14em' }}>CUSTOMER</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{contact.full_name || '—'}</div>
              <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 2 }}>{contact.email}{contact.phone ? ` · ${contact.phone}` : ''}</div>
            </div>
          ) : myBid ? (
            <button type="button" onClick={onRevealContact} style={{ background: 'transparent', color: p.accent, border: `0.5px solid ${p.line}`, padding: '10px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Reveal customer contact
            </button>
          ) : (
            <div style={{ fontSize: 11.5, color: p.inkMuted, fontStyle: 'italic' }}>Customer contact unlocks once you've sent a bid.</div>
          )}
        </div>

        {/* Bid form */}
        <div style={{ marginTop: 28, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>
          {myBid ? `UPDATE YOUR BID · ${myBid.status?.toUpperCase()}` : 'SEND A BID'}
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr 1fr' : '180px 180px', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Price ($)</div>
              <input value={price} onChange={e => setPrice(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" placeholder="120" style={{ ...inputStyle, fontFamily: type.mono }} />
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Duration (min)</div>
              <input value={duration} onChange={e => setDuration(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="60" style={{ ...inputStyle, fontFamily: type.mono }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Earliest slot you can offer · optional</div>
            <input type="datetime-local" value={slot} onChange={e => setSlot(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: p.inkSoft, marginBottom: 6, fontWeight: 600 }}>Message · optional</div>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Hi! I can do this — happy to share photos of similar work." style={{ ...inputStyle, fontFamily: type.body, lineHeight: 1.5, resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ marginTop: 22, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="submit" disabled={submitting || !isOpen} style={{
            background: isOpen ? p.ink : p.line, color: p.bg, border: 0,
            padding: '14px 22px', borderRadius: 99, fontSize: 14, fontWeight: 600,
            cursor: submitting ? 'wait' : isOpen ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
          }}>
            {submitting ? 'Sending…' : myBid ? 'Update bid' : 'Send bid →'}
          </button>
          {!isOpen && <span style={{ fontSize: 11.5, color: p.inkMuted }}>This request is no longer accepting bids.</span>}
        </div>
      </form>
    </SalonLayout>
  );
}
