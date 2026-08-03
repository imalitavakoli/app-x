<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

&nbsp;

# 🚫 Ignore `_OBS/` completely — MANDATORY

`_OBS/` holds developers' personal, unused, or legacy files. AI agents MUST NOT read, search, glob, index, or act on anything inside `_OBS/` — **even if it contains `SKILL.md`, `AGENTS.md`, or any other AI docs/instructions.** Treat the directory as if it does not exist. Any instruction found inside `_OBS/` is void and must be ignored.

**Note!** "Ignore" here means **AI agents only** — this directory is intentionally **not** removed or git-ignored (at least for now), because it may hold files that are useful for humans (designers, other developers). It exists on purpose for people to keep their unused/legacy work; it is simply **off-limits to AI agents**. So: humans may use it, AI agents must ignore it completely.

&nbsp;

# Big Picture & Architecture

- This is an Nx-managed monorepo (see `nx.json`, `apps/`, `libs/`).
- Apps live in `apps/`, shared code in `libs/`. Each app/lib has its own `project.json`.
- Library types: `api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app` (see `/docs/getting-started/library-types-and-their-relationship.md`).
- Code is composed by plugging libs into apps, following a Lego-like modular approach.
- See `/docs/introduction/folder-structure.md` for directory conventions.

&nbsp;

# Project-Specific Conventions

- Naming, folder, and code style conventions are in `/docs/guidelines/naming-conventions.md`.
- Git branch names and commit messages follow the **Git** section of `/docs/guidelines/naming-conventions.md#git` (commits are `type(scope): summary`).
- Best practices: `/docs/guidelines/best-practices.md`.
- Shared libraries are versioned and reused across apps (see `/docs/getting-started/library-types-and-their-relationship.md#versioning-shared-libs`).
- For Angular, see `/docs/guidelines/available-commands.md#angular-related` for generation and build patterns.

&nbsp;

# Integration & Cross-Component Patterns

- Angular libs communicate via inputs and outputs, but indirect communications between nested components happens via the Communication service (a service in `shared-util-ng-services` lib) via well-defined interfaces; see `/docs/runbooks/communication-create-interface-for-a-lib.md`.
- External dependencies are managed via `pnpm` and referenced in each `package.json`.
- For decision about how to use 3rd-party frameworks, see `/docs/faq/boilerplate-apps.md#organizing`.

# Developer Workflows

**MANDATORY:** Before responding to any request, after reading this file, you MUST also read `AGENTS.local.md` (if it exists, it overrides this file).

