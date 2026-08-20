---
name: x-sp-workflow-helper
description: 'WHAT? The procedure and integrity checker for changing the Superpowers-First Workflow surfaces — `AGENTS.md`, `docs/agents/sp-workflow-*.md` and the `x-*` skills they name. WHEN? Before adding, renaming, renumbering or deleting a hook, gate, constraint, entry, path or landmark; before moving a rule between those files; after any such edit, to prove nothing dangled; and whenever the installed Superpowers version changes.'
metadata:
  version: '1.0.0'
---

# SP Workflow Helper

## Overview

This skill is a **helper**: it puts the procedure for changing the workflow into your context, and hands you a checker to prove the change is sound. It **produces nothing** — whoever is doing the work makes the edit.

It covers only the **change discipline**. It deliberately does not restate:

- **what the landmarks mean** — that is `docs/agents/sp-workflow-format.md`, the notation catalog, and it stays the authority. Read it in full before editing a path file.
- **which surface owns a fact** — that is `docs/agents/where-content-lives.md`.
- **why a decision was made** — that is `docs/agents/sp-workflow-rationale.md`.
- **how to build a skill** — that is `x-skill-build-helper`.

Both remain in force. This skill is the one that says: _before you touch any of them, here is what breaks, and here is how to find out._

## When to use

Before **any** edit to `AGENTS.md`'s workflow section, to any `docs/agents/sp-workflow-*.md`, or to `docs/agents/where-content-lives.md` — specifically when you are about to:

- add, rename, renumber or delete a 🪝 hook, 🚧 gate, 📌 constraint, 🚪 entry, ▶️ resume, 🎛️ mode, set, or step band
- move a rule between `AGENTS.md`, a path file, the shared rules, and the procedures file
- re-anchor a hook to a different Superpowers skill
- add or retire an `x-*` skill that the workflow names

**When the installed Superpowers version changed** — an upgrade, a rollback, a fresh machine, or a marketplace catalog that moved — read [references/superpowers-upgrade.md](references/superpowers-upgrade.md) instead of this file's procedure. Our layer relies on Superpowers behaving in specific ways, and none of those reliances is enforced on the Superpowers side, so an upgrade cannot fail loudly. That playbook holds the dependency surface, sorted by whether a breakage would be loud or **silent**.

Not for **following** a path — that needs the path file, not this. Not for authoring a skill's own content — that is `x-skill-build-helper`.

## What each piece catches — read this first

This skill has several moving parts. They are not alternatives: each catches a class the others structurally cannot, and the three cases in the second table are all things that **actually happened** while building this skill.

| Piece                                                  | Catches                                                                                                                                                                                                      | How                                                                                                                   | When it runs                                                                                                                                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/check-workflow.mjs`                           | **Broken references** — a hook ID no heading defines, a dead file path, an `#anchor` no heading yields, a hook anchored to an uninstalled Superpowers skill, a drifted tool stub, a path file citing another | 11 mechanical rules over `AGENTS.md`, `docs/agents/` and the `x-*` skills                                             | every edit (hook), and on demand                                                                                                                                                  |
| `scripts/superpowers-baseline.json`                    | **Nothing by itself** — it records the Superpowers version last reviewed against, so `sp-version` can notice a change nobody announced                                                                       | update it only as the closing step of an upgrade review                                                               | n/a                                                                                                                                                                               |
| `scripts/workflow-config.mjs` → `VERSION_DRIFT_POLICY` | **Nothing by itself** — it decides how loud version drift is per semver segment, so the gate stays credible instead of firing on every patch                                                                 | edit the tier, not the rule                                                                                           | n/a                                                                                                                                                                               |
| `scripts/workflow-config.mjs`                          | **Nothing by itself** — it is the knobs the checker reads (doc paths, reserved icons, attach-point positions, slug rules)                                                                                    | edit here instead of the checker when the notation or a path changes                                                  | n/a                                                                                                                                                                               |
| `SKILL.md` (this file)                                 | **A stale _copy_ of a rule** — text that still parses perfectly but now contradicts the change you just made. No script can find this; the _Before calling a workflow change done_ sweep is what does        | grep a distinctive phrase from the text you replaced across `AGENTS.md`, `CONTEXT.md`, `docs/`, `.agents/skills/`     | read before editing                                                                                                                                                               |
| `assets/scenarios/README.md`                           | **Behaviour that changed in a way you did not intend** — a hook on the wrong lifecycle moment, a gate asking the wrong question, an edit to one hook altering routing elsewhere                              | RED / GREEN / **CONTROL** subagent runs against pre- and post-change docs                                             | only when the edit changes what an agent _decides_                                                                                                                                |
| `references/superpowers-upgrade.md`                    | **A Superpowers behaviour we depend on that quietly moved** — 12 of our assumptions rest on single sentences in Superpowers' own files                                                                       | re-read the named sentence in the new version; the table sorts every dependency by whether breakage is loud or silent | when `sp-version` fails, reported at **every session start** by `.claude/hooks/check-superpowers-version.mjs` — you do not have to notice the upgrade yourself, and you would not |

