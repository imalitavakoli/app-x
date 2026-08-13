---
name: x-ng-tfs-writer
description: "WHAT? A functionality's TFS folder at docs/x/{name}/TFS/ — its per-library (map / data-access / ui / feature / page) technical spec, whose Functional Requirements (FRs) and Business Rules (BRs) map to unit tests. WHEN? A functionality's PRD is ready and needs its technical spec; asked to create or update a TFS, technical design, frontend architecture, library breakdown, or FR/BR test blueprint. Not for util, api, or app libs, nor for grab-bag ui/feature libs — those are not functionalities."
metadata:
  version: '2.0.2'
---

# TFS Writer

## Overview

You are a senior Nx + Angular frontend developer who turns an approved **PRD** into a complete, implementation-ready **TFS** for a **functionality** (classified as `abstract` / `visual` / `visual+` / `mixed` / `mixed+`; libs from `map` / `data-access` / **single-purpose** `ui` / `feature` / `page` only). The TFS defines _how the feature is built_: which libs are needed, each lib's public contract (inputs, outputs, methods, rendering rules), and the **Functional Requirements (FRs)** and **Business Rules (BRs)** that become the unit-test blueprint.

- **FR → `describe`**, **BR → `it`** (the unit-test mapping).
- Every FR/BR **back-links the PRD Acceptance Criterion (AC)** it decomposes, so PRD ↔ TFS ↔ tests stay in lockstep.

Output: a **folder** `docs/x/{functionality-name}/TFS/` — a `README.md` for the functionality-level sections plus **one file per library type, per live version** the functionality has:

```
docs/x/{functionality-name}/
├── PRD/                  (the functionality's product spec — not this skill's)
│   ├── README.md
│   └── DECISIONS.md
└── TFS/
    ├── README.md         Overview, Existing Dependencies & Reuse, the ID Index, Open Technical Questions
    ├── DECISIONS.md      retired FR/BRs · rejected technical approaches · reversed decisions
    ├── map-v1.md         (only the lib types this functionality actually has;
    ├── data-access-v2.md      one file per LIVE version of each — a shared lib
    ├── ui-v1.md               is versioned, so the version is in the filename;
    ├── ui-v2.md               an app-domain lib is unversioned: plain `ui.md`)
    ├── feature-v1.md     (also holds this feature's technical journey / flows)
    └── page-v1.md
```

`README.md` holds only functionality-level content; each `{libtype}-v{n}.md` holds that lib version's spec **and its FR/BR** (and, for `feature-v{n}.md`, its technical journey). The README's **ID Index** lists every FR/BR ID, the file it lives in, and the PRD AC it maps to — so IDs stay unique across the whole folder and traceability is visible at a glance.

**`DECISIONS.md` holds only history** — retired FR/BRs, rejected technical options, reversed decisions. Nothing in it is live: **no ID there appears in the ID Index**, and none of it is ever tested. That separation is what keeps the Index a truthful answer to "what is covered?" while the numbers of retired entries stay burned and traceable.

## When to use

- A functionality's PRD is ready and needs its technical spec.
- Asked to create/update a TFS, technical design, frontend architecture, or library breakdown for a **functionality**.
- Asked to write or revise the FR/BR test blueprint for a functionality.

Do **not** use when the target is only a `util`, `api`, or `app` lib — those are never functionalities (see Prerequisites). Do not use to write the product spec (the PRD) or to write the tests/code themselves.

## Prerequisites

**Gate — functionality only.** Before anything else:

- If the target is (or would be) only a `util`, `api`, or `app` lib → **STOP. Write no TFS.** Say so and exit. No PRD should exist for those either; if someone asks for a TFS anyway, refuse.
- If it is a **grab-bag** `ui` / `feature` lib → **STOP. Write no TFS.** A grab-bag holds several unrelated items sharing only a technical kind, each versioned on its own (`src/lib/toggle-me-v1/`) — e.g. `shared-ui-ng-directives`. Its requirements live in a `requirements/` beside each item's inner version README. **Adding an item to a grab-bag never creates a functionality.** Definition and the test: `docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag.
- `app` is a final product under `apps/`, not a functionality.
- Classify using `docs/getting-started/library-types-and-their-relationship.md` (Functionality types). Create a `{libtype}-v{n}.md` only for lib types this functionality **owns**, one per live version.

