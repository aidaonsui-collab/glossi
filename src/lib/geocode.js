// Static ZIP → lat/lng lookup for the four Texas launch markets.
// Used to translate a customer's ZIP into geography(point) coordinates
// for quote_requests.search_location and search_businesses RPC calls.
//
// Two lookup paths:
//   - ZIP_CENTROIDS[zip] — exact hit for the biggest metro ZIPs
//   - 3-digit prefix fallback that lands inside the right metro
//
// Returns null if the ZIP is outside our launch markets.

export const ZIP_CENTROIDS = {
  // -- Dallas / Fort Worth --
  '75201': { lat: 32.7831, lng: -96.8067, city: 'Dallas',      metro: 'Dallas' },
  '75202': { lat: 32.7795, lng: -96.8072, city: 'Dallas',      metro: 'Dallas' },
  '75204': { lat: 32.7989, lng: -96.7879, city: 'Dallas',      metro: 'Dallas' },
  '75206': { lat: 32.8310, lng: -96.7700, city: 'Dallas',      metro: 'Dallas' },
  '75219': { lat: 32.8140, lng: -96.8140, city: 'Dallas',      metro: 'Dallas' },
  '75225': { lat: 32.8685, lng: -96.7890, city: 'Dallas',      metro: 'Dallas' },
  '76102': { lat: 32.7555, lng: -97.3308, city: 'Fort Worth',  metro: 'Dallas' },

  // -- Austin --
  '78701': { lat: 30.2711, lng: -97.7437, city: 'Austin',      metro: 'Austin' },
  '78702': { lat: 30.2628, lng: -97.7160, city: 'Austin',      metro: 'Austin' },
  '78703': { lat: 30.2970, lng: -97.7650, city: 'Austin',      metro: 'Austin' },
  '78704': { lat: 30.2423, lng: -97.7660, city: 'Austin',      metro: 'Austin' },
  '78705': { lat: 30.2950, lng: -97.7400, city: 'Austin',      metro: 'Austin' },

  // -- San Antonio --
  '78205': { lat: 29.4253, lng: -98.4861, city: 'San Antonio', metro: 'San Antonio' },
  '78209': { lat: 29.4720, lng: -98.4660, city: 'San Antonio', metro: 'San Antonio' },
  '78212': { lat: 29.4580, lng: -98.5040, city: 'San Antonio', metro: 'San Antonio' },
  '78215': { lat: 29.4380, lng: -98.4760, city: 'San Antonio', metro: 'San Antonio' },
  '78232': { lat: 29.5670, lng: -98.4810, city: 'San Antonio', metro: 'San Antonio' },

  // -- Rio Grande Valley --
  '78501': { lat: 26.2034, lng: -98.2300, city: 'McAllen',     metro: 'Rio Grande Valley' },
  '78503': { lat: 26.1960, lng: -98.2170, city: 'McAllen',     metro: 'Rio Grande Valley' },
  '78504': { lat: 26.2870, lng: -98.2210, city: 'McAllen',     metro: 'Rio Grande Valley' },
  '78520': { lat: 25.9070, lng: -97.4880, city: 'Brownsville', metro: 'Rio Grande Valley' },
  '78539': { lat: 26.2740, lng: -98.1620, city: 'Edinburg',    metro: 'Rio Grande Valley' },
  '78577': { lat: 26.1948, lng: -98.1836, city: 'Pharr',       metro: 'Rio Grande Valley' },
  '78596': { lat: 26.1700, lng: -97.9900, city: 'Weslaco',     metro: 'Rio Grande Valley' },
};

const METRO_FALLBACKS = {
  '750': { lat: 32.7767, lng: -96.7970, city: 'Dallas',      metro: 'Dallas' },
  '751': { lat: 32.7767, lng: -96.7970, city: 'Dallas',      metro: 'Dallas' },
  '752': { lat: 32.7767, lng: -96.7970, city: 'Dallas',      metro: 'Dallas' },
  '761': { lat: 32.7555, lng: -97.3308, city: 'Fort Worth',  metro: 'Dallas' },
  '787': { lat: 30.2672, lng: -97.7431, city: 'Austin',      metro: 'Austin' },
  '786': { lat: 30.2672, lng: -97.7431, city: 'Austin',      metro: 'Austin' },
  '782': { lat: 29.4241, lng: -98.4936, city: 'San Antonio', metro: 'San Antonio' },
  '781': { lat: 29.4241, lng: -98.4936, city: 'San Antonio', metro: 'San Antonio' },
  '785': { lat: 26.2034, lng: -98.2300, city: 'McAllen',     metro: 'Rio Grande Valley' },
};

export function geocodeZip(zip) {
  if (!/^\d{5}$/.test(zip)) return null;
  const exact = ZIP_CENTROIDS[zip];
  if (exact) return exact;
  return METRO_FALLBACKS[zip.slice(0, 3)] ?? null;
}
