#!/usr/bin/env node
// Integrity checker for the Superpowers-First Workflow surfaces.
//
// Checks the invariants that AGENTS.md, docs/agents/*.md and .agents/skills/x-*
// already DECLARE but that nothing enforces. Every failure class here has
// actually happened in this repo at least once, and every one of them fails
// SILENTLY: a stale hook ID, a broken anchor or a drifted stub still reads as
// plausible, so review does not catch it.
//
// Pure Node (no jq / bash / PowerShell syntax) so it behaves identically on
// macOS, Linux and Windows. Paths resolve relative to this script, so the
// working directory does not matter.
//
//   node .agents/skills/x-sp-workflow-helper/scripts/check-workflow.mjs
//   … --rule=anchors        run one rule only
//   … --json                machine-readable output
//   … --list                list rule ids and exit
//
// Exit 0 = every rule passed (skips allowed). Exit 1 = at least one failure.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, posix } from 'node:path';
import * as CFG from './config.mjs';
import * as MSG from './messages.mjs';
import { allow as allowlist } from './allowlist.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(scriptDir, '..', '..', '..', '..');
const SKILL_DIR = join(scriptDir, '..');

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const onlyRule = (argv.find((a) => a.startsWith('--rule=')) || '').slice(7);
const listOnly = argv.includes('--list');

/* ------------------------------------------------------------------ helpers */

const rel = (abs) => relative(ROOT, abs).split('\\').join('/');
const abs = (p) => join(ROOT, p);
const read = (p) => readFileSync(abs(p), 'utf8');
const exists = (p) => existsSync(abs(p));

/** Every line of a file as { n, text }, 1-indexed. */
const lines = (p) =>
  read(p)
    .split(/\r?\n/)
    .map((text, i) => ({ n: i + 1, text }));

/** Recursively list files under a repo-relative dir, filtered by extension. */
function walk(dir, ext = '.md', out = []) {
  const full = abs(dir);
  if (!existsSync(full)) return out;
  for (const entry of readdirSync(full)) {
    const p = posix.join(dir, entry);
    if (statSync(abs(p)).isDirectory()) walk(p, ext, out);
    else if (entry.endsWith(ext)) out.push(p);
  }
  return out;
}

/**
 * Heading -> anchor slug, under the slug algorithms real renderers actually use.
 *
 * A citation counts as valid if it matches ANY of these, so the checker never
 * fails a link that works somewhere the team actually reads these files. But the
 * set must contain ONLY real algorithms: an invented "and maybe it also trims"
 * variant makes broken links pass, which is a silent false negative — the exact
 * failure class this checker exists to catch. Both implementations below strip
 * emoji and both leave a LEADING HYPHEN when a heading starts with one, which
 * is why `## 🦸 Title` is never addressable as `#title`.
 *
 * Add an entry here only with a link to the implementation it mirrors.
 */
function slugCandidates(headingText) {
  return new Set(CFG.SLUG_RULES.map((r) => r.slug(headingText)));
}

/** All anchors a markdown file exposes (from its ATX headings). */
function anchorsOf(p) {
  const set = new Set();
  for (const { text } of lines(p)) {
    const m = /^(#{1,6})\s+(.*?)\s*$/.exec(text);
    if (!m) continue;
    for (const s of slugCandidates(m[2])) set.add(s);
  }
  return set;
}

/**
 * The YAML frontmatter block only. Everything else in a SKILL.md is prose that
 * may legitimately QUOTE frontmatter — x-skill-build-helper's own Common-mistakes
 * table contains the literal text "metadata: { version: '1.0.0' }" as an example
 * of what NOT to do. Matching the whole file flags the documentation of a rule as
 * a violation of it.
 */
function frontmatterOf(p) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(read(p));
  return m ? m[1] : '';
}

/**
 * Frontmatter `description:` as the STRING A TOOL WOULD MATCH ON — outer YAML
 * quotes stripped, whitespace collapsed.
 *
 * Not the raw line: YAML 'x' and "x" denote the same string, so comparing raw
 * lines flags a formatter that normalised quote style in one file and not the
 * other. That is a false positive, and a checker that cries wolf about cosmetics
 * gets ignored along with its true findings. A genuine difference in the text
 * still shows, which is the thing worth catching.
 */
