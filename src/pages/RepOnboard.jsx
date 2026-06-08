// Rep-facing tool: generate a per-salon QR code that deep-links a salon owner
// into signup with their details pre-filled, so onboarding is half-done before
// they type anything. Renders the QR fully client-side (no third-party API —
// the salon's phone number is in the URL, so it must not leave the device).
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { ZIP_CENTROIDS } from '../lib/geocode.js';

const REF_PRESETS = [
  { id: 'canvass-mcallen', label: 'McAllen canvass' },
  { id: 'canvass-pharr', label: 'Pharr canvass' },
  { id: 'canvass-edinburg', label: 'Edinburg canvass' },
  { id: 'canvass-mission', label: 'Mission canvass' },
  { id: 'canvass-weslaco', label: 'Weslaco canvass' },
  { id: 'beauty-supply', label: 'Beauty-supply counter' },
  { id: 'event', label: 'Event / popup' },
  { id: 'referral', label: 'Salon referral' },
];

const ORIGIN = (typeof window !== 'undefined' && window.location.origin) || 'https://www.glossi.cc';

export default function RepOnboard() {
  const isPhone = useNarrow();
  const canvasWrapRef = useRef(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [ref, setRef] = useState(REF_PRESETS[0].id);
  const [copied, setCopied] = useState(false);

  // Auto-fill city when a known RGV ZIP is entered.
  const onZip = v => {
    const z = v.replace(/\D/g, '').slice(0, 5);
    setZip(z);
    if (z.length === 5 && ZIP_CENTROIDS[z] && !city) setCity(ZIP_CENTROIDS[z].city);
  };

  const url = useMemo(() => {
    const params = new URLSearchParams({ role: 'salon' });
    if (name.trim()) params.set('name', name.trim());
    if (address.trim()) params.set('address', address.trim());
    if (city.trim()) params.set('city', city.trim());
    if (zip.trim()) params.set('zip', zip.trim());
    if (phone.trim()) params.set('phone', phone.trim());
    if (instagram.trim()) params.set('ig', instagram.trim().replace(/^@/, ''));
    if (ref) params.set('ref', ref);
    return `${ORIGIN}/signup?${params.toString()}`;
  }, [name, address, city, zip, phone, instagram, ref]);

  const ready = name.trim().length >= 2;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked — the URL is shown below to copy manually */ }
  };

  const downloadPng = () => {
    const canvas = canvasWrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `glossi-qr-${(name.trim() || 'salon').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    a.click();
  };

  const inputStyle = {
    width: '100%', padding: '13px 15px', borderRadius: 11,
    border: `0.5px solid ${p.line}`, background: p.surface,
    fontFamily: type.body, fontSize: 15, color: p.ink, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 6, display: 'block' };

  return (
    <div style={{ background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: isPhone ? '18px' : '22px 48px', gap: 14, borderBottom: `0.5px solid ${p.line}` }}>
        <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, fontWeight: type.displayWeight, letterSpacing: '-0.02em', color: p.accent, textDecoration: 'none' }}>glossi</Link>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: p.inkMuted, border: `1px solid ${p.line}`, borderRadius: 99, padding: '3px 10px' }}>REP TOOL</span>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: isPhone ? '28px 18px 60px' : '48px 32px 80px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: p.accent }}>SALON ONBOARDING</div>
        <h1 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: isPhone ? 36 : 48, fontWeight: type.displayWeight, letterSpacing: '-0.03em', lineHeight: 1.0, margin: '10px 0 8px' }}>
          Pre-filled QR.
        </h1>
        <p style={{ fontSize: isPhone ? 14.5 : 16, color: p.inkSoft, lineHeight: 1.55, margin: 0, maxWidth: 560 }}>
          Type what you know about the salon, then have the owner scan. They land on signup with the salon already filled in — name, address, services area — so onboarding takes seconds.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 320px', gap: isPhone ? 28 : 40, marginTop: 32, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>SALON NAME *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Casa de Belleza" autoFocus style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>ADDRESS</label>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="1612 N Cage Blvd" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12 }}>
              <div>
                <label style={labelStyle}>CITY</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Pharr" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>ZIP</label>
                <input value={zip} onChange={e => onZip(e.target.value)} inputMode="numeric" placeholder="78577" style={{ ...inputStyle, fontFamily: type.mono, letterSpacing: '0.1em' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>PHONE</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" placeholder="(956) 555-0124" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>INSTAGRAM</label>
                <input value={instagram} onChange={e => setInstagram(e.target.value.replace(/^@/, ''))} placeholder="casadebelleza" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>SOURCE (for attribution)</label>
              <select value={ref} onChange={e => setRef(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                {REF_PRESETS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
          </div>

          {/* QR panel */}
          <div style={{ position: 'sticky', top: 24, background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 18, padding: 24, textAlign: 'center' }}>
            <div ref={canvasWrapRef} style={{
              background: '#fff', borderRadius: 14, padding: 16, display: 'inline-flex',
              opacity: ready ? 1 : 0.35, transition: 'opacity 0.2s',
            }}>
              <QRCodeCanvas value={url} size={224} level="M" includeMargin={false} fgColor="#1A1714" bgColor="#ffffff" />
            </div>
            <div style={{ fontSize: 12.5, color: p.inkSoft, marginTop: 14, lineHeight: 1.45, minHeight: 34 }}>
              {ready
                ? <>Have <strong style={{ color: p.ink }}>{name.trim()}</strong> scan this to claim their listing.</>
                : 'Enter a salon name to generate the code.'}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button onClick={copy} disabled={!ready} style={{
                flex: 1, padding: '11px 14px', borderRadius: 10, border: `0.5px solid ${p.line}`,
                background: p.bg, color: p.ink, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: ready ? 'pointer' : 'not-allowed', opacity: ready ? 1 : 0.5,
              }}>{copied ? 'Copied ✓' : 'Copy link'}</button>
              <button onClick={downloadPng} disabled={!ready} style={{
                flex: 1, padding: '11px 14px', borderRadius: 10, border: 0,
                background: p.ink, color: p.bg, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: ready ? 'pointer' : 'not-allowed', opacity: ready ? 1 : 0.5,
              }}>Download PNG</button>
            </div>
            <div style={{ marginTop: 14, fontFamily: type.mono, fontSize: 10, color: p.inkMuted, wordBreak: 'break-all', textAlign: 'left', lineHeight: 1.5 }}>
              {url}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
