import { Component } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';

// Top-level error boundary so a render-time crash on any page shows
// a usable message instead of blanking the whole app. Picks up the
// error from componentDidCatch and shows it with a reload button —
// way better than the silent white screen we used to get.
export default class ErrorBoundary extends Component {
  state = { error: null, info: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log to console so the devtools captures it. When we add Sentry
    // or Logflare this is the place to forward to it.
    console.error('App-level error caught:', error, info);
    this.setState({ info });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div style={{
        minHeight: '100vh', background: p.bg, color: p.ink,
        fontFamily: type.body, padding: '64px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>SOMETHING BROKE</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36, fontWeight: type.displayWeight, letterSpacing: '-0.025em', margin: 0, textAlign: 'center', maxWidth: 560 }}>
          The page didn't render.
        </h1>
        <p style={{ fontSize: 14, color: p.inkSoft, lineHeight: 1.55, maxWidth: 480, textAlign: 'center', margin: 0 }}>
          We caught this so you don't see a blank screen. Try reloading. If it keeps happening, send the error message below to support.
        </p>
        <pre style={{
          maxWidth: '100%', overflow: 'auto', padding: '14px 18px',
          background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 12,
          fontSize: 12, fontFamily: type.mono, color: p.ink,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>{String(error?.message || error || 'Unknown error')}</pre>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.location.reload()} style={{
            background: p.ink, color: p.bg, border: 0,
            padding: '12px 22px', borderRadius: 99,
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>Reload</button>
          <button onClick={() => { window.location.href = '/'; }} style={{
            background: 'transparent', color: p.ink, border: `0.5px solid ${p.line}`,
            padding: '12px 22px', borderRadius: 99,
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>Go home</button>
        </div>
      </div>
    );
  }
}