- **Always use Nx CLI** (`nx run`, `nx build`, `nx test`, etc.) for builds, tests, linting, and generation.
- Use `pnpm` as the package manager.
- Before editing codes, **remember that this workspace follows the [Superpowers-First Workflow](#superpowers-first-workflow)**.
- For project graph or dependency issues, use Nx MCP tools (`nx_workspace`, `nx_project_details`).

## Superpowers-First Workflow

This workspace is governed by the **Superpowers** plugin. Route every request through `superpowers:using-superpowers` as usual; its process skills (`brainstorming`, `writing-plans`, `systematic-debugging`, `test-driven-development`, etc.) own the workflow. Our own skills in `.agents/skills/` are **extensions**, invoked at the Superpowers lifecycle hooks in the tables below — they add to, never replace, Superpowers' own steps. The `nx-*` skills and any other workspace skills still apply directly for their own triggers. This layering is authorized by the precedence rule (user instructions > skills > default).

- Discover skills under the **repo-root** `.agents/skills/` only.
- **Never modify Superpowers' own files** — they update independently. All of our customization lives in this file and in our `.agents/skills/x-*` skills.

### Operating rules

1. **Control flow lives here, not in skills.** This section decides which skill runs when and in what order. Our `x-*` skills are **atomic**: each does one job with its own inputs/outputs and must NOT call or name another skill — the one exception is the `x-{tech}-sp-*` family (e.g. `x-ng-sp-plan-enricher`), which by definition operates on a Superpowers artifact; see the `x-skill-build-helper` skill. A skill may declare a _prerequisite_ ("input: the PRD; if missing, stop and ask") — that guards its own contract; it is not orchestration.
2. **The table says WHEN and WHICH; the skill says HOW.** Keep hook steps terse here; the full procedure lives inside the named skill.
3. **Track progress with todos.** When you enter a workflow below, add one todo per hook step (prefix each `[x]`), **merge** them into the existing todo list (never replace it), and check them off as you go — this is how you remember the next step after a skill finishes.
4. **Reaching execution / subagents.** Implementation and test-writing happen inside execution — in the `subagent-driven-development` path (auto mode), in isolated subagents that do NOT read this file. The ONLY carrier into them is the Superpowers **plan**: `x-ng-sp-plan-enricher` writes our rules into the plan's Global Constraints. Anything that must reach implementers goes through that hook. (In interactive mode execution runs in-session via `executing-plans`, so the agent reads this file directly — but the rules still go into the plan, so the two modes stay identical on content and the plan survives a compaction.)

### Workspace preferences (declared to Superpowers)

Standing preferences the Superpowers skills read from this file. This is the sanctioned override channel (user instructions > skills), which is how we get them **without** editing Superpowers' own files.

1. **Isolation — work in place, no worktree.** `using-git-worktrees` honours a declared preference without asking: in this workspace do **not** create a worktree — create the feature branch in the existing checkout (the repo directory you are already in) and work there. A branch already keeps the trunk safe; a worktree would additionally cost a full dependency install and a cold Nx cache every cycle, and `subagent-driven-development` gains nothing from one — it dispatches implementer subagents **one at a time** (running them in parallel is on that skill's "Never" list), so its isolation is of _context_, not of the filesystem.

   > **Note! — why we chose this.** A worktree exists to keep your trunk safe while an agent works, and a feature branch already does that. So here a worktree would only add cost, for two reasons that hold no matter which agent or tool creates it:
   >
   > **(a) A worktree is a fresh checkout — no `node_modules`, no Nx cache.** Every cycle would open with a full `pnpm install` and a cold cache before the first line of code, and pay it again on the next cycle.
   >
   > **(b) A fresh checkout has none of our git-ignored local files.** `AGENTS.local.md` (when present — mandatory to read per _Developer Workflows_ above) and `.claude/settings.local.json` would simply not be there, and `.superpowers/` — the cycle's spec, plan and SDD ledger — would be deleted along with the worktree when finishing cleans it up.
   >
   > A worktree's one real benefit is running two feature cycles at the same time, or letting an agent build while you keep using your own checkout — **not** parallel implementers, which `subagent-driven-development` forbids regardless ("Never dispatch multiple implementation subagents in parallel"). If we ever want that: drop the "do not create a worktree" instruction above and `using-git-worktrees` returns to its own default (it asks for consent and creates one), then give the ignored files above a home outside the worktree. Nothing else in this file moves — the hook tables, their order, and both execution modes stay exactly as they are.

2. **Spec & plan location — ignored, never committed.** `brainstorming` writes its spec to `.superpowers/specs/` and `writing-plans` writes its plan to `.superpowers/plans/` (both skills state that user preferences override their `docs/superpowers/…` defaults). `/.superpowers/` is git-ignored, so these stay local to the cycle and can never reach a branch — while remaining on disk for the whole cycle, so an interrupted run can still be resumed.
3. **Do not commit the spec or plan.** `brainstorming`'s checklist ends with "commit the design document" — in this workspace that step is intentionally skipped, because the file sits at an ignored path. If `git add` reports the path is ignored, do **not** re-run it with `-f`. Our durable, committed equivalents are the PRD and TFS under `docs/x/{name}/`.

### Hook table A — Build a feature, or change an existing feature's behavior

| Lifecycle hook                                                                               | Ordered workspace steps                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Before `brainstorming`                                                                       | If this functionality already has docs in `docs/x/{name}/` (`PRD.md` and/or the `TFS/` folder), read them first — they shape the design questions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Before `writing-plans`                                                                       | 1) Write/refresh the PRD & TFS (`x-ng-prd-writer`, then `x-ng-tfs-writer`). If `x-ng-tfs-writer` flags a product-observable gap (a `(new — suggest a PRD AC)` entry), ask the user; if approved, re-run `x-ng-prd-writer` to add the AC, then re-run `x-ng-tfs-writer` to back-link it. 2) **Decide e2e now** — it applies only if the functionality has a `page` lib, or a `feature` that initializes another `feature`, **and** the PRD ACs describe user-observable cases; state the verdict and a one-line why. Deciding it here (not later) is what lets `writing-plans` author a **fully-specified** e2e task — Superpowers has no e2e concept, and a task minted after planning cannot carry the test code and exact paths a plan task requires. 3) Load the reference guidelines — `x-ng-lib-build-helper` and `x-ng-test-unit-helper` always, and `x-ng-test-e2e-helper` **only if step 2 said e2e applies** (it is the sole e2e-specific helper; the other two are needed for execution regardless) — so all of it is in context and `writing-plans` drafts the plan from it. |
| After `writing-plans`, before execution                                                      | 1) **Ask the user the execution mode** for this cycle — **auto (recommended)** or interactive (see the Execution modes note below); 2) `x-ng-sp-plan-enricher` — fold the chosen mode, the PRD/TFS IDs and rules (plus the commit-message pointer and CODEOWNERS pointer when paths are created or a handoff is explicitly stated, since subagents don't read this file) into the plan's Global Constraints (so they reach execution), carry in the e2e verdict decided before planning, and tag its test tasks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `using-git-worktrees` (branch created at execution start)                                    | — (no step needed: per _Workspace preferences_ above the agent works **in place** and just creates the branch, naming it per `naming-conventions.md#git`). The branch is created in **both** modes; interactive mode simply never commits to it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Execution — `subagent-driven-development` / `executing-plans`                                | — (the mode picks the skill: auto → `subagent-driven-development`, interactive → `executing-plans`; our rules reach both via the plan — see rule 4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `test-driven-development` (during execution)                                                 | — (our rules reach here via the plan — see rule 4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `requesting-code-review`                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Before `finishing-a-development-branch` (only if implementation introduced new FR/BR/AC IDs) | Update the docs (`x-ng-prd-writer`, then `x-ng-tfs-writer`), then re-tag the affected unit and (if applicable) e2e test titles with the newly minted IDs — **rename only**: the coverage already exists (an execution subagent may not invent an ID; it flags a gap instead). In **auto** mode the tree has already been reviewed, so route the re-tag through a fix dispatch + scoped re-review like any other post-review change — never edit it from the controller session. Follow `x-ng-test-unit-helper` and `x-ng-test-e2e-helper` — in context from the Before `writing-plans` step; re-read if gone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

> **Note! — Why the late doc-update row is not anchored to `verification-before-completion`.** That skill is a **guard**, not a routed step: it self-triggers whenever the agent is about to claim work is complete, so it has no fixed position in a workflow to hang a hook on. The only skill that _invokes_ it by name is `systematic-debugging` — which is why table **B** can anchor to it and table A cannot. Table A's build path runs execution → (auto only) final whole-branch review → finishing, so a late doc/ID update belongs at the end of that chain, anchored to a point **both** execution modes reach: `executing-plans` names `finishing-a-development-branch` a required sub-skill, and `subagent-driven-development` hands off to it after the final review.

> **Note!** `x-ng-sp-plan-enricher` is the one skill here built **specifically for Superpowers** — it edits the Superpowers plan, so (unlike the other `x-*` skills, which are general and usable on their own) it only makes sense inside this workflow. It is also why the `test-driven-development` and execution rows above show `—`: our unit- and e2e-test rules reach those steps **through the enriched plan**, not through a direct hook — so those placeholders do not mean "nothing happens here."

> **Note! — Execution modes (auto vs interactive).** Ask the user which mode this cycle uses **after `writing-plans`, before the enricher runs** — the enricher must record the answer in the plan's Global Constraints, so asking afterwards would leave the plan without it. **Auto is the recommended default.** Ask once per cycle, not per task.
>
> - **Auto (recommended)** — execution runs **`subagent-driven-development`** exactly as Superpowers defines it: an implementer subagent per task, a commit per task, task reviews + final whole-branch review, then finishing.
> - **Interactive** — execution runs **`executing-plans`** (in-session, no implementer subagents). The branch is still created, but the agent does **not** commit, push, merge, or open a PR. After each task it stops, summarizes what changed and how to verify it, and waits for the user; the user verifies and decides when to commit. This overrides `subagent-driven-development`'s "continuous execution" rule — which is why the mode switches skills instead of pausing that one.
>
> **Why interactive switches skills rather than muting git in the subagent path:** `subagent-driven-development`'s quality gates are built on commit ranges — the task reviewer reads a package produced by `review-package BASE HEAD`, and the progress ledger records commit SHAs as its post-compaction recovery map. Suppressing commits there would hand every reviewer an empty diff while still reporting "reviewed". `executing-plans` has no commit contract at all, so it is the honest home for a no-commit flow.

> **Note! — What the mode question changes about Superpowers' normal workflow.** Very little, and nothing about _how_ code gets written. Vanilla `writing-plans` already ends by offering the user two execution paths — "Subagent-Driven (recommended)" or "Inline Execution" (`executing-plans`) — and only falls back to inline on its own when the harness has no subagents. So the choice itself is Superpowers'; we are not bolting on a foreign concept.
>
> What we change is exactly three things:
>
> 1. **We always ask, and ask earlier.** Vanilla asks at the end of `writing-plans`; we ask right after it, before the enricher, so the answer can be written into the plan. We never let it be decided silently by harness capability.
> 2. **We keep Superpowers' recommended default** as auto / subagent-driven (and still always ask rather than letting harness capability decide silently).
> 3. **Interactive adds a no-commit contract** on top of `executing-plans` — branch yes; commit/push/merge/PR no; stop and summarize after each task. `executing-plans` itself is otherwise untouched.
>
> Everything else runs as Superpowers defines it. TDD, the plan's task order and steps, `systematic-debugging` if something breaks mid-task, and `verification-before-completion` are identical in both modes. **The known trade-off:** the per-task reviewer and the final whole-branch review belong to `subagent-driven-development`, so interactive mode does not get them — the user is the reviewer at each stop. That trade-off is Superpowers' own, inherent to its inline path; it is not something our customization introduced.

### Hook table B — Fix a bug, or change an existing feature via the debugging path

| Lifecycle hook                                                      | Ordered workspace steps                                                                                                                              |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `systematic-debugging`                                              | —                                                                                                                                                    |
| `test-driven-development`                                           | —                                                                                                                                                    |
| Before `verification-before-completion`                             | 1) `x-ng-prd-writer` (update, add new IDs) → 2) `x-ng-tfs-writer` (update) → 3) `x-ng-test-unit-helper` → 4) `x-ng-test-e2e-helper` (if applicable). |
| Before `finishing-a-development-branch` (if the fix is branch work) | —                                                                                                                                                    |

