// Convert a Bylined article into a Glossi editorial entry.
//
// Bylined generates articles as Markdown. Glossi's editorial reader
// (src/pages/Article.jsx) consumes a structured `sections` array out
// of src/ios/data.js (GUIDES) + src/ios/guideBodies.js (GUIDE_BODIES).
// This script parses the Markdown into that structure and appends one
// entry to each file. Then: commit -> Vercel build -> the prerender
// step bakes it into a crawlable /editorial/<id> page.
//
// USAGE
//   node scripts/add-bylined-article.mjs <article.md> ["Author"] ["Role"]
//
// The .md file: first line is the title as an H1 (`# ...`), then paste
// the Bylined article body below it. Example:
//
//   # How much does balayage cost in McAllen?
//
//   Balayage in McAllen runs $160-220 at the fair-price band...
//
//   **Key takeaways:**
//   - ...
//
//   ## What drives the price?
//   ...
//
// NOTES
// - English only. Glossi's reader is bilingual; Bylined output is not,
//   so the Spanish entry is filled with the English text as a fallback
//   (a Spanish reader sees English, which beats an "article not found").
//   Translate the `es` block by hand later if you want.
// - Appended entries use JSON-style quoted keys. That's valid JS and
//   coexists fine with the hand-authored entries above them.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import { GUIDES } from '../src/ios/data.js';
import { PHOTOS, EDITORIAL_POOL_START } from '../src/theme.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'src', 'ios', 'data.js');
const BODIES_FILE = join(__dirname, '..', 'src', 'ios', 'guideBodies.js');

// ── markdown helpers ────────────────────────────────────────────────

