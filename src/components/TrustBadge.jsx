export default function TrustBadge({ kind, p, type, size = 'sm' }) {
  const cfg = {
    licensed: { label: 'Licensed', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>, c: p.success },
    verified: { label: 'Verified', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l2.5 2.6L18 3l1 3.5L22 8l-1.5 3.2L21 15l-3.2 1.5L17 20l-3.5-1L11 22l-2.5-2.6L5 21l-1-3.5L1 16l1.5-3.2L1 9l3.2-1.5L5 4l3.5 1z" /></svg>, c: p.accent },
    top: { label: 'Top rated', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7 7.5.5-5.5 5 1.5 7.5L12 18l-6.5 4 1.5-7.5-5.5-5L9 9z" /></svg>, c: p.accent },
    new: { label: 'New', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>, c: p.blush },
    fast: { label: 'Fast reply', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></svg>, c: p.accent },
  };
  const x = cfg[kind] || cfg.verified;
  const isBig = size === 'md';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: isBig ? '5px 9px' : '3px 7px',
      background: x.c + '18', color: x.c,
      borderRadius: 99, fontFamily: type.body,
      fontSize: isBig ? 11 : 9.5, fontWeight: 600, letterSpacing: '0.04em',
    }}>{x.icon} {x.label}</span>
  );
}
