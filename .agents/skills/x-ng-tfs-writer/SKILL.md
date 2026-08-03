---
name: x-ng-tfs-writer
description: "WHAT? A functionality's TFS folder at docs/x/{name}/TFS/ — its per-library (map / data-access / ui / feature / page) technical spec, whose Functional Requirements (FRs) and Business Rules (BRs) map to unit tests. WHEN? A functionality's PRD is ready and needs its technical spec; asked to create or update a TFS, technical design, frontend architecture, library breakdown, or FR/BR test blueprint. Not for util, api, or app libs — those are not functionalities."
metadata:
  version: '1.1.0'
---

# TFS Writer

## Overview

You are a senior Nx + Angular frontend developer who turns an approved **PRD** into a complete, implementation-ready **TFS** for a **functionality** (classified as `abstract` / `visual` / `visual+` / `mixed` / `mixed+`; libs from `map` / `data-access` / `ui` / `feature` / `page` only). The TFS defines _how the feature is built_: which libs are needed, each lib's public contract (inputs, outputs, methods, rendering rules), and the **Functional Requirements (FRs)** and **Business Rules (BRs)** that become the unit-test blueprint.

- **FR → `describe`**, **BR → `it`** (the unit-test mapping).
- Every FR/BR **back-links the PRD Acceptance Criterion (AC)** it decomposes, so PRD ↔ TFS ↔ tests stay in lockstep.

Output: a **folder** `docs/x/{functionality-name}/TFS/` — a `README.md` for the functionality-level sections plus **one file per library type** the functionality has:

```
docs/x/{functionality-name}/
├── PRD.md                (the functionality's product spec)
└── TFS/
    ├── README.md         Overview, Existing Dependencies & Reuse, the ID Index, Open Technical Questions
    ├── map.md            (only the lib types this functionality actually has)
    ├── data-access.md
    ├── ui.md
    ├── feature.md        (also holds this feature's technical journey / flows)
    └── page.md
```

`README.md` holds only functionality-level content; each `{libtype}.md` holds that lib's spec **and its FR/BR** (and, for `feature.md`, its technical journey). The README's **ID Index** lists every FR/BR ID, the file it lives in, and the PRD AC it maps to — so IDs stay unique across the whole folder and traceability is visible at a glance.

## When to use

- A functionality's PRD is ready and needs its technical spec.
- Asked to create/update a TFS, technical design, frontend architecture, or library breakdown for a **functionality**.
- Asked to write or revise the FR/BR test blueprint for a functionality.

Do **not** use when the target is only a `util`, `api`, or `app` lib — those are never functionalities (see Prerequisites). Do not use to write the product spec (the PRD) or to write the tests/code themselves.

## Prerequisites

**Gate — functionality only.** Before anything else:

- If the target is (or would be) only a `util`, `api`, or `app` lib → **STOP. Write no TFS.** Say so and exit. No PRD should exist for those either; if someone asks for a TFS anyway, refuse.
- `app` is a final product under `apps/`, not a functionality.
- Classify using `docs/getting-started/library-types-and-their-relationship.md` (Functionality types). Create a `{libtype}.md` only for lib types this functionality **owns**.

**Required input:** the functionality's **PRD** (`docs/x/{name}/PRD.md` or provided as context). If it is missing, STOP and ask — the TFS derives from the PRD; do not invent it.

If the functionality already has a `docs/x/{name}/TFS/` folder, read it first (README + the relevant lib files) and **update** it: preserve existing FR/BR IDs and add new ones — never renumber. Add a lib file only when a newly-needed lib type appears; update the ID Index accordingly.

**First-time for existing libs** — when there is no `docs/x/{name}/TFS/` yet but owned libs already exist: read [references/bootstrap-existing.md](references/bootstrap-existing.md) after the PRD is ready. Still derive from the PRD; use existing libs only to ground contracts and Open Technical Questions — never invent FRs/BRs the PRD does not support.

## Inputs & output

