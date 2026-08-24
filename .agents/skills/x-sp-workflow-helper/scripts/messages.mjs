// The prose this tool says to people, in one place.
//
// THE RULE, and it has no exceptions:
//
//   EVERY STRING THE TOOL PRINTS LIVES HERE. Rule titles, failures, skips,
//   counts, the run summary, and even single words interpolated into another
//   line (`labels`). If a person can read it, it is in this file.
//
//   Three narrower boundaries were tried first — "wording is the deliverable",
//   "contains an imperative", "verdict vs telemetry" — and each one was applied
//   inconsistently within days, because each needed a judgement call at every
//   new call site. Three rounds of review kept finding stray English. A rule
//   that needs no judgement is the only kind that holds.
//
//   The dead-messages rule enforces it in BOTH directions: nothing exported
//   here goes unused, and no prose string literal survives in ANY sibling
//   script — scanned in all three quote styles by a character scanner, because
//   every regex version of that scan produced a false clean.
//
// Every export is a function so the caller supplies the specifics and the wording
// stays whole here rather than being assembled at the call site.

/* ------------------------------------------------------- sp-version: presence */

/**
 * Superpowers could not be found in any location we know how to inspect.
 *
 * - **Used by** the `sp-version` rule, when every probe comes back empty.
 * - **Why** absence is worse than version drift — the whole workflow routes
 *   through Superpowers — but we can only inspect layouts we have verified, so
 *   the message must report what it checked AND what it could not, instead of
 *   declaring "not installed".
 * - **Seen when** nobody has it installed, OR it is installed for an agent whose
 *   layout has no probe yet. The message must not let those two be confused.
 */
export const notFoundAnywhere = ({ checkedDirs, uncheckedAgents }) => ({
  fail:
    'Superpowers NOT FOUND in any location this checker knows how to inspect. ' +
    'The whole Superpowers-First Workflow depends on it: every path routes through it ' +
    'and every hook anchors to one of its skills, so without it a cycle produces work ' +
    'that only looks like it followed the workflow.',
  details: [
    `  Checked: the Claude Code plugin cache, and workspace copies under ${checkedDirs}.`,
    `  NOT checked (install layout unverified): ${uncheckedAgents}.`,
    '  So this may mean "installed for another agent" rather than "absent". If you run one ' +
      'of those, say so — the fix is a new probe, not a workaround.',
    '  If it is genuinely absent, find out why (offline, network policy, plugins disabled) ' +
      'and tell the user; do NOT hand-install it.',
  ],
});

/**
 * Found, but no version can be read beside it.
 *
 * - **Used by** the `sp-version` rule, when a probe finds skills but no manifest.
 * - **Why** a bare `skills/` copy carries no version. Claiming a match would be a
 *   lie; failing as "wrong version" would be a false alarm. The honest report is
 *   that the reviewed-version guarantee is simply absent.
 * - **Seen when** Superpowers has been copied into a workspace without its
 *   manifest — the "no plugin manager at all" case.
 */
export const versionUnreadable = ({ source, where }) => ({
  fail:
    `Superpowers found (${source} at ${where}) but its VERSION is unreadable — no ` +
    'manifest alongside it. Nothing can tell whether this is the version the workflow was ' +
    'reviewed against, so the reviewed-version guarantee is simply absent here.',
  details: [
    '  Either install it through a plugin manager (which records a version), or copy the ' +
      "plugin's manifest next to the skills so a version can be read.",
  ],
});

/**
 * Found in more than one place at once.
 *
 * - **Used by** the `sp-version` rule, when probes return more than one finding.
 * - **Why** each copy loads, so every Superpowers skill registers more than once.
 *   Nothing else in the toolchain warns about this; it is only visible because
 *   detection scans rather than stopping at the first hit.
 * - **Seen when** someone adds a second source without disabling the first —
 *   the classic outcome of changing how the plugin is obtained.
 */
export const foundInMultiplePlaces = ({ findings }) => ({
  fail:
    'Superpowers was found in MORE THAN ONE place: ' +
    `${findings}. ` +
    'Each one loads, so every Superpowers skill is registered more than once and nothing ' +
    'else reports it. Keep exactly one — for Claude plugins, project settings outrank user ' +
    "settings, so a `false` in `.claude/settings.json` disables a teammate's own copy for " +
    'this repo without touching their machine.',
});

/* ---------------------------------------------------- sp-version: enablement */

/**
 * Every Superpowers entry in project settings is `false`.
 *
 * - **Used by** the `sp-version` rule, before any version comparison.
 * - **Why** files on disk prove nothing about whether the plugin is loaded. This
 *   exact state was created once by adding a pinned entry and disabling the
 *   working one; the checker reported green for a whole session because it was
 *   looking at the cache instead of at enablement.
 * - **Seen when** project settings disable it for everyone on the repo.
 */
