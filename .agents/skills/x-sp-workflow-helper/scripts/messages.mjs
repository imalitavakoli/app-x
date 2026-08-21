// The prose this tool says to people, in one place.
//
// WHAT LIVES HERE, and what deliberately does not:
//
//   THE AXIS — is this text a VERDICT the tool renders about the repo, or
//   TELEMETRY about the run?
//
//     VERDICT (here): the rule TITLE (what was judged), a FAILURE (what is
//     wrong) and a SKIP (why no judgement was possible). These are what a
//     person reads to understand an outcome.
//
//     TELEMETRY (stays with the code): counts and tallies (`N files scanned`),
//     and the runner summary (`N failure(s) across M rule(s)`). Not findings
//     about the repo — the harness describing its own output.
//
//   Two earlier boundaries were tried and both got applied inconsistently:
//   "wording is the deliverable" was too vague, and "contains an imperative"
//   split findings from each other for no reason. The dead-messages rule now
//   enforces this one in BOTH directions — no unused export, no inline verdict.
//// Every export is a function so the caller supplies the specifics and the wording
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
    "  Either install it through a plugin manager (which records a version), or copy the " +
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
  details: ['  Enable exactly one entry whose marketplace is actually installed.'],
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

/* -------------------------------------------------------- sp-version: drift */

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
    '"the PostToolUse edit guard runs…") and point at `.claude/settings.json`, which is the ' +
    'registry of what is actually wired.',
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
export const attachPointNotInstalled = ({ file, line, kind, name, version }) => ({
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
  'x-skills': 'Workspace skills exist, and every stub matches its canonical',
  versions: 'Every workspace skill carries a block-form semver',
  'path-isolation': 'No path file cites another path file',
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
 * A verdict written inline in the checker instead of here.
 *
 * - **Used by** the `dead-messages` rule, scanning its own sibling.
 * - **Why** the split between verdicts (here) and telemetry (with the code that
 *   formats it) survived only on discipline, and discipline failed: the boundary
 *   was re-drawn three times before it held. This makes the rule enforceable.
 * - **Seen when** someone adds an `r.fail` or `r.skip` with the words inline.
 */
export const inlineVerdictText = ({ file, line }) => ({
  fail:
    `${file}:${line} writes a verdict inline — a failure or skip is what a person reads ` +
    'to understand the outcome, so its wording belongs in messages.mjs. Telemetry ' +
    '(counts, the run summary) stays with the code that formats it.',
});
