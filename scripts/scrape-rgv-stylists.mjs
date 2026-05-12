// Scrape RGV beauty pros from Instagram hashtags via Apify.
// Usage: node --env-file=scripts/.env scripts/scrape-rgv-stylists.mjs
//
// Two-pass pipeline:
//   1. apify/instagram-hashtag-scraper — collect post owners across RGV beauty hashtags.
//   2. apify/instagram-profile-scraper — enrich each unique owner with bio, follower count, etc.
// Classifies service vertical + language + RGV-relevance, writes CSV.
//
// Intermediate JSON files cache each pass — re-runs skip work already done.
// Delete files in scripts/.cache/ to force a fresh pull.
//
// Cost estimate at current scope: 10 hashtags × 150 posts × $2.60/1k = ~$3.90,
// plus ~500 profile enrichments × $1.60/1k = ~$0.80. Total ~$4.70.

import fs from 'node:fs';

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.error('Missing APIFY_TOKEN. Run with: node --env-file=scripts/.env scripts/scrape-rgv-stylists.mjs');
  process.exit(1);
}

const HASHTAG_ACTOR = 'apify~instagram-hashtag-scraper';
const PROFILE_ACTOR = 'apify~instagram-profile-scraper';
const POSTS_PER_HASHTAG = 150;
const PROFILE_CHUNK = 50;

const CACHE_DIR = new URL('./.cache/', import.meta.url);
const POSTS_CACHE = new URL('posts.json', CACHE_DIR);
const PROFILES_CACHE = new URL('profiles.json', CACHE_DIR);
const OUTPUT_CSV = new URL('rgv-stylists.csv', import.meta.url);

// Incremental: re-runs only scrape hashtags not yet represented in the cache.
const HASHTAGS = [
  // Round 1: core RGV
  'rgvhair', 'rgvnails', 'rgvlashes', 'rgvbrows', 'rgvhairstylist',
  'mcallenstylist', 'mcallenhair', 'edinburghair', '956hair', 'brownsvillehair',
  // Round 2: city-specific services
  'mcallennails', 'mcallenlashes', 'mcallenbrows',
  'brownsvillenails', 'brownsvillestylist',
  'harlingenhair', 'pharrhair', 'missionhair', 'weslacohair', 'edinburgnails',
  // Round 2: barber (under-represented)
  'rgvbarber', 'mcallenbarber',
  // Round 2: community / 956
  '956beauty', '956nails', '956lashes', 'valleystylist', 'rgvsmallbusiness',
  // Round 2: Spanish-coded (low-confidence probe)
  'estilistasrgv', 'belleza956', 'salonesrgv',
];

const RGV_KEYWORDS = [
  '956', 'rgv', 'mcallen', 'edinburg', 'brownsville', 'harlingen',
  'pharr', 'mission tx', 'weslaco', 'san benito', 'san juan',
  'donna', 'rio grande', 'valley tx', 'rgvtx', 'rio hondo',
];

const SERVICE_KEYWORDS = {
  hair: ['stylist', 'hairstylist', 'colorist', 'balayage', 'highlights', 'cut ', 'blowout', 'extensions', 'hair', 'salon'],
  nails: ['nail', 'nails', 'mani', 'pedi', 'gel', 'acrylic', 'dip powder', 'nailtech', 'nail tech'],
  lashes: ['lash', 'lashes', 'lashtech', 'lash tech', 'classic lash', 'volume lash', 'hybrid lash'],
  brows: ['brow', 'brows', 'microblading', 'lamination', 'henna brow', 'browtech', 'browartist'],
  makeup: ['makeup', 'mua', 'glam', 'beat', 'makeupartist'],
  barber: ['barber', 'fade', 'taper', 'barbershop'],
  skin: ['esthetic', 'esthetician', 'facial', 'skincare', 'skin care'],
  wax: ['wax ', 'waxing', 'brazilian wax'],
};

const SPANISH_HINTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¡', '¿',
  ' bella', ' belleza', ' citas', ' agendar', ' reserva', ' estilista',
  ' mexicana', ' latina', ' chingona', ' hermosa', ' guapa', ' precios',
];

// ---------- Apify ----------

async function runActorSync(actor, input) {
  const url = `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Apify ${actor} ${res.status}: ${body.slice(0, 400)}`);
  }
  return res.json();
}

// ---------- Pass 1: hashtags ----------

async function scrapeHashtags() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const owners = new Map();
  const alreadyScraped = new Set();

  if (fs.existsSync(POSTS_CACHE)) {
    const existing = JSON.parse(fs.readFileSync(POSTS_CACHE, 'utf8'));
    for (const o of existing) {
      owners.set(o.username, { ...o, sourceHashtags: new Set(o.sourceHashtags) });
      for (const h of o.sourceHashtags) alreadyScraped.add(h);
    }
    console.log(`✓ Loaded ${owners.size} owners from cache (${alreadyScraped.size} hashtags already scraped)`);
  }

  const todo = HASHTAGS.filter((t) => !alreadyScraped.has(t));
  if (todo.length === 0) {
    console.log(`✓ All ${HASHTAGS.length} hashtags already cached — nothing new to fetch`);
    return [...owners.values()].map((o) => ({ ...o, sourceHashtags: [...o.sourceHashtags] }));
  }
  console.log(`Scraping ${todo.length} new hashtags`);

  for (const tag of todo) {
    process.stdout.write(`#${tag}…`);
    try {
      const items = await runActorSync(HASHTAG_ACTOR, {
        hashtags: [tag],
        resultsLimit: POSTS_PER_HASHTAG,
      });
      let newOwners = 0;
      for (const post of items) {
        const username = post.ownerUsername;
        if (!username) continue;
        if (!owners.has(username)) {
          owners.set(username, {
            username,
            fullName: post.ownerFullName || null,
            ownerId: post.ownerId || null,
            sourceHashtags: new Set(),
            samplePostUrl: post.url || null,
            sampleCaption: (post.caption || '').slice(0, 280),
            sampleLocation: post.locationName || null,
          });
          newOwners++;
        }
        owners.get(username).sourceHashtags.add(tag);
      }
      console.log(` ${items.length} posts, +${newOwners} new owners (running total ${owners.size})`);
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }
  }

  const arr = [...owners.values()].map((o) => ({
    ...o,
    sourceHashtags: [...o.sourceHashtags],
  }));
  fs.writeFileSync(POSTS_CACHE, JSON.stringify(arr, null, 2));
  console.log(`\n✓ ${arr.length} unique owners cached to ${POSTS_CACHE.pathname}`);
  return arr;
}

