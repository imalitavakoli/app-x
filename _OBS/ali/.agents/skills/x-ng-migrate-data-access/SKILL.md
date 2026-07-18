---
name: x-ng-migrate-data-access
description: Migrate a data-access lib to have narrow memoized selectors and be cache-aware. USE WHEN the user wants to migrate, upgrade, or modernize a data-access lib to the new standards, add caching or TTL support, add narrow selectors, make a data-access lib cache-aware, or bring a data-access lib in line with the latest architecture. Trigger words include "migrate data-access", "add caching to data-access", "narrow selectors", "cache-aware", "upgrade data-access", "modernize ngrx state". Always use this skill even if the user just says "migrate" in the context of a data-access lib.
---

# Migrate Data-Access Lib to Cache-Aware Architecture

This skill migrates an existing `shared-data-access-ng-*` lib from the legacy flat state shape to the new cache-aware architecture with narrow memoized selectors.

## Before You Start

Ask the user:

> Which data-access lib do you want to migrate? (e.g., `shared-data-access-ng-translations`, `shared-data-access-ng-insights`)

Then determine:

1. **Is it single-instance or multi-instance?**
   - **Single-instance**: The state is a flat object (uses `createFeature()` / `createReducer()` — no `EntityAdapter`). Example: `ng-translations`.
   - **Multi-instance**: The state uses NgRx `EntityAdapter` / `EntityState` to manage multiple entity instances by ID. Example: `ng-insights`.

2. **Identify the version folder** — e.g., `v1/`, `v2/`, `v3/` inside `src/lib/`.

3. **Identify all data-keys** — these are the keys in the `Loadeds`, `Errors`, and `Datas` interfaces (e.g., `translations`, `allLangs`, `selectedLang`).

4. **Identify mutation actions** — actions that are NOT `get*` (e.g., `patchSelectedLang`). These need special cache invalidation handling.

Then ask the user:

> What should the **default TTL** (Time-To-Live) be for cached data, in milliseconds?
> (e.g., `300000` = 5 min, `900000` = 15 min). This value is used as `DEFAULT_TTL` in the reducer and applied to all data-keys by default.

> Which **mutation actions** (if any) should trigger cache invalidation, and for which data-keys?
> For example, `patchSelectedLang` should invalidate `['selectedLang']`. This populates the `CACHE_INVALIDATION_MAP` in the reducer. If there are no mutation actions, the map stays empty `{}`.

---

## What the Migration Does

The migration transforms a data-access lib from the **legacy flat shape** to the **cache-aware shape**. Here's the conceptual difference:

### Legacy Shape (before)

```
State/Entity {
  loadedLatest: { consumption?: boolean }          // flat
  loadeds:      { consumption?: boolean }           // flat
  errors:       { consumption?: string }            // flat
  datas:        { consumption?: SomeType }           // flat
}
```

Every new `get*()` call **wipes** the previous value. No caching. No TTL. Consumers subscribe to the whole blob and filter via `loadedLatest`.

### Cache-Aware Shape (after)

```
State/Entity extends V1Base_One {
  cacheKeyLatest:  { consumption: 'loc=1&from=...' }                    // tracks latest call
  cacheTimestamps: { consumption: { 'loc=1&from=...': 1717100000000 } } // when each entry was fetched
  ttls:            { consumption: 900000 }                               // TTL in ms per key
  cacheMaskedKeys: Set<string>                                           // hide keys from selectors
  loadedLatest:    { consumption?: boolean }                              // same
  loadeds:         { consumption: { 'loc=1&from=...': true } }           // keyed by cache key
  errors:          { consumption: { 'loc=1&from=...': 'err' } }          // keyed by cache key
  datas:           { consumption: { 'loc=1&from=...': SomeType } }       // keyed by cache key
}
```

Effects use `_runEffectByCache()` which checks TTL before making API calls. Narrow selectors resolve `cacheKeyLatest` to return the data for the most recent call only. Consumers subscribe to exactly the data they need.

---

## Migration Steps

Follow these files **in order** — each file depends on the previous ones.

> Read the reference examples in `references/` for the complete before/after for both lib types. Use them as your primary guide when migrating each file.

### Step 1 — `*.interfaces.ts`

Read: `references/interfaces.md`

**Changes:**

1. Import base interfaces from `@eliq/shared-util-ng-bases-model`:
   - `V1Base_CacheTimestamps`, `V1Base_Ttls`, `V1Base_LoadedLatest`, `V1Base_Loadeds`, `V1Base_Errors`, `V1Base_Datas`
2. Add **cache-related interfaces** — `CacheTimestamps` (extending `V1Base_CacheTimestamps`) and `Ttls` (extending `V1Base_Ttls`).
3. Split the existing flat `Loadeds`/`Errors`/`Datas` into two groups:
   - **Raw** (cache-keyed, `Record<string, T>`) — used internally by the reducer. Name them `_RawLoadeds`, `_RawErrors`, `_RawDatas`. They extend `V1Base_Loadeds`, `V1Base_Errors`, `V1Base_Datas`.
   - **Resolved** (flat, `T | undefined`) — used by consumers. Keep the existing names (`_Loadeds`, `_Errors`, `_Datas`).
