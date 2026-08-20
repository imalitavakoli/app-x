# Superpowers upgrade playbook

**Read this when the installed Superpowers version changes** — the pin was moved, a rollback, a fresh machine, or a machine that resolved something other than the pin. Not needed for an ordinary workflow edit.

**You do not have to notice the change yourself.** Claude Code picks up plugin updates at startup, so a change lands before anyone is looking. Since we pin the version ourselves (Step 1), a change now means somebody moved _our_ pin — which is exactly the moment this review is owed.

`scripts/superpowers-baseline.json` records the version this workflow was last reviewed against, and the checker's **`sp-version`** rule compares it to what is installed. **How loud that is depends on which semver segment moved** — the policy lives in `scripts/workflow-config.mjs` → `VERSION_DRIFT_POLICY`:

| Drift     | Default  | Why                                                                                                                                                                                           |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **major** | **fail** | Breaking by declaration.                                                                                                                                                                      |
| **minor** | **fail** | Adds features, and specifically may add _skills_ — a new skill whose description claims "design work" or "a defect" can start winning the routing match and silently change which path fires. |
| **patch** | **note** | Usually fixes. Reported in the checker output; no session-start escalation.                                                                                                                   |

Exact-matching every segment was rejected deliberately: a gate that fires on every upstream patch is one people learn to silence. **The accepted risk is stated plainly** — a patch that rewords one of the prose dependencies below slips past with only a note. Raise `VERSION_DRIFT_POLICY.patch` to `'fail'` if you would rather pay the noise.

Two things run the rule, at deliberately different cadences:

| Trigger                                         | When                         | Why it exists                                                                                                                                                                                                                    |
| ----------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.claude/hooks/check-superpowers-version.mjs`   | **every session start**      | The primary signal. An upgrade lands at startup, so this is the first moment anyone is present to be told. Silent when the versions match.                                                                                       |
| `.claude/hooks/guard-workflow-edits.mjs` (post) | on any workflow-surface edit | A backstop. Necessary but **not sufficient on its own**: a workflow edit is the rarest activity in the repo, so between an upgrade and the next one, every cycle would run against an unreviewed version with nothing saying so. |

Clearing the failure is Step 6 below, not an edit to the baseline: bumping the version without doing the review only silences the one thing that noticed.

Our workflow is a **layer**, not a fork: it attaches to Superpowers' lifecycle and relies on Superpowers behaving in specific ways. None of those reliances is enforced by Superpowers — it does not know we exist. So an upgrade cannot fail loudly. It can only start behaving differently while every one of our files still reads correctly.

That has already happened once: a hook anchored to `verification-before-completion` turned out to be reachable only from `systematic-debugging`, so it never fired on the build path at all, and nothing reported anything.

## Step 1 — establish what you are actually running

```bash
ls ~/.claude/plugins/cache/superpowers-marketplace/superpowers/
```

Each subdirectory is an installed version. More than one means a scope skew is _possible_ — check which is enabled where:

```bash
grep -A4 enabledPlugins ~/.claude/settings.json .claude/settings.json
```

Then read the pin — the version **we** ask for:

```bash
node -e "const s=require('./.claude/settings.json');console.log(JSON.stringify(s.extraKnownMarketplaces['superpowers-pinned'],null,2),s.enabledPlugins)"
```

The installed version and the pin should agree. If they do not, this machine resolved something other than the pin — investigate that before reviewing anything, because the review would be against the wrong code.

We pin the version ourselves, so **upstream cannot move it**. The pin is an inline marketplace in `.claude/settings.json` → `extraKnownMarketplaces["superpowers-pinned"]`, naming the plugin repo and an exact 40-char `sha`; `enabledPlugins` disables `superpowers@superpowers-marketplace` (upstream's moving catalog) and enables `superpowers@superpowers-pinned`. Because project settings outrank user settings, a teammate's own install does not win either.

So the version changes only when somebody edits that pin — a committed, reviewable act, and one the workflow guard fires on because `.claude/settings.json` is a guarded surface. **Moving the pin is what obliges this playbook.**

Record the version and the git ref, because "6.1.1" is not precise enough to reason about later:

```bash
git -C ~/.claude/plugins/cache/superpowers-marketplace/superpowers/<version> log -1 --format='%H %ad %s'
```

## Step 2 — run the checker first

```bash
pnpm run check:workflow
```

Two rules speak to upgrades. **`sp-version`** is what sent you here: it compares the installed version against `scripts/superpowers-baseline.json`, at the severity `VERSION_DRIFT_POLICY` assigns to the segment that moved, and it also checks Superpowers is actually _enabled_ (project settings can disable it, and a marketplace can be registered with nothing installed from it). **`sp-skills`** verifies every hook attach-point still names an installed skill, and prints the version it checked against. Run the whole checker **before** touching anything, so you know what the new version already broke.

**A SKIP is not a pass.** If the plugin cache cannot be located, `sp-skills` reports SKIP — nothing was verified. (`sp-version` FAILS in that case rather than skipping, because an absent plugin makes the whole workflow inoperative, not merely unverified.) Either way, resolve it before reviewing.

What it proves: no attach-point dangles. What it cannot prove: that a skill still _does_ what we assume. That is Steps 3–4, and it is the whole of the work.

## Step 3 — re-verify the dependency surface

Every assumption our workflow makes, and how it is held up on the Superpowers side. **Sort by the third column** — how an assumption is enforced determines whether its breakage is loud or silent, and only the silent ones need real attention.

### Script-enforced — breaks loudly, low risk

A shell script either runs or errors. If these change, you will know.

| We assume                                                | Where                                                                     | If it changed                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Per-task briefs are extracted to a git-ignored workspace | `subagent-driven-development/scripts/task-brief`, `scripts/sdd-workspace` | Our `.superpowers/` ignore assumption and the "plan never reaches a branch" preference. Re-check the workspace path. |
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
| **Spec location is user-overridable**                                                        | `brainstorming/SKILL.md` → "(User preferences for spec location override this default)"                                                          | Specs land in the committed default instead of git-ignored `.superpowers/specs/`, reaching a branch.                                                                                                                                                                                                                                                                                      |
| **Plan location is user-overridable**                                                        | `writing-plans/SKILL.md` → "(User preferences for plan location override this default)"                                                          | Same, for plans. Also breaks the plan-path handoff, which assumes a stable ignored location.                                                                                                                                                                                                                                                                                              |
| **`brainstorming`'s exclusive exit targets _implementation_ skills**                         | `brainstorming/SKILL.md` → "The ONLY skill you invoke after brainstorming is writing-plans"                                                      | Our documented override inserting the PRD/TFS writers in that gap. If it starts forbidding document skills too, the override needs re-justifying — or the writers need a different attach-point.                                                                                                                                                                                          |
| **`brainstorming` wants the design doc committed**                                           | `brainstorming/SKILL.md` → _Commit the design document_                                                                                          | We deliberately skip this because the path is ignored. If the step is dropped, our "intentionally skipped" note becomes dead text worth removing.                                                                                                                                                                                                                                         |
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

| The change is…                               | Do                                                                                                                                                                               |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A skill renamed or split                     | Re-anchor the affected hook. The name is a marker for a **lifecycle moment**, not the thing itself — keep the moment, change the name. Then `pnpm run check:workflow`.           |
| A skill removed                              | The moment it marked still governs. Decide where that work now attaches, run the hook there, and say so. Never silently skip it, and never substitute a similar-looking skill.   |
| A prose assumption reworded                  | Re-read the new wording and decide whether our reliance still holds. If it does not, the fix is usually a `AGENTS.md` _Workspace preferences_ entry, not a workflow restructure. |
| A new skill that could win the routing match | Read its `description`, assign it a path, update `AGENTS.md`'s path table if the marker changed.                                                                                 |
| Cosmetic / unrelated                         | Record the version and move on.                                                                                                                                                  |

## Step 6 — record it, which is also what clears the gate

**Update `scripts/superpowers-baseline.json`**: set `version` to the version you just reviewed, `gitSha` to the ref from Step 1, `reviewed` to today, and `reviewedBy` to who or what did it. That is what turns `sp-version` green again — and it is a claim that Steps 3–4 actually happened, so do not write it otherwise.

Then record the rest where the change is:

- the version and git ref you verified against, in the commit message
- any hook re-anchored, in the path file
- any assumption that changed, as an amended **Revisit if** on the matching rationale entry — that is what those lines are for

`docs/agents/sp-workflow-rationale.md` is not the home for the version itself — that file holds decisions, not state.

If an assumption in the table above changed, **update the table in this file too**. A playbook that describes the previous version is worse than none, because it will be trusted.

## What this playbook cannot do

It lists the dependencies we know about. An upgrade can introduce behaviour we never thought to depend on or guard against — a new guard skill that fires mid-cycle, a changed default that interacts with a preference. The scenarios are the only backstop for that, and they are a sample, not a proof.

Treat a clean upgrade review as "no known dependency broke", never as "nothing changed".
