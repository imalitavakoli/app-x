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
import * as CFG from './workflow-config.mjs';

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

/** Frontmatter `description:` as a raw single line (quotes and all). */
function descriptionOf(p) {
  const m = /^description:[ \t]*([\s\S]*?)(?=\n[a-zA-Z_-]+:|$)/m.exec(
    frontmatterOf(p),
  );
  return m ? m[1].trim().replace(/\s+/g, ' ') : null;
}

/* ---------------------------------------------------------------- constants */

const AGENTS = CFG.AGENTS_FILE;
const PATH_FILES = CFG.PATH_LETTERS.map(CFG.pathFile);
const WORKFLOW_DOCS = [AGENTS, ...walk(CFG.WORKFLOW_DOC_DIR)];
const RESERVED_ICONS = CFG.RESERVED_ICONS;

/** Locate the installed Superpowers skills dir, or null when unavailable. */
function findSuperpowersSkills() {
  const home = process.env.USERPROFILE || process.env.HOME;
  if (!home) return null;
  const base = join(home, ...CFG.SP_CACHE_SEGMENTS);
  if (!existsSync(base)) return null;
  const versions = readdirSync(base)
    .filter((d) => /^\d+\.\d+\.\d+$/.test(d))
    .sort((a, b) =>
      a
        .split('.')
        .map(Number)
        .reduce((x, y, i) => x || y - Number(b.split('.')[i]), 0),
    );
  for (const v of versions.reverse()) {
    const s = join(base, v, CFG.SP_SKILLS_SUBDIR);
    if (existsSync(s)) return { dir: s, version: v };
  }
  return null;
}

/* ---------------------------------------------------------------- allowlist */

const allowlistPath = join(SKILL_DIR, 'scripts', 'allowlist.json');
const allowlist = existsSync(allowlistPath)
  ? (JSON.parse(readFileSync(allowlistPath, 'utf8')).allow ?? [])
  : [];
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

/* -------------------------------------------------------------------- rules */

const RULES = [];
const rule = (id, title, fn) => RULES.push({ id, title, fn });

/* --- 1. hook IDs ---------------------------------------------------------- */
rule('hook-ids', 'Every cited hook ID resolves to a real hook heading', (r) => {
  const defined = new Map(); // id -> file
  for (const p of PATH_FILES) {
    if (!exists(p)) continue;
    for (const { text } of lines(p)) {
      const m = /^####\s+🪝\s+([A-Z]\d+)\b/.exec(text);
      if (m) defined.set(m[1], p);
    }
  }
  r.note(
    `${defined.size} hook IDs defined: ${[...defined.keys()].join(' · ')}`,
  );

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
        r.fail(`${p}:${n} cites hook \`${id}\`, which no path file defines`);
      }
    }
  }
});

/* --- 2. link + path targets ---------------------------------------------- */
rule('links', 'Every cited file path exists', (r) => {
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
        r.fail(
          `${p}:${n} cites \`${t}\` — no such file or directory (resolved to ${resolved})`,
        );
      }
    }
  }

  // Skill-internal navigation links (SKILL.md -> references/, assets/, …).
  // ONLY markdown links here, never backticked paths: a skill legitimately
  // shows illustrative paths as sample content (`docs/x/{name}/PRD/README.md`,
  // and concrete example names that no functionality has yet), and checking
  // those would fail on documentation doing its job.
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
          r.fail(
            `${p}:${n} links to \`${t}\` — no such file (resolved to ${resolved})`,
          );
        }
      }
    }
  }
  r.note(
    `${checked} doc path citations + ${internal} skill-internal links checked`,
  );
});

/* --- 3. anchors ---------------------------------------------------------- */
rule('anchors', 'Every cited #anchor resolves to a real heading', (r) => {
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
        r.fail(
          `${p}:${n} cites \`#${anchor}\` in ${target} — no heading yields that slug under any renderer rule`,
        );
      }
    }
  }
  r.note(`${checked} anchor citations checked`);
});