4. Add `LoadedLatest` interface extending `V1Base_LoadedLatest`.
5. Add `cacheKey: string` to success/failure action interfaces.
6. Add `CacheHitAction` interface: `{ relatedTo: ..., cacheKey: string }`.
7. Export `ResponseIsRelatedTo` type (if it was previously unexported).

### Step 2 — `*.actions.ts`

Read: `references/actions.md`

**Changes:**

1. Import `CacheHitAction`, `Ttls`, and `ResponseIsRelatedTo` interfaces.
2. Add cache actions to the `createActionGroup`:
   - `cacheHit` — dispatched when a cache hit is detected (no API call needed).
   - `configureTtl` — configure TTL per data-key.
   - `cacheInvalidate` — wipe cached data for specific data-keys.
   - `cacheMask` — mask all data keys (selectors return `undefined` until next `get*` unmasks).
3. Add `cacheKey` to the `success` and `failure` action props.
4. For **multi-instance** libs, actions use `props<{ id: string; ... }>()` wrapper.
5. For **single-instance** libs, cache actions use flat props (no `id` wrapper), and `cacheMask`/`reset` use `emptyProps()`.

### Step 3 — `*.reducer.ts`

Read: `references/reducer.md`

**Changes:**

1. Import base reducer helpers from `@eliq/shared-util-ng-bases`:
   - `v1BaseReducerSetLoading`, `v1BaseReducerOnSuccess`, `v1BaseReducerOnFailure`, `v1BaseReducerOnCacheHit`, `v1BaseReducerInvalidate`, `v1BaseReducerConfigureTtl`
   - For multi-instance only: `v1BaseReducerEntityValidateId`, `v1BaseReducerEntityReset`
2. Import `V1Base_One` from `@eliq/shared-util-ng-bases-model`.
3. Add a **"Basic Constants"** section right after imports, containing (in order):
   - `DEFAULT_TTL` — the default TTL value (from user input).
   - `ALL_DATA_KEYS` — array of all data-key names (used by `cacheMask`).
   - `CACHE_INVALIDATION_MAP` — maps mutation action names to the data-keys they invalidate (from user input).
   - `LOG_PREFIX` — (multi-instance only) a string for error logging.
4. **"Feature State Interface"** section: update the state/entity interface to extend `V1Base_One`, adding `cacheKeyLatest`, `cacheTimestamps`, `ttls`, `loadedLatest`, `loadeds`, `errors`, `datas`, `cacheMaskedKeys`.
5. **"Initial shape"** section: define initial state using `DEFAULT_TTL` for all TTL values (not hardcoded numbers). Initialize `cacheTimestamps`, `loadeds`, `errors`, `datas` with `{ dataKey1: {}, dataKey2: {} }` (empty `Record`s per key).
6. For **multi-instance**: keep `EntityAdapter` but update entity shape and `createInitialEntity()` function.
7. For **single-instance**: keep `createFeature()` pattern.
8. **"Feature State Reducer"** section: replace inline loading/success/failure logic with base helpers:
   - `on(getX, ...)` → call `v1BaseReducerSetLoading(state, dataKey, action, cacheKeyPrefix)`
   - `on(success, ...)` → call `v1BaseReducerOnSuccess(state, relatedTo, cacheKey, data)`
   - `on(failure, ...)` → call `v1BaseReducerOnFailure(state, relatedTo, cacheKey, error)`
9. Add handlers for `cacheHit`, `configureTtl`, `cacheInvalidate`, `cacheMask`.
10. For mutation actions (e.g., `patchSelectedLang`): call `v1BaseReducerInvalidate` with the `CACHE_INVALIDATION_MAP`.

**File section ordering:**

```
Imports
──────────────────────────────────
Basic Constants (DEFAULT_TTL, ALL_DATA_KEYS, CACHE_INVALIDATION_MAP, LOG_PREFIX)
──────────────────────────────────
Feature State Interface
──────────────────────────────────
Initial shape
──────────────────────────────────
Feature State Reducer
──────────────────────────────────
```

**Key difference between single-instance and multi-instance:**

- **Single-instance**: spread `...state` and `...v1BaseReducerSetLoading(state, ...)` directly.
- **Multi-instance**: use `adapter.updateOne({ id: ..., changes: v1BaseReducerSetLoading(state.entities[id]!, ...) }, { ...state })`.

### Step 4 — `*.selectors.ts`

Read: `references/selectors.md`

This is the core of the migration — adding narrow memoized selectors.

**Changes:**

1. Import resolved flat interfaces (`_Loadeds`, `_Errors`, `_Datas`).
2. Keep existing raw selectors but rename section headers for clarity (Raw vs Resolved).
3. Add **narrow selectors** for each data-key, in three groups:
   - **Datas (narrow)** — one selector per data-key (e.g., `selectTranslationsData`).
   - **Loadeds (narrow)** — one selector per data-key (e.g., `selectTranslationsLoaded`).
   - **Errors (narrow)** — one selector per data-key (e.g., `selectTranslationsError`).