**The three real cases, so the split is concrete rather than theoretical:**

| What went wrong                                                                                                                                                       | Checker       | Caught by      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------- |
| `AGENTS.md` linked `#superpowers-first-workflow`; the `🦸` in the heading makes the slug `-superpowers-first-workflow`. Plus all 24 `[🔝]` links in the rationale doc | **caught it** | the checker    |
| `x-ng-sp-plan-enricher` put implementer conventions in Global Constraints, which only reach an implementer if the controller carries them                             | **green**     | a scenario run |
| `sp-workflow-rationale.md` said implementers "get the plan's Global Constraints and nothing else" — false after that fix                                              | **green**     | the sweep      |

Rows 2 and 3 are the point: **every reference in them resolved perfectly.** The sentence was simply wrong, and a script cannot tell.

**So: a green checker means "no reference is broken". It never means "the change is correct."**

## The rule

**Every change to the workflow is a rename in disguise.** The system's load-bearing parts are _references_: a hook ID cited from a `Spans:` line, an anchor in a pointer, a Superpowers skill name a hook hangs off, a description duplicated into a `.claude/` stub. Each of those breaks **silently** — a stale hook ID, a dead anchor and a drifted stub all still read as plausible, so review does not catch them.

So the discipline is not "edit carefully". It is: **make the edit, then prove the references still resolve.**

```bash
node .agents/skills/x-sp-workflow-helper/scripts/check-workflow.mjs
```

Exit 0 means every declared invariant holds. Run it **before** your edit too, so you know which failures you inherited and which you caused.

## The checker

Eleven rules, each one a failure class that has actually happened here (or, for `sp-version`, the one moment they all become possible at once). `--list` prints them; `--rule=<id>` runs one; `--json` for tooling.

| Rule                | Catches                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hook-ids`          | a cited hook ID with no matching `#### 🪝` heading — the renumbering failure                                                                                                                                                                                                                                                                                   |
| `links`             | a cited file or directory that does not exist                                                                                                                                                                                                                                                                                                                  |
| `anchors`           | a `#anchor` no heading yields, under either real renderer's slug algorithm                                                                                                                                                                                                                                                                                     |
| `sp-skills`         | a hook anchored to a Superpowers skill that is **not installed** — the dangling-hook failure                                                                                                                                                                                                                                                                   |
| `sp-version`        | Superpowers absent, disabled, installed-from-nothing, or at a version this workflow has never been reviewed against — the trigger for the upgrade playbook. Severity follows `VERSION_DRIFT_POLICY` (major/minor fail, patch notes). Run at **session start** by its own hook, because a version change lands at startup and a workflow edit may be weeks away |
| `x-skills`          | a named skill that is missing, a stub whose `description` has drifted, an orphan stub, a `name:`/folder mismatch                                                                                                                                                                                                                                               |
| `versions`          | a skill with no block-form semver                                                                                                                                                                                                                                                                                                                              |
| `path-isolation`    | one path file citing another                                                                                                                                                                                                                                                                                                                                   |
| `landmarks`         | a `####` heading that is not a hook, a malformed hook heading, a reserved icon misused, a `Spans:`/`Members:` that names no ID                                                                                                                                                                                                                                 |
| `skill-coupling`    | an `x-*` skill naming a hook ID or path letter (outside the `x-*-sp-*` family)                                                                                                                                                                                                                                                                                 |
| `allowlist-hygiene` | a suppression that no longer matches anything                                                                                                                                                                                                                                                                                                                  |

