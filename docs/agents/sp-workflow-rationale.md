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

## Why the path-file read is both named and hook-reminded

Pre-flight once deferred these reads with "those wait for a skill to fire" — a deferral naming no moment to come back at — and agents quoted it as grounds for reading _after_ the skill fired; naming the moment fixed that misreading measurably (8/8 post-change scenario runs, against 4/8 failures before). Naming was still not enough, and the reason is the **model, not the wording**: those runs all inherited the strongest one, and re-run weaker, the same fixed wording failed at the same point. **This workspace is read by more than one model, so prose is a floor only as high as the weakest one that reads it** — hence a **PreToolUse** reminder as well, matched on the plugin namespace rather than any skill name, firing every time because a once-per-session marker was consumed by whichever subagent invoked first. Anchoring to _a skill being invoked_ then failed a second way: on a rejoin the first Superpowers skill is the **execution** skill, so hook matcher and prose condition alike stayed false through every decision preceding it, the questions put to the user included. So the moments are now named as **moments** — cycle start, entering or rejoining; before the first question put to the user — stated once in [sp-workflow-shared.md](sp-workflow-shared.md), with the hook a floor under the prose on the routes it can see. The general rule this instances — a deferred read needs something at that moment to say so, and a hook is the last resort — is [where-content-lives.md](where-content-lives.md) → _Writing a pointer_.

**The reminder has since been tested against its own absence.** The same route was run twice with the same model, differing only in whether the reminder was registered. Unregistered, the skill was invoked ahead of every read meant to shape it, and the run recovered only because it happened to notice the gap itself. Registered, the same out-of-order invocation occurred — and the reads landed before the skill asked anything. **Both runs got the invocation order wrong; what the reminder changes is whether that mistake costs anything.** This is the standing answer to "the docs cover this now, so the reminder is redundant": the docs did cover it, in both runs.

**Revisit if** the reminder proves unnecessary across every model in use, a harness offers a pre-skill hook that can deliver a file’s contents rather than a directive, or one lets the reminder match a path being **entered** (a plan file read, a question about to be asked) rather than only a skill invocation.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why work in place, with no worktree

A feature branch already isolates the work. A worktree is a cold checkout: no `node_modules` or Nx cache, and none of our git-ignored local files (`AGENTS.local.md`, `.superpowers/` scratch).

**Revisit if** we need two feature cycles in parallel on one machine — drop the preference and house those ignored files outside the worktree.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why spec and plan use Superpowers defaults

We used to redirect specs and plans to git-ignored `.superpowers/` so they never reached a branch. That made a Cloud (or any remote clone) unable to read the plan — the only carrier into execution. Superpowers already writes `docs/superpowers/specs/` and `docs/superpowers/plans/` and commits the spec. Keeping those defaults, tracked, is what lets a later session or a Cloud agent open the plan path. PRD/TSD stay the durable product docs and still win on conflict. `.superpowers/` remains ignored for Superpowers' own scratch (SDD briefs, brainstorm companion), which is a different artifact.

**Revisit if** Superpowers changes those default paths, or we again need cycle scratch that must never reach a branch.

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

**Revisit if** Path B grows a first-time-document step, or every functionality-type lib must have `docs/x/{domain}/{name}/`.

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

Workspace preferences are Superpowers skill overrides (today: no worktree). A `pref.*` value is not that family. Team standing lines live in `AGENTS.md` so the overlay can beat them; personal restatements live in `AGENTS.local.md`. Putting the values in the shared rules would bypass the overlay and force every clone onto one default with no local escape. A cycle artifact (today a plan line) stays that cycle's binding answer. How to resolve any key lives in `sp-workflow-prefs.md`.

**Revisit if** Superpowers grows a first-class prefs file, or the overlay is dropped.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why `AGENTS.local.md` wins the whole file — the inverse of skill prefs

`AGENTS.local.md` is a **personal overlay of `AGENTS.md`**, not a prefs store that happens to live next to it. `AGENTS.md` and the SessionStart inject both say: layer local on top; on conflict, local wins. That is complete freedom for an advanced user to replace routing, hooks, even the Superpowers-First Workflow. `pref.*` keys in that file are one instance of the overlay, not an exception to it.

Skill prefs are the other way around on purpose. `.agents/_team/` locks consistency of the *artifact* a skill produces; local may fill only what team omitted. Escape hatch: do not invoke the skill, or overlay `AGENTS.md` so the path never reaches it.

Do not invent `AGENTS.team.md` as a third file that local cannot overlay. A team default that must travel with the clone belongs **in `AGENTS.md`** — the file the overlay already wins against. A Cloud VM with no `AGENTS.local.md` then sees the team text; a local checkout that rewrites it, wins. That is the opposite of skill team-over-local, and mixing the two ladders is the confusion this entry exists to stop.