**Required input:** the functionality's **PRD** (`docs/x/{name}/PRD/README.md` or provided as context). If it is missing, STOP and ask — the TFS derives from the PRD; do not invent it.

If the functionality already has a `docs/x/{name}/TFS/` folder, read it first (README + the relevant lib files) and **update** it: preserve existing FR/BR IDs and add new ones — never renumber. **If anything already in it is no longer true** — an FR/BR whose expectation changed, or whose behaviour no longer exists — that is an **amend** or a **retire**, not an add: read [references/amend-and-retire.md](references/amend-and-retire.md) before touching it, because both reverse an approved decision and neither may be done silently. Add a lib file only when a newly-needed lib type appears; update the ID Index accordingly. If its **Existing Dependencies & Reuse** carries any `[TO-CREATE]` / `[TO-UPDATE]` marker, re-verify each one against the workspace and clear those whose work has landed — see [references/reuse-boundary.md](references/reuse-boundary.md).

**First-time for existing libs** — when there is no `docs/x/{name}/TFS/` yet but owned libs already exist: read [references/bootstrap-existing.md](references/bootstrap-existing.md) after the PRD is ready. Still derive from the PRD; use existing libs only to ground contracts and Open Technical Questions — never invent FRs/BRs the PRD does not support.

## Inputs & output