// ---------- Pass 2: profile enrichment ----------

async function scrapeProfiles(owners) {
  const existing = fs.existsSync(PROFILES_CACHE)
    ? JSON.parse(fs.readFileSync(PROFILES_CACHE, 'utf8'))
    : [];
  const known = new Set(existing.map((p) => p.username));

  const todo = owners.map((o) => o.username).filter((u) => !known.has(u));
  if (todo.length === 0) {
    console.log(`✓ All ${owners.length} profiles already enriched`);
    return existing;
  }
  console.log(`Enriching ${todo.length} new profiles (${known.size} already cached)`);

  const all = [...existing];
  for (let i = 0; i < todo.length; i += PROFILE_CHUNK) {
    const chunk = todo.slice(i, i + PROFILE_CHUNK);
    process.stdout.write(`profiles ${i + 1}-${i + chunk.length} of ${todo.length}…`);
    try {
      const items = await runActorSync(PROFILE_ACTOR, { usernames: chunk });
      all.push(...items);
      console.log(` got ${items.length}`);
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }
  }

  fs.writeFileSync(PROFILES_CACHE, JSON.stringify(all, null, 2));
  console.log(`✓ ${all.length} profiles cached to ${PROFILES_CACHE.pathname}`);
  return all;
}

// ---------- Classify ----------

function classifyService(bio) {
  const b = (bio || '').toLowerCase();
  const hits = [];
  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    if (keywords.some((k) => b.includes(k))) hits.push(service);
  }
  return hits.join('|');
}

function classifyLanguage(bio) {
  const b = (bio || '').toLowerCase();
  return SPANISH_HINTS.some((h) => b.includes(h)) ? 'es' : 'en';
}

function looksLikeRgv(profile, ownerSample) {
  const blob = `${profile.biography || ''} ${profile.fullName || ''} ${ownerSample?.sampleCaption || ''} ${ownerSample?.sampleLocation || ''}`.toLowerCase();
  return RGV_KEYWORDS.some((k) => blob.includes(k));
}

// ---------- CSV ----------

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v).replace(/\r?\n/g, ' ');
  if (/[",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(rows) {
  const cols = [
    'username', 'full_name', 'follower_count', 'bio',
    'service_guess', 'language_guess', 'rgv_match',
    'external_url', 'public_email', 'profile_url',
    'source_hashtags', 'sample_location', 'verified', 'is_business', 'business_category',
  ];
  const lines = [cols.join(',')];
  for (const r of rows) lines.push(cols.map((c) => csvEscape(r[c])).join(','));
  fs.writeFileSync(OUTPUT_CSV, lines.join('\n'));
  console.log(`✓ Wrote ${rows.length} rows to ${OUTPUT_CSV.pathname}`);
}

// ---------- Main ----------

async function main() {
  console.log(`Scraping ${HASHTAGS.length} hashtags × ${POSTS_PER_HASHTAG} posts each\n`);
  const owners = await scrapeHashtags();

  console.log(`\nEnriching ${owners.length} unique profiles\n`);
  const profiles = await scrapeProfiles(owners);

  const byUsername = new Map(profiles.map((p) => [p.username, p]));
  const rows = owners.map((o) => {
    const p = byUsername.get(o.username) || {};
    const bio = p.biography || '';
    return {
      username: o.username,
      full_name: p.fullName || o.fullName || '',
      follower_count: p.followersCount ?? '',
      bio,
      service_guess: classifyService(`${bio} ${o.sampleCaption || ''}`),
      language_guess: classifyLanguage(bio),
      rgv_match: looksLikeRgv(p, o) ? '1' : '',
      external_url: p.externalUrl || (p.externalUrls?.[0]?.url ?? ''),
      public_email: p.publicEmail || p.businessEmail || '',
      profile_url: `https://www.instagram.com/${o.username}/`,
      source_hashtags: o.sourceHashtags.join(';'),
      sample_location: o.sampleLocation || '',
      verified: p.verified ? '1' : '',
      is_business: p.isBusinessAccount ? '1' : '',
      business_category: p.businessCategoryName || '',
    };
  });

  rows.sort((a, b) => {
    if (a.rgv_match !== b.rgv_match) return b.rgv_match.localeCompare(a.rgv_match);
    return (Number(b.follower_count) || 0) - (Number(a.follower_count) || 0);
  });

  writeCsv(rows);

  console.log(`\n--- summary ---`);
  console.log(`Total unique handles: ${rows.length}`);
  console.log(`RGV-matched (bio/location mentions city/956/valley): ${rows.filter((r) => r.rgv_match).length}`);
  console.log(`Service-tagged: ${rows.filter((r) => r.service_guess).length}`);
  console.log(`Spanish-bio: ${rows.filter((r) => r.language_guess === 'es').length}`);
  console.log(`Verified or business account: ${rows.filter((r) => r.is_business || r.verified).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
