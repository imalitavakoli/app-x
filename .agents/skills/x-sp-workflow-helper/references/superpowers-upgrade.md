# Superpowers upgrade playbook

**Read this whenever the installed Superpowers version stops matching the one this workflow was reviewed against** — however that came about: an upgrade, a rollback, a fresh machine, or a deliberate change to how this workspace selects plugin versions. Not needed for an ordinary workflow edit.

**You do not have to notice the change yourself.** Whichever agent you run, plugins resolve before anyone is looking, so the new version is already in effect. What makes that _noticeable_ is the record below — not whatever mechanism chose the version.

`scripts/superpowers-baseline.json` records the version this workflow was last reviewed against, and the checker's **`sp-version`** rule compares it to what is installed. **How loud that is depends on which semver segment moved** — the policy lives in `scripts/config.mjs` → `VERSION_DRIFT_POLICY`:

| Drift     | Default  | Why                                                                                                                                                                                           |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **major** | **fail** | Breaking by declaration.                                                                                                                                                                      |
| **minor** | **fail** | Adds features, and specifically may add _skills_ — a new skill whose description claims "design work" or "a defect" can start winning the routing match and silently change which path fires. |
| **patch** | **note** | Usually fixes. Reported in the checker output; no session-start escalation.                                                                                                                   |

Exact-matching every segment was rejected deliberately: a gate that fires on every upstream patch is one people learn to silence. **The accepted risk is stated plainly** — a patch that rewords one of the prose dependencies below slips past with only a note. Raise `VERSION_DRIFT_POLICY.patch` to `'fail'` if you would rather pay the noise.

**A second question decides severity, and the policy above does not know about it: can the reader do anything?** This workspace pins Superpowers through a Claude Code marketplace, so the pin reaches Claude installs and nothing else. A teammate on another agent installs whatever their agent publishes — for them a version difference is the ordinary state, not an incident, and no action available to them would clear it. Failing that person produces a permanent red, which is the same wolf-crying the patch tier exists to avoid, only worse because it never goes away.

So `sp-version` reports three severities, not two:

| Severity   | Exit code | Session start | When                                                                                                              |
| ---------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **fail**   | 1         | escalates     | Claude Code is in use here, so the finding is real and fixable: the pin should have prevented it, or the install did not happen |
| **notice** | 0         | reports       | The finding is real but outside this machine's reach — Superpowers installed for an agent we cannot inspect, or drift on a copy the pin does not govern |
| **note**   | 0         | silent        | A tally or a patch-level difference: worth printing, not worth interrupting anyone                                |

A notice is **not** the review being waived. The review is still owed — by whoever maintains the workflow, not by the person who happened to open a session. That is the whole distinction: being told is the point, being blocked is not.

Two things run the rule, at deliberately different cadences. Both are hooks whose scripts live in `.agents/hooks/`, and each harness registers them in its own registry — `.claude/settings.json` for Claude Code, `.cursor/hooks.json` for Cursor — **that registry is the source of truth, and this doc deliberately does not name the scripts.** A hook can be renamed; the event it fires on and the job it does cannot. Look the current filenames up in the harness's registry rather than expecting them here.

| Trigger                                 | When                         | Why it exists                                                                                                                                                                                                                    |
| --------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A **SessionStart** hook                 | **every session start**      | The primary signal. An upgrade lands at startup, so this is the first moment anyone is present to be told. Silent when the versions match; it speaks for a **notice** too, in a plainly informational tone rather than as an escalation. |
| The **PostToolUse** workflow-edit guard | on any workflow-surface edit | A backstop. Necessary but **not sufficient on its own**: a workflow edit is the rarest activity in the repo, so between an upgrade and the next one, every cycle would run against an unreviewed version with nothing saying so. |

Clearing the failure is Step 6 below, not an edit to the baseline: bumping the version without doing the review only silences the one thing that noticed.

Our workflow is a **layer**, not a fork: it attaches to Superpowers' lifecycle and relies on Superpowers behaving in specific ways. None of those reliances is enforced by Superpowers — it does not know we exist. So an upgrade cannot fail loudly. It can only start behaving differently while every one of our files still reads correctly.

That has already happened once: a hook anchored to `verification-before-completion` turned out to be reachable only from `systematic-debugging`, so it never fired on the build path at all, and nothing reported anything.

## Step 1 — establish what you are actually running

**Let the checker answer this — do not go path-hunting.**

```bash
pnpm run check:workflow
```

