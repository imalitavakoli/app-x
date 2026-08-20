// Everything about the workflow that CAN CHANGE, in one place.
//
// check-workflow.mjs holds only the logic that verifies these; this file holds
// what is being verified. When the notation gains a landmark, a doc moves, or a
// renderer changes its slug rule, edit here — not the checker.
//
// Deliberately NOT in this file: any list of Superpowers skill names. Those are
// upstream's to change, and a hardcoded copy rots silently — a renamed skill
// simply drops off the list and stops being checked. The checker finds them by
// POSITION instead (see ATTACH_POINTS below): whatever sits in a hook heading,
// an ⚪ line, or a `today \`…\`` marker is an anchor, whatever it is called.

/* ------------------------------------------------------- surfaces we govern */

/** Read every turn; holds the workflow's routing section. */
export const AGENTS_FILE = 'AGENTS.md';

/** Directory holding the path files and their supporting docs. */
export const WORKFLOW_DOC_DIR = 'docs/agents';

/** The path files, in order. Add a letter here when a path is added. */
export const PATH_LETTERS = ['a', 'b', 'c'];
export const pathFile = (letter) =>
  `${WORKFLOW_DOC_DIR}/sp-workflow-path-${letter}.md`;

/** Where workspace skills live, and the prefix that marks one as ours. */
export const CANONICAL_SKILL_DIR = '.agents/skills';
export const OUR_SKILL_PREFIX = 'x-';

/**
 * Every directory a tool needs its own pointer stub in. `x-skill-build-helper`
 * keeps the authoritative table ("Add a row when a new tool needs its own
 * location") — mirror it here when a row is added, and the x-skills rule will
 * check the new location for all of: stub present, description byte-identical,
 * no `metadata`, and no orphans.
 *
 * A list, not a single path, because that skill already anticipates more than
 * one tool. Tools that read `.agents/skills/` directly need no entry.
 */
export const STUB_SKILL_DIRS = ['.claude/skills'];

/** Directory prefixes that may be cited as repo-root-relative paths. */
export const CITABLE_ROOTS = ['docs', 'apps', 'libs', 'tools'];

/* ------------------------------------------------------- landmark notation */

/** The reserved landmark icons, per docs/agents/sp-workflow-format.md.
 *  Adding a landmark means adding its icon here AND to that catalog. */
export const RESERVED_ICONS = ['🛣️', '🪝', '🚪', '⚪', '🎛️', '▶️', '🚧', '📌'];

/** A hook ID: one path letter + one digit. Widen if paths ever go past 9 hooks
 *  or past letter C — and note PATH_LETTERS must agree. */
export const HOOK_ID = /[A-Z]\d/;

/** A hook's `####` heading must match this exactly: `🪝 {ID} · {when}`. */
export const HOOK_HEADING = /^🪝\s+([A-Z]\d+)\s+·\s+\S/;

/** Lines that declare a set or a constraint's span, which must address hooks
 *  by {ID} rather than in prose. */
export const SPAN_LINE = /\*\*(Spans|Members):\*\*\s*(.+)$/;

/* --------------------------------------------------------- attach points */

/**
 * Where a Superpowers skill name is load-bearing. A backticked name in any of
 * these positions is an ANCHOR: if it is not installed, the thing it marks
 * never happens, and nothing reports it.
 *
 * This is the mechanism that replaces a hardcoded name list. It keeps working
 * across upstream renames because it matches on WHERE the name sits, not on
 * what the name is — and it catches single-word names (`brainstorming`) that no
 * token-shape pattern can distinguish from ordinary prose.
 */
