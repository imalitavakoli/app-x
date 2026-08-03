---
name: x-ng-sp-plan-enricher
description: "WHAT? A just-written Superpowers plan, edited so the workspace's execution mode, PRD/TFS traceability, and test, lib and CODEOWNERS conventions reach context-isolated execution subagents — the plan being their only carrier. WHEN? At the after-`writing-plans`, before-execution hook of the Superpowers-First Workflow; whenever a Superpowers plan for a functionality must make execution follow our workspace conventions."
metadata:
  version: '1.2.0'
---

# SP Plan Enricher

## Overview

This skill runs at **one** point in the Superpowers-First Workflow: **after `writing-plans` produces the plan, before execution.** It **edits the Superpowers plan** (a Superpowers artifact — this is the one `x-…-sp-…` skill that touches one) so the workspace's conventions travel into execution.

Why it exists: in the `subagent-driven-development` path, implementation and test-writing happen in **isolated subagents that never read `AGENTS.md` or any skill** — they see only the plan (its Global Constraints and task descriptions). So every workspace rule an implementer must obey has to be written **into the plan**. This skill is that carrier.

It **edits documents only** — it builds nothing, scaffolds nothing, and writes no tests.

## When to use

- At the **after-`writing-plans`, before-execution** hook of the Superpowers-First Workflow (see `AGENTS.md` → Superpowers-First Workflow, Path A) — **only for a functionality**.
- Whenever a Superpowers plan for a functionality needs the workspace's PRD/TFS traceability + test/lib conventions folded in before execution.

Do not use to build libs or write tests; do not use for the bug-fix path (that runs in-session, reads `AGENTS.md` directly — no plan carrier needed). Do **not** use when the plan's target is only a `util`, `api`, or `app` lib — those are never functionalities and Path A skips this hook for them. Do **not** use when functionality docs are **out of scope** this cycle (no `docs/x/{name}/` PRD/TFS and none being written) — exit without asking for a PRD.

## Prerequisites

**Gate — functionality only.** Before anything else: if the plan's target is (or would be) only a `util`, `api`, or `app` lib → **STOP. Do not enrich.** Those never have PRD/TFS (`docs/getting-started/library-types-and-their-relationship.md` → Functionality types). Say so and exit — do **not** ask for a missing PRD.

**Gate — docs out of scope.** If there is no `docs/x/{name}/` PRD/TFS and this cycle is not producing them (user chose not to document) → **STOP. Do not enrich.** Exit without asking for a PRD (same as util/api/app: no functionality-doc carrier this cycle).

**Required inputs — if any is missing, STOP and ask:**

- The Superpowers **plan** just written (the file `writing-plans` produced).
- The functionality's **PRD**: `docs/x/{name}/PRD.md`.
- The functionality's **TFS folder**: `docs/x/{name}/TFS/` (its `README.md` ID Index + the per-lib files).
- The **execution mode** the user chose for this cycle — `interactive` or `auto`. The workflow asks for it just before this skill runs; if it was not asked, stop and ask (never assume a mode — it decides which execution skill runs and whether the agent commits).

If the target is a functionality but the PRD/TFS don't exist **and** docs were supposed to be in scope, the earlier steps were skipped by mistake — stop and ask rather than enriching from nothing.

## Inputs & output

- **Reads:** the plan; `docs/x/{name}/PRD.md`; `docs/x/{name}/TFS/` (README ID Index + per-lib files); the chosen execution mode; and `AGENTS.md` → Superpowers-First Workflow for the authoritative set of workspace conventions to inject (see Workflow step 2).
- **Writes:** the enriched **plan** — its Global Constraints and task edits. Nothing else.

## Workflow

