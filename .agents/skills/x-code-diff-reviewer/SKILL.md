---
name: x-code-diff-reviewer
description: "WHAT? A read-only review of this repo's outstanding code changes against its default branch, delivered as a plain-language report plus a host-neutral JSON findings file. WHEN? Asked to review a branch, a diff, outstanding or uncommitted changes, or to check work before a PR or push; or to put the human report on an existing merge request's description. Auditing correctness, security, reuse, lib boundaries, naming, DEP, styles, tests, docs. Not for making the changes, fixing findings, or opening the PR."
metadata:
  kind: reviewer
  version: '1.7.0'
---

# Code Diff Reviewer

## Overview

This skill supplies the rules for judging **changes someone else has already made** in this
repository, and the shape of the two reports that judgement is delivered in, plus the
session handoff printed in chat.

It reviews. It does not repair. The findings are the whole product.

The **main job** is self-review **before** a merge request: write the human report under
`.agents/_local/skills/x-code-diff-reviewer/` and print it in the session. That job is
complete even when no request exists. **Do not assume the report is always on the PR.**

**Prepend** is optional follow-on so a reader of the merge request sees the same report:

- Run `scripts/publish-pr-description.mjs` when a request already exists, appears later in
  this run, or the user asked to put the report on the description (procedure:
  `references/publish-pr-description.md`).
- Some harnesses (e.g. Cursor Cloud) create or update the request themselves. Their ops notes
  may require the controller to prepend `latest.md` on `create_pr` / `update_pr` when that
  file exists — including a late update when the PR was opened before the review finished.
  That path does not replace this skill’s publish script; it is another way to land the same
  artifact. Skipping prepend is not a failed review.

`scripts/collect-diff-facts.mjs` gathers the git facts (base branch, ranges, changed files,
buckets) and writes nothing outside the report directory. **Every judgement in the report is
yours** — the script never decides whether something is a finding. It stays git-only: it does
not look up merge requests.

`scripts/publish-pr-description.mjs` is this skill’s host write for the description only.
Procedure: `references/publish-pr-description.md`.

## Optional prefs

The skill works with both homes empty. A stored value is a default this run's instruction
overrides. Missing `prefs.json` is the normal state, not an error.

Resolve **per key**. First match wins:

1. This run's explicit instruction.
2. `.agents/_team/skills/x-code-diff-reviewer/prefs.json` (committed).
3. `.agents/_local/skills/x-code-diff-reviewer/prefs.json` (gitignored).
4. The announced default in the table below.

A key present on the team file wins over local, even when the team value equals the announced
default. A key omitted from the team file can still come from local. A missing file is not a
layer. A `version` mismatch on **one** file (older, missing, or newer than the example below)
means treat that file as absent for this run: announced defaults for its keys, and offer to
rewrite it to match the example.

Announce in one line which layer supplied each key that is not the announced default.

| Key                | Type                             | Announced default (file or key absent)                                                          | Does                                                      |
| ------------------ | -------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `version`          | integer                          | current shape is `1` — compare against the example, not this skill's `1.4.0`                    | format of this file                                       |
| `boilerplate_apps` | string array of Nx project names | absent — then the DEP mirroring check falls through to the workspace docs, then to a `question` | which apps the DEP check treats as the copyable reference |

`version` is the shape of this JSON. It is not the skill's `metadata.version`.

**All keys this skill stores are team keys** — they change how every clone reviews. After an
explicit yes, write `.agents/_team/skills/x-code-diff-reviewer/` (create the parent if needed; it
is a git change). Never write them to `.agents/_local/`. If the team file already has that key,
do not offer unless they ask to change the team default.

```json
{
  "version": 1,
  "boilerplate_apps": ["app-one", "app-two"]
}
```

The array holds Nx project names. Put the apps this workspace's docs treat as the copyable
reference — often a web app and a mobile app, sometimes one. Do not copy the example's
placeholders; they are the type, not a value.

Both files are optional. Writing happens only after an explicit yes.

## The read-only law

```
THE REVIEWED FILES ARE EVIDENCE. YOU DO NOT TOUCH EVIDENCE.
```

