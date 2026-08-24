---
name: x-ng-sp-plan-enricher
description: "WHAT? A just-written Superpowers plan, edited so the workspace's PRD/TSD traceability and test/lib conventions reach context-isolated execution subagents — the plan being their only carrier. WHEN? At Path A Documentation close-out after writing-plans, before the plan-review hard stop / execution; whenever a Superpowers plan for a functionality must make execution follow our workspace conventions."
metadata:
  version: '1.11.0'
---

# SP Plan Enricher

## Overview

This skill runs at **one** point in the Superpowers-First Workflow: **Path A Documentation close-out — after `writing-plans` has produced the plan, before the plan-review hard stop** (and thus before Execution). It **edits the Superpowers plan** (a Superpowers artifact — this is the one `x-…-sp-…` skill that touches one) so the workspace's PRD/TSD and test/lib conventions travel into execution. **This skill does not perform the plan-review hard stop** — that stop is **control flow in `AGENTS.md`** (Path A **Documentation close-out**), not this skill.

Why it exists: in the `subagent-driven-development` path, implementation and test-writing happen in **isolated subagents that never read `AGENTS.md` or any skill** — they see only the plan (its Global Constraints and task descriptions). So every workspace rule an implementer must obey has to be written **into the plan**. This skill is that carrier for functionality-doc conventions.

It **edits documents only** — it builds nothing, scaffolds nothing, and writes no tests.

## When to use

- At Path A **Documentation close-out** after `writing-plans` (see `AGENTS.md` → Superpowers-First Workflow, Path A) — **before** the plan-review hard stop / Execution — **only for a functionality** whose docs are in scope this cycle.
- Whenever a Superpowers plan for a functionality needs the workspace's PRD/TSD traceability + test/lib conventions folded in before the plan-review stop and later execution.

**One functionality per run.** A plan may cover more than one functionality; this skill enriches for **one**, named at step 1. When a cycle documents several, the workflow runs it once per functionality — each run reads its own `docs/x/{name}/` and merges into the plan alongside what earlier runs added.

Do not use to build libs or write tests; do not use for the bug-fix path (that runs in-session, reads `AGENTS.md` directly — no plan carrier needed). Do **not** use when the plan's target is only a `util`, `api`, or `app` lib — those are never functionalities, and Path A's Functionality gate answers **No** for them, which skips the docs-in-scope set. Do **not** use when functionality docs are **out of scope** this cycle (no `docs/x/{name}/` PRD/TSD and none being written) — exit without asking for a PRD.

## Prerequisites

**Prerequisite — functionality only.** Before anything else: if the plan's target is (or would be) only a `util`, `api`, or `app` lib — or a **grab-bag** `ui` / `feature` lib (`CONTEXT.md`) → **STOP. Do not enrich.** None of those ever have PRD/TSD (`docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag). Say so and exit — do **not** ask for a missing PRD.

**Prerequisite — docs out of scope.** If there is no `docs/x/{name}/` PRD/TSD and this cycle is not producing them (the user chose not to document) → **STOP. Do not enrich.** Exit without asking for a PRD (same as util/api/app: no functionality-doc carrier this cycle).

These guard this skill's own contract; the decision about **whether** the workflow reaches this skill at all belongs to Path A's gates in `AGENTS.md`.

**Required inputs — if any is missing, STOP and ask:**

- The **functionality name** this run is for (a plan may cover several; this skill enriches one per run).
- The Superpowers **plan** just written (the file `writing-plans` produced).
- The functionality's **PRD**: `docs/x/{name}/PRD/README.md`.
- The functionality's **TSD folder**: `docs/x/{name}/TSD/` (its `README.md` ID Index + the per-lib files).

If the target is a functionality but the PRD/TSD don't exist **and** docs were supposed to be in scope, the earlier steps were skipped by mistake — stop and ask rather than enriching from nothing.

## Inputs & output

