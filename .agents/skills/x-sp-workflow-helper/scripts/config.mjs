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

// Imports messages.mjs for the three ATTACH_POINTS labels: their line tests are
// knobs and belong here, but their NAMES are printed in the count line, and every
// string this tool prints lives in messages.mjs.
import * as MSG from './messages.mjs';

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

/**
 * A TOOL's entry stub — not a skill's. Both are pointers, and confusing them is
 * easy, so: `STUB_SKILL_DIRS` above is where one SKILL gets a per-tool copy of
 * its `description`; this is the single file a TOOL reads first, whose only job
 * is to send that tool to `AGENTS.md`.
 *
 * They are governed because a tool loads its own stub on EVERY turn while
 * `AGENTS.md` is reached by an explicit read — so anything that accumulates
 * here is paid for unconditionally, and a rule copied here drifts from the one
 * `AGENTS.md` owns. Both have happened: the nx block sat byte-identical in
 * `CLAUDE.md` and `AGENTS.md`, and a stub still named the workflow by a title
 * `AGENTS.md` had already stopped using.
 *
 * Add a row when a tool needs its own entry file. Tools that read `AGENTS.md`
 * directly need none — an entry here would be a second always-loaded surface
 * for no gain.
 */
export const TOOL_ENTRY_STUBS = [
  'CLAUDE.md',
  '.github/copilot-instructions.md',
  '.agent/rules/instructions.md',
];

/** What every tool entry stub must send its tool to. */
export const TOOL_STUB_TARGET = 'AGENTS.md';

/**
 * A generator's marker block, which must never live in a tool entry stub.
 *
 * A REGEX rather than a string on purpose, and not only for tidiness: the
 * `dead-messages` scan flags any string literal in a sibling script that reads
 * as a sentence (two lowercase words with a space), and this marker's text
 * would qualify. Regex literals are skipped by that scanner.
 *
 * Today's only entry is Nx's, which `nx configure-ai-agents` writes into the
 * entry file of every agent it is asked to configure. Its own generator appends
 * a fresh block when the markers are absent, so removing one is not permanent —
 * this rule is what makes the reappearance loud instead of silent.
 */
export const GENERATOR_MARKERS = [/<!--\s*nx configuration start\s*-->/];

/**
 * Headings allowed in a tool entry stub: exactly one, its own title.
 *
 * A second heading means the file has grown SECTIONS, which is the observable
 * shape of a stub that has started teaching instead of pointing. Deliberately
 * not a line or byte budget: a cap invites trimming wording to pass, while the
 * failure being caught is a whole rule taking up residence. One heading is also
 * checkable without judgement, which a "too long" threshold never is.
 */
export const STUB_MAX_HEADINGS = 1;

/**
 * The skill kinds. A workspace skill's LAST name segment is its kind, and the
 * kind names its template — both are `x-skill-build-helper`'s rules, and
 * `skill-kinds` is what stops either drifting.
 *
 * Adding an entry is a deliberate act, not bookkeeping: that skill tells an
 * author to ASK rather than coin a fifth kind, so a new entry here is the record
 * that the conversation happened. Removing one is how a kind is retired — the
 * rule then fails on any skill still carrying that suffix, which is the point.
 */
export const SKILL_KINDS = [
  'writer',
  'helper',
  'scaffolder',
  'editor',
  'enricher',
  'reviewer',
  'runner',
];

/**
 * `kind:` under a block `metadata:` — the second, machine-readable statement of
 * the same fact the name's suffix carries. Two statements can disagree, which is
 * why `skill-kinds` reads both and compares them rather than trusting either.
 */
export const SKILL_KIND_FIELD =
  /^metadata:[ \t]*\r?\n(?:[ \t]+.*\r?\n)*?[ \t]+kind:[ \t]*([a-z-]+)[ \t]*$/m;