export const allEntriesDisabled = ({ settingsPath, keys }) => ({
  fail:
    `${settingsPath} sets every Superpowers plugin entry to false (${keys}). ` +
    'Project settings outrank user settings, so Superpowers is DISABLED for everyone on ' +
    'this repo — and the whole workflow with it.',
  details: [
    '  Enable exactly one entry whose marketplace is actually installed.',
  ],
});

/**
 * Enabled from a source that has nothing installed.
 *
 * - **Used by** the `sp-version` rule, per enabled entry.
 * - **Why** registering a marketplace is not installing from it — a distinction
 *   that cost a dark session once. Settings can look correct while nothing loads.
 * - **Seen when** a marketplace is declared but its plugin was never fetched.
 */
export const enabledButNotInstalled = ({ settingsPath, key, market }) => ({
  fail:
    `${settingsPath} enables \`${key}\` but no plugin cache exists for marketplace ` +
    `\`${market}\` — the marketplace may be registered while the plugin was never ` +
    'installed from it. That silently disables Superpowers.',
  details: [
    `  Check ~/.claude/plugins/cache/${market}/ and ~/.claude/plugins/marketplaces/${market}/.`,
  ],
});

/**
 * Superpowers is not in any layout we can inspect, and this machine shows no
 * sign of running Claude Code plugins at all.
 *
 * - **Used by** the `sp-version` rule, as a NOTICE rather than a failure.
 * - **Why** the workspace pins through a Claude Code marketplace, so a teammate
 *   on another agent cannot be pinned and cannot be inspected either. Failing
 *   them says "your setup is broken" when the likeliest truth is "we cannot see
 *   your setup" — and a red they have no way to clear is how a checker teaches
 *   people to ignore it. The distinction is the plugin cache root: absent means
 *   no Claude plugins here, so this is a gap in our reach, not a broken install.
 * - **Seen when** a Cursor / Antigravity / Codex teammate runs the checker.
 */
export const notFoundUncheckedAgent = ({ checkedDirs, uncheckedAgents }) => ({
  fail:
    'Superpowers was not found in any layout this checker knows ' +
    `(${checkedDirs}), and Claude Code is not in use on this machine — so it is ` +
    'probably installed for another agent, where we cannot see it. Nothing is ' +
    `verified here: not the version, not the attach-points. Unchecked agents: ${uncheckedAgents}.`,
  details: [
    '  If Superpowers IS installed for your agent, the workflow may well be running fine — ' +
      'this says only that we could not confirm it.',
    '  Teaching the checker your layout is a probe in `findSuperpowersSkills`; ' +
      'a guessed path would be worse than this gap.',
  ],
});

/**
 * Drift on an install the workspace pin does not reach.
 *
 * - **Used by** the `sp-version` rule, as a NOTICE rather than a failure.
 * - **Why** the pin is delivered by a Claude Code marketplace. An install that
 *   did not come from there follows whatever its own agent published, so drift
 *   is its NORMAL state, not an incident — and no action available to the person
 *   in front of it would clear the finding. The review is still owed, by whoever
 *   maintains the workflow; being told is the whole point, being blocked is not.
 * - **Seen when** a non-Claude teammate is a version ahead of the baseline.
 */
export const driftUngoverned = ({ drift, source }) => ({
  fail:
    `${drift} This copy is a ${source}, which the workspace pin does not reach — for it, ` +
    'a version difference is ordinary rather than a fault, and nothing you can do here ' +
    'would change it.',
  details: [
    '  Still worth saying out loud: our layer leans on a dozen prose sentences inside ' +
      "Superpowers' own skill files, and a new version can reword one without breaking " +
      'anything visible. The upgrade review is owed by whoever maintains the workflow.',
  ],
});

/* ------------------------------------------------------------------ sp-pin */

/**
 * A declared directory marketplace whose manifest cannot be read.
 *
 * - **Used by** the `sp-pin` rule, per declared catalog.
 * - **Why** settings name the path teammates run `marketplace add` against. If
 *   the manifest is missing or malformed, that command fails for everyone who
 *   clones — and nothing else in this repo looks at the file.
 * - **Seen when** the catalog is moved or renamed without updating settings.
 */
export const pinCatalogUnreadable = ({ catalog, error }) => ({
  fail:
    `\`${catalog}\` is named as a marketplace in settings but cannot be read (${error}). ` +
    'Everyone who clones this repo runs `marketplace add` against that path, so it fails ' +
    'for all of them.',
});

