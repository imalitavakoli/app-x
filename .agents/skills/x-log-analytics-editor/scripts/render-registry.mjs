#!/usr/bin/env node
// Renders the analytics event registry as a grouped, human-readable table.
//
// The registry is append-only `.jsonl`, so rows for one event are scattered by
// write order and never adjacent. That is correct for storage — concurrent
// agents append without clobbering, and a PR diff shows pure additions — but it
// is the thing that makes the file hard for a person to read. This reads; it
// never writes.
//
//   node .agents/skills/x-log-analytics-editor/scripts/render-registry.mjs
//
// Exit code is 1 when anything needs a person — a row that could not be read,
// or one discriminator sent under two spellings — and 0 otherwise, so this can
// gate CI if that is ever wanted.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = join(SKILL_DIR, '..', '..', '..');
const SKILL_NAME = 'x-log-analytics-editor';

/** The entry shape this script understands. A row declaring anything else is
 *  reported rather than dropped — a silently skipped row reads as "we do not
 *  send that", which is the one wrong answer this file can give. */
const ENTRY_VERSION = 1;

const HOMES = [
  ['team', join(REPO_ROOT, '.agents', '_team', 'skills', SKILL_NAME, 'events.jsonl')],
  ['local', join(REPO_ROOT, '.agents', '_local', 'skills', SKILL_NAME, 'events.jsonl')],
];

/* Read which mechanisms can reach a native (app) data stream, so the cap count
 * below is the filtered one the skill's registry rule asks for. */
function readAppStreamMechanisms() {
  const dir = join(SKILL_DIR, 'references', 'mechanisms');
  const reaching = new Set();
  if (!existsSync(dir)) return reaching;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const text = readFileSync(join(dir, file), 'utf8');
    if (/^reachesAppStream:\s*yes\s*$/m.test(text)) {
      reaching.add(file.replace(/\.md$/, ''));
    }
  }
  return reaching;
}

function readHome(label, path, issues) {
  if (!existsSync(path)) return [];
  const rows = [];
  readFileSync(path, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const text = line.trim();
      if (!text) return;
      let entry;
      try {
        entry = JSON.parse(text);
      } catch {
        issues.push(`${label} line ${i + 1}: not valid JSON`);
        return;
      }
      if (entry.version !== ENTRY_VERSION) {
        issues.push(
          `${label} line ${i + 1}: version ${entry.version} (this script reads ${ENTRY_VERSION}) — event "${entry.event}" not shown`,
        );
        return;
      }
      rows.push({ ...entry, home: label });
    });
  return rows;
}

/* Overlay is per (event, lib): team wins over local for the same identity, and
 * a local-only identity still stands. */
function overlay(rows) {
  const byIdentity = new Map();
  for (const row of rows) {
    const key = `${row.event}::${row.lib}`;
    const held = byIdentity.get(key);
    if (!held || (held.home === 'local' && row.home === 'team')) {
      byIdentity.set(key, row);
    }
  }
  return [...byIdentity.values()];
}

/* A name's state is the union of its rows. */
function groupByEvent(rows) {
  const events = new Map();
  for (const row of rows) {
    const held = events.get(row.event) ?? {
      event: row.event,
      params: new Set(),
      libs: new Set(),
      mechanisms: new Set(),
      sources: new Set(),
      /** key -> Set of the constant values seen for it. More than one value
       *  for a key is a split breakdown, which is what this reports. */
      constants: new Map(),
    };
    (row.params ?? []).forEach((p) => held.params.add(p));
    for (const [key, value] of Object.entries(row.constants ?? {})) {
      if (!held.constants.has(key)) held.constants.set(key, new Set());
      held.constants.get(key).add(String(value));
    }
    if (row.lib) held.libs.add(row.lib);
    if (row.mechanism) held.mechanisms.add(row.mechanism);
    if (row.source) held.sources.add(row.source);
    events.set(row.event, held);
  }
  return [...events.values()].sort((a, b) => a.event.localeCompare(b.event));
}

function table(rows, headers) {
  const all = [headers, ...rows];
  const widths = headers.map((_, c) =>
    Math.max(...all.map((r) => String(r[c] ?? '').length)),
  );
  const line = (r) =>
    '  ' + r.map((cell, c) => String(cell ?? '').padEnd(widths[c])).join('  ').trimEnd();
  return [line(headers), '  ' + widths.map((w) => '-'.repeat(w)).join('  '), ...rows.map(line)].join('\n');
}

function main() {
  const issues = [];
  const raw = HOMES.flatMap(([label, path]) => readHome(label, path, issues));
  const present = HOMES.filter(([, p]) => existsSync(p)).map(([l]) => l);

  console.log(`\nAnalytics event registry — ${SKILL_NAME}\n`);

  if (present.length === 0) {
    console.log('  No registry file in either home. That is a normal state:');
    console.log('  the skill works without one, and it is created on the first');
    console.log('  recorded event.\n');
    return 0;
  }

  const events = groupByEvent(overlay(raw));
  const reaching = readAppStreamMechanisms();

  if (events.length === 0) {
    console.log(`  Read: ${present.join(', ')}. No usable rows.\n`);
  } else {
    console.log(
      table(
        events.map((e) => [
          e.event,
          [...e.params].sort().join(', ') || '—',
          [...e.constants]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, vs]) => `${k}=${[...vs].sort().join('|')}`)
            .join(', ') || '—',
          e.libs.size,
          [...e.mechanisms].sort().join(', ') || '—',
        ]),
        ['EVENT', 'PARAMETERS (union)', 'CONSTANTS', 'LIBS', 'MECHANISM'],
      ),
    );

    const nativeNames = events.filter((e) =>
      [...e.mechanisms].some((m) => reaching.has(m)),
    ).length;

    console.log(`\n  ${events.length} distinct event name(s) across ${overlay(raw).length} row(s).`);
    console.log(
      `  ${nativeNames} can reach a native (app) data stream, where the 500-name cap applies.`,
    );
    console.log(
      '  That count is a floor on this repo\'s vocabulary, never a reading of any device\'s counter.\n',
    );
  }

  /* Several values for one discriminator is the NORMAL case — that is what
   * distinguishes one use of a shared name from another. What is a defect is
   * two values that are the same word spelled differently, which splits one
   * breakdown in two. So compare on a normalised form rather than on count. */
  const normalise = (v) =>
    v.toLowerCase().replace(/[\s_-]/g, '').replace(/s$/, '');

  const split = [];
  for (const e of events) {
    for (const [key, values] of e.constants) {
      const byNormal = new Map();
      for (const value of values) {
        const n = normalise(value);
        if (!byNormal.has(n)) byNormal.set(n, new Set());
        byNormal.get(n).add(value);
      }
      for (const variants of byNormal.values()) {
        if (variants.size > 1) {
          split.push(
            `${e.event} — ${key} sent as ${[...variants].sort().map((v) => `"${v}"`).join(' and ')}`,
          );
        }
      }
    }
  }

  if (split.length) {
    console.log('  Near-duplicate discriminators — one thing, more than one spelling:');
    split.forEach((m) => console.log(`    - ${m}`));
    console.log('    Reports group by value, so these are separate rows today. Pick one.\n');
  }

  if (issues.length) {
    console.log('  Rows not shown:');
    issues.forEach((m) => console.log(`    - ${m}`));
    console.log('');
  }

  return split.length || issues.length ? 1 : 0;
}

process.exit(main());
