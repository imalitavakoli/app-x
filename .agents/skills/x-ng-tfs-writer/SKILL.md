---
name: x-ng-tfs-writer
description: "WHAT? Generates or updates a functionality's TFS (Technical Functional Specification) — the frontend-oriented technical plan that turns an approved PRD into concrete Nx + Angular library specs (map / data-access / ui / feature / page), their public contracts, and the Functional Requirements (FRs) and Business Rules (BRs) that map to unit tests. WHEN? Asked to create or update a TFS, technical design / frontend architecture / system-requirements document, a functionality's library breakdown, or the FR/BR test blueprint for a feature to be built or changed in the workspace; or after a PRD is ready and the feature needs its technical spec written to docs/x/."
metadata:
  version: "1.0.0"
---

# TFS Writer

## Overview

You are a senior Nx + Angular frontend developer who turns an approved **PRD** into a complete, implementation-ready **TFS** for a **functionality** (a feature composed of several library types). The TFS defines *how the feature is built*: which libs are needed, each lib's public contract (inputs, outputs, methods, rendering rules), and the **Functional Requirements (FRs)** and **Business Rules (BRs)** that become the unit-test blueprint.

- **FR → `describe`**, **BR → `it`** (the unit-test mapping).
- Every FR/BR **back-links the PRD Acceptance Criterion (AC)** it decomposes, so PRD ↔ TFS ↔ tests stay in lockstep.

Output: `docs/x/TFS_{functionality-name}.md`.

## When to use

- A PRD is ready and the feature needs its technical spec.
- Asked to create/update a TFS, technical design, frontend architecture, or library breakdown.
- Asked to write or revise the FR/BR test blueprint for a functionality.

Do not use to write the product spec (that is `x-ng-prd-writer`) or to write the tests/code themselves.

## Prerequisites

**Required input:** the functionality's **PRD** (`docs/x/PRD_{name}.md` or provided as context). If it is missing, STOP and ask — the TFS derives from the PRD; do not invent it.

If the functionality already has a `docs/x/TFS_{name}.md`, read it first and **update** it: preserve existing FR/BR IDs and add new ones — never renumber.

## Inputs & output

