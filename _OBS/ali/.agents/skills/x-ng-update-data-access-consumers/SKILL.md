---
name: x-ng-update-data-access-consumers
description: Update consumers of a newly migrated cache-aware data-access lib. USE WHEN the user just migrated a data-access lib with x-migrate-data-access and now needs to update all TS/HTML consumers. Fixes TS compilation errors and adapts consumer code to use narrow selectors, cache helpers, and the new facade API. Trigger words include "update consumers", "fix consumers", "update data-access consumers", "fix imports after migration", "update facade usage".
---

# Update Data-Access Lib Consumers After Migration

This skill updates all consumers of a data-access lib that was recently migrated to the cache-aware architecture (via the `x-migrate-data-access` skill).

## Before You Start

Ask the user:

> Which data-access lib was just migrated? (e.g., `shared-data-access-ng-insights`)

Then:

1. **Identify the facade class name** — e.g., `V3InsightsFacade`, `V1TranslationsFacade`.
2. **Determine lib type** — single-instance or multi-instance.
3. **Read the migrated lib's inner `README.md`** to understand the recommended usage patterns.
4. **Read the migrated lib's `*.facade.ts`** to see all available narrow selectors and cache action methods.

---

## Step 1 — List All Consumers

Search for all TS and HTML files that reference the facade class name in `apps/` and `libs/` folders.

```powershell
# Search for TS consumers
rg -l "FacadeClassName" apps/ libs/ --include="*.ts"

# Search for HTML consumers (async pipes using facade observables)
rg -l "facadeInstanceName\." apps/ libs/ --include="*.html"
```

**Prioritize** files that have TS compilation errors first (broken imports, type mismatches).

---

## Step 2 — Fix TS Compilation Errors

These are the most common breaking changes after migration:

### 2.1 — `state.loadeds.someKey` → `Record<string, boolean>`

**Before:** `state.loadeds.someKey` was `boolean | undefined`.
**After:** `state.loadeds.someKey` is now `Record<string, boolean>` (cache-keyed).

**Fix:** Use `v1BaseCacheGetLoaded(state, 'someKey')` from `@eliq/shared-util-ng-bases`.

### 2.2 — `state.errors.someKey` → `Record<string, string>`

**Before:** `state.errors.someKey` was `string | undefined`.
**After:** `state.errors.someKey` is now `Record<string, string>` (cache-keyed).

**Fix:** Use `v1BaseCacheGetError(state, 'someKey')` from `@eliq/shared-util-ng-bases`.

### 2.3 — `state.datas.someKey` → `Record<string, T>`

**Before:** `state.datas.someKey` was `T | undefined`.
**After:** `state.datas.someKey` is now `Record<string, T>` (cache-keyed).

**Fix:** Use `v1BaseCacheGetData(state, 'someKey')` from `@eliq/shared-util-ng-bases`.

### 2.4 — New `cacheKey` field in success/failure actions

If any consumer manually dispatches success/failure actions, they now need to include `cacheKey: string`.

### 2.5 — Type imports changed

Some interfaces have been renamed or split:

- `_Loadeds` is now the **resolved** (flat) type — still valid for consumer use.
- `_RawLoadeds` is the new **cache-keyed** type — used internally.
- New types: `_CacheTimestamps`, `_Ttls`, `_LoadedLatest`, `_CacheHitAction`.

---

## Step 3 — Adapt Consumer Patterns

After fixing TS errors, review each consumer for the following patterns:

### 3.1 — Switch to narrow selectors

When a consumer subscribes to `entity$()` or `*State$` (e.g., `translationsState$`) ONLY to extract a single data-key, switch to the new narrow selectors.

**Before (multi-instance):**

```ts
this._insightsFacade.entity$('MyComponent').subscribe((state) => {
  const data = v1BaseCacheGetData(state, 'locations');
  if (state.loadedLatest.locations && data) {
    console.log('locations:', data);
  }
});
```

**After (narrow selector):**

```ts
this._insightsFacade
  .entityLocationsData$('MyComponent')
  .pipe(filter((data) => data !== undefined))
  .subscribe((data) => {
    console.log('locations:', data);
  });
```

**Before (single-instance):**

```ts
this._translationsFacade.translationsState$.subscribe((state) => {
  const data = v1BaseCacheGetData(state, 'translations');
  if (state.loadedLatest.translations && data) {
    console.log('translations:', data);
  }
});
```

**After (narrow selector):**

```ts
this._translationsFacade.translationsData$
  .pipe(filter((data) => data !== undefined))
  .subscribe((data) => {
    console.log('translations:', data);
  });
```

> **Exception:** If the consumer uses `entity$()` or `*State$` to listen to MULTIPLE data-keys in a single subscription (e.g., using `loadedLatest` to discriminate), it may be acceptable to keep the bulk subscription — but update all data access to use `v1BaseCacheGetData(state, 'key')`, `v1BaseCacheGetLoaded(state, 'key')`, and `v1BaseCacheGetError(state, 'key')`.

### 3.2 — `loadedLatest` check semantics

**Before:** `if (state.loadedLatest.someKey !== undefined)` or `if (state.loadedLatest.someKey)`.
**After:** Must check `if (state.loadedLatest.someKey === true)`.

