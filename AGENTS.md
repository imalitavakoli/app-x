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

&nbsp;

# Developer Workflows

**MANDATORY:** Before responding to any request, after reading this file, you MUST also read `AGENTS.local.md` (if it exists, it overrides this file).

- **Always use Nx CLI** (`nx run`, `nx build`, `nx test`, etc.) for builds, tests, linting, and generation.
- Use `pnpm` as the package manager.
- Before editing codes, **remember that this workspace follows the [Superpowers-First Workflow](#superpowers-first-workflow)**.
- For project graph or dependency issues, use Nx MCP tools (`nx_workspace`, `nx_project_details`).

&nbsp;

## 🦸 Superpowers-First Workflow

This workspace is governed by the **Superpowers** plugin. Route every request through `superpowers:using-superpowers` as usual; its process skills (`brainstorming`, `writing-plans`, `systematic-debugging`, `test-driven-development`, etc.) own the workflow. Our own skills in `.agents/skills/` are **extensions**, invoked at the Superpowers lifecycle hooks in the paths below — they add to, never replace, Superpowers' own steps. The `nx-*` skills and any other workspace skills still apply directly for their own triggers. This layering is authorized by the precedence rule (user instructions > skills > default).

- Discover skills under the **repo-root** `.agents/skills/` only.
- **Never modify Superpowers' own files** — they update independently. All of our customization lives in this file and in our `.agents/skills/x-*` skills.
- **Why it is shaped this way:** `/docs/guidelines/superpowers-workflow.md` — rationale only, no rules. Every rule you must follow is in this file; read that one when you need the reasoning behind a decision or want to know what to revisit if Superpowers changes.

&nbsp;

### Operating rules

1. **Control flow lives here, not in skills.** This section decides which skill runs when and in what order. Our `x-*` skills are **atomic**: each does one job with its own inputs/outputs and must NOT call or name another skill — the one exception is the `x-{tech}-sp-*` family (e.g. `x-ng-sp-plan-enricher`), which by definition operates on a Superpowers artifact; see the `x-skill-build-helper` skill. A skill may declare a _prerequisite_ ("input: the PRD; if missing, stop and ask") — that guards its own contract; it is not orchestration.
2. **The hook says WHEN and WHICH; the skill says HOW.** Keep hook steps terse here; the full procedure lives inside the named skill.
3. **Track progress with todos.** When you enter a path below, add one todo per step (prefix each `[x]`), **merge** them into the existing todo list (never replace it), and check them off as you go — this is how you remember the next step after a skill finishes.
4. **Reaching execution / subagents.** Implementation and test-writing happen inside execution — in the `subagent-driven-development` path (auto mode), in isolated subagents that do NOT read this file. The ONLY carrier into them is the Superpowers **plan**. Path A asks execution mode **before** `writing-plans`, and `writing-plans` writes that mode into the plan's Global Constraints. When functionality docs are in scope, `x-ng-sp-plan-enricher` folds PRD/TFS and test/lib conventions into the same plan. Anything implementers must obey has to be in the plan before Execution starts. (In interactive mode execution runs in-session via `executing-plans`, so the agent reads this file directly — but the rules still go into the plan, so the two modes stay identical on content and the plan survives a compaction.)

&nbsp;

### Workspace preferences (declared to Superpowers)

Standing preferences the Superpowers skills read from this file. This is the sanctioned override channel (user instructions > skills), which is how we get them **without** editing Superpowers' own files.

1. **Isolation — work in place, no worktree.** `using-git-worktrees` honours a declared preference without asking: in this workspace do **not** create a worktree — create the feature branch in the existing checkout (the repo directory you are already in) and work there.
2. **Spec & plan location — ignored, never committed.** `brainstorming` writes its spec to `.superpowers/specs/` and `writing-plans` writes its plan to `.superpowers/plans/` (both skills state that user preferences override their `docs/superpowers/…` defaults). `/.superpowers/` is git-ignored, so these stay local to the cycle and can never reach a branch — while remaining on disk for the whole cycle, so an interrupted run can still be resumed.
3. **Do not commit the spec or plan.** `brainstorming`'s checklist says to commit the design document — in this workspace that step is intentionally skipped, because the file sits at an ignored path. If `git add` reports the path is ignored, do **not** re-run it with `-f`. Our durable, committed equivalents are the PRD and TFS under `docs/x/{name}/`.

&nbsp;

### Git contract

Who commits and when — the whole answer, for every path:

| Path                     | Feature branch                    | Commits during execution                          | Who decides git        |
| ------------------------ | --------------------------------- | ------------------------------------------------- | ---------------------- |
| Path A — **auto**        | yes                               | one per task — the review gates read those ranges | the skill              |
| Path A — **interactive** | yes                               | none: no commit, push, merge, or PR               | the user, at each stop |
| Path B — bug fix         | only if the user already made one | none, unless the user asks                        | the user               |

Branch and commit names follow `/docs/guidelines/naming-conventions.md#git`. No hook carries this rule: the agent reads it from this file, and `x-ng-sp-plan-enricher` copies it into the plan for the execution subagents (Operating rule 4).

&nbsp;

### How the paths are organised

Each path below is a Superpowers workflow. Hierarchy, used consistently throughout this file:

**Spine:** 🛣️ Path → 🪝 hook → (step bands → steps)  
**On a path (not inside a hook):** 🚪 entry · 🚧 gate · 📌 constraint · ⚪ hooks with no step yet  
**Under a hook (not step bands):** 🎛️ mode block · ▶️ resume block

Landmark catalog — one entry per type (**Meaning** → **Shape** → **Example**). Definitions stay path-agnostic; **Example** may cite a concrete path. Add, remove, or edit landmarks by changing only the matching entry (and the spine lines above if placement changes). Future editors (human or agent): put a new landmark under the correct hierarchy group (**Spine** / **On a path (not inside a hook)** / **Under a hook (not step bands)** / **Outside the spine**), in semantic order within that group (follow the spine lines), and give it a reserved icon only if it is a true landmark — never reuse an existing reserved icon.

**Spine — 🛣️ Path → 🪝 hook → (step bands → steps)**

- **🛣️ path** — a Superpowers workflow (A / B / C) with our hooks attached.
  - **Meaning:** Top-level workflow container. Holds path-level landmarks and `####` hooks.
  - **Shape:** `### 🛣️ Path {letter} — {title}`
  - **Example:** `### 🛣️ Path A — Build a feature, or change an existing feature's behavior`

- **🪝 hook** — a point in the Superpowers lifecycle where we attach work. **One hook per Superpowers before/after attach-point** (e.g. one _Before `writing-plans`_, not two). Kind tags (`[gated]` / `[close-out]`) are kinds of hook — not separate landmarks.
  - **Meaning:** `[gated]` — a 🚧 gate may skip or apply the whole hook. `[close-out]` — the hook runs whenever the path reaches that lifecycle point; gates must **not** skip it (it may still contain a skippable `[gated]` step band). Omit the kind when the path has no gates and no close-out. Optional but recommended on a `[gated]` hook when a 🚧 gate on that path can skip it.
  - **Shape:** `#### 🪝 {ID} · {when}` — optionally `[gated]` or `[close-out]`, then optionally `— {condition}` — then step bands / steps. A second paragraph is fine for a caveat that applies to the whole hook; past that, the detail belongs in the named skill or the rationale doc. Close with any `> Override:` / `> Note:` block. Only a hook gets a `####` heading and an `{ID}`.
  - **Example:** `#### 🪝 A2 · Before writing-plans [close-out]`

- **step band** — a labeled group of **steps** inside a hook (especially a `[close-out]` hook), so readers see what a gate may skip. No landmark icon.
  - **Meaning:** `**[gated]**` — a gate may skip this band only (not the whole close-out hook). `**Always:**` — runs every time the hook runs; not gate-skippable.
  - **Shape:** inside the hook — `**[gated]** — {when}:` or `**Always:**` — then the numbered steps for that band.
  - **Example:** `**[gated]** — only when docs in scope …` / `**Always:**` (Path A A2)

- **step** — one piece of work inside a step band (or directly under a simple `[gated]` hook). No landmark icon.
  - **Meaning:** Each step becomes one todo (Operating rule 3).
  - **Shape:** numbered list item under its step band (or directly under the hook when there is no band).
  - **Example:** `1. **Write/refresh the PRD & TFS** — …` (Path A A2 gated band)

**On a path (not inside a hook)**

- **🚪 entry** — join/handoff contract for the path.
  - **Meaning:** Apply when the user is joining or rejoining this path using **existing path state** — e.g. they provide a plan path (or equivalent pointer), or ask to continue/execute work that already has the Global Constraints lines (or other payload) this Entry declares. **Do not** apply when starting the path from the beginning with no such state — follow the path from its first Superpowers skill. May declare the verbatim Global Constraints lines it reads (hooks write those lines; do **not** promote that payload to its own landmark). May route into a ▶️ resume block. Distinct from ▶️ resume (join/rejoin the path vs continue after a hard stop). Not a hook.
  - **Shape:** `🚪 **Entry — {when}.**` — optional nested payload (the GC lines this Entry reads), then numbered rules. No `####`, no `{ID}`.
  - **Example:** Path A `🚪 **Entry — user provides a plan path.**` (with nested Plan phase lines)

- **🚧 gate** — condition that decides whether gated hooks / `[gated]` step bands / gated steps apply.
  - **Meaning:** Lists only what it skips or applies among **gated** hooks/steps — never a close-out hook. Not a guard and not a hook. Promote only conditions that skip/apply **more than one** gated hook/step or a whole `[gated]` step band; a single-hook `— {condition}` stays in the hook heading.
  - **Shape:** `> 🚧 **{Name} gate.** {condition and effect}` — blockquote on the path (or under a hook only when it narrows that hook's band). No `####`, no `{ID}`.
  - **Example:** Path A `> 🚧 **Functionality gate.** …`

- **📌 constraint** — path-level rule that spans more than one lifecycle point without skipping/applying a hook band.
  - **Meaning:** Not a gate (does not skip hooks) and not a single-hook `> Note:`. Use when the rule spans docs / plan / enricher (or similar).
  - **Shape:** `📌 **{Short name}.** {condition and effect}` — bold lead on the path (not a blockquote — so it does not look like a gate). No `####`, no `{ID}`. Do not put it in a hook's `> Note:`.
  - **Example:** Path A `📌 **Companion util/api/app.** …`

- **⚪ hooks with no step yet** — Superpowers lifecycle points on the path that still have no workspace steps.
  - **Meaning:** Still part of the workflow; listed on one bold line per path (not a `####` subsection). Give a hook its own `#### 🪝` subsection the moment it gains a step. For execution and `test-driven-development`, our rules arrive through the enriched plan (Operating rule 4).
  - **Shape:** `⚪ **Hooks with no workspace step yet** — {skill} · {skill} · …`
  - **Example:** Path A `⚪ **Hooks with no workspace step yet** — using-git-worktrees · …`

**Under a hook (not step bands)**

- **🎛️ mode block** — execution-mode contract for the cycle.
  - **Meaning:** Defines auto/interactive and the Plan lines for Global Constraints. Not a step band and not a `####` heading — do not turn it into todos.
  - **Shape:** under the hook that asks for mode — `🎛️ **Execution mode — …**` then the mode table (behaviour + Plan line verbatim) and any short follow-on prose.
  - **Example:** Path A A2 `🎛️ **Execution mode — auto or interactive.** …`

- **▶️ resume block** — post-hard-stop contract: what to do after the user proceeds.
  - **Meaning:** Not a step band. Any hook that hard-stops and waits may add one. Distinct from 🚪 entry (continue after a hard stop vs join the path).
  - **Shape:** blockquote under the hook (after the Always band's hard-stop): `> ▶️ **Resume** (after the user proceeds). …`
  - **Example:** Path A A3 `> ▶️ **Resume** (after the user proceeds). …`

**Outside the spine (no landmark icon)**

- **guard** — a Superpowers skill that self-triggers on the agent's own behaviour instead of being routed to.
  - **Meaning:** No fixed position in a path; no landmark icon. Do not invent a 🪝 hook just to host a guard.
  - **Shape:** named in prose where relevant (e.g. on a path's ⚪ line or in a short note). No reserved icon.
  - **Example:** `verification-before-completion` (fires on any "it's done" claim); `receiving-code-review` (fires when you give feedback).

**Cross-cutting**

- **Only a hook gets a `####` heading, and only a hook gets an `{ID}`.** Anything else inside a path uses its landmark shape above, so the outline stays a clean list of hooks.
- **Icons are landmarks, and these eight are reserved:** 🛣️ path · 🪝 hook · 🚪 entry · ⚪ hooks with no step yet · 🎛️ mode · ▶️ resume · 🚧 gate · 📌 constraint. Never use those eight for anything else; any other section may take its own distinct icon.
- **Where new content goes:** a rule an agent must follow → this file; the reasoning behind it → `/docs/guidelines/superpowers-workflow.md`; how to perform a step → inside the named skill. Keep each fact in exactly one of the three.

&nbsp;

### 🛣️ Path A — Build a feature, or change an existing feature's behavior

**Typical flow** — bold = our steps, the rest is Superpowers' own; each hook's own condition is what actually governs: `brainstorming` → **PRD + TFS + spec sync + e2e verdict** _(A2 gated steps)_ → **mode + `writing-plans`** _(A2 always)_ → **(enricher |) plan-review stop** _(A3)_ → _(user proceeds)_ → branch → execution (`test-driven-development`) → `requesting-code-review` _(auto only)_ → **doc/ID re-tag** _(gated, only if new IDs)_ → `finishing-a-development-branch`

Path A has two parts: **Documentation** (through the plan-review stop) and **Execution** (after the user proceeds — same session or another session with the plan path).

🚪 **Entry — user provides a plan path.** (continue / execute / “use this plan” in this or another session).

**Plan phase (Global Constraints)** — payload this Entry reads (not a landmark). Hooks write exactly one of these lines (same key, distinguishable values); replace the draft line with the ready line at hard stop — do not keep both:

| When written                                               | Verbatim line                          |
| ---------------------------------------------------------- | -------------------------------------- |
| After `writing-plans` creates/updates the plan (A2 Always) | `Path A phase: Documentation (draft).` |
| At A3 hard stop (after enricher-or-skip, before wait)      | `Path A phase: ready for Execution.`   |

Read `Path A phase` from the plan's Global Constraints, then:

1. **`Path A phase: ready for Execution.`** → enter ▶️ **Resume** (skip Documentation). Do not re-run A2/A3 close-out unless the user asks to revise the plan.
2. **`Path A phase: Documentation (draft).`** or **phase missing** → **ask**: is this plan ready to execute, or still a draft?
   - **Ready** → set/confirm `Path A phase: ready for Execution.` if needed, then ▶️ Resume.
   - **Draft** → stay in **Documentation** (continue from the appropriate A2/A3 point; do not start Execution).
3. User may override (“execute anyway” / “keep drafting”).

> 🚧 **Functionality gate.** A1, A2's gated steps, A3's enricher step, and A4 apply only when the work is (or produces) a **functionality** — libs from `map` / `data-access` / `ui` / `feature` / `page`. `util`, `api`, and `app` **never** form a functionality (see `/docs/getting-started/library-types-and-their-relationship.md` → Functionality types): they get **no** `docs/x/{name}/` PRD or TFS (and therefore no PRD ACs). If the cycle is only creating or updating one of those, **skip** A1, A2's gated steps, A3's enricher step, and A4 — no PRD/TFS writers, no e2e verdict, no enricher. Still run Superpowers' `brainstorming` and Path A close-out (A2 always: mode → `writing-plans` with mode in the plan → A3 hard stop), and `test-driven-development` when tests are in scope. For lib shape, load `x-ng-lib-build-helper` (its fallback covers `util` / `api`). When unit tests are in scope for **`util`** or product **`app`**, load `x-ng-test-unit-helper` and follow its `references/libs/util.md` / `app.md`: FR/BR IDs come from a local `requirements.md` (`UTIL-…` / `APP-…`), not from TFS. **`api`** has no `requirements.md` (proxy-only).

> 🚧 **Missing-docs gate.** When the Functionality gate applies and the work updates an existing `map` / `data-access` / `ui` / `feature` / `page` lib with no `docs/x/{name}/` for its functionality name: ask whether to **document now** (first-time PRD/TFS; continue A1, A2's gated steps, enricher, and A4 as applicable) or **skip** A1, A2's gated steps, A3's enricher step, and A4 for this cycle (no writers, e2e verdict, or enricher; no our FR/BR/AC ID conventions). New functionalities (libs not yet in the workspace) always document — do not offer skip. Run this ask before A2 (typically with A1).

📌 **PRD/TFS over cycle spec.** When A2's gated steps ran this cycle (functionality docs in scope), for `writing-plans` (and A3's enricher coverage check): (1) read `docs/x/{name}/` **PRD and TFS as the primary source of truth**; (2) on any **conflict** with the Superpowers brainstorm spec under `.superpowers/specs/`, **PRD/TFS win** (user decisions during the writers win); (3) for anything the plan still needs that PRD/TFS **do not cover** (e.g. companion util/api/app tasks, plan-level narrative), use the **synced** brainstorm spec; (4) do **not invent** requirements that appear in neither — ask. A2 syncs the spec so Superpowers' native "plan from the spec" path stays aligned with (1)–(2). When those gated steps were skipped, the brainstorm spec alone remains the plan's requirements source (vanilla Superpowers); A2's always band still asks mode and `writing-plans` still records it, then A3 hard-stops.

📌 **Companion util/api/app.** When brainstorm concludes a `util`, `api`, and/or `app` must be created or updated **in the same cycle** as a functionality: A1, A2's gated steps, A3's enricher step, and A4 still follow the Functionality / Missing-docs gates for that functionality only. The companion lib is **never** owned by the functionality and **never** gets `docs/x/` PRD or TFS. When A2's gated steps run, list it under TFS **Existing Dependencies & Reuse** as `[RECOMMENDED]` if it is not built yet (and in the PRD **Dependencies & Risks** when product-relevant). `writing-plans` **must** include create/update tasks for that companion lib **before** tasks that depend on it; when unit tests are in scope, **`util`** / product **`app`** use local `requirements.md` (`UTIL-…` / `APP-…`), and **`api`** has none. A3's enricher (when it runs) still folds only the functionality's PRD/TFS — it does not invent or coverage-check companion-lib tasks (those must already be fully specified in the plan).

#### 🪝 A1 · Before `brainstorming` [gated]

Only when gated Documentation hooks apply this cycle (see Functionality / Missing-docs gates):

1. **Always** read `docs/getting-started/library-types-and-their-relationship.md` (functionality / lib types, natural entry, what util/api/app never own) and `docs/guidelines/naming-conventions.md` (especially lib and functionality naming) — they shape the design questions even when no PRD/TFS exists yet.
2. If this functionality already has docs in `docs/x/{name}/` (`PRD.md` and/or the `TFS/` folder), read them too.

#### 🪝 A2 · Before `writing-plans` [close-out]

Always runs on Path A before invoking `writing-plans`. One hook at this attach-point (do not split into a second before-`writing-plans` hook).

**[gated]** — only when docs in scope (see Functionality / Missing-docs gates); skip this band when those gates say so:

1. **Write/refresh the PRD & TFS** — `x-ng-prd-writer`, then `x-ng-tfs-writer`. If `x-ng-tfs-writer` flags a product-observable gap (a `(new — suggest a PRD AC)` entry), ask the user; if approved, re-run `x-ng-prd-writer` to add the AC, then re-run `x-ng-tfs-writer` to back-link it.
2. **Sync the Superpowers spec** — update this cycle's brainstorm spec under `.superpowers/specs/` so it matches the approved PRD/TFS on overlapping decisions (step 1 wins on conflicts). Fix conflicting sections in the spec body; at minimum put a short note at the top that `docs/x/{name}/` PRD and TFS are primary and win on conflicts, and link those paths. Keep spec-only material that PRD/TFS never cover (gap filler for planning). Do **not** commit the spec (see _Workspace preferences_).
3. **Decide e2e now** — it applies only if the functionality has a `page` lib, or a `feature` that initializes another `feature`, **and** the PRD ACs describe user-observable cases. State the verdict and a one-line why.
4. **Load the reference guidelines** — `x-ng-lib-build-helper` and `x-ng-test-unit-helper` always, and `x-ng-test-e2e-helper` **only if step 3 said e2e applies** — so all of it is in context and `writing-plans` drafts from PRD/TFS first, then the synced spec for gaps (📌 _PRD/TFS over cycle spec_).

> **Override:** the `[gated]` band overrides `brainstorming`'s stated exclusive exit ("the ONLY skill you invoke after brainstorming is `writing-plans`"). Authorized by the precedence rule: that exclusivity guards against _implementation_ skills jumping to code — these write documents only. The Always band below still ends in `writing-plans`.

> **Note:** `writing-plans` natively plans from the Superpowers spec — that is why gated step 2 syncs it. Requirements layering for this cycle: PRD/TFS primary → conflicts favor PRD/TFS → gaps may use the synced spec (📌 _PRD/TFS over cycle spec_).

**Always:**

5. **Ask the user the execution mode** for this cycle — auto (recommended) or interactive; see the 🎛️ block below.
6. **Invoke `writing-plans`** so the plan's `## Global Constraints` includes (merge; do not omit): the **Plan line (verbatim)** for the chosen mode from the 🎛️ block, and `Path A phase: Documentation (draft).` Do **not** let vanilla `writing-plans` re-ask mode at the end as a substitute.

🎛️ **Execution mode — auto or interactive.** The mode decides which Superpowers skill runs execution and whether the agent commits. Ask **once per cycle** (not per task), **before** `writing-plans`, so the plan is born with the answer and handoff works whether or not the enricher runs later. **Auto is the recommended default.**

| Mode                   | Execution skill               | Behaviour                                                                                                                                                                              | Plan line (verbatim)                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auto** (recommended) | `subagent-driven-development` | Exactly as Superpowers defines it: an implementer subagent per task, a commit per task, task reviews + final whole-branch review, then finishing.                                      | `Execution mode: AUTO. Execute with subagent-driven-development as Superpowers defines it (implementer subagent per task, commit per task, task + final reviews).`                                                                                                                                                            |
| **Interactive**        | `executing-plans`             | In-session, no implementer subagents. After each task, stop: summarize the files changed and how to verify them, then wait for the user. No commit/push/merge/PR — see _Git contract_. | `Execution mode: INTERACTIVE. Execute with executing-plans (in-session, no implementer subagents). Work on the feature branch but do NOT commit, push, merge, or open a PR. After each task, stop: summarize the files changed and how to verify them, then wait for the user. The user verifies and decides when to commit.` |

Interactive trades away `subagent-driven-development`'s per-task and final whole-branch reviews — the user is the reviewer at each stop. Everything else (TDD, task order, `systematic-debugging`, `verification-before-completion`) is identical in both modes.

#### 🪝 A3 · After `writing-plans`, before execution [close-out]

Always runs on Path A after `writing-plans` produces a plan. This is the end of **Documentation**; **Execution** starts only on resume.

**[gated]** — only when docs in scope (see Functionality / Missing-docs gates):

1. **Enrich** — run **`x-ng-sp-plan-enricher`**: fold into the plan's Global Constraints the PRD/TFS IDs and rules, the commit-message pointer, and the CODEOWNERS pointer when the plan creates owned paths or explicitly states a handoff; carry in the e2e verdict from A2 and tag the test tasks. If docs were not in scope, skip this step.

**Always:**

2. **Hard stop — plan review gate.** In the plan's Global Constraints, **replace** `Path A phase: Documentation (draft).` with `Path A phase: ready for Execution.` (one phase line only). Do **not** create the feature branch and do **not** start execution. Tell the user the plan is ready at its path; they can review it; if it looks good, either continue execution in this session or give the plan path to another agent in another session. Then **wait**.

> ▶️ **Resume** (after the user proceeds). Not a step band — Execution starts here. For other-session / plan-path entry, also follow 🚪 **Entry** at the top of Path A.
>
> - **Same session** — do not re-ask mode unless the user explicitly changes it. Continue from `using-git-worktrees` (work in place per _Workspace preferences_) → the execution skill for the mode already in the plan.
> - **Other session** — user provides the plan path. Follow Path A's 🚪 **Entry** (phase line → Resume or ask draft vs ready). If mode is missing after they confirm ready, stop and ask, then ensure the plan records it before executing.

#### 🪝 A4 · Before `finishing-a-development-branch` [gated] — only if implementation introduced new FR/BR/AC IDs

Only when gated late hooks apply this cycle (functionality docs in scope — see Functionality / Missing-docs gates) **and** implementation introduced new FR/BR/AC IDs:

Update the docs (`x-ng-prd-writer`, then `x-ng-tfs-writer`), then re-tag the affected unit and (if applicable) e2e test titles with the newly minted IDs — **rename only**: the coverage already exists (an execution subagent may not invent an ID; it flags a gap instead).

In **auto** mode the tree has already been reviewed, so route the re-tag through a fix dispatch + scoped re-review like any other post-review change — never edit it from the controller session. Follow `x-ng-test-unit-helper` and `x-ng-test-e2e-helper` (in context from A2; re-read if gone).

⚪ **Hooks with no workspace step yet** — `using-git-worktrees` (after the user proceeds from A3; work in place per _Workspace preferences_, so just create the branch, in both modes) · execution (`subagent-driven-development` / `executing-plans`, picked by the mode) · `test-driven-development` · `requesting-code-review`

&nbsp;

### 🛣️ Path B — Fix a bug, or change an existing feature via the debugging path

**Typical flow** — each hook's own condition is what actually governs: `systematic-debugging` → `test-driven-development` → `verification-before-completion` → **doc/ID re-tag** _(only if new IDs)_ → `finishing-a-development-branch` _(only if the fix is on its own branch)_

No execution mode here — that question belongs to path A only. For git, see _Git contract_.

> 🚧 **Functionality gate.** B1 applies only when the fix is to a **functionality** (it updates `docs/x/` PRD/TFS). A change that only touches a `util`, `api`, or `app` never has those docs — **skip B1**. Unit tests for **`util`** / product **`app`** still follow TDD / `x-ng-test-unit-helper` when tests are in scope; FR/BR IDs come from local `requirements.md` (retag as part of normal test edits, not via B1's PRD/TFS writers). **`api`** has no `requirements.md`.

#### 🪝 B1 · After `verification-before-completion` [gated] — only if the fix introduced new FR/BR/AC IDs

Update the docs (`x-ng-prd-writer`, then `x-ng-tfs-writer`), then re-tag the affected unit and (if applicable) e2e test titles with the newly minted IDs — **rename only**: the coverage already exists. Follow `x-ng-test-unit-helper` and `x-ng-test-e2e-helper`.

Docs come **after** the fix is proven, never before, so nothing documents behaviour that verification might still reject. The cycle is not done until this step has run — make the final completion report after it, not before.

⚪ **Hooks with no workspace step yet** — `systematic-debugging` · `test-driven-development` · `finishing-a-development-branch` (only if the user put the fix on its own branch and asks to wrap it up)

&nbsp;

### 🛣️ Path C — Other Superpowers scenarios

Scenarios outside the build (A) and bug-fix (B) paths. `writing-skills` and `dispatching-parallel-agents` are standalone; `receiving-code-review` is a **guard** — it self-triggers whenever you give feedback on the agent's work, including in the middle of path A or B.

#### 🪝 C1 · Before `writing-skills` — authoring or editing a workspace skill

`x-skill-build-helper` — our skill conventions and per-kind templates. `writing-skills`' Iron Law covers **edits**, not just new skills: run the RED baseline before changing one.

⚪ **Hooks with no workspace step yet** — `receiving-code-review` (guard — you give feedback on the agent's work) · `dispatching-parallel-agents` (several independent tasks at once)

&nbsp;

### Workspace skills used in the paths above

Two are **writers** (they produce docs), four are **helpers** (their examples/guidelines just enter the agent's context — someone else does the actual building, test-writing or authoring), and one is an **enricher**. The kind is always the name's last segment. See each skill's `SKILL.md` for what it does and how.

| Skill                   | Produces / supplies                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-ng-prd-writer`       | `docs/x/{name}/PRD.md` — the ACs                                                                                                                    |
| `x-ng-tfs-writer`       | `docs/x/{name}/TFS/` — `README.md` (ID Index) + one `{libtype}.md` per lib (FRs/BRs)                                                                |
| `x-ng-lib-build-helper` | canonical lib-structure examples + guidelines                                                                                                       |
| `x-ng-test-unit-helper` | unit-test conventions — functionalities: `describe`↔FR, `it`↔BR from the TFS; `util` / `app`: same from local `requirements.md`; `api`: no ID doc |
| `x-ng-test-e2e-helper`  | the e2e rule — `describe`↔US from the app's `user-stories.md`, `it`↔AC from the PRD                                                               |
| `x-ng-sp-plan-enricher` | the Superpowers plan, enriched — Global Constraints + tagged test tasks                                                                             |
| `x-skill-build-helper`  | the conventions and per-kind templates for building or updating a workspace skill                                                                   |

&nbsp;

### Locations & rollout

- Functionality docs live in `docs/x/{name}/` — `PRD.md` (single doc) and a `TFS/` folder (`README.md` + one `{libtype}.md` per lib type). `util`, `api`, and `app` never get those docs (they are not functionalities). **`util`** may have `requirements.md` beside each inner/version README; product **`app`** may have `apps/{app-name}/requirements.md` — both supply unit-test FR/BR IDs (`UTIL-…` / `APP-…`). **`api`** has no `requirements.md`. Each e2e app owns `apps/{app}-e2e/user-stories.md`, with US IDs unique per app.
- All seven skills above exist. **If a referenced skill is missing, say so and ask** — do not skip its step silently. (A later step whose required input never arrived will stop and ask per its own prerequisite guard, rather than produce wrong output.)

&nbsp;

## MCP Usage Priority

**Use MCPs in this order based on your query:**

1. **`nx-mcp`**: Authoritative source of truth for this Nx workspace. Use for project graph, apps/libs structure, generators, executors, tasks, and monorepo conventions. Always consult first for workspace-related questions.
2. **`angular-cli`**: Angular framework expertise. Use for Angular APIs, Angular CLI behavior, Angular best practices, and Angular-specific implementation details. Do not use for Nx workspace structure.
3. **`figma-mcp`**: Authoritative design source. Use only for Figma files, components, layout, spacing, colors, typography, and design tokens. Required for design-to-code tasks. Do not use for business logic or architecture decisions.
4. **`context7`**: External documentation and examples. Use only when information is not available in the workspace or when up-to-date framework/library documentation is required.

&nbsp;

### Rules

- ✅ Follow the priority order - start with `nx-mcp` for workspace queries
- ✅ Use the most specific MCP for the task (Angular questions → `angular-cli`)
- ❌ Don't skip to `context7` without trying workspace-specific MCPs first