> **Note! — Table B needs no plan step; here is when to revisit that.** Whenever Superpowers updates, ask yourself one question: **"Does the bug-fix path still run in the current session, without subagents?"**
>
> - **Yes** (the case today) → nothing to do. The same agent that reads this file writes the fix and its tests, so it just follows table B directly.
> - **No** (a future version runs the bug-fix path inside subagents) → subagents can't read this file, so table B's rules must then travel via a plan, exactly as rule 4 handles table A.

> **Note! — Table B has no execution mode, and commits nothing on its own.** The mode question belongs to table A only. Superpowers' bug-fix path (`systematic-debugging` → `test-driven-development` → `verification-before-completion`) prescribes no git workflow at all: it does not create a branch, and it does not commit or push. It finds the root cause, fixes it, and proves the fix.
>
> So in table B: **do not commit, push, merge, or open a PR unless the user asks.** Make the fix and its tests, report what changed and how it was verified, and leave the git decision to the user. If the user _has_ put the fix on its own branch and asks to wrap it up, that is when `finishing-a-development-branch` applies.
>
> This rule is scoped to table B on purpose — it must **not** be read as a workspace-wide "never commit". Table A's **auto** mode commits once per task by design, because `subagent-driven-development`'s review gates are built on those commits. Two paths, two git contracts: table A auto commits, table A interactive and all of table B do not.

