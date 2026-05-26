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

// Slots 0-7 are the legacy "salon mood" pool used by salon listings,
// review tiles, and the welcome hero. Don't reorder — `mood: N` in data.js
// references these positions.
//
// Slots 8-31 are the editorial pool. add-bylined-article.mjs reserves
// these for guide hero photos so every new editorial gets a unique image
// instead of cycling back into the salon pool. Add new photos to the end,
// don't insert in the middle.
export const PHOTOS = [
  // ── salon pool (0-7) ──
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=80&auto=format&fit=crop',
  // ── editorial pool (8-31) ──
  'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1637777269327-c4d5c7944d7b?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1690749138086-7422f71dc159?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1619607146034-5a05296c8f9a?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1610992015762-45dca7fa3a85?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1658492055212-e1acbccfca5a?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1652869122685-c7792ef56ee2?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1634449862841-8c6e970117e5?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599206676335-193c82b13c9e?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605980766335-d3a41c7332a1?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605980625600-88b46abafa8d?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497433550656-7fb185be365e?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533661338746-e4e47d30dfd8?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80&auto=format&fit=crop',
];

// Where the editorial pool starts. add-bylined-article.mjs picks moods
// from PHOTOS[EDITORIAL_POOL_START..PHOTOS.length-1] so guides don't
// cycle into the salon photos used elsewhere.
export const EDITORIAL_POOL_START = 8;

export const defaultPalette = PALETTES.ink_gold_blush;
export const defaultType = TYPES.dmserif_inter;