You may write to exactly one place:

```
.agents/_local/skills/x-code-diff-reviewer/
```

Updating a host description via the publish script is not editing evidence. Do not write the
description into a tracked file.

Everything else in the repository is read-only for the whole run — the working tree, the index,
HEAD, branches, stashes, and untracked files alike.

**Check that path is ignored before you rely on it**, with a **file path inside it**:

```bash
git check-ignore -q .agents/_local/skills/x-code-diff-reviewer/facts.json
```

Exit 0 means ignored. Do **not** test the bare directory `.agents/_local` — a directory-only
pattern such as `/.agents/_local/` does not match it until the directory exists on disk, so a
correctly-configured repo reports as unignored on the first run. A check that fires on correct
setup is one people learn to ignore.

When it is genuinely not ignored, your reports appear in the author's `git status`, and their
next `git add -A` commits your review into their branch. That is the read-only law failing by a
side door.

When it is not ignored: still write the reports, and raise a `chore` finding saying
`/.agents/_local/` needs to be in `.gitignore` as personal state. **Do not add the line
yourself** — `.gitignore` is a repository file, and this skill does not edit repository files.
Say it in the report and in _What I did not check_, so the author knows to keep the path out of
their commit until it is ignored.

**No exceptions:**

- Not a rename, not a whitespace fix, not a "mechanical" one.
- Not an added `NOTE:`, `TODO:`, or comment pointing at a finding. The finding goes in the report.
- Not "I left it uncommitted, so it doesn't count."
- Not deleting a stray file, a debug log, or a leftover.
- Not `git add`, `git stash`, `git checkout`, `git restore`, or anything else that moves HEAD or
  the index. Read history with `git show`, `git diff`, `git log`. If you need another revision in
  a working tree, `git worktree add` it under a temp directory.

**Why this is absolute and not a preference:** a reviewer that edits the branch destroys the only
thing a review produces. Once your rename is in the tree, nobody downstream can tell the author's
work from yours — and a later reader will treat your edit as reviewed code, because it arrived on
the branch looking exactly like the author's. A measured run of this failure wrote a README
documenting a custom property the reviewer had itself renamed one file earlier. The author's
branch now asserted, in prose, something the author never wrote.

**Violating the letter of this rule is violating the spirit of it.**

If a fix is obvious, that makes it a _good finding_, not a licence to apply it. Say what to change
and where. Whoever owns the code changes it, in a separate run.

### Red flags — STOP, and write a finding instead

- "This one is mechanical, so it's safe to fix."
- "I'll leave it uncommitted so the author can review it."
- "I'll add a `NOTE:`/`TODO:` so the finding isn't lost."
- "It's untracked debris, deleting it isn't really a change."
- "I fixed the trivial ones and flagged the design decisions."
- "The user asked me to _get it ready_, so fixing is in scope."

All of these mean: revert nothing, touch nothing, and put it in the report.

| Rationalization                                       | Reality                                                                                        |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| "Applied the fixes that were mechanical"              | Mechanical vs judgement is the wrong axis. The axis is _reviewer vs author_. Change nothing.   |
| "Left it uncommitted rather than committing"          | The working tree is the artifact under review. Uncommitted edits still overwrite the evidence. |
| "Left a `NOTE:` in the code so it isn't lost"         | The report is where findings are not lost. A comment in the source is an edit to the source.   |
| "Marked the violation with a `TODO(TICKET)`"          | A marker in the file is a change to the file, and it is a finding nobody can audit.            |
| "Untracked debris isn't recoverable, so I removed it" | Untracked files are unrecoverable, which is why you must not delete them. Report it.           |
| "'Get it ready for the PR' means fix it"              | It means tell them what stands between the branch and the PR. Ask before changing anything.    |
| "Nobody will mind one whitespace change"              | The diff you hand back must be byte-identical to the one you were given.                       |

