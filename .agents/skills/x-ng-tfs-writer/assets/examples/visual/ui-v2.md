<!-- The SECOND live version of the SAME lib as ui-v1.md (`shared-ui-ng-x-profile`). Both ship at once, so both stay documented in their own file: consumers still on v1 read ui-v1.md, new consumers read this one. Its FR/BR numbering restarts at 01 because the owner segment differs (CARDV2, not CARDV1) — nothing collides and nothing was renumbered. -->

### 🖼️ 'ui' Library Specification

- **Last Updated** (YYYY-MM-DD): 2026-07-26
- **Last Verified** (YYYY-MM-DD): 2026-07-26

#### Lib Name

`shared-ui-ng-x-profile` — `src/lib/v2/`

#### Exported Components

One component. v2 was cut for a **breaking input change on the card**: the boolean `showCountry` became a `meta` object, so extra rows can be toggled without another breaking change. The detail was not affected and stays v1-only — a consumer that wants the v2 card and the detail imports `V2XProfileCardComponent` and `V1XProfileDetailComponent` from the same lib.

##### Component: `V2XProfileCardComponent`

```ts
@Component(...)
export class V2XProfileCardComponent extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

Renders a compact profile card (avatar, display name, and the meta rows enabled by `meta`) and emits a "view details" intent. Single-view component: `dataType` fixed at `'one'`.

###### Inputs

Common: `state`, `dataType` (default `'one'`, never changes).

- `data: InputSignal<V1User_MapUser>` — _(JSDoc)_ Required. The user to render.
- `meta: InputSignal<V2XProfile_CardMeta>` — _(JSDoc)_ Optional. Which meta rows to render: `{ country: boolean; joinedDate: boolean }`. Default `{ country: true, joinedDate: false }`. **Replaces v1's `showCountry` boolean** — that is the breaking change v2 exists for.
- `icoPlaceholder: InputSignal<string>` — _(JSDoc)_ Optional. Fallback avatar icon path. Default `'./assets/images/libs/shared/x-profile_ico-placeholder.svg'` (the parent `feature` overrides it from DEP config).

###### Outputs

- `clickedDetails: OutputEmitterRef<void>` — _(JSDoc)_ Emitted from `onClickedDetails()` when the "view details" button is clicked.

###### Rendering Rules

- `state = loading`: `section[data-cy="x-profile-card-v2_card_loading"]` — skeleton only.
- `state = data`: `section[data-cy="x-profile-card-v2_card_data"]` with:
  - `img[data-cy="x-profile-card-v2_card_data-avatar"]` — bound to `data.avatarUrl`, falling back to `icoPlaceholder`.
  - `h3[data-cy="x-profile-card-v2_card_data-name"]` — the display name: first name plus initial, derived from `data.fullName` (via `x_profile.name_h3`). Never the full name — the same PII rule as v1.
  - `span[data-cy="x-profile-card-v2_card_data-country"]` — the country (via `x_profile.country_label`); rendered only when `meta().country`.
  - `span[data-cy="x-profile-card-v2_card_data-joined"]` — the joined date (via `x_profile.joined_label`); rendered only when `meta().joinedDate`.
  - `button[data-cy="x-profile-card-v2_card_data-btn-details"]` — label via `x_profile.details_btn`.

###### DEP Styles (CSS variables)

Unchanged from v1 — the CSS class carries **no** version segment, so v1 and v2 share it and its DEP variables:

```scss
.e-x-profile-card {
  --e-x-profile-card--bg-color: var(--e-day-lighter-color);
  --e-x-profile-card--color: var(--e-night-color);
}
```

###### Functional Requirements & Business Rule Breakdown

Numbering restarts at `01` — the owner is `CARDV2`, so none of these collide with `CARDV1`'s live or burned numbers.

- **XPROFILE_CARDV2_FR-01** _(maps to PRD XPROFILE-AC-01)_: Test rendered elements; based on `state`.
  - **XPROFILE_CARDV2_BR-01**: Given no `data` _(Arrange)_; Then `state = loading` and `[data-cy="x-profile-card-v2_card_loading"]` is displayed _(Assert)_.
  - **XPROFILE_CARDV2_BR-02** _(maps to PRD XPROFILE-AC-01)_: Given `data` is defined and `meta = { country: true, joinedDate: true }` _(Arrange)_; When `state = data` _(Act)_; Then the avatar, name, country and joined date are all rendered _(Assert)_.
  - **XPROFILE_CARDV2_BR-03**: Given `meta = { country: false, joinedDate: false }` _(Arrange)_; When `state = data` _(Act)_; Then neither `[data-cy="x-profile-card-v2_card_data-country"]` nor `[data-cy="x-profile-card-v2_card_data-joined"]` is rendered _(Assert)_.
  - **XPROFILE_CARDV2_BR-04** _(maps to PRD XPROFILE-AC-07)_: Given `data.fullName = 'Ada Lovelace'` _(Arrange)_; When `state = data` _(Act)_; Then `[data-cy="x-profile-card-v2_card_data-name"]` renders `'Ada L.'` — first name plus initial, never the full name _(Assert)_.
- **XPROFILE_CARDV2_FR-02** _(maps to PRD XPROFILE-AC-05)_: Test output emits.
  - **XPROFILE_CARDV2_BR-05** _(maps to PRD XPROFILE-AC-05)_: Given `state = data` _(Arrange)_; When `button[data-cy="x-profile-card-v2_card_data-btn-details"]` is clicked _(Act)_; Then `clickedDetails` is emitted (via `onClickedDetails()`) _(Assert)_.

> The ACs carry **no** version: `XPROFILE-AC-01`, `-AC-05` and `-AC-07` are the same product outcomes for both versions, so v1's and v2's BRs back-link the same ACs. A version is a technical fact about a lib, not a product one.

###### Error Handling & Edge Cases

- Missing `avatarUrl` → the `icoPlaceholder` icon is shown (same as v1).
- `meta` omitted → the default `{ country: true, joinedDate: false }` applies, matching v1's default behaviour.