/**
 * The catalog lists Superpowers, but with no commit to pin it to.
 *
 * - **Used by** the `sp-pin` rule, when the entry carries no `sha`.
 * - **Why** an entry without a `sha` is not a pin: installs follow whatever the
 *   source's default branch points at today, which is the floating behaviour the
 *   catalog exists to remove. It still LOOKS pinned, because a version string
 *   sits right beside it.
 * - **Seen when** an entry is copied from an upstream catalog, which has no
 *   reason to pin itself.
 */
export const pinHasNoSha = ({ catalog, plugin }) => ({
  fail:
    `\`${catalog}\` lists \`${plugin}\` with no \`sha\` — so it is NOT pinned. ` +
    "Installs follow the source's default branch, which is the floating behaviour a " +
    'catalog exists to remove; the version string beside it makes this look deliberate.',
});

/**
 * The pinned commit and the reviewed commit are not the same commit.
 *
 * - **Used by** the `sp-pin` rule, the whole reason it exists.
 * - **Why** two files record one fact: the baseline says which commit was
 *   REVIEWED, the catalog says which commit is INSTALLED. When they disagree,
 *   every other signal still reads green — `sp-version` compares installed
 *   against baseline, and installs match the pin — so the gap between "reviewed"
 *   and "running" is invisible precisely while it matters.
 * - **Seen when** an upgrade review updates the baseline and forgets the pin, or
 *   the pin is bumped without a review.
 */
export const pinDisagreesWithBaseline = ({
  catalog,
  baselineFile,
  pinned,
  reviewed,
}) => ({
  fail:
    `The pinned Superpowers commit and the reviewed one are different commits — ` +
    `\`${catalog}\` pins ${pinned}, \`${baselineFile}\` records ${reviewed} as reviewed. ` +
    'Everyone installs the pin, so the reviewed-version guarantee does not describe what ' +
    'anyone is running — and nothing else reports it, because installs do match the pin.',
  details: [
    '  Whichever is right, make both say it: bump the pin to the reviewed commit, or run ' +
      'the upgrade review for the pinned one and record THAT.',
  ],
});

/* -------------------------------------------------------- sp-version: drift */

/**
 * The drift sentence itself: what is installed vs what was reviewed.
 *
 * - **Used by** the `sp-version` rule, which splices it into the fail, the
 *   note and the ignore path alike — and by the session-start hook, which
 *   passes the rule output through.
 * - **Why** it was assembled inline for a while, which is how a backtick
 *   template kept three flavours of the same sentence out of this file: the
 *   first scan for stray prose only looked at quotes, never at backticks.
 * - **Seen when** the installed version differs from the baseline at all,
 *   whatever the tier.
 */
export const driftSummary = ({ installed, reviewed, reviewedDate, tier }) =>
  `Superpowers is at ${installed}; this workflow was reviewed against ` +
  `${reviewed} (${reviewedDate}) — a ${tier.toUpperCase()} difference.`;

/**
 * The installed version differs from the reviewed one, loudly.
 *
 * - **Used by** the `sp-version` rule when `VERSION_DRIFT_POLICY` says `fail`
 *   for the semver segment that moved (major/minor by default).
 * - **Why** our dependencies are prose sentences inside Superpowers' own files,
 *   so a version change cannot fail loudly on its own. This message is the only
 *   thing that says the review is owed.
 * - **Seen when** a major or minor difference appears — at session start via a
 *   hook, and on any workflow-surface edit.
 */
export const driftFail = ({ drift, why, baselineFile, installedVersion }) => ({
  fail:
    `${drift} ${why} Our layer relies on behaviours Superpowers does not know it promises, ` +
    'so the change cannot fail loudly on its own.',
  details: [
    '  Work through references/superpowers-upgrade.md, then record the result:',
    `  set version to "${installedVersion}" in scripts/${baselineFile} with today's date.`,
    '  Editing the baseline without doing the review only silences the one thing that noticed.',
  ],
});

/**
 * The installed version differs, but only at a segment we report rather than gate.
 *
 * - **Used by** the `sp-version` rule when the policy says `note` (patch, by default).
 * - **Why** a gate that fires on every patch is one people learn to silence. The
 *   accepted risk — a patch that rewords a prose dependency slips by — is stated
 *   here rather than hidden.
 * - **Seen when** only the patch segment moved. No session-start escalation.
 */
export const driftNote = ({ drift, why }) => [
  `${drift} ${why}`,
  '  Spot-check references/superpowers-upgrade.md → Prose-enforced if you are touching the ' +
    'workflow. Raise VERSION_DRIFT_POLICY.patch to "fail" to gate on this instead.',
];

/** Why each drift tier is treated the way it is. Shown inside the drift messages. */
export const driftWhy = {
  major: 'A major bump is breaking by declaration.',
  minor:
    'A minor bump adds features — and specifically may add SKILLS: a new skill whose ' +
    'description claims "design work" or "a defect" can start winning the routing match and ' +
    'silently change which path fires.',
  patch:
    'A patch is usually fixes, so this is reported rather than escalated — but note that ' +
    'nothing obliges a patch to leave our prose-enforced dependencies alone.',
};

