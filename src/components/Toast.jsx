import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);
  const push = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, tone: opts.tone || 'info' }]);
    setTimeout(() => remove(id), opts.duration || 2800);
  }, [remove]);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', gap: 8, zIndex: 1000, pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: p.ink, color: p.bg,
            padding: '12px 18px', borderRadius: 99,
            fontFamily: type.body, fontSize: 13, fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'glossiToastIn 0.18s ease-out',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: 99,
              background: t.tone === 'success' ? p.success : t.tone === 'warn' ? p.blush : p.accent,
            }} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