/**
 * Where each kind's starting template lives.
 *
 * Checked separately from the `links` rule on purpose: `links` proves the
 * template link inside a `SKILL.md` resolves, this proves the KIND LIST above
 * agrees with what is on disk. A kind whose template was renamed away has a
 * valid-looking entry here and leaves every future author of that kind with
 * nothing to start from — and no citation anywhere for `links` to test.
 */
export const KIND_TEMPLATE_DIR = `${CANONICAL_SKILL_DIR}/x-skill-build-helper/assets/templates`;

/**
 * The workspace-skills table in `AGENTS.md`: a row names a skill and declares
 * its kind. That column is a second copy of the suffix already in the skill's
 * name, so it can disagree with it — silently, since both readings are
 * plausible. This pattern is what `skill-kinds` reads it with.
 */
export const AGENTS_SKILL_KIND_ROW =
  /^\|\s*`(x-[a-z0-9-]+)`\s*\|\s*([a-z-]+)\s*\|/;

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
  {
    name: MSG.labels.attachHookHeading,
    test: (line) => /^####\s+🪝/.test(line),
  },
  { name: MSG.labels.attachWhiteCircleLine, test: (line) => /^⚪/.test(line) },
  {
    name: MSG.labels.attachRoutingMarker,
    test: (line) => /\btoday\s+`/.test(line),
  },
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
 * it fires on (`SessionStart`, `PreToolUse`, `PostToolUse`) and the job it
 * does. So docs name those, and point at the
 * registry of the harness in question — `.claude/settings.json` for Claude Code,
 * `.cursor/hooks.json` for Cursor, `config.toml` for Codex — rather than at a
 * script filename.
 *
 * A harness's own registry path and `.claude/skills/…` stub paths stay allowed:
 * a registry IS the thing to point at, and the stubs are a convention this
 * workspace owns.
 */
export const HOOK_REF_SURFACES = ['.agents/skills', 'docs', 'AGENTS.md'];

/**
 * Matches a REGISTERED hook script named by path. Both directories are matched:
 * `.agents/hooks/` is where they live now, and `.claude/hooks/` is retained so a
 * stale reference to the old location still FAILS instead of passing as ordinary
 * prose.
 *
 * `harness.mjs` is excluded because it is not a registered hook. No registry
 * names it; it is imported by relative path from its siblings, so a rename
 * breaks a Node import LOUDLY rather than silently falsifying a doc — which is
 * the entire reason this prohibition exists. It therefore has to be nameable in
 * prose, or the skill could not document it.
 */
export const HOOK_REF_PATTERN =
  /(?:\.agents|\.claude)\/hooks\/(?!harness\.mjs)[A-Za-z0-9._-]+/g;

/**
 * Paths a hook may legitimately build that are NOT expected to exist.
 *
 * `hook-paths` exists to catch a hook pointing at a file that was renamed or
 * moved. A path whose ABSENCE IS DESIGNED FOR is a different thing: the hook
 * guards it with `existsSync` and behaves correctly either way, so a missing
 * file is not breakage and must not be reported as such.
 *
 * An explicit list, deliberately NOT inferred from a nearby `existsSync`:
 * inference would silently exempt every future guarded path, including ones
 * where absence IS breakage — and catching silent breakage is this rule's whole
 * job. If a path here ever becomes REQUIRED, deleting its entry restores the
 * check.
 *
 * - `AGENTS.local.md` — optional personal overlay, gitignored on purpose.
 */
export const OPTIONAL_HOOK_PATHS = ['AGENTS.local.md'];

/* -------------------------------------------------- installed Superpowers */

/**
 * WHERE SUPERPOWERS MIGHT BE, and how much of that we can actually check.
 *
 * Superpowers is not a Claude-only plugin. Upstream ships packaging for Claude
 * Code, Antigravity, Codex (app and CLI), Cursor, Factory Droid, GitHub Copilot
 * CLI, Kimi Code, OpenCode and Pi — and it can also simply be copied into a
 * workspace with no plugin manager at all. So "installed" is a question with
 * several possible answers, and a check that only knows one of them must say so
 * rather than report absence.
 *
 * Each probe below is a location we know how to inspect. `SP_PROBES_UNVERIFIED`
 * names the agents we know exist but whose install paths we have NOT confirmed:
 * they are listed so the report can say what it did not check, instead of
 * implying it looked everywhere. **Do not add a probe from a guessed path** — an
 * invented path finds nothing and turns a silent gap into a false "not found".
 */
export const SP_CACHE_ROOT_SEGMENTS = ['.claude', 'plugins', 'cache'];

/**
 * Where PROBE 1's enablement answer comes from: Claude Code's project settings.
 *
 * Pairs with the cache probe above, and only with that probe. A copy in the cache
 * may be switched off for this repo by `enabledPlugins: { "{plugin}@{marketplace}":
 * false }` — project settings outrank user settings — so it cannot load and must
 * not be counted as a second loaded copy.
 *
 * **Deliberately one file, not a list.** A second agent needs a READER, not
 * another path: `enabledPlugins`, the `{plugin}@{marketplace}` key shape and the
 * project-over-user precedence are Claude Code's model, and nothing says another
 * harness expresses "switched off" the same way. A list of paths would quietly
 * assert that it does. Enablement is also meaningless without a probe to attach
 * it to — a workspace copy (`SP_WORKSPACE_SKILL_DIRS`) has no such concept at
 * all. So the order is the same as for probes: implement the probe first, then
 * its reader. See `SP_PROBES_UNVERIFIED` and the do-not-guess rule above.
 */
export const SP_ENABLEMENT_SETTINGS_FILE = '.claude/settings.json';

/**
 * A marketplace manifest, relative to the directory that holds it.
 *
 * Used to reach a repo-local CATALOG — the file that pins which commit of a
 * third-party plugin this workspace installs. The catalog's own directory is
 * never hardcoded: `SP_ENABLEMENT_SETTINGS_FILE` → `extraKnownMarketplaces`
 * already names it, and that declaration is what teammates actually run
 * `marketplace add` against, so it is the one place that cannot be stale.
 */
export const SP_CATALOG_MANIFEST = '.claude-plugin/marketplace.json';

/**
 * "Is Claude Code in use on this machine at all?" — its home directory.
 *
 * Everything about enablement and pinning is Claude Code's model: the
 * `enabledPlugins` keys, the marketplace cache, the project-over-user
 * precedence. Applied to a machine running another agent, those checks describe
 * nothing, and reporting them as failures hands that person a red they cannot
 * clear — the surest way to teach a team to skip past every finding.
 *
 * The HOME directory rather than the plugin cache, deliberately: a Claude user
 * who has not installed a plugin yet has the former and not the latter, and
 * "you have not installed it" is exactly the failure worth keeping loud for
 * them. A heuristic either way — being wrong downgrades a severity, it never
 * hides a finding, since the notice still says what could not be verified.
 */
export const SP_CLAUDE_HOME_SEGMENTS = ['.claude'];

/**
 * Agents Superpowers supports whose on-disk layout we have not verified. Moving
 * one into a real probe means: install it, find the path, confirm a version is
 * readable there, then implement it in `findSuperpowers` — in that order.
 */
export const SP_PROBES_UNVERIFIED = [
  'Antigravity',
  'Codex (app / CLI)',
  'Cursor',
  'Factory Droid',
  'GitHub Copilot CLI',
  'Kimi Code',
  'OpenCode',
  'Pi',
];

/**
 * Workspace-local copies: Superpowers skills committed into the repo with no
 * plugin manager involved. Detected by a skill we know it ships — a directory
 * name is enough, and no version may be readable, which the rule handles.
 */
export const SP_WORKSPACE_SKILL_DIRS = ['.agents/skills', '.claude/skills'];
export const SP_MARKER_SKILL = 'using-superpowers';

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
 * loads every skill twice with no warning from anything else — counting only the
 * copies a project `false` has not disabled, since a disabled one cannot load.
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
