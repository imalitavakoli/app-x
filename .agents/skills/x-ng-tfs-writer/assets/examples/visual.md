# TFS — ng-x-profile

- **Last Updated**: 2026-07-26
- **Owner**: Ali

## ℹ️ Overview

### Functionality Name

`ng-x-profile`

### Functionality Classification

**Visual** — uses `ui` + `feature` libs only.

### Domain

`shared` — usable by any app; its libs live under `libs/shared/…`.

### Rationale

x-profile presents the user's profile in two forms — a compact card and an expanded detail. It has no `map`/`data-access` of its own: it reuses the shared `ng-user` **abstract** functionality's `data-access` lib for the data. So it needs `ui` + `feature` only.

## 🔗 Existing Dependencies & Reuse

### Used map / data-access libs

- `shared-data-access-ng-user` → `V1UserFacade` → `getUser` method; `userData$`, `userLoaded$`, `userError$` observables: the user data this functionality fetches (via that shared facade) and presents.
- `shared-data-access-ng-config` → `V2ConfigFacade`: DEP config/assets (via `V2BaseFeatureExtComponent`).

### Used ui / feature / page libs

- `shared-ui-ng-popup`: the detail's "expand" popup.

### Used util libs

- `shared-util-ng-bases` → `V1BaseUiComponent`; `shared-util-ng-bases-consumer` → `V2BaseFeatureExtComponent`.

## 📚 Library Breakdown

### 🖼️ 'ui' Library Specification

#### Lib Name

`shared-ui-ng-x-profile`

#### Exported Components

This is a **multi-view** functionality (a compact card view and an expanded detail view), so two components are exposed globally — one per view — each in its own folder under `v1/`.

##### Component: `V1XProfileCardComponent`

```ts
@Component(...)
export class V1XProfileCardComponent extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

Renders a compact profile card (avatar, full name, country) and emits a "view details" intent. Single-view component: `dataType` fixed at `'one'`.

###### Inputs

Common: `state`, `dataType` (default `'one'`, never changes).

- `data: InputSignal<V1User_MapUser>` — _(JSDoc)_ Required. The user to render (name, avatar, country).
- `showCountry: InputSignal<boolean>` — _(JSDoc)_ Optional. When `false`, the country row is hidden. Default `true`.
- `icoPlaceholder: InputSignal<string>` — _(JSDoc)_ Optional. Fallback avatar icon path. Default `'./assets/images/libs/shared/x-profile_ico-placeholder.svg'` (the parent `feature` overrides it from DEP config).

###### Outputs

- `clickedDetails: OutputEmitterRef<void>` — _(JSDoc)_ Emitted from `onClickedDetails()` when the "view details" button is clicked.

###### Rendering Rules

- `state = loading`: `section[data-cy="x-profile-card-v1_card_loading"]` — skeleton only.
- `state = data`: `section[data-cy="x-profile-card-v1_card_data"]` with:
  - `img[data-cy="x-profile-card-v1_card_data-avatar"]` — bound to `data.avatarUrl`, falling back to `icoPlaceholder`.
  - `h3[data-cy="x-profile-card-v1_card_data-name"]` — the full name (via `x_profile.name_h3` translation key, with `data.fullName`).
  - `span[data-cy="x-profile-card-v1_card_data-country"]` — the country (via `x_profile.country_label`); rendered only when `showCountry`.
  - `button[data-cy="x-profile-card-v1_card_data-btn-details"]` — label via `x_profile.details_btn`.

###### DEP Styles (CSS variables)

```scss
.e-x-profile-card {
  --e-x-profile-card--bg-color: var(--e-day-lighter-color);
  --e-x-profile-card--color: var(--e-night-color);
}
```

###### Functional Requirements & Business Rule Breakdown

- **XPROFILE_CARD_FR-01** _(maps to PRD XPROFILE-AC-01)_: Test rendered elements; based on `state`.
  - **XPROFILE_CARD_BR-01**: Given no `data` _(Arrange)_; Then `state = loading` and `[data-cy="x-profile-card-v1_card_loading"]` is displayed _(Assert)_.
  - **XPROFILE_CARD_BR-02** _(maps to PRD XPROFILE-AC-01)_: Given `data` is defined _(Arrange)_; When `state = data` _(Act)_; Then the avatar, name (`x_profile.name_h3`), and country are rendered _(Assert)_.
  - **XPROFILE_CARD_BR-03**: Given `showCountry = false` _(Arrange)_; When `state = data` _(Act)_; Then `[data-cy="x-profile-card-v1_card_data-country"]` is NOT rendered _(Assert)_.
  - **XPROFILE_CARD_BR-04**: Given `data.avatarUrl` is empty _(Arrange)_; When `state = data` _(Act)_; Then the avatar `src` falls back to `icoPlaceholder` _(Assert)_.
- **XPROFILE_CARD_FR-02** _(maps to PRD XPROFILE-AC-02)_: Test output emits.
  - **XPROFILE_CARD_BR-05** _(maps to PRD XPROFILE-AC-02)_: Given `state = data` _(Arrange)_; When `button[data-cy="x-profile-card-v1_card_data-btn-details"]` is clicked _(Act)_; Then `clickedDetails` is emitted (via `onClickedDetails()`) _(Assert)_.

###### Error Handling & Edge Cases

- Missing `avatarUrl` → the `icoPlaceholder` icon is shown.

##### Component: `V1XProfileDetailComponent`

```ts
@Component(...)
export class V1XProfileDetailComponent extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

