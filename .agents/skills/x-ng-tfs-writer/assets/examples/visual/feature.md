### 🧩 'feature' Library Specification

#### Lib Name

`shared-feature-ng-x-profile`

#### Exported Components

Two `feature` components — one per `ui` component — so pages compose the card and the detail independently.

##### Component: `V1XProfileCardFeaComponent`

m

```ts
@Component(...)
export class V1XProfileCardFeaComponent extends V2BaseFeatureExtComponent implements V2BaseFeature_ExtHasIt {}
```

###### Responsibility

Fetches the user via the reused `V1UserFacade` and drives `V1XProfileCardComponent`. Overrides `_xHasRequiredInputs` (needs `userId`), `_xDataReset` (resets the user facade), `_xDataFetch` (calls `V1UserFacade.getUser`), `_xFacadesPre`/`_xFacadesLoadesValidation` (awaits `userLoaded$`), `_xFacadesAddErrorListeners` (`userError$` → `hasError`), `_xInitOrUpdateAfterAllDataReady` (sets the card inputs).

###### Inputs

Common: `showErrors`.

- `userId: InputSignal<number>` — _(JSDoc)_ Required. Whose profile to present.

###### Outputs

Common: `ready`, `allDataIsReady`, `hasError`.

- `clickedDetails: OutputEmitterRef<number>` — _(JSDoc)_ Re-emitted from the card's `clickedDetails`, with the `userId`, via `onClickedDetails()`; the page decides navigation.

###### DEP Config & Assets

- **Config**: `$dataConfigDep()?.libs?.xProfileV1?.showCountry` → the card's `showCountry` input.
- **Assets**: `$dataConfigDep()?.assets?.lib_x_profile_ico_placeholder` → the card's `icoPlaceholder` input.

###### Functional Requirements & Business Rule Breakdown

- **XPROFILE_CARDFEA_FR-01** _(maps to PRD XPROFILE-AC-01)_: Test fetch + wiring.
  - **XPROFILE_CARDFEA_BR-01** _(maps to PRD XPROFILE-AC-01)_: Given the user facade returns user `U` only for `userId = 123` _(Arrange)_; When the component initializes with `userId = 123` and data becomes ready _(Act)_; Then the data it exposes to the card is `U` — proving it fetched the correct user _(Assert)_.
  - **XPROFILE_CARDFEA_BR-02** _(maps to PRD XPROFILE-AC-01)_: Given `userData$` resolves _(Arrange)_; When ready _(Act)_; Then `V1XProfileCardComponent.data` is set from `userData$`, `showCountry`/`icoPlaceholder` from DEP config, and its `state = data` _(Assert)_.
  - **XPROFILE_CARDFEA_BR-03** _(maps to PRD XPROFILE-AC-02)_: Given the card emits `clickedDetails` _(Arrange)_; When `onClickedDetails()` runs _(Act)_; Then the feature emits `clickedDetails` with the `userId` _(Assert)_.

###### Error Handling & Edge Cases

- If `userError$` emits, `hasError` is emitted via `xOnError`.

##### Component: `V1XProfileDetailFeaComponent`

```ts
@Component(...)
export class V1XProfileDetailFeaComponent extends V2BaseFeatureExtComponent implements V2BaseFeature_ExtHasIt {}
```

###### Responsibility

Fetches the user via `V1UserFacade` and drives `V1XProfileDetailComponent` (same hook overrides as the card feature).

###### Inputs

Common: `showErrors`.

- `userId: InputSignal<number>` — _(JSDoc)_ Required. Whose detail to present.

###### Outputs

Common: `ready`, `allDataIsReady`, `hasError`.

- `clickedContact: OutputEmitterRef<number>` — _(JSDoc)_ Re-emitted from the detail's `clickedContact`, with the `userId`, via `onClickedContact()`.

###### DEP Config & Assets

_None._

###### Functional Requirements & Business Rule Breakdown

- **XPROFILE_DETAILFEA_FR-01** _(maps to PRD XPROFILE-AC-03)_: Test fetch + wiring.
  - **XPROFILE_DETAILFEA_BR-01** _(maps to PRD XPROFILE-AC-03)_: Given `userData$` resolves _(Arrange)_; When ready _(Act)_; Then `V1XProfileDetailComponent.data` is set and its `state = data` (or `empty` if no detail) _(Assert)_.

###### Error Handling & Edge Cases

- Same shared-facade error propagation as the card feature.

#### 🧳 User Experience & Flows (Technical & Frontend Perspective)

##### `V1XProfileCardFeaComponent`

###### Data flow

- **Independent data** — `V1UserFacade.getUser(baseUrl, userId, …)` in `_xDataFetch` (reset in `_xDataReset`; awaited via `userLoaded$` in `_xFacadesPre` + `_xFacadesLoadesValidation`; `userError$` watched in `_xFacadesAddErrorListeners`).
- **Dependency chain** — none.
- **On all ready** (`_xInitOrUpdateAfterAllDataReady`, once) — set `V1XProfileCardComponent.data` from `userData$`, `showCountry`/`icoPlaceholder` from DEP config; the card's `state` becomes `data`.
- **Encapsulated functions / util** — none.

###### Interaction flows

- **Card "view details"** — card emits `clickedDetails` → `onClickedDetails()` re-emits `clickedDetails(userId)` → the composing page navigates (outside the functionality).

###### Background flows (async)

_None._

###### Decision logic

_None._

##### `V1XProfileDetailFeaComponent`

###### Data flow

- **Independent data** — `V1UserFacade.getUser(...)` in `_xDataFetch`; awaited via `userLoaded$`.
- **Dependency chain** — none.
- **On all ready** (once) — set `V1XProfileDetailComponent.data` from `userData$`; `state = data`, or `empty` when the detail is absent.
- **Encapsulated functions / util** — none.

###### Interaction flows

- **Detail "contact"** — detail emits `clickedContact` → `onClickedContact()` re-emits `clickedContact(userId)` → handled by the page.

###### Background flows (async)

_None._

###### Decision logic

_None._