/* ------------------------------------------------------ sp-version: baseline */

/**
 * No baseline record exists.
 *
 * - **Used by** the `sp-version` rule when the baseline file is absent.
 * - **Why** without it nothing records which version the workflow was reviewed
 *   against, so no comparison is possible and the guarantee does not exist.
 * - **Seen when** the file was deleted, or on a checkout that predates it.
 */
export const baselineMissing = ({ baselineFile, installedVersion }) => ({
  fail:
    `no baseline at scripts/${baselineFile} — nothing records which Superpowers version ` +
    `this workflow was reviewed against. Installed: ${installedVersion}.`,
});

/**
 * The baseline record cannot be parsed.
 *
 * - **Used by** the `sp-version` rule on a JSON parse failure.
 * - **Why** a corrupt record must not read as "no drift". Failing names the file
 *   and the parser error so the fix is obvious.
 * - **Seen when** the file was hand-edited badly.
 */
export const baselineInvalid = ({ baselineFile, error }) => ({
  fail: `scripts/${baselineFile} is not valid JSON: ${error}`,
});

/* -------------------------------------------------- hook reference direction */

/**
 * A doc or skill names a hook script by filename.
 *
 * - **Used by** the `hook-refs` rule.
 * - **Why** a hook can be renamed, and then every doc that named it is wrong.
 *   That happened here: one rename left five stale references across three files.
 *   What cannot go stale is the EVENT it fires on and the job it does.
 * - **Seen when** someone writes a hook path into a doc instead of naming the event.
 */
export const hookFilenameInDoc = ({ file, line, name }) => ({
  fail:
    `${file}:${line} names the hook script \`${name}\` — a rename would make this text ` +
    'wrong, silently. Name the EVENT and the job instead ("a SessionStart hook reports…", ' +
    '"the PostToolUse edit guard runs…") and point at the registry of the harness in ' +
    'question — `.claude/settings.json` for Claude Code, `.cursor/hooks.json` for Cursor — which is what actually wires it.',
});

/**
 * A hook script names a repo file that does not exist.
 *
 * - **Used by** the `hook-paths` rule — the mirror of `hookFilenameInDoc`.
 * - **Why** most such pointers were removed (agent-facing text names the skill
 *   instead), but human-facing messages legitimately carry a path, and a hook
 *   pointing at a moved file says nothing useful.
 * - **Seen when** a doc a hook points at is renamed or moved.
 */
export const hookPathBroken = ({ file, line, path }) => ({
  fail:
    `${file}:${line} names \`${path}\`, which does not exist — a hook that points at a ` +
    'moved file says nothing useful, and nothing else would notice.',
});

/**
 * A hook builds a repo path from segments, and it does not resolve.
 *
 * - **Used by** the `hook-paths` rule, scanning whole files rather than lines.
 * - **Why** `join(ROOT, '.agents', 'skills', …)` is invisible to any search for
 *   the path itself, so a rename breaks it with nothing to find. Both hooks
 *   locate the checker this way, and one exits silently when it is missing —
 *   which would make the session-start warning permanently and quietly dead.
 * - **Seen when** a script or directory the hooks depend on is renamed or moved.
 */
export const hookSegmentPathBroken = ({ file, line, path }) => ({
  fail:
    `${file}:${line} builds the path \`${path}\` from segments, and it does not exist — ` +
    'a rename breaks this and no text search for the path would find it.',
});

/* ------------------------------------------------ guidance in other rules */

/**
 * A hook attach-point names a Superpowers skill that is not installed.
 *
 * - **Used by** the `sp-skills` rule, per attach-point position.
 * - **Why** a hook on a skill nothing invokes never fires, and looks fine. The
 *   instruction matters more than the finding: the lifecycle moment survives the
 *   name, so the fix is to re-anchor — never to substitute something similar.
 * - **Seen when** upstream renames, splits or removes a skill we anchor to.
 */
export const attachPointNotInstalled = ({
  file,
  line,
  kind,
  name,
  version,
}) => ({
  fail:
    `${file}:${line} — the ${kind} names \`${name}\`, which is NOT an installed ` +
    `Superpowers skill (${version}). The lifecycle moment it marks still governs: ` +
    're-anchor it, and never silently substitute a similar-looking skill.',
});

/**
 * One path file cites another.
 *
 * - **Used by** the `path-isolation` rule.
 * - **Why** a step leaning on another path's step cannot be edited without
 *   reading that path, and renaming the step there breaks it silently. The
 *   instruction names the two homes that exist for shared material.
 * - **Seen when** someone cross-references instead of extracting.
 */