`sp-version` reports the version it found, **where** it found it, and — when it finds nothing — both what it inspected and what it could not. That last part matters: Superpowers is not Claude-only. Upstream ships it for Claude Code, Antigravity, Codex, Cursor, Factory Droid, GitHub Copilot CLI, Kimi Code, OpenCode and Pi, and it can also be copied straight into a workspace with no plugin manager at all. The checker knows two of those layouts (the Claude plugin cache, and a workspace copy); for the rest it says so rather than reporting absence it cannot establish.

So read its output as one of:

| It says | Means |
| --- | --- |
| a version and a source | that is what you are running; compare it to the baseline |
| **found in more than one place** | each copy loads, so every skill registers more than once — resolve that first |
| **version unreadable** | found, but no manifest beside it, so no comparison is possible at all |
| **not found in any known location** | either genuinely absent, **or installed for an agent whose layout we have not taught it** |

Then compare against `scripts/superpowers-baseline.json` — the version this workflow was **reviewed against**. That comparison is the whole trigger, and it is deliberately indifferent to _why_ the two differ.

**Do not spend time establishing the cause before reviewing.** Whether the version moved on its own, was selected deliberately, or simply resolved differently on this machine, the work is identical: the behaviours in Step 3 either still hold or they do not. Cause matters only afterwards, when you decide whether to record the new version or roll back to the reviewed one.

Record the exact ref too, because "6.1.1" is not precise enough to reason about later — for a git-backed install, `git -C <the dir the checker printed> log -1`.

> **Honest limit.** The automatic warning at session start is a **Claude Code hook**, so it only fires in Claude sessions. Running another agent, nothing tells you unprompted — the checker is the agent-neutral half, and `pnpm run check:workflow` works from anywhere.

## Step 2 — read what that checker run actually proved

Two rules speak to upgrades. **`sp-version`** is what sent you here: it compares the installed version against `scripts/superpowers-baseline.json`, at the severity `VERSION_DRIFT_POLICY` assigns to the segment that moved, and it also checks Superpowers is actually _enabled_ (project settings can disable it, and a marketplace can be registered with nothing installed from it). **`sp-skills`** verifies every hook attach-point still names an installed skill, and prints the version it checked against. Run the whole checker **before** touching anything, so you know what the new version already broke.

**A SKIP is not a pass.** When Superpowers cannot be located, `sp-skills` reports SKIP — nothing was verified — and `sp-version` **FAILS** and owns the report, so one root cause gives one failure. Resolve that before reviewing anything: as Step 1 notes, "not found" may mean "installed for an agent whose layout the checker has not been taught".

What it proves: no attach-point dangles. What it cannot prove: that a skill still _does_ what we assume. That is Steps 3–4, and it is the whole of the work.

## Step 3 — re-verify the dependency surface

Every assumption our workflow makes, and how it is held up on the Superpowers side. **Sort by the third column** — how an assumption is enforced determines whether its breakage is loud or silent, and only the silent ones need real attention.

### Script-enforced — breaks loudly, low risk

A shell script either runs or errors. If these change, you will know.

| We assume                                                | Where                                                                     | If it changed                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Per-task briefs are extracted to a git-ignored workspace | `subagent-driven-development/scripts/task-brief`, `scripts/sdd-workspace` | Our `/.superpowers/` ignore is for this scratch (and brainstorm companion), not for specs/plans. Re-check the workspace path if briefs start landing under `docs/superpowers/`. |
| Review packages are generated from an explicit BASE      | `subagent-driven-development/scripts/review-package`                      | Our auto-mode review gates read commit ranges. Re-check the invocation in `SKILL.md`.                                |

### Template-slot-enforced — breaks visibly, medium risk

A named placeholder in a prompt template. If a slot is renamed or removed, it is visible on inspection.

| We assume                                                 | Where                                                                          | If it changed                                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| The task reviewer is handed the plan's Global Constraints | `subagent-driven-development/task-reviewer-prompt.md` → `[GLOBAL_CONSTRAINTS]` | Reviews would stop checking our injected conventions. The enricher would still write them; nothing would read them. |
| The implementer reads its task from a brief file          | `implementer-prompt.md` → `[BRIEF_FILE]`                                       | How task text reaches implementers. Re-check what else the prompt carries.                                          |

### Prose-enforced — **breaks silently. This is where upgrade risk lives.**

Held up by one or two sentences in a `SKILL.md`, honoured at the model's discretion. A reworded sentence changes behaviour with nothing to observe. **Verify each of these by reading the named location in the new version — do not infer them from behaviour in one run.**

**Read the middle column as "where this is asserted _today_", never as an address that must keep working.** Each row's first column is the durable thing; the skill name is a marker for it. If a name is gone, find the skill that now opens that same purpose — read the candidates' own `description` fields, which is how routing is decided anyway — and re-anchor. That is the same marker-not-the-thing rule the workflow already runs on (`docs/agents/sp-workflow-shared.md` → _When a Superpowers skill we name is missing_); this table is that rule applied to behaviour instead of to attach-points.