- **Reads:** the plan; `docs/x/{name}/PRD/README.md`; `docs/x/{name}/TSD/` (README ID Index **and its Existing Dependencies & Reuse section** + per-lib files); **for each companion entry, that companion's own source of truth** — another functionality's `docs/x/{its-name}/` (including **its** reuse section, for the one-level chain check) or a `util`/`app`'s own `requirements/`; and `AGENTS.md` — its **Superpowers-First Workflow** section for the planning conventions, and its **Project-Specific Conventions** section for the code conventions an implementer needs (see Workflow step 2).
- **Writes:** the enriched **plan** — its Global Constraints and task edits. Nothing else.

## Which channel carries what

A plan has **two** channels into an implementer, and they are not equally reliable:

| Channel                 | How it reaches the implementer                                                 | Reliability                          |
| ----------------------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| **The task's own text** | extracted by the execution skill's task-brief script and handed over as a file | **Deterministic** — a script does it |
| **Global Constraints**  | the dispatching controller carries them into the dispatch                      | **Discretionary** — prose asks it to |

So: **anything an implementer must obey while building _this_ task goes in the task's text.** Global Constraints carries only what is genuinely cross-task, plus a short restatement for whoever reads the plan whole (interactive execution, and the human reviewing it).

This is not a style preference. A baseline run gave an implementer a task tagged with its FR/BR IDs but no contract — the conventions were in Global Constraints, as they used to be here. It used the IDs as **code comments**, produced one `describe` that was not an FR, made an FR ID a sibling `it`, added two tests that mapped to no requirement at all, and **silently reinterpreted a BR** it found ambiguous instead of reporting it. Every one of those is invisible afterwards: the tests pass, and the titles map to nothing.

**IDs are not self-explaining. A list of IDs without its contract produces decorative IDs.**

## Workflow

