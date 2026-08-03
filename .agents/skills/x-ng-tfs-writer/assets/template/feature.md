<!--
Template for `docs/x/{name}/TFS/feature.md` — the `feature` lib spec + its FR/BR,
followed by the 🧳 User Experience & Flows journey (one sub-section per exported feature component).
Include this file only when this functionality **owns** a `feature` lib (required for mixed; optional for visual / visual+ / mixed+). Lib name: `{domain}-feature-{name}` (same `{name}` as the functionality).
Remove `>` helpers from the final draft. Register every FR/BR ID in the README's 🧭 ID Index.
-->

### 🧩 'feature' Library Specification

> Often the natural entry lib for visual / mixed. `feature` components fetch data (via owned or reused `data-access`) and drive `ui` inputs (owned or reused). They extend `V2BaseFeatureExtComponent`.

#### Lib Name

`{domain}-feature-ng-{name}`

#### Exported Components

> One `feature` component per exported `ui` component (multi-view → multiple; single-view → one).

##### Component: `V1{Name}FeaComponent`

```ts
@Component(...)
export class V1{Name}FeaComponent extends V2BaseFeatureExtComponent implements V2BaseFeature_ExtHasIt {}
```

###### Responsibility

> What it fetches and which `ui` component(s) it drives. Note the hooks it overrides (`_xInitPreBeforeDom`, `_xHasRequiredInputs`, `_xFacadesPre`, `_xFacadesLoadesValidation`, `_xDataReset`, `_xDataFetch`, `_xBuildDependencyChain$` if there is dependent data, `_xInitOrUpdateAfterAllDataReady`).

###### Inputs

> Common (all `feature`): `showErrors`. Then this component's inputs (**description = JSDoc**; Required/Optional, signal types).

###### Outputs

> Common (all `feature`): `ready`, `allDataIsReady`, `hasError`. Then this component's outputs. **Emitted via handler methods.** Re-emitted child outputs (e.g. routing intents handled by the page) belong here.

###### DEP Config & Assets

> What this component reads from the config data-access lib and maps to `ui` inputs:
>
> - **Config** — `$dataConfigDep()?.libs?.{name}V1?.{prop}` (config property named `{libname}_{version}`; see `docs/runbooks/dep-update-config-for-a-lib.md`).
> - **Assets** — `$dataConfigDep()?.assets?.lib_{libname}_{ico,img}_{assetname}` (a custom icon/image path it passes to the `ui`'s asset input; see `docs/runbooks/dep-update-assets-for-a-lib.md`).
>
> `None.` if neither applies.

###### Functional Requirements & Business Rule Breakdown

> `describe`↔FR, `it`↔BR. Cover the **data-fetching** behaviour as **observable effects** — the data the component exposes to the `ui` once ready, its `state`/`hasError` on failure, DEP-config-driven inputs — **not** "the facade was called". To prove a request is correct, prime the facade to return data for the expected params and assert the exposed result. `Given/When/Then`. Back-link PRD ACs. New unique IDs, scoped to the component, unique across the TFS folder.

###### Error Handling & Edge Cases

> `hasError` is emitted for state-object errors by default (`_xFacadesAddErrorListeners`). List error **exceptions** (not emitted) and edge cases.

#### Helper Services

> Optional — internal helpers as Angular services in `_util/{name}.service.ts`. A polling / interval / recurring process is a service here, started from `_xInitOrUpdateAfterAllDataReady` (NOT the dependency chain). Give Responsibility, Public API (e.g. `init()`/`destroy()`), lifecycle, and its own FR/BR IDs (`{NAME}_{HELPER-NAME}_FR-01` / `{NAME}_{HELPER-NAME}_BR-01` — same format as components).

#### 🧳 User Experience & Flows (Technical & Frontend Perspective)

> The generic base pipeline (init → fetch → await → render, via the base classes) is assumed — do NOT re-document it. Document only THIS functionality's specifics, with **one `#####` sub-heading per exported `feature` component** (mirroring the component headings above). Under each component, cover its Data flow, Interaction flows, Background flows, and Decision logic — omit any that don't apply.
>
> (For an **abstract** functionality there is no `feature.md`; the facade-consumer note goes in `data-access.md` instead.)

##### `V1{Name}FeaComponent`

###### Data flow

> - **Independent data** — the calls made in `_xDataFetch` (awaited via `_xFacadesPre` + `_xFacadesLoadesValidation`; reset in `_xDataReset`; errors via `_xFacadesAddErrorListeners`).
> - **Dependency chain** (`_xBuildDependencyChain$`, only if there are dependent calls) — each dependent call and the independent data it needs, declared in one place as `switchMap` levels (may span facades — not sequential phases).
> - **On all ready** (`_xInitOrUpdateAfterAllDataReady`, fires once) — the `ui` inputs set AND the outputs emitted; note first-time-only emissions; note where any background flows are started.
> - **Encapsulated functions / util** — the in-component `_…()` helpers or `_util/` pure-function files used here (as many or as few as the logic needs; possibly none).

###### Interaction flows

> One unit per output / user action: **Trigger → Steps → Outcome**. Non-trivial logic → its own `_util/*.service.ts`. Routing intents are re-emitted and handled by the page (outside the functionality).

###### Background flows (async)

> Polling / intervals / pause-resume, each its own titled unit with a lifecycle (start / tick / stop / pause / resume / destroy), implemented in its own `_util/*.service.ts`, started from `_xInitOrUpdateAfterAllDataReady`.

###### Decision logic

> Non-trivial decisions (e.g. label/visibility state) as an encapsulated function with a decision table — a private `_…()` method for small logic, or a `_util/` pure function / service for larger or shared logic.

> _(Repeat the `##### V1{Name}FeaComponent` journey block above for each additional exported `feature` component.)_