**What it cannot check.** It verifies that references _resolve_, never that prose is _correct_. A hook attached to the wrong lifecycle moment, a gate that asks the wrong question, a rule that contradicts another in plain English — all pass. Those need the scenario run below. Do not read a green checker as "the change is right".

### Suppressing a finding

`scripts/allowlist.json`, with a `why`. Only for a genuine false positive — the standing case is a doc that _quotes_ a violation as a counter-example. `allowlist-hygiene` fails when an entry stops matching, so a suppression cannot outlive the text it was written for.

**A growing allowlist means the rule is wrong, not that the repo is.** Past two or three entries for one rule, fix the rule.

## Prove behaviour changed the way you intended

The checker proves references resolve. It cannot prove an agent will _do_ the right thing. For that, run the change as a scenario — this is the RED/GREEN method from Superpowers' **skill-authoring skill** (today `writing-skills`), and it applies to these docs directly: that skill's own worked example tests `CLAUDE.md` variants, not a skill.

`assets/scenarios/` holds the harness and the standing scenarios. The short form:

1. **RED** — dispatch a subagent with the task and the **pre-change** docs. Record what it actually does, verbatim.
2. **GREEN** — same task, same pressures, **post-change** docs. The behaviour you were trying to change must change, and nothing else may.
3. **Watch for collateral change.** This is the failure mode this workflow is exposed to: an edit meant to affect one hook alters routing three hooks away. Assert the _unrelated_ behaviours too, not only the one you touched.

Reach for this when the change alters **what an agent decides** — a new gate, a re-anchored hook, a reworded routing rule. A pure reference fix (a corrected anchor, a moved rule with identical wording) needs the checker only.

## Before calling a workflow change done

1. **Run the checker.** Zero failures, or every remaining one pre-existing and named.
2. **Sweep for the rule's other homes.** Take a distinctive phrase from the text you replaced and grep `AGENTS.md`, `CONTEXT.md`, `docs/` and `.agents/skills/`. This is `x-skill-build-helper` → _Before calling a rule change done_, and it applies to workflow edits identically — the checker finds broken **references**, never a stale **copy** of a rule that still parses.
3. **Confirm the fact is in exactly one home** — `docs/agents/where-content-lives.md`. Moving a rule means the old site becomes a pointer, not a second copy.
4. **Record the reasoning if a decision changed** — `docs/agents/sp-workflow-rationale.md`, one entry with its **Revisit if**. An undocumented decision gets re-litigated.
5. **Update the todo/step count** if you added or removed a step: a step that no path turns into a todo is a step that gets skipped.

## Common mistakes

| Mistake                                            | Fix                                                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Renumbering hooks and fixing only the path file    | `Spans:`, `Members:`, `⚪` lines, the `x-*-sp-*` skills and this repo's memory all cite IDs. Run `hook-ids`.                                |
| Trusting an anchor because the file exists         | A heading starting with an emoji never yields the slug you would guess — `## 🦸 Title` is `#-title`. Run `anchors`.                         |
| Re-anchoring a hook to a plausible-sounding skill  | Check it is installed and read its own `description`. A hook on a skill that is never invoked never fires, and looks fine. Run `sp-skills`. |
| Changing a skill's `description` without its stub  | The Skill tool matches the stub. Run `x-skills`.                                                                                            |
| Adding a rule to the path file you had open        | `where-content-lives.md` decides the home. A path-local copy of a shared rule drifts.                                                       |
| Making one path cite another                       | Extract to the shared rules or the procedures file. Run `path-isolation`.                                                                   |
| Reading a green checker as "the change is correct" | It proves references resolve, nothing more. Behaviour changes need a scenario run.                                                          |
| Widening the allowlist to get to green             | A false positive means fix the rule; a true positive means fix the repo.                                                                    |
| Editing a path file without the notation           | `sp-workflow-format.md` in full first — the `Shape` lines are the point when editing.                                                       |

## Confirm the current tooling before relying on this

The checker resolves the installed Superpowers from the plugin cache and reports the version it checked against. If that lookup fails, `sp-skills` reports **SKIP**, not OK — a skip is not a pass. The plugin path and layout are what they are **today**; re-read `scripts/check-workflow.mjs` → `findSuperpowersSkills` rather than trusting this line, and note the workspace can carry different versions at user and project scope.