If the request sounds like it wants repairs ("get it ready", "clean this up", "fix what you
find"), review first, report, and then **ask** whether they want a separate run to apply fixes.
Do not fold the two together.

## Resolve what to review

Run `scripts/collect-diff-facts.mjs`. It resolves the base branch and the buckets; read its JSON
rather than re-deriving. If you must do it by hand, the ladder is:

**Base branch**, first that resolves:

1. `git symbolic-ref --short refs/remotes/origin/HEAD`
2. first existing of `origin/main`, `origin/master`, `main`, `master`
3. ask the user

Rung 1 is unset in many real checkouts, so never stop there. Never assume the branch is called
`main`.

**Base commit** is always `git merge-base HEAD <base>` — never the branch tip.

**Three buckets.** Report each separately and name which ones you judged:

| Bucket      | Range                                   | Arises when                              |
| ----------- | --------------------------------------- | ---------------------------------------- |
| `committed` | `<merge-base>..HEAD`                    | working on a branch off the base         |
| `unpushed`  | `origin/<base>..HEAD`                   | committing straight onto the base branch |
| `working`   | `git diff HEAD` and `git diff --cached` | not committing at all yet                |

All three are reviewed by default. A change present only in `working` is **not** part of a PR yet
— say so in the finding rather than treating it as merged work.

If every bucket is empty, say that plainly and stop. Do not review the repository at large: your
subject is the change, not the codebase.

## Never assert a check you did not run

An unrun check has no outcome. This is the single most-repeated failure in baseline testing —
including by a reviewer that had already written "I could not run lint".

**The contract, per sentence:** a claim about whether a check passes or fails carries the command
and its exit code. Otherwise it is not a claim.

| Write this                                                                        | Not this                                        |
| --------------------------------------------------------------------------------- | ----------------------------------------------- |
| "`nx affected -t lint` exited 1: `@nx/enforce-module-boundaries` on `card.ts:1`." | "This will fail lint in CI."                    |
| "The import matrix in `<doc>` lists `ui` → `data-access` as not allowed."         | "The automated checks will reject this branch." |
| "Not checked: lint (no `package.json` in this repo)."                             | "Lint should catch this."                       |

Citing a **rule** needs no command — a doc says what it says. Predicting a **tool's verdict**
does. Keep the two apart: state the rule, and let the _Automated checks_ section report outcomes.

Anything you did not or could not run goes in _What I did not check_, with the reason.

## Automated checks

Scope with `nx affected`; never run the whole workspace.

- **Default:** lint and unit tests for affected projects.
- **e2e:** only when e2e specs are themselves in the diff, or the user asks.
- Record the literal command and exit code. Report failures as evidence, not as re-judged findings.
- A test that is only a generator scaffold — a lone `should create` / `toBeTruthy`, an empty
  `describe`, or an NgRx `should work` marble of empty `init$` success — is boilerplate: skip
  it, emit a `note`, and do not treat it as coverage. `references/checks/tests.md` has the
  recognition rule.

If tooling is absent (no `package.json`, no `nx`), that is a _not checked_ entry with the reason.
It is never a reason to guess the outcome.

## What to check

`SKILL.md` holds no rules about the code itself. Both maps below carry **paths and trigger
conditions only** — read the thing they point at and enforce what _it_ says.

| Map                              | Use                                                   |
| -------------------------------- | ----------------------------------------------------- |
| `references/doc-map.md`          | which `docs/` page governs which kind of changed file |
| `references/skill-assets-map.md` | which sibling skill's assets show the canonical shape |

And the per-area checks, loaded by what the diff contains:

| Load                                       | When the diff contains                                                                          |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `references/checks/security.md`            | **always**                                                                                      |
| `references/checks/pr-metadata.md`         | a PR is being prepared, or readiness was asked about                                            |
| `references/checks/angular.md`             | any `.ts`, `.html`, or a project under `libs/` or `apps/`                                       |
| `references/checks/execution-and-scale.md` | async work, a subscription, a loop over a collection, or a method a user can trigger twice      |
| `references/checks/styles.md`              | `.scss`, `.css`, class attributes, inline styles                                                |
| `references/checks/tests.md`               | a spec, a fixture, or code whose tests should have moved                                        |
| `references/checks/docs-readme.md`         | a README, CHANGELOG, PRD/TSD, or code whose docs should have moved                              |
| `references/checks/nx-project-config.md`   | `project.json`, `tsconfig*`, `.eslintrc*`, `jest.config`, `nx.json`, `package.json`, a lockfile |
| `references/checks/dep.md`                 | a DEP config, a DEP asset, or the mapping layer reading one                                     |
| `references/checks/capacitor.md`           | a plugin's TS bridge, or Android/iOS sources                                                    |

Load only what the diff triggers. A three-file style change needs `security.md` and `styles.md`,
not the library-types doc.

**Framework authorities.** Workspace `docs/` win when they exist. For a framework default
(Angular style, an Nx convention, Tailwind's own docs) that no workspace doc covers:

1. Read the installed version from this repo's `package.json` or lockfile. Never assume it.
2. Consult that version's current guidance. Prefer an MCP or docs tool for that framework if
   this session has one; otherwise the official docs for that version.
3. Report only a real defect or anti-pattern **for that version**. Taste is not a finding.
4. Absence of an MCP is not a finding, and not a reason to skip the check. Recalled training
   is not a rule.

Cite with `rule_source.kind: none` and name the framework plus the version you read. Never
present a framework default as a workspace rule.

**A map entry whose path does not exist is a finding**, reported against the map with label
`chore`. Never skip it silently — a review that quietly loses a check as docs move is worse than
one that fails loudly.

Do not paraphrase a doc's rules into the report. Cite them: every finding carries `rule_source`
with the path (and anchor, where the doc has one), so a reader can check you.

## Severity and confidence

Label every finding from this fixed set. Do not invent headings — three baseline runs produced
three different taxonomies, which is why the set is closed.

| Label        | For                                            |
| ------------ | ---------------------------------------------- |
| `issue`      | a defect or a violated rule                    |
| `suggestion` | a concrete improvement that is not a violation |
| `nitpick`    | cosmetic                                       |
| `question`   | you cannot tell without the author             |
| `todo`       | a required follow-up the change implies        |
| `chore`      | housekeeping, including a broken map entry     |
| `praise`     | something specifically well done               |
| `note`       | context the reader needs, no action            |

Each carries `blocking: true|false`.

**Blocking is calibrated by reach, not by how wrong it feels:**

- Shared, foundation, or config files, or files existing apps already consume → strict; violations
  block.
- Files wholly inside a new lib nothing consumes yet → lenient; style issues are non-blocking.

**Confidence 0–100. Report only ≥ 80.** Below that you have a hunch, and a report full of hunches
gets switched off. Do not report:

- pre-existing issues on lines the author did not touch
- anything a linter, compiler, or typechecker would catch (the _Automated checks_ section owns it)
- nitpicks a senior engineer would let pass
- changes that are plainly intentional and part of the stated goal

**Verdict** is mechanical: any blocking finding → `fail`. Otherwise non-blocking findings →
`pass_with_warnings`. Otherwise → `pass`.

## Verify every blocking finding before it ships

A blocking finding stops a merge and sends someone back to their code. You scored it yourself,
and an author grading their own work is the weakest check in this skill.

**Before writing the report, dispatch one subagent per blocking finding** to try to break it.
Give it only what it needs to judge — the finding, the file, and the base ref — never your
reasoning for it, which is what you want tested rather than repeated.

Ask it for three things:

1. **Is the defect real?** Reproduce the reasoning from the code, not from the claim.
2. **Is it introduced by this change**, or did it already exist on the base branch?
3. **Is the cited rule real** — does that doc, at that path, actually say that?

Then act on what comes back:

| Verdict                                         | Do                                                         |
| ----------------------------------------------- | ---------------------------------------------------------- |
| confirmed                                       | keep it blocking; set `verdict: "CONFIRMED"`               |
| real but pre-existing on the base               | drop it, or demote to `note` saying it predates the change |
| real but not blocking                           | demote to non-blocking, keep the finding                   |
| not reproducible, or the rule does not say that | **drop it** — do not argue it back in                      |

Non-blocking findings are not verified. They cost the reader little if wrong, and verifying
everything makes the review slow enough that people stop running it.

### When you cannot dispatch a subagent

**Assume nothing about this capability.** Agent harnesses differ, and some cannot dispatch
subagents at all — or cannot when they are already running as one. The review must complete
either way; verification makes it stronger, it is never what makes it possible.

**Establish which case you are in by trying, once, on the first blocking finding.** Do not decide
from the harness's name, and do not skip the attempt because a previous run in a different
environment worked.

| Outcome                           | Do                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| the dispatch works                | verify every blocking finding; set `verdict` to `CONFIRMED` on each survivor                   |
| dispatch is unavailable, or fails | **continue the review** — verify nothing, set `verdict: "PLAUSIBLE"` on every blocking finding |

When verification did not run, three things are required and none is optional:

1. Every blocking finding carries `verdict: "PLAUSIBLE"`.
2. _What I did not check_ names it plainly: findings were not independently verified, and why.
3. The verdict line says the review is unverified, so nobody reads `Fail` as a confirmed `Fail`.

**Never claim a verification that did not run.** That is the unverified-assertion rule turned on
your own process, and it is the more tempting version of it — a report that says `CONFIRMED`
reads as more authoritative, which is exactly why it must be earned.

## The two reports

Both are produced every run. Write them to
`.agents/_local/skills/x-code-diff-reviewer/`, and print the human one in the session.

| File                                           | For                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `report-{iso}-{shortsha}.md` + `latest.md`     | the human. Printed in session; ready to paste into a PR description.            |
| `report-{iso}-{shortsha}.json` + `latest.json` | machines. Schema and host-projection mapping: `references/report-mechanism.md`. |

The human report follows `assets/template/human-report.md` — its section order is fixed, and the
verdict comes first. Every section marked REQUIRED appears even when empty. Pick a worked example
from `assets/examples/human-report/` that matches your verdict; if none matches, follow the
template and say which sections you left empty. These examples live under
`.agents/skills/x-code-diff-reviewer/assets/examples/human-report/`. Optional caller examples
live under `.agents/skills/x-code-diff-reviewer/assets/examples/callers/` — copy, do not require.

**End the human report by pointing at the JSON.** A person who wants these fixed starts a new
cycle, and the agent doing that work should read `latest.json`, not this report — the JSON
carries exact paths, lines and rule sources, while this report is written in plain language for a
reader who is not fixing it themselves. The template's closing line says this; keep it.

### Status markers

A closed set of five, and they mark **status only** — never decoration, never one per finding.
A marker on every finding makes severity harder to scan, which is the opposite of the point.

| Marker | Where                  | Means                  |
| ------ | ---------------------- | ---------------------- |
| ✅     | verdict line           | pass                   |
| ⚠️     | verdict line           | pass with warnings     |
| ❌     | verdict line           | fail                   |
| 🛑     | the `Blocking` heading | these stop the merge   |
| 🔧     | the closing line       | how to get these fixed |

The same marker belongs on the **session** announcement of the verdict — a closing summary, or a
short return to a parent agent. Use the human-report verdict line (`✅ **Pass**`,
`⚠️ **Pass with warnings**`, `❌ **Fail**`), not only the JSON `state` names (`pass` /
`pass_with_warnings` / `fail`). Those names stay in `latest.json`.

Do not add a sixth. Do not put one in a finding title, a table cell, or `body_markdown` — the
JSON's consumers post that text to a pull request, where a stray glyph is noise.

### Session handoff (required)

Every run ends with a **session handoff** in the chat — not only the full `latest.md` dump,
and not only a one-line verdict.

The session handoff follows `assets/template/session-handoff.md` — headings and order fixed.
Every heading marked REQUIRED appears even when empty. Pick a worked example from
`assets/examples/session-handoff/` that matches your verdict; if none matches, follow the
template and say which sections you left empty. These examples live under
`.agents/skills/x-code-diff-reviewer/assets/examples/session-handoff/`.

When you return to a **parent agent**, that parent pastes this same block into the user-visible
session reply. Do not shrink it.

### Plain language

A non-developer reads this report. Rules adapted from ASD-STE100 — the writing rules only, not
its approved-word list:

- One instruction per sentence. Under 20 words.
- Active voice, present tense.
- One term per concept, every time. No synonyms for variety.
- No idiom, no metaphor, no sarcasm.
- Keep articles. Avoid noun stacks over three words.
- A technical term you cannot avoid gets a short gloss on first use.
- Never use a workspace term you have not verified in `CONTEXT.md`.
- **Name the real thing, then gloss it. Never substitute a softer word.** Write "a `ui` lib (a
  part that only displays things)" — not "a folder". The reader has to be able to repeat the term
  back to a developer, and a synonym you invented is not a term anybody else uses.

**Every finding states the user-visible consequence** — what a person would see or suffer — not
only the rule broken. "Hardcoded colors mean every brand renders the same blue, ignoring their
theme" beats "violates the dynamic-color rule".

Code, paths, and commands stay verbatim in backticks. The plain-language rules govern your prose,
not the evidence.

## Out of scope

- Do not **create** a merge request, comment on it, request-changes, approve, or assign anyone.
  Emit `suggested_reviewers` and `suggested_labels` in the JSON; do not apply them.
- **Do** update the **description** after `latest.md` exists, by running
  `scripts/publish-pr-description.mjs` (procedure: `references/publish-pr-description.md`).
  If that script skips, print its `reason` using the when/when-not table in that reference.
- **Do not resolve a CODEOWNERS handle to a host account.** Report the handle as written. A
  display name is not a login, and guessing one assigns the wrong person.
- **Do not add a rule to `docs/`.** If you find a rule with no doc home, report it as a `chore`
  finding. Changing the docs is a separate, deliberate change.

## Checklist

Copy into todos, prefixed `[review]`:

- [ ] `[review]` Run `scripts/collect-diff-facts.mjs`; confirm base branch and buckets
- [ ] `[review]` Stop if every bucket is empty
- [ ] `[review]` Confirm the report path is gitignored (test a file inside `_local`, not the bare
      directory); raise a `chore` finding only if it genuinely is not
- [ ] `[review]` Resolve optional prefs (team over local); both homes empty is normal
- [ ] `[review]` Load only the map entries the diff triggers; report any missing path as `chore`
- [ ] `[review]` Run affected lint and unit tests; record commands and exit codes
- [ ] `[review]` Judge each changed file; drop findings below confidence 80
- [ ] `[review]` For a framework default with no workspace doc, consult an available MCP or the
      installed version's official docs — never recalled training
- [ ] `[review]` Ask the two execution questions — what if this runs twice, and what if the
      collection is large (`references/checks/execution-and-scale.md`)
- [ ] `[review]` Label and set `blocking` by reach; compute the verdict mechanically
- [ ] `[review]` Dispatch a verification subagent per blocking finding; drop or demote what it
      cannot confirm, and record `verdict` on each
- [ ] `[review]` Fill every REQUIRED section, including _What I did not check_
- [ ] `[review]` Confirm no claim asserts an unrun check's outcome
- [ ] `[review]` Write the `.md` and `.json` reports plus both `latest.*`; print the `.md`. In
      the session, print the **Session handoff** from `assets/template/session-handoff.md` —
      not only the JSON `state`, and not only a one-line verdict.
- [ ] `[review]` Run `scripts/publish-pr-description.mjs`; if skipped, print the matching
      when/when-not reason. If a merge-request URL appears later in this run, run the script
      again — do not re-review.
- [ ] `[review]` Verify `git status` matches the state you started in

## Changing this skill

Not a review-run step. Copy into todos when this skill's `metadata.version` changes (minor or
major; a patch leaves `Explains:` alone):

