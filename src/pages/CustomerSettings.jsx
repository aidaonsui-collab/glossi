import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth, useCustomerProfile, useLang } from '../store.jsx';

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

  const [draft, setDraft] = useState(profile);
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  const save = () => {
    update(draft);
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
          <div style={{ width: 60, height: 60, borderRadius: 99, background: user?.avatar || 'linear-gradient(135deg,#E8B7A8,#B8893E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 22, fontWeight: 700 }}>{user?.initials || draft.name.split(' ').map(s => s[0]).slice(0, 2).join('')}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.015em' }}>{draft.name}</div>
            <div style={{ fontSize: 12.5, color: p.inkMuted, marginTop: 2 }}>{draft.email} · {draft.city}</div>
          </div>
          <button onClick={() => toast('Avatar upload — coming soon.')} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Change photo</button>
        </div>

        <Section title="Personal info" eyebrow="01 · CONTACT">
          <Field label="Name">
            <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} style={input} />
          </Field>
          <Field label="Email">
            <input type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} style={input} />
          </Field>
          <Field label="Phone">
            <input value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} style={input} />
          </Field>
          <Field label="ZIP">
            <input value={draft.zip} onChange={e => setDraft({ ...draft, zip: e.target.value.replace(/\D/g, '').slice(0, 5) })} inputMode="numeric" style={{ ...input, fontFamily: type.mono, letterSpacing: '0.1em', maxWidth: 140 }} />
          </Field>
          <Field label="City" last>
            <input value={draft.city} onChange={e => setDraft({ ...draft, city: e.target.value })} style={input} />
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
              <button onClick={() => toast('Replace card — coming soon.')} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Replace</button>
            </div>
          </Field>
          <Field label="Receipts" last>
            <button onClick={() => toast('Receipt history — coming soon.')} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>Download all (CSV)</button>
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
            <button onClick={() => setDraft(profile)} style={{ background: 'transparent', border: `0.5px solid rgba(255,255,255,0.2)`, padding: '8px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, color: p.bg, cursor: 'pointer', fontFamily: 'inherit' }}>Discard</button>
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
      </div>
    </CustomerLayout>
  );
}