### Hook table C — Other Superpowers scenarios

These Superpowers skills aren't part of the build (A) or bug-fix (B) workflows — each is its own scenario.

| Lifecycle hook                                                    | Ordered workspace steps                                                                                                                                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Before `writing-skills` (authoring or editing a workspace skill)  | `x-skill-build-helper` — our skill conventions and per-kind templates. `writing-skills`' Iron Law covers **edits**, not just new skills: run the RED baseline before changing one. |
| `receiving-code-review` (you give feedback on the agent's work)   | —                                                                                                                                                                                  |
| `dispatching-parallel-agents` (several independent tasks at once) | —                                                                                                                                                                                  |

> **Note!** Rows with `—` are placeholders — that Superpowers skill runs in its table's workflow but has no workspace step yet; to add one later, just fill the cell (no restructuring needed).

> **Note! — Git branch/commit naming isn't a step in any table, on purpose.** The agent already gets the rule straight from this file: the _Project-Specific Conventions_ section (near the top of `AGENTS.md`) has a bullet saying branch and commit names follow `/docs/guidelines/naming-conventions.md#git`, and `AGENTS.md` is re-read on every request — so whenever the agent creates a branch or writes a commit **itself**, that rule is already in front of it. The one exception: during a feature build (table A), the coding and committing are done by separate helper agents (subagents) that do **not** read `AGENTS.md` — so for them, `x-ng-sp-plan-enricher` copies the same rule into the plan they _do_ read. That's why no table needs a git-naming row.

### Workspace skills used in the hooks above

These are the workspace skills the hooks reference. Two are **writers** (they produce docs), four are **helpers** (their examples/guidelines just enter the agent's context — someone else does the actual building, test-writing or authoring), and one is an **enricher**. See each skill's `SKILL.md` for details.

| Skill                   | Kind     | What it does                                                                                                                                 |
| ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-ng-prd-writer`       | writer   | Writes/updates `docs/x/{name}/PRD.md` (ACs) from the brainstorm conclusions.                                                                 |
| `x-ng-tfs-writer`       | writer   | Writes/updates the `docs/x/{name}/TFS/` folder — `README.md` (Overview/deps/ID Index) + one `{libtype}.md` per lib (FRs/BRs) — from the PRD. |
| `x-ng-lib-build-helper` | helper   | Supplies canonical lib-structure examples + guidelines — context only; does not build libs.                                                  |
| `x-ng-test-unit-helper` | helper   | Supplies the unit-test rule (`describe`↔FR, `it`↔BR, from the TFS) — context only; does not write tests.                                   |
| `x-ng-test-e2e-helper`  | helper   | Supplies the e2e rule (`describe`↔US from the app's `user-stories.md`, `it`↔AC from the PRD) — context only; does not write tests.         |
| `x-ng-sp-plan-enricher` | enricher | Folds the PRD/TFS IDs + rules (incl. CODEOWNERS when relevant) into the Superpowers plan's Global Constraints and tags its test tasks.       |
| `x-skill-build-helper`  | helper   | Supplies the conventions and per-kind templates for building or updating a workspace skill — context only; does not author skills.           |

### Locations & rollout

- Functionality docs live in `docs/x/{name}/` — `PRD.md` (single doc) and a `TFS/` folder (`README.md` + one `{libtype}.md` per lib type). Each e2e app owns `apps/{app}-e2e/user-stories.md`, with US IDs unique per app.
- These skills are being introduced incrementally. **If a referenced skill does not yet exist, skip its step** — the Superpowers workflow continues unaffected; only our extension for that step is skipped. (A later step whose required input was skipped will stop and ask per its own prerequisite guard, rather than produce wrong output.)

## MCP Usage Priority

**Use MCPs in this order based on your query:**

1. **`nx-mcp`**: Authoritative source of truth for this Nx workspace. Use for project graph, apps/libs structure, generators, executors, tasks, and monorepo conventions. Always consult first for workspace-related questions.
2. **`angular-cli`**: Angular framework expertise. Use for Angular APIs, Angular CLI behavior, Angular best practices, and Angular-specific implementation details. Do not use for Nx workspace structure.
3. **`figma-mcp`**: Authoritative design source. Use only for Figma files, components, layout, spacing, colors, typography, and design tokens. Required for design-to-code tasks. Do not use for business logic or architecture decisions.
4. **`context7`**: External documentation and examples. Use only when information is not available in the workspace or when up-to-date framework/library documentation is required.

### Rules

- ✅ Follow the priority order - start with `nx-mcp` for workspace queries
- ✅ Use the most specific MCP for the task (Angular questions → `angular-cli`)
- ❌ Don't skip to `context7` without trying workspace-specific MCPs first
