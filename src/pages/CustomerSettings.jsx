import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth, useBookings, useCustomerProfile, useLang } from '../store.jsx';

const NOTIFICATION_LABELS = {
  bids: { l: 'New bids on my requests', d: 'Real-time push when salons respond' },
  reminders: { l: 'Booking reminders', d: '24 h and 1 h before your appointment' },
  drops: { l: 'Price drops near me', d: 'When a saved salon offers a deal' },
  news: { l: 'Glossi guides & tips', d: 'Editorial picks, weekly' },
  sound: { l: 'Sound', d: 'Ping when a bid arrives' },
};

export default function CustomerSettings() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const { profile, update, updateNotifications } = useCustomerProfile();
  const { lang, setLang } = useLang();

  const { bookings } = useBookings();
  const [draft, setDraft] = useState(profile);

  // Re-sync the draft whenever the underlying profile changes (e.g. once
  // the auth user hydrates after initial mount). Without this, the form
  // captures the demo Sofia placeholder and never updates.
  const [draftDirty, setDraftDirty] = useState(false);
  useEffect(() => {
    if (!draftDirty) setDraft(profile);
  }, [profile, draftDirty]);
  const editDraft = patch => {
    setDraftDirty(true);
    setDraft(prev => ({ ...prev, ...patch }));
  };
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [card, setCard] = useState({ name: '', number: '', exp: '', cvc: '' });
  const photoInputRef = useRef(null);
  const [avatarPhoto, setAvatarPhoto] = useState(null);

  const onPhotoPick = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPhoto(reader.result);
      toast('Avatar updated. Save to keep it.', { tone: 'success' });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const submitCard = () => {
    const last4 = card.number.replace(/\s/g, '').slice(-4);
    if (card.number.replace(/\s/g, '').length < 12) { toast('Card number looks too short.', { tone: 'warn' }); return; }
    if (!/^\d{2}\/\d{2}$/.test(card.exp)) { toast('Use MM/YY for expiry.', { tone: 'warn' }); return; }
    if (card.cvc.length < 3) { toast('CVC needs 3+ digits.', { tone: 'warn' }); return; }
    toast(`Card on file replaced — •••• ${last4}.`, { tone: 'success' });
    setShowCard(false);
    setCard({ name: '', number: '', exp: '', cvc: '' });
  };

  const downloadReceipts = () => {
    const rows = [['Date', 'Salon', 'Service', 'Subtotal', 'Tip', 'Tax', 'Total', 'Status']];
    bookings.forEach(b => {
      rows.push([
        new Date(b.createdAt).toISOString().slice(0, 10),
        b.salonName || '',
        b.service || '',
        (b.subtotal ?? '').toString(),
        (b.tipAmt ?? '').toString(),
        (b.tax ?? '').toString(),
        (b.total ?? '').toString(),
        b.status || '',
      ]);
    });
    const csv = rows.map(r => r.map(c => /[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `glossi-receipts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast(`Downloaded ${bookings.length} booking${bookings.length === 1 ? '' : 's'}.`, { tone: 'success' });
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  const save = () => {
    update(draft);
    setDraftDirty(false);
    toast('Profile saved.', { tone: 'success' });
  };

  const onDelete = () => {
    if (confirmText !== 'DELETE') { toast('Type DELETE to confirm.', { tone: 'warn' }); return; }
    signOut();
    try {
      ['glossi.bookings', 'glossi.saved', 'glossi.reviews', 'glossi.profile.customer'].forEach(k => localStorage.removeItem(k));
    } catch { /* noop */ }
    toast('Account deleted.', { tone: 'success' });
    navigate('/');
  };

  const Section = ({ children, title, eyebrow }) => (
    <section style={{ marginTop: 28 }}>
      {eyebrow && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{eyebrow}</div>}
      <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 24 : 30, fontWeight: type.displayWeight, letterSpacing: '-0.02em', lineHeight: 1.05, margin: '6px 0 14px' }}>{title}</h2>
      <div style={{ background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, overflow: 'hidden' }}>{children}</div>
    </section>
  );

  const Field = ({ label, children, last }) => (
    <div style={{ padding: '14px 18px', borderBottom: last ? 0 : `0.5px solid ${p.line}`, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '180px 1fr', gap: isPhone ? 6 : 14, alignItems: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: p.inkSoft }}>{label}</div>
      <div>{children}</div>
    </div>
  );

  const input = {
    width: '100%', padding: '10px 12px', background: p.bg, border: `0.5px solid ${p.line}`, borderRadius: 10,
    fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <CustomerLayout active="settings" mobileTitle="Settings">
      <div style={{ padding: isPhone ? '20px 18px 32px' : '34px 40px 60px', maxWidth: 760 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>SETTINGS</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Profile.</h1>
        <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
          How Glossi knows you. Updates apply across web and iOS.
        </p>

        {/* Account header */}
        <div style={{ marginTop: 22, padding: '20px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 99, background: avatarPhoto ? `url(${avatarPhoto}) center/cover` : (user?.avatar || 'linear-gradient(135deg,#E8B7A8,#B8893E)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 22, fontWeight: 700 }}>{!avatarPhoto && (user?.initials || draft.name.split(' ').map(s => s[0]).slice(0, 2).join(''))}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.015em' }}>{draft.name}</div>
            <div style={{ fontSize: 12.5, color: p.inkMuted, marginTop: 2 }}>{draft.email} · {draft.city}</div>
          </div>
          <button onClick={() => photoInputRef.current?.click()} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Change photo</button>
          <input ref={photoInputRef} type="file" accept="image/*" onChange={onPhotoPick} style={{ display: 'none' }} />
        </div>

        <Section title="Personal info" eyebrow="01 · CONTACT">
          <Field label="Name">
            <input value={draft.name} onChange={e => editDraft({ name: e.target.value })} style={input} />
          </Field>
          <Field label="Email">
            <input type="email" value={draft.email} onChange={e => editDraft({ email: e.target.value })} style={input} />
          </Field>
          <Field label="Phone">
            <input value={draft.phone} onChange={e => editDraft({ phone: e.target.value })} style={input} />
          </Field>
          <Field label="ZIP">
            <input value={draft.zip} onChange={e => editDraft({ zip: e.target.value.replace(/\D/g, '').slice(0, 5) })} inputMode="numeric" style={{ ...input, fontFamily: type.mono, letterSpacing: '0.1em', maxWidth: 140 }} />
          </Field>
          <Field label="City" last>
            <input value={draft.city} onChange={e => editDraft({ city: e.target.value })} style={input} />
          </Field>
        </Section>

        <Section title="Language" eyebrow="02 · PREFERENCES">
          <Field label="Display language" last>
            <div style={{ display: 'inline-flex', background: p.bg, borderRadius: 99, border: `0.5px solid ${p.line}`, padding: 3 }}>
              {[{ id: 'en', l: 'English' }, { id: 'es', l: 'Español' }].map(o => {
                const a = lang === o.id;
                return (
                  <button key={o.id} onClick={() => setLang(o.id)} style={{
                    padding: '7px 16px', borderRadius: 99, border: 0,
                    background: a ? p.ink : 'transparent', color: a ? p.bg : p.ink,
                    fontFamily: type.body, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{o.l}</button>
                );
              })}
            </div>
          </Field>
        </Section>

        <Section title="Notifications" eyebrow="03 · ALERTS">
          {Object.entries(NOTIFICATION_LABELS).map(([k, v], i, arr) => (
            <Field key={k} label={v.l} last={i === arr.length - 1}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <span style={{ fontSize: 12, color: p.inkMuted, lineHeight: 1.45 }}>{v.d}</span>
                <button onClick={() => updateNotifications({ [k]: !profile.notifications[k] })} style={{
                  width: 42, height: 24, borderRadius: 99, position: 'relative', cursor: 'pointer',
                  background: profile.notifications[k] ? p.success : p.line, transition: 'background 0.2s',
                  border: 0, padding: 0, fontFamily: 'inherit', flexShrink: 0,
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: 99, background: '#fff', position: 'absolute', top: 3, left: profile.notifications[k] ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
                </button>
              </div>
            </Field>
          ))}
        </Section>

        <Section title="Payment" eyebrow="04 · BILLING">
          <Field label="Card on file">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #1A1614 0%, #3A2A24 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 10, fontStyle: 'italic', fontWeight: 700 }}>VISA</div>
              <span style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600 }}>•••• 4729</span>
              <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted }}>Exp 09/27</span>
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowCard(true)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Replace</button>
            </div>
          </Field>
          <Field label="Receipts" last>
            <button onClick={downloadReceipts} disabled={bookings.length === 0} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: bookings.length ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: bookings.length ? 1 : 0.5 }}>Download all (CSV)</button>
          </Field>
        </Section>

        <Section title="Account" eyebrow="05 · DANGER ZONE">
          <Field label="Sign out">
            <button onClick={() => { signOut(); toast('Signed out.'); navigate('/'); }} style={{ background: p.surface, border: `0.5px solid ${p.line}`, padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
          </Field>
          <Field label="Delete account" last>
            <button onClick={() => setShowDelete(true)} style={{ background: 'transparent', border: `0.5px solid ${p.accent}`, padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.accent, cursor: 'pointer', fontFamily: 'inherit' }}>Delete account →</button>
          </Field>
        </Section>

        {/* Save bar */}
        {dirty && (
          <div style={{
            position: 'sticky', bottom: 16, marginTop: 24,
            padding: '14px 18px', background: p.ink, color: p.bg, borderRadius: 14,
            display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
          }}>
            <div style={{ flex: 1, fontFamily: type.body, fontSize: 13.5, fontWeight: 500 }}>Unsaved changes</div>
            <button onClick={() => { setDraft(profile); setDraftDirty(false); }} style={{ background: 'transparent', border: `0.5px solid rgba(255,255,255,0.2)`, padding: '8px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, color: p.bg, cursor: 'pointer', fontFamily: 'inherit' }}>Discard</button>
            <button onClick={save} style={{ background: p.accent, color: p.ink, border: 0, padding: '9px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Save changes</button>
          </div>
        )}

        <Modal open={showDelete} onClose={() => setShowDelete(false)} eyebrow="DELETE ACCOUNT" title="This can't be undone." footer={
          <>
            <button onClick={() => setShowDelete(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: p.ink }}>Cancel</button>
            <button onClick={onDelete} disabled={confirmText !== 'DELETE'} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: confirmText === 'DELETE' ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: confirmText === 'DELETE' ? 1 : 0.5 }}>Delete forever</button>
          </>
        }>
          <div style={{ fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55 }}>
            Deleting your account removes your bookings, saved salons, reviews, and contact info from this device. To confirm, type <span style={{ fontFamily: type.mono, fontWeight: 700, color: p.ink }}>DELETE</span> below.
          </div>
          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="DELETE" style={{ ...input, marginTop: 14, fontFamily: type.mono, letterSpacing: '0.16em' }} />
        </Modal>

        <Modal open={showCard} onClose={() => setShowCard(false)} eyebrow="REPLACE PAYMENT METHOD" title="Add a new card" footer={
          <>
            <button onClick={() => setShowCard(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={submitCard} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Save card</button>
          </>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>CARDHOLDER</div>
              <input value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="Sofia Martinez" autoFocus style={input} />
            </label>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>CARD NUMBER</div>
              <input
                value={card.number}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                  setCard(c => ({ ...c, number: digits.replace(/(.{4})/g, '$1 ').trim() }));
                }}
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                style={{ ...input, fontFamily: type.mono, letterSpacing: '0.04em' }}
              />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>EXPIRES</div>
                <input
                  value={card.exp}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                    setCard(c => ({ ...c, exp: v }));
                  }}
                  inputMode="numeric" placeholder="MM/YY"
                  style={{ ...input, fontFamily: type.mono }}
                />
              </label>
              <label>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>CVC</div>
                <input
                  value={card.cvc}
                  onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  inputMode="numeric" placeholder="123"
                  style={{ ...input, fontFamily: type.mono }}
                />
              </label>
            </div>
            <div style={{ fontSize: 11, color: p.inkMuted, lineHeight: 1.5, marginTop: 4 }}>
              Demo · the prototype doesn't store card data. Real Glossi sends this through Stripe Elements with PCI-compliant tokenization.
            </div>
          </div>
        </Modal>
      </div>
    </CustomerLayout>
  );
}