- **Reads:** the PRD; `docs/getting-started/library-types-and-their-relationship.md` (classify the functionality); `docs/guidelines/naming-conventions.md` (lib/CSS naming, esp. `#styling`); `docs/guidelines/best-practices.md` (Organizing / Mindset — file structure); `docs/runbooks/dep-update-config-for-a-lib.md` (DEP config) and `docs/runbooks/dep-update-assets-for-a-lib.md` (DEP assets — a `ui` lib's custom icon/image whose path the `feature` reads from DEP config); and the existing TFS if any.
- **Writes:** the `docs/x/{functionality-name}/TFS/` folder — `README.md` plus one `{libtype}.md` per present lib type.

## Workflow

Copy this checklist and track it. Keep the `[tfs]` prefix so, if this runs inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [tfs] 1. Gate & analyse — confirm it is a functionality; read templates, PRD, library-types & naming-conventions docs, any existing TFS
- [ ] [tfs] 2. Name & classify — confirm the functionality name; classify; read the matching example
- [ ] [tfs] 3. Library breakdown — write one docs/x/{name}/TFS/{libtype}.md per owned lib type (its spec + FR/BR)
- [ ] [tfs] 4. Feature journey — in feature.md (only if owned), add the technical journey
- [ ] [tfs] 5. README — write docs/x/{name}/TFS/README.md (Overview, Existing Deps & Reuse, ID Index, Open Technical Questions)
- [ ] [tfs] 6. Validate — run the Review Checklist until all items pass
- [ ] [tfs] 7. Confirm — put the Open Technical Questions to the user and fold in the answers
- [ ] [tfs] 8. Summary — report the folder path, the FR/BR IDs, and anything still open
```

1. **Gate & analyse** — apply the Prerequisites gate. If it passes, read the templates in [assets/template/](assets/template/) (the `README.md` template + the per-lib templates), the PRD, `docs/getting-started/library-types-and-their-relationship.md`, `docs/guidelines/naming-conventions.md`, and (for `feature` DEP config) `docs/runbooks/dep-update-config-for-a-lib.md`.
2. **Name & classify** — the technical name **is** the functionality name from the PRD / `docs/x/{name}/` (kebab-case; prefix `ng-` when it has logic, e.g. `ng-balance-card`). Confirm with the user if unclear. **Every owned lib inherits that same `{name}`** — e.g. `ng-chart` → `{domain}-map-ng-chart`, `{domain}-data-access-ng-chart`, `{domain}-feature-ng-chart`. Never name an owned lib after a consumer (`ng-dashboard`, `ng-insights`, …).

   Classify per the library-types doc (authoritative) and read the matching example:
   - **abstract** — `data-access` required; `map` only for API/external assets → [assets/examples/abstract/](assets/examples/abstract/)
   - **visual** / **visual+** — `ui` and/or `feature`; `visual+` owns `page` → [assets/examples/visual/](assets/examples/visual/)
   - **mixed** / **mixed+** — owns `data-access`; `mixed` must own `feature` (optional `map`/`ui`); `mixed+` must own `page` + `data-access` (optional `map`/`ui`/`feature`) → [assets/examples/mixed-plus/](assets/examples/mixed-plus/)

   **Consumed-by ≠ owns page:** listed as used on `ng-dashboard` / `ng-insights` → those pages go under **Existing Dependencies & Reuse** as consumers (or stay out of this TFS entirely). Do **not** add `page.md` or rename libs after them unless **this** functionality owns a `page` under its own name.

   Examples show **content and granularity**; they may include optional libs. Emit only the `{libtype}.md` files this classification **owns**. Create `docs/x/{name}/TFS/` (and `docs/x/{name}/` if absent).

3. **Library breakdown** — write **one `docs/x/{name}/TFS/{libtype}.md` per owned lib type** (`map` / `data-access` / `ui` / `feature` / `page` — create only those). Never create `util` / `api` / `app` specs. Each file holds that lib's spec sections **and its FR/BR**, following the template's subsections exactly.
4. **Feature journey** — when the functionality owns a `feature`, add the technical journey in `feature.md` (per exported `feature` component). If there is no `feature.md` (**abstract**, or **ui-only** / **page-only** shapes): skip this step; for **abstract**, put the short facade-consumer note in `data-access.md` instead (see the template).
5. **README** — write `docs/x/{name}/TFS/README.md` with the functionality-level sections (Overview, Existing Dependencies & Reuse, Open Technical Questions) **and the ID Index** — a table of every FR/BR ID → the lib file it lives in → the PRD AC it maps to. State the classification, the **natural entry lib**, and list only **owned** libs as this functionality's own. This is the single place that keeps IDs unique across the folder.
6. **Validate** — run the Review Checklist below; loop until all pass.
7. **Confirm with the user** — see below. Any Open Technical Questions go to the user before finishing.
8. **Summary** — see below.

## Template

The template is a **folder** — [assets/template/](assets/template/) — mirroring the output: one template file per output file. Use the matching template for each file you write, exactly (same sections, same order); remove the `>` quote-helper notes and the top `<!-- … -->` comment from the final draft; keep every heading you use; omit whole lib-type files the functionality does not use.

**Output layout** — `docs/x/{name}/TFS/` (template → output):

| Template file             | Output file      | Holds                                                                                                         |
| ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `template/README.md`      | `README.md`      | Overview, Existing Dependencies & Reuse, the 🧭 ID Index, Open Technical Questions — functionality-level only |
| `template/map.md`         | `map.md`         | owned `map` only (API / external assets)                                                                      |
| `template/data-access.md` | `data-access.md` | owned `data-access` (+ facade-consumer note when there is no `feature.md`)                                    |
| `template/ui.md`          | `ui.md`          | owned `ui` only                                                                                               |
| `template/feature.md`     | `feature.md`     | owned `feature` + the 🧳 User Experience & Flows journey                                                      |
| `template/page.md`        | `page.md`        | owned `page` only (`visual+` / `mixed+`)                                                                      |

IDs are unique **across all files**; register every one in the README's 🧭 ID Index.

## Examples

Read the example matching the functionality's classification before filling the specs and the journey — they show the expected granularity, the FR/BR test-ready syntax, and the journey structure. **Each example is a real folder** (`assets/examples/{type}/`), laid out exactly like a generated `docs/x/{name}/TFS/` — a `README.md` with a populated 🧭 ID Index plus one file per lib type — so it doubles as a layout reference. Read the files in the matching example folder. The three examples cover the five types: `abstract` → `abstract/`; `visual` / `visual+` → `visual/`; `mixed` / `mixed+` → `mixed-plus/`. `page.md` is demonstrated in `mixed-plus/`, so a `visual+` functionality borrows it from there; a plain `mixed` uses `mixed-plus/` and omits `page.md`. Omit optional lib files the example has but this functionality does not own.

## Rules

**Functionality gate.** Never write a TFS for a bare `util` / `api` / `app` lib.

**Name match.** Every owned lib is `{domain}-{type}-{name}` with the **same** `{name}` as the functionality. Consumers keep their own functionality names; list them under Existing Dependencies & Reuse when relevant — never as this TFS's own libs.

**Natural entry lib.** Record it in the README (per the library-types doc): `abstract` → `data-access`; `visual` → `feature` or `ui`; `mixed` → `feature`; `mixed+` → `page`; `visual+` → `feature` when present, else `page`.

**Base classes (default):** each component extends the latest available base class for its lib type (`ui`, `feature`, parent `page`, child `page`). Take the actual base from the matching example rather than a base-class name you already know or assume — the example is kept up to date, so it always reflects the latest base available in the workspace. Use these unless the user asks to use — or to create — a specialized base derived from them (e.g. a shared `…-ext-{name}` base for `feature` libs that always use one specific `data-access` lib, or for `page` libs that always use one specific `feature` lib as their starter, kept DRY across functionalities). If the user names such a base, extend it instead and note it in the spec.

**FR / BR (the test blueprint):**

- **FR → unit-test `describe`; BR → unit-test `it`.** Write each BR in `Given [Arrange]; When [Act]; Then [Assert]` form, referencing exact `[data-cy="…"]` selectors, input signals, and output emitters — never vague prose ("shows the list").
- **One observable behaviour per BR** (one `it`); if it needs an "and", split it. Give edge cases (loading / empty / error / boundary) their own BRs, with complete, realistic data.
- **The `Then` asserts an observable effect, never an internal call.** State what the unit observably produces — a rendered `[data-cy]`, an emitted output, or a resulting state/signal — **not** "a facade/collaborator method was called" (asserting a collaborator call is a unit-test anti-pattern). For data-fetching, prove the request is correct by its **result**: prime the collaborator to return data for the expected params, then assert the data the component exposes — e.g. _Given the user facade returns `U` for `userId = 123`; When data is ready; Then the value bound to the card is `U`_ (this proves it fetched user 123 without asserting the call).
- **Back-link the PRD:** annotate each FR/BR that implements a PRD scenario with the AC it decomposes, e.g. `(maps to PRD BALANCE-AC-01)`.
- **IDs:** scope IDs to the exported component (or helper service) that owns them, same format for both — `{NAME}_{OWNER}_FR-01` / `{NAME}_{OWNER}_BR-01`, where `{OWNER}` is the component (e.g. `XPROFILE_CARD_BR-01`) or the helper service (e.g. `XWALLET_POLL_FR-01`). IDs are unique **across the whole TFS folder** — all lib files share one ID space (never reset per file, never renumber). Record every ID in the README **ID Index** (ID → lib file → PRD AC). New technical scenarios (loading/error/interaction) get **new** unique IDs.

**Inputs / Outputs:**

- Each input's and output's description **IS its JSDoc** in the component — write it as such.
- **Outputs are emitted via handler methods**, not directly in the HTML template — so a unit test can call the handler to assert the emit, instead of rendering the child `ui` component and triggering it through the DOM (which is effectively an e2e test).

**`ui` spec:** rendering rules keyed by `state` (`loading|empty|data|success|failure`) and `dataType` (`all|one|new|edit`); reference the translation keys used for headings/paragraphs/labels; list the exposed **DEP styles** (CSS variables per `naming-conventions.md#styling`: `--e-{class}--{rule}` / `--e-{class}--{rule}--{light,dark}`) with an example; and any **asset inputs** (custom icon/image) with a default path.

**`feature` spec:** list the **DEP config & assets** it reads from the config data-access lib (`$dataConfigDep()?.libs?.{name}V1?.…` for config props named `{libname}_{version}`; `$dataConfigDep()?.assets?.lib_{libname}_{ico,img}_{assetname}` for asset paths) and maps to `ui` inputs, with an example.

**Multi-view vs single-view (how many components a `ui`/`feature` lib exports):** derive it from the PRD's User Experience & Flows. A **multi-view** functionality (needs more than one view/screen/page) exports **more than one** component — one per view — rather than one component that switches views via `dataType`. A **single-view** functionality exports **one** component whose `dataType` is optional with a fixed default that never changes (e.g. a list → `dataType = 'all'`; one entity → `dataType = 'one'`). The developer chooses; suggest the better fit.

**`data-access` spec — style choice:** **entity** object structure **only** for a **pure** CRUD operation; **single-instance** when the lib is initialized once per page; **multi-instance** when initialized multiple times (by the page or several `feature` libs at once). Include this as a quote-note: _if a Post/Put/Patch must send an `extra` payload beyond the entity, it is not pure CRUD — use single- or multi-instance instead of entity._

**User Experience & Flows (technical journey):**

- Per exported `feature` component (each under its own sub-heading): **Data flow** = _Independent data_ (fetched in `_xDataFetch`, awaited via `_xFacadesPre` + `_xFacadesLoadesValidation`) → _Dependency chain_ (`_xBuildDependencyChain$`, declaring dependent calls in one place as `switchMap` levels, may span facades — not sequential phases) → _On all ready_ (`_xInitOrUpdateAfterAllDataReady`, fires once: set `ui` inputs **and** emit outputs).
- **Background flows** (polling / intervals / pause-resume) are started from `_xInitOrUpdateAfterAllDataReady`, **not** the dependency chain — each in its own `_util/*.service.ts` with a lifecycle (start/tick/stop/pause/resume/destroy).
- **Interaction flows** — one small unit per output (Trigger → Steps → Outcome); non-trivial logic goes in its own `_util/*.service.ts`.
- **Decision logic** — decide how many encapsulated functions a component needs (possibly none): small logic can be a private `_…()` method on the component; larger logic, or logic shared across inner/exported components, belongs in its own `_util/` file of pure functions (with JSDoc + example) or a service.
- Break large `ui`/`feature` libs into multiple files (`_ui/`, `_feature/`, `_util/`) per `docs/guidelines/best-practices.md` (Organizing: "consistent folder/file structure for private internal files in ui/feature libs"; Mindset: "prefer many files with fewer lines"). Each exported component and each helper service owns its FR/BR IDs.

**General:** respect provided granularity (endpoints, params, selectors) verbatim; do not invent facts (unknowns → Open Technical Questions); minimise re-asking; keep the TFS **generic to this functionality** (no cross-references to unrelated pre-built libs unless the PRD/user names them as reuse).

## Validate

**Review Checklist** — before finalising, verify:

- [ ] Target is a functionality (not a bare `util` / `api` / `app` lib).
- [ ] Folder layout correct: `docs/x/{name}/TFS/README.md` + one `{libtype}.md` per **owned** lib type only; no lib spec placed in the README, nothing functionality-level placed in a lib file.
- [ ] Every owned lib name uses the same functionality `{name}`; no consumer page absorbed as an owned `page`.
- [ ] README has an **ID Index** listing every FR/BR ID → its lib file → its PRD AC; every ID in the lib files appears there and vice-versa.
- [ ] Classification and natural entry lib match the library-types doc; only the needed lib specs are included (`map`/`ui`/`feature` omitted when not owned).
- [ ] README Non-Goals & Why records the technical alternatives considered and rejected (lib split, `data-access` structure, shared libs not reused) with the reason each lost — this is their only durable home.
- [ ] Every component names its base class correctly — the base its lib type uses in the matching example (not a name hardcoded in this skill).
- [ ] Every BR is `Given/When/Then` with concrete `[data-cy]` / signals / emitters; every FR/BR that implements the PRD back-links its AC.
- [ ] FR/BR IDs unique across the TFS; helper-service IDs scoped (`{NAME}_{HELPER}_…`); no PRD IDs repurposed; nothing renumbered.
- [ ] Inputs/Outputs written as JSDoc; outputs emitted via handler methods.
- [ ] `ui` DEP styles and `feature` DEP asset/config listed with examples.
- [ ] `data-access` style justified against the decision rule (+ non-pure-CRUD note applied).
- [ ] Journey follows independent → dependency chain → single on-ready; background flows in `_util/*.service.ts`; secondary flows separated.

**Validation Steps (iterative loop):** check every item; if any fails, fix the draft and re-check the whole list; only when all pass, continue to Summary.

## Confirm with the user

**The TFS is not finished until this happens.** After the Review Checklist passes and before the Summary: if the draft has any **Open Technical Questions**, put them to the user and fold each answer into the TFS. A question they don't answer stays listed — never guess an answer just to close it, and never let an unanswered question reach the plan as if it were settled.

Then re-run the Review Checklist over whatever changed.

## Summary

1. Report the saved folder (`docs/x/{name}/TFS/`) and list the files written (`README.md` + each `{libtype}.md`).
2. List the FR/BR IDs created/added (ID + one-line description) and note which PRD ACs they cover.
3. If any new libs were recommended as shared functionalities, remind the user each needs its own PRD & TFS.
4. **Promote product-observable gaps to the PRD.** For each FR/BR marked `(new — suggest a PRD AC)` in the ID Index — a **product-observable** scenario the PRD's ACs don't cover (NOT a purely technical loading/error/visibility state, which legitimately stays AC-less as `—`) — ask the user whether it should become a PRD Acceptance Criterion. If they approve, the functionality's PRD (`docs/x/{name}/PRD.md`) must gain that AC as a **separate step** (this skill never edits the PRD itself), after which back-link the FR/BR to the new AC and update the ID Index.
5. List any Open Technical Questions still unanswered after the confirmation step.

## Common mistakes

| Mistake                                                       | Fix                                                                                                                                                                                       |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Writing a TFS for a `util` / `api` / `app` lib                | STOP — not a functionality; no `docs/x/…/TFS`.                                                                                                                                            |
| Adding `page.md` because other pages use this feature         | Consumers import the natural entry lib; own a `page` only when _this_ functionality is the page (`visual+` / `mixed+`).                                                                   |
| Requiring `map.md`/`ui.md` for every mixed                    | Mixed requires `data-access`+`feature`; omit `map`/`ui` when not owned.                                                                                                                   |
| Naming an owned lib after a consumer (`…-ng-dashboard`)       | All owned libs share this functionality's `{name}`.                                                                                                                                       |
| Vague BRs ("shows the list")                                  | Use `Given/When/Then` with exact `[data-cy]`, signals, emitters.                                                                                                                          |
| BR asserting a facade/collaborator call ("`getX` was called") | Assert the observable effect instead — exposed data / state / output; prove a correct request by priming the collaborator to return data for the expected params and checking the result. |
| BR bundling several behaviours ("and")                        | Split into one BR per observable behaviour.                                                                                                                                               |
| FR/BR not linked to the PRD                                   | Back-link each PRD-implementing FR/BR to its AC.                                                                                                                                          |
| Emitting outputs in the template                              | Emit via a handler method so unit tests can call it directly.                                                                                                                             |
| Entity structure for non-pure CRUD                            | Use single-/multi-instance when a write needs an `extra` payload.                                                                                                                         |
| Splitting the journey into sequential phases                  | Declare the whole dependency chain in one place; the ready callback fires once when all data is ready.                                                                                    |
| Polling inside the dependency chain                           | Start polling in `_xInitOrUpdateAfterAllDataReady`, in a `_util/*.service.ts`.                                                                                                            |
| Adding an Analytics section to a lib spec                     | Analytics live in the PRD, not the TFS.                                                                                                                                                   |
| Renumbering IDs on update                                     | Never renumber; add new unique IDs only.                                                                                                                                                  |
| Writing the TFS as one file, or a lib spec into `README.md`   | One `{libtype}.md` per present lib type; `README.md` holds only functionality-level sections + the ID Index.                                                                              |
| Restarting FR/BR numbering in each lib file                   | All lib files share one ID space; keep IDs globally unique and listed in the README ID Index.                                                                                             |
| Finishing with Open Technical Questions unasked               | Put them to the user first. An unanswered question must never reach the plan looking settled.                                                                                             |