export const pathCitesPath = ({ file, line, other }) => ({
  fail:
    `${file}:${line} cites ${other} — a path may never cite another path; extract to ` +
    'sp-workflow-shared.md (a rule every path assumes) or sp-workflow-procedures.md ' +
    '(a procedure more than one path performs).',
});

/**
 * `AGENTS.md` uses a landmark kind tag.
 *
 * - **Used by** the `agents-notation` rule.
 * - **Why** a kind tag carries semantics only the notation catalog defines
 *   (whether a gate may skip that hook), and unlike a hook ID it cannot be
 *   made resolvable by a one-line legend — the meaning is the whole catalog
 *   entry. `AGENTS.md` is read first, so the tag can only mislead.
 * - **Seen when** a rule moves into `AGENTS.md` from a path file and keeps the
 *   landmark decoration it had there.
 */
export const agentsUsesKindTag = ({ file, line, token }) => ({
  fail:
    `${file}:${line} names \`${token}\` — a landmark kind tag, which ${file} must not use: ` +
    'it is read before the notation catalog, and unlike a hook ID a tag cannot be made ' +
    'resolvable in one line. Say plainly what it does instead, and leave the tag to the ' +
    'path file that defines it.',
});

/**
 * `AGENTS.md` names a hook ID it never defines.
 *
 * - **Used by** the `agents-notation` rule.
 * - **Why** `AGENTS.md` is read before the path files, so an ID that appears
 *   only as a bare label is a forward reference — and readers do not stop at
 *   "unknown", they invent a meaning. Three agents each invented the same
 *   wrong one for the same orientation table. An ID is allowed here **when the
 *   file also defines it**, which a one-line legend does; the ban is on the
 *   dangling reference, not on the notation.
 * - **Seen when** a table lists where skills fire and the legend that resolved
 *   those IDs is removed, reworded away, or never written.
 */
export const agentsIdUndefined = ({ file, line, token }) => ({
  fail:
    `${file}:${line} names \`${token}\` in a table, but ${file} never defines it outside ` +
    'one — so a reader who has not opened the path file cannot resolve it and will guess. ' +
    'Add it to the legend beneath the table, or say the moment plainly instead.',
});

/**
 * A skill names the workflow's control flow.
 *
 * - **Used by** the `skill-coupling` rule.
 * - **Why** naming a hook ID or path letter couples the skill to one workflow's
 *   current shape: rename the hook and the skill is wrong, and the skill can no
 *   longer be used outside that workflow at all.
 * - **Seen when** a skill describes *who* decides or *when*, instead of its own
 *   inputs, outputs and prerequisites.
 */
export const skillNamesControlFlow = ({ file, line, hit }) => ({
  fail:
    `${file}:${line} names workflow control flow ("${hit}") — state the substance the ` +
    'skill owns instead: its own prerequisites, inputs and outputs, and what it reports ' +
    'when it cannot decide.',
});

/**
 * A skill carries an inline `metadata` block.
 *
 * - **Used by** the `versions` rule.
 * - **Why** the workspace requires block form, and the instruction is the whole
 *   content of the finding.
 * - **Seen when** a new skill is written from memory instead of the template.
 */
export const inlineMetadata = ({ file }) => ({
  fail: `${file} uses inline metadata — use block form under \`metadata:\`.`,
});

/**
 * An allowlist entry no longer matches anything.
 *
 * - **Used by** the `allowlist-hygiene` rule.
 * - **Why** a suppression must not outlive the text it was written for. The
 *   instruction is to delete it — an entry kept "just in case" silently
 *   suppresses a finding nobody reviewed.
 * - **Seen when** the suppressed text is fixed or removed, which is the intended
 *   lifecycle rather than a mistake.
 */
export const staleAllowlistEntry = ({ index, rule, file }) => ({
  fail:
    `allowlist entry ${index} (${rule} / ${file}) matched nothing — the text it ` +
    'suppressed is gone, so delete it.',
});

/**
 * An `OPTIONAL_HOOK_PATHS` entry no longer matches any path a hook names.
 *
 * - **Used by** the `hook-paths` rule, which applies to its own exemptions the
 *   same hygiene `allowlist-hygiene` applies to suppressions.
 * - **Why** an exemption must not outlive the path it was written for. Once no
 *   hook names that path — it was renamed, or the hook that built it is gone —
 *   the entry does nothing except stand ready to exempt some FUTURE hook that
 *   names a genuinely REQUIRED file of the same name, pre-emptively and
 *   silently. The instruction is to delete it.
 * - **Seen when** a hook stops building the path, or the path is renamed.
 */
export const staleOptionalHookPath = ({ path }) => ({
  fail:
    `OPTIONAL_HOOK_PATHS lists \`${path}\`, which no hook named in this run — the ` +
    'exemption has outlived the path it was written for, and would pre-emptively excuse a ' +
    'future hook that names a REQUIRED file of that name. Delete the entry.',
});