/* --- 4. Superpowers skills exist ---------------------------------------- */
rule('sp-skills', 'Every Superpowers skill we anchor to is installed', (r) => {
  const sp = findSuperpowersSkills();
  if (!sp)
    return r.skip(
      'Superpowers not installed — sp-version owns that failure; nothing to verify anchors against',
    );
  r.note(`checked against installed Superpowers ${sp.version}`);
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
        r.fail(
          `${p}:${n} — the ${kind.name} names \`${name}\`, which is NOT an installed Superpowers skill (${sp.version}). The lifecycle moment it marks still governs: re-anchor it, and never silently substitute a similar-looking skill.`,
        );
      }
    }
  }
  r.note(
    Object.entries(counts)
      .map(([k, v]) => `${v} at ${k}s`)
      .join(', ') + ' — verified by position, no name list',
  );
});

/* --- 5. reviewed-against Superpowers version ---------------------------- */
rule(
  'sp-version',
  'Superpowers is enabled, installed, and at the version we reviewed against',
  (r) => {
    // ENABLEMENT FIRST — files on disk prove nothing about whether the plugin is
    // actually loaded. A real incident: the working entry was set to false while a
    // pinned entry was added that never installed. Superpowers went dark for a
    // whole session, and this rule reported green, because the old version was
    // still sitting in the cache. Checking the cache alone is checking the wrong
    // thing.
    const settingsPath = '.claude/settings.json';
    if (exists(settingsPath)) {
      let cfg;
      try {
        cfg = JSON.parse(read(settingsPath));
      } catch {
        cfg = null;
      }
      const entries = Object.entries(cfg?.enabledPlugins ?? {}).filter(([k]) =>
        k.startsWith('superpowers@'),
      );

      if (entries.length && entries.every(([, v]) => v === false)) {
        r.fail(
          `${settingsPath} sets every Superpowers plugin entry to false ` +
            `(${entries.map(([k]) => k).join(', ')}). Project settings outrank user settings, so ` +
            'Superpowers is DISABLED for everyone on this repo — and the whole workflow with it.',
        );
        r.detail(
          '  Enable exactly one entry whose marketplace is actually installed.',
        );
        return;
      }

      // Enabled, but from a marketplace with nothing in the plugin cache: the
      // marketplace registered and the plugin never installed. Registering a
      // marketplace is not installing from it.
      const cacheRoot = join(
        process.env.USERPROFILE || process.env.HOME || '',
        '.claude',
        'plugins',
        'cache',
      );
      for (const [key, val] of entries) {
        // Enabled means `true` OR a non-empty version-constraint array — both resolve a
        // plugin, so both need a marketplace that actually has one.
        const enabled = val === true || (Array.isArray(val) && val.length > 0);
        if (!enabled) continue;
        const market = key.split('@')[1];
        if (market && existsSync(join(cacheRoot, market))) continue;
        r.fail(
          `${settingsPath} enables \`${key}\` but no plugin cache exists for marketplace ` +
            `\`${market}\` — the marketplace may be registered while the plugin was never ` +
            'installed from it. That silently disables Superpowers.',
        );
        r.detail(
          `  Check ~/.claude/plugins/cache/${market}/ and ~/.claude/plugins/marketplaces/${market}/.`,
        );
        return;
      }
    }

    const sp = findSuperpowersSkills();

    // ABSENT is worse than MISMATCHED, so it fails rather than skips. Every path
    // routes through Superpowers and every hook anchors to one of its skills, so
    // without it the workflow is not degraded — it is inoperative. This rule owns
    // that report; sp-skills only skips, to keep one root cause to one failure.
    if (!sp) {
      r.fail(
        'Superpowers is NOT INSTALLED (no version found in the plugin cache). The whole ' +
          'Superpowers-First Workflow is inoperative without it: every path routes through it and ' +
          'every hook anchors to one of its skills.',
      );
      r.detail(
        '  It is declared in .claude/settings.json (enabledPlugins + extraKnownMarketplaces),',
      );
      r.detail(
        '  so Claude Code installs it at startup — this means that install did not happen.',
      );
      r.detail(
        '  Do NOT hand-install it or work around it: find out why (offline, network policy,',
      );
      r.detail(
        '  marketplace unreachable, plugins disabled) and tell the user. Running a cycle',
      );
      r.detail(
        '  without it produces work that only looks like it followed the workflow.',
      );
      return;
    }

    const baselinePath = join(SKILL_DIR, 'scripts', CFG.SP_BASELINE_FILE);
    if (!existsSync(baselinePath)) {
      return r.fail(
        `no baseline at scripts/${CFG.SP_BASELINE_FILE} — nothing records which Superpowers version ` +
          `this workflow was reviewed against. Installed: ${sp.version}.`,
      );
    }

    let baseline;
    try {
      baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
    } catch (err) {
      return r.fail(
        `scripts/${CFG.SP_BASELINE_FILE} is not valid JSON: ${err.message}`,
      );
    }

    const reviewed = baseline.reviewed ?? 'an unrecorded date';
    if (baseline.version === sp.version) {
      return r.note(`reviewed against ${baseline.version} on ${reviewed}`);
    }

    // Which semver segment moved decides how loud this is (CFG.VERSION_DRIFT_POLICY).
    const seg = (v) => String(v).split('.').map(Number);
    const [bMaj, bMin] = seg(baseline.version);
    const [iMaj, iMin] = seg(sp.version);
    const tier = iMaj !== bMaj ? 'major' : iMin !== bMin ? 'minor' : 'patch';
    const action = CFG.VERSION_DRIFT_POLICY[tier] ?? 'fail';

    const why = {
      major: 'A major bump is breaking by declaration.',
      minor:
        'A minor bump adds features — and specifically may add SKILLS: a new skill whose ' +
        'description claims "design work" or "a defect" can start winning the routing match and ' +
        'silently change which path fires.',
      patch:
        'A patch is usually fixes, so this is reported rather than escalated — but note that ' +
        'nothing obliges a patch to leave our prose-enforced dependencies alone.',
    }[tier];

    const drift =
      `Superpowers is at ${sp.version}; this workflow was reviewed against ` +
      `${baseline.version} (${reviewed}) — a ${tier.toUpperCase()} difference.`;

    if (action === 'ignore') return r.note(`${drift} Ignored by policy.`);

    if (action === 'note') {
      r.note(`${drift} ${why}`);
      r.note(
        '  Spot-check references/superpowers-upgrade.md → Prose-enforced if you are touching ' +
          'the workflow. Raise VERSION_DRIFT_POLICY.patch to "fail" to gate on this instead.',
      );
      return;
    }

    r.fail(
      `${drift} ${why} Our layer relies on behaviours Superpowers does not know it promises, ` +
        'so the change cannot fail loudly on its own.',
    );
    r.detail(
      '  Work through references/superpowers-upgrade.md, then record the result:',
    );
    r.detail(
      `  set version to "${sp.version}" in scripts/${CFG.SP_BASELINE_FILE} with today's date.`,
    );
    r.detail(
      '  Editing the baseline without doing the review only silences the one thing that noticed.',
    );
  },
);