4. Add **resolved selectors** that flatten the cache-keyed structure:
   - `selectResolvedLoadeds` / `selectEntityResolvedLoadeds`
   - `selectResolvedErrors` / `selectEntityResolvedErrors`
   - `selectResolvedDatas` / `selectEntityResolvedDatas`
5. Update `selectHasError` / `selectEntityHasError` to iterate over `Record<string, T>` cache records.

**Narrow selector pattern — single-instance (using `createFeature()`):**

```ts
export const selectTranslationsData = createSelector(
  fromReducer.feature.selectDatas,
  fromReducer.feature.selectCacheKeyLatest,
  fromReducer.feature.selectCacheMaskedKeys,
  (datas, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('translations')) return undefined;
    const key = latestKeys['translations'];
    return key ? datas.translations[key] : undefined;
  },
);
```

**Narrow selector pattern — multi-instance (using `EntityAdapter`):**

```ts
export const selectEntityTranslationsData = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: Entity) => {
    if (state.cacheMaskedKeys?.has('translations')) return undefined;
    const key = state.cacheKeyLatest['translations'];
    return key ? state.datas.translations[key] : undefined;
  });
};
```

### Step 5 — `*.facade.ts`

Read: `references/facade.md`

**Changes:**

1. Extend `V1BaseFacade` from `@eliq/shared-util-ng-bases` (if not already).
2. Reorganize selectors into sections:
   - **Others** — `loadedLatest$`, `hasError$`, etc.
   - **Raw** — `rawLoadeds$`, `rawErrors$`, `rawDatas$` (or `rawEntityLoadeds$`, etc.)
   - **Resolved** — `loadeds$`, `errors$`, `datas$` (or `entityLoadeds$`, etc.)
   - **Narrow (Datas)** — one observable per data-key.
   - **Narrow (Loadeds)** — one observable per data-key.
   - **Narrow (Errors)** — one observable per data-key.
3. Add cache action methods:
   - `configureTtl(ttls)` — configure TTL per data-key.
   - `cacheInvalidate(keys)` — wipe cached data for specific data-keys.
   - `cacheMask()` — mask all data keys.
4. For **single-instance**, selectors are class properties (not methods).
5. For **multi-instance**, selectors are methods that take `id = 'g'`.

### Step 6 — `*.effects.ts`

Read: `references/effects.md`

**Changes:**

1. Extend `V1BaseEffects` from `@eliq/shared-util-ng-bases` (if not already).
2. Replace direct API calls with `this._runEffectByCache<StateType, any>({...})`.
3. Each effect now provides:
   - `relatedTo` — the data-key name.
   - `cacheKeyPrefix` — usually same as `relatedTo`.
   - `cacheKeyParams` — the action's params (spread `{ ...action }`).
   - `stateSelector` — selector for the state (for single-instance) or entity (for multi-instance).
   - `getCacheTimestamps` — function to get timestamps from state.
   - `getTtl` — function to get TTL from state.
   - `apiFn` — the actual API call.
   - `onSuccess` / `onFailure` / `onCacheHit` — action creators (now include `cacheKey`).
4. Mutation effects (e.g., `patchSelectedLang$`) do NOT use cache — they call the API directly and pass `cacheKey: ''` in success/failure.
5. **Change `concatMap` to `mergeMap`** for all GET effects (e.g., `getTranslations$`, `getAllLangs$`). The cache layer handles deduplication, so `mergeMap` allows parallel in-flight requests for different cache keys. **Keep `concatMap`** for mutation effects (e.g., `patchSelectedLang$`) — mutations must execute sequentially to preserve ordering guarantees.

### Step 7 — `README.md`

Update the README to document:

- Narrow selectors usage (recommended pattern).
- `v1BaseCacheGetData` helper for the `state$`/`entity$` alternative pattern.
- Cache configuration (`configureTtl`, `cacheInvalidate`, `cacheMask`).
- Code examples showing both recommended (narrow) and alternative (state$) subscription patterns.

### Step 8 — `index.ts` (barrel)

Ensure the barrel exports all new types and the `ResponseIsRelatedTo` type.

---

## Verification

After migration:

1. Run `pnpm nx build <project-name>` to verify compilation.
2. Run `pnpm nx test <project-name>` to verify existing tests pass.
3. Search for consumers of the facade to ensure backward compatibility — the `state$`/`entity$`, `loadedLatest$`/`entityLoadedLatest$`, `loadeds$`/`entityLoadeds$`, `errors$`/`entityErrors$`, `datas$`/`entityDatas$`, and `hasError$`/`entityHasError$` selectors should still work.
4. Consumers that use `state.loadeds.someKey` directly will need to switch to narrow selectors or use `v1BaseCacheGetData(state, 'someKey')`.