- **Reads:** the PRD; `docs/getting-started/library-types-and-their-relationship.md` (classify the functionality); `docs/guidelines/naming-conventions.md` (lib/CSS naming, esp. `#styling`); `docs/guidelines/best-practices.md` (Organizing / Mindset — file structure); `docs/runbooks/dep-update-config-for-a-lib.md` (DEP config) and `docs/runbooks/dep-update-assets-for-a-lib.md` (DEP assets — a `ui` lib's custom icon/image whose path the `feature` reads from DEP config); and the existing TFS if any.
- **Writes:** the `docs/x/{functionality-name}/TFS/` folder — `README.md`, one `{libtype}-v{n}.md` per **owned** lib type per live version, and `DECISIONS.md` whenever an FR/BR is retired or a technical option is rejected.

## Workflow

Copy this checklist and track it. Keep the `[tfs]` prefix so, if this runs inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [tfs] 1. Gate & analyse — confirm it is a functionality; read templates, PRD, library-types & naming-conventions docs, any existing TFS
- [ ] [tfs] 2. Name & classify — confirm the functionality name; classify; read the matching example; sort the reuse and mark it (clear any stale markers when updating)
- [ ] [tfs] 3. Library breakdown — write one docs/x/{name}/TFS/{libtype}-v{n}.md per owned lib type per live version (spec + FR/BR)
- [ ] [tfs] 4. Feature journey — in feature-v{n}.md (only if owned), add the technical journey
- [ ] [tfs] 5. README — write docs/x/{name}/TFS/README.md (Overview, Existing Deps & Reuse, ID Index, Open Technical Questions); write DECISIONS.md if anything was retired or rejected
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

   **Consumed-by ≠ owns page:** listed as used on `ng-dashboard` / `ng-insights` → those pages go under **Existing Dependencies & Reuse** as consumers (or stay out of this TFS entirely). Do **not** add `page-v{n}.md` or rename libs after them unless **this** functionality owns a `page` under its own name.

   Examples show **content and granularity**; they may include optional libs. Emit only the `{libtype}-v{n}.md` files this classification **owns**. Create `docs/x/{name}/TFS/` (and `docs/x/{name}/` if absent).

   **Sort the reuse now, before writing any lib spec** — list every lib this functionality reuses and mark each by its state for this cycle: unmarked (exists, used as-is), `[TO-CREATE]` (does not exist yet), `[TO-UPDATE]` (exists but must gain something for us). Doing this before step 3 keeps a reused lib from drifting into an owned lib's spec. **When updating an existing TFS, re-verify the markers already there and clear the ones whose work has landed.** The entries land in the README's **Existing Dependencies & Reuse** at step 5. Read [references/reuse-boundary.md](references/reuse-boundary.md) now if this functionality reuses anything or the existing TFS carries markers.

3. **Library breakdown** — write **one `docs/x/{name}/TFS/{libtype}-v{n}.md` per owned lib type, per live version** (`map` / `data-access` / `ui` / `feature` / `page` — create only those). Never create `util` / `api` / `app` specs, and never a spec for a **grab-bag** `ui` / `feature` lib. Each file holds that lib's spec sections **and its FR/BR**, following the template's subsections exactly.
4. **Feature journey** — when the functionality owns a `feature`, add the technical journey in `feature-v{n}.md` (per exported `feature` component). If there is no `feature-v{n}.md` (**abstract**, or **ui-only** / **page-only** shapes): skip this step; for **abstract**, put the short facade-consumer note in `data-access-v{n}.md` instead (see the template).
5. **README** — write `docs/x/{name}/TFS/README.md` with the functionality-level sections (Overview, Existing Dependencies & Reuse, Open Technical Questions) **and the ID Index** — a table of every FR/BR ID → the lib file it lives in → the PRD AC it maps to. State the classification, the **natural entry lib**, and list only **owned** libs as this functionality's own. This is the single place that keeps IDs unique across the folder.
6. **Validate** — run the Review Checklist below; loop until all pass.
7. **Confirm with the user** — see below. Any Open Technical Questions go to the user before finishing.
8. **Summary** — see below.

## Template

The template is a **folder** — [assets/template/](assets/template/) — mirroring the output: one template file per output file. Use the matching template for each file you write, exactly (same sections, same order); remove the `>` quote-helper notes and the top `<!-- … -->` comment from the final draft; keep every heading you use; omit whole lib-type files the functionality does not use.

**Output layout** — `docs/x/{name}/TFS/` (template → output):

| Template file             | Output file           | Holds                                                                                                                                |
| ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `template/README.md`      | `README.md`           | Overview, Existing Dependencies & Reuse, the 🧭 ID Index, Open Technical Questions — functionality-level only                        |
| `template/DECISIONS.md`   | `DECISIONS.md`        | retired FR/BRs · rejected technical approaches · reversed decisions · retired lib versions — **history only, never in the ID Index** |
| `template/map.md`         | `map-v{n}.md`         | owned `map` only (API / external assets)                                                                                             |
| `template/data-access.md` | `data-access-v{n}.md` | owned `data-access` (+ facade-consumer note when there is no `feature-v{n}.md`)                                                      |
| `template/ui.md`          | `ui-v{n}.md`          | owned `ui` only                                                                                                                      |
| `template/feature.md`     | `feature-v{n}.md`     | owned `feature` + the 🧳 User Experience & Flows journey                                                                             |
| `template/page.md`        | `page-v{n}.md`        | owned `page` only (`visual+` / `mixed+`)                                                                                             |

IDs are unique **across all files**; register every one in the README's 🧭 ID Index.

## Examples

**`DECISIONS.md`** is demonstrated once, in [assets/examples/visual/DECISIONS.md](assets/examples/visual/DECISIONS.md) — its shape does not vary by classification, so the `abstract/` and `mixed-plus/` folders omit it (they would each have one — `mixed-plus/` retired its `data-access` v1 — but the file's shape is the same, so it is shown once). Read it whenever this run retires an FR/BR or records a rejected option: it shows retirements paired with the PRD AC that drove them, and a rejected option stated with the reason it lost.

Read the example matching the functionality's classification before filling the specs and the journey — they show the expected granularity, the FR/BR test-ready syntax, and the journey structure. **Each example is a real folder** (`assets/examples/{type}/`), laid out exactly like a generated `docs/x/{name}/TFS/` — a `README.md` with a populated 🧭 ID Index plus one file per lib type per live version (the `visual` example ships `ui-v1.md` **and** `ui-v2.md` for one lib — two live versions) — so it doubles as a layout reference. Read the files in the matching example folder. The three examples cover the five types: `abstract` → `abstract/`; `visual` / `visual+` → `visual/`; `mixed` / `mixed+` → `mixed-plus/`. `page-v1.md` is demonstrated in `mixed-plus/`, so a `visual+` functionality borrows it from there; a plain `mixed` uses `mixed-plus/` and omits `page-v1.md`. Omit optional lib files the example has but this functionality does not own.

## Rules

**Functionality gate.** Never write a TFS for a bare `util` / `api` / `app` lib, nor for a **grab-bag** `ui` / `feature` lib.

**Emit a `{libtype}-v{n}.md` only for a lib this functionality OWNS — and a disclaimer never licenses one.** The file set is decided by **ownership**, not by which libs the cycle touches. Never create a spec file for a reused lib, and **adding a note such as "this file documents a lib this functionality does not own" does not make it acceptable** — that note is the proof the file should not exist. Watch for the pair symptom: a stray `map-v1.md` dragging a `data-access-v1.md` in behind it.

**A reused lib's spec has a home — find it, never improvise one.** If you feel the need for a spec file that the routing in [references/reuse-boundary.md](references/reuse-boundary.md) gives no home for, that is a signal to **stop and report**, never to add a file here. Honoring the requirements-home rule in the README (a correct `[TO-UPDATE]` entry) does **not** also license a spec file — those are two separate decisions, and both must be right.

**One file per live lib version — the version is in the filename.** A **shared** lib is versioned (`src/lib/v1/`, `src/lib/v2/` — `docs/getting-started/library-types-and-their-relationship.md` → Versioning shared libs), so its spec file carries that version too: **`{libtype}-v{n}.md`** — `ui-v1.md`, `data-access-v2.md`, `page-v1.md`. Name it that from **v1**, not only once a v2 exists; the code folder and the ID's `{OWNER}` both carry the version from day one, and a doc filename that hides it until v2 lands is the one surface out of step. An **app-domain** lib is unversioned, so it keeps the plain `{libtype}.md`.

When two versions ship at once **both stay documented, one file each** — consumers on v1 still need their spec, and they read `ui-v1.md` while new consumers read `ui-v2.md`. Splitting by file rather than by sub-section is what makes retiring a version a whole-file delete instead of surgery inside a live document, and keeps a v2-only edit out of v1's file entirely. Worked example: [assets/examples/visual/](assets/examples/visual/) ships `ui-v1.md` + `ui-v2.md` for one lib.

**The version goes in `{OWNER}`.** Since a lib's exported symbols already carry it (`V1PopupComponent`, selector `x-popup-v1`), so does the ID's owner segment: `POPUP_UIV1_FR-01` for v1, `POPUP_UIV2_FR-01` for v2. Numbering therefore **restarts per version** — the owner differs, so nothing collides and nothing is renumbered. Without this, a v2 would reuse v1's IDs and the ID Index would lie about which version a test covers. Two exceptions: an **existing** bare owner (`POPUP_UI_…`) is never renamed — leave it and version only from the next one; and an **unversioned** app-domain lib keeps a bare owner.

**Retiring a version.** When a shared version folder is finally deleted (all dependents migrated off), move its FR/BRs to `DECISIONS.md` per [references/amend-and-retire.md](references/amend-and-retire.md), drop their ID Index rows, **delete that version's `{libtype}-v{n}.md` whole**, and record the version removal under `DECISIONS.md` → Retired lib versions. Its numbers stay burned like any other retirement.

**What the version does _not_ touch.** The **CSS class** stays `e-{short-lib-name}` with no version segment (`e-popup`, never `e-popup-v2`) — and so do its DEP style variables. `docs/guidelines/naming-conventions.md#styling` owns that rule and its reasoning; do not invent a versioned class in a spec. The **`data-cy`** convention is unaffected too: it already carries the lib's own version (`{lib}-v{n}_{component}_{part}`), so a v2's selectors read `popup-v2_…` naturally. An **app-domain** lib has no version anywhere, `data-cy` included (`profile-image_profile-image_loading`) — `docs/guidelines/naming-conventions.md` owns both forms.

**Name match.** Every owned lib is `{domain}-{type}-{name}` with the **same** `{name}` as the functionality. Consumers keep their own functionality names; list them under Existing Dependencies & Reuse when relevant — never as this TFS's own libs.

**Natural entry lib.** Record it in the README (per the library-types doc): `abstract` → `data-access`; `visual` → `feature` or `ui`; `mixed` → `feature`; `visual+` → `page`; `mixed+` → `page`.

**Reuse markers.** Every entry under **Existing Dependencies & Reuse** carries its state for this cycle: **unmarked** = exists, used as-is; **`[TO-CREATE]`** = does not exist yet; **`[TO-UPDATE]`** = exists but must gain something for us. Use exactly these two markers, never wording of your own — one search must find them across every TFS. Either marker means the work is a **companion task in the plan**, its requirements live in that lib's own docs, and **no FR/BR here describes it** — "it" being the reused lib's own behaviour and the surface it must gain. A **boundary** BR asserting what our lib _passes_ that lib is still ours (see _FR/BR describe libs this functionality owns_ below): the marker rule and the boundary rule cover different sides of the same wire, so a `[TO-UPDATE]` entry and a boundary BR can — and often should — coexist. A `[TO-UPDATE]` also names the exact surface it must gain, its owning functionality, and the ACs it blocks — that surface is what lets a future reader retire the marker.

**Keep markers true on update.** A marker is cycle state in a durable doc. When updating an existing TFS, re-verify every marker **before** writing anything else and clear the ones whose work has landed; if you cannot tell, leave it and raise an Open Technical Question rather than clearing on assumption.

**FR/BR describe libs this functionality owns.** `{OWNER}` in an ID is always a component or helper service of an owned lib — never a reused one. Where an owned lib drives a reused one, the BR asserts **our side of the boundary**: that the reused component _receives_ `severity = 'critical'` from us, not that it _renders red_ (that is its owner's BR).

Details, worked boundary examples and the full clearing procedure: [references/reuse-boundary.md](references/reuse-boundary.md) — read it when this functionality reuses anything, and whenever updating a TFS that already carries markers.

**Base classes (default):** each component extends the latest available base class for its lib type (`ui`, `feature`, parent `page`, child `page`). Take the actual base from the matching example rather than a base-class name you already know or assume — the example is kept up to date, so it always reflects the latest base available in the workspace. Use these unless the user asks to use — or to create — a specialized base derived from them (e.g. a shared `…-ext-{name}` base for `feature` libs that always use one specific `data-access` lib, or for `page` libs that always use one specific `feature` lib as their starter, kept DRY across functionalities). If the user names such a base, extend it instead and note it in the spec.

**FR / BR (the test blueprint):**

- **FR → unit-test `describe`; BR → unit-test `it`.** Write each BR in `Given [Arrange]; When [Act]; Then [Assert]` form, referencing exact `[data-cy="…"]` selectors, input signals, and output emitters — never vague prose ("shows the list").
- **One observable behaviour per BR** (one `it`); if it needs an "and", split it. Give edge cases (loading / empty / error / boundary) their own BRs, with complete, realistic data.
- **The `Then` asserts an observable effect, never an internal call.** State what the unit observably produces — a rendered `[data-cy]`, an emitted output, or a resulting state/signal — **not** "a facade/collaborator method was called" (asserting a collaborator call is a unit-test anti-pattern). For data-fetching, prove the request is correct by its **result**: prime the collaborator to return data for the expected params, then assert the data the component exposes — e.g. _Given the user facade returns `U` for `userId = 123`; When data is ready; Then the value bound to the card is `U`_ (this proves it fetched user 123 without asserting the call).
- **Back-link the PRD:** annotate each FR/BR that implements a PRD scenario with the AC it decomposes, e.g. `(maps to PRD BALANCE-AC-01)`.
- **IDs:** scope IDs to the exported component (or helper service) that owns them, same format for both — `{NAME}_{OWNER}_FR-01` / `{NAME}_{OWNER}_BR-01`, where `{OWNER}` is the component (e.g. `XPROFILE_CARDV1_BR-01`) or the helper service (e.g. `XWALLET_POLLV1_FR-01`). IDs are unique **across the whole TFS folder** — all lib files share one ID space (never reset per file, never renumber). Record every ID in the README **ID Index** (ID → lib file → PRD AC). New technical scenarios (loading/error/interaction) get **new** unique IDs.

- **`{NAME}` is the PRD's feature key, copied verbatim** — take it from the **Feature key** field of `docs/x/{name}/PRD/README.md`. Never re-derive it from the functionality name: `ng-alert-badge` yields `ALERTBADGE` or `ALERT` depending on who derives it, and two derivations split one functionality's ID space in half.

- **`{OWNER}` is the owner's short role word — never its full class name.** Derive it the same way every time: take the exported class name, drop the `V{n}` prefix, the functionality's own name, and the `Component` / `Service` / `Facade` suffix; uppercase what remains; append the lib's version. **Two owners take no version:** an **unversioned app-domain** lib (there is none to append) and an **existing bare owner**, which is never renamed — both per _The version goes in `{OWNER}`_ above.

  | Exported class                                     | What remains | `{OWNER}`   |
  | -------------------------------------------------- | ------------ | ----------- |
  | `V1XProfileCardComponent` (`ui` of `ng-x-profile`) | `Card`       | `CARDV1`    |
  | `V1XProfileCardFeaComponent` (`feature`)           | `CardFea`    | `CARDFEAV1` |
  | `V1XWalletPollService` (helper service)            | `Poll`       | `POLLV1`    |
  | `V1XWalletOnePageComponent` (child `page`)         | `OnePage`    | `ONEPAGEV1` |

  When **nothing remains** — the class is named after the functionality itself, so it has no role to name — use the **lib-type shorthand**: `MAP`, `DA`, `UI`, `FEA`, `PAGE`. That covers `map` / `data-access` / `page` classes, which never carry a role word, and the single-component `ui` / `feature` case alike.

  | Exported class                                   | Lib type      | `{OWNER}` |
  | ------------------------------------------------ | ------------- | --------- |
  | `V1UserGeo` (of `ng-user-geo`)                   | `map`         | `MAPV1`   |
  | `V2XWalletFacade` (of `ng-x-wallet`)             | `data-access` | `DAV2`    |
  | `V1PopupComponent` (of `ng-popup`)               | `ui`          | `UIV1`    |
  | `V1AlertBadgeFeaComponent` (of `ng-alert-badge`) | `feature`     | `FEAV1`   |

  **Never repeat the key as the owner** (`POPUP_POPUPV1_…`) and never fall back to the full class name (`POPUP_XPOPUPCOMPONENTV1_…`): the key is already the ID's first segment, so both only add length. One rule, no special cases — the same class in the same position always yields the same `{OWNER}`, which is what keeps two runs from splitting one lib's ID space.

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

- [ ] Target is a functionality — not a bare `util` / `api` / `app` lib, and not a **grab-bag** `ui` / `feature` lib.
- [ ] Folder layout correct: `docs/x/{name}/TFS/README.md` + one `{libtype}-v{n}.md` per **owned** lib type per live version only; no lib spec placed in the README, nothing functionality-level placed in a lib file.
- [ ] **No `{libtype}-v{n}.md` exists for a reused lib** — with or without a disclaimer note. Cross-check the file list — with its `-v{n}` suffixes stripped — against the owned lib types, not against the libs the cycle touches; a correct `[TO-UPDATE]` entry in the README does not license a file.
- [ ] Every owned lib name uses the same functionality `{name}`; no consumer page absorbed as an owned `page`.
- [ ] README has an **ID Index** listing every FR/BR ID → its lib file → its PRD AC; every ID in the lib files appears there and vice-versa.
- [ ] Classification and natural entry lib match the library-types doc; only the needed lib specs are included (`map`/`ui`/`feature` omitted when not owned).
- [ ] README Non-Goals & Why records **current** technical exclusions with a reason each — rejected alternatives (lib split, `data-access` structure, shared libs not reused) live in `DECISIONS.md`, not here.
- [ ] `DECISIONS.md` exists whenever an FR/BR was retired or a technical option was rejected this cycle, with the date and reason per entry; no retired ID appears in the 🧭 ID Index, none remains in a `{libtype}-v{n}.md`, and no retired number was recycled.
- [ ] Every component names its base class correctly — the base its lib type uses in the matching example (not a name hardcoded in this skill).
- [ ] Every BR is `Given/When/Then` with concrete `[data-cy]` / signals / emitters; every FR/BR that implements the PRD back-links its AC.
- [ ] FR/BR IDs unique across the TFS; helper-service IDs scoped (`{NAME}_{HELPER}_…`); no PRD IDs repurposed; nothing renumbered.
- [ ] `{NAME}` matches the PRD's **Feature key** verbatim; every `{OWNER}` is the short role word — or the lib-type shorthand where the class carries none — with the lib's version appended, and no `{OWNER}` is a full class name. An **app-domain** lib's owners stay bare, and a pre-existing bare owner was not renamed.
- [ ] For a **versioned shared lib**: one file per **live** version, named `{libtype}-v{n}.md` (`ui-v1.md` + `ui-v2.md` while both ship) — never one combined `ui.md` with version sub-sections, and never a plain `{libtype}.md` for a versioned lib; the version is also in `{OWNER}` (`UIV2`), so numbering restarts per version and nothing collides; an existing bare owner was left unrenamed; a version whose folder is gone had its file deleted and its FR/BRs retired to `DECISIONS.md`. An **app-domain** (unversioned) lib uses the plain `{libtype}.md`.
- [ ] **No FR/BR describes behaviour the code no longer has**, and none states an expectation the code now contradicts — every pre-existing entry was checked against what shipped, not just the new ones.
- [ ] **On amend / retire only:** the ID was kept (amend) or burned and never recycled (retire); a retired entry's **ID Index row and AC back-link** went with it; the old text was shown beside the new and explicitly confirmed; the functionalities reusing the affected lib were named.
- [ ] No FR/BR takes a reused lib as its `{OWNER}` or asserts a reused lib's own behaviour; boundary BRs assert our side (what we pass in / what we do with what comes back).
- [ ] Every Existing Dependencies & Reuse entry is unmarked, `[TO-CREATE]`, or `[TO-UPDATE]` — no invented wording; each `[TO-UPDATE]` names the surface needed, its owning functionality, and the ACs it blocks.
- [ ] **On update only:** every pre-existing marker was re-verified — cleared where the work landed (with its "blocks" note), narrowed where it partly landed, or left with an Open Technical Question where it could not be determined.
- [ ] Inputs/Outputs written as JSDoc; outputs emitted via handler methods.
- [ ] `ui` DEP styles and `feature` DEP asset/config listed with examples.
- [ ] `data-access` style justified against the decision rule (+ non-pure-CRUD note applied).
- [ ] Journey follows independent → dependency chain → single on-ready; background flows in `_util/*.service.ts`; secondary flows separated.

**Validation Steps (iterative loop):** check every item; if any fails, fix the draft and re-check the whole list; only when all pass, continue to Summary.

## Confirm with the user

**The TFS is not finished until this happens.** After the Review Checklist passes and before the Summary: if the draft has any **Open Technical Questions**, put them to the user and fold each answer into the TFS. A question they don't answer stays listed — never guess an answer just to close it, and never let an unanswered question reach the plan as if it were settled.

Then re-run the Review Checklist over whatever changed.

## Summary

1. Report the saved folder (`docs/x/{name}/TFS/`) and list the files written (`README.md` + each `{libtype}-v{n}.md`).
2. List the FR/BR IDs created/added (ID + one-line description) and note which PRD ACs they cover.
3. **Report the companion work.** List every `[TO-CREATE]` and `[TO-UPDATE]` entry. For each that is a **functionality**, remind the user it needs its own PRD & TFS — a separate writer run, not part of this one. For each `util` / `api` / `app`, or **grab-bag** `ui` / `feature`, remind that those never get `docs/x/` (a `util` / `app` / grab-bag item records requirements in its own `requirements/`; an `api` has none) — they are created/updated via the plan. Flag any PRD AC of this functionality that a companion entry blocks.
4. **Promote product-observable gaps to the PRD.** For each FR/BR marked `(new — suggest a PRD AC)` in the ID Index — a **product-observable** scenario the PRD's ACs don't cover (NOT a purely technical loading/error/visibility state, which legitimately stays AC-less as `—`) — ask the user whether it should become a PRD Acceptance Criterion. If they approve, the functionality's PRD (`docs/x/{name}/PRD/README.md`) must gain that AC as a **separate step** (this skill never edits the PRD itself), after which back-link the FR/BR to the new AC and update the ID Index.
5. List any Open Technical Questions still unanswered after the confirmation step.

## Common mistakes

| Mistake                                                       | Fix                                                                                                                                                                                       |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Writing a TFS for a `util` / `api` / `app` lib                | STOP — not a functionality; no `docs/x/…/TFS`.                                                                                                                                            |
| Writing a TFS for a grab-bag `ui` / `feature` lib             | STOP — its items use a local `requirements/`, not a TFS.                                                                                                                                  |
| A spec file for a **reused** lib, with a disclaimer note      | Delete it. The note proves it should not exist; ownership decides the file set. See `references/reuse-boundary.md`.                                                                       |
| A stray `map-v1.md` dragging a `data-access-v1.md` in with it | The sister-lib rule applies to an **owned** map only — never to a reused one.                                                                                                             |
| Parking a reused lib's spec here because it has nowhere to go | Report that the reused functionality has no docs of its own and stop — writing them is a separate decision and a separate run. Never improvise a home.                                    |
| Adding `page-v1.md` because other pages use this feature      | Consumers import the natural entry lib; own a `page` only when _this_ functionality is the page (`visual+` / `mixed+`).                                                                   |
| Requiring `map-v1.md`/`ui-v1.md` for every mixed              | Mixed requires `data-access`+`feature`; omit `map`/`ui` when not owned.                                                                                                                   |
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
| FR/BR written for a reused lib, or `{OWNER}` = a reused one   | Requirements follow the lib. Spec our side of the boundary only; the reused lib's behaviour is its owner's TFS.                                                                           |
| Inventing wording for "must change" (`[UPDATE REQUIRED]`, …)  | Use `[TO-UPDATE]` exactly, so it stays greppable across every TFS.                                                                                                                        |
| A `[TO-UPDATE]` entry with no owner or blocked ACs named      | Name the owning functionality and which of our ACs it blocks — it is a delivery risk, not a footnote.                                                                                     |
| Updating a TFS and leaving old markers untouched              | Re-verify every marker first; clear the ones whose work landed, with their "blocks" notes.                                                                                                |
| Clearing a marker because the work was "probably done"        | Verify it, or leave the marker and raise an Open Technical Question.                                                                                                                      |
| Renumbering IDs on update                                     | Never renumber; add new unique IDs only.                                                                                                                                                  |
| Minting a new ID because an expectation changed               | Same rule, corrected wording → **amend** under the existing ID. See `references/amend-and-retire.md`.                                                                                     |
| Deleting an entry but leaving its ID Index row                | The row advertises coverage that no longer exists — remove the row and the AC back-link with it.                                                                                          |
| Recycling a retired number                                    | A burned number stays burned, so old commits and test titles never resolve to a different rule.                                                                                           |
| Amending or retiring without showing old vs new               | Both reverse an approved decision — show both texts, get confirmation, and name the functionalities reusing that lib.                                                                     |
| Writing the TFS as one file, or a lib spec into `README.md`   | One `{libtype}-v{n}.md` per present lib type per live version; `README.md` holds only functionality-level sections + the ID Index.                                                        |
| Restarting FR/BR numbering in each lib file                   | All lib files share one ID space; keep IDs globally unique and listed in the README ID Index.                                                                                             |
| `{OWNER}` written as the full class name (`XPROFILECARDV1`)   | Use the short role word — `CARDV1`. The derivation table sits in the IDs rule.                                                                                                            |
| Re-deriving `{NAME}` from the functionality name              | Copy the PRD's **Feature key** verbatim; two independent derivations split the ID space.                                                                                                  |
| One `ui.md` holding both versions as sub-sections             | One file per **live version** — `ui-v1.md` + `ui-v2.md`. Retiring a version is then a whole-file delete, not surgery in a live file.                                                      |
| A plain `ui.md` for a versioned **shared** lib                | Name it `ui-v1.md` from v1 — the code folder and `{OWNER}` already carry the version. Only app-domain (unversioned) libs use the plain name.                                              |
| A v2 reusing v1's FR/BR numbers                               | Put the version in `{OWNER}` (`POPUP_UIV2_BR-01`) — then numbering restarts safely.                                                                                                       |
| Deleting `ui-v1.md` because v2 shipped                        | Both stay documented while both ship — consumers still on v1 need theirs. Delete it only when v1's folder goes.                                                                           |
| Renaming an existing bare owner to add `V1`                   | Never — that renames live IDs. Leave it bare; version from the next one.                                                                                                                  |
| Finishing with Open Technical Questions unasked               | Put them to the user first. An unanswered question must never reach the plan looking settled.                                                                                             |