- [ ] `[review]` Set `Explains:` on each human-only reference to the new version

## Common mistakes

| Mistake                                                                     | Fix                                                                                                                               |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Fixed something "mechanical" while reviewing                                | Revert nothing, touch nothing. It is a finding.                                                                                   |
| Wrote reports into a repo where `/.agents/_local/` is not ignored, silently | Check with `git check-ignore`; raise a `chore` finding. Never edit `.gitignore`.                                                  |
| Ran `check-ignore` on the bare `_local` directory                           | Test a file path inside it. A directory pattern misses a directory that does not exist yet, so the check fires on a correct repo. |
| Folded a race into the missing-unsubscribe finding                          | Two defects, two fixes. Teardown does not fix ordering — report them separately.                                                  |
| Reviewed a nested scan and called it correct                                | Correct and quadratic are compatible. Ask what happens at 10,000 rows.                                                            |
| Shipped a blocking finding you scored yourself                              | Dispatch the verification subagent. Drop what it cannot confirm.                                                                  |
| Audited authentication or crypto from a diff                                | Report sinks you can point at; decline controls you would have to test.                                                           |
| Added a `NOTE:`/`TODO:` in the source                                       | The report holds findings. A comment is an edit.                                                                                  |
| Said a check would fail without running it                                  | Cite command and exit code, or move it to _not checked_.                                                                          |
| Invented severity headings                                                  | Use the closed label set plus `blocking`.                                                                                         |
| Assumed the base branch is `main`                                           | Walk the ladder. Rung 1 is unset in many checkouts.                                                                               |
| Reviewed only the working tree                                              | Three buckets. Commits on the base branch are the easy one to miss.                                                               |
| Diffed against the base tip                                                 | Always `merge-base`.                                                                                                              |
| Treated an uncommitted change as part of the PR                             | Say it is not in the PR yet.                                                                                                      |
| Paraphrased a doc's rule into the report                                    | Cite `rule_source`. The doc owns its wording.                                                                                     |
| Skipped a map entry whose path was missing                                  | Report it as `chore`. Silent loss of a check is the worse failure.                                                                |
| Audited the whole repo, not the change                                      | The subject is the diff.                                                                                                          |
| Omitted _What I did not check_                                              | REQUIRED, every run, even when short.                                                                                             |
| Ran the full workspace test suite                                           | `nx affected`. e2e only on demand.                                                                                                |
| Counted a generator-default spec as coverage                                | Boilerplate. Emit a `note`. Scaffolded `should create` and NgRx `should work` both count.                                         |
| Required an Nx or Angular MCP                                               | A lookup, if this session has one. Its absence is not a finding.                                                                  |
| Treated missing `prefs.json` as an error                                    | Both homes empty is normal. Use announced defaults.                                                                               |
| Invoked a sibling skill named in the asset map                              | Read the file at that path. Do not run the producer skill.                                                                        |
| Allowed a default Tailwind palette class because it is "real Tailwind"      | The app config and the preset it extends are the closed set.                                                                      |
| Skipped Ionic shell or navigation because capacitor.md did not load         | Ionic UI is the doc map. capacitor.md is native plugins only.                                                                     |
| Created a merge request, or assigned reviewers                              | Out of scope. Emit suggestions in the JSON; do not apply them.                                                                    |
| Resolved `@Name` to a host username                                         | Report the handle verbatim.                                                                                                       |
| Treated the projection or publish examples as the only hosts                | `unknown` is valid. Add a detector and a find/update pair; do not bend an existing mapping.                                       |
| Treated a skipped prepend as a failed review                                | The session report is the review. Prepend is optional.                                                                            |
| Announced only `pass` / `fail` / `pass_with_warnings` in the session        | Use the human-report verdict line, including ✅ / ⚠️ / ❌. The enum is the JSON `state`.                                           |
| Returned only verdict + counts + path to a parent agent                     | Return the full **Session handoff** from `assets/template/session-handoff.md` and paste it in chat.                                |
| Omitted empty Blocking / Non-blocking sections from the handoff             | Follow the template — both headings always print; write `None.` when a list is empty.                                             |
| Omitted 🔧 Fix these? from the handoff                                      | Follow the template — offer a new cycle when there are findings; write `Nothing to fix.` when both lists are empty.               |
| Applied review findings in the same run as the review                       | Review stays read-only. Offer a **new** cycle; wait for an explicit yes.                                                          |
