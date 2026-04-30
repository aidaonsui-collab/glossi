import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import SalonPhoto from './SalonPhoto.jsx';
import TrustBadge from './TrustBadge.jsx';
import { Stars } from '../ios/atoms.jsx';

// CartoDB "Positron" — clean light tiles that match the Glossi cream palette.
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '© <a href="https://openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>';

// Build a custom HTML pin marker. Visual = $price chip + accent dot.
function makePinIcon(price, selected) {
  const html = `
    <div class="glossi-pin ${selected ? 'glossi-pin--sel' : ''}">
      <div class="glossi-pin__chip">$${price}</div>
      <div class="glossi-pin__tail"></div>
      <div class="glossi-pin__dot"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: '',
    iconSize: [60, 48],
    iconAnchor: [30, 46],
  });
}

function FitBounds({ salons }) {
  const map = useMap();
  useMemo(() => {
    if (salons.length === 0) return;
    const bounds = L.latLngBounds(salons.map(s => [s.lat, s.lon]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
  }, [salons, map]);
  return null;
}

export default function ExploreMap({ salons, height = 540 }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(salons[0]?.id);
  const sel = salons.find(s => s.id === selected);

  return (
    <>
      {/* Pin styles — injected once */}
      <style>{`
        .leaflet-container { font-family: ${type.body}; background: ${p.surface2}; border-radius: 18px; }
        .leaflet-control-attribution { font-family: ${type.body}; font-size: 10px; background: rgba(255,255,255,0.85) !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px; }
        .glossi-pin { display: flex; flex-direction: column; align-items: center; transform: translateY(0); transition: transform 0.12s ease; cursor: pointer; }
        .glossi-pin__chip {
          background: ${p.surface}; color: ${p.ink};
          padding: 5px 11px; border-radius: 99;
          font-family: ${type.mono}; font-size: 12px; font-weight: 700;
          box-shadow: 0 4px 14px rgba(0,0,0,0.20);
          border: 0.5px solid ${p.line};
          white-space: nowrap;
        }
        .glossi-pin__tail {
          width: 0; height: 0;
          border-left: 5px solid transparent; border-right: 5px solid transparent;
          border-top: 7px solid ${p.line};
          margin-top: -1px;
        }
        .glossi-pin__dot {
          width: 10px; height: 10px; border-radius: 99px;
          background: ${p.ink};
          border: 2px solid ${p.surface};
          margin-top: -3px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
        }
        .glossi-pin--sel { transform: translateY(-3px) scale(1.08); z-index: 1000; }
        .glossi-pin--sel .glossi-pin__chip { background: ${p.ink}; color: ${p.bg}; border-color: ${p.ink}; }
        .glossi-pin--sel .glossi-pin__tail { border-top-color: ${p.ink}; }
        .glossi-pin--sel .glossi-pin__dot { background: ${p.accent}; }
      `}</style>

      <div style={{ position: 'relative', width: '100%', height, borderRadius: 18, overflow: 'hidden', border: `0.5px solid ${p.line}` }}>
        <MapContainer
          center={[26.22, -98.18]}
          zoom={11}
          scrollWheelZoom
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
          <FitBounds salons={salons} />
          {salons.map(s => (
            <Marker
              key={s.id}
              position={[s.lat, s.lon]}
              icon={makePinIcon(s.price, s.id === selected)}
              eventHandlers={{ click: () => setSelected(s.id) }}
            />
          ))}
        </MapContainer>

        {/* Detail card overlay */}
        {sel && (
          <button
            onClick={() => navigate(`/salon/${sel.id}`)}
            style={{
              position: 'absolute', left: 16, right: 16, bottom: 16,
              background: p.surface, borderRadius: 14, padding: 12,
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
              border: `0.5px solid ${p.line}`, cursor: 'pointer',
              textAlign: 'left', fontFamily: 'inherit', color: p.ink,
              zIndex: 1001, maxWidth: 480, margin: '0 auto',
            }}
          >
            <SalonPhoto mood={sel.mood} h={56} style={{ width: 56, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 17, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{sel.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: p.inkMuted, marginTop: 2 }}>
                <Stars n={sel.rating} color={p.accent} size={10} />
                <span style={{ color: p.ink, fontWeight: 600 }}>{sel.rating}</span>
                <span>·</span><span>{sel.neighborhood}</span><span>·</span>
                <span style={{ fontFamily: type.mono }}>{sel.distance} mi</span>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                {(sel.badges || []).slice(0, 2).map(b => <TrustBadge key={b} kind={b} p={p} type={type} />)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: type.mono, fontSize: 18, fontWeight: 700, color: p.ink, letterSpacing: '-0.02em' }}>${sel.price}</div>
              <div style={{ fontFamily: type.mono, fontSize: 10.5, color: p.inkMuted, textDecoration: 'line-through' }}>${sel.originalPrice}</div>
            </div>
          </button>
        )}
      </div>
    </>
  );
}
