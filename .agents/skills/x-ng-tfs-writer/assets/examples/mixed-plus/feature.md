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
  - **XWALLET_CARDFEA_BR-01** _(maps to PRD XWALLET-AC-01)_: Given accounts are loaded and the wallet facade returns balance `B` for the first account's id _(Arrange)_; When the dependency chain runs and data is ready _(Act)_; Then `V1XWalletCardComponent.data` is set from `B` and `state = data` — proving the balance was fetched for the correct (first) account _(Assert)_.
  - **XWALLET_CARDFEA_BR-02** _(maps to PRD XWALLET-AC-03)_: Given the card emits `clickedTopUp` _(Arrange)_; When `onClickedTopUp()` runs _(Act)_; Then the feature emits `clickedTopUp` with the `accountId` _(Assert)_.

###### Error Handling & Edge Cases

- Error exceptions (not emitted via `hasError`): `'BLOCKED'` (HTTP 0), `'NOT_FOUND'` (HTTP 404 on balance, transient).

#### Helper Services

##### Service: `V1XWalletPollService` (`_util/x-wallet-poll.service.ts`)

Polls `getBalance` (`triggeredBy = 'polling'`) while `status = 'processing'`, stops when it changes, and surfaces a timeout. Started from `_xInitOrUpdateAfterAllDataReady` (NOT the dependency chain). Public API: `start(config)`, `stop()`, `pause()`, `resume()`, `destroy()`. Lifecycle: subscribes to `onPause`/`onResume`; a `setTimeout` bounds the poll; on timeout opens the polling-timeout popup.

- **XWALLET_POLL_FR-01** _(maps to PRD XWALLET-AC-04)_: Test polling lifecycle.
  - **XWALLET_POLL_BR-01** _(maps to PRD XWALLET-AC-04)_: Given `status = 'processing'` _(Arrange)_; When poll ticks fire _(Act)_; Then the exposed balance/badge refreshes on each tick and polling stops once a tick's `status` is no longer `'processing'` (the exposed state reflects the final data) _(Assert)_.
  - **XWALLET_POLL_BR-02**: Given polling is active _(Arrange)_; When `onPause` emits _(Act)_; Then polling pauses — the exposed balance no longer refreshes until resume _(Assert)_.

##### Service: `V1XWalletSyncService` (`_util/x-wallet-sync.service.ts`)

Periodically refreshes only the `amount` on an isolated instance (`…_liveSync`), never triggering the component's ready callback. Started from `_xInitOrUpdateAfterAllDataReady`. Public API: `init()`, `destroy()`. Lifecycle: `setInterval` per account; clears on `onPause`, restarts on `onResume`.

- **XWALLET_SYNC_FR-01** _(maps to PRD XWALLET-AC-06)_: Test live-refresh isolation.
  - **XWALLET_SYNC_BR-01** _(maps to PRD XWALLET-AC-06)_: Given `init()` ran _(Arrange)_; When a tick's response has `amount = 42` _(Act)_; Then the exposed balance amount updates to `42` while the rest of the card's state is unchanged (e.g. the "updated" label does not re-trigger / flicker) _(Assert)_.

#### 🧳 User Experience & Flows (Technical & Frontend Perspective)

##### `V1XWalletCardFeaComponent`

###### Data flow

- **Independent data** (`_xDataFetch`; reset in `_xDataReset`; awaited via `_xFacadesPre` + `_xFacadesLoadesValidation`; errors via `_xFacadesAddErrorListeners`)
  - `V2XWalletFacade.getAccounts(baseUrl, userId, '…_main')` → `accounts`
- **Dependency chain** (`_xBuildDependencyChain$` — one `switchMap` level)
  - `getBalance(accounts[0].id, 'app_launch')` ← needs `accounts`; waits until `entityBalanceLoaded$('…_main')` is `true`
- **On all ready** (`_xInitOrUpdateAfterAllDataReady`, fires once)
  - set `V1XWalletCardComponent.data` ← balance; `.badgeState` ← `_evaluateBadgeState(balance)`; `.icoWallet` ← DEP asset; `state = data`
  - start `V1XWalletSyncService.init()`; if `balance.status === 'processing'`, start `V1XWalletPollService.start(...)` (background flows — not the dependency chain)
- **Encapsulated functions / util** — `_evaluateBadgeState(balance)` (small logic → private method on the component; see Decision logic)

###### Interaction flows

- **Refresh clicked** — card emits `clickedRefresh` → `onClickedRefresh()`: if `lastRequestDate` is within the throttle window, set `showThrottlePopup = true` (no API call); else set `refreshState = 'loading'` and call `getBalance(..., 'refresh_button', ...)`. The throttle-window check lives in `_util/x-wallet-refresh.service.ts`.
- **Top-up clicked** — card emits `clickedTopUp` → `onClickedTopUp()` re-emits `clickedTopUp(accountId)`; the page routes.

###### Background flows (async)

- **Polling** → `V1XWalletPollService` (`_util/x-wallet-poll.service.ts`): start / tick / stop / pause / resume / timeout. Started from `_xInitOrUpdateAfterAllDataReady` when `status = 'processing'`.
- **Live sync** → `V1XWalletSyncService` (`_util/x-wallet-sync.service.ts`): init / tick / pause / resume / destroy; updates only `amount`.

###### Decision logic

- **`_evaluateBadgeState(balance)`** (private method on the feature — logic is small): `status = 'processing'` → `'processing'`; else if the amount changed since last seen → `'updated'` (auto-hide after 15s); else → `'hidden'`.