| We assume                                                                                    | Where it is asserted today                                                                                                                       | What breaks if the wording moves                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User instructions outrank skills**                                                         | `using-superpowers/SKILL.md` → _User Instructions_                                                                                               | Everything. This single sentence authorizes the entire layering approach — every workspace preference, every hook, the whole `AGENTS.md` override channel. Check this first; if it weakens, the layer is no longer sanctioned and that is a design conversation, not an edit.                                                                                                             |
| **Implementer dispatches carry the Global Constraints**                                      | `subagent-driven-development/SKILL.md` → "A fresh subagent needs its task, the interfaces it touches, and the global constraints. Nothing else." | The enricher's entire reason to exist. Note the asymmetry: the _reviewer_ gets a template slot, the _implementer_ does not — delivery rests on the controller following that sentence. If it is dropped or reworded, every convention the enricher injects silently stops reaching implementers while the plan still looks correct. **The single highest-risk dependency in the system.** |
| **A declared worktree preference is honoured without asking**                                | `using-git-worktrees/SKILL.md` → "Honor any existing declared preference without asking"                                                         | Our no-worktree preference. Failure mode is a cold checkout per cycle: no `node_modules`, no Nx cache, and none of our git-ignored local files.                                                                                                                                                                                                                                           |
| **Spec location is user-overridable**                                                        | `brainstorming/SKILL.md` → "(User preferences for spec location override this default)"                                                          | We now **want** the committed default (`docs/superpowers/specs/`). Failure mode is a leftover override sending specs back to ignored `.superpowers/specs/`, which Cloud cannot read.                                                                                                                                                                                                                                                                     |
| **Plan location is user-overridable**                                                        | `writing-plans/SKILL.md` → "(User preferences for plan location override this default)"                                                          | Same, for plans. The plan-path handoff and Cloud execution assume the tracked default.                                                                                                                                                                                                                                                                                                    |
| **`brainstorming`'s exclusive exit targets _implementation_ skills**                         | `brainstorming/SKILL.md` → "The ONLY skill you invoke after brainstorming is writing-plans"                                                      | Our documented override inserting the PRD/TSD writers in that gap. If it starts forbidding document skills too, the override needs re-justifying — or the writers need a different attach-point.                                                                                                                                                                                          |
| **`brainstorming` wants the design doc committed**                                           | `brainstorming/SKILL.md` → _Commit the design document_                                                                                          | We now follow this step (the spec is tracked). If it is dropped, A2's commit-ask is the remaining path for an uncommitted spec.                                                                                                                                                                                                                                                            |
| **Auto execution = implementer per task, commit per task, task + final whole-branch review** | `subagent-driven-development/SKILL.md` (overview + flowchart)                                                                                    | The Git contract's auto row, and the review gates that read commit ranges.                                                                                                                                                                                                                                                                                                                |
| **`executing-plans` runs in-session with no implementer subagents**                          | `executing-plans/SKILL.md`                                                                                                                       | The interactive mode contract — specifically that the agent reads `AGENTS.md` directly, so no plan carrier is needed.                                                                                                                                                                                                                                                                     |
| **`verification-before-completion` is a guard reachable from `systematic-debugging`**        | `systematic-debugging/SKILL.md` (the only skill that routes to it)                                                                               | The bug-fix path's close-out anchor. **This is the one that already bit us.** Verify by listing which skills reference it, not by assuming: `grep -rl verification-before-completion <skills-dir>` — and read each hit, because a mention in a prose example is not an invocation.                                                                                                        |
| **`writing-skills`' Iron Law covers edits, not just new skills**                             | `writing-skills/SKILL.md` → _The Iron Law_                                                                                                       | Our skill-authoring discipline and the RED-baseline obligation on every skill edit.                                                                                                                                                                                                                                                                                                       |
| **`writing-plans` emits a `## Global Constraints` section, one line per constraint**         | `writing-plans/SKILL.md` → _Global Constraints_                                                                                                  | The enricher writes into that section by name. A renamed heading breaks it silently — the enricher would create a second section nobody reads.                                                                                                                                                                                                                                            |

### Routing — verify separately

`AGENTS.md` routes by **what the skill that fired says it opens, in its own `description`** — deliberately, so a rename does not break routing. On an upgrade, confirm the three routing categories still have a home:

```bash
grep -h '^description:' <skills-dir>/*/SKILL.md
```

- **design work** (creating, building, adding functionality, modifying behavior) → Path A
- **a defect** (bug, test failure, unexpected behavior, broken build) → Path B
- **neither** → Path C