/* --- 6. workspace skills + stubs ---------------------------------------- */
rule(
  'x-skills',
  'Workspace skills exist, and every stub matches its canonical',
  (r) => {
    const canonicalDir = CFG.CANONICAL_SKILL_DIR;
    const stubDirs = CFG.STUB_SKILL_DIRS;
    const isX = (n) => n.startsWith(CFG.OUR_SKILL_PREFIX);
    const canon = existsSync(abs(canonicalDir))
      ? readdirSync(abs(canonicalDir)).filter(
          (n) => isX(n) && exists(`${canonicalDir}/${n}/SKILL.md`),
        )
      : [];
    r.note(`${canon.length} workspace skills: ${canon.join(' · ')}`);

    // Named in AGENTS.md but absent from disk. NOTE: skill names contain digits
    // (x-ng-test-e2e-helper), so the character class must include 0-9.
    const named = new Set();
    for (const m of read(AGENTS).matchAll(/`(x-[a-z0-9-]+)`/g)) named.add(m[1]);
    for (const n of [...named].sort()) {
      if (!canon.includes(n))
        r.fail(
          `${AGENTS} names \`${n}\`, which does not exist under ${canonicalDir}/`,
        );
    }

    for (const n of canon) {
      const c = `${canonicalDir}/${n}/SKILL.md`;

      const fmName = (/^name:[ \t]*['"]?([^'"\n]+)/m.exec(read(c)) ||
        [])[1]?.trim();
      if (fmName !== n)
        r.fail(`${c} has \`name: ${fmName}\` but lives in folder \`${n}\``);

      // Every stub location, not just one — the stub table is per AI tool and
      // grows. A skill stubbed for one tool and missed for another is invisible
      // to that tool, which is exactly how the x-* skills were once invisible to
      // Claude Code's Skill tool.
      for (const stubDir of stubDirs) {
        const s = `${stubDir}/${n}/SKILL.md`;

        if (!exists(s)) {
          r.fail(
            `${n} has no stub at ${s} — invisible to whichever tool discovers skills there`,
          );
          continue;
        }

        const dc = descriptionOf(c);
        const ds = descriptionOf(s);
        if (dc !== ds) {
          r.fail(
            `${n}: ${stubDir} stub description has drifted from canonical — the tool matches on the stale text`,
          );
          r.detail(`  canonical: ${dc}`);
          r.detail(`  stub     : ${ds}`);
        }
        if (/^metadata:/m.test(read(s)))
          r.fail(
            `${s} carries \`metadata\` — stubs are name + description only`,
          );
      }
    }

    // Orphan stubs, in every stub location.
    for (const stubDir of stubDirs) {
      if (!existsSync(abs(stubDir))) continue;
      for (const n of readdirSync(abs(stubDir))) {
        if (!isX(n)) continue;
        if (!canon.includes(n))
          r.fail(`${stubDir}/${n} is an orphan stub — no canonical skill`);
      }
    }
    r.note(`stub locations checked: ${stubDirs.join(' · ')}`);
  },
);

/* --- 7. version discipline ---------------------------------------------- */
rule('versions', 'Every workspace skill carries a block-form semver', (r) => {
  const dir = CFG.CANONICAL_SKILL_DIR;
  if (!existsSync(abs(dir))) return r.skip(`no ${dir}`);
  for (const n of readdirSync(abs(dir)).filter((x) =>
    x.startsWith(CFG.OUR_SKILL_PREFIX),
  )) {
    const p = `${dir}/${n}/SKILL.md`;
    if (!exists(p)) continue;
    const fm = frontmatterOf(p);
    if (/metadata:[ \t]*\{/.test(fm)) {
      r.fail(`${p} uses inline metadata — use block form`);
      continue;
    }
    const m =
      /^metadata:[ \t]*\r?\n(?:[ \t]+.*\r?\n)*?[ \t]+version:[ \t]*'(\d+\.\d+\.\d+)'/m.exec(
        fm + '\n',
      );
    if (!m)
      r.fail(`${p} has no \`version: 'x.y.z'\` under a block \`metadata:\``);
  }
});

/* --- 8. path isolation --------------------------------------------------- */
rule('path-isolation', 'No path file cites another path file', (r) => {
  for (const p of PATH_FILES) {
    if (!exists(p)) continue;
    const me = posix.basename(p);
    for (const { n, text } of lines(p)) {
      for (const other of PATH_FILES.map((x) => posix.basename(x))) {
        if (other === me || !text.includes(other)) continue;
        if (suppressed('path-isolation', p, text)) continue;
        r.fail(
          `${p}:${n} cites ${other} — a path may never cite another path; extract to sp-workflow-shared.md or sp-workflow-procedures.md`,
        );
      }
    }
  }
});

/* --- 9. landmark grammar ------------------------------------------------- */
rule(
  'landmarks',
  'Landmark headings and reserved icons follow the notation',
  (r) => {
    for (const p of PATH_FILES) {
      if (!exists(p)) continue;
      for (const { n, text } of lines(p)) {
        // Only a hook gets a #### heading, and only a hook gets an {ID}.
        const h4 = /^####\s+(.*)$/.exec(text);
        if (h4) {
          if (!h4[1].startsWith('🪝')) {
            if (!suppressed('landmarks', p, text))
              r.fail(
                `${p}:${n} — \`####\` heading is not a 🪝 hook: "${h4[1].slice(0, 60)}"`,
              );
          } else if (!/^🪝\s+[A-Z]\d+\s+·\s+\S/.test(h4[1])) {
            if (!suppressed('landmarks', p, text))
              r.fail(
                `${p}:${n} — hook heading does not match \`🪝 {ID} · {when}\`: "${h4[1].slice(0, 60)}"`,
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
            r.fail(
              `${p}:${n} — reserved landmark icon ${icon} used in a level-${h[1].length} heading`,
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
        r.fail(
          `${p}:${n} — \`${m[1]}:\` names no hook ID; it must address hooks by \`{ID}\`, never in prose`,
        );
      }
    }
  },
);

/* --- 10. skills must not encode control flow ----------------------------- */
rule(
  'skill-coupling',
  'Skills do not name workflow landmarks (control flow stays in the docs)',
  (r) => {
    const dir = CFG.CANONICAL_SKILL_DIR;
    if (!existsSync(abs(dir))) return r.skip(`no ${dir}`);

    // Deliberately narrow: only a hook ID or a path letter is UNAMBIGUOUS coupling.
    //
    // Gate names are NOT checked, and that is a decision, not an omission.
    // x-skill-build-helper explicitly permits a skill to head its own prerequisite
    // guard with the same words the workflow uses for a gate ("A skill's own guard
    // is not a violation"). x-ng-prd-writer and x-ng-tfs-writer both do exactly
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
          r.fail(
            `${p}:${ln} names workflow control flow ("${hit[0]}") — state the substance the skill owns instead`,
          );
        }
      }
    }
  },
);

/* --- 11. stale suppressions --------------------------------------------- */
rule('allowlist-hygiene', 'No stale allowlist entries', (r) => {
  if (!allowlist.length) return r.note('allowlist is empty');
  allowlist.forEach((e, i) => {
    if (allowlistHits.has(i)) return;
    r.fail(
      `allowlist entry ${i} (${e.rule} / ${e.file}) matched nothing — the text it suppressed is gone, so delete it`,
    );
  });
  r.note(
    `${allowlistHits.size}/${allowlist.length} allowlist entries still in use`,
  );
});

/* ------------------------------------------------------------------ runner */

if (listOnly) {
  for (const { id, title } of RULES) console.log(`${id.padEnd(20)} ${title}`);
  process.exit(0);
}

const results = [];
for (const def of RULES) {
  if (onlyRule && def.id !== onlyRule) continue;
  const res = {
    id: def.id,
    title: def.title,
    failures: [],
    notes: [],
    details: [],
    skipped: null,
  };
  const r = {
    fail: (m) => res.failures.push(m),
    detail: (m) => res.details.push(m),
    note: (m) => res.notes.push(m),
    skip: (m) => {
      res.skipped = m;
    },
  };
  try {
    def.fn(r);
  } catch (err) {
    res.failures.push(`rule crashed: ${err.message}`);
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
    const mark = res.skipped ? 'SKIP' : res.failures.length ? 'FAIL' : ' OK ';
    console.log(`[${mark}] ${res.id} — ${res.title}`);
    if (res.skipped) console.log(`       ${res.skipped}`);
    for (const f of res.failures) console.log(`       ✗ ${f}`);
    for (const d of res.details) console.log(`       ${d}`);
    if (!res.failures.length)
      for (const nt of res.notes) console.log(`       · ${nt}`);
  }
  console.log();
  console.log(
    totalFailures === 0
      ? `All ${results.filter((x) => !x.skipped).length} rules passed.`
      : `${totalFailures} failure(s) across ${failed.length} rule(s).`,
  );
}

process.exit(totalFailures === 0 ? 0 : 1);