/**
 * A message is exported but never wired.
 *
 * - **Used by** the `dead-messages` rule.
 * - **Why** an unwired export means the prose exists twice, here and inline, with
 *   nothing syncing them. The instruction is deliberately binary: wire it or
 *   delete it — leaving it is the drift.
 * - **Seen when** an extraction is started and not finished. It happened here.
 */
export const deadMessageExport = ({ name }) => ({
  fail:
    `messages.mjs exports \`${name}\`, which nothing uses — so its prose almost certainly ` +
    'still sits inline at the call site too, in two copies that will drift. Wire it or delete it.',
});

/* ============================================================ RULE TITLES */

/**
 * The headline each rule prints on every run — what it judged.
 *
 * - **Used by** the rule registry: `rule(id, fn)` looks the title up here, so a
 *   rule registration carries no prose at all.
 * - **Why** these are the first thing anyone reads, and the only text printed
 *   even when everything passes. Keeping them beside the findings means one file
 *   holds every verdict the tool renders.
 * - **Seen when** every single run, pass or fail.
 *
 * Registration THROWS if a rule id has no title here — a missing title would
 * otherwise print as `undefined`, which reads like a broken tool.
 */
export const titles = {
  'hook-ids': 'Every cited hook ID resolves to a real hook heading',
  links: 'Every cited file path exists',
  anchors: 'Every cited #anchor resolves to a real heading',
  'sp-skills': 'Every Superpowers skill we anchor to is installed',
  'sp-version':
    'Superpowers is present, usable, and at the version we reviewed against',
  'sp-pin': 'The pinned Superpowers commit is the one we reviewed',
  'x-skills': 'Workspace skills exist, and every stub matches its canonical',
  versions: 'Every workspace skill carries a block-form semver',
  'path-isolation': 'No path file cites another path file',
  'agents-notation': 'Every hook ID AGENTS.md names is defined in AGENTS.md',
  landmarks: 'Landmark headings and reserved icons follow the notation',
  'skill-coupling':
    'Skills do not name workflow landmarks (control flow stays in the docs)',
  'hook-paths': 'Every repo path a hook names resolves',
  'hook-refs': 'Docs and skills name hook EVENTS, never hook filenames',
  'dead-messages': 'Every exported message is actually used',
  'allowlist-hygiene': 'No stale allowlist entries',
};

/* ================================================================== SKIPS */

/**
 * Why a rule could reach no verdict.
 *
 * - **Used by** any rule whose inputs are absent.
 * - **Why** a skip is what a reader sees *instead of* a verdict, so it belongs
 *   with the verdicts. And the wording carries a load-bearing warning the docs
 *   repeat: **a SKIP is not a pass.**
 * - **Seen when** the thing a rule inspects does not exist on this machine.
 */
export const skips = {
  /** sp-skills defers, so one root cause produces one failure. */
  supersededBySpVersion:
    'Superpowers not installed — sp-version owns that failure; nothing to verify ' +
    'anchors against',

  /** A governed directory is simply absent. */
  noDir: (dir) => `no ${dir}`,

  /**
   * Pinning is optional, so its absence is nothing to report — but it is also
   * not a pass, and saying so keeps "we chose not to pin" distinguishable from
   * "the pin was checked and agreed".
   */
  noPinnedCatalog:
    'this workspace does not pin Superpowers — no directory marketplace in settings ' +
    'lists it, so there is no second record to compare the baseline against',

  /** The message module could not be located, so nothing can be compared. */
  noMessageModule: 'message module not found',

  /**
   * Staleness is undecidable on a filtered run: an entry proves it is still
   * needed by being CONSULTED, and a rule that did not run consults nothing.
   * Reporting entries as stale here would be a false positive of the loudest
   * kind, since the advice is "delete it".
   */
  filteredRun: (onlyRule) =>
    `cannot judge staleness on a filtered run (--rule=${onlyRule}) — an entry proves ` +
    'itself by being consulted, and the rules it guards did not run. Run the whole checker.',
};

/* ============================================================== LOCATORS */

/**
 * Findings that name what is wrong and where, without an instruction.
 *
 * - **Used by** the rule of the matching name.
 * - **Why** they are verdicts, so they live with the verdicts even though the
 *   wording is short. The instruction-bearing ones are the `guidance` group
 *   above; the split matters for editing tone, not for where they live.
 * - **Seen when** the named reference does not resolve.
 */