Copy this checklist and track it. Keep the `[enrich]` prefix so, inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [enrich] 1. Locate — the one functionality this run is for, the plan, its docs/x/{name}/PRD/README.md and TSD/ folder
- [ ] [enrich] 2. Source the conventions — two sets, from AGENTS.md's Superpowers-First Workflow (planning) + Project-Specific Conventions (code) (re-read if not in context)
- [ ] [enrich] 3. Global Constraints (CROSS-TASK only) — source-doc pointers, test-config, one-line restatements of the test/lib/divergence rules, commit + code-conventions pointers (merge, don't duplicate), plus the conditional ones: DEP JSON pair · companion scope guard · deferred chain
- [ ] [enrich] 4. Task contracts — per test task, all five: exact IDs AS describe/it mapping · no untraced test · spec-example path · this task's lib-example path + data-cy · divergence duty for these IDs
- [ ] [enrich] 5. E2e — carry the verdict decided before planning into the plan; tag the e2e task with its AC IDs
- [ ] [enrich] 6. CODEOWNERS — same-commit step only if the plan creates owned paths, or the plan/user explicitly states a handoff (else skip)
- [ ] [enrich] 7a. Coverage check — every PRD AC and TSD FR/BR this cycle implements has a task covering it
- [ ] [enrich] 7b. Companion check — per [TO-CREATE]/[TO-UPDATE] entry: task exists · ordered first · own source of truth + "no ID of ours" · that source carries the requirement · one level deeper checked (or marked not inspectable)
- [ ] [enrich] 8. Validate — run the Review Checklist until all items pass
```

1. **Locate** — identify the **one** functionality name this run is for; open the plan, `docs/x/{name}/PRD/README.md`, and every file in `docs/x/{name}/TSD/` (the README ID Index is the map of every FR/BR → lib file → PRD AC).
2. **Source the conventions — two sets, not one.** The **test/lib** conventions to inject are exactly the ones the workflow loads before planning. Their authoritative list lives in **`AGENTS.md` → Superpowers-First Workflow, Path A hook A1's `[gated]` band (Before `writing-plans`)** — read them from there if they are not already fresh in your context (e.g. after a compaction). Do **not** hardcode a list of source skills here; defer to that band.

   That band is what the **planner** reasons with, and it is not the same set the **implementer** builds with — treating them as one set is how a convention `AGENTS.md` marks as due before **any** code can be absent from every plan with nothing to notice it. For the second set, read **`AGENTS.md` → Project-Specific Conventions** and carry the pointers it marks as due before writing or changing code. Defer to that section the same way: do not hardcode its contents here.
3. **Enrich Global Constraints** — the **cross-task** rules only (_Which channel carries what_, above), **merged** into the existing block, never duplicating one. **Keep each constraint to one line** — that is the format `writing-plans`' own Global Constraints template prescribes, and this block is re-sent in every dispatch, so length here is multiplied by the task count. Carry paths, not prose. Add, as concise text:
   - **Source-of-truth pointers** — `docs/x/{name}/PRD/README.md` (ACs) and `docs/x/{name}/TSD/` (the README ID Index + the per-lib files); tell implementers to read the matching TSD lib file before coding, and to keep IDs exactly as written.
   - **Unit-test contract (one-line restatement only)** — `describe` ↔ TSD Functional-Requirement (FR) ID, `it` ↔ Business-Rule (BR) ID, exact IDs from the TSD, no untraced test. The **operative** form — this task's actual IDs and the path to the annotated spec example — goes in the task (step 4), because that is the channel a script delivers. This line exists for whoever reads the plan whole; it is not what an implementer relies on.
   - **Test-config pointer** — before writing any spec, read the workspace's root test-runner preset (`jest.preset.js` today) and the files it references under `tools/jest/`. Do **not** re-stub what the preset already handles (native modules, browser globals), and never declare a project-level `transformIgnorePatterns` or `moduleNameMapper` — the runner _replaces_ those arrays rather than merging, silently dropping the preset's. Point at the files; do not paste what they contain, since it changes over time.
   - **E2e contract + this functionality's determination** — the rule (e2e only for a `page` lib, or a `feature` lib that **composes another functionality's `feature`** and whose composition an app page hosts) **and** the explicit yes/no for this functionality (step 5). When e2e applies, add the **resolvable repo-relative paths** to the annotated e2e examples the task needs — spec layout, Page Object, shared commands, fixtures, and the user-story registry format.
   - **Lib-structure rule (one line)** — build each lib to the workspace's canonical lib examples: folder layout, base class, versioned naming, outer + inner README, `data-cy` naming `{lib}-v{n}_{component}_{part}` (the lib's own version, so a v2 lib's selectors read `…-v2_…`; an app-domain lib has no version segment). The **example paths** go per task, for that task's lib type only (step 4) — an implementer reads files but never skills, so an unresolvable pointer is no pointer, and the plan's whole list of lib types is noise in a task that builds one.
   - **Commit-message pointer** — commit messages follow the Git section of `docs/guidelines/naming-conventions.md#git`. (Implementer subagents commit but don't read `AGENTS.md`, so this pointer must live in the plan.) When Global Constraints indicate interactive execution, nobody commits during execution — keep the pointer, but phrase it as guidance for the commit the **user** will make.
   - **Code-conventions pointer** — before writing or changing code, read `docs/guidelines/best-practices.md` **in full** (Mindset · Documenting · Organizing). `AGENTS.md` marks it due before **any** code and says to read it whole, because which of the three binds is not knowable until you are into the work. Implementer subagents never read `AGENTS.md`, so — exactly like the commit pointer above — the plan is the only thing that can carry it. Point at the file; never paste or summarise it.
   - **Requirement-divergence report (one-line restatement only)** — the PRD/TSD are this cycle's source of truth but can be **wrong**: an inaccurate, obsolete or missing AC/FR/BR is **reported by its exact ID with what differs**, never edited, renumbered, replaced or coded around. The **per-task** form, scoped to that task's own IDs, goes in the task (step 4). It must be there: the docs are reconciled **after** execution and this report is the only signal that reaches that step, so an unreported divergence ships as a doc that contradicts the code — and a global-only copy is exactly the one the baseline never received.
   - **Deferred chain (only when the user has deferred one)** — when a nested chain was reported and the user chose to **defer** it, record that decision here in one line: the chain (`{ours} → {companion} → {its companion}`), that it is deliberately **out of this cycle**, and which of this functionality's ACs are at risk (`none directly` when that is the truth). Without this line the decision lives only in a conversation, and a later session handed the plan path — Path A's 🚪 Entry explicitly supports that — would re-derive the chain from scratch or, worse, silently execute against a dependency nobody flagged.
   - **Companion scope guard (only when the plan has companion tasks)** — a task that creates or updates a lib **outside** this functionality is companion work: build exactly the surface the task names. If it turns out to need a **further** lib created or updated, **stop and report it — never expand into that third lib**, and never invent requirements or IDs for it. This is the only protection for `util` / `api` / `app` and **grab-bag** `ui` / `feature` companions, whose nested needs no upfront analysis can see (none of them has a dependency section anywhere).
   - **DEP JSON pair (only when relevant)** — if the TSD and/or plan involves **DEP config and/or DEP assets** for a wired app (feature reads `$dataConfigDep()?.libs…` / `$dataConfigDep()?.assets…`, or tasks touch `DEP_config*.json`): when updating that app's DEP JSON, update **both** `apps/{app-name}/src/assets/DEP_config.json` and `apps/{app-name}/src/assets/DEP_config.development.json` **when the app has both files**. Skip this constraint entirely when the cycle has no DEP config/asset wiring.
4. **Write each task's contract into the task itself** — not just its IDs (_Which channel carries what_, above). For every task that writes/updates tests **for this functionality**, the task text must carry all five of these. An ID list alone is what the baseline failed on.
   1. **Its exact IDs, and what each one becomes** — the FR/BR IDs that task's component(s) own (from this functionality's TSD ID Index / per-lib file), stated as the mapping and not just as a list: each **FR ID is a `describe` title**, each **BR ID is an `it` title**, IDs written exactly as the TSD has them. For an e2e task, the **AC IDs** it covers.
   2. **No untraced test** — every `describe`/`it` in the files this task writes maps to one of the IDs above. If the task genuinely needs a case no requirement covers, that is a **gap to report** (rule 5), never a quietly added test.
   3. **The resolvable repo-relative path to the annotated spec example** for the kind of test this task writes — so the implementer matches its structure (block dividers, `Given/When/Then` + AAA, observable-effect assertions) instead of inventing one.
   4. **The resolvable repo-relative path to the canonical lib example** for **this task's** lib type only — plus the `data-cy` pattern when the task builds components. Per task, not the plan's whole list: the task needs the one example it must imitate.
   5. **The divergence-report obligation, scoped to this task's IDs** — if building this task shows one of _these_ ACs/FRs/BRs is inaccurate or obsolete, report it by its exact ID with what differs, and never edit the docs, renumber, mint a replacement, or code around it. A requirement that reads ambiguously is reported, **not resolved by the implementer** — the baseline silently picked a reading of a BR and wrote a test asserting its own interpretation.

   Also: if a task edits an app's `DEP_config.json` (or the development twin) and the app has both files, ensure that task's Files/steps name **both** paths (annotate only — do not mint a new task).

   **Why per task rather than once globally:** these five are the rules that decide whether the code an implementer writes is traceable, and the task's text is the only channel a script guarantees to deliver. Repeating a path in three tasks costs three lines; losing it costs the traceability the whole PRD/TSD system exists for.