- **Reads:** the PRD; `docs/getting-started/library-types-and-their-relationship.md` (classify the functionality); `docs/guidelines/naming-conventions.md` (lib/CSS naming, esp. `#styling`); `docs/guidelines/best-practices.md` (Organizing / Mindset — file structure); `docs/runbooks/dep-update-config-for-a-lib.md` (DEP config) and `docs/runbooks/dep-update-assets-for-a-lib.md` (DEP assets — a `ui` lib's custom icon/image whose path the `feature` reads from DEP config); and the existing TFS if any.
- **Writes:** `docs/x/TFS_{functionality-name}.md`.

## Workflow

Copy this checklist and track it. Keep the `[tfs]` prefix so, if this runs inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [tfs] 1. Analyse — read the template, the PRD, the library-types & naming-conventions docs, and any existing TFS
- [ ] [tfs] 2. Name & classify — derive the technical name; classify the functionality; read the matching example
- [ ] [tfs] 3. Library breakdown — fill only the lib specs this functionality needs (map / data-access / ui / feature / page)
- [ ] [tfs] 4. User Experience & Flows — write the technical journey (data flow → interaction / background / decision flows)
- [ ] [tfs] 5. Validate — run the Review Checklist until all items pass
- [ ] [tfs] 6. Summary — report the saved path, the FR/BR IDs, and open technical questions
```

1. **Analyse** — read [assets/template.md](assets/template.md), the PRD, `docs/getting-started/library-types-and-their-relationship.md`, `docs/guidelines/naming-conventions.md`, and (for `feature` DEP config) `docs/runbooks/dep-update-config-for-a-lib.md`.
2. **Name & classify** — derive the technical name (kebab-case; prefix `ng-` when the feature has logic, e.g. `ng-balance-card`); confirm with the user. Classify the functionality per the library-types doc and read the matching example:
   - **abstract** (map + data-access) → [assets/examples/abstract.md](assets/examples/abstract.md)
   - **visual** / **visual+** (ui + feature [+ page]) → [assets/examples/visual.md](assets/examples/visual.md)
   - **mixed** / **mixed+** (map + data-access + ui + feature [+ page]) → [assets/examples/mixed-plus.md](assets/examples/mixed-plus.md)
3. **Library breakdown** — include **only** the lib specs the classification needs. Follow the template's subsections exactly.
4. **User Experience & Flows** — write the technical journey per the template's restructured format (see Rules).
5. **Validate** — run the Review Checklist below; loop until all pass.
6. **Summary** — see below.

## Template

**Always use [assets/template.md](assets/template.md) exactly** — same sections, same order. Remove the `>` quote-helpers from the final draft; keep every heading you use. Omit whole lib-type specs that the functionality does not use.

## Examples

Read the example matching the functionality's classification before filling the specs and the journey — they show the expected granularity, the FR/BR test-ready syntax, and the journey structure. The three examples cover the five types: `abstract` → `abstract`; `visual` / `visual+` → `visual`; `mixed` / `mixed+` → `mixed-plus`. The `page` spec is demonstrated in `mixed-plus`, so a `visual+` functionality borrows it from there; a plain `mixed` functionality uses `mixed-plus` and omits its `page` spec.

## Rules

**Base classes (default):** `ui` components extend `V1BaseUiComponent`; `feature` components extend `V2BaseFeatureExtComponent`; parent `page` components extend `V2BasePageParentComponent`; child `page` components extend `V2BasePageChildComponent`. Use these unless the user asks to use — or to create — a specialized base derived from them (e.g. a shared `…-ext-{name}` base for `feature` libs that always use one specific `data-access` lib, or for `page` libs that always use one specific `feature` lib as their starter, kept DRY across functionalities). If the user names such a base, extend it instead and note it in the spec.

**FR / BR (the test blueprint):**
- **FR → unit-test `describe`; BR → unit-test `it`.** Write each BR in `Given [Arrange]; When [Act]; Then [Assert]` form, referencing exact `[data-cy="…"]` selectors, input signals, and output emitters — never vague prose ("shows the list").
- **Back-link the PRD:** annotate each FR/BR that implements a PRD scenario with the AC it decomposes, e.g. `(maps to PRD BALANCE-AC-01)`.
- **IDs:** scope IDs to the exported component (or helper service) that owns them: `{NAME}_{COMPONENT}_FR-01` / `{NAME}_{COMPONENT}_BR-01` (e.g. `XPROFILE_CARD_BR-01`), and `{NAME}_{HELPER-NAME}_FR-01a` for a helper service. IDs are unique across the whole TFS (never reset or renumber). New technical scenarios (loading/error/interaction) get **new** unique IDs.

**Inputs / Outputs:**
- Each input's and output's description **IS its JSDoc** in the component — write it as such.
- **Outputs are emitted via handler methods**, not directly in the HTML template — so a unit test can call the handler to assert the emit, instead of rendering the child `ui` component and triggering it through the DOM (which is effectively an e2e test).

**`ui` spec:** rendering rules keyed by `state` (`loading|empty|data|success|failure`) and `dataType` (`all|one|new|edit`); reference the translation keys used for headings/paragraphs/labels; list the exposed **DEP styles** (CSS variables per `naming-conventions.md#styling`: `--e-{class}--{rule}` / `--e-{class}--{rule}--{light,dark}`) with an example; and any **asset inputs** (custom icon/image) with a default path.

**`feature` spec:** list the **DEP config & assets** it reads from the config data-access lib (`$dataConfigDep()?.libs?.{name}V1?.…` for config props named `{libname}_{version}`; `$dataConfigDep()?.assets?.lib_{libname}_{ico,img}_{assetname}` for asset paths) and maps to `ui` inputs, with an example.

**Multi-view vs single-view (how many components a `ui`/`feature` lib exports):** derive it from the PRD's User Experience & Flows. A **multi-view** functionality (needs more than one view/screen/page) exports **more than one** component — one per view — rather than one component that switches views via `dataType`. A **single-view** functionality exports **one** component whose `dataType` is optional with a fixed default that never changes (e.g. a list → `dataType = 'all'`; one entity → `dataType = 'one'`). The developer chooses; suggest the better fit.

**`data-access` spec — style choice:** **entity** object structure **only** for a **pure** CRUD operation; **single-instance** when the lib is initialized once per page; **multi-instance** when initialized multiple times (by the page or several `feature` libs at once). Include this as a quote-note: *if a Post/Put/Patch must send an `extra` payload beyond the entity, it is not pure CRUD — use single- or multi-instance instead of entity.*

**User Experience & Flows (technical journey):**
- Per exported `feature` component (each under its own sub-heading): **Data flow** = *Independent data* (fetched in `_xDataFetch`, awaited via `_xFacadesPre` + `_xFacadesLoadesValidation`) → *Dependency chain* (`_xBuildDependencyChain$`, declaring dependent calls in one place as `switchMap` levels, may span facades — not sequential phases) → *On all ready* (`_xInitOrUpdateAfterAllDataReady`, fires once: set `ui` inputs **and** emit outputs).
- **Background flows** (polling / intervals / pause-resume) are started from `_xInitOrUpdateAfterAllDataReady`, **not** the dependency chain — each in its own `_util/*.service.ts` with a lifecycle (start/tick/stop/pause/resume/destroy).
- **Interaction flows** — one small unit per output (Trigger → Steps → Outcome); non-trivial logic goes in its own `_util/*.service.ts`.
- **Decision logic** — decide how many encapsulated functions a component needs (possibly none): small logic can be a private `_…()` method on the component; larger logic, or logic shared across inner/exported components, belongs in its own `_util/` file of pure functions (with JSDoc + example) or a service.
- Break large `ui`/`feature` libs into multiple files (`_ui/`, `_feature/`, `_util/`) per `docs/guidelines/best-practices.md` (Organizing: "consistent folder/file structure for private internal files in ui/feature libs"; Mindset: "prefer many files with fewer lines"). Each exported component and each helper service owns its FR/BR IDs.

**General:** respect provided granularity (endpoints, params, selectors) verbatim; do not invent facts (unknowns → Open Technical Questions); minimise re-asking; keep the TFS **generic to this functionality** (no cross-references to unrelated pre-built libs unless the PRD/user names them as reuse).

## Validate

**Review Checklist** — before finalising, verify:

- [ ] Classification chosen and only the needed lib specs are included.
- [ ] Every component names its base class correctly (`V1BaseUiComponent` / `V2BaseFeatureExtComponent` / `V2BasePageParentComponent` / `V2BasePageChildComponent`).
- [ ] Every BR is `Given/When/Then` with concrete `[data-cy]` / signals / emitters; every FR/BR that implements the PRD back-links its AC.
- [ ] FR/BR IDs unique across the TFS; helper-service IDs scoped (`{NAME}_{HELPER}_…`); no PRD IDs repurposed; nothing renumbered.
- [ ] Inputs/Outputs written as JSDoc; outputs emitted via handler methods.
- [ ] `ui` DEP styles and `feature` DEP asset/config listed with examples.
- [ ] `data-access` style justified against the decision rule (+ non-pure-CRUD note applied).
- [ ] Journey follows independent → dependency chain → single on-ready; background flows in `_util/*.service.ts`; secondary flows separated.

**Validation Steps (iterative loop):** check every item; if any fails, fix the draft and re-check the whole list; only when all pass, continue to Summary.

## Summary

1. Report the saved path (`docs/x/TFS_{name}.md`).
2. List the FR/BR IDs created/added (ID + one-line description) and note which PRD ACs they cover.
3. If any new libs were recommended as shared functionalities, remind the user each needs its own PRD & TFS.
4. If new technical FR/BR/AC scenarios were discovered that the PRD lacks, list them and suggest updating the PRD.
5. List Open Technical Questions; incorporate requested changes until the user confirms.

## Common mistakes

| Mistake | Fix |
|---|---|
| Vague BRs ("shows the list") | Use `Given/When/Then` with exact `[data-cy]`, signals, emitters. |
| FR/BR not linked to the PRD | Back-link each PRD-implementing FR/BR to its AC. |
| Emitting outputs in the template | Emit via a handler method so unit tests can call it directly. |
| Entity structure for non-pure CRUD | Use single-/multi-instance when a write needs an `extra` payload. |
| Splitting the journey into sequential phases | Declare the whole dependency chain in one place; the ready callback fires once when all data is ready. |
| Polling inside the dependency chain | Start polling in `_xInitOrUpdateAfterAllDataReady`, in a `_util/*.service.ts`. |
| Adding an Analytics section to a lib spec | Analytics live in the PRD, not the TFS. |
| Renumbering IDs on update | Never renumber; add new unique IDs only. |