export const locators = {
  hookIdUndefined: ({ file, line, id }) => ({
    fail: `${file}:${line} cites hook \`${id}\`, which no path file defines`,
  }),

  docPathMissing: ({ file, line, cited, resolved }) => ({
    fail: `${file}:${line} cites \`${cited}\` — no such file or directory (resolved to ${resolved})`,
  }),

  skillLinkMissing: ({ file, line, cited, resolved }) => ({
    fail: `${file}:${line} links to \`${cited}\` — no such file (resolved to ${resolved})`,
  }),

  anchorMissing: ({ file, line, anchor, target }) => ({
    fail:
      `${file}:${line} cites \`#${anchor}\` in ${target} — no heading yields that slug ` +
      'under any renderer rule',
  }),

  namedSkillMissing: ({ agentsFile, name, canonicalDir }) => ({
    fail: `${agentsFile} names \`${name}\`, which does not exist under ${canonicalDir}/`,
  }),

  skillNameFolderMismatch: ({ file, frontmatterName, folder }) => ({
    fail: `${file} has \`name: ${frontmatterName}\` but lives in folder \`${folder}\``,
  }),

  stubMissing: ({ skill, stubPath }) => ({
    fail: `${skill} has no stub at ${stubPath} — invisible to whichever tool discovers skills there`,
  }),

  stubDescriptionDrifted: ({ skill, stubDir }) => ({
    fail: `${skill}: ${stubDir} stub description has drifted from canonical — the tool matches on the stale text`,
  }),

  stubCarriesMetadata: ({ stubPath }) => ({
    fail: `${stubPath} carries \`metadata\` — stubs are name + description only`,
  }),

  orphanStub: ({ stubDir, skill }) => ({
    fail: `${stubDir}/${skill} is an orphan stub — no canonical skill`,
  }),

  versionMissing: ({ file }) => ({
    fail: `${file} has no \`version: 'x.y.z'\` under a block \`metadata:\``,
  }),

  headingNotHook: ({ file, line, heading }) => ({
    fail: `${file}:${line} — \`####\` heading is not a 🪝 hook: "${heading}"`,
  }),

  hookHeadingMalformed: ({ file, line, heading }) => ({
    fail: `${file}:${line} — hook heading does not match \`🪝 {ID} · {when}\`: "${heading}"`,
  }),

  reservedIconMisused: ({ file, line, icon, level }) => ({
    fail: `${file}:${line} — reserved landmark icon ${icon} used in a level-${level} heading`,
  }),

  spanNamesNoId: ({ file, line, label }) => ({
    fail:
      `${file}:${line} — \`${label}:\` names no hook ID; it must address hooks by ` +
      '`{ID}`, never in prose',
  }),
};

/**
 * Prose left in the checker instead of here.
 *
 * - **Used by** the `dead-messages` rule, scanning its own sibling for string
 *   literals that read as English — outside comments, which are meant to.
 * - **Why** it makes the one rule enforceable rather than aspirational. Every
 *   narrower boundary was re-drawn within days; this one asks no judgement of
 *   whoever adds the next call site.
 * - **Seen when** a new `r.fail`/`r.skip`/`r.note`, a `console.log`, or a
 *   fragment interpolated into another line is written with the words inline.
 */
export const inlineString = ({ file, line, text }) => ({
  fail:
    `${file}:${line} has prose in the code: "${text}". Every string this tool prints ` +
    'lives in messages.mjs — titles, failures, skips, counts, the summary, and ' +
    'single-word fragments alike. Move it there and interpolate the specifics.',
});

/* =========================================================== NOTES & CHROME */

/**
 * Everything else the tool prints: the per-rule notes and the run summary.
 *
 * - **Used by** the rules (notes) and the runner (summary).
 * - **Why** the file holds EVERY string the tool prints, with no exception to
 *   argue about. Three attempts at a partial boundary — "wording is the
 *   deliverable", "contains an imperative", "verdict vs telemetry" — each got
 *   applied inconsistently, and each time a stray string was found by reading
 *   rather than by the checker. An absolute rule needs no judgement and is
 *   mechanically enforceable, which is why it replaced all three.
 * - **Seen when** every run: notes print under a passing rule, the summary last.
 *
 * Two of these are genuine verdicts that had been miscategorised as counts:
 * `spVersionOk` is what a PASS actually concludes, and `driftIgnored` records a
 * policy decision. The rest are tallies.
 */