Renders the full profile detail (name, country, bio) with an optional "expand" popup. Handles `loading` / `data` / `empty`; `dataType` fixed at `'one'`.

###### Inputs

Common: `state`, `dataType` (default `'one'`).

- `data: InputSignal<V1User_MapUser>` — _(JSDoc)_ Required. The user detail to render.
- `showExpand: ModelSignal<boolean>` — _(JSDoc)_ Two-way; when `true`, opens the bio "expand" popup. Reset to `false` on close.

###### Outputs

- `clickedContact: OutputEmitterRef<void>` — _(JSDoc)_ Emitted from `onClickedContact()` when the "contact" button is clicked.

###### Rendering Rules

- `state = empty`: `section[data-cy="x-profile-detail-v1_detail_empty"]` — "No profile" (via `x_profile.empty_p`).
- `state = data`: `[data-cy="x-profile-detail-v1_detail_data"]` with the name (`x_profile.name_h3`), country (`x_profile.country_label`), `p[data-cy="x-profile-detail-v1_detail_data-bio"]` (via `x_profile.bio_p`), and `button[data-cy="x-profile-detail-v1_detail_data-btn-contact"]` (via `x_profile.contact_btn`); the popup opens when `showExpand = true`.

###### DEP Styles (CSS variables)

```scss
.e-x-profile-detail {
  --e-x-profile-detail--color: var(--e-night-color);
}
```

###### Functional Requirements & Business Rule Breakdown

- **XPROFILE_DETAIL_FR-01** _(maps to PRD XPROFILE-AC-03)_: Test rendered elements; based on `state`.
  - **XPROFILE_DETAIL_BR-01** _(maps to PRD XPROFILE-AC-03)_: Given `data` with a bio _(Arrange)_; When `state = data` _(Act)_; Then `[data-cy="x-profile-detail-v1_detail_data-bio"]` shows the bio (`x_profile.bio_p`) _(Assert)_.
  - **XPROFILE_DETAIL_BR-02**: Given `data` is empty/undefined after load _(Arrange)_; Then `state = empty` and `[data-cy="x-profile-detail-v1_detail_empty"]` is displayed _(Assert)_.
- **XPROFILE_DETAIL_FR-02** _(maps to PRD XPROFILE-AC-04)_: Test output emits.
  - **XPROFILE_DETAIL_BR-03** _(maps to PRD XPROFILE-AC-04)_: Given `state = data` _(Arrange)_; When `button[data-cy="x-profile-detail-v1_detail_data-btn-contact"]` is clicked _(Act)_; Then `clickedContact` is emitted (via `onClickedContact()`) _(Assert)_.

###### Error Handling & Edge Cases

- When the shared user data is unavailable, the parent `feature` keeps `state = loading`.

### 🧩 'feature' Library Specification

#### Lib Name

`shared-feature-ng-x-profile`

#### Exported Components

Two `feature` components — one per `ui` component — so pages compose the card and the detail independently.

##### Component: `V1XProfileCardFeaComponent`

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

## 🧳 User Experience & Flows (Technical & Frontend Perspective)

### `V1XProfileCardFeaComponent`

#### Data flow

- **Independent data** — `V1UserFacade.getUser(baseUrl, userId, …)` in `_xDataFetch` (reset in `_xDataReset`; awaited via `userLoaded$` in `_xFacadesPre` + `_xFacadesLoadesValidation`; `userError$` watched in `_xFacadesAddErrorListeners`).
- **Dependency chain** — none.
- **On all ready** (`_xInitOrUpdateAfterAllDataReady`, once) — set `V1XProfileCardComponent.data` from `userData$`, `showCountry`/`icoPlaceholder` from DEP config; the card's `state` becomes `data`.
- **Encapsulated functions / util** — none.

#### Interaction flows

- **Card "view details"** — card emits `clickedDetails` → `onClickedDetails()` re-emits `clickedDetails(userId)` → the composing page navigates (outside the functionality).

#### Background flows (async)

_None._

#### Decision logic

_None._

### `V1XProfileDetailFeaComponent`

#### Data flow

- **Independent data** — `V1UserFacade.getUser(...)` in `_xDataFetch`; awaited via `userLoaded$`.
- **Dependency chain** — none.
- **On all ready** (once) — set `V1XProfileDetailComponent.data` from `userData$`; `state = data`, or `empty` when the detail is absent.
- **Encapsulated functions / util** — none.

#### Interaction flows

- **Detail "contact"** — detail emits `clickedContact` → `onClickedContact()` re-emits `clickedContact(userId)` → handled by the page.

#### Background flows (async)

_None._

#### Decision logic

_None._

## ❓ Open Technical Questions

- Should the card and detail share one `feature` with a `dataType` switch instead of two? (Current choice: two components, matching the two views.)
