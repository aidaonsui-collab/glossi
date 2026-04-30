// Glossi theme — palettes, type pairings, salon photos.
// Default surface uses Ink · Gold · Blush + DM Serif + Inter (the chosen system).

export const PALETTES = {
  ink_gold_blush: {
    name: 'Ink · Gold · Blush',
    bg: '#FAF7F2', surface: '#FFFFFF', surface2: '#F2EBDD',
    ink: '#1A1714', inkSoft: '#5C544B', inkMuted: '#9A9088',
    line: '#E9E2D6', accent: '#B8893E', accentSoft: '#F0DFC1',
    blush: '#E8B7A8', blushSoft: '#F8E2DA', success: '#3D7A4E',
  },
  terra: {
    name: 'Terracotta · Bone',
    bg: '#F5EFE6', surface: '#FFFFFF', surface2: '#EDE3D2',
    ink: '#1F1816', inkSoft: '#5C4B45', inkMuted: '#9A8B82',
    line: '#E8DDCD', accent: '#C25A3A', accentSoft: '#F4D9CB',
    blush: '#D89A7E', blushSoft: '#F2DDD0', success: '#3D7A4E',
  },
  midnight: {
    name: 'Midnight · Brass',
    bg: '#15161A', surface: '#1F2126', surface2: '#272A30',
    ink: '#F2EBE0', inkSoft: '#B5AEA2', inkMuted: '#7A7468',
    line: '#33363D', accent: '#D4A86A', accentSoft: '#3A3329',
    blush: '#C68A7F', blushSoft: '#3A2D29', success: '#7AB388',
  },
};

export const TYPES = {
  dmserif_inter: {
    name: 'DM Serif + Inter',
    display: '"DM Serif Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    displayWeight: 400,
    optical: '"opsz" 14',
  },
};

export const PHOTOS = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595476108010-b4d1f1d6e3f4?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=80&auto=format&fit=crop',
];

export const defaultPalette = PALETTES.ink_gold_blush;
export const defaultType = TYPES.dmserif_inter;
