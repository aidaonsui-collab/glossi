import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import Modal from './Modal.jsx';
import { useAuth } from '../store.jsx';
import { useToast } from './Toast.jsx';

export default function SignInModal({ open, onClose, defaultRole = 'customer' }) {
  const { signInWithEmail } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sofia@example.com');
  const [role, setRole] = useState(defaultRole);

  const submit = () => {
    if (!email.trim()) { toast('Email required.', { tone: 'warn' }); return; }
    signInWithEmail(email, role);
    toast(`Signed in as ${role === 'salon' ? 'Casa de Belleza' : 'Sofia'}.`, { tone: 'success' });
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} eyebrow="WELCOME BACK" title="Sign in to Glossi" footer={
      <button onClick={submit} style={{ background: p.accent, color: p.ink, border: 0, padding: '11px 22px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        Sign in →
      </button>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>I'M SIGNING IN AS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { id: 'customer', l: 'Customer', sub: 'Book salons' },
              { id: 'salon', l: 'Salon', sub: 'Send bids' },
            ].map(r => {
              const a = role === r.id;
              return (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  padding: '14px 14px', borderRadius: 12,
                  background: a ? p.ink : p.surface, color: a ? p.bg : p.ink,
                  border: `0.5px solid ${a ? p.ink : p.line}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}>
                  <div style={{ fontFamily: type.body, fontSize: 14, fontWeight: 600 }}>{r.l}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{r.sub}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6 }}>EMAIL</div>
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            type="email" autoFocus
            style={{ width: '100%', padding: '12px 14px', border: `0.5px solid ${p.line}`, borderRadius: 10, background: p.bg, fontFamily: type.body, fontSize: 14, color: p.ink, outline: 'none' }}
          />
        </div>
        <div style={{ fontSize: 11.5, color: p.inkMuted, lineHeight: 1.5 }}>
          Demo · click "Sign in" with any email. Your booking history and saved salons are stored locally on this device.
        </div>
        <div style={{ marginTop: 4, paddingTop: 12, borderTop: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 12.5, color: p.inkSoft }}>Don't have an account?</span>
          <button onClick={() => { onClose?.(); navigate(`/signup${role === 'salon' ? '?role=salon' : ''}`); }} style={{ background: 'transparent', border: 0, fontSize: 13, color: p.accent, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
            Create one →
          </button>
        </div>
      </div>
    </Modal>
  );
}
