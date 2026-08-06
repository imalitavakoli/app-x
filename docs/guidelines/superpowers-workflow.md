[🔙](../../README.md#guidelines)

# Superpowers-First Workflow — rationale 🦸

Why the workflow in [`AGENTS.md`](../../AGENTS.md) → _Superpowers-First Workflow_ is shaped the way it is.

> **This document is rationale only — it contains no rules.** Every rule an agent must follow lives in `AGENTS.md`. Nothing here needs to be read to execute a cycle correctly; it exists so a human (or an agent auditing the setup) can see why each decision was made, and what to reconsider if Superpowers changes.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why we layer instead of fork

Superpowers ships as a plugin that updates independently, so any edit to its own files is lost on the next update. It also states its own precedence rule — user instructions (`CLAUDE.md`, `AGENTS.md`) outrank skills, which outrank default behavior — and its `writing-skills` skill explicitly routes project-specific conventions to the instructions file rather than into skill forks. So `AGENTS.md` plus our own `.agents/skills/x-*` skills is not a workaround; it is the channel Superpowers designed for exactly this.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why work in place, with no worktree

A worktree exists to keep your trunk safe while an agent works, and a feature branch already does that. Here a worktree would only add cost, for two reasons that hold no matter which agent or tool creates it:

**(a) A worktree is a fresh checkout — no `node_modules`, no Nx cache.** Every cycle would open with a full `pnpm install` and a cold cache before the first line of code, and pay it again on the next cycle.

**(b) A fresh checkout has none of our git-ignored local files.** `AGENTS.local.md` (when present — mandatory to read per _Developer Workflows_) and `.claude/settings.local.json` would simply not be there, and `.superpowers/` — the cycle's spec, plan and SDD ledger — would be deleted along with the worktree when finishing cleans it up.

A worktree's one real benefit is running two feature cycles at the same time, or letting an agent build while you keep using your own checkout — **not** parallel implementers, which `subagent-driven-development` forbids regardless ("Never dispatch multiple implementation subagents in parallel").

**If we ever want that:** drop the "do not create a worktree" preference in `AGENTS.md` and `using-git-worktrees` returns to its own default (it asks for consent and creates one), then give the ignored files above a home outside the worktree. Nothing else moves — the hook tables, their order, and both execution modes stay exactly as they are.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why hooks are gated or close-out (not a new landmark)

🚧 **gate** stays a landmark. **`[gated]`** and **`[close-out]`** are only kinds of 🪝 **hook** (optional heading tags), so a gate rule can stay path-agnostic: a gate may skip or apply **gated** hooks or **`[gated]` step bands**; it must **not** skip a **close-out** hook. Label kinds on paths that use gates / close-out (Path A; B1 on Path B); omit them on paths that don't (Path C today). Prefer **one hook per Superpowers before/after attach-point**; put gate-skippable work in a **`[gated]`** step band inside a `[close-out]` hook rather than inventing a second hook at the same point (e.g. do not add an `A2b`).

Hierarchy inside a path: **hook → step bands (`[gated]` / Always) → steps**. A **▶️ resume block** is not a step band — it is a post-hard-stop contract (blockquote + icon), used today on A3 after the plan-review wait; any future hard-stop hook can add one the same way. A close-out hook may contain a `[gated]` band (Path A's PRD/TFS work inside A2; enricher inside A3): the hook always runs; that band is what the gate skips.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why Path A/B skip PRD/TFS for `util` / `api` / `app`

PRD and TFS under `docs/x/{name}/` exist only for **functionalities** (product features built from `map` / `data-access` / `ui` / `feature` / `page`). That distinction already lived in `docs/getting-started/library-types-and-their-relationship.md` and in the writers' own STOP gates — but Path A's typical flow ("PRD + TFS + e2e verdict") had no skip, so an agent following the path after a util-only brainstorm still invoked A2 and expected functionality docs. The writers would refuse; the enricher would then "stop and ask" for a missing PRD — friction that looked like a gap rather than a correct exclusion.

The **Functionality gate** on Path A (and the matching note on Path B's B1) moves that decision into control flow: when the cycle is only `util` / `api` / `app`, skip Path A's gated hooks/steps (A1, A2's gated steps, A3's enricher step, A4) and skip B1. The skills stay the second line of defense if they are invoked anyway. Close-out still runs: A2 always (mode → `writing-plans` with mode in Global Constraints) → A3 hard-stops. Execution starts only after the user proceeds. Only the functionality-doc work is omitted — not the plan-review boundary.

Skipping `docs/x/` PRD/TFS does **not** skip unit tests. When the plan or brainstorm includes specs, **`util`** and product **`app`** still get unit tests — their FR/BR IDs live in a local **`requirements.md`** (beside the util version README, or at `apps/{app-name}/requirements.md`), owned by the `x-ng-test-unit-helper` convention (`references/libs/util.md` / `app.md`), not under `docs/x/`. **`api`** stays without that doc (proxy-only). E2e apps keep `user-stories.md` for US IDs.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the Missing-docs gate exists

A functionality's durable identity in this workspace is `docs/x/{name}/` (PRD + TFS). Family-named libs (`…-feature-ng-users`, `…-ui-ng-users`, …) are a strong hint, not proof — without those docs there is no reliable record of which libs the functionality owns. Humans often still "know" the grouping; agents do not.

Path A used to treat every functionality-type cycle as **write/refresh PRD & TFS**. For a small update to an **existing** lib with no docs yet, that forced a first-time product/technical interview the user never asked for — or left the writers stuck on "STOP and ask" for a full description, then the enricher stuck on missing PRD/TFS.

The **Missing-docs gate** (document now / skip) fixes the control flow:

- **Document now** — first-time PRD/TFS (writers may bootstrap from existing libs + Q&A; still no inventing, still AC approval), then gated Documentation hooks + A4 as usual.
- **Skip** — intentional limited cycle: Superpowers brainstorm → A2 always (mode → `writing-plans` with mode in the plan) → A3 hard stop → implement after the user proceeds (and TDD if tests are in scope), **without** A2's gated steps / enricher / A4. No our FR/BR/AC ID conventions for that cycle. Same shape as the Functionality gate's util/api/app skip, but chosen by the user for an undocumented functionality lib.

**New** functionalities (libs not yet in the workspace) do not get the skip offer — creating them is creating the functionality; docs stay on the path.

The writers stay atomic (HOW to bootstrap). The ask/skip decision stays in `AGENTS.md` (WHEN). This rationale doc holds only the WHY.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the PRD/TFS steps precede `writing-plans`

`brainstorming` declares an exclusive exit: _"The terminal state is invoking writing-plans. Do NOT invoke frontend-design, mcp-builder, or any other implementation skill. The ONLY skill you invoke after brainstorming is writing-plans."_ Our _Before `writing-plans`_ hook inserts steps into exactly that gap, so it is worth being precise about why that is legitimate:

- **What the exclusivity guards against** is an _implementation_ skill hijacking the design→plan handoff and starting to write code before there is a plan. Both named examples (`frontend-design`, `mcp-builder`) are implementation skills, and the surrounding `HARD-GATE` is about implementation actions.
- **Our inserts build nothing.** `x-ng-prd-writer` and `x-ng-tfs-writer` write documents; the three helpers only load context. No code, no scaffolding, and `writing-plans` is still the next Superpowers skill to run.
- **The precedence rule authorizes it**, and the human is the only authority Superpowers recognizes for waiving a skill workflow. `AGENTS.md` is that instruction.

The override is named inline in the hook row on purpose. An agent that has just read `brainstorming`'s forceful wording is about to act on it, so the resolution has to be in front of it at that moment — not here.

**Why the e2e verdict is decided here rather than later.** Superpowers has no concept of e2e tests, so nothing downstream will mint that task. And a task added after planning cannot carry the complete code and exact file paths that every `writing-plans` task is required to carry. Deciding the verdict before planning is what lets `writing-plans` author a fully-specified e2e task in the first place.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why PRD/TFS outrank the brainstorm spec for planning

Superpowers `writing-plans` is built to plan from the brainstorm **spec** and to self-check coverage against that file. In this workspace, A2 sits between brainstorm and planning so the user can approve durable PRD/TFS decisions — and those decisions often **change** what the spec said. If the agent then plans from the stale spec, the plan fights the docs we just wrote (and the enricher's ID coverage check against PRD/TFS cannot fully repair architecture or product choices baked into a stale design).

We do **not** move PRD/TFS before brainstorm: the writers need brainstorm conclusions as input. We also do **not** fork `writing-plans`. Instead, when gated Documentation hooks ran:

1. **Layered source of truth** (📌 _PRD/TFS over cycle spec_) — PRD/TFS are primary; on conflicts they win; for plan needs they do not cover (companion util/api/app, narrative detail), use the brainstorm spec; invent nothing that appears in neither.
2. **Spec sync at A2** — update `.superpowers/specs/…` so overlapping decisions match the approved PRD/TFS, while leaving legitimate gap material in the spec — so Superpowers' native "read the spec" path stays aligned (the spec stays git-ignored and uncommitted).

When A2's gated steps were skipped, there is no PRD/TFS carrier — the brainstorm spec alone remains the plan's requirements source, same as vanilla Superpowers; A2's always band still asks mode, `writing-plans` still records it, and A3 still hard-stops.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the execution-mode question is ours to ask

Vanilla `writing-plans` already ends by offering two execution paths — "Subagent-Driven (recommended)" or "Inline Execution" (`executing-plans`) — and only falls back to inline on its own when the harness has no subagents. The choice is Superpowers'; we are not bolting on a foreign concept. We change exactly three things:

1. **We always ask on Path A, and ask before `writing-plans`.** Vanilla asks at the end of `writing-plans`; we ask in A2's always band, then `writing-plans` writes the chosen mode (🎛️ Plan line) into the plan's Global Constraints so the plan is born handoff-ready — **whether or not** the enricher runs later. We never let mode be decided silently by harness capability, and we do not let vanilla re-ask at the end as a substitute.
2. **We keep Superpowers' recommended default** — auto / subagent-driven.
3. **Interactive adds a no-commit contract** on top of `executing-plans`. `executing-plans` itself is otherwise untouched.

Mode is just another line `writing-plans` puts in the plan; the post-plan close-out is enricher-or-skip + hard stop.

Everything else runs as Superpowers defines it: TDD, the plan's task order and steps, `systematic-debugging` if something breaks mid-task, and `verification-before-completion` are identical in both modes.

**Why interactive switches skills rather than muting git in the subagent path.** `subagent-driven-development`'s quality gates are built on commit ranges — the task reviewer reads a package produced by `review-package BASE HEAD`, and the progress ledger records commit SHAs as its post-compaction recovery map. Suppressing commits there would hand every reviewer an empty diff while still reporting "reviewed". `executing-plans` has no commit contract at all, so it is the honest home for a no-commit flow.

**The known trade-off:** the per-task reviewer and the final whole-branch review belong to `subagent-driven-development`, so interactive mode does not get them — the user is the reviewer at each stop. That trade-off is Superpowers' own, inherent to its inline path; our customization did not introduce it.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why Path A stops after the plan is ready (close-out always)

Path A is two parts: **Documentation** (through A3's plan-review stop) and **Execution** (after the user proceeds). The stop is the boundary.

Documentation uses the shared gated / close-out kinds: **gated** hooks/steps (A1, A2's gated steps, enricher, A4) may be listed on a 🚧 gate; **A2** and **A3** are **`[close-out]`** (A2: gated docs band + always mode/`writing-plans`; A3: enricher if docs in scope → hard stop). A future gate only names gated hooks/steps — the vocabulary already forbids skipping a close-out hook.

We stop for three reasons:

1. **Human plan review** — one deliberate look at the plan before any implementation.
2. **Stable handoff when context is full** — by the end of Documentation the session context may be large; a hard stop lets the user switch agents or sessions without losing a complete, mode-bearing plan.
3. **Handoff-ready artifact** — mode is in Global Constraints from `writing-plans` (asked in A2's always band); another session can continue from the plan path alone whether or not the enricher ran.

**Plan phase line.** A mid-cycle stop can leave a draft plan; a finished Documentation stop must be unmistakable. So Global Constraints carry `Path A phase: Documentation (draft).` right after `writing-plans`, then **replace** it with `Path A phase: ready for Execution.` at the A3 hard stop. Same key, two values — no ambiguity. Those lines nest under Path A's 🚪 **Entry** as its payload (not a separate landmark): Entry reads the line — ready → ▶️ Resume; draft or missing → ask (execute vs keep drafting). That hybrid avoids wrong Execution on a draft without nagging when the plan is clearly ready.

The plan-review hard stop is **control flow in `AGENTS.md`** (Path A Documentation close-out), not inside `x-ng-sp-plan-enricher` (that skill only runs when functionality docs are in scope). Branch creation and execution skills run only after the user proceeds.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the plan is the only carrier into execution

In the auto path, implementation and test-writing happen in subagents that never read `AGENTS.md` or any skill. `subagent-driven-development` is explicit about what they do get: _"A fresh subagent needs its task, the interfaces it touches, and the global constraints. Nothing else."_ Those global constraints come from the plan's `## Global Constraints` section. So the plan is not merely _a_ channel into execution — it is the only one, which is why `x-ng-sp-plan-enricher` exists and why anything an implementer must obey has to be written there.

This also explains why a pointer handed to an execution subagent must be a **resolvable repo-relative path**. Those agents read files but can never invoke a skill, so "the canonical lib examples" is not a location to them; `.agents/skills/x-ng-lib-build-helper/assets/examples/ui.md` is.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why table A's late doc row is anchored to finishing, not to the guard

`verification-before-completion` is a **guard**, not a routed step: it self-triggers whenever the agent is about to claim work is complete, so it has no fixed position in a workflow to hang a hook on. The only skill that _invokes_ it by name is `systematic-debugging` — which is why table **B** can anchor to it and table A cannot.

Table A's build path runs execution → (auto only) final whole-branch review → finishing, so a late doc/ID update belongs at the end of that chain, anchored to a point **both** execution modes reach: `executing-plans` names `finishing-a-development-branch` a required sub-skill, and `subagent-driven-development` hands off to it after the final review.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why table B needs no plan step — and when to revisit that

Whenever Superpowers updates, ask one question: **does the bug-fix path still run in the current session, without subagents?**

- **Yes** (the case today) → nothing to do. The same agent that reads `AGENTS.md` writes the fix and its tests, so it follows table B directly.
- **No** (a future version runs the bug-fix path inside subagents) → subagents cannot read `AGENTS.md`, so table B's rules must then travel via a plan, exactly as the auto path handles table A.

**Why table B commits nothing on its own.** Superpowers' bug-fix path (`systematic-debugging` → `test-driven-development` → `verification-before-completion`) prescribes no git workflow at all: it does not create a branch, and it does not commit or push. It finds the root cause, fixes it, and proves the fix. So the git decision stays with the user. This is scoped to table B — it is **not** a workspace-wide "never commit"; table A's auto mode commits once per task by design, because `subagent-driven-development`'s review gates are built on those commits.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why git branch/commit naming isn't a hook step

The rule lives in _Project-Specific Conventions_ near the top of `AGENTS.md`, and the `SessionStart` hook (`.claude/hooks/inject-agents-file.mjs`) re-injects the directive to read that file at session start and again after every `/clear` or compaction — so whenever the agent creates a branch or writes a commit **itself**, the rule is in context.

The one exception is table A's auto mode, where the coding and committing are done by execution subagents that never read `AGENTS.md`. For them, `x-ng-sp-plan-enricher` copies the same rule into the plan they _do_ read. Hence no table needs a git-naming row.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why some hook rows are `—`

A `—` means that Superpowers skill runs in the workflow but has no workspace step **yet** — the cell is a placeholder to fill later, with no restructuring needed.

For the `test-driven-development` and execution rows specifically, `—` does not mean "nothing happens here": our unit- and e2e-test rules reach those steps through the enriched plan rather than through a direct hook.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why `x-ng-sp-plan-enricher` is named differently

It is the one workspace skill built **specifically for Superpowers** — it edits a Superpowers artifact (the plan), so unlike our other `x-*` skills (which are general and usable on their own) it only makes sense inside this workflow. That is what the `sp` tool segment in its name marks, and why it is the declared exception to the rule that our skills never name another skill.

[🔙](../../README.md#guidelines)
