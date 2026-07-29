---
name: x-ng-sp-plan-enricher
description: "WHAT? Edits a just-written Superpowers implementation plan (and its spec) so the workspace's PRD/TFS traceability, unit/e2e test, and lib conventions are carried INTO the plan — the only channel that reaches context-isolated execution subagents. Folds the rules into the plan's Global Constraints, tags each test task with the exact FR/BR/AC IDs it owns, and adds a spec signpost to the functionality's docs. WHEN? At the after-`writing-plans`, before-execution hook of the Superpowers-First Workflow; whenever a Superpowers plan for a functionality must make execution subagents follow our workspace conventions."
metadata:
  version: '1.0.0'
---

# SP Plan Enricher

## Overview

This skill runs at **one** point in the Superpowers-First Workflow: **after `writing-plans` produces the plan, before execution.** It **edits the Superpowers plan** (a Superpowers artifact — this is the one `x-…-sp-…` skill that touches one) so the workspace's conventions travel into execution.

Why it exists: in the `subagent-driven-development` path, implementation and test-writing happen in **isolated subagents that never read `AGENTS.md` or any skill** — they see only the plan (its Global Constraints and task descriptions). So every workspace rule an implementer must obey has to be written **into the plan**. This skill is that carrier.

It **edits documents only** — it builds nothing, scaffolds nothing, and writes no tests.

## When to use

- At the **after-`writing-plans`, before-execution** hook of the Superpowers-First Workflow (see `AGENTS.md` → Superpowers-First Workflow, Hook table A).
- Whenever a Superpowers plan for a functionality needs the workspace's PRD/TFS traceability + test/lib conventions folded in before execution.

Do not use to build libs or write tests; do not use for the bug-fix path (that runs in-session, reads `AGENTS.md` directly — no plan carrier needed).

## Prerequisites

**Required inputs — if any is missing, STOP and ask:**

- The Superpowers **plan** just written (the file `writing-plans` produced).
- The functionality's **PRD**: `docs/x/{name}/PRD.md`.
- The functionality's **TFS folder**: `docs/x/{name}/TFS/` (its `README.md` ID Index + the per-lib files).

If the PRD/TFS don't exist, the earlier hook steps were skipped — stop and ask rather than enriching from nothing.

## Inputs & output

- **Reads:** the plan; `docs/x/{name}/PRD.md`; `docs/x/{name}/TFS/` (README ID Index + per-lib files); and `AGENTS.md` → Superpowers-First Workflow for the authoritative set of workspace conventions to inject (see Workflow step 2).
- **Writes:** the enriched **plan** (its Global Constraints + task edits) and a one-line **signpost** in the Superpowers spec.

## Workflow