Why? Because `loadedLatest.someKey` can be `false` (loading in progress), `true` (loaded), or `undefined` (never dispatched). The truthy check `if (state.loadedLatest.someKey)` is correct. The `!== undefined` check is NOT — it would match `false` (loading) too.

### 3.3 — `skip` / `filter` RxJS operator issues

If after migration, a consumer's observable subscription stops emitting, it is likely because of `skip()` or `filter()` operators that relied on the old emission pattern.

**Fix:** Switch to narrow selectors which emit only when the resolved data changes, removing the need for `skip()` or complex `filter()` logic.

### 3.4 — "Requested API calls array" ordering

If the consumer is a `feature` lib that extends `V1BaseFeatureComponent` (or `V2BaseFeatureComponent`, `V1BaseFeatureExtComponent`, `V2BaseFeatureExtComponent`), and uses "requested API calls arrays" (e.g., `_insightsRequestedData_main`), the array item MUST be pushed **before** calling the facade's `get*` method.

**Correct order:**

```ts
// 1. Push to the array first
if (!this._insightsRequestedData_main) this._insightsRequestedData_main = [];
this._insightsRequestedData_main.push('locations');

// 2. Then call the facade method
this._insightsFacade.getLocations(
  this._baseUrl,
  this._userId,
  instance,
  this.nameThis,
);
```

As the JSDoc of `_xDataFetch` in `V1BaseFeatureComponent` documents.

### 3.5 — Replace `reset()` with `cacheMask()`

**Before:**

```ts
this._insightsFacade.reset('MyComponent');
```

**After:**

```ts
this._insightsFacade.cacheMask('MyComponent');
```

Why? `reset()` wipes all cached data permanently. `cacheMask()` hides all cached data from resolved selectors until the next `get*()` call unmasks them — preserving the cache for TTL checks.

**Where does this apply?**

- In `_xDataReset()` overrides.
- In `_resetUiInputs()` or similar reset functions.
- In `ngOnInit()` if the consumer resets state on initialization.

### 3.6 — Add `configureTtl()` where `createIfNotExists()` lives

For multi-instance consumers that call `createIfNotExists()`, add `configureTtl()` right after it, in the same lifecycle function (typically `ngOnInit()` or `_xInitPreBeforeDom()`):

```ts
ngOnInit(): void {
  this._insightsFacade.createIfNotExists(this.nameInstance);
  // this._insightsFacade.configureTtl(this.nameInstance, { locations: 1800000 });  // Optional: Override default TTL
  this._insightsFacade.cacheMask(this.nameInstance); // Mask old data
}
```

For single-instance consumers:

```ts
ngOnInit(): void {
  // this._translationsFacade.configureTtl({ translations: 600000 }); // Optional: Override default TTL
}
```

---

## Step 4 — Verify

> **Important:** Projects in `libs/` are NOT individually buildable. Only `apps/` projects can be built. To verify that your consumer changes compile, build the **Boilerplate app** (which uses most libs):
>
> ```powershell
> pnpm nx build boilerplate
> ```

1. **Build the Boilerplate app** to verify all consumer TS changes compile: `pnpm nx build boilerplate`.
2. **Run tests** for affected consumers: `pnpm nx test <affected-project>`. However, some libs only have sample/boilerplate test files (placeholder specs that don't test real logic). If you inspect a `.spec.ts` and find it's just a boilerplate test (e.g., only has `it('should create')` or similar placeholder), skip running tests for that lib.
3. **Spot-check HTML templates** that use `| async` pipes with facade observables — ensure they reference the correct (renamed/new) observables.

---

## Reference Consumers

These consumers can be used as reference for how the migrated facade should be used:

- **Multi-instance (Insights) consumer:**
  `libs/shared/feature/ng-chart/src/lib/v2/_feature/chart-primary-base.component.ts`
  — Shows `createIfNotExists` + `cacheMask` in `ngOnInit`, `entityLoadeds$` for readiness checking, `entity$` for error listening with `v1BaseCacheGetError`.

- **Multi-instance (Insights) child consumer:**
  `libs/shared/feature/ng-chart/src/lib/v2/_feature/chart-primary-energy/chart-primary-energy.component.ts`
  — Shows the "requested API calls array" push-before-call pattern (`_insightsRequestedDatas.push('consumption')` → then `_insightsFacade.getConsumption(...)`) and reading resolved data via `entityDatas$` with `take(1)` in `_setUiInputs`.

- **Single-instance (Translations) consumer:**
  `libs/shared/feature/ng-translations/src/lib/v1/translations.component.ts`
  — Shows `translationsState$` subscription with `v1BaseCacheGetData` and `v1BaseCacheGetError` helper functions.

## Available Helper Functions

From `@eliq/shared-util-ng-bases`:

| Function                           | Purpose                                   |
| ---------------------------------- | ----------------------------------------- |
| `v1BaseCacheGetData(state, key)`   | Resolve latest cached data for a data-key |
| `v1BaseCacheGetLoaded(state, key)` | Resolve latest loaded flag for a data-key |
| `v1BaseCacheGetError(state, key)`  | Resolve latest error for a data-key       |