5. **E2e (carry the verdict, never re-decide it)** — the e2e verdict was decided **before** planning, so that the plan itself could contain a fully-specified e2e task. Do not re-derive it here. State it — yes/no plus the one-line why — in Global Constraints and repeat it in the relevant task(s), so a subagent neither invents e2e nor wrongly skips it, and tag the e2e task with the AC IDs it covers. **If e2e applies but the plan has no e2e task, stop and ask** — that is a gap in the plan, and a task minted at this stage would lack the test code and exact paths every plan task must carry.
6. **CODEOWNERS (when relevant)** — if the plan **creates** an owned path (a new app, lib, or shared version-folder) or the plan/user **explicitly** states an ownership handoff (named path + new owner), the create-path (or handoff) task must include a same-commit step pointing at `.agents/skills/x-codeowners-helper/SKILL.md` and `.agents/skills/x-codeowners-helper/scripts/upsert-owner.mjs` — do not paste the rulebook. **Never guess a handoff** from “we're changing this feature” or from file edits under an existing path. If neither condition holds, skip — do not add a standalone CODEOWNERS task.
7. **Coverage check** — `writing-plans` reviews its own coverage against the Superpowers spec, which in this workspace is the thin document; the requirements actually live in the PRD and TSD. So run that check here, against the real ones: walk **this functionality's PRD ACs** and **its TSD ID Index**, and confirm every entry this cycle is meant to implement maps to a task in the plan. **Report any gap and stop and ask** — never mint the missing task yourself, for the same reason a late e2e task can't work: a task added at this stage lacks the file paths and complete code every plan task must carry.

   **Also walk the TSD README's Existing Dependencies & Reuse section.** Each `[TO-CREATE]` / `[TO-UPDATE]` entry is companion work this cycle owes. For each entry, confirm all five:
   1. **A task exists** for it in the plan (missing → report and ask; never mint one).
   2. **It is ordered before** any task that depends on it (`AGENTS.md` → 📌 _Companion work_).
   3. **It is annotated with its own source of truth** — the companion functionality's `docs/x/{its-name}/`, a `util`/`app`'s own `requirements/`, or, for an `api`, none — plus a note that **no ID of this functionality applies to it**. An implementer reads only the plan, so a companion task pointed at our TSD has no legitimate requirements source and will invent or mis-attribute the requirements.
   4. **That source of truth actually carries the requirement** — and what to do when it does not depends on the companion's type:
      - **Another functionality** (`map` / `data-access` / **single-purpose** `ui` / `feature` / `page`): its PRD/TSD must already specify the surface. If they do not, the implementer has nothing to build against and no ID to test with — **report it and ask** whether that functionality's own docs must be written first (its own writers pass; `AGENTS.md` → 📌 _Companion work_ runs the writers once per functionality whose gates answer Yes, which normally covers exactly this). Never mint the requirement or its ID here. If the user chooses to leave that functionality's docs to a later cycle, **say the consequence plainly** in the report and on the task: the companion change will ship with **no FR/BR ID**, so its test cannot be traced to a requirement — the change is either untested or tested under a title that maps to nothing. Deferring is allowed; letting it pass unsaid is not.
      - **`util` / `app` / an item in a grab-bag `ui` / `feature` lib**: a **missing or incomplete `requirements/` is not a blocker and not a question for the user** — by convention that file is created or updated by the same work that writes the lib's unit tests, which mints its `UTIL-…` / `APP-…` IDs there. Annotate the companion task to that effect and give the **resolvable repo-relative paths** for its location rules and shape: `.agents/skills/x-ng-test-unit-helper/references/libs/util.md` (or `app.md`, or `grab-bag.md`) and `.agents/skills/x-ng-test-unit-helper/assets/examples/requirements/`. Do not stop, and do not put our functionality's IDs in it.
      - **`api`**: no requirements doc exists or is expected. Nothing to check, nothing to report.
   5. **Check one level deeper, and no further.** If the companion is a functionality with its own `docs/x/`, read **its** Existing Dependencies & Reuse for markers. A **`util`** companion has no such section anywhere (its `requirements/` records FR/BRs only), and an `api` has no requirements doc at all — so for those the check is **impossible, not clean**. Report them as **not inspectable** rather than folding them into a "no chains found" verdict, and name the companion scope guard as their only protection: a false all-clear over an uninspectable lib is worse than saying nothing, because it turns an unknown into an assurance. Any it carries is a **nested chain** (`{ours} → {companion} → {its companion}`): **report the chain and ask** — do not plan it, do not run any writer for it, and do not treat it as this cycle's work. The user decides whether to widen this cycle, do the deeper work first in its own cycle, or defer. State plainly which of this functionality's ACs the chain puts at risk — and say **"none directly"** when that is the truth, noting any indirect risk (e.g. the owner bundling both changes into one release). A deeper entry often serves that owner's own ACs and touches none of ours; overstating the risk is as unhelpful as missing the chain. Stop at this depth even if the deeper entry looks small: resolving companions recursively can turn one requested feature into several documentation cycles the user never asked for.

