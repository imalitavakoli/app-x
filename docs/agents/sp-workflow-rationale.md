[🔙](../../README.md#agents)

# Superpowers-First Workflow — rationale 🦸

Why the workflow in [`AGENTS.md`](../../AGENTS.md) → _Superpowers-First Workflow_ and its [path files](sp-workflow-path-a.md) is shaped the way it is.

> **Rationale only — no rules.** Every rule lives in `AGENTS.md` or `sp-workflow-path-*.md`. Do **not** read this to execute a cycle. Read it when **editing** the workflow or **questioning** a decision — and when Superpowers changes, to see what to revisit.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why we layer instead of fork

Superpowers updates independently, so edits to its files are lost. It already ranks user instructions above skills, and routes project conventions to `AGENTS.md` rather than skill forks. So `AGENTS.md` plus our `x-*` skills is the sanctioned channel, not a workaround.

**Revisit if** Superpowers stops honouring that precedence, or stops routing project conventions to the instructions file.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why pre-flight is a checklist

The first Superpowers skill starts talking before any path file is loaded, so reads and loads that must shape it live in `AGENTS.md` as an agent-answered list. A check belongs only if that skill would act wrongly without it. The list stays inline because it already runs on every request; it is not a skill (control flow is not).

**Revisit if** Superpowers exposes a hook before the first skill speaks, or the list itself becomes the bulk of the workflow section (then extract).

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why work in place, with no worktree

A feature branch already isolates the work. A worktree is a cold checkout: no `node_modules` or Nx cache, and none of our git-ignored local files (`AGENTS.local.md`, `.superpowers/`).

**Revisit if** we need two feature cycles in parallel on one machine — drop the preference and house those ignored files outside the worktree.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why hooks are gated or close-out (not a new landmark)

`[gated]` and `[close-out]` are kinds of hook, so a gate can skip gated work without skipping close-out. One hook per Superpowers attach-point; skippable work goes in a `[gated]` band inside the close-out hook.

**Revisit if** we need a third kind that is neither skippable-by-gate nor always-run.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why gates share a set and constraints never will

Gates on one path share a target, so one **set** names the members once. Constraints do not share a target, so `Spans:` is the search key — not a set. Past ~4 constraints on one path, move the `Spans:` lines into an index rather than copying them.

**Revisit if** a path's gates stop sharing one target, or one path grows past ~4 constraints.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the two gates never reference each other

They ask different questions (documentable vs document-now). Each states its trigger from the work; the set's **Combine:** rule resolves two answers. A cross-reference ("when the other gate applies") reads two opposite ways.

**Revisit if** a new gate must actually depend on another's answer — then change **Combine:**, do not cross-link the asks.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why Path A/B skip PRD/TFS for `util` / `api` / `app` and grab-bag libs

Those are not functionalities. Without a gate, a util-only cycle still invoked A1 and treated the writers' STOP as a gap. The Functionality gate skips the docs-in-scope set; unit tests still run via local `requirements/`.

**Revisit if** we start treating a grab-bag or `util` as a product feature with ACs.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the Missing-docs gate exists

An existing undocumented functionality-type lib should not force a first-time PRD interview. Path A asks (it is already a design conversation). Path B auto-skips: B1 has nothing to verify without docs, and a bug fix is the wrong moment to start one.

**Revisit if** Path B grows a first-time-document step, or every functionality-type lib must have `docs/x/{name}/`.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the PRD/TFS steps precede `writing-plans`

`brainstorming`'s exclusive exit guards against *implementation* skills, not document writers. A1 inserts in that gap (user-instruction precedence). The e2e verdict must precede planning — Superpowers has no e2e concept, and a task added later cannot carry the paths `writing-plans` requires.

**Revisit if** Superpowers grows native e2e, or that exclusive exit starts forbidding document skills too.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why PRD/TFS outrank the brainstorm spec for planning

A1 often changes what the spec said; planning from the stale spec fights the docs. When the docs-in-scope set ran: PRD/TFS win on conflicts, spec fills gaps, A1 syncs the spec. When it skipped: spec alone (vanilla Superpowers).

**Revisit if** `writing-plans` can plan from PRD/TFS natively.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the execution-mode question is ours to ask

Superpowers already has the two modes. We ask before `writing-plans` so the plan is born with the answer. Interactive uses `executing-plans` because muting git inside `subagent-driven-development` would empty the commit-range reviews.

**Revisit if** Superpowers lets that skill run without commits, or `writing-plans` asks mode up front itself.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why Path A stops after the plan is ready (close-out always)

The stop is human plan review plus a handoff-ready artifact (mode and phase line in Global Constraints). Close-out cannot be gate-skipped. The ready line is dated because the plan is git-ignored.

**Revisit if** we no longer want a hard stop between Documentation and Execution.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why the plan is the only carrier into execution

Auto implementer subagents never read `AGENTS.md`. They get the plan's Global Constraints and nothing else — hence the enricher, and why a pointer they receive must be a repo-relative path.

**Revisit if** Superpowers lets those subagents read workspace instructions.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why A3 is anchored to finishing, not to the guard

`verification-before-completion` is a guard with no fixed slot; only `systematic-debugging` invokes it (so B1 can hang there). A3 needs a point both execution modes reach: `finishing-a-development-branch`.

**Revisit if** Path A execution no longer ends at finishing, or that guard becomes a routed step.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why A3 and B1 verify, instead of firing only on new IDs

"New IDs only" missed amended, retired, and stale index rows. The plan is the only carrier *into* execution; these hooks are the carrier *out*. They always verify; only the actions are conditional. The Always band covers `util` / `app` / grab-bag `requirements/`.

**Revisit if** execution subagents may mint IDs, or reviews start checking shipped code against the PRD.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why Path B needs no plan step — and when to revisit that

The bug-fix path still runs in-session, so that agent reads `AGENTS.md`. Superpowers' bug path has no git workflow, so the user decides commits (this is not a workspace-wide "never commit").

**Revisit if** Superpowers runs bug-fix inside subagents — then Path B needs a plan, like Path A auto.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why git branch/commit naming isn't a hook step

`AGENTS.md` plus SessionStart keep the rule in context for the agent that commits. Auto implementers get it via the enricher into the plan.

**Revisit if** SessionStart stops re-injecting `AGENTS.md`, or auto implementers stop reading Global Constraints.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why some lifecycle points have no workspace step

The ⚪ line keeps the Superpowers lifecycle visible. A point gains a `#### 🪝` subsection when it gains a workspace step. TDD and execution still receive our test rules through the plan.

**Revisit if** we start attaching workspace steps to those points.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-🦸)

## Why `x-ng-sp-plan-enricher` is named differently

It edits a Superpowers artifact (the plan), so it is the exception to "our skills never name another skill." The `sp` segment marks that.

**Revisit if** we add a second Superpowers-artifact skill (same naming) or drop that exception.

[🔙](../../README.md#agents)