export const ATTACH_POINTS = [
  { name: 'hook heading', test: (line) => /^####\s+🪝/.test(line) },
  { name: '⚪ line', test: (line) => /^⚪/.test(line) },
  { name: 'routing marker', test: (line) => /\btoday\s+`/.test(line) },
];

/** Extracts candidate skill names from an attach-point line. */
export const SKILL_NAME_IN_LINE = /`([a-z][a-z0-9]*(?:-[a-z0-9]+)*)`/g;

/* ------------------------------------------------- skill coupling boundary */

/**
 * Naming THIS is unambiguous coupling of a skill to one workflow's shape.
 *
 * Gate names are deliberately absent: x-skill-build-helper permits a skill to
 * head its own prerequisite guard with the same words the workflow uses for a
 * gate, and two writers legitimately do. No pattern separates own-guard from
 * coupling, and a check that cries wolf gets ignored along with its true
 * positives.
 */
export const COUPLING_PATTERN =
  /\bhook\s+[ABC]\d\b|\bPath\s+[ABC]\b(?!\s*(?:file|files))/;

/** Skills exempt from COUPLING_PATTERN, and why:
 *  - `x-{tech}-{tool}-*` operates on another tool's artifact inside that tool's
 *    lifecycle, so it may reference that lifecycle.
 *  - a skill whose SUBJECT is the workflow must name its landmarks. */
export const COUPLING_EXEMPT = /^x-([a-z]+-)?sp-/;

/* ------------------------------------------------------- hook references */

/**
 * Surfaces that must NOT name a hook script by filename, and the pattern that
 * counts as naming one.
 *
 * Why a prohibition rather than an existence check: a hook can be renamed, and
 * then every doc that named it is wrong — which happened here (one rename left
 * five stale references across three files). What cannot go stale is the EVENT
 * it fires on (`SessionStart`, `PreToolUse`, `PostToolUse` — Claude Code's own
 * vocabulary) and the job it does. So docs name those, and point at
 * `.claude/settings.json`, which is the registry of what is actually wired.
 *
 * `.claude/settings.json` and `.claude/skills/…` stub paths stay allowed: the
 * first IS the registry, and the second is a convention this workspace owns.
 */
export const HOOK_REF_SURFACES = ['.agents/skills', 'docs', 'AGENTS.md'];
export const HOOK_REF_PATTERN = /\.claude\/hooks\/[A-Za-z0-9._-]+/g;

/* -------------------------------------------------- installed Superpowers */

/** Path segments from the user's home to the Superpowers version directories.
 *  Re-verify after any Claude Code plugin-layout change. */
export const SP_CACHE_ROOT_SEGMENTS = ['.claude', 'plugins', 'cache'];

/**
 * The plugin's name as Claude Code knows it. It appears in two shapes, and this
 * constant is the single source for both:
 *   - the cache path:      ~/.claude/plugins/cache/{marketplace}/{THIS}/{version}/
 *   - the settings key:    enabledPlugins["{THIS}@{marketplace}"]
 *
 * The MARKETPLACE is deliberately NOT a constant — it is discovered by scanning
 * the cache root. Superpowers can legitimately arrive from a marketplace with any
 * name (upstream's, or one this workspace declares in order to select a version),
 * and hardcoding one means the check cries "NOT INSTALLED" the day that changes.
 * A false alarm from the guard is worse than no guard. Scanning also surfaces
 * what a fixed path cannot: the same plugin cached under two marketplaces, which
 * loads every skill twice with no warning from anything else.
 *
 * ┌─ IF YOU EVER OBTAIN SUPERPOWERS DIFFERENTLY — READ THIS ────────────────┐
 * │ Changing the MARKETPLACE (a pinned catalog, a repo-local one, a plugin  │
 * │ that selects a version) needs NO change here — that is the whole point  │
 * │ of discovering it.                                                      │
 * │                                                                         │
 * │ Changing the PLUGIN NAME does. If Superpowers ever ships bundled inside │
 * │ a differently-named plugin of ours, this constant is the one edit that  │
 * │ keeps `sp-version` and `sp-skills` working — and without it they report │
 * │ "NOT INSTALLED" while Superpowers is loaded and fine. If the bundle     │
 * │ carries Superpowers under a nested path rather than at the plugin root, │
 * │ `findSuperpowersSkills` in check-workflow.mjs needs the deeper path too.│
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export const SP_PLUGIN_NAME = 'superpowers';

/** Subdirectory of a version holding the skills. */
export const SP_SKILLS_SUBDIR = 'skills';

/** The reviewed-against version record, relative to this scripts/ directory.
 *  State, not config — it changes when an upgrade review is completed, not when
 *  the notation changes. See the file's own `$comment`. */
export const SP_BASELINE_FILE = 'superpowers-baseline.json';

/**
 * How much version drift from the reviewed baseline is worth reporting, per
 * semver segment: 'fail' (loud, and the session-start hook escalates), 'note'
 * (recorded in the checker output, no escalation), or 'ignore'.
 *
 * Why not exact-match everything: a gate that fires on every patch-level change
 * is a gate people learn to silence, and then it is worth nothing when it matters.
 *
 * Why not major-only either — the tempting simplification: semver promises
 * something about an API, and we do not depend on an API. Our dependencies are
 * a dozen PROSE SENTENCES inside Superpowers' own skill files (see
 * references/superpowers-upgrade.md → Prose-enforced). Nothing obliges a patch
 * release to leave those sentences alone, and the one real incident in this
 * repo's history — a hook anchored to a skill that turned out to be reachable
 * only from one other skill — was exactly that: a behaviour difference with no
 * version signal at all.
 *
 * So the line is drawn where the cost/benefit actually sits:
 *  - major: breaking by declaration.
 *  - minor: new features, and specifically new SKILLS — a new skill whose
 *    description claims "design work" or "a defect" can start winning the
 *    routing match and silently change which path fires.
 *  - patch: usually fixes. Reported, not escalated.
 *
 * ACCEPTED RISK: a patch release that rewords a prose dependency slips past
 * with only a note. That is deliberate, not an oversight. Raise `patch` to
 * 'fail' if you would rather pay the noise.
 */
export const VERSION_DRIFT_POLICY = {
  major: 'fail',
  minor: 'fail',
  patch: 'note',
};

/* -------------------------------------------------------- anchor slugging */

/**
 * Heading -> anchor slug, one entry per algorithm a renderer we actually read
 * these files in implements. A citation is valid if it matches ANY of them.
 *
 * Add an entry ONLY with a reference to the implementation it mirrors. An
 * invented "and maybe it also trims" variant makes broken links pass, which is
 * a silent false negative — the exact failure this checker exists to catch.
 *
 * Both current entries strip emoji and both leave a LEADING HYPHEN when a
 * heading starts with one, which is why `## 🦸 Title` is never `#title`.
 */
export const SLUG_RULES = [
  {
    // github-slugger — GitHub, and anything on remark/rehype-slug.
    name: 'github-slugger',
    slug: (t) =>
      t
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\p{Pc}\p{Zs}_-]+/gu, '')
        .replace(/\p{Zs}/gu, '-'),
  },
  {
    // vscode-markdown-languageservice githubSlugifier — VS Code preview.
    name: 'vscode',
    slug: (t) =>
      t
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}\p{M}\p{Pc}-]/gu, ''),
  },
];

/* ----------------------------------------------------------- derived helpers */

/** The 🛣️ path icon — the one reserved icon that legitimately heads an H1. */
export const PATH_ICON = RESERVED_ICONS[0];

/** Matches a backticked repo-root-relative path citation, optionally with an
 *  #anchor. Built from CITABLE_ROOTS so adding a root is a one-line edit. */
export const citablePathPattern = (withAnchor = false) =>
  new RegExp(
    '`(/?(?:' +
      CITABLE_ROOTS.join('|') +
      ')/[A-Za-z0-9._{}/-]*' +
      (withAnchor ? '#[a-z0-9-]+' : '') +
      ')`',
    'g',
  );