8. **Validate** — run the Review Checklist; loop until all pass.

## Rules

- **Carry, don't copy.** Inject _pointers_ to the PRD/TSD and the _concrete IDs_ per task — do not paste whole TSD specs into the plan. The plan references the docs; it is not a second copy of them.
- **Merge, never duplicate.** If the plan already has a Global Constraints section, enrich it in place; do not add a second one.
- **Don't name workspace helper skills.** For the convention _source-set_, defer to `AGENTS.md` — both the sections step 2 names; for depth, point implementers at the source-of-truth docs and the canonical lib examples — not at other skills by name. (Referencing `AGENTS.md` and the `docs/` artifacts is fine; they are the stable reference surface.) A **file path is not a skill reference** — writing the repo-relative path to an example file is required (step 3), because an implementer can open a file but can never invoke a skill. What is forbidden is telling it to _use_ a skill.
- **Edit documents only.** Never scaffold, build, or write tests here — that is execution's job. This skill's whole output is edits to the plan.
- **The plan is the only carrier — and the task is the only reliable half of it.** Anything an implementer must obey but that isn't in the plan will not reach them. Between the two channels, prefer the **task's own text**: a script extracts it, whereas Global Constraints depend on the controller carrying them. If in doubt, put it in the task.
- **Never ship a bare ID list.** An ID reaches a task with the rule that says what it becomes (`describe`/`it`), or it arrives decorative. A baseline implementer given IDs and no contract wrote them as code comments and made an FR a sibling `it`.