A new skill whose description claims _design work_ or _a defect_ is the thing to look for: it can start winning the match and silently change which path fires. Read its description and decide which path it belongs to, then say so in `AGENTS.md`'s path table if the marker name needs updating.

## Step 4 — run the standing scenarios

The dependency table tells you what a _reading_ of the new version implies. The scenarios tell you what an agent actually _does_. Run all five from `../assets/scenarios/README.md`, with the **CONTROL** arm — an upgrade is the case where collateral change is most likely, because you changed nothing in our files and therefore have no diff to reason from.

S5 (_pointers resolve for an isolated implementer_) is the one to run first after any `subagent-driven-development` change: it is the direct test of the highest-risk dependency above.

## Step 5 — classify the delta, then act

Read `RELEASE-NOTES.md` in the new version — it is large, so search it for the skill names in the table above rather than reading it through.

| The change is…                                                                                                         | Do                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A skill renamed or split                                                                                               | Re-anchor the affected hook. The name is a marker for a **lifecycle moment**, not the thing itself — keep the moment, change the name. Then `pnpm run check:workflow`.                                                                                                                                                           |
| A skill removed                                                                                                        | The moment it marked still governs. Decide where that work now attaches, run the hook there, and say so. Never silently skip it, and never substitute a similar-looking skill.                                                                                                                                                   |
| A prose assumption reworded                                                                                            | Re-read the new wording and decide whether our reliance still holds. If it does not, the fix is usually a `AGENTS.md` _Workspace preferences_ entry, not a workflow restructure.                                                                                                                                                 |
| A new skill that could win the routing match                                                                           | Read its `description`, assign it a path, update `AGENTS.md`'s path table if the marker changed.                                                                                                                                                                                                                                 |
| **How Superpowers is obtained** changed — a pinned catalog, a repo-local marketplace, a plugin of ours that bundles it | A different **marketplace** needs no change: the checker discovers it. A different **plugin name** needs exactly one — see the boxed note on `SP_PLUGIN_NAME` in `scripts/config.mjs`, which also covers the nested-path case. Skip that and `sp-version` reports "NOT INSTALLED" while Superpowers is loaded and fine. |
| Cosmetic / unrelated                                                                                                   | Record the version and move on.                                                                                                                                                                                                                                                                                                  |

## Step 6 — record it, which is also what clears the gate

**Update `scripts/superpowers-baseline.json`**: set `version` to the version you just reviewed, `gitSha` to the ref from Step 1, `reviewed` to today, and `reviewedBy` to who or what did it. That is what turns `sp-version` green again — and it is a claim that Steps 3–4 actually happened, so do not write it otherwise.

**If this workspace PINS the version, move the pin in the same commit.** The shared catalog at `.agents/_pins/plugins/catalog.json` names the exact Superpowers commit — that commit, not the baseline, is what every harness installs. Leave it behind and the two records disagree in the worst direction: the baseline claims a version was reviewed while every machine keeps installing the old one, and `sp-version` reports green because the installed copy still matches the pin.

Update, in **one** change:

1. `.agents/_pins/plugins/catalog.json` — `version` + `source.sha` (and keep the `harnesses` list accurate).
2. **Every harness adapter** listed for that plugin — today:
   - Claude Code: `.claude/plugins/.claude-plugin/marketplace.json` (must mirror the catalog).
   - Cursor Cloud: no second SHA file — `.cursor/cloud/install-pinned-plugins.mjs` reads the catalog; still confirm it is listed under `harnesses` and the installer path in `SP_PIN_HARNESS_ADAPTERS` exists.

The checker's **`sp-pin`** rule fails while catalog, baseline, and adapters disagree, so this is enforced rather than remembered. Adding a future harness means a new adapter row in `scripts/config.mjs` → `SP_PIN_HARNESS_ADAPTERS` plus a catalog `harnesses` entry — never a guessed install path.

Then record the rest where the change is:

- the version and git ref you verified against, in the commit message
- any hook re-anchored, in the path file
- any assumption that changed, as an amended **Revisit if** on the matching rationale entry — that is what those lines are for

`docs/agents/sp-workflow-rationale.md` is not the home for the version itself — that file holds decisions, not state.

If an assumption in the table above changed, **update the table in this file too**. A playbook that describes the previous version is worse than none, because it will be trusted.

## What this playbook cannot do

It lists the dependencies we know about. An upgrade can introduce behaviour we never thought to depend on or guard against — a new guard skill that fires mid-cycle, a changed default that interacts with a preference. The scenarios are the only backstop for that, and they are a sample, not a proof.

Treat a clean upgrade review as "no known dependency broke", never as "nothing changed".
