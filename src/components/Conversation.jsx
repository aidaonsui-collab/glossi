import { useEffect, useRef, useState } from 'react';
import { IOSStatusBar } from '../ios/IOSFrame.jsx';
import { THREADS } from '../ios/details.js';
import { Pulse } from '../ios/atoms.jsx';

export default function Conversation({ p, type, lang, surface, threadId, onBack, onOpenProfile }) {
  const [thread, setThread] = useState(THREADS[threadId]);
  const [draft, setDraft] = useState('');
  const isIOS = surface === 'ios';
  const scrollRef = useRef(null);

  useEffect(() => {
    setThread(THREADS[threadId]);
    setDraft('');
  }, [threadId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread]);

  if (!thread) return null;

  const send = text => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setThread(t => ({
      ...t,
      messages: [...t.messages, { from: 'me', t: time, en: text, es: text }],
    }));
    setDraft('');
    setTimeout(() => {
      setThread(t => ({
        ...t,
        messages: [...t.messages, {
          from: 'salon', t: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          en: lang === 'en' ? "Got it — I'll get back to you within an hour." : 'Recibido — te respondo en una hora.',
          es: 'Recibido — te respondo en una hora.',
        }],
      }));
    }, 1500);
  };

  return (
    <div style={{ background: p.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', color: p.ink, fontFamily: type.body, height: isIOS ? undefined : '100vh' }}>
      {isIOS && <IOSStatusBar />}

      {/* Header */}
      <div style={{
        padding: isIOS ? '54px 16px 12px' : '16px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `0.5px solid ${p.line}`, background: p.surface,
        position: 'sticky', top: 0, zIndex: 5,
      }}>
        <button onClick={onBack} style={{
          border: 0, cursor: 'pointer', width: 36, height: 36, borderRadius: 999,
          background: p.bg, boxShadow: `inset 0 0 0 0.5px ${p.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={() => onOpenProfile?.(thread.salonId)} style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'transparent',
          border: 0, padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
        }}>
          <div style={{ width: 38, height: 38, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>
            {thread.salon.split(' ').map(s => s[0]).slice(0, 2).join('')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontSize: 16, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{thread.salon}</div>
            <div style={{ fontSize: 11, color: thread.online ? p.success : p.inkMuted, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
              {thread.online && <Pulse color={p.success} />}
              {thread.online ? (lang === 'en' ? 'Online' : 'En línea') : (lang === 'en' ? 'Last seen 1h ago' : 'Visto hace 1h')}
            </div>
          </div>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, padding: '16px 16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {thread.messages.map((m, i) => {
          const mine = m.from === 'me';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '78%' }}>
                <div style={{
                  padding: '10px 14px',
                  background: mine ? p.ink : p.surface,
                  color: mine ? p.bg : p.ink,
                  borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: mine ? 0 : `0.5px solid ${p.line}`,
                  fontSize: 14, lineHeight: 1.45,
                }}>
                  {lang === 'en' ? m.en : m.es}
                </div>
                <div style={{ fontFamily: type.mono, fontSize: 9.5, color: p.inkMuted, marginTop: 4, textAlign: mine ? 'right' : 'left', letterSpacing: '0.04em' }}>{m.t}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggestions + Composer */}
      <div style={{ borderTop: `0.5px solid ${p.line}`, background: p.surface, padding: '10px 12px', paddingBottom: isIOS ? 28 : 16 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
          {(lang === 'en' ? thread.suggestions_en : thread.suggestions_es).map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{
              background: p.bg, border: `0.5px solid ${p.line}`, cursor: 'pointer',
              padding: '7px 12px', borderRadius: 99, whiteSpace: 'nowrap',
              fontFamily: type.body, fontSize: 12, fontWeight: 500, color: p.ink,
            }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 14px', background: p.bg, borderRadius: 22, border: `0.5px solid ${p.line}` }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(draft); }}
            placeholder={lang === 'en' ? 'Message…' : 'Mensaje…'}
            style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: type.body, fontSize: 14, color: p.ink, padding: '8px 0' }}
          />
          <button onClick={() => send(draft)} disabled={!draft.trim()} style={{
            border: 0, cursor: draft.trim() ? 'pointer' : 'not-allowed',
            width: 36, height: 36, borderRadius: 999,
            background: draft.trim() ? p.accent : p.line, color: p.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