function descriptionOf(p) {
  const m = /^description:[ \t]*([\s\S]*?)(?=\n[a-zA-Z_-]+:|$)/m.exec(
    frontmatterOf(p),
  );
  if (!m) return null;
  const raw = m[1].trim().replace(/\s+/g, ' ');
  const quoted = /^(['"])([\s\S]*)\1$/.exec(raw);
  return quoted ? quoted[2] : raw;
}

/**
 * Every string literal in a piece of JavaScript, with its line number.
 *
 * A CHARACTER SCANNER rather than a regex, because three regex versions of this
 * each produced a FALSE CLEAN — the tool reporting "no prose in the code" while
 * prose sat in the code, which is worse than not checking:
 *
 *   1. only matched '…' and "…"        → every backtick template was invisible,
 *                                        and a backtick is what you reach for
 *                                        precisely when a sentence has values
 *                                        spliced into it.
 *   2. blanked block comments first    → line 4 of this very file is a LINE
 *                                        comment containing a glob, and the
 *                                        slash-star inside it opened a block
 *                                        comment that ran to the next close
 *                                        thirty lines down. Every literal in
 *                                        between went unscanned, silently.
 *   3. blanked regex literals by regex → could not tell a division from a
 *                                        pattern without knowing what preceded.
 *
 * A scanner knows which state it is in, so none of those cases can arise. It
 * skips comments and regex literals, and returns:
 *
 *   { text, line }   text = the literal's contents; for a template, its literal
 *                    parts with each ${…} replaced by a space.
 */
function literalsOf(src) {
  const out = [];
  let i = 0;
  let line = 1;
  let prev = ''; // last significant (non-space, non-comment) character

  const at = (s) => src.startsWith(s, i);
  const bump = (n) => {
    for (let k = 0; k < n; k++) if (src[i + k] === '\n') line++;
    i += n;
  };

  /** A `/` starts a regex only where a value may start, not after one. */
  const regexCanStart = () =>
    prev === '' || '(,=:[!&|?{};+-*%~^<>'.includes(prev);

  while (i < src.length) {
    // line comment
    if (at('//')) {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    // block comment
    if (at('/*')) {
      const end = src.indexOf('*/', i + 2);
      bump((end === -1 ? src.length : end + 2) - i);
      continue;
    }
    // '…' and "…" — cannot span a raw newline
    if (src[i] === "'" || src[i] === '"') {
      const q = src[i];
      const start = line;
      let text = '';
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\n') break; // unterminated; bail rather than run away
        if (src[i] === '\\') {
          text += src[i + 1] ?? '';
          i += 2;
          continue;
        }
        text += src[i++];
      }
      i++; // closing quote
      out.push({ text, line: start });
      prev = q;
      continue;
    }
    // `…` — may span lines, and ${…} may nest braces, strings, even templates
    if (src[i] === '`') {
      const start = line;
      let text = '';
      bump(1);
      while (i < src.length && src[i] !== '`') {
        if (src[i] === '\\') {
          text += src[i + 1] ?? '';
          bump(2);
          continue;
        }
        if (at('${')) {
          // Skip the expression, tracking brace depth so a nested object or
          // template does not end it early.
          bump(2);
          let depth = 1;
          while (i < src.length && depth > 0) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            else if (src[i] === '`' || src[i] === "'" || src[i] === '"') {
              const q = src[i];
              bump(1);
              while (i < src.length && src[i] !== q)
                bump(src[i] === '\\' ? 2 : 1);
            }
            bump(1);
          }
          text += ' '; // the hole an interpolation leaves in the sentence
          continue;
        }
        if (src[i] === '\n') {
          text += ' ';
          bump(1);
          continue;
        }
        text += src[i];
        bump(1);
      }
      bump(1); // closing backtick
      out.push({ text, line: start });
      prev = '`';
      continue;
    }
    // regex literal — skipped, not collected
    if (src[i] === '/' && regexCanStart()) {
      bump(1);
      let inClass = false;
      while (i < src.length) {
        if (src[i] === '\\') {
          bump(2);
          continue;
        }
        if (src[i] === '[') inClass = true;
        else if (src[i] === ']') inClass = false;
        else if (src[i] === '/' && !inClass) break;
        else if (src[i] === '\n') break; // not a regex after all
        bump(1);
      }
      bump(1);
      while (i < src.length && /[gimsuyd]/.test(src[i])) bump(1);
      prev = '/';
      continue;
    }
    if (!/\s/.test(src[i])) prev = src[i];
    bump(1);
  }
  return out;
}

/* ---------------------------------------------------------------- constants */

const AGENTS = CFG.AGENTS_FILE;
const PATH_FILES = CFG.PATH_LETTERS.map(CFG.pathFile);
const WORKFLOW_DOCS = [AGENTS, ...walk(CFG.WORKFLOW_DOC_DIR)];
const RESERVED_ICONS = CFG.RESERVED_ICONS;

/**
 * Marketplaces whose Superpowers entry is explicitly `false` in project settings.
 *
 * Project settings outrank user settings, so such a copy CANNOT load here even
 * though its files sit in the plugin cache. Counting it would report a duplicate
 * that does not exist — and the remedy the duplicate message prints IS that
 * `false`, so a filesystem-only count tells people to do what they already did.
 *
 * Only an explicit `false` filters. A missing entry means UNKNOWN, not disabled:
 * user settings may still enable it, so it stays counted.
 */
function disabledSuperpowersMarkets() {
  if (!exists(CFG.SP_ENABLEMENT_SETTINGS_FILE)) return new Set();
  let cfg;
  try {
    cfg = JSON.parse(read(CFG.SP_ENABLEMENT_SETTINGS_FILE));
  } catch {
    return new Set(); // unreadable settings prove nothing about enablement
  }
  const prefix = `${CFG.SP_PLUGIN_NAME}@`;
  return new Set(
    Object.entries(cfg?.enabledPlugins ?? {})
      .filter(([k, v]) => k.startsWith(prefix) && v === false)
      .map(([k]) => k.slice(prefix.length)),
  );
}

/**
 * Locate the installed Superpowers skills dir, or null when unavailable.
 *
 * Discovers the MARKETPLACE rather than assuming it: Superpowers may arrive from
 * upstream's marketplace or from one this workspace declares in order to select a
 * version, and a hardcoded marketplace name would make this report "NOT
 * INSTALLED" the day that changes — a false alarm, which is worse than no check.
 *
 * Returns the highest version found among the copies that CAN load here, plus
 * every marketplace it was found under, so the caller can report a duplicate
 * install (the same plugin from two marketplaces loads every skill twice, with
 * no warning from anything else). Copies a project `false` has disabled are
 * excluded and reported separately as `ignoredDisabled` — pinning a version by
 * adding a second marketplace leaves the old copy in the cache on purpose, and
 * counting it would fail every machine that kept its own.
 */
function findSuperpowersSkills() {
  const cmp = (a, b) => {
    const x = String(a).split('.').map(Number);
    const y = String(b).split('.').map(Number);
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  };

  const found = []; // { version | null, dir, source, where }
  const ignoredDisabled = []; // marketplaces present on disk but disabled here

  // PROBE 1 — Claude Code plugin cache. The marketplace is discovered, not
  // assumed (see SP_PLUGIN_NAME): Superpowers may arrive from upstream's
  // marketplace or from one this workspace declares.
  const disabled = disabledSuperpowersMarkets();
  const home = process.env.USERPROFILE || process.env.HOME;
  if (home) {
    const cacheRoot = join(home, ...CFG.SP_CACHE_ROOT_SEGMENTS);
    if (existsSync(cacheRoot)) {
      for (const market of readdirSync(cacheRoot)) {
        const pluginDir = join(cacheRoot, market, CFG.SP_PLUGIN_NAME);
        if (!existsSync(pluginDir)) continue;
        // Present, but project settings switch it off for this repo — so it is
        // not a second loaded copy, and must not be counted as one.
        if (disabled.has(market)) {
          ignoredDisabled.push(market);
          continue;
        }
        for (const v of readdirSync(pluginDir)) {
          if (!/^\d+\.\d+\.\d+$/.test(v)) continue;
          const skills = join(pluginDir, v, CFG.SP_SKILLS_SUBDIR);
          if (existsSync(skills)) {
            found.push({
              version: v,
              dir: skills,
              source: MSG.labels.sourceClaudePlugin,
              where: market,
            });
          }
        }
      }
    }
  }

  // PROBE 2 — copied into the workspace, no plugin manager involved. A bare
  // `skills/` copy carries no version, which is reported as unknown rather
  // than guessed.
  for (const dir of CFG.SP_WORKSPACE_SKILL_DIRS) {
    if (!exists(`${dir}/${CFG.SP_MARKER_SKILL}/SKILL.md`)) continue;
    let version = null;
    for (const rel of [
      '.claude-plugin/plugin.json',
      'gemini-extension.json',
      'package.json',
    ]) {
      const manifest = `${posix.dirname(dir)}/${rel}`;
      if (!exists(manifest)) continue;
      try {
        version = JSON.parse(read(manifest)).version ?? null;
      } catch {
        /* unreadable manifest is not a version */
      }
      if (version) break;
    }
    found.push({
      version,
      dir,
      source: MSG.labels.sourceWorkspaceCopy,
      where: dir,
    });
  }

  // PROBE 3 — Cursor Cloud env install. Verified layout only: marker written by
  // `.cursor/cloud/install-pinned-plugins.mjs` plus the marker skill under
  // `~/.cursor/skills/`. Desktop Cursor marketplace stays in SP_PROBES_UNVERIFIED.
  if (home) {
    const marker = join(home, ...CFG.SP_CURSOR_CLOUD_PIN_MARKER_SEGMENTS);
    const skillsDir = join(home, ...CFG.SP_CURSOR_CLOUD_SKILLS_SEGMENTS);
    const markerSkill = join(skillsDir, CFG.SP_MARKER_SKILL, 'SKILL.md');
    if (existsSync(marker) && existsSync(markerSkill)) {
      let version = null;
      try {
        version = JSON.parse(readFileSync(marker, 'utf8')).version ?? null;
      } catch {
        /* marker without version is still a find; sp-version handles unknown */
      }
      found.push({
        version,
        dir: skillsDir,
        source: MSG.labels.sourceCursorCloud,
        where: 'cursor-cloud',
      });
    }
  }

  if (!found.length) return null;

  // Prefer a finding whose version is knowable, then the highest version.
  found.sort(
    (a, b) =>
      (b.version ? 1 : 0) - (a.version ? 1 : 0) ||
      cmp(b.version ?? '0.0.0', a.version ?? '0.0.0'),
  );

  return {
    ...found[0],
    all: found,
    marketplaces: [...new Set(found.map((f) => f.where))],
    ignoredDisabled,
  };
}

/* ---------------------------------------------------------------- allowlist */

// Imported, not read: the allowlist is part of this skill, so if it is missing
// or malformed the module error naming it is the right outcome. (The BASELINE is
// different — it is state that may legitimately be absent or hand-broken, so it
// stays JSON and is read defensively, with its own two findings.)
const allowlistHits = new Set();

/** True when this finding is deliberately suppressed. Records the hit so an
 *  entry that stops matching can be reported as stale. */
function suppressed(rule, file, text) {
  for (const [i, e] of allowlist.entries()) {
    if (e.rule !== rule || e.file !== file) continue;
    if (!text.includes(e.match)) continue;
    allowlistHits.add(i);
    return true;
  }
  return false;
}

/**
 * Emit a message object from messages.mjs: its line, then its details.
 *
 * `as: 'notice'` sends the same line down the NOTICE channel instead — reported
 * and surfaced at session start, but not a failure and not an exit code. That
 * tier exists because some findings are real and worth saying while being
 * nothing the person reading them can act on: a teammate on another agent cannot
 * install the version this workspace pins, so failing them produces a red they
 * can never clear, and a checker that cries wolf gets ignored wholesale. The
 * severity is the RULE's judgement, not the message's — the same text can be
 * either depending on whether the reader could have prevented it.
 */
function emitMsg(r, m, { as = 'fail' } = {}) {
  if (m.fail) (as === 'notice' ? r.notice : r.fail)(m.fail);
  for (const d of m.details ?? []) r.detail(d);
}

/* -------------------------------------------------------------------- rules */

const RULES = [];
/**
 * Register a rule. The TITLE is not passed in — it is looked up in messages.mjs,
 * so a registration carries no prose and every verdict the tool renders lives in
 * one file. A missing title throws here rather than printing `undefined`, which
 * would read like a broken tool.
 */
const rule = (id, fn) => {
  const title = MSG.titles[id];
  if (!title) throw new Error(MSG.runner.missingTitle(id));
  RULES.push({ id, title, fn });
};

/* --- 1. hook IDs ---------------------------------------------------------- */
rule('hook-ids', (r) => {
  const defined = new Map(); // id -> file
  for (const p of PATH_FILES) {
    if (!exists(p)) continue;
    for (const { text } of lines(p)) {
      const m = /^####\s+🪝\s+([A-Z]\d+)\b/.exec(text);
      if (m) defined.set(m[1], p);
    }
  }
  r.note(MSG.notes.hookIdsDefined([...defined.keys()]));

  for (const p of WORKFLOW_DOCS) {
    for (const { n, text } of lines(p)) {
      if (/^####\s+🪝/.test(text)) continue; // the definition itself
      // Only count tokens used as hook references, not prose like "AC-01".
      const re = /\b(?:hook |hooks |at )?([ABC]\d)(?=\b)(?!\d)/g;
      let m;
      while ((m = re.exec(text))) {
        const id = m[1];
        // Skip ID-shaped noise: AC/US/FR/BR ids and version markers.
        const before = text.slice(Math.max(0, m.index - 3), m.index);
        if (/[-_A-Za-z]$/.test(before)) continue;
        if (defined.has(id)) continue;
        if (suppressed('hook-ids', p, text)) continue;
        emitMsg(r, MSG.locators.hookIdUndefined({ file: p, line: n, id }));
      }
    }
  }
});

/* --- 2. link + path targets ---------------------------------------------- */
rule('links', (r) => {
  let checked = 0;
  for (const p of WORKFLOW_DOCS) {
    const dir = posix.dirname(p);
    for (const { n, text } of lines(p)) {
      // Two citation styles with DIFFERENT resolution bases:
      //  - markdown links are relative to the citing file's directory;
      //  - backticked repo paths are repo-root-relative by workspace convention
      //    (`docs/agents/x.md` and `/docs/agents/x.md` both mean the same file),
      //    which is why they must not be joined onto the citing file's dir.
      const targets = [];
      for (const m of text.matchAll(/\]\(([^)\s]+)\)/g))
        targets.push({ t: m[1], root: false });
      for (const m of text.matchAll(CFG.citablePathPattern()))
        targets.push({ t: m[1], root: true });

      for (const { t, root } of targets) {
        if (/^(https?:|mailto:|#)/.test(t)) continue;
        const [filePart] = t.split('#');
        if (!filePart) continue;
        if (filePart.includes('{')) continue; // placeholder shape, not a file
        const bare = filePart.replace(/\/$/, '');
        const resolved =
          root || filePart.startsWith('/')
            ? bare.replace(/^\//, '')
            : posix.normalize(posix.join(dir, bare));
        checked++;
        if (exists(resolved)) continue; // matches a file OR a directory
        if (suppressed('links', p, t)) continue;
        emitMsg(
          r,
          MSG.locators.docPathMissing({ file: p, line: n, cited: t, resolved }),
        );
      }
    }
  }

  // Skill-internal navigation links (SKILL.md -> references/, assets/, …).
  // ONLY markdown links here, never backticked paths: a skill legitimately shows
  // illustrative sample content (`docs/x/{domain}/{name}/PRD/README.md`, example names no
  // functionality has yet), and failing those would fail documentation for doing
  // its job. Hook script paths are handled by the hook-refs rule, which forbids
  // them rather than resolving them.
  let internal = 0;
  for (const d of existsSync(abs(CFG.CANONICAL_SKILL_DIR))
    ? readdirSync(abs(CFG.CANONICAL_SKILL_DIR))
    : []) {
    if (!d.startsWith(CFG.OUR_SKILL_PREFIX)) continue;
    for (const p of walk(`${CFG.CANONICAL_SKILL_DIR}/${d}`)) {
      const dir = posix.dirname(p);
      for (const { n, text } of lines(p)) {
        for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
          const t = m[1];
          if (/^(https?:|mailto:|#)/.test(t)) continue;
          const [filePart] = t.split('#');
          if (!filePart || filePart.includes('{')) continue;
          const resolved = posix.normalize(
            posix.join(dir, filePart.replace(/\/$/, '')),
          );
          internal++;
          if (exists(resolved)) continue;
          if (suppressed('links', p, t)) continue;
          emitMsg(
            r,
            MSG.locators.skillLinkMissing({
              file: p,
              line: n,
              cited: t,
              resolved,
            }),
          );
        }
      }
    }
  }
  r.note(MSG.notes.pathsChecked(checked, internal));
});

/* --- 3. anchors ---------------------------------------------------------- */
rule('anchors', (r) => {
  const cache = new Map();
  const anchorsFor = (p) => {
    if (!cache.has(p)) cache.set(p, anchorsOf(p));
    return cache.get(p);
  };
  let checked = 0;
  for (const p of WORKFLOW_DOCS) {
    const dir = posix.dirname(p);
    for (const { n, text } of lines(p)) {
      const targets = [];
      for (const m of text.matchAll(/\]\(([^)\s]*#[^)\s]+)\)/g))
        targets.push(m[1]);
      for (const m of text.matchAll(CFG.citablePathPattern(true)))
        targets.push(m[1]);

      for (const t of targets) {
        if (/^https?:/.test(t)) continue;
        const [filePart, anchor] = t.split('#');
        if (!anchor || filePart.includes('{')) continue;
        const target =
          filePart === ''
            ? p
            : filePart.startsWith('/')
              ? filePart.slice(1)
              : posix.normalize(posix.join(dir, filePart));
        if (!exists(target)) continue; // the links rule owns that failure
        checked++;
        if (anchorsFor(target).has(decodeURIComponent(anchor))) continue;
        if (suppressed('anchors', p, t)) continue;
        emitMsg(
          r,
          MSG.locators.anchorMissing({ file: p, line: n, anchor, target }),
        );
      }
    }
  }
  r.note(MSG.notes.anchorsChecked(checked));
});

/* --- 4. Superpowers skills exist ---------------------------------------- */
rule('sp-skills', (r) => {
  const sp = findSuperpowersSkills();
  if (!sp) return r.skip(MSG.skips.supersededBySpVersion);
  r.note(MSG.notes.spVersionInspected(sp.version));
  const installed = new Set(
    readdirSync(sp.dir).filter((d) => existsSync(join(sp.dir, d, 'SKILL.md'))),
  );

  // Detection is by POSITION, not by a list of names we would have to maintain.
  // A backticked name in a hook heading, an ⚪ line, or a `today \`…\`` routing
  // marker is an anchor by virtue of where it sits. That survives upstream
  // renames, and it catches single-word names (`brainstorming`) that no
  // token-shape pattern can tell apart from ordinary prose.
  const counts = Object.fromEntries(CFG.ATTACH_POINTS.map((a) => [a.name, 0]));

  // Which names are NOT Superpowers-anchor candidates is derived from the
  // filesystem, never from a maintained prefix list: any name that exists as a
  // skill directory here is a local skill, and the x-skills rule owns it. A
  // hardcoded list of "foreign" prefixes would need editing every time a new
  // plugin drops skills into the tree — the exact rot this file avoids.
  const localSkills = new Set(
    existsSync(abs(CFG.CANONICAL_SKILL_DIR))
      ? readdirSync(abs(CFG.CANONICAL_SKILL_DIR))
      : [],
  );

  for (const p of [AGENTS, ...PATH_FILES]) {
    if (!exists(p)) continue;
    for (const { n, text } of lines(p)) {
      const kind = CFG.ATTACH_POINTS.find((a) => a.test(text));
      if (!kind) continue;
      for (const m of text.matchAll(CFG.SKILL_NAME_IN_LINE)) {
        const name = m[1];
        if (localSkills.has(name)) continue; // a local skill — the x-skills rule owns it
        counts[kind.name]++;
        if (installed.has(name)) continue;
        if (suppressed('sp-skills', p, text)) continue;
        emitMsg(
          r,
          MSG.attachPointNotInstalled({
            file: p,
            line: n,
            kind: kind.name,
            name,
            version: sp.version,
          }),
        );
      }
    }
  }
  r.note(
    MSG.notes.attachPointsChecked(
      Object.entries(counts)
        .map(([k, v]) => `${v} at ${k}s`)
        .join(', '),
    ),
  );
});

/* --- 5. reviewed-against Superpowers version ---------------------------- */
rule('sp-version', (r) => {
  // ENABLEMENT FIRST — files on disk prove nothing about whether the plugin is
  // actually loaded. A real incident: the working entry was set to false while a
  // second entry was added that never installed. Superpowers went dark for a
  // whole session, and this rule reported green, because the old version was
  // still sitting in the cache. Checking the cache alone is checking the wrong
  // thing.
  // Enablement, the plugin cache and the pin are ALL Claude Code's model. On a
  // machine running another agent they describe nothing, so every check below
  // that reads them is gated on Claude Code being in use here — otherwise a
  // Cursor teammate fails on `enabledPlugins` entries that could not possibly
  // apply to them, and nothing they can do clears it.
  const claudeInUse = existsSync(
    join(
      process.env.USERPROFILE || process.env.HOME || '',
      ...CFG.SP_CLAUDE_HOME_SEGMENTS,
    ),
  );

  const settingsPath = CFG.SP_ENABLEMENT_SETTINGS_FILE;
  if (claudeInUse && exists(settingsPath)) {
    let cfg;
    try {
      cfg = JSON.parse(read(settingsPath));
    } catch {
      cfg = null;
    }
    const entries = Object.entries(cfg?.enabledPlugins ?? {}).filter(([k]) =>
      k.startsWith(`${CFG.SP_PLUGIN_NAME}@`),
    );

    if (entries.length && entries.every(([, v]) => v === false)) {
      emitMsg(
        r,
        MSG.allEntriesDisabled({
          settingsPath,
          keys: entries.map(([k]) => k).join(', '),
        }),
      );
      return;
    }

    // Enabled, but from a marketplace with nothing in the plugin cache: the
    // marketplace registered and the plugin never installed. Registering a
    // marketplace is not installing from it.
    const cacheRoot = join(
      process.env.USERPROFILE || process.env.HOME || '',
      ...CFG.SP_CACHE_ROOT_SEGMENTS,
    );
    for (const [key, val] of entries) {
      // Enabled means `true` OR a non-empty version-constraint array — both resolve a
      // plugin, so both need a marketplace that actually has one.
      const enabled = val === true || (Array.isArray(val) && val.length > 0);
      if (!enabled) continue;
      const market = key.split('@')[1];
      if (market && existsSync(join(cacheRoot, market))) continue;
      emitMsg(r, MSG.enabledButNotInstalled({ settingsPath, key, market }));
      return;
    }
  }

  const sp = findSuperpowersSkills();

  // ABSENT is worse than MISMATCHED, so it fails rather than skips. Every path
  // routes through Superpowers and every hook anchors to one of its skills, so
  // without it the workflow is not degraded — it is inoperative. This rule owns
  // that report; sp-skills only skips, to keep one root cause to one failure.
  if (!sp) {
    // WHOSE FAULT decides the severity. On a Claude Code machine Superpowers
    // should be installed and its absence is a real, fixable break — including
    // the fresh clone that has not run the install yet. On a machine where
    // Claude Code is not in use, this workspace can neither pin nor inspect, so
    // absence means "outside our reach", not "broken".
    const where = {
      checkedDirs: CFG.SP_WORKSPACE_SKILL_DIRS.join(' / '),
      uncheckedAgents: CFG.SP_PROBES_UNVERIFIED.join(', '),
    };
    if (claudeInUse) emitMsg(r, MSG.notFoundAnywhere(where));
    else emitMsg(r, MSG.notFoundUncheckedAgent(where), { as: 'notice' });
    return;
  }

  // Said out loud rather than silently subtracted: a copy someone can see in the
  // cache was considered and ruled out, which is different from not looking.
  if (sp.ignoredDisabled?.length)
    r.note(MSG.notes.spVersionDisabledIgnored(sp.ignoredDisabled));

  const baselinePath = join(SKILL_DIR, 'scripts', CFG.SP_BASELINE_FILE);
  if (!existsSync(baselinePath)) {
    return emitMsg(
      r,
      MSG.baselineMissing({
        baselineFile: CFG.SP_BASELINE_FILE,
        installedVersion: sp.version,
      }),
    );
  }

  let baseline;
  try {
    baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  } catch (err) {
    return emitMsg(
      r,
      MSG.baselineInvalid({
        baselineFile: CFG.SP_BASELINE_FILE,
        error: err.message,
      }),
    );
  }

  // The same plugin cached under two marketplaces loads every skill twice, and
  // nothing else in the toolchain warns about it. Only visible because the
  // lookup above scans marketplaces rather than assuming one.
  //
  // Counts only the copies that CAN load: the lookup has already dropped any a
  // project `false` disables. Pinning a version deliberately leaves the old copy
  // in the cache — counting that would fail every machine whose owner kept their
  // own, and the remedy this failure prints is the very `false` they applied.
  if (sp.all?.length > 1) {
    emitMsg(
      r,
      MSG.foundInMultiplePlaces({
        findings: sp.all
          .map(
            (f) =>
              `${f.source} at ${f.where}${f.version ? ' v' + f.version : ''}`,
          )
          .join(' · '),
      }),
    );
  }

  // A workspace copy may carry no manifest, so there is no version to compare.
  // Saying "matches" would be a lie and failing would be a false alarm.
  if (!sp.version) {
    emitMsg(r, MSG.versionUnreadable({ source: sp.source, where: sp.where }));
    return;
  }

  const reviewed = baseline.reviewed ?? MSG.labels.dateUnrecorded;
  if (baseline.version === sp.version) {
    return r.note(
      MSG.notes.spVersionOk({
        version: baseline.version,
        reviewed,
        source: sp.source,
        where: sp.where,
      }),
    );
  }

  // Which semver segment moved decides how loud this is (CFG.VERSION_DRIFT_POLICY).
  const seg = (v) => String(v).split('.').map(Number);
  const [bMaj, bMin] = seg(baseline.version);
  const [iMaj, iMin] = seg(sp.version);
  const tier = iMaj !== bMaj ? 'major' : iMin !== bMin ? 'minor' : 'patch';
  const action = CFG.VERSION_DRIFT_POLICY[tier] ?? 'fail';

  const why = MSG.driftWhy[tier];

  const drift = MSG.driftSummary({
    installed: sp.version,
    reviewed: baseline.version,
    reviewedDate: reviewed,
    tier,
  });

  if (action === 'ignore') return r.note(MSG.notes.driftIgnored(drift));

  if (action === 'note') {
    for (const line of MSG.driftNote({ drift, why })) r.note(line);
    return;
  }

  // CAN THE READER HAVE PREVENTED THIS? Only installs this workspace pins are
  // governed (Claude Code marketplace adapter, Cursor Cloud env install). For
  // any other copy a version difference is ordinary, not an incident — NOTICE.
  // Failing those would hand teammates a permanent red they cannot clear.
  const governed =
    sp.source === MSG.labels.sourceClaudePlugin ||
    sp.source === MSG.labels.sourceCursorCloud;
  if (!governed) {
    emitMsg(r, MSG.driftUngoverned({ drift, source: sp.source }), {
      as: 'notice',
    });
    return;
  }

  emitMsg(
    r,
    MSG.driftFail({
      drift,
      why,
      baselineFile: CFG.SP_BASELINE_FILE,
      installedVersion: sp.version,
    }),
  );
});

/* --- 6. pinned commit vs reviewed commit --------------------------------- */
rule('sp-pin', (r) => {
  // ONE fact, several surfaces. `.agents/_pins/plugins/catalog.json` is the
  // source of truth for the Superpowers SHA. The baseline records what was
  // REVIEWED; each harness adapter materializes the same commit. `sp-version`
  // only compares installed vs baseline, so adapter drift stays invisible
  // unless this rule checks the shared catalog and every listed harness.
  //
  // Pinning is optional: no shared catalog → SKIP (not a pass).
  const sharedCatalog = CFG.SP_PINS_CATALOG;
  let shared;
  try {
    shared = JSON.parse(read(sharedCatalog));
  } catch (err) {
    if (!exists(sharedCatalog)) return r.skip(MSG.skips.noPinnedCatalog);
    emitMsg(
      r,
      MSG.pinSharedCatalogUnreadable({
        catalog: sharedCatalog,
        error: err.message,
      }),
    );
    return;
  }

  const entry = (shared?.plugins ?? []).find(
    (p) => p?.name === CFG.SP_PLUGIN_NAME,
  );
  if (!entry) return r.skip(MSG.skips.noPinnedCatalog);

  const sha = entry.source?.sha;
  if (!sha) {
    emitMsg(
      r,
      MSG.pinHasNoSha({ catalog: sharedCatalog, plugin: CFG.SP_PLUGIN_NAME }),
    );
    return;
  }

  const baselinePath = join(SKILL_DIR, 'scripts', CFG.SP_BASELINE_FILE);
  let baseline;
  try {
    baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  } catch {
    return r.skip(MSG.skips.noPinnedCatalog); // sp-version owns a bad baseline
  }

  const versionOk = !entry.version || entry.version === baseline.version;
  if (sha !== baseline.gitSha || !versionOk) {
    emitMsg(
      r,
      MSG.pinDisagreesWithBaseline({
        catalog: sharedCatalog,
        baselineFile: CFG.SP_BASELINE_FILE,
        pinned: `${entry.version ?? '?'} @ ${sha}`,
        reviewed: `${baseline.version ?? '?'} @ ${baseline.gitSha ?? '?'}`,
      }),
    );
    return;
  }

  r.note(
    MSG.notes.spPinOk({
      catalog: sharedCatalog,
      version: entry.version ?? baseline.version,
      sha,
    }),
  );

  const harnesses = Array.isArray(entry.harnesses) ? entry.harnesses : [];
  const adapters = CFG.SP_PIN_HARNESS_ADAPTERS ?? {};
  const catalogPin = `${entry.version ?? '?'} @ ${sha}`;

  const settingsFile = CFG.SP_ENABLEMENT_SETTINGS_FILE;
  let settingsCfg = null;
  if (exists(settingsFile)) {
    try {
      settingsCfg = JSON.parse(read(settingsFile));
    } catch {
      settingsCfg = null;
    }
  }

  for (const harness of harnesses) {
    const adapter = adapters[harness];
    if (!adapter) {
      emitMsg(
        r,
        MSG.pinUnknownHarness({ harness, catalog: sharedCatalog }),
      );
      continue;
    }

    if (adapter.kind === 'claude-marketplace') {
      if (!settingsCfg) continue;
      const catalogDirs = Object.values(
        settingsCfg?.extraKnownMarketplaces ?? {},
      )
        .map((m) => m?.source)
        .filter((s) => s?.source === 'directory' && typeof s?.path === 'string')
        .map((s) => s.path.replace(/^\.\//, '').replace(/\/+$/, ''));

      for (const dir of catalogDirs) {
        const catalog = `${dir}/${CFG.SP_CATALOG_MANIFEST}`;
        let manifest;
        try {
          manifest = JSON.parse(read(catalog));
        } catch (err) {
          emitMsg(
            r,
            MSG.pinCatalogUnreadable({ catalog, error: err.message }),
          );
          continue;
        }
        const mEntry = (manifest?.plugins ?? []).find(
          (p) => p?.name === CFG.SP_PLUGIN_NAME,
        );
        if (!mEntry) continue;
        const mSha = mEntry.source?.sha;
        if (!mSha) {
          emitMsg(
            r,
            MSG.pinHasNoSha({ catalog, plugin: CFG.SP_PLUGIN_NAME }),
          );
          continue;
        }
        const mVersionOk = !mEntry.version || mEntry.version === entry.version;
        if (mSha !== sha || !mVersionOk) {
          emitMsg(
            r,
            MSG.pinAdapterDisagreesWithCatalog({
              adapter: catalog,
              catalog: sharedCatalog,
              adapterPin: `${mEntry.version ?? '?'} @ ${mSha}`,
              catalogPin,
            }),
          );
        } else {
          r.note(
            MSG.notes.spPinOk({
              catalog,
              version: mEntry.version ?? entry.version,
              sha: mSha,
            }),
          );
        }
      }
      continue;
    }

    if (adapter.kind === 'cursor-cloud-install') {
      const installer = adapter.installer;
      if (!installer || !exists(installer)) {
        emitMsg(
          r,
          MSG.pinCursorCloudInstallerMissing({
            installer: installer || MSG.labels.installerPathMissing,
            catalog: sharedCatalog,
          }),
        );
      } else {
        r.note(
          MSG.notes.spPinOk({
            catalog: installer,
            version: entry.version ?? baseline.version,
            sha,
          }),
        );
      }
    }
  }
});

/* --- 7. workspace skills + stubs ---------------------------------------- */
rule('x-skills', (r) => {
  const canonicalDir = CFG.CANONICAL_SKILL_DIR;
  const stubDirs = CFG.STUB_SKILL_DIRS;
  const isX = (n) => n.startsWith(CFG.OUR_SKILL_PREFIX);
  const canon = existsSync(abs(canonicalDir))
    ? readdirSync(abs(canonicalDir)).filter(
        (n) => isX(n) && exists(`${canonicalDir}/${n}/SKILL.md`),
      )
    : [];
  r.note(MSG.notes.workspaceSkills(canon));

  // Named in AGENTS.md but absent from disk. NOTE: skill names contain digits
  // (x-ng-test-e2e-helper), so the character class must include 0-9.
  const named = new Set();
  for (const m of read(AGENTS).matchAll(/`(x-[a-z0-9-]+)`/g)) named.add(m[1]);
  for (const n of [...named].sort()) {
    if (!canon.includes(n))
      emitMsg(
        r,
        MSG.locators.namedSkillMissing({
          agentsFile: AGENTS,
          name: n,
          canonicalDir,
        }),
      );
  }

  for (const n of canon) {
    const c = `${canonicalDir}/${n}/SKILL.md`;

    const fmName = (/^name:[ \t]*['"]?([^'"\n]+)/m.exec(read(c)) ||
      [])[1]?.trim();
    if (fmName !== n)
      emitMsg(
        r,
        MSG.locators.skillNameFolderMismatch({
          file: c,
          frontmatterName: fmName,
          folder: n,
        }),
      );

    // Every stub location, not just one — the stub table is per AI tool and
    // grows. A skill stubbed for one tool and missed for another is invisible
    // to that tool, which is exactly how the x-* skills were once invisible to
    // Claude Code's Skill tool.
    for (const stubDir of stubDirs) {
      const s = `${stubDir}/${n}/SKILL.md`;

      if (!exists(s)) {
        emitMsg(r, MSG.locators.stubMissing({ skill: n, stubPath: s }));
        continue;
      }

      const dc = descriptionOf(c);
      const ds = descriptionOf(s);
      if (dc !== ds) {
        emitMsg(r, MSG.locators.stubDescriptionDrifted({ skill: n, stubDir }));
        r.detail(`  canonical: ${dc}`);
        r.detail(`  stub     : ${ds}`);
      }
      if (/^metadata:/m.test(read(s)))
        emitMsg(r, MSG.locators.stubCarriesMetadata({ stubPath: s }));
    }
  }

  // Orphan stubs, in every stub location.
  for (const stubDir of stubDirs) {
    if (!existsSync(abs(stubDir))) continue;
    for (const n of readdirSync(abs(stubDir))) {
      if (!isX(n)) continue;
      if (!canon.includes(n))
        emitMsg(r, MSG.locators.orphanStub({ stubDir, skill: n }));
    }
  }
  r.note(MSG.notes.stubLocations(stubDirs));
});

/* --- 8. version discipline ---------------------------------------------- */
rule('versions', (r) => {
  const dir = CFG.CANONICAL_SKILL_DIR;
  if (!existsSync(abs(dir))) return r.skip(MSG.skips.noDir(dir));
  for (const n of readdirSync(abs(dir)).filter((x) =>
    x.startsWith(CFG.OUR_SKILL_PREFIX),
  )) {
    const p = `${dir}/${n}/SKILL.md`;
    if (!exists(p)) continue;
    const fm = frontmatterOf(p);
    if (/metadata:[ \t]*\{/.test(fm)) {
      emitMsg(r, MSG.inlineMetadata({ file: p }));
      continue;
    }
    const m =
      /^metadata:[ \t]*\r?\n(?:[ \t]+.*\r?\n)*?[ \t]+version:[ \t]*'(\d+\.\d+\.\d+)'/m.exec(
        fm + '\n',
      );
    if (!m) emitMsg(r, MSG.locators.versionMissing({ file: p }));
  }
});

/* --- 8b. skill kinds ----------------------------------------------------- */
// Three failures, one rule, because all three are the same fact disagreeing
// with itself: a skill's kind is stated in its NAME, in the TEMPLATE list, and
// in AGENTS.md's table. Nothing else looks at any of them — a wrong suffix
// still resolves, a deleted template leaves no citation for `links` to test,
// and a drifted table column reads as plausible as the truth.
rule('skill-kinds', (r) => {
  const dir = CFG.CANONICAL_SKILL_DIR;
  if (!existsSync(abs(dir))) return r.skip(MSG.skips.noDir(dir));

  const skills = readdirSync(abs(dir)).filter((x) =>
    x.startsWith(CFG.OUR_SKILL_PREFIX),
  );

  // 1. Every skill's last segment is a known kind.
  const kindOf = new Map();
  for (const skill of skills) {
    const suffix = skill.slice(skill.lastIndexOf('-') + 1);
    if (CFG.SKILL_KINDS.includes(suffix)) {
      kindOf.set(skill, suffix);
      continue;
    }
    emitMsg(
      r,
      MSG.locators.skillKindUnknown({
        skill,
        suffix,
        kinds: CFG.SKILL_KINDS,
      }),
    );
  }

  // 2. Every registered kind still has a template to start from.
  for (const kind of CFG.SKILL_KINDS) {
    const p = `${CFG.KIND_TEMPLATE_DIR}/${kind}.md`;
    if (!exists(p)) emitMsg(r, MSG.locators.kindTemplateMissing({ kind, path: p }));
  }

  // 2b. `metadata.kind` agrees with the suffix. Two statements of one fact, so
  //     the check is agreement — neither is treated as authoritative over the
  //     other, because a reader has no way to know which was updated.
  let fields = 0;
  for (const [skill, suffix] of kindOf) {
    const p = `${dir}/${skill}/SKILL.md`;
    if (!exists(p)) continue;
    const m = CFG.SKILL_KIND_FIELD.exec(frontmatterOf(p) + '\n');
    if (!m) {
      emitMsg(r, MSG.locators.kindFieldMissing({ file: p, suffix }));
      continue;
    }
    fields++;
    if (m[1] !== suffix)
      emitMsg(
        r,
        MSG.locators.kindFieldMismatch({ file: p, field: m[1], suffix }),
      );
  }

  // 3. AGENTS.md's table agrees with the name. Rows naming a skill we could not
  //    classify are left alone — rule 1 already reported that, and a second
  //    failure for one cause is noise.
  let declared = 0;
  if (exists(AGENTS)) {
    for (const { n, text } of lines(AGENTS)) {
      const m = CFG.AGENTS_SKILL_KIND_ROW.exec(text);
      if (!m) continue;
      const [, skill, kind] = m;
      const actual = kindOf.get(skill);
      if (!actual) continue;
      declared++;
      if (kind !== actual)
        emitMsg(
          r,
          MSG.locators.agentsKindMismatch({
            file: AGENTS,
            line: n,
            skill,
            declared: kind,
            actual,
          }),
        );
    }
  }

  r.note(
    MSG.notes.skillKindsChecked({
      skills: skills.length,
      kinds: CFG.SKILL_KINDS.length,
      fields,
      declared,
    }),
  );
});

/* --- 9. path isolation --------------------------------------------------- */
rule('path-isolation', (r) => {
  for (const p of PATH_FILES) {
    if (!exists(p)) continue;
    const me = posix.basename(p);
    for (const { n, text } of lines(p)) {
      for (const other of PATH_FILES.map((x) => posix.basename(x))) {
        if (other === me || !text.includes(other)) continue;
        if (suppressed('path-isolation', p, text)) continue;
        emitMsg(r, MSG.pathCitesPath({ file: p, line: n, other }));
      }
    }
  }
});

/* --- 9b. AGENTS.md carries no path-file notation -------------------------- */
// Hook IDs and kind tags only. The full ban in agents-md-format.md also covers
// the landmark icons, but those are NOT checked here: AGENTS.md legitimately
// uses emoji in its own headings, so matching icons would need the reserved-set
// distinction and would fire on correct text. A narrow rule that never cries
// wolf beats a broad one people learn to suppress — this catches the class that
// actually shipped, where an orientation table listed hook IDs and three
// separate agents each invented the same wrong meaning for one.
rule('agents-notation', (r) => {
  if (!exists(AGENTS)) return;
  const HOOK_ID = /(?<![\w-])([ABC][1-9])(?![\w-])/g;
  const isTableRow = (t) => t.trimStart().startsWith('|');
  const all = [...lines(AGENTS)];

  // An ID is resolvable when the file also names it OUTSIDE a table — the
  // legend beneath the table. A bare ID in a table cell, with nothing in the
  // file defining it, is the forward reference this rule exists to catch.
  const defined = new Set();
  for (const { text } of all) {
    if (isTableRow(text)) continue;
    for (const m of text.matchAll(HOOK_ID)) defined.add(m[1]);
  }

  for (const { n, text } of all) {
    if (suppressed('agents-notation', AGENTS, text)) continue;
    for (const m of text.matchAll(/\[(?:gated|close-out)\]/g)) {
      emitMsg(r, MSG.agentsUsesKindTag({ file: AGENTS, line: n, token: m[0] }));
    }
    if (!isTableRow(text)) continue;
    for (const m of text.matchAll(HOOK_ID)) {
      if (defined.has(m[1])) continue;
      emitMsg(r, MSG.agentsIdUndefined({ file: AGENTS, line: n, token: m[1] }));
    }
  }
});

/* --- 10. landmark grammar ------------------------------------------------- */
rule('landmarks', (r) => {
  for (const p of PATH_FILES) {
    if (!exists(p)) continue;
    for (const { n, text } of lines(p)) {
      // Only a hook gets a #### heading, and only a hook gets an {ID}.
      const h4 = /^####\s+(.*)$/.exec(text);
      if (h4) {
        if (!h4[1].startsWith('🪝')) {
          if (!suppressed('landmarks', p, text))
            emitMsg(
              r,
              MSG.locators.headingNotHook({
                file: p,
                line: n,
                heading: h4[1].slice(0, 60),
              }),
            );
        } else if (!/^🪝\s+[A-Z]\d+\s+·\s+\S/.test(h4[1])) {
          if (!suppressed('landmarks', p, text))
            emitMsg(
              r,
              MSG.locators.hookHeadingMalformed({
                file: p,
                line: n,
                heading: h4[1].slice(0, 60),
              }),
            );
        }
      }
      // A reserved icon must not appear in a heading other than its own shape.
      const h = /^(#{1,6})\s+(.*)$/.exec(text);
      if (h && h[1].length <= 3) {
        for (const icon of RESERVED_ICONS) {
          if (!h[2].includes(icon)) continue;
          if (icon === CFG.PATH_ICON && h[1].length === 1) continue; // the path's own H1
          if (suppressed('landmarks', p, text)) continue;
          emitMsg(
            r,
            MSG.locators.reservedIconMisused({
              file: p,
              line: n,
              icon,
              level: h[1].length,
            }),
          );
        }
      }
    }
  }

  // Spans:/Members: must cite hook IDs, not prose.
  for (const p of PATH_FILES) {
    if (!exists(p)) continue;
    for (const { n, text } of lines(p)) {
      const m = /\*\*(Spans|Members):\*\*\s*(.+)$/.exec(text);
      if (!m) continue;
      if (/[ABC]\d/.test(m[2])) continue;
      if (suppressed('landmarks', p, text)) continue;
      emitMsg(r, MSG.locators.spanNamesNoId({ file: p, line: n, label: m[1] }));
    }
  }
});

/* --- 11. skills must not encode control flow ----------------------------- */
rule('skill-coupling', (r) => {
  const dir = CFG.CANONICAL_SKILL_DIR;
  if (!existsSync(abs(dir))) return r.skip(MSG.skips.noDir(dir));

  // Deliberately narrow: only a hook ID or a path letter is UNAMBIGUOUS coupling.
  //
  // Gate names are NOT checked, and that is a decision, not an omission.
  // x-skill-build-helper explicitly permits a skill to head its own prerequisite
  // guard with the same words the workflow uses for a gate ("A skill's own guard
  // is not a violation"). x-ng-doc-prd-writer and x-ng-doc-tsd-writer both do exactly
  // that, legitimately. No regex separates "my contract refuses this input" from
  // "the workflow decided this upstream", so flagging gate names produces mostly
  // false positives — and a check that cries wolf gets ignored, taking the true
  // positives with it.
  const coupling = CFG.COUPLING_PATTERN;

  for (const n of readdirSync(abs(dir)).filter((x) =>
    x.startsWith(CFG.OUR_SKILL_PREFIX),
  )) {
    // The x-{tech}-{tool}-* family may reference the tool's lifecycle it edits,
    // and a skill whose SUBJECT is the workflow may name its landmarks.
    if (CFG.COUPLING_EXEMPT.test(n)) continue;
    for (const p of walk(`${dir}/${n}`)) {
      for (const { n: ln, text } of lines(p)) {
        const hit = coupling.exec(text);
        if (!hit) continue;
        if (suppressed('skill-coupling', p, text)) continue;
        emitMsg(
          r,
          MSG.skillNamesControlFlow({ file: p, line: ln, hit: hit[0] }),
        );
      }
    }
  }
});

/* --- 12. paths named inside hook scripts -------------------------------- */
rule('hook-paths', (r) => {
  // The reverse direction of hook-refs: that rule keeps hook FILENAMES out of
  // docs; this one keeps hook scripts from naming files that do not exist.
  //
  // Most such pointers have been removed — agent-facing text names the SKILL
  // (guarded by x-skills) or `pnpm run check:workflow`, so the reference sits in
  // an already-checked namespace. What legitimately remains is human-facing:
  // a person reading a systemMessage cannot invoke a skill, so they get a path.
  // That path is the one thing here worth guarding, plus any that creep back.
  const dir = '.agents/hooks';
  if (!exists(dir)) return r.skip(MSG.skips.noDir(dir));

  let checked = 0;

  // Which exemptions actually earned their keep this run. The same hygiene
  // `allowlist-hygiene` applies to suppressions: an exemption that matches
  // nothing is indistinguishable from a correct one, right up until the day it
  // silently excuses a path whose absence IS breakage.
  const optionalHit = new Set();

  for (const f of walk(dir, '.mjs')) {
    // Paths assembled from SEGMENTS — join(ROOT, '.agents', 'skills', …) — are
    // scanned over the WHOLE FILE, not line by line, because the call spans
    // several lines. These are the dangerous ones: a rename breaks them and no
    // text search for the path would ever find them. Both hooks locate the
    // checker this way, and one exits SILENTLY when it is missing, so the
    // failure would be permanent and quiet.
    const whole = read(f);
    const segCall =
      /join\(\s*ROOT\s*,\s*((?:'[^']+'\s*,\s*)*'[^']+')\s*,?\s*\)/g;
    for (const m of whole.matchAll(segCall)) {
      const p = m[1]
        .split(',')
        .map((x) => x.trim().replace(/^'|'$/g, ''))
        .filter(Boolean)
        .join('/');
      if (!p || p.includes('{')) continue;
      const ln = whole.slice(0, m.index).split(/\r?\n/).length;
      checked++;
      if (CFG.OPTIONAL_HOOK_PATHS.includes(p)) {
        optionalHit.add(p); // absence is by design
        continue;
      }
      if (exists(p)) continue;
      if (suppressed('hook-paths', f, p)) continue;
      emitMsg(r, MSG.hookSegmentPathBroken({ file: f, line: ln, path: p }));
    }
    for (const { n, text } of lines(f)) {
      if (/^\s*\/\//.test(text)) continue; // comments explain, they do not point
      for (const m of text.matchAll(
        /['"`]([.a-z]*(?:\.agents|docs)\/[A-Za-z0-9._/-]+\.(?:md|json|mjs))['"`]/g,
      )) {
        const p = m[1].replace(/^\.\//, '');
        if (p.includes('{')) continue; // a shape, not a file
        checked++;
        if (CFG.OPTIONAL_HOOK_PATHS.includes(p)) {
          optionalHit.add(p); // absence is by design
          continue;
        }
        if (exists(p)) continue;
        if (suppressed('hook-paths', f, p)) continue;
        emitMsg(r, MSG.hookPathBroken({ file: f, line: n, path: p }));
      }
    }
  }

  // An entry that exempted nothing is stale — see `staleOptionalHookPath`.
  for (const p of CFG.OPTIONAL_HOOK_PATHS) {
    if (optionalHit.has(p)) continue;
    if (suppressed('hook-paths', 'config.mjs', p)) continue;
    emitMsg(r, MSG.staleOptionalHookPath({ path: p }));
  }

  r.note(MSG.notes.hookPathsChecked(checked));
});

/* --- 13. no hook filenames in docs -------------------------------------- */
rule('hook-refs', (r) => {
  let scanned = 0;
  const targets = CFG.HOOK_REF_SURFACES.flatMap((s) =>
    s.endsWith('.md') ? [s] : walk(s),
  );

  for (const p of targets) {
    if (!exists(p)) continue;
    scanned++;
    for (const { n, text } of lines(p)) {
      for (const m of text.matchAll(CFG.HOOK_REF_PATTERN)) {
        if (suppressed('hook-refs', p, m[0])) continue;
        emitMsg(r, MSG.hookFilenameInDoc({ file: p, line: n, name: m[0] }));
      }
    }
  }
  r.note(MSG.notes.hookRefFilesScanned(scanned));
});

/* --- 13b. tool entry stubs stay pointers --------------------------------- */
// A tool entry stub is the only workflow surface a tool loads WITHOUT being
// asked. That makes it the one place where an extra paragraph is paid for on
// every turn, and where a duplicated rule is invisible: the copy reads
// correctly, and nothing compares it against the AGENTS.md original. Both
// failures have shipped in this repo — a generator block byte-identical in two
// always-loaded files, and a stub naming the workflow by a title AGENTS.md had
// already stopped using.
//
// An ABSENT stub is not a finding. A tool nobody uses in this checkout needs no
// entry file, and demanding one would invent work — so the rule reports which
// files it actually checked, and an empty list cannot be mistaken for a pass.
rule('tool-stubs', (r) => {
  const checked = [];

  for (const p of CFG.TOOL_ENTRY_STUBS) {
    if (!exists(p)) continue;
    checked.push(p);
    const all = [...lines(p)];

    for (const { n, text } of all) {
      for (const marker of CFG.GENERATOR_MARKERS) {
        if (!marker.test(text)) continue;
        if (suppressed('tool-stubs', p, text)) continue;
        emitMsg(r, MSG.locators.stubHasGeneratorBlock({ file: p, line: n }));
      }
    }

    // Frontmatter is metadata, not a section, and a fenced `#` is an example of
    // a heading rather than one — count neither, or the rule fires on a stub
    // that is doing exactly what it should.
    let inFrontmatter = all[0]?.text.trim() === '---';
    let fenced = false;
    let headings = 0;

    for (const { n, text } of all.slice(inFrontmatter ? 1 : 0)) {
      if (inFrontmatter) {
        if (text.trim() === '---') inFrontmatter = false;
        continue;
      }
      if (/^\s*(?:```|~~~)/.test(text)) {
        fenced = !fenced;
        continue;
      }
      if (fenced || !/^#{1,6}\s+\S/.test(text)) continue;
      if (++headings <= CFG.STUB_MAX_HEADINGS) continue;
      if (suppressed('tool-stubs', p, text)) continue;
      emitMsg(
        r,
        MSG.locators.stubHasSections({
          file: p,
          line: n,
          heading: text.replace(/^#+\s+/, ''),
          max: CFG.STUB_MAX_HEADINGS,
        }),
      );
    }

    const target = CFG.TOOL_STUB_TARGET;
    if (read(p).includes(target)) continue;
    if (suppressed('tool-stubs', p, target)) continue;
    emitMsg(r, MSG.locators.stubMissingTarget({ file: p, target }));
  }

  r.note(MSG.notes.toolStubsChecked(checked));
});

/* --- 14. dead message exports ------------------------------------------- */
rule('dead-messages', (r) => {
  // Two directions, both of which have actually failed here.
  //
  // ONE — a message exported but never wired. The prose then exists TWICE, here
  // and inline at the call site, with nothing keeping the two in step. 8 of 13
  // exports were dead until a review caught it. A person cannot spot it by
  // reading either file; only the comparison shows it.
  //
  // TWO — prose still sitting in the code. Scanned across EVERY sibling script
  // and in ALL THREE quote styles, because each narrower version of this scan
  // missed something real:
  //
  //   only `r.fail`/`r.skip` lines   → missed r.note tallies and console.log
  //   only '…' and "…"              → missed every backtick template, which is
  //                                    exactly what you reach for when the
  //                                    sentence has values spliced into it
  //   only check-workflow.mjs        → missed three printed labels in config.mjs
  //
  // Each hole let the tool report "no prose in the code" while prose sat in the
  // code — a false clean, which is worse than not checking at all.
  const dir = `${CFG.CANONICAL_SKILL_DIR}/x-sp-workflow-helper/scripts`;
  const msgFile = `${dir}/messages.mjs`;
  if (!exists(msgFile)) return r.skip(MSG.skips.noMessageModule);

  // Every sibling script is both a consumer of messages and a suspect for
  // holding prose. messages.mjs itself is neither.
  const siblings = walk(dir, '.mjs').filter((p) => p !== msgFile);
  if (!siblings.length) return r.skip(MSG.skips.noMessageModule);

  const names = [...read(msgFile).matchAll(/^export const (\w+)/gm)].map(
    (m) => m[1],
  );
  const allUses = siblings.map(read).join('\n');
  const dead = names.filter((n) => !allUses.includes(`MSG.${n}`));

  for (const n of dead) {
    if (suppressed('dead-messages', msgFile, n)) continue;
    emitMsg(r, MSG.deadMessageExport({ name: n }));
  }

  /**
   * Is this literal a sentence, or an address?
   *
   * Two lowercase words with a space between them is the test. A path, a
   * dotted token or a lone identifier is an address, not language.
   */
  const isProse = (t) =>
    /[a-z] [a-z]/.test(t) && !/^[\w.\/@-]+$/.test(t.trim());

  let inline = 0;
  for (const file of siblings) {
    for (const { text, line } of literalsOf(read(file))) {
      if (!isProse(text)) continue;
      if (suppressed('dead-messages', file, text)) continue;
      inline++;
      emitMsg(r, MSG.inlineString({ file, line, text: text.slice(0, 60) }));
    }
  }

  r.note(
    MSG.notes.messageAudit({
      total: names.length,
      dead: dead.length,
      inline,
      scanned: siblings.length,
    }),
  );
});

/* --- 15. stale suppressions --------------------------------------------- */
rule('allowlist-hygiene', (r) => {
  // Staleness is only decidable when every rule ran: an entry proves it is still
  // needed by being CONSULTED, and a rule that did not run consults nothing. On a
  // filtered run (`--rule=`) this would report every entry as stale — a false
  // positive, and the loudest possible kind, since the advice is "delete it".
  if (onlyRule) {
    return r.skip(MSG.skips.filteredRun(onlyRule));
  }

  if (!allowlist.length) return r.note(MSG.notes.allowlistEmpty);
  allowlist.forEach((e, i) => {
    if (allowlistHits.has(i)) return;
    emitMsg(
      r,
      MSG.staleAllowlistEntry({ index: i, rule: e.rule, file: e.file }),
    );
  });
  r.note(MSG.notes.allowlistInUse(allowlistHits.size, allowlist.length));
});

/* ------------------------------------------------------------------ runner */

if (listOnly) {
  for (const { id, title } of RULES) console.log(`${id.padEnd(20)} ${title}`);
  process.exit(0);
}

// A `--rule=` typo must not read as success. Before this guard it printed
// "All 0 rules passed" and exited 0.
if (onlyRule && !RULES.some((x) => x.id === onlyRule)) {
  console.error(
    MSG.runner.unknownRule(
      onlyRule,
      RULES.map((x) => x.id),
    ),
  );
  process.exit(1);
}

const results = [];
for (const def of RULES) {
  if (onlyRule && def.id !== onlyRule) continue;
  const res = {
    id: def.id,
    title: def.title,
    failures: [],
    notices: [],
    notes: [],
    details: [],
    skipped: null,
  };
  const r = {
    fail: (m) => res.failures.push(m),
    // Between fail and note: reported and surfaced at session start, but not a
    // failure and not an exit code. For findings that are real and unactionable
    // BY THIS READER — see emitMsg. A note is a tally; a notice wants attention.
    notice: (m) => res.notices.push(m),
    detail: (m) => res.details.push(m),
    note: (m) => res.notes.push(m),
    skip: (m) => {
      res.skipped = m;
    },
  };
  try {
    def.fn(r);
  } catch (err) {
    res.failures.push(MSG.runner.ruleCrashed(err.message));
  }
  results.push(res);
}

// allowlist-hygiene must observe the other rules, so it runs last by position.

const failed = results.filter((x) => x.failures.length);
const totalFailures = failed.reduce((n, x) => n + x.failures.length, 0);

if (asJson) {
  console.log(
    JSON.stringify(
      { ok: totalFailures === 0, totalFailures, results },
      null,
      2,
    ),
  );
} else {
  for (const res of results) {
    const mark = res.skipped
      ? 'SKIP'
      : res.failures.length
        ? 'FAIL'
        : res.notices.length
          ? 'NOTE'
          : ' OK ';
    console.log(`[${mark}] ${res.id} — ${res.title}`);
    if (res.skipped) console.log(`       ${res.skipped}`);
    for (const f of res.failures) console.log(`       ✗ ${f}`);
    for (const nc of res.notices) console.log(`       ! ${nc}`);
    for (const d of res.details) console.log(`       ${d}`);
    if (!res.failures.length)
      for (const nt of res.notes) console.log(`       · ${nt}`);
  }
  const totalNotices = results.reduce((n, x) => n + x.notices.length, 0);
  const passedCount = results.filter((x) => !x.skipped).length;
  console.log();
  console.log(
    totalFailures > 0
      ? MSG.runner.failures(totalFailures, failed.length)
      : totalNotices > 0
        ? MSG.runner.passedWithNotices(passedCount, totalNotices)
        : MSG.runner.allPassed(passedCount),
  );
}

process.exit(totalFailures === 0 ? 0 : 1);
