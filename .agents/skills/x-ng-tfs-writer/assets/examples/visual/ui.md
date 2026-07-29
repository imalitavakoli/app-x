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
