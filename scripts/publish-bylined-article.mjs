// Pull a Bylined article by ID and run the full Glossi publishing chain:
//   1. Fetch the article body from Bylined's Supabase
//   2. Write a temp .md file (H1 title + body) the converter expects
//   3. Run add-bylined-article.mjs → appends entry to data.js + guideBodies.js
//   4. Run prerender-editorial.mjs → bakes the static /editorial/<id> page
//   5. Print the git commit/push command for the user to run
//
// USAGE
//   node scripts/publish-bylined-article.mjs <article-id> ["Author"] ["Role"]
//
// Author/role default to "Glossi" / "Editorial" inside the converter.
//
// ENV (add to ~/Desktop/glossi/.env.local):
//   BYLINED_SUPABASE_URL=https://boatyhrefcilcxepnbbf.supabase.co
//   BYLINED_SUPABASE_SERVICE_ROLE_KEY=<service role key>
//
// The script never runs `git` for you — it prints the suggested commit
// command so you can review the diff first.

import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// Load .env.local + .env if present (Node 20.6+ built-in; no dotenv dep).
for (const f of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(join(PROJECT_ROOT, f));
  } catch {
    // missing file is fine
  }
}

const BYLINED_URL =
  process.env.BYLINED_SUPABASE_URL || 'https://boatyhrefcilcxepnbbf.supabase.co';
const BYLINED_KEY = process.env.BYLINED_SUPABASE_SERVICE_ROLE_KEY;

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

const [, , articleId, authorArg, roleArg] = process.argv;
if (!articleId) {
  die('Usage: node scripts/publish-bylined-article.mjs <article-id> ["Author"] ["Role"]');
}
if (!BYLINED_KEY) {
  die(
    'BYLINED_SUPABASE_SERVICE_ROLE_KEY missing. Add it to ~/Desktop/glossi/.env.local.\n' +
      '  Get it from the Bylined Supabase dashboard → Settings → API → service_role key.'
  );
}

// ── 1. fetch the article from Bylined ────────────────────────────────

const url =
  `${BYLINED_URL.replace(/\/$/, '')}/rest/v1/articles` +
  `?id=eq.${encodeURIComponent(articleId)}` +
  `&select=id,title,body_markdown,status,keyword`;

console.log(`→ fetching article ${articleId}…`);

const res = await fetch(url, {
  headers: {
    apikey: BYLINED_KEY,
    Authorization: `Bearer ${BYLINED_KEY}`,
    Accept: 'application/json',
  },
});
if (!res.ok) {
  die(`Bylined fetch failed: ${res.status} ${res.statusText}\n${await res.text()}`);
}
const rows = await res.json();
if (!Array.isArray(rows) || rows.length === 0) {
  die(`No article found with id ${articleId}.`);
}
const article = rows[0];
if (!article.body_markdown || !article.body_markdown.trim()) {
  die(`Article ${articleId} has an empty body_markdown.`);
}

const title = article.title || article.keyword || 'Untitled';
console.log(`  • title: ${title}`);
console.log(`  • status: ${article.status}`);
console.log(`  • body: ${article.body_markdown.length} chars`);

// ── 2. write the temp .md file the converter expects ─────────────────

const tmp = await mkdtemp(join(tmpdir(), 'bylined-'));
const mdPath = join(tmp, `${articleId}.md`);
const mdBody = `# ${title}\n\n${article.body_markdown.trim()}\n`;
await writeFile(mdPath, mdBody, 'utf8');
console.log(`→ wrote ${mdPath}`);

// ── 3 + 4. run the converter, then the prerender ─────────────────────

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', cwd: PROJECT_ROOT });
    p.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))
    );
    p.on('error', reject);
  });
}

const converterArgs = ['scripts/add-bylined-article.mjs', mdPath];
if (authorArg) converterArgs.push(authorArg);
if (roleArg) converterArgs.push(roleArg);

try {
  console.log(`→ running add-bylined-article.mjs…`);
  await run('node', converterArgs);

  console.log(`→ running prerender-editorial.mjs…`);
  await run('node', ['scripts/prerender-editorial.mjs']);
} finally {
  // Clean up the temp file regardless of converter/prerender outcome.
  await rm(tmp, { recursive: true, force: true });
}

// ── 5. print the suggested commit command ────────────────────────────

const commitMsg = `add: ${title}`.replace(/"/g, '\\"');
console.log('');
console.log('✓ article added + prerendered. Review the diff, then:');
console.log('');
console.log(`  git add . && git commit -m "${commitMsg}" && git push`);
console.log('');
