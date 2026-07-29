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

> **Mutation:** `patchAccountLabel` re-defines the same `accounts` data-key that `getAccounts` populates. So the reducer declares `CACHE_INVALIDATION_MAP = { patchAccountLabel: ['accounts'] }` and, on `patchAccountLabel`, applies `v1BaseReducerInvalidate(state, ['accounts'])` inside the adapter's `updateOne` (its effect uses `concatMap` → `success`/`failure` with an empty `cacheKey`) — so the next `getAccounts` for that instance refetches instead of serving a stale cache hit.

#### Functional Requirements & Business Rule Breakdown

`describe`↔FR, `it`↔BR.

- **XWALLET_DA_FR-01** _(maps to PRD XWALLET-AC-01, XWALLET-AC-05)_: Test per-instance state transitions.
  - **XWALLET_DA_BR-01** _(maps to PRD XWALLET-AC-05)_: Given `getBalance` fails with `'BLOCKED'` _(Arrange)_; Then `entityHasError$(id)` treats it as non-emitting (exception) _(Assert)_.
- **XWALLET_DA_FR-02**: Test mutation cache-invalidation. _(New technical scenario — suggest a PRD AC for renaming an account.)_
  - **XWALLET_DA_BR-02**: Given instance `id`'s `accounts` is cached _(Arrange)_; When `patchAccountLabel(...)` succeeds _(Act)_; Then that instance's `accounts` key is invalidated (per `CACHE_INVALIDATION_MAP = { patchAccountLabel: ['accounts'] }`, via `v1BaseReducerInvalidate` inside the adapter's `updateOne`) and the next `getAccounts` for that instance refetches _(Assert)_.
