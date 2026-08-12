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
**On a path (not inside a hook):** set · 🚪 entry · 🚧 gate · 📌 constraint · ⚪ hooks with no step yet  
**Under a hook (not step bands):** 🎛️ mode block · ▶️ resume block

Landmark catalog — one entry per type (**Meaning** → **Shape** → **Example**). Definitions stay path-agnostic; **Example** may cite a concrete path. Add, remove, or edit landmarks by changing only the matching entry (and the spine lines above if placement changes). Future editors (human or agent): put a new landmark under the correct hierarchy group (**Spine** / **On a path (not inside a hook)** / **Under a hook (not step bands)** / **Outside the spine**), in semantic order within that group (follow the spine lines), and give it a reserved icon only if it is a true landmark — never reuse an existing reserved icon.

**Spine — 🛣️ Path → 🪝 hook → (step bands → steps)**

- **🛣️ path** — a Superpowers workflow (A / B / C) with our hooks attached.
  - **Meaning:** Top-level workflow container. Holds path-level landmarks and `####` hooks.
  - **Shape:** `### 🛣️ Path {letter} — {title}`
  - **Example:** `### 🛣️ Path A — Build a feature, or change an existing feature's behavior`

- **🪝 hook** — a point in the Superpowers lifecycle where we attach work. **One hook per Superpowers before/after attach-point** (e.g. one _Before `writing-plans`_, not two). Kind tags (`[gated]` / `[close-out]`) are kinds of hook — not separate landmarks.
  - **Meaning:** `[gated]` — a 🚧 gate's answer may skip the whole hook. `[close-out]` — the hook runs whenever the path reaches that lifecycle point; gates must **not** skip it (it may still contain a skippable `[gated]` step band). Omit the kind when the path has no gates and no close-out. Optional but recommended on a `[gated]` hook when a 🚧 gate on that path can skip it.
  - **Shape:** `#### 🪝 {ID} · {when}` — optionally `[gated]` or `[close-out]`, then optionally `— {condition}` — then step bands / steps. A second paragraph is fine for a caveat that applies to the whole hook; past that, the detail belongs in the named skill or the rationale doc. Close with any `> Override:` / `> Note:` block. Only a hook gets a `####` heading and an `{ID}`.
  - **Example:** `#### 🪝 A2 · Before writing-plans [close-out]`

- **step band** — a labeled group of **steps** inside a hook (especially a `[close-out]` hook), so readers see what a gate may skip. No landmark icon.
  - **Meaning:** `**[gated]**` — a gate may skip this band only (not the whole close-out hook). `**Always:**` — runs every time the hook runs; not gate-skippable.
  - **Shape:** inside the hook — `**[gated]** — {when}:` or `**Always:**` — then the numbered steps for that band.
  - **Example:** `**[gated]** — part of the docs-in-scope set …` / `**Always:**` (Path A A2)

- **step** — one piece of work inside a step band (or directly under a simple `[gated]` hook). No landmark icon.
  - **Meaning:** Each step becomes one todo (Operating rule 3).
  - **Shape:** numbered list item under its step band (or directly under the hook when there is no band).
  - **Example:** `1. **Write/refresh the PRD & TFS** — …` (Path A A2 gated band)

**On a path (not inside a hook)**

- **set** — a named group of gated hooks/steps that the path's gates control together. No landmark icon.
  - **Meaning:** Declared **once per path**, above that path's gates. Gates, gated hooks, and `[gated]` step bands refer to it **by name** instead of re-listing its members, so a hook joining or leaving the set is one edit. It states three things: its **members**, how multiple gates **combine**, and the **complement** (what runs regardless). Not a landmark and not payload of one block — any block on the path may reference it. A path with a single gate and a single gated hook may skip it.
  - **Shape:** `**{Name} set** — **Members:** {hooks/steps, separated by ·}. **Combine:** {how the path's gates combine}. **Regardless:** {what runs whatever they answer}.` — bold lead on the path, above its gates. No `####`, no `{ID}`. `·` separates items **within** a part; the parts themselves are separated by their bold labels.
  - **Example:** Path A `**Docs-in-scope set** — … **A1** · **A2's `[gated]` band** · …`

