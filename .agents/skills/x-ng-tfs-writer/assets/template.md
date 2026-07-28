# TFS — {name}

> Technical Functional Specification for the **{name}** functionality. Replace `{NAME}` with the same feature key used in the PRD (e.g. `ng-balance-card` → `BALANCE`). Remove every `>` helper note from the final draft; keep every heading you use, and omit whole lib-type specs the functionality does not need.

- **Last Updated** (YYYY-MM-DD): {date}
- **Owner**: {owner}

## ℹ️ Overview

### Functionality Name

> The technical name (kebab-case; prefix `ng-` when the feature has logic), e.g. `ng-balance-card`.

### Functionality Classification

> Choose exactly one (see `docs/getting-started/library-types-and-their-relationship.md`): **abstract** (map + data-access) · **visual** (ui + feature) · **visual+** (ui + feature + page) · **mixed** (map + data-access + ui + feature) · **mixed+** (map + data-access + ui + feature + page).

### Domain

> The functionality's domain (scope). If you cannot infer it from the PRD/context, ask: is it **shared** (usable by any app) or specific to one app in the workspace? A **shared** functionality's libs live under `libs/shared/…`; an app-specific one under `libs/{domain}/…` (the domain is that app's name). The domain is the first segment of every lib name below (`{domain}-{type}-ng-{name}`). Library boundaries per domain are enforced in `.eslintrc.json`.

### Rationale

> Why this classification. Name any existing libs reused (so a lib type may be absent because an existing one covers it).

## 🔗 Existing Dependencies & Reuse

> List only libs that **do not belong to this functionality** — i.e. libs from _other_ functionalities/shared infra that this one reuses. Do not list this functionality's own map/data-access/ui/feature/page libs here. Ask the user what to reuse; do not assume. Flag anything recommended-but-not-yet-built with `[RECOMMENDED]` (it needs its own PRD & TFS).

### Used map / data-access libs

> Per lib: name → class/interface → the methods/observables used, and why. Often `NONE` — a functionality's own map/data-access libs do not rely on other functionalities' map/data-access libs (things like the base URL are provided by the calling page/feature, not fetched by depending on the config libs here).

### Used ui / feature / page libs

> Per lib: name → what it provides. `NONE` if none.

### Used util libs

> Per lib: name → the class/function used, and why reuse is appropriate. (Functionalities never own a `util`/`api`/`app` lib — they reuse shared ones.)

## 📚 Library Breakdown

> Include **only** the lib specs the classification needs. Every lib name uses the functionality's domain as its first segment: `{domain}-{type}-ng-{name}`.

### 🗺️ 'map' Library Specification

> Only if the functionality fetches from the outside world. `map` libs fetch + map API/JSON into `*_Map*` interfaces; they extend `V1BaseMap`.

#### Lib Name

`{domain}-map-ng-{name}`

#### Class & Methods

> The proxy class + each method: HTTP method, URL, auth, params, and the `*_Map*` return type. Record any user-provided endpoint/param **verbatim**.

#### Interfaces

> Two families:
>
> - **`*_Api*`** — reflect the **exact** response schema the server returns (whatever casing/shape the API uses; do not force camelCase here).
> - **`*_Map*`** — reshape the response to be easy for `ui` libs to consume: camelCase, and drop/extract/parse whatever you can so the parsing happens here (in the map) rather than in the `ui` component that later receives the `*_Map*` type as an input.

#### Functional Requirements & Business Rule Breakdown

> `describe`↔FR, `it`↔BR. FRs/BRs for the mapping (correct field mapping, parsing, error normalisation), in `Given/When/Then`. Back-link the PRD AC each implements where relevant.

#### Error Handling & Edge Cases

> How the `map` parses/normalises errors (sentinel codes, etc.).

### 🗄️ 'data-access' Library Specification

> A `map` lib **always** has a sister `data-access` lib to store its fetched+mapped data — so include this whenever there is a `map` spec. `data-access` initializes `map` methods and holds the result.

#### Lib Name

`{domain}-data-access-ng-{name}`

#### Object Structure

> Choose the structure and justify it:
>
> - **entity** — classic NgRx entity-adapter CRUD (`getAll`/`addOne`/`updateOne`/`removeOne`, `selectedEntity$`, `loaded$`). **Only for a PURE CRUD operation.**
> - **single-instance** — cache-aware, one state object; facade methods take no instance id (`getX(url, …)`, `datas$`/`loadeds$`/`errors$`, `reset()`). Use when the lib is **initialized once per page**.
> - **multi-instance** — cache-aware, instance-keyed via an adapter; `createIfNotExists(id)` then `getX(url, …, id)`, `entityDatas$(id)`/`entityLoadeds$(id)`/`entity$(id)`, `reset(id)`/`resetAll()`. Use when the lib is **initialized multiple times** (by the page, or by several `feature` libs at once).
>
> **Note!** If a Post/Put/Patch must send an `extra` payload **beyond the entity itself** (because that is how the API is designed), it is **not** pure CRUD — use **single-** or **multi-instance** (cache-aware, explicit actions), not the entity structure.

#### Facade API

> The full public surface: every `get*` and mutation (`patch*`/`post*`/`put*`/`delete*`) method AND every observable consumers use (list them all). Cache-aware libs share a common set — the `get*`/mutation dispatchers, resolved observables (`datas$`, `loadeds$`, `errors$`, `hasError$` and their narrow per-key selectors), and cache controls (`configureTtl`, `cacheInvalidate`, `cacheMask`, `reset`); the exact set varies by structure (single-/multi-instance/entity). For the precise per-structure surface, follow the workspace's canonical lib-structure reference.
>
> **Mutations (cache-aware libs):** in a single-/multi-instance lib, a write (`patch*`/`post*`/`put*`/`delete*`) that re-defines a `get*` data-key is declared in the reducer's `CACHE_INVALIDATION_MAP` and applied via `v1BaseReducerInvalidate`, so the next read of that key refetches (its effect uses `concatMap` → `success`/`failure` with an empty `cacheKey`, not the cache-run helper). By contrast, an entity-structure lib expresses writes as the entity adapter's own CRUD ops (`addOne`/`updateOne`/`removeOne`). Note: which structure to use is decided solely by the pure-CRUD test in **Object Structure** above — not by whether the lib has mutations.

#### Functional Requirements & Business Rule Breakdown

> `describe`↔FR, `it`↔BR. FRs/BRs for the state transitions (loading → data / error, cache behaviour), in `Given/When/Then`. Back-link PRD ACs where relevant.

### 🖼️ 'ui' Library Specification

> Only for visual functionalities. `ui` components are presentational, extend `V1BaseUiComponent`, and are driven by their parent `feature` via `state`/`dataType`.

#### Lib Name

`{domain}-ui-ng-{name}`

#### Exported Components

> How many components this lib exposes globally follows the PRD's User Experience & Flows:
>
> - **Multi-view** functionality (needs more than one view/screen/page) → export **more than one** component, one per view (not one component that switches views via `dataType`).
> - **Single-view** functionality (no switching between contents) → export **one** component; its `dataType` is optional with a fixed default that never changes (e.g. a list → `'all'`; one entity → `'one'`).
>
> The developer chooses multi- vs single-view; suggest the better fit. Each globally-exposed component lives in its own folder under the version folder.

##### Component: `V1{Name}Component`

```ts
@Component(...)
export class V1{Name}Component extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

> One paragraph: what it renders and which `state`/`dataType` values it handles.

###### Inputs

> Common (all `ui`): `state` (`loading|empty|data|success|failure`), `dataType` (`all|one|new|edit`).
>
> Then this component's inputs. **Each input's description IS its JSDoc.** Mark Required/Optional; give signal types (`InputSignal<…>` / `ModelSignal<…>`) and defaults. **Asset inputs** (a custom icon/image) are ordinary inputs with a **default path**, e.g. `icoInfo = input('./assets/images/libs/{domain}/{name}_ico-info.svg')` — the parent `feature` overrides them from DEP config.

###### Outputs

> Each output (`OutputEmitterRef<…>`). **Each description IS its JSDoc.** Outputs are emitted via **handler methods** in the component (not directly in the template), so unit tests can call the handler to assert the emit.

###### Rendering Rules

> What renders per `state` (and `dataType`), using exact `[data-cy="{lib}-v1_{component}_{part}"]` selectors. Reference the **translation keys** used for any heading/paragraph/label text, e.g. _"All" (via `{name}.all_h3`)_ or _"Hello No.123" (via `{name}.greeting_p` with `userId`)_. Include conditional hides and popups.

###### DEP Styles (CSS variables)

> The CSS variables this component exposes for theming (apps override them via brand/DEP config). Use `naming-conventions.md#styling`: `--e-{class}--{rule}` or `--e-{class}--{rule}--{light,dark}`, on the `e-{short-lib-name}` class. Defaults may reference the base `ui` lib's root CSS variables (e.g. `--e-primary-color`, `--e-night-color`, `--e-day-lighter-color`; all rgb triplets like `162 170 185`).
>
> Example:
>
> ```scss
> .e-{name} {
>   --e-{name}--bg-color: var(--e-day-lighter-color);
>   --e-{name}--color: var(--e-night-color);
> }
> ```

###### Functional Requirements & Business Rule Breakdown

> `describe`↔FR, `it`↔BR. Cover this component's **presentation and interaction** behaviour (everything except data fetching, which the `feature` owns). Derive the FR/BR from the PRD's ACs and this TFS's design; write `Given/When/Then` with exact `[data-cy]`/inputs/emitters; back-link each PRD AC it implements; add NEW unique IDs for technical scenarios (loading/error/visibility) not in the PRD. IDs scoped to the component (`{NAME}_{COMPONENT}_…`) and unique across the TFS.

###### Error Handling & Edge Cases

> Edge cases that lead to empty/message states in this component.

#### Helper Services

> Optional — only if this lib needs internal helpers. Each is an **Angular service** in `_util/{name}.service.ts` (prefer a service over a plain util class). Give Responsibility, Public API, and its own FR/BR IDs (`{NAME}_{HELPER-NAME}_FR-01a`).

### 🧩 'feature' Library Specification

> The last piece of a visual/mixed functionality. `feature` components fetch data (via `data-access`) and drive `ui` inputs. They extend `V2BaseFeatureExtComponent`.

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

> `describe`↔FR, `it`↔BR. Cover the **data-fetching** behaviour as **observable effects** — the data the component exposes to the `ui` once ready, its `state`/`hasError` on failure, DEP-config-driven inputs — **not** "the facade was called". To prove a request is correct, prime the facade to return data for the expected params and assert the exposed result. `Given/When/Then`. Back-link PRD ACs. New unique IDs, scoped to the component, unique across the TFS.

###### Error Handling & Edge Cases

> `hasError` is emitted for state-object errors by default (`_xFacadesAddErrorListeners`). List error **exceptions** (not emitted) and edge cases.

#### Helper Services

> Optional — internal helpers as Angular services in `_util/{name}.service.ts`. A polling / interval / recurring process is a service here, started from `_xInitOrUpdateAfterAllDataReady` (NOT the dependency chain). Give Responsibility, Public API (e.g. `init()`/`destroy()`), lifecycle, and its own FR/BR IDs (`{NAME}_{HELPER-NAME}_FR-01a`).

### 📄 'page' Library Specification

> Only for `visual+` / `mixed+`. A `page` composes `feature` libs and owns routing. Inputs arrive as **URL query params**. For naming and folder structure, follow the workspace's canonical `page`-lib reference (parent + child route components, a `lib.routes.ts`, versioned selectors).

#### Lib Name

`{domain}-page-ng-{name}`

#### Routes

> The lib's `lib.routes.ts`: parent route + child routes. Child page components are named by responsibility — one of `V1{Name}AllPageComponent`, `V1{Name}NewPageComponent`, `V1{Name}OnePageComponent`, `V1{Name}EditPageComponent`.

#### Parent Page: `V1{Name}PageComponent`

```ts
@Component(...)
export class V1{Name}PageComponent extends V2BasePageParentComponent {}
```

> Required URL query params (`_xHasRequiredInputs`); **starter libs** (which `feature` must be ready before others — `_xHasInitStarterLibs` / `onReadyStarterLibN`); child routes gated by starter-ready flags; error aggregation (`$errors` / `xOnError`); navigation handled here in response to `feature` outputs.

#### Child Pages: `V1{Name}{All|New|One|Edit}PageComponent`

```ts
@Component(...)
export class V1{Name}OnePageComponent extends V2BasePageChildComponent {}
```

> Per child: `_pageName` / `_urlRoot`, `$id` (from route param, for One/Edit), which `feature`(s) it composes, and `xOnError` (forwards to the parent via the communication service).

#### Functional Requirements & Business Rule Breakdown

> Page-level FR/BR: required-param gating, navigation on `feature` outputs, starter-lib ordering, error aggregation. Back-link PRD ACs (esp. navigation/route ACs). New unique IDs.

## 🧳 User Experience & Flows (Technical & Frontend Perspective)

> The generic base pipeline (init → fetch → await → render, via the base classes) is assumed — do NOT re-document it. Document only THIS functionality's specifics, with **one `###` sub-heading per exported `feature` component** (mirroring the Library Breakdown component headings). Under each component, cover its Data flow, Interaction flows, Background flows, and Decision logic — omit any that don't apply.
>
> **Abstract functionalities:** replace this section with a short note on how consumers use the `data-access` facade (there is no `feature`/`ui`) — which facade methods to call, in what order, and which observables to subscribe to.

### `V1{Name}FeaComponent`

#### Data flow

> - **Independent data** — the calls made in `_xDataFetch` (awaited via `_xFacadesPre` + `_xFacadesLoadesValidation`; reset in `_xDataReset`; errors via `_xFacadesAddErrorListeners`).
> - **Dependency chain** (`_xBuildDependencyChain$`, only if there are dependent calls) — each dependent call and the independent data it needs, declared in one place as `switchMap` levels (may span facades — not sequential phases).
> - **On all ready** (`_xInitOrUpdateAfterAllDataReady`, fires once) — the `ui` inputs set AND the outputs emitted; note first-time-only emissions; note where any background flows are started.
> - **Encapsulated functions / util** — the in-component `_…()` helpers or `_util/` pure-function files used here (as many or as few as the logic needs; possibly none).

#### Interaction flows

> One unit per output / user action: **Trigger → Steps → Outcome**. Non-trivial logic → its own `_util/*.service.ts`. Routing intents are re-emitted and handled by the page (outside the functionality).

#### Background flows (async)

> Polling / intervals / pause-resume, each its own titled unit with a lifecycle (start / tick / stop / pause / resume / destroy), implemented in its own `_util/*.service.ts`, started from `_xInitOrUpdateAfterAllDataReady`.

#### Decision logic

> Non-trivial decisions (e.g. label/visibility state) as an encapsulated function with a decision table — a private `_…()` method for small logic, or a `_util/` pure function / service for larger or shared logic.

> _(Repeat the `### V1{Name}FeaComponent` block above for each additional exported `feature` component.)_

## ❓ Open Technical Questions

> Anything unknown/unconfirmed. Raise with the user. `NONE` if all resolved.
