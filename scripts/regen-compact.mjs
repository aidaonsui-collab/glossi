// Build a compact, batched staging SQL from the raw refresh (no bios) so it can
// be run through the Supabase MCP in a few calls. Emits batch files.
import fs from 'node:fs';
const CACHE = new URL('./.cache/', import.meta.url);
const raw = JSON.parse(fs.readFileSync(new URL('profiles-refresh.json', CACHE), 'utf8'));
const handles = fs.readFileSync(new URL('refresh-handles.txt', CACHE), 'utf8').split('\n').map(s => s.trim()).filter(Boolean);

const byHandle = new Map();
for (const p of raw) { const u = (p.username || '').toLowerCase(); if (u) byHandle.set(u, p); }

const sq = v => v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`;
const intOrNull = v => (v == null || Number.isNaN(Number(v))) ? 'NULL' : String(Math.trunc(Number(v)));
const bool = v => v ? 'TRUE' : 'FALSE';

const rows = [];
for (const h of handles) {
  const p = byHandle.get(h.toLowerCase());
  if (!p) continue;
  rows.push(`(${sq(h)}, ${intOrNull(p.followersCount)}, ${sq(p.fullName || null)}, ${sq(p.externalUrl || (p.externalUrls?.[0]?.url ?? null))}, ${bool(p.verified)}, ${bool(p.isBusinessAccount)})`);
}

const BATCH = 100;
const files = [];
// File 0: schema
fs.writeFileSync(new URL('stage_0_create.sql', CACHE),
  `DROP TABLE IF EXISTS _outreach_refresh;\nCREATE TABLE _outreach_refresh (ig_handle text PRIMARY KEY, followers int, full_name text, external_url text, verified bool, is_business bool);`);
files.push('stage_0_create.sql');
// Batch inserts
let n = 1;
for (let i = 0; i < rows.length; i += BATCH) {
  const chunk = rows.slice(i, i + BATCH);
  const fn = `stage_${n}_insert.sql`;
  fs.writeFileSync(new URL(fn, CACHE),
    `INSERT INTO _outreach_refresh (ig_handle, followers, full_name, external_url, verified, is_business) VALUES\n${chunk.join(',\n')};`);
  files.push(fn); n++;
}
for (const f of files) {
  const sz = fs.statSync(new URL(f, CACHE)).size;
  console.log(`${f}\t${sz} bytes`);
}
console.log(`\nrows staged: ${rows.length}`);