## Validate

**Review Checklist** — before finalising, verify:

- [ ] Global Constraints points to `docs/x/{name}/PRD/README.md` and the `TSD/` folder (README ID Index + per-lib files), merged into the existing block (no duplicate).
- [ ] **Every test task carries its full contract in the task text** — its exact IDs stated AS the mapping (`describe`↔FR, `it`↔BR), "no untraced test", the annotated spec-example path, this task's lib-example path (+ `data-cy` when it builds components), and the divergence duty for these IDs. A task listing IDs without the mapping fails this item: that is precisely what produced decorative IDs in the baseline.
- [ ] The test-config pointer is present: read the runner preset + `tools/jest/`, don't re-stub what it covers, never declare a project-level `transformIgnorePatterns` / `moduleNameMapper`.
- [ ] Every test task **for this functionality** names the exact FR/BR IDs its component(s) own; any e2e task of this functionality names its AC IDs. Read each task **as the task-brief script would extract it** — on its own, with no Global Constraints in view. If the task alone is not enough to write a traceable spec, it is not finished.
- [ ] The e2e verdict for THIS functionality is stated explicitly (yes/no + one-line why), consistent between Global Constraints and the tasks, and the e2e task (if any) is tagged with its AC IDs. If e2e applies and the plan has no e2e task, you stopped and asked rather than minting one.
- [ ] Global Constraints carries the cross-task set as one-liners: source-of-truth pointers, test-config, the commit-message pointer (`naming-conventions.md#git`), the code-conventions pointer (`docs/guidelines/best-practices.md`, in full), and one-line restatements of the test/lib/divergence rules — as pointers, never pasted copies.
- [ ] Every example pointer is a **resolvable repo-relative path**, never a description of where the examples live — lib structure, unit spec, and the e2e examples when e2e applies. A path an implementer cannot open is no pointer at all. These live **in the tasks**; a path only in Global Constraints does not satisfy this item.
- [ ] If this cycle wires DEP config/assets: Global Constraints includes the DEP JSON pair rule (both `DEP_config.json` and `DEP_config.development.json` when the app has both); any task that edits those files names both paths when both exist. If no DEP wiring, that constraint is absent.
- [ ] CODEOWNERS steps exist only when the plan creates owned paths or the plan/user explicitly states a handoff; each such step points at `.agents/skills/x-codeowners-helper/SKILL.md` and its script, not a pasted rulebook; no handoff was inferred; no standalone CODEOWNERS task otherwise.
- [ ] No workspace helper skill is named as something to *invoke*; the convention source-set defers to `AGENTS.md` — both sections step 2 names. (A file-path pointer, like the CODEOWNERS item above, is not this — see Rules.)
- [ ] Every PRD AC and TSD FR/BR this cycle implements maps to a task; any gap was reported and asked about, never silently filled.
- [ ] The **requirement-divergence** duty is in every test task, scoped to that task's own IDs — report an inaccurate, obsolete or missing AC/FR/BR by ID with what differs; never edit the docs, renumber, invent a replacement, or code around it; and **report an ambiguous requirement rather than picking a reading**. Global Constraints keeps the one-line restatement. This is the only signal that reaches post-execution reconciliation, and the baseline silently resolved a BR it found ambiguous — so the task-level copy is not optional.
- [ ] Every `[TO-CREATE]` / `[TO-UPDATE]` entry in the TSD's Existing Dependencies & Reuse has a task, ordered before its dependents, annotated with its own source of truth and with "no ID of this functionality applies"; any missing companion task was reported and asked about, never minted.
- [ ] For each companion entry, its own docs were opened and confirmed to carry the requirement the marker asks for. Where a **functionality** companion's docs do not, that was reported and asked about, never filled in here. Where a **`util`/`app`** companion has no (or an incomplete) `requirements/`, the task was annotated that its unit-test work creates it with `UTIL-…`/`APP-…` IDs — with the resolvable example paths — and no question was raised.
- [ ] Each companion that is a functionality with its own `docs/x/` had **its** reuse section checked for markers; any nested chain was reported with the ACs it risks, and neither planned nor documented in this cycle. No check went deeper than that one level.
- [ ] If the plan has companion tasks, Global Constraints carries the companion scope guard (build the named surface; stop and report rather than expanding into a further lib).
- [ ] If the user deferred a nested chain, Global Constraints records it in one line (chain · out of this cycle · ACs at risk) — the decision must survive into a session that only has the plan.
- [ ] Every companion is reported as **checked** or **not inspectable** (`util` / `api`); no "no chains found" verdict covers a lib that has no reuse section to read.
- [ ] Each injected constraint is one line, carrying pointers rather than prose — the block is re-sent in every dispatch.
- [ ] Nothing was built, scaffolded, or tested — only the plan was edited.