export const notes = {
  /** sp-version PASS — the conclusion, not a count. */
  spVersionOk: ({ version, reviewed, source, where }) =>
    `reviewed against ${version} on ${reviewed} — found as ${source} at ${where}`,

  /** Drift found, but policy says not to report it. */
  driftIgnored: (drift) => `${drift} Ignored by policy.`,

  /**
   * sp-version — copies on disk that a project `false` stops from loading.
   *
   * Said out loud because the alternative is a silent subtraction: someone can
   * SEE a second copy in the cache and needs to know the checker considered it
   * and ruled it out, rather than wondering whether it looked at all.
   */
  spVersionDisabledIgnored: (markets) =>
    `not counted, disabled by project settings: ${markets.join(' · ')}`,

  /** sp-pin PASS — the two records of one commit, agreeing. */
  spPinOk: ({ catalog, version, sha }) =>
    `${catalog} pins ${version} at ${sha.slice(0, 7)} — the commit the baseline records as reviewed`,

  hookIdsDefined: (ids) => `${ids.length} hook IDs defined: ${ids.join(' · ')}`,
  pathsChecked: (docCount, skillCount) =>
    `${docCount} doc path citations + ${skillCount} skill-internal links checked`,
  anchorsChecked: (n) => `${n} anchor citations checked`,
  spVersionInspected: (version) =>
    `checked against installed Superpowers ${version}`,
  attachPointsChecked: (byKind) =>
    `${byKind} — verified by position, no name list`,
  workspaceSkills: (names) =>
    `${names.length} workspace skills: ${names.join(' · ')}`,
  stubLocations: (dirs) => `stub locations checked: ${dirs.join(' · ')}`,
  hookPathsChecked: (n) => `${n} repo paths named by hooks checked`,
  hookRefFilesScanned: (n) => `${n} files scanned for hook-filename references`,
  messageAudit: ({ total, dead, inline, scanned }) =>
    `${total} message exports, ${dead} unused; ${scanned} sibling script(s) scanned, ${inline} string(s) left in the code`,
  allowlistEmpty: 'allowlist is empty',
  allowlistInUse: (hits, total) =>
    `${hits}/${total} allowlist entries still in use`,
};

/** The runner's own summary line — the harness counting its output. */
export const runner = {
  /**
   * A rule threw instead of reporting.
   *
   * - **Used by** the runner, wrapping every rule call.
   * - **Why** a crash must read as a FAILURE of that rule, not as a missing
   *   result — a rule that silently produced nothing would leave its
   *   invariant unchecked while the run still looked complete.
   * - **Seen when** a rule hits a case its author did not handle.
   */
  ruleCrashed: (message) => `rule crashed: ${message}`,

  /**
   * A rule was registered with no title in this file.
   *
   * - **Used by** the rule registry, at load time — so it throws before any
   *   rule runs, rather than printing `undefined` as a title.
   * - **Why** registration deliberately carries no prose: the title is looked
   *   up here. That only holds if a missing entry is loud.
   * - **Seen when** someone adds a rule and forgets its `titles` entry.
   */
  missingTitle: (id) => `no title in messages.mjs for rule '${id}'`,
  /**
   * A `--rule=` name that matches nothing.
   *
   * Without this the run printed `All 0 rules passed` and exited 0, so a typo
   * (`--rule=anchor` for `anchors`) read as a clean bill of health on files
   * nothing had looked at — a silent green, which is the failure class this
   * whole checker exists to catch.
   */
  unknownRule: (name, ids) =>
    `no rule named '${name}'. Known rules: ${ids.join(' · ')}`,
  allPassed: (n) => `All ${n} rules passed.`,

  /**
   * Passed, but something was reported that the exit code does not carry.
   *
   * A bare "All N rules passed" over a run that printed a NOTICE reads as a
   * clean bill of health, and the notice scrolls past unread — which is how a
   * finding nobody can act on becomes a finding nobody sees either.
   */
  passedWithNotices: (n, notices) =>
    `All ${n} rules passed, with ${notices} notice(s) above — real findings that this ` +
    'machine cannot act on, not failures.',
  failures: (count, ruleCount) =>
    `${count} failure(s) across ${ruleCount} rule(s).`,
};

/**
 * Fragments interpolated into other printed text.
 *
 * - **Used by** `findSuperpowersSkills` (the source labels) and the sp-version
 *   pass note (the missing-date fallback).
 * - **Why** they are not whole messages, but they ARE words a person reads — the
 *   pass line says "found as **Claude Code plugin** at …". A fragment left in the
 *   code is still a string the file claims to own.
 * - **Seen when** every run that finds Superpowers, or one whose baseline has no
 *   recorded review date.
 */
export const labels = {
  /**
   * The three attach-point positions, named for the count line.
   *
   * Paired with their line tests in config.mjs — the test is a knob, the
   * NAME is text a person reads ("5 at hook headings"), so it lives here.
   * Kept as a triple rather than split by whether each one happens to look
   * like prose: two of the three would have moved and one stayed, which
   * reads as an oversight rather than a rule.
   */
  attachHookHeading: 'hook heading',
  attachWhiteCircleLine: '⚪ line',
  attachRoutingMarker: 'routing marker',

  sourceClaudePlugin: 'Claude Code plugin',
  sourceWorkspaceCopy: 'workspace copy',
  dateUnrecorded: 'an unrecorded date',
};