**Revisit if** the overlay is dropped, or `pref.*` values are given a store that is not part of `AGENTS.md` / `AGENTS.local.md`.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why pref.log-analytics is team-off (and pref.log-diag is not)

Locking both close-out log keys to `on` looks consistent and is wrong. Diagnostic logs are cheap, local, and an engineering habit — the team line is `on` so Cloud and a bare clone skip the interview. Analytics events cannot be retracted once sent, native event names are capped per app user, and adding them is a **product** decision. PMs decide that, not every agent cycle. So the team line is `off`: the unasked-for pass does not run. A personal overlay, a this-cycle override, or the user asking for analytics in a named file still runs the skill.

**Revisit if** analytics becomes a required engineering convention like diag, or events become retractable.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why `audience` is chat-only

`product` is a PM who owns the PRD and the ACs. Changing how files are written would break the plan (the only carrier into execution) and every skill that expects today's shapes. So `audience` never becomes a plan line and never forks a path: same hooks, same specs, same PRD/TSD — only the words in the thread change.

**Revisit if** a second durable artifact must be written in product language (it would be a new document, not a rewritten plan).

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why Path A stops after the plan is ready (close-out always)

The stop is human plan review plus a handoff-ready artifact (mode and phase line in Global Constraints). Close-out cannot be gate-skipped. The ready line is dated so a later session (or a Cloud agent reading the committed plan) can tell a fresh plan from one whose docs or libs have moved since.

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

## Why the code review ends the cycle instead of feeding the fix dispatch

A3's surrounding text is all about routing post-review changes through a fix dispatch, so the obvious reading is that the reviewer's findings should go the same way — the agent found the problem, let it fix it. They deliberately do not.

