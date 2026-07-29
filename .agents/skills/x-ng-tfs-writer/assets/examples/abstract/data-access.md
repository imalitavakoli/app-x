### 🗄️ 'data-access' Library Specification

#### Lib Name

`shared-data-access-ng-user-geo`

#### Object Structure

**single-instance** (cache-aware). Chosen because geo is resolved once per page for the logged-in user — the lib is initialized a single time, so one cache-aware state object suffices (no instance keying).

> **Note!** Not a CRUD lib — it is read-only. The entity structure is only for pure CRUD; even a write that needed an `extra` payload beyond an entity would use single-/multi-instance, not entity.

#### Facade API

`V1UserGeoFacade extends V1BaseFacade` (the standard cache-aware single-instance surface):

- **Actions**: `getGeo(url, userId, lib)`; `patchCurrency(url, userId, currency, lib)` (mutation — see note); `configureTtl({ geo })`; `cacheInvalidate(['geo'])`; `cacheMask()`; `reset()`.
- **Whole-state / status**: `state$`, `loadedLatest$`, `hasError$`.
- **Raw (cache-keyed)**: `rawLoadeds$`, `rawErrors$`, `rawDatas$`.
- **Resolved (flat)**: `loadeds$`, `errors$`, `datas$`.
- **Narrow (per data-key `geo`)**: `geoData$`, `geoLoaded$`, `geoError$`.

> **Mutation:** `patchCurrency` re-defines the same `geo` data-key that `getGeo` populates. So the reducer declares `CACHE_INVALIDATION_MAP = { patchCurrency: ['geo'] }` and, on `patchCurrency`, applies `v1BaseReducerInvalidate(state, ['geo'])` (its effect uses `concatMap` → `success`/`failure` with an empty `cacheKey`) — so the next `getGeo` refetches instead of serving a stale cache hit.

#### Functional Requirements & Business Rule Breakdown

`describe`↔FR, `it`↔BR.

- **GEO_DA_FR-01** _(maps to PRD GEO-AC-01, GEO-AC-02, GEO-AC-03, GEO-AC-04)_: Test state transitions.
  - **GEO_DA_BR-01** _(maps to PRD GEO-AC-02)_: Given `getGeo` dispatched _(Arrange)_; When the request is in flight _(Act)_; Then `geoData$` emits `undefined` (masked) — no partial data _(Assert)_.
  - **GEO_DA_BR-02** _(maps to PRD GEO-AC-01)_: Given a successful response _(Arrange)_; When it resolves _(Act)_; Then `geoData$` emits the mapped geo and `geoLoaded$` is `true` _(Assert)_.
  - **GEO_DA_BR-03** _(maps to PRD GEO-AC-03)_: Given the request fails _(Arrange)_; When it errors _(Act)_; Then `geoError$` emits the error and no stale data is served for the `geo` key _(Assert)_.
  - **GEO_DA_BR-04** _(maps to PRD GEO-AC-04)_: Given `geo` was loaded within its TTL _(Arrange)_; When `getGeo` is called again _(Act)_; Then a cache hit serves the cached data without a new API call _(Assert)_.
- **GEO_DA_FR-02**: Test mutation cache-invalidation. _(New technical scenario — suggest adding a PRD AC for the currency override.)_
  - **GEO_DA_BR-05**: Given `geo` is cached _(Arrange)_; When `patchCurrency('SEK')` succeeds _(Act)_; Then the `geo` key is invalidated (per `CACHE_INVALIDATION_MAP`) and the next `getGeo` refetches — no stale cache hit _(Assert)_.

#### Consumer usage (abstract — replaces the feature journey)

Abstract functionality — no `feature`/`ui`. A consumer (a page or a `feature` component) uses `V1UserGeoFacade` like any facade: it calls `getGeo(baseUrl, userId)` (typically from its `_xDataFetch`), awaits `geoLoaded$` / listens for `geoError$`, then reads `geoData$` once ready. (For the shape of a typical facade-driven `feature` journey — reset → fetch → await loaded → read data — see the workspace's canonical lib-structure reference.)
