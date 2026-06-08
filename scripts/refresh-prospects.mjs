// Refresh the 280 outreach_prospects with FRESH Instagram profile data.
// Unlike scrape-rgv-stylists.mjs, this does NOT skip cached handles — it
// force-pulls current data for every handle in .cache/refresh-handles.txt so
// we catch follower changes, bio edits, new links/emails, and dead accounts.
//
// Usage: node --env-file=scripts/.env scripts/refresh-prospects.mjs
//
// Outputs:
//   .cache/profiles-refresh.json  — raw Apify results
//   .cache/refresh-stage.sql      — staging table (_outreach_refresh) to diff + apply via MCP
//
// Cost: ~280 profiles × $1.60/1k ≈ $0.45.

import fs from 'node:fs';

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) { console.error('Missing APIFY_TOKEN'); process.exit(1); }

const PROFILE_ACTOR = 'apify~instagram-profile-scraper';
const CHUNK = 50;
const CACHE = new URL('./.cache/', import.meta.url);
const HANDLES_FILE = new URL('refresh-handles.txt', CACHE);
const RAW_OUT = new URL('profiles-refresh.json', CACHE);
const SQL_OUT = new URL('refresh-stage.sql', CACHE);

const handles = fs.readFileSync(HANDLES_FILE, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
console.log(`Refreshing ${handles.length} handles in chunks of ${CHUNK}\n`);

async function runActorSync(actor, input) {
  const url = `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
  if (!res.ok) throw new Error(`Apify ${actor} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const sq = v => v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`;
const bool = v => v ? 'TRUE' : 'FALSE';
const intOrNull = v => (v == null || Number.isNaN(Number(v))) ? 'NULL' : String(Math.trunc(Number(v)));

const all = [];
for (let i = 0; i < handles.length; i += CHUNK) {
  const chunk = handles.slice(i, i + CHUNK);
  process.stdout.write(`profiles ${i + 1}-${i + chunk.length} of ${handles.length}… `);
  try {
    const items = await runActorSync(PROFILE_ACTOR, { usernames: chunk });
    all.push(...items);
    console.log(`got ${items.length}`);
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
  }
}

fs.writeFileSync(RAW_OUT, JSON.stringify(all, null, 2));

// Normalize, keyed by lowercased username
const byHandle = new Map();
for (const p of all) {
  const u = (p.username || '').toLowerCase();
  if (u) byHandle.set(u, p);
}

const rows = [];
const notFound = [];
for (const h of handles) {
  const p = byHandle.get(h.toLowerCase());
  if (!p) { notFound.push(h); continue; }
  rows.push({
    handle: h,
    followers: p.followersCount ?? null,
    full_name: p.fullName || null,
    bio: p.biography || null,
    external_url: p.externalUrl || (p.externalUrls?.[0]?.url ?? null),
    email: p.publicEmail || p.businessEmail || null,
    verified: !!p.verified,
    is_business: !!p.isBusinessAccount,
  });
}

// Build staging SQL
const lines = [];
lines.push('DROP TABLE IF EXISTS _outreach_refresh;');
lines.push(`CREATE TABLE _outreach_refresh (
  ig_handle text PRIMARY KEY, followers int, full_name text, bio text,
  external_url text, email text, verified bool, is_business bool
);`);
if (rows.length) {
  lines.push('INSERT INTO _outreach_refresh (ig_handle, followers, full_name, bio, external_url, email, verified, is_business) VALUES');
  lines.push(rows.map(r =>
    `(${sq(r.handle)}, ${intOrNull(r.followers)}, ${sq(r.full_name)}, ${sq(r.bio)}, ${sq(r.external_url)}, ${sq(r.email)}, ${bool(r.verified)}, ${bool(r.is_business)})`
  ).join(',\n') + ';');
}
lines.push('');
lines.push('-- Handles Apify returned no profile for (dead / renamed / private / banned):');
lines.push(notFound.length ? `-- ${notFound.join(', ')}` : '-- (none)');
fs.writeFileSync(SQL_OUT, lines.join('\n'));

console.log(`\n--- refresh summary ---`);
console.log(`Requested:     ${handles.length}`);
console.log(`Fresh profiles: ${rows.length}`);
console.log(`Not returned:   ${notFound.length}${notFound.length ? ' → ' + notFound.join(', ') : ''}`);
console.log(`Now-verified:   ${rows.filter(r => r.verified).length}`);
console.log(`Business accts:  ${rows.filter(r => r.is_business).length}`);
console.log(`With email:     ${rows.filter(r => r.email).length}`);
console.log(`\nWrote ${SQL_OUT.pathname}`);