The reviewer is read-only by contract, and the value of that contract is that the diff handed to a human is the one its author wrote. A run that reviews and then fixes destroys it twice over: nobody downstream can separate author from reviewer, and a finding stops being auditable the moment the same run makes it true. Dispatching fixes from the finding preserves the letter (the reviewer's own hands stay clean) while losing the point (the branch under review changes because of the review, inside the same cycle, with the report already written against the old tree). So a report asking for changes ends the cycle, and the user opens a new one.

It runs **last** in its hook for the same reason: the steps before it amend docs and add CODEOWNERS lines, and a review of a tree that is about to change is a review of nothing. Those earlier steps also mean its own PRD/TSD observations should come back clean — that is the two mechanisms agreeing, not redundancy, and de-duplicating them would remove the only independent confirmation the path has.

**Revisit if** a paired fixer skill is built (then the question becomes which cycle applies it, not whether), or if ending the cycle proves so costly in practice that users start skipping the review to avoid it — that would mean the cost landed on the wrong party.

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

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why a green checker is not enough

The obvious economy is to keep the checker and drop the other two mechanisms: if every reference resolves, what is left to go wrong? Enough that both of the following passed a green run.

**A rule that resolves but attaches in the wrong place.** `x-ng-sp-plan-enricher` wrote implementer conventions into the plan's Global Constraints — every path valid, every ID defined — but that section only reaches an implementer if the controller carries it there. The constraint existed, resolved, and arrived nowhere. Only running the change as a scenario, with a subagent given what an implementer is actually given, showed the gap.

**A sentence that the fix falsified.** Correcting the above made a line in this very file wrong: it stated that implementers get the plan's Global Constraints and nothing else. Still perfectly grammatical, still citing real things, and now false. No rule can see that, because nothing about it is broken — it simply no longer describes the system. The sweep for a rule's other homes is what finds it.

So the three mechanisms partition the failure space rather than overlapping: **the checker proves references resolve, a scenario proves behaviour changed as intended, the sweep proves no other copy of the rule now contradicts it.** Dropping either of the latter two does not lose redundancy; it loses a class of failure entirely, and one that a green run actively disguises.

**Revisit if** a checker rule ever becomes able to test intent rather than resolution — a rule that could tell a stale-but-valid sentence from a current one would absorb the sweep — or if scenario runs stop discriminating, which would mean the wording is not what governs behaviour and the effort belongs somewhere else.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why a generator's block in a tool stub is detected, not prevented

`CLAUDE.md` held Nx's rules block byte-identical to the copy in `AGENTS.md` — one paid for on every turn, since a tool loads its own entry file unasked. The obvious fix is to make its removal permanent, and that turns out not to be available.

Nx decides whether an agent needs reconfiguring by **dry-running its own generator** and asking whether the tree would change. A stub with the block removed therefore reports as out of date **because** it was cleaned, and `nx configure-ai-agents` re-appends a fresh block, its markers being what it looks for and they are gone. There is no persistent opt-out: the agent list is an argument, not a setting. Two near-misses are worth naming, because both look like solutions: leaving the marker comments in place with the block emptied makes the generator **replace** them instead of appending, and deleting `CLAUDE.md` entirely makes Nx **recreate** it the moment the detected agent is Claude.

The remaining lever is the agent list — and **narrowing it is the wrong answer, which is the part worth recording.** Nx's per-agent work is not just rules: for Claude it also registers the plugin marketplace and enables the plugin in that harness's settings, and it has already shipped a later migration retiring a superseded MCP entry. Those run only for agents in scope. So dropping an agent to stop one duplicate opts it out of everything Nx adds for it afterwards — and that branch grows, so the cost is unbounded and arrives as **silence**. The duplicate costs a fixed amount and the `tool-stubs` rule reports it on every run.

**That asymmetry is the whole decision: prefer the failure that announces itself.** Run the generator fully, then delete the block and keep its other changes. Detection was not chosen because prevention was unavailable — it is chosen because prevention here means going deaf to future updates, and a loud recurring chore beats a silent permanent gap.

The stub keeps **one line** of instruction, which is deliberately a duplicate of what a SessionStart hook already injects. Hooks are optional infrastructure and only some harnesses have one wired; the line is what remains when none ran, and it is one line precisely so that the hook's better version — which carries a live line count — is the one that normally speaks.

**Revisit if** Nx gains a persistent per-agent opt-out that suppresses only the rules block while leaving the rest of that agent's setup running — that would remove the asymmetry, and the rule becomes a cheap assertion rather than the mechanism. Also revisit if its detection stops dry-running the generator, or if a stub ever needs to carry a rule no other surface can reach, which would mean the invariant, not the stub, is wrong.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the log hand-off dispatches standing mode only

The diagnostic-log editor has two modes, so a later reader meets an obvious question the path files do not answer: if a defect path produces investigation records, who sweeps them? The workflow does not, and does not need to.

Investigation's mark-and-sweep machinery exists because unmarked temporary logs accumulate when **the adder walks away**. An agent on a defect path does not: it adds instrumentation, reads it, fixes, and finishes inside one cycle and one diff, so the mark buys nothing at a removal it is still present for. Superpowers' own defect skill does instruct adding ad-hoc instrumentation at component boundaries before proposing a fix, and the backstop for that already exists and is already wired — the outstanding-changes review judges any diagnostic-log call appearing in the diff, against the mechanism rules those skills own. A sweep step of ours would duplicate a check that runs anyway.

So dispatching `standing` only is not a narrowing of the skill; it is what makes the hand-off owe nothing afterwards. The two design consequences are both recorded where they bind: the mode is named explicitly at the dispatch, and the skill itself now defaults an unstated mode to `standing` rather than inferring one from the surrounding work — that inference, not the absence of a sweep, was the actual failure this entry came from.

**Revisit if** Superpowers' defect skill stops adding instrumentation (the backstop becomes unnecessary), the outstanding-changes review stops judging log calls (it becomes absent), or the workflow ever dispatches investigation mode — then removal becomes ours, and it needs a step rather than an entry.

&nbsp;

[🔝](#superpowers-first-workflow--rationale-)

## Why the diff-review take-back is a Session handoff, not verdict-only

Path A and Path B dispatch `x-code-diff-reviewer` into a subagent so the controller does not load its maps and the whole diff (_Operating rule 5_). The first version of that hand-off took back only the verdict line, the counts, and the report path — enough for the controller to know the cycle's status, and cheap on context.

That truncation hid the finding **titles** from the human sitting in the session. The full report lived in `latest.md`, but the user had to ask for it. The score without the issue list is not enough to decide whether to open a follow-up cycle.

So the take-back is now the skill's **Session handoff**: same verdict marker, counts, blocking titles, non-blocking titles, a **🔧 Fix these?** offer (new cycle + `latest.json`, or `Nothing to fix.`), and path. The heavy load stays in the subagent; only that short block crosses back, and the controller must paste it into the user-visible reply. The offer keeps the reviewer read-only in this cycle while still telling the human that fixes are available on request — the same rule the human report's closing section already states, now visible without opening a file.

**Revisit if** the Session handoff grows large enough to defeat the context reason for dispatching (then split titles from bodies more aggressively, or page them), or if a harness surfaces `latest.md` in the UI automatically so pasting titles becomes redundant.

&nbsp;

[🔙](../../README.md#agents)