- **🚪 entry** — join/handoff contract for the path.
  - **Meaning:** Route here when the user is joining or rejoining this path using **existing path state** — e.g. they provide a plan path (or equivalent pointer), or ask to continue/execute work that already has the Global Constraints lines (or other payload) this Entry declares. **Do not** route here when starting the path from the beginning with no such state — follow the path from its first Superpowers skill. May declare the verbatim Global Constraints lines it reads (hooks write those lines; do **not** promote that payload to its own landmark). May route into a ▶️ resume block. Distinct from ▶️ resume (join/rejoin the path vs continue after a hard stop). Not a hook.
  - **Shape:** `🚪 **Entry — {when}.**` — optional nested payload (the GC lines this Entry reads), then numbered rules. No `####`, no `{ID}`.
  - **Example:** Path A `🚪 **Entry — user provides a plan path.**` (with nested Plan phase lines)

- **🚧 gate** — a yes/no question whose answer decides whether the path's gated set runs.
  - **Meaning:** A gate **asks** and **answers**; hooks and bands **run** or are **skipped**. Kind tags: `[auto]` — answered from the work itself (lib type, file presence); `[ask]` — answered by the user. Each gate is answered **on its own terms and never references another gate's answer**; **any gate answering No skips the whole set**. A gate names only **gated** hooks/steps — never a close-out hook. Not a guard and not a hook. Promote only conditions that control the whole set or a whole `[gated]` step band; a single-hook `— {condition}` stays in the hook heading.
  - **Shape:** `> 🚧 **{Name} gate** [auto|ask] — **Asks:** {yes/no question}` then a blockquote list: a `**Yes** →` item, a `**No** →` item, and — for an `[ask]` gate that does not always fire — a `**Not asked when:**` item. Prose detail follows after a blank blockquote line. Blockquote on the path (or under a hook only when it narrows that hook's band). No `####`, no `{ID}`.
  - **Example:** Path A `> 🚧 **Functionality gate** [auto] — **Asks:** …`

- **📌 constraint** — path-level rule that **spans** more than one lifecycle point without skipping any of them.
  - **Meaning:** A constraint **spans** — it adds a rule to steps that already run. Not a gate (never skips a hook or band) and not a single-hook `> Note:`. Use when the rule spans docs / plan / enricher (or similar). Constraints never share a **set** the way gates do, and need none however many are added — each governs different steps in a different way, so `Spans:` is the only index they need.
  - **Shape:** `📌 **{Short name}** — **Spans:** {hooks/steps, separated by ·}. **Leaves alone:** {what it does not change}.` then the rule on the following lines. `·` separates items **within** a part; the parts themselves are separated by their bold labels. Bold lead on the path (not a blockquote — so it does not look like a gate). No `####`, no `{ID}`. Do not put it in a hook's `> Note:`. **`Spans:` names hooks by their `{ID}`** (`A2's [gated] band`, `A3 step 1`, `B1`) — never in prose — so "what governs A3?" is one search of this file, with no index to keep in sync.
  - **Example:** Path A `📌 **Companion work — …** — **Spans:** …`
  - **Past ~4 constraints on one path:** move the `Spans:` lines out of the bodies into a single table above them, so spans still live in exactly one place.

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
- **Reserved verbs — keep them distinct.** Gates **ask** and **answer** (Yes / No); hooks and step bands **run** or are **skipped**; constraints **span**; entries **route**; mode blocks **select**. Never write "the gate applies" — it reads both as _the gate is in force_ and as _the gate let us through_. Say which way it answered.
- **Constraints never collide and never gate.** A constraint adds a rule to steps that already run — it can never skip a hook or band (that is a 🚧 gate's job). If a new constraint would contradict an existing one on the same step, **amend the existing constraint** rather than adding a second: one step's rule lives in one constraint. Constraints are **path-scoped**, so the same name may appear on two paths carrying different rules; the no-collision rule applies within a path.
- **Icons are landmarks, and these eight are reserved:** 🛣️ path · 🪝 hook · 🚪 entry · ⚪ hooks with no step yet · 🎛️ mode · ▶️ resume · 🚧 gate · 📌 constraint. Never use those eight for anything else; any other section may take its own distinct icon.
- **Where new content goes:** a rule an agent must follow → this file; the reasoning behind it → `/docs/guidelines/superpowers-workflow.md`; how to perform a step → inside the named skill. Keep each fact in exactly one of the three.

&nbsp;

### 🛣️ Path A — Build a feature, or change an existing feature's behavior

**Typical flow** — bold = our steps, the rest is Superpowers' own; each hook's own condition is what actually governs: `brainstorming` → **PRD + TFS + spec sync + e2e verdict** _(A2 `[gated]` band)_ → **mode + `writing-plans`** _(A2 Always band)_ → **(enricher |) plan-review stop** _(A3)_ → _(user proceeds)_ → branch → execution (`test-driven-development`) → `requesting-code-review` _(auto only)_ → **verify docs vs. what shipped** _(A4 — always; actions conditional)_ → `finishing-a-development-branch`

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

**Docs-in-scope set** — **Members:** **A1** · **A2's `[gated]` band** · **A3's enricher step** · **A4's `[gated]` band**. **Combine:** each gate below is answered on its own terms, and **any gate answering No skips the whole set** for this cycle. **Regardless:** Superpowers' `brainstorming`, A2's Always band (mode → `writing-plans` with mode in the plan), A3's hard stop, **A4's Always band** (verifying `util` / `app` / grab-bag `requirements.md`), and `test-driven-development` when tests are in scope.

> 🚧 **Functionality gate** [auto] — **Asks:** is the work (or does it produce) a **single-purpose** lib from `map` / `data-access` / `ui` / `feature` / `page`?
>
> - **Yes** → the docs-in-scope set runs.
> - **No** (`util` / `api` / `app`, or a **grab-bag** `ui` / `feature`) → **skip the set**: no PRD/TFS writers, no e2e verdict, no enricher, none of our FR/BR/AC ID conventions.
>
> `util`, `api`, and `app` **never** form a functionality, and neither does a **grab-bag** `ui` / `feature` lib — a bucket of unrelated items sharing only a technical kind, each versioned on its own (`src/lib/toggle-me-v1/`), e.g. `shared-ui-ng-directives`. See `/docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag, which owns the definition and the test. None of them get `docs/x/{name}/` PRD or TFS, and therefore no PRD ACs. Adding an item to a grab-bag never creates a functionality. For lib shape, load `x-ng-lib-build-helper`. When unit tests are in scope, load `x-ng-test-unit-helper` — it owns where those libs' FR/BR IDs come from.

> 🚧 **Missing-docs gate** [ask] — **Asks:** the work updates an **existing** `map` / `data-access` / **single-purpose** `ui` / `feature` / `page` lib that has no `docs/x/{name}/` for its functionality name — document it now?
>
> - **Yes** → the docs-in-scope set runs (first-time PRD/TFS).
> - **No** → **skip the set** for this cycle: no writers, no e2e verdict, no enricher, none of our FR/BR/AC ID conventions.
> - **Not asked when:** the lib already has `docs/x/{name}/`; the functionality is **new** (not yet in the workspace) — creating it is creating the functionality, so it always documents, never offer skip; or the lib is a **grab-bag** — it has no functionality name, so there is nothing to offer to document.
>
> Ask before A2 (typically with A1).

📌 **PRD/TFS over cycle spec** — **Spans:** `writing-plans` · A3 step 1 (the enricher's coverage check). **Leaves alone:** which hooks run — that is the gates' answer, not this rule.

When A2's `[gated]` band ran this cycle, for `writing-plans` (and A3's enricher coverage check): (1) read `docs/x/{name}/` **PRD and TFS as the primary source of truth**; (2) on any **conflict** with the Superpowers brainstorm spec under `.superpowers/specs/`, **PRD/TFS win** (user decisions during the writers win); (3) for anything the plan still needs that PRD/TFS **do not cover** (e.g. companion-lib tasks, plan-level narrative), use the **synced** brainstorm spec; (4) do **not invent** requirements that appear in neither — ask. A2 syncs the spec so Superpowers' native "plan from the spec" path stays aligned with (1)–(2). When that band was skipped, the brainstorm spec alone remains the plan's requirements source (vanilla Superpowers); A2's Always band still asks mode and `writing-plans` still records it, then A3 hard-stops.

📌 **Companion work — `util`/`api`/`app`, or another functionality's libs** — **Spans:** `writing-plans` (task order) · both gates (re-answered for the companion) · A2's `[gated]` band, A3 step 1 and A4's `[gated]` band (once per functionality). **Leaves alone:** the current functionality's own gate answers and its docs.

When brainstorm concludes that a `util`, `api`, `app`, or **grab-bag** `ui` / `feature` lib — or a `map` / `data-access` / **single-purpose** `ui` / `feature` / `page` lib belonging to **another** functionality (not the one this cycle is creating or updating) — must be created or updated in the **same cycle**:

1. **Order.** `writing-plans` must include the create/update tasks for that companion lib **before** any task of the current functionality that depends on it.
2. **Gates re-answer per companion.** The Functionality gate and the Missing-docs gate are answered for the companion work on its own terms: a companion `util` / `api` / `app`, or a **grab-bag** `ui` / `feature`, always answers **No**; another functionality's libs answer by their own lib types and their own `docs/x/{name}/`.
3. **Docs are per functionality.** When the gates answer **Yes** for more than one functionality this cycle, A2's `[gated]` band, A3's enricher step and **A4's `[gated]` band** each run **once per functionality**, against that functionality's own `docs/x/{name}/` — including A4's verification of a companion functionality's docs against what implementation actually did to its libs. (A companion `util` / `app` has no `docs/x/`, so A4 never applies to it: its `requirements.md` IDs are re-tagged as part of that lib's normal test edits.) **Give each functionality its own todo at A2 and A4** rather than one todo for the step — after a long A2 the second functionality is the one that gets dropped.
4. **One level deep — deeper companions are surfaced, never absorbed.** Rules 1–3 apply to the companions of **this cycle's** functionality only. If a companion turns out to need work in a **further** lib (its own companion), that is **not** this cycle's work: report the chain to the user — naming the libs and the ACs it puts at risk — and let them choose to widen the cycle, do the deeper work first in its own cycle, or defer it. Do **not** re-answer the gates for it, do **not** run A2's band or A3's enricher step for it, and do **not** add its tasks to the plan. Resolving companions recursively would turn one requested feature into an unbounded number of documentation cycles, each with its own AC-approval interview, that the user never asked for.

#### 🪝 A1 · Before `brainstorming` [gated]

Part of the docs-in-scope set — runs only when both gates answer **Yes**:

1. **Always** read `docs/getting-started/library-types-and-their-relationship.md` (functionality / lib types, natural entry, what util/api/app never own) and `docs/guidelines/naming-conventions.md` (especially lib and functionality naming) — they shape the design questions even when no PRD/TFS exists yet.
2. If this functionality already has docs in `docs/x/{name}/` (`PRD.md` and/or the `TFS/` folder), read them too.

#### 🪝 A2 · Before `writing-plans` [close-out]

Always runs on Path A before invoking `writing-plans`. One hook at this attach-point (do not split into a second before-`writing-plans` hook).

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Write/refresh the PRD & TFS** — `x-ng-prd-writer`, then `x-ng-tfs-writer`, **once per functionality in scope this cycle** (📌 _Companion work_). If `x-ng-tfs-writer` flags a product-observable gap (a `(new — suggest a PRD AC)` entry), ask the user; if approved, re-run `x-ng-prd-writer` to add the AC, then re-run `x-ng-tfs-writer` to back-link it.
2. **Sync the Superpowers spec** — update this cycle's brainstorm spec under `.superpowers/specs/` so it matches the approved PRD/TFS on overlapping decisions (step 1 wins on conflicts). Fix conflicting sections in the spec body; at minimum put a short note at the top that `docs/x/{name}/` PRD and TFS are primary and win on conflicts, and link those paths. Keep spec-only material that PRD/TFS never cover (gap filler for planning). Do **not** commit the spec (see _Workspace preferences_).
3. **Decide e2e now** — e2e is in scope only if the functionality has a `page` lib, or a `feature` that **composes another functionality's `feature`** (renders its exported entry component — "renders it" is "initializes it") **and some app page hosts that composition — already, or by the end of this cycle** (i.e. a page task is in **this** plan; a host merely intended for some future cycle does not count, and the hosting page may belong to any functionality — ownership is not the test), **and** the PRD ACs describe user-observable cases (taken as a set — not every AC need be e2e-coverable). A `feature` lib is not routable, so with no hosting page there is nothing to drive: if none exists and this cycle does not create one, e2e waits for a later cycle rather than inventing a harness page. State the verdict and a one-line why — naming the hosting page when the second case is what put e2e in scope.

   Everything this decision needs is in the PRD/TFS and the workspace, so derive it rather than asking. Ask the user only when the **target** is genuinely unsettled: which page will host it, **or** — when that page is composed by more than one app — which app's `{app}-e2e` the spec belongs in. That second question is the e2e skill's own rule; do not treat a settled page as settling it.

4. **Load the reference guidelines** — `x-ng-lib-build-helper` and `x-ng-test-unit-helper` always, and `x-ng-test-e2e-helper` **only if step 3 put e2e in scope** — so all of it is in context and `writing-plans` drafts from PRD/TFS first, then the synced spec for gaps (📌 _PRD/TFS over cycle spec_).

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

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Enrich** — run **`x-ng-sp-plan-enricher`**: fold into the plan's Global Constraints the PRD/TFS IDs and rules, the commit-message pointer, and the CODEOWNERS pointer when the plan creates owned paths or explicitly states a handoff; carry in the e2e verdict from A2 and tag the test tasks. Run it **once per functionality documented this cycle** (📌 _Companion work_): each run folds only its own `docs/x/{name}/` and tags only that functionality's test tasks, and Global Constraints are merged, never replaced.

**Always:**

2. **Hard stop — plan review gate.** In the plan's Global Constraints, **replace** `Path A phase: Documentation (draft).` with `Path A phase: ready for Execution.` (one phase line only). Do **not** create the feature branch and do **not** start execution. Tell the user the plan is ready at its path; they can review it; if it looks good, either continue execution in this session or give the plan path to another agent in another session. Then **wait**.

> ▶️ **Resume** (after the user proceeds). Not a step band — Execution starts here. For other-session / plan-path entry, also follow 🚪 **Entry** at the top of Path A.
>
> - **Same session** — do not re-ask mode unless the user explicitly changes it. Continue from `using-git-worktrees` (work in place per _Workspace preferences_) → the execution skill for the mode already in the plan.
> - **Other session** — user provides the plan path. Follow Path A's 🚪 **Entry** (phase line → Resume or ask draft vs ready). If mode is missing after they confirm ready, stop and ask, then ensure the plan records it before executing.

#### 🪝 A4 · Before `finishing-a-development-branch` [close-out]

Always runs on Path A before finishing. **This hook verifies; only its actions are conditional** — there is no "did we mint IDs?" question to answer wrongly. The plan is the only carrier _into_ execution; this hook is the only carrier _out_ of it, so nothing else will catch what implementation changed.

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Verify the PRD & TFS against what was actually built**, once per functionality (📌 _Companion work_). Walk this functionality's ACs and its TFS ID Index and compare each to the shipped code and tests. Then act on what you find:
   - **Added** — implementation needed a requirement that has no ID → mint it in the docs (`x-ng-prd-writer`, then `x-ng-tfs-writer`) and re-tag the affected test titles. **Rename only** here: the coverage already exists, because an execution subagent may not invent an ID — it flags a gap instead.
   - **Amended** — an existing AC/FR/BR is now described wrongly (its expectation changed) → correct its text **under its existing ID**. Never renumber, and never mint a second ID for the same behaviour.
   - **Retired** — an existing AC/FR/BR describes behaviour that no longer exists → remove the entry, its **ID Index row**, and its **AC back-link**, and confirm its test was deleted too. **Never recycle the number.**
   - **Unchanged** — the docs already match. Record that and move on; no edit.
2. **Amending or retiring overturns an approved decision, so it is never silent.** The writers must show the old text beside the new and get explicit confirmation, and must say which other functionalities reuse the affected lib — their docs may now be wrong too. That procedure lives in the writers.
3. **Stamp `Last Verified`** (date) on every doc checked — including the ones that needed no edit. That is the only outcome the writers cannot record, and it is what makes staleness mechanically detectable later.

**Always:**

4. **Verify the local `requirements.md`** of any `util`, product `app`, or grab-bag `ui`/`feature` lib this cycle touched, on the same four outcomes above, per `x-ng-test-unit-helper`. An `api` lib has no such doc — nothing to check. Stamp `Last Verified` here too.

   Step 2's confirmation gate does **not** apply here: those entries were never user-approved, so there is no approval to overturn, and no writer owns the file. **But still report** an amend or retire — old text beside new — and, for a **shared** lib, name its consumers: a semantics change there reaches every consumer that was outside this cycle's test scope. Report, don't block.

In **auto** mode the tree has already been reviewed, so route every resulting test-file change through a fix dispatch + scoped re-review like any other post-review change — never edit it from the controller session. Follow `x-ng-test-unit-helper` and `x-ng-test-e2e-helper` (in context from A2; re-read if gone).

> **Note:** a stale doc does not stay a local problem. 📌 _PRD/TFS over cycle spec_ makes the PRD/TFS the **primary** source for the next cycle, so an uncorrected doc outranks a correct fresh brainstorm — and Path B's Missing-docs gate will answer **Yes** on it, carrying the error forward again. Verifying here is what stops drift compounding.

⚪ **Hooks with no workspace step yet** — `using-git-worktrees` (after the user proceeds from A3; work in place per _Workspace preferences_, so just create the branch, in both modes) · execution (`subagent-driven-development` / `executing-plans`, picked by the mode) · `test-driven-development` · `requesting-code-review`

&nbsp;

### 🛣️ Path B — Fix a bug, or change an existing feature via the debugging path

**Typical flow** — each hook's own condition is what actually governs: `systematic-debugging` → `test-driven-development` → `verification-before-completion` → **verify docs vs. the proven fix** _(B1 — always; actions conditional)_ → `finishing-a-development-branch` _(only if the fix is on its own branch)_

No execution mode here — that question belongs to path A only. For git, see _Git contract_.

**Docs-in-scope set** — **Members:** **B1's `[gated]` band**. **Combine:** each gate below is answered on its own terms, and **any gate answering No skips that band** for this fix. **Regardless:** `systematic-debugging`, `test-driven-development`, `verification-before-completion`, and **B1's Always band** (verifying `util` / `app` / grab-bag `requirements.md`).

> 🚧 **Functionality gate** [auto] — **Asks:** is the fix to a **single-purpose** lib from `map` / `data-access` / `ui` / `feature` / `page`?
>
> - **Yes** → B1's `[gated]` band runs.
> - **No** (`util` / `api` / `app`, or a **grab-bag** `ui` / `feature`) → **skip that band**: those never have `docs/x/` docs to verify. B1's Always band still verifies their local `requirements.md`.
>
> Grab-bag `ui` / `feature` libs are defined in `/docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag. Unit tests for all of these libs still follow TDD and `x-ng-test-unit-helper` when tests are in scope — retag their IDs as part of normal test edits, not via B1's PRD/TFS writers.

> 🚧 **Missing-docs gate** [auto] — **Asks:** does that lib's functionality already have `docs/x/{name}/`?
>
> - **Yes** → B1's `[gated]` band runs.
> - **No** → **skip that band**: with no `docs/x/{name}/`, that functionality has no ID namespace at all — no PRD ACs, no TFS FR/BRs — so there is nothing to verify, amend, retire or re-tag.
>
> `[auto]` here, not `[ask]` as on Path A: a bug fix is not the place for a first-time PRD/TFS interview. If the user wants that functionality documented, that is a Path A cycle.

📌 **Companion work — `util`/`api`/`app`, or another functionality's libs** — **Spans:** both gates (answered per functionality) · B1's `[gated]` band (once per functionality). **Leaves alone:** the fix and its tests, and the order of any of it — Path B has no plan, so nothing here orders work.

When the fix touches a `util`, `api`, or `app` lib, or libs belonging to more than one functionality:

1. **Gates answer per functionality.** A `util` / `api` / `app` part, or a **grab-bag** `ui` / `feature` part, always answers **No** — none of them has `docs/x/` to update. Each functionality's part is answered on its own lib types and its own `docs/x/{name}/`.
2. **B1's `[gated]` band runs per functionality** whose gates both answer **Yes** — each against its own `docs/x/{name}/`. It runs whether or not that part of the fix minted an ID: verifying is the point, and an amended or retired requirement mints nothing.
3. **One level deep — deeper companions are surfaced, never absorbed.** Rules 1–2 cover the libs **this fix touches**. If fixing one of them turns out to require work in a **further** lib, that is not this fix's scope: report it to the user and let them decide. Do not widen the fix, and do not run B1 for a functionality this fix never touched.

#### 🪝 B1 · After `verification-before-completion` [close-out]

Always runs on Path B once the fix is proven. **This hook verifies; only its actions are conditional.** Path B has no plan and no A2, so this is the *only* point at which the docs meet what shipped — and a bug fix very often means the documented behaviour was the thing that was wrong.

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Verify the PRD & TFS against the proven fix**, once per functionality (📌 _Companion work_), on the same four outcomes as Path A's A4 — **added** (mint + re-tag, rename only) · **amended** (correct the text under its existing ID) · **retired** (remove the entry, its ID Index row and its AC back-link; never recycle the number) · **unchanged** (record it, no edit). Use `x-ng-prd-writer`, then `x-ng-tfs-writer`.
2. **Amending or retiring is never silent** — the writers show old beside new, get explicit confirmation, and name the other functionalities that reuse the affected lib.
3. **Stamp `Last Verified`** on every doc checked, including those needing no edit.

**Always:**

4. **Verify the local `requirements.md`** of any `util`, product `app`, or grab-bag `ui`/`feature` lib the fix touched, on the same four outcomes, per `x-ng-test-unit-helper`. An `api` lib has none. Stamp `Last Verified` here too. As on Path A, step 2's confirmation gate does **not** apply — those entries were never approved — but **report** any amend or retire, and name a shared lib's consumers. Report, don't block.

Docs come **after** the fix is proven, never before, so nothing documents behaviour that verification might still reject. The cycle is not done until this hook has run — make the final completion report after it, not before.

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