Copy this checklist and track it. Keep the `[enrich]` prefix so, inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [enrich] 1. Locate — the plan, the functionality's docs/x/{name}/PRD.md and TFS/ folder
- [ ] [enrich] 2. Source the conventions — from AGENTS.md's Superpowers-First Workflow (re-read if not in context)
- [ ] [enrich] 3. Global Constraints — fold source-doc pointers + the test/lib rules into the plan (merge, don't duplicate)
- [ ] [enrich] 4. Tag tasks — annotate each test task with the exact FR/BR/AC IDs it owns (from the TFS ID Index)
- [ ] [enrich] 5. E2e determination — decide + state explicitly whether e2e applies to this functionality
- [ ] [enrich] 6. Spec signpost — add the one-line banner to the Superpowers spec pointing to the PRD/TFS
- [ ] [enrich] 7. Validate — run the Review Checklist until all items pass
```

1. **Locate** — identify the functionality name; open the plan, `docs/x/{name}/PRD.md`, and every file in `docs/x/{name}/TFS/` (the README ID Index is the map of every FR/BR → lib file → PRD AC).
2. **Source the conventions** — the workspace test/lib conventions to inject are exactly the ones the workflow loads before planning. Their authoritative list lives in **`AGENTS.md` → Superpowers-First Workflow (the *Before `writing-plans`* hook)** — read them from there if they are not already fresh in your context (e.g. after a compaction). Do **not** hardcode a list of source skills here; defer to that hook.
3. **Enrich Global Constraints** (**merge** into the existing block — never duplicate an existing one). Add, as concise text:
   - **Source-of-truth pointers** — `docs/x/{name}/PRD.md` (ACs) and `docs/x/{name}/TFS/` (the README ID Index + the per-lib files); tell implementers to read the matching TFS lib file before coding, and to keep IDs exactly as written.
   - **Unit-test contract** — each `describe` maps a TFS Functional-Requirement (FR) ID; each `it` maps a Business-Rule (BR) ID; use the exact IDs from the TFS.
   - **E2e contract + this functionality's determination** — the rule (e2e only for a `page` lib, or a `feature` lib that initializes another `feature`) **and** the explicit yes/no for this functionality (step 5).
   - **Lib-structure pointer** — build each lib to the workspace's canonical lib examples (folder layout, base class, versioned naming, outer + inner README, `data-cy` naming `{lib}-v1_{component}_{part}`). Point to that reference; do not copy it in.
4. **Tag each task** — for every task that writes/updates tests, list the **exact FR/BR IDs** that task's component(s) own (read them from the TFS ID Index / the per-lib file), and for any e2e task the **AC IDs** it covers. A test convention is useless to a subagent unless the task says *which* IDs belong to it.
5. **E2e determination (explicit)** — decide from the TFS classification + PRD whether e2e applies: **yes** only if there is a `page` lib, or a `feature` that initializes another `feature`, AND the PRD ACs describe user-observable cases; otherwise **no**. State the decision (and a one-line why) in Global Constraints and repeat it in the relevant task(s) — so a subagent neither invents e2e nor wrongly skips it. **If e2e applies but the plan has no e2e task**, add one (targeting the composing e2e app) and tag it with the AC IDs it covers — the vanilla plan won't contain it, because Superpowers has no e2e concept.
6. **Spec signpost** — prepend a one-line banner to the Superpowers spec: _"Product & technical specs for this functionality live in `docs/x/{name}/PRD.md` and `docs/x/{name}/TFS/` — read those for FRs/BRs/ACs."_ (Cosmetic but it guides future readers of the committed spec.)
7. **Validate** — run the Review Checklist; loop until all pass.

## Rules

- **Carry, don't copy.** Inject *pointers* to the PRD/TFS and the *concrete IDs* per task — do not paste whole TFS specs into the plan. The plan references the docs; it is not a second copy of them.
- **Merge, never duplicate.** If the plan already has a Global Constraints section, enrich it in place; do not add a second one.
- **Don't name workspace helper skills.** For the convention *source-set*, defer to `AGENTS.md`'s hook (step 2); for depth, point implementers at the source-of-truth docs and the canonical lib examples — not at other skills by name. (Referencing `AGENTS.md` and the `docs/` artifacts is fine; they are the stable reference surface.)
- **Edit documents only.** Never scaffold, build, or write tests here — that is execution's job. This skill's whole output is plan + spec edits.
- **The plan is the only carrier.** Anything an implementer must obey but that isn't already in the plan will not reach them — if in doubt, it belongs in Global Constraints or a task.

## Validate

**Review Checklist** — before finalising, verify:

- [ ] Global Constraints points to `docs/x/{name}/PRD.md` and the `TFS/` folder (README ID Index + per-lib files), merged into the existing block (no duplicate).
- [ ] The unit-test contract (`describe`↔FR, `it`↔BR, exact IDs) is present.
- [ ] Every test task is tagged with the exact FR/BR IDs its component(s) own; any e2e task is tagged with its AC IDs.
- [ ] The e2e determination for THIS functionality is stated explicitly (yes/no + one-line why), consistent between Global Constraints and the tasks. If e2e applies and the plan lacked an e2e task, one was added (in the composing e2e app) and tagged with its AC IDs.
- [ ] The lib-structure convention is present as a pointer (not a pasted copy).
- [ ] No workspace helper skill is named; the convention source-set defers to `AGENTS.md`'s hook.
- [ ] The Superpowers spec has the one-line PRD/TFS signpost.
- [ ] Nothing was built, scaffolded, or tested — only the plan and spec were edited.

**Validation Steps (iterative loop):** check every item; if any fails, fix and re-check the whole list; only when all pass, report.

## Summary

1. Report the plan file enriched and the spec file signposted.
2. List the tasks you tagged and the FR/BR/AC IDs added to each.
3. State the e2e determination (applies / does not apply, and why).
4. Note any prerequisite gaps you had to stop for (missing PRD/TFS), if applicable.

## Common mistakes

| Mistake                                                        | Fix                                                                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Leaving the test convention generic ("map `describe` to an FR")| Tag each task with the **exact IDs** its component owns, from the TFS ID Index.                            |
| Pasting whole TFS specs into the plan                          | Inject pointers + the concrete IDs; the plan carries, it doesn't copy.                                    |
| Adding a second Global Constraints block                       | Merge into the existing one.                                                                              |
| Leaving e2e ambiguous                                          | Decide explicitly (page lib / feature-initializes-feature → yes; else no) and state it in the plan.       |
| E2e applies but the plan has no e2e task                       | Add one (in the composing e2e app), tagged with its AC IDs — the vanilla plan won't include it.           |
| Hardcoding the list of helper skills to read                  | Defer to `AGENTS.md`'s *Before `writing-plans`* hook for the source-set; re-read from there if needed.    |
| Building or writing tests here                                 | This skill only edits the plan + spec; execution does the building.                                       |
| Forgetting the spec signpost                                   | Prepend the one-line PRD/TFS banner to the Superpowers spec.                                              |