Copy this checklist and track it. Keep the `[enrich]` prefix so, inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [enrich] 1. Locate — the plan, the functionality's docs/x/{name}/PRD.md and TFS/ folder, and the chosen execution mode
- [ ] [enrich] 2. Source the conventions — from AGENTS.md's Superpowers-First Workflow (re-read if not in context)
- [ ] [enrich] 3. Global Constraints — fold the execution mode + source-doc pointers + the test/lib/CODEOWNERS rules into the plan (merge, don't duplicate)
- [ ] [enrich] 4. Tag tasks — annotate each test task with the exact FR/BR/AC IDs it owns (from the TFS ID Index)
- [ ] [enrich] 5. E2e — carry the verdict decided before planning into the plan; tag the e2e task with its AC IDs
- [ ] [enrich] 6. CODEOWNERS — same-commit step only if the plan creates owned paths, or the plan/user explicitly states a handoff (else skip)
- [ ] [enrich] 7. Coverage check — every PRD AC and TFS FR/BR this cycle implements has a task covering it
- [ ] [enrich] 8. Validate — run the Review Checklist until all items pass
```

1. **Locate** — identify the functionality name; open the plan, `docs/x/{name}/PRD.md`, and every file in `docs/x/{name}/TFS/` (the README ID Index is the map of every FR/BR → lib file → PRD AC). Confirm the chosen execution mode (`interactive` / `auto`) — if it is unknown, stop and ask before editing anything.
2. **Source the conventions** — the workspace test/lib conventions to inject are exactly the ones the workflow loads before planning. Their authoritative list lives in **`AGENTS.md` → Superpowers-First Workflow (the _Before `writing-plans`_ hook)** — read them from there if they are not already fresh in your context (e.g. after a compaction). Do **not** hardcode a list of source skills here; defer to that hook.
3. **Enrich Global Constraints** (**merge** into the existing block — never duplicate an existing one). **Keep each constraint to one line** — that is the format `writing-plans`' own Global Constraints template prescribes, and this block is re-sent verbatim in _every_ implementer dispatch, so length here is multiplied by the task count. Carry paths, not prose. Add, as concise text:
   - **Execution mode** — state it first, since it changes how the rest is executed (`auto` is the workspace recommended default when asking the user; never assume it here):
     - `auto` → _"Execution mode: AUTO. Execute with `subagent-driven-development` as Superpowers defines it (implementer subagent per task, commit per task, task + final reviews)."_
     - `interactive` → _"Execution mode: INTERACTIVE. Execute with `executing-plans` (in-session, no implementer subagents). Work on the feature branch but do NOT commit, push, merge, or open a PR. After each task, stop: summarize the files changed and how to verify them, then wait for the user. The user verifies and decides when to commit."_
   - **Source-of-truth pointers** — `docs/x/{name}/PRD.md` (ACs) and `docs/x/{name}/TFS/` (the README ID Index + the per-lib files); tell implementers to read the matching TFS lib file before coding, and to keep IDs exactly as written.
   - **Unit-test contract** — each `describe` maps a TFS Functional-Requirement (FR) ID; each `it` maps a Business-Rule (BR) ID; use the exact IDs from the TFS. Add the **resolvable repo-relative path** to the workspace's annotated unit-spec example so the implementer matches its structure (block dividers, `Given/When/Then` + AAA, observable-effect assertions) instead of inventing one.
   - **Test-config pointer** — before writing any spec, read the workspace's root test-runner preset (`jest.preset.js` today) and the files it references under `tools/jest/`. Do **not** re-stub what the preset already handles (native modules, browser globals), and never declare a project-level `transformIgnorePatterns` or `moduleNameMapper` — the runner _replaces_ those arrays rather than merging, silently dropping the preset's. Point at the files; do not paste what they contain, since it changes over time.
   - **E2e contract + this functionality's determination** — the rule (e2e only for a `page` lib, or a `feature` lib that initializes another `feature`) **and** the explicit yes/no for this functionality (step 5). When e2e applies, add the **resolvable repo-relative paths** to the annotated e2e examples the task needs — spec layout, Page Object, shared commands, fixtures, and the user-story registry format.
   - **Lib-structure pointer** — build each lib to the workspace's canonical lib examples (folder layout, base class, versioned naming, outer + inner README, `data-cy` naming `{lib}-v1_{component}_{part}`). **Write the resolvable repo-relative path** to the example for each lib type the plan touches — an implementer subagent reads files, never skills, so a pointer it cannot resolve is no pointer at all. Give the path; do not copy the example in.
   - **Commit-message pointer** — commit messages follow the Git section of `docs/guidelines/naming-conventions.md#git`. (Implementer subagents commit but don't read `AGENTS.md`, so this pointer must live in the plan.) In `interactive` mode nobody commits during execution — keep the pointer, but phrase it as guidance for the commit the **user** will make.
   - **CODEOWNERS pointer** — when this plan **creates** an app/lib/version-folder, or when the **plan or user explicitly states** an ownership handoff (named path + new owner), update root `CODEOWNERS` in the **same commit**, following the rules at the top of that file. Do **not** infer a handoff from ordinary feature work or from editing files under an existing path. Point to `CODEOWNERS`; do not paste its rules. In `interactive` mode, "same commit" means the user's commit — the `CODEOWNERS` edit must be made and left staged/uncommitted alongside the task's other changes, never deferred.
4. **Tag each task** — for every task that writes/updates tests, list the **exact FR/BR IDs** that task's component(s) own (read them from the TFS ID Index / the per-lib file), and for any e2e task the **AC IDs** it covers. A test convention is useless to a subagent unless the task says _which_ IDs belong to it.
5. **E2e (carry the verdict, never re-decide it)** — the e2e verdict was decided **before** planning, so that the plan itself could contain a fully-specified e2e task. Do not re-derive it here. State it — yes/no plus the one-line why — in Global Constraints and repeat it in the relevant task(s), so a subagent neither invents e2e nor wrongly skips it, and tag the e2e task with the AC IDs it covers. **If e2e applies but the plan has no e2e task, stop and ask** — that is a gap in the plan, and a task minted at this stage would lack the test code and exact paths every plan task must carry.
6. **CODEOWNERS (when relevant)** — add a same-commit `CODEOWNERS` update step only when:
   - the plan **creates** a new app, lib, or shared version-folder, **or**
   - the **plan text or the user explicitly states** an ownership handoff (path + new owner).
     For each matching case, add a step (or annotate the existing Commit step) naming the path(s) and pointing at the rules at the top of root `CODEOWNERS`. In `interactive` mode there is no Commit step — attach it to the task that creates the path instead, so the edit lands with that task's changes. **Never guess a handoff** from “we're changing this feature” or from file edits under an existing path. If neither condition holds, skip — do not add a standalone CODEOWNERS task.
7. **Coverage check** — `writing-plans` reviews its own coverage against the Superpowers spec, which in this workspace is the thin document; the requirements actually live in the PRD and TFS. So run that check here, against the real ones: walk the **PRD ACs** and the **TFS ID Index**, and confirm every entry this cycle is meant to implement maps to a task in the plan. **Report any gap and stop and ask** — never mint the missing task yourself, for the same reason a late e2e task can't work: a task added at this stage lacks the file paths and complete code every plan task must carry.
8. **Validate** — run the Review Checklist; loop until all pass.

## Rules

- **Carry, don't copy.** Inject _pointers_ to the PRD/TFS and the _concrete IDs_ per task — do not paste whole TFS specs into the plan. The plan references the docs; it is not a second copy of them.
- **Merge, never duplicate.** If the plan already has a Global Constraints section, enrich it in place; do not add a second one.
- **Don't name workspace helper skills.** For the convention _source-set_, defer to `AGENTS.md`'s hook (step 2); for depth, point implementers at the source-of-truth docs and the canonical lib examples — not at other skills by name. (Referencing `AGENTS.md` and the `docs/` artifacts is fine; they are the stable reference surface.) A **file path is not a skill reference** — writing the repo-relative path to an example file is required (step 3), because an implementer can open a file but can never invoke a skill. What is forbidden is telling it to _use_ a skill.
- **Edit documents only.** Never scaffold, build, or write tests here — that is execution's job. This skill's whole output is edits to the plan.
- **The plan is the only carrier.** Anything an implementer must obey but that isn't already in the plan will not reach them — if in doubt, it belongs in Global Constraints or a task.
- **Record the mode, never choose it.** The execution mode is the user's call, asked by the workflow before this skill runs. Write down what was chosen; if you don't know it, stop and ask. Do not default to one, and do not switch modes mid-plan.

## Validate

**Review Checklist** — before finalising, verify:

- [ ] The execution mode (`interactive` / `auto`) is stated in Global Constraints, naming the execution skill it implies and — for `interactive` — the no-commit/stop-after-each-task contract.
- [ ] Global Constraints points to `docs/x/{name}/PRD.md` and the `TFS/` folder (README ID Index + per-lib files), merged into the existing block (no duplicate).
- [ ] The unit-test contract (`describe`↔FR, `it`↔BR, exact IDs) is present.
- [ ] The test-config pointer is present: read the runner preset + `tools/jest/`, don't re-stub what it covers, never declare a project-level `transformIgnorePatterns` / `moduleNameMapper`.
- [ ] Every test task is tagged with the exact FR/BR IDs its component(s) own; any e2e task is tagged with its AC IDs.
- [ ] The e2e verdict for THIS functionality is stated explicitly (yes/no + one-line why), consistent between Global Constraints and the tasks, and the e2e task (if any) is tagged with its AC IDs. If e2e applies and the plan has no e2e task, you stopped and asked rather than minting one.
- [ ] The lib-structure convention, the commit-message pointer (`naming-conventions.md#git`), and the CODEOWNERS pointer are present as pointers (not pasted copies).
- [ ] Every example pointer is a **resolvable repo-relative path**, never a description of where the examples live — lib structure, unit spec, and the e2e examples when e2e applies. A path an implementer cannot open is no pointer at all.
- [ ] CODEOWNERS steps exist only when the plan creates owned paths or the plan/user explicitly states a handoff; no handoff was inferred; no standalone CODEOWNERS task otherwise.
- [ ] No workspace helper skill is named; the convention source-set defers to `AGENTS.md`'s hook.
- [ ] Every PRD AC and TFS FR/BR this cycle implements maps to a task; any gap was reported and asked about, never silently filled.
- [ ] Each injected constraint is one line, carrying pointers rather than prose — the block is re-sent in every dispatch.
- [ ] Nothing was built, scaffolded, or tested — only the plan was edited.

**Validation Steps (iterative loop):** check every item; if any fails, fix and re-check the whole list; only when all pass, report.

## Summary

1. Report the plan file enriched and the execution mode recorded.
2. List the tasks you tagged and the FR/BR/AC IDs added to each.
3. State the e2e determination (applies / does not apply, and why).
4. State whether CODEOWNERS steps were added (which paths; create vs explicit handoff) or skipped.
5. Note any prerequisite gaps you had to stop for (missing PRD/TFS), if applicable.

## Common mistakes

| Mistake                                                         | Fix                                                                                                                                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enriching a plan for a `util` / `api` / `app` lib               | STOP — not a functionality; no PRD/TFS to fold in. Path A skips this hook for those.                                                                                            |
| Asking for a missing PRD when the target is util/api/app        | Exit — do not ask; those never get functionality docs.                                                                                                                          |
| Asking for a PRD when docs are out of scope                     | Exit — no PRD/TFS and none being written; do not enrich and do not ask for docs.                                                                                                |
| Missing PRD when docs were supposed to be in scope              | STOP and ask — earlier steps were likely skipped by mistake.                                                                                                                    |
| Leaving the test convention generic ("map `describe` to an FR") | Tag each task with the **exact IDs** its component owns, from the TFS ID Index.                                                                                                 |
| Pasting whole TFS specs into the plan                           | Inject pointers + the concrete IDs; the plan carries, it doesn't copy.                                                                                                          |
| Adding a second Global Constraints block                        | Merge into the existing one.                                                                                                                                                    |
| Leaving e2e ambiguous                                           | Decide explicitly (page lib / feature-initializes-feature → yes; else no) and state it in the plan.                                                                             |
| Minting an e2e task the plan lacks                              | Stop and ask. A task added here can't carry the test code and exact paths a plan task requires — the verdict is decided before planning so `writing-plans` authors it properly. |
| Hardcoding the list of helper skills to read                    | Defer to `AGENTS.md`'s _Before `writing-plans`_ hook for the source-set; re-read from there if needed.                                                                          |
| Building or writing tests here                                  | This skill only edits the plan; execution does the building.                                                                                                                    |
| Minting a task for an uncovered AC / FR / BR                    | Report the gap and ask. A task added here lacks the paths and code every plan task must carry.                                                                                  |
| Always adding a CODEOWNERS task                                 | Only when creating owned paths or an explicit handoff; otherwise the Global Constraints pointer is enough.                                                                      |
| Pasting the whole CODEOWNERS rulebook into the plan             | Point at root `CODEOWNERS`; that file owns the rules.                                                                                                                           |
| Inferring a handoff from feature work / file edits              | Handoff only if the plan or user explicitly states path + new owner; otherwise do not change ownership.                                                                         |
| Picking the execution mode yourself (or assuming `auto`)        | The user chooses it before this skill runs; if unknown, stop and ask.                                                                                                           |
| Recording the mode only in chat, not in the plan                | The plan is the carrier — an unrecorded mode is lost to a compaction or a fresh session.                                                                                        |
