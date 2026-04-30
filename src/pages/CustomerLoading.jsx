import { Link, useNavigate } from 'react-router-dom';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { useToast } from '../components/Toast.jsx';

const sk = (w, h, r = 8) => (
  <div style={{
    width: w, height: h, borderRadius: r,
    background: `linear-gradient(90deg, ${p.surface2} 0%, ${p.line} 50%, ${p.surface2} 100%)`,
    backgroundSize: '200% 100%', animation: 'glossiShimmer 1.4s ease-in-out infinite',
  }} />
);

export default function CustomerLoading() {
  const isPhone = useNarrow();
  const navigate = useNavigate();
  const toast = useToast();
  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body, padding: isPhone ? '24px 18px' : '40px 64px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: 24, fontSize: 12, color: p.inkMuted, textDecoration: 'none', letterSpacing: '0.18em', fontWeight: 700 }}>← GLOSSI</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: p.accent, letterSpacing: '0.18em', flexWrap: 'wrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: p.accent, animation: 'glossiPulse 1.2s infinite' }} />
        <span>WAITING FOR BIDS · 4 SALONS NOTIFIED</span>
        <span style={{ flex: 1 }} />
        <button onClick={() => { toast('Pinged the 4 salons — refreshed.'); }} style={{ background: 'transparent', border: `0.5px solid ${p.line}`, padding: '6px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600, color: p.ink, cursor: 'pointer', letterSpacing: '0.05em', fontFamily: 'inherit' }}>Refresh</button>
        <button onClick={() => { toast('Showing your bids.', { tone: 'success' }); navigate('/quotes'); }} style={{ background: p.ink, color: p.bg, border: 0, padding: '6px 14px', borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', fontFamily: 'inherit' }}>See bids →</button>
        <button onClick={() => { if (window.confirm('Cancel this request? Salons will stop sending bids.')) { toast('Request cancelled.'); navigate('/quotes/empty'); } }} style={{ background: 'transparent', border: 0, padding: '6px 8px', fontSize: 11, fontWeight: 600, color: p.inkMuted, cursor: 'pointer', letterSpacing: '0.05em', fontFamily: 'inherit' }}>Cancel</button>
      </div>
      <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 32 : 52, fontWeight: type.displayWeight, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>Color & balayage · ~$110</h1>
      <div style={{ marginTop: 6, fontSize: 13, color: p.inkSoft }}>Posted 2 minutes ago · Pharr, TX</div>
      <div style={{ marginTop: isPhone ? 22 : 30, display: 'grid', gap: isPhone ? 12 : 14, gridTemplateColumns: isPhone ? '1fr' : 'repeat(2,1fr)' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ padding: '16px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, display: 'flex', gap: 12 }}>
            {sk(72, 72, 12)}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
              {sk('60%', 14)}
              {sk('40%', 12)}
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>{sk(50, 18, 99)}{sk(60, 18, 99)}</div>
              {sk('30%', 22)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
