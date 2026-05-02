import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout.jsx';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth, useBookings, useCustomerProfile, useLang } from '../store.jsx';
import { useT } from '../lib/i18n.js';

const NOTIFICATION_LABELS = {
  bids: { l: 'New bids on my requests', es: 'Nuevas ofertas en mis solicitudes', d: 'Real-time push when salons respond', dEs: 'Aviso al instante cuando los salones respondan' },
  reminders: { l: 'Booking reminders', es: 'Recordatorios de reserva', d: '24 h and 1 h before your appointment', dEs: '24 h y 1 h antes de tu cita' },
  drops: { l: 'Price drops near me', es: 'Bajadas de precio cerca de ti', d: 'When a saved salon offers a deal', dEs: 'Cuando un salón guardado ofrece una promoción' },
  news: { l: 'Glossi guides & tips', es: 'Guías y consejos Glossi', d: 'Editorial picks, weekly', dEs: 'Selecciones editoriales, semanal' },
  sound: { l: 'Sound', es: 'Sonido', d: 'Ping when a bid arrives', dEs: 'Aviso sonoro al recibir oferta' },
};

export default function CustomerSettings() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const { profile, update, updateNotifications } = useCustomerProfile();
  const { lang, setLang } = useLang();
  const t = useT();

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
      toast(t('Avatar updated. Save to keep it.', 'Avatar actualizado. Guarda para conservarlo.'), { tone: 'success' });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const submitCard = () => {
    const last4 = card.number.replace(/\s/g, '').slice(-4);
    if (card.number.replace(/\s/g, '').length < 12) { toast(t('Card number looks too short.', 'El número de tarjeta parece corto.'), { tone: 'warn' }); return; }
    if (!/^\d{2}\/\d{2}$/.test(card.exp)) { toast(t('Use MM/YY for expiry.', 'Usa MM/AA para la expiración.'), { tone: 'warn' }); return; }
    if (card.cvc.length < 3) { toast(t('CVC needs 3+ digits.', 'El CVC necesita 3+ dígitos.'), { tone: 'warn' }); return; }
    toast(t(`Card on file replaced — •••• ${last4}.`, `Tarjeta reemplazada — •••• ${last4}.`), { tone: 'success' });
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
    toast(
      lang === 'es'
        ? `Se descargaron ${bookings.length} reserva${bookings.length === 1 ? '' : 's'}.`
        : `Downloaded ${bookings.length} booking${bookings.length === 1 ? '' : 's'}.`,
      { tone: 'success' }
    );
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  const save = () => {
    update(draft);
    setDraftDirty(false);
    toast(t('Profile saved.', 'Perfil guardado.'), { tone: 'success' });
  };

  const onDelete = () => {
    if (confirmText !== 'DELETE') { toast(t('Type DELETE to confirm.', 'Escribe DELETE para confirmar.'), { tone: 'warn' }); return; }
    signOut();
    try {
      ['glossi.bookings', 'glossi.saved', 'glossi.reviews', 'glossi.profile.customer'].forEach(k => localStorage.removeItem(k));
    } catch { /* noop */ }
    toast(t('Account deleted.', 'Cuenta eliminada.'), { tone: 'success' });
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
    <CustomerLayout active="settings" mobileTitle={t('Settings', 'Configuración')}>
      <div style={{ padding: isPhone ? '20px 18px 32px' : '34px 40px 60px', maxWidth: 760 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.inkMuted }}>{t('SETTINGS', 'CONFIGURACIÓN')}</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 38 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>{t('Profile.', 'Perfil.')}</h1>
        <p style={{ fontSize: isPhone ? 14 : 15, color: p.inkSoft, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
          {t('How Glossi knows you. Updates apply across web and iOS.', 'Así te conoce Glossi. Los cambios se aplican en web e iOS.')}
        </p>

        {/* Account header */}
        <div style={{ marginTop: 22, padding: '20px', background: p.surface, borderRadius: 16, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 99, background: avatarPhoto ? `url(${avatarPhoto}) center/cover` : (user?.avatar || 'linear-gradient(135deg,#E8B7A8,#B8893E)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: type.display, fontSize: 22, fontWeight: 700 }}>{!avatarPhoto && (user?.initials || draft.name.split(' ').map(s => s[0]).slice(0, 2).join(''))}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.015em' }}>{draft.name}</div>
            <div style={{ fontSize: 12.5, color: p.inkMuted, marginTop: 2 }}>{draft.email} · {draft.city}</div>
          </div>
          <button onClick={() => photoInputRef.current?.click()} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Change photo', 'Cambiar foto')}</button>
          <input ref={photoInputRef} type="file" accept="image/*" onChange={onPhotoPick} style={{ display: 'none' }} />
        </div>

        <Section title={t('Personal info', 'Información personal')} eyebrow={t('01 · CONTACT', '01 · CONTACTO')}>
          <Field label={t('Name', 'Nombre')}>
            <input value={draft.name} onChange={e => editDraft({ name: e.target.value })} style={input} />
          </Field>
          <Field label={t('Email', 'Correo')}>
            <input type="email" value={draft.email} onChange={e => editDraft({ email: e.target.value })} style={input} />
          </Field>
          <Field label={t('Phone', 'Teléfono')}>
            <input value={draft.phone} onChange={e => editDraft({ phone: e.target.value })} style={input} />
          </Field>
          <Field label={t('ZIP', 'Código postal')}>
            <input value={draft.zip} onChange={e => editDraft({ zip: e.target.value.replace(/\D/g, '').slice(0, 5) })} inputMode="numeric" style={{ ...input, fontFamily: type.mono, letterSpacing: '0.1em', maxWidth: 140 }} />
          </Field>
          <Field label={t('City', 'Ciudad')} last>
            <input value={draft.city} onChange={e => editDraft({ city: e.target.value })} style={input} />
          </Field>
        </Section>

        <Section title={lang === 'es' ? 'Idioma' : 'Language'} eyebrow="02 · PREFERENCES">
          <Field label={lang === 'es' ? 'Idioma de la app' : 'Display language'} last>
            <div style={{ display: 'inline-flex', background: p.bg, borderRadius: 99, border: `0.5px solid ${p.line}`, padding: 3 }}>
              {[{ id: 'en', l: 'English' }, { id: 'es', l: 'Español' }].map(o => {
                const a = lang === o.id;
                return (
                  <button key={o.id} onClick={() => {
                    if (lang === o.id) return;
                    setLang(o.id);
                    toast(o.id === 'es' ? 'Idioma cambiado a Español.' : 'Language switched to English.', { tone: 'success' });
                  }} style={{
                    padding: '7px 16px', borderRadius: 99, border: 0,
                    background: a ? p.ink : 'transparent', color: a ? p.bg : p.ink,
                    fontFamily: type.body, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{o.l}</button>
                );
              })}
            </div>
          </Field>
        </Section>

        <Section title={t('Notifications', 'Notificaciones')} eyebrow={t('03 · ALERTS', '03 · ALERTAS')}>
          {Object.entries(NOTIFICATION_LABELS).map(([k, v], i, arr) => (
            <Field key={k} label={t(v.l, v.es)} last={i === arr.length - 1}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <span style={{ fontSize: 12, color: p.inkMuted, lineHeight: 1.45 }}>{t(v.d, v.dEs)}</span>
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

        <Section title={t('Payment', 'Pago')} eyebrow={t('04 · BILLING', '04 · FACTURACIÓN')}>
          <Field label={t('Card on file', 'Tarjeta archivada')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #1A1614 0%, #3A2A24 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 10, fontStyle: 'italic', fontWeight: 700 }}>VISA</div>
              <span style={{ fontFamily: type.mono, fontSize: 14, fontWeight: 600 }}>•••• 4729</span>
              <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted }}>{t('Exp', 'Vence')} 09/27</span>
              <div style={{ flex: 1 }} />
              <button onClick={() => setShowCard(true)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Replace', 'Reemplazar')}</button>
            </div>
          </Field>
          <Field label={t('Receipts', 'Recibos')} last>
            <button onClick={downloadReceipts} disabled={bookings.length === 0} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: p.ink, cursor: bookings.length ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: bookings.length ? 1 : 0.5 }}>{t('Download all (CSV)', 'Descargar todo (CSV)')}</button>
          </Field>
        </Section>

        <Section title={t('Account', 'Cuenta')} eyebrow={t('05 · DANGER ZONE', '05 · ZONA DE PELIGRO')}>
          <Field label={t('Sign out', 'Cerrar sesión')}>
            <button onClick={() => { signOut(); toast(t('Signed out.', 'Sesión cerrada.')); navigate('/'); }} style={{ background: p.surface, border: `0.5px solid ${p.line}`, padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Sign out', 'Cerrar sesión')}</button>
          </Field>
          <Field label={t('Delete account', 'Eliminar cuenta')} last>
            <button onClick={() => setShowDelete(true)} style={{ background: 'transparent', border: `0.5px solid ${p.accent}`, padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.accent, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Delete account →', 'Eliminar cuenta →')}</button>
          </Field>
        </Section>

        {/* Save bar */}
        {dirty && (
          <div style={{
            position: 'sticky', bottom: 16, marginTop: 24,
            padding: '14px 18px', background: p.ink, color: p.bg, borderRadius: 14,
            display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
          }}>
            <div style={{ flex: 1, fontFamily: type.body, fontSize: 13.5, fontWeight: 500 }}>{t('Unsaved changes', 'Cambios sin guardar')}</div>
            <button onClick={() => { setDraft(profile); setDraftDirty(false); }} style={{ background: 'transparent', border: `0.5px solid rgba(255,255,255,0.2)`, padding: '8px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, color: p.bg, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Discard', 'Descartar')}</button>
            <button onClick={save} style={{ background: p.accent, color: p.ink, border: 0, padding: '9px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Save changes', 'Guardar cambios')}</button>
          </div>
        )}

        <Modal open={showDelete} onClose={() => setShowDelete(false)} eyebrow={t('DELETE ACCOUNT', 'ELIMINAR CUENTA')} title={t("This can't be undone.", 'Esto no se puede deshacer.')} footer={
          <>
            <button onClick={() => setShowDelete(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: p.ink }}>{t('Cancel', 'Cancelar')}</button>
            <button onClick={onDelete} disabled={confirmText !== 'DELETE'} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: confirmText === 'DELETE' ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: confirmText === 'DELETE' ? 1 : 0.5 }}>{t('Delete forever', 'Eliminar para siempre')}</button>
          </>
        }>
          <div style={{ fontSize: 13.5, color: p.inkSoft, lineHeight: 1.55 }}>
            {lang === 'es' ? (
              <>Al eliminar tu cuenta se borran tus reservas, salones guardados, reseñas y contacto en este dispositivo. Para confirmar, escribe <span style={{ fontFamily: type.mono, fontWeight: 700, color: p.ink }}>DELETE</span> abajo.</>
            ) : (
              <>Deleting your account removes your bookings, saved salons, reviews, and contact info from this device. To confirm, type <span style={{ fontFamily: type.mono, fontWeight: 700, color: p.ink }}>DELETE</span> below.</>
            )}
          </div>
          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="DELETE" style={{ ...input, marginTop: 14, fontFamily: type.mono, letterSpacing: '0.16em' }} />
        </Modal>

        <Modal open={showCard} onClose={() => setShowCard(false)} eyebrow={t('REPLACE PAYMENT METHOD', 'REEMPLAZAR MÉTODO DE PAGO')} title={t('Add a new card', 'Agregar una nueva tarjeta')} footer={
          <>
            <button onClick={() => setShowCard(false)} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '11px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: p.ink, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Cancel', 'Cancelar')}</button>
            <button onClick={submitCard} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t('Save card', 'Guardar tarjeta')}</button>
          </>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t('CARDHOLDER', 'TITULAR')}</div>
              <input value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="Sofia Martinez" autoFocus style={input} />
            </label>
            <label>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t('CARD NUMBER', 'NÚMERO DE TARJETA')}</div>
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
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>{t('EXPIRES', 'VENCE')}</div>
                <input
                  value={card.exp}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                    setCard(c => ({ ...c, exp: v }));
                  }}
                  inputMode="numeric" placeholder={t('MM/YY', 'MM/AA')}
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
              {t(
                "Demo · the prototype doesn't store card data. Real Glossi sends this through Stripe Elements with PCI-compliant tokenization.",
                'Demo · el prototipo no guarda datos de tarjeta. El Glossi real envía esto a Stripe Elements con tokenización conforme a PCI.'
              )}
            </div>
          </div>
        </Modal>
      </div>
    </CustomerLayout>
  );
}
