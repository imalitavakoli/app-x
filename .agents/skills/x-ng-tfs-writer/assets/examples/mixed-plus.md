# TFS — ng-x-wallet

- **Last Updated**: 2026-07-26
- **Owner**: Ali

## ℹ️ Overview

### Functionality Name

`ng-x-wallet`

### Functionality Classification

**mixed+** — uses `map` + `data-access` + `ui` + `feature` + `page` libs.

### Domain

`shared` — usable by any app; its libs live under `libs/shared/…`.

### Rationale

x-wallet fetches its own data (accounts, then the selected account's balance), presents an interactive balance card, refreshes the balance live, polls while the balance is processing, and is itself an app page with an order-of-one child route — so it needs all five lib types.

## 🔗 Existing Dependencies & Reuse

> Only libs that do NOT belong to this functionality (its own `map`/`data-access`/`ui`/`feature`/`page` libs are specified below, not listed here).

### Used map / data-access libs

_NONE_ — x-wallet's own `map`/`data-access` do not depend on other functionalities' `map`/`data-access` libs. (Base URL / user id are provided by the base `feature` class, not fetched here.)

### Used ui / feature / page libs

- `shared-ui-ng-popup`: refresh-throttle and polling-timeout popups.

### Used util libs

- `shared-util-ng-bases` → `V1BaseUiComponent`, `V1BaseMap`, `V1BaseFacade`, `V1BaseEffects`.
- `shared-util-ng-bases-consumer` → `V2BaseFeatureExtComponent`, `V2BasePageParentComponent`, `V2BasePageChildComponent`.
- `shared-util-ng-capacitor` → `V1CapacitorCoreService` (`onPause`/`onResume`, for the poll & sync services).

## 📚 Library Breakdown

### 🗺️ 'map' Library Specification

#### Lib Name

`shared-map-ng-x-wallet`

#### Class & Methods

`V1XWallet extends V1BaseMap`:

- `getAccounts(url, userId, lib): Observable<V1XWallet_MapAccount[]>` — `GET {url}/users/{userId}/wallet/accounts`.
- `getBalance(url, accountId, triggeredBy, lib): Observable<V1XWallet_MapBalance>` — `GET {url}/wallet/accounts/{accountId}/balance?triggered_by={triggeredBy}`.
- `patchAccountLabel(url, accountId, label, lib): Observable<V1XWallet_MapAccount>` — `PATCH {url}/wallet/accounts/{accountId}` with body `{ label }`; renames the account and returns it.

#### Interfaces

- `V1XWallet_ApiAccount` / `V1XWallet_MapAccount` — exact server shape vs `{ id, label }`.
- `V1XWallet_ApiBalance` / `V1XWallet_MapBalance` — server shape vs `{ amount, currency, status, lastRequestDate }`; `status: 'up-to-date' | 'processing'` (parsed here from the server's raw status field so the `ui` receives a clean enum).

#### Functional Requirements & Business Rule Breakdown

`describe`↔FR, `it`↔BR.

- **XWALLET_MAP_FR-01** _(maps to PRD XWALLET-AC-01)_: Test mapping.
  - **XWALLET_MAP_BR-01**: Given a balance response whose raw status is "processing" _(Arrange)_; When `getBalance` completes _(Act)_; Then it maps to `{ status: 'processing', … }` _(Assert)_.

#### Error Handling & Edge Cases

- HTTP `0` → normalised `'BLOCKED'`; HTTP `404` on balance → `'NOT_FOUND'` (transient, pre-provisioning).

### 🗄️ 'data-access' Library Specification

#### Lib Name

`shared-data-access-ng-x-wallet`

#### Object Structure

**multi-instance** (cache-aware). Chosen because the wallet card may be initialized **multiple times on one page** (one per account), so each instance needs its own isolated, cache-keyed state (`createIfNotExists(instanceName)`).

> **Note!** Not a pure CRUD lib — reads only here. Even if a future write (e.g. top-up) had to send an `extra` payload beyond an entity, we would keep multi-instance; the entity structure is only for pure CRUD.

#### Facade API

`V2XWalletFacade extends V1BaseFacade` (the standard cache-aware multi-instance surface, keyed by instance `id`, default `'g'`):

- **Actions**: `createIfNotExists(id)`; `getAccounts(url, userId, id, lib)`; `getBalance(url, accountId, triggeredBy, id, lib)`; `patchAccountLabel(url, accountId, label, id, lib)` (mutation — see note); `configureTtl(id, ttls)`; `cacheInvalidate(id, keys)`; `cacheMask(id)`; `reset(id)`; `resetAll()`.
- **Status**: `entityLoadedLatest$(id)`, `entityHasError$(id)`, `hasEntity$(id)`.
- **Whole-state / raw**: `state$`, `allEntities$`, `entity$(id)`, `rawEntityLoadeds$(id)`, `rawEntityErrors$(id)`, `rawEntityDatas$(id)`.
- **Resolved (flat)**: `entityLoadeds$(id)`, `entityErrors$(id)`, `entityDatas$(id)`.
- **Narrow (per data-key `accounts` / `balance`)**: `entityAccountsData$(id)`, `entityAccountsLoaded$(id)`, `entityAccountsError$(id)`; `entityBalanceData$(id)`, `entityBalanceLoaded$(id)`, `entityBalanceError$(id)`.
- Instance-naming scheme: `V1XWalletCardFeaComponent_{main|liveSync}`.

#### Functional Requirements & Business Rule Breakdown

`describe`↔FR, `it`↔BR.

- **XWALLET_DA_FR-01** _(maps to PRD XWALLET-AC-01, XWALLET-AC-05)_: Test per-instance state transitions.
  - **XWALLET_DA_BR-01** _(maps to PRD XWALLET-AC-05)_: Given `getBalance` fails with `'BLOCKED'` _(Arrange)_; Then `entityHasError$(id)` treats it as non-emitting (exception) _(Assert)_.
- **XWALLET_DA_FR-02**: Test mutation cache-invalidation. _(New technical scenario — suggest a PRD AC for renaming an account.)_
  - **XWALLET_DA_BR-02**: Given instance `id`'s `accounts` is cached _(Arrange)_; When `patchAccountLabel(...)` succeeds _(Act)_; Then that instance's `accounts` key is invalidated (per `CACHE_INVALIDATION_MAP = { patchAccountLabel: ['accounts'] }`, via `v1BaseReducerInvalidate` inside the adapter's `updateOne`) and the next `getAccounts` for that instance refetches _(Assert)_.

### 🖼️ 'ui' Library Specification

#### Lib Name

`shared-ui-ng-x-wallet`

#### Exported Components

**Single-view** functionality (one balance-card view), so one component is exposed; its `dataType` is fixed at `'one'`.

##### Component: `V1XWalletCardComponent`

```ts
@Component(...)
export class V1XWalletCardComponent extends V1BaseUiComponent implements V1BaseUi_HasIt {}
```

###### Responsibility

Renders the balance amount, a status badge, and refresh/top-up actions for one account. Handles `loading` / `data`.

###### Inputs

Common: `state`, `dataType` (default `'one'`).

- `data: InputSignal<V1XWallet_MapBalance>` — _(JSDoc)_ Required. The balance to render.
- `badgeState: InputSignal<'processing' | 'updated' | 'hidden'>` — _(JSDoc)_ Optional. Controls the status badge. Default `'hidden'`.
- `refreshState: InputSignal<'idle' | 'loading' | 'disabled'>` — _(JSDoc)_ Optional. Controls the refresh button. Default `'idle'`.
- `showThrottlePopup: ModelSignal<boolean>` — _(JSDoc)_ Two-way; opens the refresh-throttle popup; reset to `false` on close.
- `icoWallet: InputSignal<string>` — _(JSDoc)_ Optional. Wallet icon path. Default `'./assets/images/libs/shared/x-wallet_ico-wallet.svg'` (overridden by the `feature` from DEP config).

###### Outputs

- `clickedRefresh: OutputEmitterRef<void>` — _(JSDoc)_ Emitted from `onClickedRefresh()`.
- `clickedTopUp: OutputEmitterRef<void>` — _(JSDoc)_ Emitted from `onClickedTopUp()`.

###### Rendering Rules

- `state = data`: `[data-cy="x-wallet-card-v1_card_data"]` with:
  - `span[data-cy="x-wallet-card-v1_card_data-amount"]` — the formatted amount.
  - `div[data-cy="x-wallet-card-v1_card_data-badge"]` — per `badgeState` (`'processing'` → "requesting" via `x_wallet.badge_requesting`; `'updated'` → via `x_wallet.badge_updated`).
  - `button[data-cy="x-wallet-card-v1_card_data-btn-refresh"]` — per `refreshState`; label via `x_wallet.refresh_btn`.
  - `button[data-cy="x-wallet-card-v1_card_data-btn-topup"]` — label via `x_wallet.topup_btn`.

###### DEP Styles (CSS variables)

```scss
.e-x-wallet-card {
  --e-x-wallet-card--amount-color: var(--e-night-color);
  --e-x-wallet-card--badge-color: var(--e-accent-color);
}
```

###### Functional Requirements & Business Rule Breakdown

- **XWALLET_CARD_FR-01** _(maps to PRD XWALLET-AC-02)_: Test badge + refresh visuals.
  - **XWALLET_CARD_BR-01** _(maps to PRD XWALLET-AC-02)_: Given `badgeState = 'processing'` _(Arrange)_; When `state = data` _(Act)_; Then `[data-cy="x-wallet-card-v1_card_data-badge"]` shows the "requesting" badge (`x_wallet.badge_requesting`) _(Assert)_.
  - **XWALLET_CARD_BR-02**: Given `refreshState = 'loading'` _(Arrange)_; Then the refresh button is disabled with the animating icon class _(Assert)_.
- **XWALLET_CARD_FR-02** _(maps to PRD XWALLET-AC-03)_: Test output emits.
  - **XWALLET_CARD_BR-03** _(maps to PRD XWALLET-AC-03)_: Given `refreshState = 'idle'` _(Arrange)_; When `button[data-cy="x-wallet-card-v1_card_data-btn-refresh"]` is clicked _(Act)_; Then `clickedRefresh` is emitted (via `onClickedRefresh()`) _(Assert)_.

###### Error Handling & Edge Cases

- `data.status = 'processing'` with no amount yet → amount shows the last known value; badge shows "requesting".

### 🧩 'feature' Library Specification

#### Lib Name

`shared-feature-ng-x-wallet`

#### Exported Components

One `feature` component (single-view).

##### Component: `V1XWalletCardFeaComponent`

```ts
@Component(...)
export class V1XWalletCardFeaComponent extends V2BaseFeatureExtComponent implements V2BaseFeature_ExtHasIt {}
```

###### Responsibility

Fetches accounts (independent), then the selected account's balance (dependent), drives `V1XWalletCardComponent`, and — once ready — starts live-sync and (while processing) polling. Overrides `_xInitPreBeforeDom` (create instance), `_xHasRequiredInputs`, `_xDataReset`, `_xDataFetch` (independent accounts), `_xFacadesPre`/`_xFacadesLoadesValidation`, `_xBuildDependencyChain$` (dependent balance), `_xFacadesAddErrorListeners`, `_xInitOrUpdateAfterAllDataReady` (drive UI + start helpers).

###### Inputs

Common: `showErrors`.

- `userId: InputSignal<number>` — _(JSDoc)_ Required. Whose wallet to load.

###### Outputs

Common: `ready`, `allDataIsReady`, `hasError`.

- `clickedTopUp: OutputEmitterRef<string>` — _(JSDoc)_ Re-emitted from the card, with the `accountId`, via `onClickedTopUp()`; the page routes to top-up.

###### DEP Config & Assets

- **Config**: `$dataConfigDep()?.libs?.xWalletV1?.pollIntervalSec` → poll interval; `?.liveSyncIntervalSec` → live-sync interval.
- **Assets**: `$dataConfigDep()?.assets?.lib_x_wallet_ico_wallet` → the card's `icoWallet` input.

###### Functional Requirements & Business Rule Breakdown

- **XWALLET_CARDFEA_FR-01** _(maps to PRD XWALLET-AC-01)_: Test dependent fetch + wiring.
  - **XWALLET_CARDFEA_BR-01** _(maps to PRD XWALLET-AC-01)_: Given accounts are loaded _(Arrange)_; When the dependency chain runs _(Act)_; Then `getBalance` is called with the first account id and, on ready, `V1XWalletCardComponent.data` is set and `state = data` _(Assert)_.
  - **XWALLET_CARDFEA_BR-02** _(maps to PRD XWALLET-AC-03)_: Given the card emits `clickedTopUp` _(Arrange)_; When `onClickedTopUp()` runs _(Act)_; Then the feature emits `clickedTopUp` with the `accountId` _(Assert)_.

###### Error Handling & Edge Cases

- Error exceptions (not emitted via `hasError`): `'BLOCKED'` (HTTP 0), `'NOT_FOUND'` (HTTP 404 on balance, transient).

#### Helper Services

##### Service: `V1XWalletPollService` (`_util/x-wallet-poll.service.ts`)

Polls `getBalance` (`triggeredBy = 'polling'`) while `status = 'processing'`, stops when it changes, and surfaces a timeout. Started from `_xInitOrUpdateAfterAllDataReady` (NOT the dependency chain). Public API: `start(config)`, `stop()`, `pause()`, `resume()`, `destroy()`. Lifecycle: subscribes to `onPause`/`onResume`; a `setTimeout` bounds the poll; on timeout opens the polling-timeout popup.

- **XWALLET_POLL_FR-01a** _(maps to PRD XWALLET-AC-04)_: Test polling lifecycle.
  - **XWALLET_POLL_BR-01a** _(maps to PRD XWALLET-AC-04)_: Given `status = 'processing'` _(Arrange)_; When a poll tick fires _(Act)_; Then `getBalance(..., 'polling', ...)` is called and polling continues until `status !== 'processing'` _(Assert)_.
  - **XWALLET_POLL_BR-02a**: Given the app pauses _(Arrange)_; When `onPause` emits _(Act)_; Then the poll timer is cleared _(Assert)_.

##### Service: `V1XWalletSyncService` (`_util/x-wallet-sync.service.ts`)

Periodically refreshes only the `amount` on an isolated instance (`…_liveSync`), never triggering the component's ready callback. Started from `_xInitOrUpdateAfterAllDataReady`. Public API: `init()`, `destroy()`. Lifecycle: `setInterval` per account; clears on `onPause`, restarts on `onResume`.

- **XWALLET_SYNC_FR-01a** _(maps to PRD XWALLET-AC-06)_: Test live-refresh isolation.
  - **XWALLET_SYNC_BR-01a** _(maps to PRD XWALLET-AC-06)_: Given `init()` ran _(Arrange)_; When a tick's response has `amount = 42` _(Act)_; Then only `$cardData.amount` updates and the ready callback is NOT re-run _(Assert)_.

### 📄 'page' Library Specification

#### Lib Name

`shared-page-ng-x-wallet`

#### Routes

`lib.routes.ts`: parent `''` → `V1XWalletPageComponent`, child `:id` → `V1XWalletOnePageComponent` (the child is an "One" page — it shows one account's detail).

#### Parent Page: `V1XWalletPageComponent`

```ts
@Component(...)
export class V1XWalletPageComponent extends V2BasePageParentComponent {}
```

- Required URL query params: none (loads for the logged-in user). Starter lib: `V1XWalletCardFeaComponent` (`_xHasInitStarterLibs` / `onReadyStarterLib1`); the child `router-outlet` renders only after it's ready. Navigation: on the feature's `clickedTopUp`, navigates to the top-up route. Errors aggregated via `$errors` / `xOnError`.

#### Child Page: `V1XWalletOnePageComponent`

```ts
@Component(...)
export class V1XWalletOnePageComponent extends V2BasePageChildComponent {}
```

- `_pageName = 'Wallet'`, `_urlRoot = '/x-wallet'`, `$id` from the `:id` route param (the account). Composes the detail feature; `xOnError` forwards to the parent.

#### Functional Requirements & Business Rule Breakdown

- **XWALLET_PAGE_FR-01** _(maps to PRD XWALLET-AC-07)_: Test navigation.
  - **XWALLET_PAGE_BR-01** _(maps to PRD XWALLET-AC-07)_: Given the card feature emits `clickedTopUp(accountId)` _(Arrange)_; When the parent handles it _(Act)_; Then it navigates to the top-up route for that account _(Assert)_.

## 🧳 User Experience & Flows (Technical & Frontend Perspective)

### `V1XWalletCardFeaComponent`

#### Data flow

- **Independent data** (`_xDataFetch`; reset in `_xDataReset`; awaited via `_xFacadesPre` + `_xFacadesLoadesValidation`; errors via `_xFacadesAddErrorListeners`)
  - `V2XWalletFacade.getAccounts(baseUrl, userId, '…_main')` → `accounts`
- **Dependency chain** (`_xBuildDependencyChain$` — one `switchMap` level)
  - `getBalance(accounts[0].id, 'app_launch')` ← needs `accounts`; waits until `entityBalanceLoaded$('…_main')` is `true`
- **On all ready** (`_xInitOrUpdateAfterAllDataReady`, fires once)
  - set `V1XWalletCardComponent.data` ← balance; `.badgeState` ← `_evaluateBadgeState(balance)`; `.icoWallet` ← DEP asset; `state = data`
  - start `V1XWalletSyncService.init()`; if `balance.status === 'processing'`, start `V1XWalletPollService.start(...)` (background flows — not the dependency chain)
- **Encapsulated functions / util** — `_evaluateBadgeState(balance)` (small logic → private method on the component; see Decision logic)

#### Interaction flows

- **Refresh clicked** — card emits `clickedRefresh` → `onClickedRefresh()`: if `lastRequestDate` is within the throttle window, set `showThrottlePopup = true` (no API call); else set `refreshState = 'loading'` and call `getBalance(..., 'refresh_button', ...)`. The throttle-window check lives in `_util/x-wallet-refresh.service.ts`.
- **Top-up clicked** — card emits `clickedTopUp` → `onClickedTopUp()` re-emits `clickedTopUp(accountId)`; the page routes.

#### Background flows (async)

- **Polling** → `V1XWalletPollService` (`_util/x-wallet-poll.service.ts`): start / tick / stop / pause / resume / timeout. Started from `_xInitOrUpdateAfterAllDataReady` when `status = 'processing'`.
- **Live sync** → `V1XWalletSyncService` (`_util/x-wallet-sync.service.ts`): init / tick / pause / resume / destroy; updates only `amount`.

#### Decision logic

- **`_evaluateBadgeState(balance)`** (private method on the feature — logic is small): `status = 'processing'` → `'processing'`; else if the amount changed since last seen → `'updated'` (auto-hide after 15s); else → `'hidden'`.

## ❓ Open Technical Questions

- Confirm the refresh throttle window and the polling timeout.
- Confirm whether multiple accounts render multiple cards on the parent page (multi-instance) or only the first.
