[🔙](../../README.md#agents)

# Superpowers-First Workflow — rationale 🦸

Why the workflow in [`AGENTS.md`](../../AGENTS.md) → _Superpowers-First Workflow_ and its [path files](sp-workflow-path-a.md) is shaped the way it is.

> **Rationale only — no rules.** Every rule lives in `AGENTS.md` or `sp-workflow-path-*.md`. Do **not** read this to execute a cycle. Read it when **editing** the workflow or **questioning** a decision — and when Superpowers changes, to see what to revisit.
>
> **What earns an entry.** Compare the candidate to the other entries, especially on the same path. It earns a slot only if someone editing later would re-litigate the choice from the path file and the notation catalog alone — a surprising shape, a failed previous design, or a **Revisit if** that would change the workflow. Using a landmark as [sp-workflow-format.md](sp-workflow-format.md) already defines it does not earn one. Restating a path file's rule does not. A smaller case of something on the same path that has no entry does not.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why we layer instead of fork

Superpowers updates independently, so edits to its files are lost. It already ranks user instructions above skills, and routes project conventions to `AGENTS.md` rather than skill forks. So `AGENTS.md` plus our `x-*` skills is the sanctioned channel, not a workaround.

**Revisit if** Superpowers stops honouring that precedence, or stops routing project conventions to the instructions file.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why pre-flight is a checklist

The first Superpowers skill starts talking before any path file is loaded, so reads and loads that must shape it live in `AGENTS.md` as an agent-answered list. A check belongs only if that skill would act wrongly without it. The list stays inline because it already runs on every request; it is not a skill (control flow is not).

**Revisit if** Superpowers exposes a hook before the first skill speaks, or the list itself becomes the bulk of the workflow section (then extract).

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why work in place, with no worktree

A feature branch already isolates the work. A worktree is a cold checkout: no `node_modules` or Nx cache, and none of our git-ignored local files (`AGENTS.local.md`, `.superpowers/`).

**Revisit if** we need two feature cycles in parallel on one machine — drop the preference and house those ignored files outside the worktree.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why hooks are gated or close-out (not a new landmark)

`[gated]` and `[close-out]` are kinds of hook, so a gate can skip gated work without skipping close-out. One hook per Superpowers attach-point; skippable work goes in a `[gated]` band inside the close-out hook.

**Revisit if** we need a third kind that is neither skippable-by-gate nor always-run.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why gates share a set and constraints never will

Gates on one path share a target, so one **set** names the members once. Constraints do not share a target, so `Spans:` is the search key — not a set. Past ~4 constraints on one path, move the `Spans:` lines into an index rather than copying them.

**Revisit if** a path's gates stop sharing one target, or one path grows past ~4 constraints.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the two gates never reference each other

They ask different questions (documentable vs document-now). Each states its trigger from the work; the set's **Combine:** rule resolves two answers. A cross-reference ("when the other gate applies") reads two opposite ways.

**Revisit if** a new gate must actually depend on another's answer — then change **Combine:**, do not cross-link the asks.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why Path A/B skip PRD/TSD for `util` / `api` / `app` and grab-bag libs

Those are not functionalities. Without a gate, a util-only cycle still invoked A1 and treated the writers' STOP as a gap. The Functionality gate skips the docs-in-scope set; unit tests still run via local `requirements/`.

**Revisit if** we start treating a grab-bag or `util` as a product feature with ACs.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the Missing-docs gate exists

An existing undocumented functionality-type lib should not force a first-time PRD interview. Path A asks (it is already a design conversation). Path B auto-skips: B1 has nothing to verify without docs, and a bug fix is the wrong moment to start one.

**Revisit if** Path B grows a first-time-document step, or every functionality-type lib must have `docs/x/{name}/`.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the PRD/TSD steps precede `writing-plans`

`brainstorming`'s exclusive exit guards against _implementation_ skills, not document writers. A1 inserts in that gap (user-instruction precedence). The e2e verdict must precede planning — Superpowers has no e2e concept, and a task added later cannot carry the paths `writing-plans` requires.

**Revisit if** Superpowers grows native e2e, or that exclusive exit starts forbidding document skills too.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the writers run in subagents, with their interview relayed

A writer needs its templates and examples to produce its document; the session that plans afterwards needs only the document — so inline, the biggest load on this path sat in context through `writing-plans`. Only **topology** moved: a skill cannot relocate itself, but what it must achieve before calling its document done stays its own. A five-rep baseline found 5/5 refusing to self-approve, so the dispatch says nothing about the gate.

**Revisit if** a writer needs the user mid-draft rather than at its confirmation gate, or a later baseline shows the gate failing under a pressure this one did not apply.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why A1 has its own resume block and an unapproved-PRD entry

Relaying the AC approval gave A1 a second stopping point, and a hook that stops and waits needs a ▶️ resume contract — without one an interrupted approval has no way back, and the cycle stalls later at the TSD writer's guard. The 🚪 entry needed no new payload: the PRD's approval field already records where it stopped.

**Revisit if** the relay stops being how approval reaches the writers, or the PRD stops recording its approval state.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why shared procedures have their own file

A3 and B1 both verify the docs against what shipped, so that procedure had to leave the path files — otherwise one path cites another and neither can be edited alone. It did not belong with the shared **rules** either: that file is a mandatory cycle-start read, while these procedures fire late, so putting them there charged every path (Path C by 86%) for something two paths perform once.

**Revisit if** a procedure ends up cited by one path only — move it back into that path file.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why helper examples are not loaded when planning

The enricher already writes each canonical example's resolvable path into the plan, and an implementer opens files but can never invoke a skill — so the examples reach the builder by path either way, and loading them while planning changes nothing that session emits. A helper's `SKILL.md` is what a planner reasons with; its `assets/` are what a builder imitates.

**Revisit if** `writing-plans` starts needing an example's contents to name a task's files, or the enricher stops writing those paths into the plan.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why PRD/TSD outrank the brainstorm spec for planning

A1 often changes what the spec said; planning from the stale spec fights the docs. When the docs-in-scope set ran: PRD/TSD win on conflicts, spec fills gaps, A1 syncs the spec. When it skipped: spec alone (vanilla Superpowers).

**Revisit if** `writing-plans` can plan from PRD/TSD natively.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the execution-mode question is ours to ask

Superpowers already has the two modes. We resolve mode before `writing-plans` so the plan is born with the answer. Interactive uses `executing-plans` because muting git inside `subagent-driven-development` would empty the commit-range reviews.

**Revisit if** Superpowers lets that skill run without commits, or `writing-plans` asks mode up front itself.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why personal preferences live in `AGENTS.local.md`, not Workspace preferences

Workspace preferences are committed team constraints Superpowers skills honour without asking (worktree, spec path). A `pref.*` key is a personal habit. Putting those values in the shared rules would force every developer onto the same default. A cycle artifact (today a plan line) stays that cycle's binding answer; the local key is only the default for a new cycle. How to resolve any key lives in `sp-workflow-prefs.md`, not next to Workspace preferences and not in the `AGENTS.local.md` format catalog.

**Revisit if** the team wants committed defaults, or Superpowers grows a first-class prefs file.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why `audience` is chat-only

`product` is a PM who owns the PRD and the ACs. Changing how files are written would break the plan (the only carrier into execution) and every skill that expects today's shapes. So `audience` never becomes a plan line and never forks a path: same hooks, same specs, same PRD/TSD — only the words in the thread change.

**Revisit if** a second durable artifact must be written in product language (it would be a new document, not a rewritten plan).

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why Path A stops after the plan is ready (close-out always)

The stop is human plan review plus a handoff-ready artifact (mode and phase line in Global Constraints). Close-out cannot be gate-skipped. The ready line is dated because the plan is git-ignored.

**Revisit if** we no longer want a hard stop between Documentation and Execution.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why execution prefers a fresh session

The hard stop already produces a handoff-ready artifact: the plan carries the mode, the dated ready marker and the enriched conventions, and the freshness check is what makes handing it over safe. The session that reaches the stop has just written the PRD, the TSD and the plan, so continuing there starts execution at the cycle's deepest point for no gain.

**Revisit if** the plan stops being sufficient on its own, or the freshness check can no longer tell a stale plan from a current one.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the plan is the only carrier into execution

Auto implementer subagents never read `AGENTS.md` — they get only what the plan carries, hence the enricher, and why a pointer they receive must be a repo-relative path.

But the plan has **two** channels into them, and they differ in reliability. A **task's own text** is extracted by the execution skill's task-brief script — deterministic. **Global Constraints** reach an implementer only because that skill's prose tells the controller to carry them; the reviewer prompt has a slot for them, the implementer prompt does not. So the enricher puts each task's operative contract in the **task**, and keeps Global Constraints for the cross-task set plus one-line restatements. A 2026-08-20 baseline confirmed the cost of getting this wrong: given IDs with no contract, an implementer used them as code comments, made an FR ID a sibling `it`, added untraced tests, and silently reinterpreted an ambiguous BR.

**Revisit if** Superpowers lets those subagents read workspace instructions, or the implementer dispatch gains a structural Global-Constraints slot of its own — then the two channels become equally reliable and the split stops earning its cost.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why A3 is anchored to finishing, not to the guard

`verification-before-completion` is a guard with no fixed slot; only `systematic-debugging` invokes it (so B1 can hang there). A3 needs a point both execution modes reach: `finishing-a-development-branch`.

**Revisit if** Path A execution no longer ends at finishing, or that guard becomes a routed step.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why A3 and B1 verify, instead of firing only on new IDs

"New IDs only" missed amended, retired, and stale index rows. The plan is the only carrier _into_ execution; these hooks are the carrier _out_. They always verify; only the actions are conditional. The Always band covers `util` / `app` / grab-bag `requirements/`.

**Revisit if** execution subagents may mint IDs, or reviews start checking shipped code against the PRD.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why Path B needs no plan step — and when to revisit that

The bug-fix path still runs in-session, so that agent reads `AGENTS.md`. Superpowers' bug path has no git workflow, so the user decides commits (this is not a workspace-wide "never commit").

**Revisit if** Superpowers runs bug-fix inside subagents — then Path B needs a plan, like Path A auto.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why git branch/commit naming isn't a hook step

`AGENTS.md` plus SessionStart keep the rule in context for the agent that commits. Auto implementers get it via the enricher into the plan.

**Revisit if** SessionStart stops re-injecting `AGENTS.md`, or auto implementers stop reading Global Constraints.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the user commits the functionality's docs, on request

Nobody owned that commit: the contract assigns commits during **execution**, the docs are written before a branch exists, and interactive mode commits nothing during execution either. Making the user the committer continues the pattern the contract already sets elsewhere, and it is an **ask** because that is all a workflow can guarantee. Creating the feature branch at A1 instead would couple the handoff to a branch as well as a plan path.

**Revisit if** the docs must reach a shared branch without the user acting, or Documentation starts creating the feature branch.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why some lifecycle points have no workspace step

The ⚪ line keeps the Superpowers lifecycle visible. A point gains a `#### 🪝` subsection when it gains a workspace step. TDD and execution still receive our test rules through the plan.

**Revisit if** we start attaching workspace steps to those points.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why `x-ng-sp-plan-enricher` is named differently

It edits a Superpowers artifact (the plan), so it is the exception to "our skills never name another skill." The `sp` segment marks that.

**Revisit if** we add a second Superpowers-artifact skill (same naming) or drop that exception.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why hook scripts live in `.agents/` (not a new skill)

Hook scripts live in `.agents/hooks/` because the script is the portable content and each harness registers it in its own registry — the same split skills already use. There is no new skill for them: Superpowers has no hook-authoring skill to layer on, hooks are already an `x-sp-workflow-helper` surface, and a sibling would collide on the word "hook".

The shared harness module was first rejected because Claude Code and Codex share a contract, making it look like a no-op. It was adopted once Gemini CLI's divergent event vocabulary plus the hardcoded event literals showed otherwise, and it derives from the payload rather than mapping per-agent names. Cursor's documented contract differs again (`sessionStart` / `additional_context` / `tool_input.path`); `emit()` mirrors Claude Code's nested context field onto Cursor's top-level name so SessionStart hooks still need not read stdin. The guarded-registry list is two-tier: only a verified contract (today Claude Code, Codex, and Cursor) is listed; the rest is prose in the skill, so nothing can act on an unverified path.

**Revisit if** a harness sends no event name on stdin (the one assumption `eventName()` rests on), or a harness needs a hook the others must **not** run (which one shared directory cannot express).

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why we pin Superpowers, and why an unpinned agent is only a notice

Pinning was never a requirement. The layer is built to survive a version change: routing reads the `description` of whichever skill fired rather than its name, hooks attach to lifecycle moments rather than to titles, and `sp-skills` proves every attach-point still resolves. A rename or a split is survivable by design.

What that design does **not** cover is the dozen **prose-enforced** dependencies — single sentences inside Superpowers' own skill files, honoured at the model's discretion. Reword _"a fresh subagent needs its task, the interfaces it touches, and the global constraints"_ and the enricher keeps writing constraints that quietly stop reaching implementers. So pinning is the conservative choice: it converts "a new version may already be in effect" into "a new version arrives when we choose", buying time to run the review rather than removing the need for one.

That choice is deliverable only where a Claude Code marketplace reaches, which is why severity is conditioned on the reader rather than on the finding alone. A teammate on another agent cannot install the pinned commit and cannot be inspected from here; for them a version difference is the ordinary state. Failing them yields a red they can never clear, which is the same wolf-crying `VERSION_DRIFT_POLICY` avoids at the patch tier — permanent instead of occasional. They get a **notice**: reported, surfaced at session start, exit 0. The review is still owed; it is owed by whoever maintains the workflow, not by whoever opened a session.

**Revisit if** most of the team moves off Claude Code — a pin governing a minority of installs buys little and still costs the two-file sync — or if Superpowers starts declaring its behavioural contracts somewhere a script can read, which would replace the prose risk that motivates pinning at all.

[🔙](../../README.md#agents)