**Validation Steps (iterative loop):** check every item; if any fails, fix and re-check the whole list; only when all pass, report.

## Summary

1. Report the plan file enriched, and **which functionality** this run was for.
2. List the tasks you tagged and the FR/BR/AC IDs added to each.
3. State the e2e determination (applies / does not apply, and why).
4. State whether CODEOWNERS steps were added (which paths; create vs explicit handoff) or skipped.
5. State whether the DEP JSON pair constraint was added or skipped (and why).
6. **Report the companion inventory** — every `[TO-CREATE]` / `[TO-UPDATE]` entry, its owning functionality or lib type, and the task covering it, so the user sees how far this cycle actually reaches ("1 functionality + 2 companion libs"). List separately any **nested chain** found at the one level checked, with the ACs it risks and the fact that it is **not** part of this cycle until the user says so. Mark each companion as **checked** (its own reuse section was read) or **not inspectable** (`util` / `api` — no such section exists), so "no chains found" is never read as covering a lib nobody could look inside. If the user deferred a chain, say that the plan now records it.
7. Note any prerequisite gaps you had to stop for (missing PRD/TSD), if applicable.

## Common mistakes

| Mistake                                                           | Fix                                                                                                                                                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enriching a plan for a `util` / `api` / `app` lib                 | STOP — not a functionality; no PRD/TSD to fold in. Path A's Functionality gate answers **No** for those.                                                                        |
| Enriching a plan for a grab-bag `ui` / `feature` lib              | STOP — same reason: no PRD/TSD exists to carry.                                                                                                                                 |
| Asking for a missing PRD when the target is util/api/app          | Exit — do not ask; those never get functionality docs.                                                                                                                          |
| Asking for a PRD when docs are out of scope                       | Exit — no PRD/TSD and none being written; do not enrich and do not ask for docs.                                                                                                |
| Missing PRD when docs were supposed to be in scope                | STOP and ask — earlier steps were likely skipped by mistake.                                                                                                                    |
| Leaving the test convention generic ("map `describe` to an FR")   | Tag each task with the **exact IDs** its component owns, from the TSD ID Index.                                                                                                 |
| Pasting whole TSD specs into the plan                             | Inject pointers + the concrete IDs; the plan carries, it doesn't copy.                                                                                                          |
| Adding a second Global Constraints block                          | Merge into the existing one.                                                                                                                                                    |
| Leaving e2e ambiguous                                             | State the verdict already decided before planning (yes/no + the one-line why) in Global Constraints and in the tasks — carry it, never re-derive it here.                       |
| Minting an e2e task the plan lacks                                | Stop and ask. A task added here can't carry the test code and exact paths a plan task requires — the verdict is decided before planning so `writing-plans` authors it properly. |
| Hardcoding the list of helper skills to read                      | Defer to `AGENTS.md` for the source-set — Path A hook A1's `[gated]` band for planning conventions, Project-Specific Conventions for code conventions; re-read from there if needed. |
| Building or writing tests here                                    | This skill only edits the plan; execution does the building.                                                                                                                    |
| Minting a task for an uncovered AC / FR / BR                      | Report the gap and ask. A task added here lacks the paths and code every plan task must carry.                                                                                  |
| Telling implementers to flag only a **missing** requirement       | An existing one can be **inaccurate** or **obsolete** too — the divergence report must cover all three, or a wrong doc ships unnoticed.                                         |
| Companion task left pointing at this functionality's TSD          | Point it at its **own** source of truth and note that no ID of this functionality applies — otherwise the implementer invents or mis-attributes its requirements.               |
| Companion task ordered after a task that depends on it            | Report it — `AGENTS.md` 📌 _Companion work_ requires companion create/update tasks first.                                                                                       |
| Conventions put only in Global Constraints                        | The task text is the channel a script delivers. Put the per-task contract in the task; leave one-line restatements global.                                                      |
| Task tagged with a bare list of IDs                               | State what each ID becomes (`describe`↔FR, `it`↔BR). An ID without its rule arrives decorative — baseline wrote them as code comments.                                        |
| The plan's whole list of lib examples pasted into every task      | Per task, only that task's lib type. The rest is noise in a task that builds one lib.                                                                                           |
| Divergence duty stated globally only                              | Scope it to each task's own IDs, in the task. It is the only channel out of execution, and a global-only copy is the one that goes missing.                                     |
| Trusting that a task reads well _with_ Global Constraints in view | Re-read each task alone, as the task-brief script extracts it. That is what the implementer actually receives.                                                                  |
| Companion **functionality** whose docs never specify the surface  | Report and ask whether that functionality's docs must be written first. The implementer has nothing to build against; never mint the requirement or its ID here.                |
| Stopping to ask because a `util`/`app` has no `requirements/`     | Not a blocker — its unit-test work creates that registry and mints the `UTIL-…`/`APP-…` IDs. Annotate the task with the example paths and carry on.                             |
| Accepting "their squad will document it later" in silence         | Say the consequence: no FR/BR ID this cycle means the companion change ships untested or untraceable. Deferring is fine; unsaid is not.                                         |
| Following a nested chain and planning the second level            | Check one level, report the chain, stop. Resolving companions recursively silently turns one feature into several documentation cycles.                                         |
| Noticing a companion's own marker and saying nothing              | It is a chain that can block this cycle's ACs — name it and the ACs it risks, so the user can decide.                                                                           |
| Reporting a deferred chain only in conversation                   | Record it in Global Constraints. The plan is the only carrier — a later session given just the plan path would never know.                                                      |
| "No nested chains found" when a companion was a `util`            | A `util`/`api` has no reuse section: report it as **not inspectable**, not as clean. Only the scope guard covers it.                                                            |
| Always adding a CODEOWNERS task                                   | Only when creating owned paths or an explicit handoff; otherwise no CODEOWNERS step at all.                                                                                     |
| Pasting the whole CODEOWNERS rulebook into the plan               | Point at `.agents/skills/x-codeowners-helper/SKILL.md` and its script; that skill owns the rules.                                                                               |
| Inferring a handoff from feature work / file edits                | Handoff only if the plan or user explicitly states path + new owner; otherwise do not change ownership.                                                                         |
| DEP task / constraint only names `DEP_config.json`                | When the wired app has both files, require **both** prod and `DEP_config.development.json`.                                                                                     |
| Always injecting the DEP JSON pair constraint                     | Only when TSD/plan wires DEP config or assets; otherwise omit it.                                                                                                               |