// Strip inline Markdown to plain text — the Glossi reader renders plain
// strings, not Markdown. Bold, links, inline code, footnote markers.
function stripInline(s) {
  return String(s)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[\^[^\]]*\]/g, '') // [^1] citation/footnote markers
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // [text](url) -> text
    .replace(/`([^`]+)`/g, '$1') // `code` -> code
    .replace(/\*\*([^*]+)\*\*/g, '$1') // **bold** -> bold
    .replace(/__([^_]+)__/g, '$1') // __bold__ -> bold
    .replace(/\s+/g, ' ')
    .trim();
}

const isBullet = (l) => /^\s*([-*]|\d+\.)\s+/.test(l);
const bulletText = (l) => l.replace(/^\s*([-*]|\d+\.)\s+/, '');
const isKeyTakeaways = (l) =>
  stripInline(l).replace(/[:]/g, '').trim().toLowerCase() === 'key takeaways';

// Parse a Bylined Markdown body into { title, dek, sections }.
function parseArticle(md) {
  const rawLines = md.replace(/\r\n/g, '\n').split('\n');

  // Title = first H1.
  let title = null;
  const lines = [];
  for (const line of rawLines) {
    if (title === null && /^#\s+/.test(line)) {
      title = stripInline(line.replace(/^#\s+/, ''));
      continue;
    }
    lines.push(line);
  }
  if (!title) {
    throw new Error(
      'No title found. The first line of the .md file must be "# Your Title".'
    );
  }

  let dek = '';
  let dekDone = false;
  const sections = [];

  let para = []; // buffered paragraph lines
  let bullets = []; // buffered bullet items
  let tableRows = []; // buffered markdown table rows
  let pendingHeading = null; // heading awaiting its first content block
  let pendingQuestion = null; // FAQ question awaiting its answer
  let faqMode = false;

  const flushPara = () => {
    const text = stripInline(para.join(' '));
    para = [];
    if (!text) return;
    if (!dekDone) {
      dek = text;
      dekDone = true;
      return;
    }
    if (faqMode && pendingQuestion) {
      sections.push({ q: pendingQuestion, a: text });
      pendingQuestion = null;
      return;
    }
    if (pendingHeading) {
      sections.push({ h: pendingHeading, p: text });
      pendingHeading = null;
    } else {
      sections.push({ p: text });
    }
  };

  const flushBullets = () => {
    const items = bullets.map((b) => stripInline(b)).filter(Boolean);
    bullets = [];
    if (!items.length) return;
    if (pendingHeading) {
      sections.push({ h: pendingHeading, bullets: items });
      pendingHeading = null;
    } else {
      sections.push({ bullets: items });
    }
  };

  // A markdown table. A 2-column table is term/definition pairs and maps
  // cleanly onto Glossi's `list` type (same shape as guide #0's word
  // list); 3+ columns map onto the `table` type.
  const flushTable = () => {
    if (!tableRows.length) return;
    const parsed = tableRows
      .map((line) =>
        line
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => stripInline(c.trim())),
      )
      // drop the |---|---| separator row
      .filter((cells) => !cells.every((c) => /^:?-+:?$/.test(c)));
    tableRows = [];
    if (!parsed.length) return;
    const cols = Math.max(...parsed.map((r) => r.length));
    const section =
      cols === 2
        ? { list: parsed.slice(1).map((r) => [r[0] ?? '', r[1] ?? '']) }
        : { table: parsed };
    if (pendingHeading) {
      section.h = pendingHeading;
      pendingHeading = null;
    }
    sections.push(section);
  };

  const flushBlocks = () => {
    flushPara();
    flushBullets();
    flushTable();
  };

  // Emit a heading that never got attached to a content block (e.g. an
  // H2 immediately followed by another heading, like an FAQ title).
  const flushHeading = () => {
    if (pendingHeading) {
      sections.push({ h: pendingHeading });
      pendingHeading = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushBlocks();
      continue;
    }

    // "**Key takeaways:**" — a bold lead-in line, not a heading.
    if (isKeyTakeaways(trimmed)) {
      flushBlocks();
      flushHeading();
      pendingHeading = 'Key takeaways';
      continue;
    }

    // H2 (## ...) — top-level section. FAQ section flips faqMode on.
    if (/^##\s+/.test(trimmed) && !/^###/.test(trimmed)) {
      flushBlocks();
      flushHeading();
      pendingQuestion = null;
      const text = stripInline(trimmed.replace(/^#+\s+/, ''));
      faqMode = /frequently asked questions|^faqs?$/i.test(text);
      pendingHeading = text;
      continue;
    }

    // H3 (### ...) — a question inside the FAQ, or a sub-heading.
    if (/^###\s+/.test(trimmed)) {
      flushBlocks();
      flushHeading();
      const text = stripInline(trimmed.replace(/^#+\s+/, ''));
      if (faqMode) {
        pendingQuestion = text;
      } else {
        pendingHeading = text;
      }
      continue;
    }

    // A stray H1 mid-body — treat as an H2.
    if (/^#\s+/.test(trimmed)) {
      flushBlocks();
      flushHeading();
      pendingHeading = stripInline(trimmed.replace(/^#+\s+/, ''));
      continue;
    }

    // Blockquote -> pull quote.
    if (/^>\s?/.test(trimmed)) {
      flushBlocks();
      sections.push({ pull: stripInline(trimmed.replace(/^>\s?/, '')) });
      continue;
    }

    // Markdown table row ( | col | col | ).
    if (/^\|.*\|$/.test(trimmed)) {
      flushPara();
      flushBullets();
      tableRows.push(trimmed);
      continue;
    }

    // Bullet / numbered list item.
    if (isBullet(trimmed)) {
      flushPara();
      flushTable();
      bullets.push(bulletText(trimmed));
      continue;
    }

    // Otherwise: paragraph text.
    flushBullets();
    flushTable();
    para.push(trimmed);
  }
  flushBlocks();
  flushHeading();

  return { title, dek, sections };
}

// ── file-append helpers ─────────────────────────────────────────────

// Indent every line of `text` by `n` spaces.
const indent = (text, n) =>
  text
    .split('\n')
    .map((l) => ' '.repeat(n) + l)
    .join('\n');

// Insert `entry` as the last element before `closer` (e.g. "\n];" or
// "\n};"), adding a separating comma only if the preceding element
// doesn't already end with one.
function appendBefore(src, startMarker, closer, entry) {
  const start = src.indexOf(startMarker);
  if (start === -1) throw new Error(`Could not find "${startMarker}".`);
  const end = src.indexOf(closer, start);
  if (end === -1) throw new Error(`Could not find closing "${closer}".`);
  const before = src.slice(0, end);
  const sep = before.trimEnd().endsWith(',') ? '\n' : ',\n';
  return before + sep + entry + src.slice(end);
}

// ── run ─────────────────────────────────────────────────────────────

async function main() {
  const [, , mdPath, authorArg, roleArg] = process.argv;
  if (!mdPath) {
    console.error(
      'Usage: node scripts/add-bylined-article.mjs <article.md> ["Author"] ["Role"]'
    );
    process.exit(1);
  }
  const author = authorArg || 'The Glossi Editors';
  const authorRole = roleArg || 'Rio Grande Valley, TX';

  const md = await readFile(resolve(mdPath), 'utf8');
  const { title, dek, sections } = parseArticle(md);

  if (!sections.length) {
    throw new Error('Parsed 0 sections — is the .md file empty below the title?');
  }
  if (!dek) {
    console.warn(
      '[warn] No opening paragraph found for the dek — using the title as a fallback.'
    );
  }

  // Reading time from total word count (~200 wpm).
  const words = (
    dek +
    ' ' +
    sections
      .map((s) => [s.p, s.a, s.q, ...(s.bullets || []), s.pull].filter(Boolean).join(' '))
      .join(' ')
  )
    .split(/\s+/)
    .filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));

  // Pick the next unused photo from the editorial pool so each guide gets
  // its own hero. Falls back to round-robin when the pool is exhausted.
  const usedMoods = new Set(GUIDES.map((g) => g.mood).filter((m) => Number.isInteger(m)));
  let mood = EDITORIAL_POOL_START;
  while (mood < PHOTOS.length && usedMoods.has(mood)) mood++;
  if (mood >= PHOTOS.length) {
    // Pool exhausted — round-robin within the editorial slots.
    const span = PHOTOS.length - EDITORIAL_POOL_START;
    mood = EDITORIAL_POOL_START + (GUIDES.length % span);
  }

  const guideEntry = {
    kicker_en: `GUIDE · ${mins} MIN`,
    kicker_es: `GUÍA · ${mins} MIN`,
    t_en: title,
    t_es: title, // English fallback — translate by hand if desired
    mood,
  };

  const localized = {
    dek: dek || title,
    author,
    authorRole,
    sections,
  };
  const bodyEntry = { en: localized, es: localized }; // es = en fallback

  // Append to GUIDES (data.js).
  let dataSrc = await readFile(DATA_FILE, 'utf8');
  dataSrc = appendBefore(
    dataSrc,
    'export const GUIDES = [',
    '\n];',
    indent(JSON.stringify(guideEntry, null, 2), 2)
  );
  await writeFile(DATA_FILE, dataSrc);

  // Append to GUIDE_BODIES (guideBodies.js).
  let bodiesSrc = await readFile(BODIES_FILE, 'utf8');
  const bodyText =
    `  "${idx}": ` +
    JSON.stringify(bodyEntry, null, 2)
      .split('\n')
      .map((l, i) => (i === 0 ? l : '  ' + l))
      .join('\n');
  bodiesSrc = appendBefore(
    bodiesSrc,
    'export const GUIDE_BODIES = {',
    '\n};',
    bodyText
  );
  await writeFile(BODIES_FILE, bodiesSrc);

  console.log(`[add-article] added editorial #${idx}: "${title}"`);
  console.log(`[add-article]   ${sections.length} sections · ~${mins} min read`);
  console.log(`[add-article]   live after deploy at /editorial/${idx}`);
  console.log('[add-article] next: review the diff, then commit + push.');
}

main().catch((err) => {
  console.error('[add-article] failed:', err.message);
  process.exit(1);
});
