#!/usr/bin/env node
// Mechanically insert or rewrite an owner line in a CODEOWNERS file.
// Pure Node.js — no dependencies, no shell/jq calls.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const BANNER_WIDTH = 76; // content width between the "# " / " #" borders

const BANNER_RE = /^(# \/+ #)\r?\n(# .+ #)\r?\n(# \/+ #)\r?\n/gm;

/**
 * Lexicographic comparison, but '/' always sorts before every other
 * character. This makes a directory path sort before a longer sibling
 * that merely shares its prefix (e.g. "ng-bases/" < "ng-bases-model/").
 */
export function comparePaths(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const ca = a[i];
    const cb = b[i];
    if (ca === cb) continue;
    if (ca === '/') return -1;
    if (cb === '/') return 1;
    return ca < cb ? -1 : 1;
  }
  if (a.length === b.length) return 0;
  return a.length < b.length ? -1 : 1;
}

/**
 * Ensure a leading slash. Trailing slash (directory-style owner lines)
 * is preserved as-is — this function never strips it.
 */
export function normalizePath(p) {
  const trimmed = String(p).trim();
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function normalizeOwner(owner) {
  const trimmed = String(owner).trim();
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

/**
 * A section title may carry descriptive text beyond the path it groups
 * (e.g. "libs/ (app-specific)", "_OBS/ (personal / legacy — not product
 * code)"). Only the leading whitespace-delimited token is path-like —
 * take that, not the full title, when matching a path against it.
 */
function bannerTitleToPathPrefix(title) {
  const token = title.split(/\s+/)[0] || '';
  return token.startsWith('/') ? token : `/${token}`;
}

function makeBanner(title) {
  const border = `# ${'/'.repeat(BANNER_WIDTH)} #`;
  const titleLine = `# ${title.padEnd(BANNER_WIDTH)} #`;
  return [border, titleLine, border].join('\n');
}

/**
 * Split the file into the untouched header (everything before the first
 * banner) and a list of sections, each carrying its raw title and the raw
 * text between its banner and the start of the next one (or EOF).
 */
function parseFile(fileText) {
  const matches = [...fileText.matchAll(BANNER_RE)];
  if (matches.length === 0) {
    return { header: fileText, sections: [] };
  }

  const header = fileText.slice(0, matches[0].index);
  const sections = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const title = m[2].slice(2, -2).trim();
    const contentStart = m.index + m[0].length;
    const contentEnd = i + 1 < matches.length ? matches[i + 1].index : fileText.length;
    sections.push({ title, content: fileText.slice(contentStart, contentEnd) });
  }
  return { header, sections };
}

function serializeFile(header, sections) {
  return header + sections.map((s) => makeBanner(s.title) + '\n' + s.content).join('');
}

/**
 * Parse a section's body into an ordered list of { path, owners }.
 * Blank lines are structural separators only and are not preserved
 * verbatim — the section is always re-serialized from its entries.
 */
function parseEntries(content) {
  const entries = [];
  for (const raw of content.split('\n')) {
    const line = raw.trim();
    if (line === '') continue;
    const spaceIdx = line.indexOf(' ');
    if (spaceIdx === -1) continue; // malformed / comment-only line, ignore
    const path = line.slice(0, spaceIdx);
    const owners = line.slice(spaceIdx + 1).trim();
    entries.push({ path, owners });
  }
  return entries;
}

/**
 * Sort entries by owner group (alphabetically by the full owner string),
 * then within a group by comparePaths — then enforce that a parent path
 * always stays above anything nested under it, regardless of owner order.
 */
function sortEntries(entries) {
  const byOwner = new Map();
  for (const e of entries) {
    if (!byOwner.has(e.owners)) byOwner.set(e.owners, []);
    byOwner.get(e.owners).push(e);
  }
  const ownerKeys = [...byOwner.keys()].sort();
  const sorted = [];
  for (const key of ownerKeys) {
    const group = byOwner.get(key).slice().sort((a, b) => comparePaths(a.path, b.path));
    sorted.push(...group);
  }

  // Enforce parent-before-child regardless of which owner group either
  // path landed in: repeatedly move a child above its parent if it ended
  // up ahead of it.
  const isAncestor = (parent, child) => child !== parent && child.startsWith(parent);
  let moved = true;
  while (moved) {
    moved = false;
    for (let i = 0; i < sorted.length; i++) {
      for (let j = 0; j < i; j++) {
        if (isAncestor(sorted[i].path, sorted[j].path)) {
          // sorted[i] is an ancestor of sorted[j] but sits below it — fix.
          const [child] = sorted.splice(j, 1);
          sorted.splice(i, 0, child);
          moved = true;
          break;
        }
      }
      if (moved) break;
    }
  }
  return sorted;
}

function serializeEntries(entries) {
  const lines = [];
  let prevOwners = null;
  for (const e of entries) {
    if (prevOwners !== null && prevOwners !== e.owners) lines.push('');
    lines.push(`${e.path} ${e.owners}`);
    prevOwners = e.owners;
  }
  return '\n' + lines.join('\n') + '\n\n';
}

function findSectionForPath(sections, path) {
  let best = -1;
  let bestLen = -1;
  for (let i = 0; i < sections.length; i++) {
    const prefix = bannerTitleToPathPrefix(sections[i].title);
    if (path.startsWith(prefix) && prefix.length > bestLen) {
      best = i;
      bestLen = prefix.length;
    }
  }
  return best;
}

function findEntry(sections, path) {
  for (let s = 0; s < sections.length; s++) {
    const entries = parseEntries(sections[s].content);
    for (const e of entries) {
      if (e.path === path) return { sectionIndex: s, entries };
    }
  }
  return null;
}

/**
 * Insert or rewrite a CODEOWNERS line.
 *
 * @param {string} fileText
 * @param {{ path: string, owner: string, mode: 'create' | 'handoff' }} opts
 * @returns {{ text: string, action: 'added' | 'rewritten' }}
 */
export function upsertOwner(fileText, { path, owner, mode }) {
  const normPath = normalizePath(path);
  const normOwner = normalizeOwner(owner);
  const { header, sections } = parseFile(fileText);

  const found = findEntry(sections, normPath);

  if (mode === 'create') {
    if (found) {
      throw new Error(
        `Path "${normPath}" already has an owner — use a handoff instead of create.`,
      );
    }

    let sectionIndex = findSectionForPath(sections, normPath);
    if (sectionIndex === -1) {
      // No matching section: create a new banner, inserted in title order.
      const rawTitle = normPath.replace(/^\//, '');
      const newSection = { title: rawTitle, content: '' };
      let insertAt = sections.length;
      for (let i = 0; i < sections.length; i++) {
        if (rawTitle < sections[i].title) {
          insertAt = i;
          break;
        }
      }
      sections.splice(insertAt, 0, newSection);
      sectionIndex = insertAt;
    }

    const entries = parseEntries(sections[sectionIndex].content);
    entries.push({ path: normPath, owners: normOwner });
    sections[sectionIndex].content = serializeEntries(sortEntries(entries));

    return { text: serializeFile(header, sections), action: 'added' };
  }

  if (mode === 'handoff') {
    if (!found) {
      throw new Error(`Path "${normPath}" not found — nothing to hand off.`);
    }

    const { sectionIndex, entries } = found;
    const updated = entries.map((e) => (e.path === normPath ? { path: e.path, owners: normOwner } : e));
    sections[sectionIndex].content = serializeEntries(sortEntries(updated));

    return { text: serializeFile(header, sections), action: 'rewritten' };
  }

  throw new Error(`Unknown mode "${mode}" — expected "create" or "handoff".`);
}

function findRepoRoot(startDir) {
  let dir = startDir;
  for (let i = 0; i < 20; i++) {
    if (existsSync(join(dir, '.git'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Could not locate repo root by walking up from "${startDir}"`);
}

function parseArgs(argv) {
  const args = { path: null, owner: null, handoff: false, file: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--path') args.path = argv[++i];
    else if (arg === '--owner') args.owner = argv[++i];
    else if (arg === '--handoff') args.handoff = true;
    else if (arg === '--file') args.file = argv[++i];
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.path || !args.owner) {
    console.error('Usage: upsert-owner.mjs --path <path> --owner <owner> [--handoff] [--file <CODEOWNERS>]');
    process.exit(1);
    return;
  }

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const file = args.file || join(findRepoRoot(scriptDir), 'CODEOWNERS');

  try {
    const fileText = readFileSync(file, 'utf8');
    const { text, action } = upsertOwner(fileText, {
      path: args.path,
      owner: args.owner,
      mode: args.handoff ? 'handoff' : 'create',
    });
    writeFileSync(file, text, 'utf8');
    console.log(action);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
