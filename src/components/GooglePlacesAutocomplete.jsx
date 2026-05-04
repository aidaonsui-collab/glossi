import { useEffect, useRef } from 'react';

// Google Maps JavaScript API loader. Single shared <script> + promise so
// remounting the component (or mounting it twice) doesn't pull the SDK
// down twice. We use the modern `loading=async` + `importLibrary` flow,
// since the legacy `google.maps.places.Autocomplete` is unavailable to
// Cloud projects created after March 1, 2025 — Google requires the new
// PlaceAutocompleteElement web component instead.
const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const isGooglePlacesAvailable = Boolean(KEY);

const SCRIPT_ID = 'glossi-google-maps-places';
let loadPromise = null;
function loadGoogleMaps() {
  if (!KEY) return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY not set'));
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google);
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const cbName = '__glossiInitGmaps';
    window[cbName] = () => resolve(window.google);
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&v=weekly&loading=async&callback=${cbName}`;
    s.onerror = () => { loadPromise = null; reject(new Error('Failed to load Google Maps JS')); };
    document.head.appendChild(s);
  });
  return loadPromise;
}

// Mounts a <gmp-place-autocomplete> web component inside a wrapper div.
// The element is self-styled by Google and lives in shadow DOM, so our
// `inputStyle` doesn't apply directly — but it sits inside the dashed
// "FIND YOUR BUSINESS" card and reads as its own search affordance.
//
// Calls `onSelect(place)` once the user picks a result. The `place`
// arrives with the new schema: { displayName, formattedAddress,
// addressComponents: [{ longText, shortText, types }],
// nationalPhoneNumber, websiteURI, photos: [{ getURI() }] }.
//
// Renders nothing if VITE_GOOGLE_MAPS_API_KEY is missing.
export default function GooglePlacesAutocomplete({ onSelect, placeholder, biasBounds }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!KEY || !containerRef.current) return;
    let cancelled = false;
    let element = null;
    let removeListener = null;

    (async () => {
      let google;
      try { google = await loadGoogleMaps(); }
      catch (err) { console.warn('[GooglePlacesAutocomplete] load failed:', err.message); return; }
      if (cancelled || !containerRef.current) return;

      try {
        const { PlaceAutocompleteElement } = await google.maps.importLibrary('places');
        if (cancelled || !containerRef.current) return;

        const config = { includedRegionCodes: ['us'] };
        if (biasBounds) {
          const { LatLng, LatLngBounds } = await google.maps.importLibrary('core');
          config.locationBias = new LatLngBounds(
            new LatLng(biasBounds.sw.lat, biasBounds.sw.lng),
            new LatLng(biasBounds.ne.lat, biasBounds.ne.lng),
          );
        }

        element = new PlaceAutocompleteElement(config);
        if (placeholder) {
          // Both spellings exist across versions — set both to be safe.
          try { element.setAttribute('placeholder', placeholder); } catch { /* noop */ }
          try { element.placeholder = placeholder; } catch { /* noop */ }
        }
        // Stretch to the wrapper so it lines up with the form fields.
        element.style.width = '100%';

        const handler = async event => {
          try {
            const placePrediction = event.placePrediction;
            if (!placePrediction) return;
            const place = placePrediction.toPlace();
            await place.fetchFields({
              fields: [
                'displayName', 'formattedAddress', 'addressComponents',
                'nationalPhoneNumber', 'websiteURI', 'photos',
              ],
            });
            onSelect?.(place);
          } catch (err) {
            console.warn('[GooglePlacesAutocomplete] fetchFields failed:', err.message);
          }
        };
        element.addEventListener('gmp-select', handler);
        removeListener = () => element.removeEventListener('gmp-select', handler);

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(element);
      } catch (err) {
        console.warn('[GooglePlacesAutocomplete] mount failed:', err.message);
      }
    })();

    return () => {
      cancelled = true;
      if (removeListener) removeListener();
      if (element && element.parentNode) element.parentNode.removeChild(element);
    };
  }, []);

  if (!KEY) return null;
  return <div ref={containerRef} style={{ width: '100%' }} />;
}
