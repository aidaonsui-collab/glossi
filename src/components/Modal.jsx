import { useEffect } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';

export default function Modal({ open, onClose, title, eyebrow, children, footer, width = 480 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(20, 18, 16, 0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, animation: 'glossiBackdropIn 0.16s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: width, background: p.surface, color: p.ink,
          borderRadius: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.30)',
          fontFamily: type.body, animation: 'glossiModalIn 0.18s ease-out',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ padding: '22px 24px 18px', borderBottom: `0.5px solid ${p.line}` }}>
          {eyebrow && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>{eyebrow}</div>}
          {title && <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', marginTop: eyebrow ? 6 : 0 }}>{title}</div>}
        </div>
        <div style={{ padding: '20px 24px', flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: '16px 24px 20px', borderTop: `0.5px solid ${p.line}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
}
