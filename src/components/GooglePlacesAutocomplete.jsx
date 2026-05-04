import { useEffect, useRef, useState } from 'react';

// Single Google Maps JS loader — multiple <GooglePlacesAutocomplete /> mounts
// share one <script> tag and one in-flight promise.
const SCRIPT_ID = 'glossi-google-maps-places';
const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// True when VITE_GOOGLE_MAPS_API_KEY is wired up — callers can use this
// to skip rendering the entire "Find your business" section in environments
// where Places isn't available (e.g. local dev without a key).
export const isGooglePlacesAvailable = Boolean(KEY);

let loadPromise = null;
function loadGoogleMaps() {
  if (!KEY) return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY not set'));
  if (window.google?.maps?.places) return Promise.resolve(window.google);
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const cbName = '__glossiInitGmaps';
    window[cbName] = () => resolve(window.google);
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&libraries=places&v=weekly&loading=async&callback=${cbName}`;
    s.onerror = () => { loadPromise = null; reject(new Error('Failed to load Google Maps JS')); };
    document.head.appendChild(s);
  });
  return loadPromise;
}

// Wraps a regular <input> with Google Places autocomplete restricted to
// businesses ("establishment"). Calls onSelect(place) once the user picks
// a result; place has { name, formattedAddress, addressComponents,
// formattedPhoneNumber, website, photos, openingHours, rating }.
//
// Renders nothing if VITE_GOOGLE_MAPS_API_KEY is missing — onboarding
// gracefully falls back to the manual form below.
export default function GooglePlacesAutocomplete({ onSelect, placeholder, style, biasBounds }) {
  const inputRef = useRef(null);
  const acRef = useRef(null);
  const [keyMissing] = useState(!KEY);

  useEffect(() => {
    if (!KEY || !inputRef.current) return;
    let mounted = true;
    loadGoogleMaps()
      .then(google => {
        if (!mounted || !inputRef.current) return;
        acRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['establishment'],
          fields: ['name', 'formatted_address', 'address_components', 'formatted_phone_number', 'website', 'photos', 'opening_hours', 'rating', 'user_ratings_total'],
          ...(biasBounds && {
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(biasBounds.sw.lat, biasBounds.sw.lng),
              new google.maps.LatLng(biasBounds.ne.lat, biasBounds.ne.lng),
            ),
          }),
        });
        acRef.current.addListener('place_changed', () => {
          const place = acRef.current.getPlace();
          if (!place || !place.name) return;
          onSelect?.(place);
        });
      })
      .catch(err => {
        // Fail quietly — manual form below still works.
        console.warn('[GooglePlacesAutocomplete]', err.message);
      });

    return () => {
      mounted = false;
      if (acRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(acRef.current);
      }
    };
  }, []);

  if (keyMissing) return null;
  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder || 'Search your business name…'}
      style={style}
      autoComplete="off"
    />
  );
}
