/* ////////////////////////////////////////////////////////////////////////// */
/* Base reducer helpers for data-access libs                                  */
/* ////////////////////////////////////////////////////////////////////////// */

import { v1BaseCacheFilterParams, v1BaseCacheCreateKey } from './base.cache';

import { V1Base_One } from '@x/shared-util-ng-bases-model';

/**
 * Set the state to "loading" for a GET action dispatch.
 * - Resets `loadedLatest` to `{ [relatedTo]: false }` (wipes other keys so
 *   `translationsState$` subscribers can discriminate which action was last)
 * - Computes and stores the cache key in `cacheKeyLatest[relatedTo]`
 * - Sets `loadeds[relatedTo][cacheKey] = false` so that subscribers of
 *   resolved-loadeds selectors detect the `true → false → true` transition
 *   when the same action (same cache key) is re-dispatched — without this,
 *   the selector value would stay `true` throughout and NgRx memoization
 *   would suppress the re-emission
 * - Clears `errors[relatedTo][cacheKey]` so that `selectHasError` toggles
 *   `false → true` when a subsequent failure arrives (ensures error popups
 *   re-appear on every retry, not just the first failure)
 * - Does NOT wipe existing cached data (preserves previous cache entries)
 *
 * @param state         Current state or entity object
 * @param relatedTo     The data-key (e.g. 'translations')
 * @param cacheKeyParams  The action params used to build the cache key
 * @param cacheKeyPrefix  Prefix for cache key (typically same as relatedTo)
 * @param cacheKeyExcludes Additional keys to exclude from cache key
 * @returns Partial state to spread into the new state
 *
 * @example
 * // Single-instance:
 * on(TranslationsActions.getTranslations, (state, action) => ({
 *   ...state,
 *   ...v1BaseReducerSetLoading(state, 'translations', action, 'translations'),
 * })),
 *
 * @example
 * // Multi-instance:
 * on(InsightsActions.getConsumption, (state, { id, ...rest }) =>
 *   adapter.updateOne({
 *     id,
 *     changes: v1BaseReducerSetLoading(
 *       state.entities[id]!, 'consumption', rest, 'consumption',
 *     ),
 *   }, { ...state }),
 * ),
 */
export function v1BaseReducerSetLoading<T extends V1Base_One>(
  state: T,
  relatedTo: string,
  cacheKeyParams: Record<string, unknown>,
  cacheKeyPrefix: string,
  cacheKeyExcludes?: string[],
): Partial<T> {
  const filteredParams = v1BaseCacheFilterParams(
    cacheKeyParams,
    cacheKeyExcludes,
  );
  const cacheKey = v1BaseCacheCreateKey(cacheKeyPrefix, filteredParams);

  // Auto-unmask: when a get* action is dispatched, reveal this key's data
  // so that any prior `cacheMask()` call doesn't block it.
  let cacheMaskedKeys = state.cacheMaskedKeys;
  if (cacheMaskedKeys?.has(relatedTo)) {
    cacheMaskedKeys = new Set(cacheMaskedKeys);
    cacheMaskedKeys.delete(relatedTo);
  }

  return {
    loadedLatest: { [relatedTo]: false },
    cacheKeyLatest: { ...state.cacheKeyLatest, [relatedTo]: cacheKey },
    cacheMaskedKeys,
    loadeds: {
      ...state.loadeds,
      [relatedTo]: {
        ...(state.loadeds[relatedTo] || {}),
        [cacheKey]: false,
      },
    },
    errors: {
      ...state.errors,
      [relatedTo]: {
        ...(state.errors[relatedTo] || {}),
        [cacheKey]: undefined,
      },
    },
  } as Partial<T>;
}

/**
 * Handle a successful API response.
 * - Stores data in `datas[relatedTo][cacheKey]`
 * - Sets `loadeds[relatedTo][cacheKey] = true`
 * - Sets `cacheTimestamps[relatedTo][cacheKey] = Date.now()`
 * - Sets `loadedLatest[relatedTo] = true`
 * - Sets `cacheKeyLatest[relatedTo] = cacheKey` (needed for mutations that
 *   skip `v1BaseReducerSetLoading`)
 *
 * NOTE: `errors[cacheKey]` is cleared (`undefined`) here as a defensive
 * safety net. In practice this is a no-op because errors are already
 * cleared before this function runs — `v1BaseReducerSetLoading` clears
 * them for GET flows, and `v1BaseReducerInvalidate` wipes them for
 * mutation flows. We keep it so that if a future data-access lib ever
 * dispatches a success action without going through either of those
 * functions first, a stale error won't remain alongside fresh data.
 *
 * NOTE: `cacheTimestamps[cacheKey]` is set to `Date.now()` so that TTL
 * validation (`v1BaseCacheIsValid`) can determine whether the cached entry
 * is still fresh on subsequent requests.
 *
 * @param state       Current state or entity object
 * @param relatedTo   The data-key
 * @param cacheKey    The cache key
 * @param data        The response data
 * @returns Partial state to spread
 */
export function v1BaseReducerOnSuccess<T extends V1Base_One>(
  state: T,
  relatedTo: string,
  cacheKey: string,
  data: any,
): Partial<T> {
  return {
    loadedLatest: { [relatedTo]: true },
    cacheKeyLatest: { ...state.cacheKeyLatest, [relatedTo]: cacheKey },
    loadeds: {
      ...state.loadeds,
      [relatedTo]: {
        ...(state.loadeds[relatedTo] || {}),
        [cacheKey]: true,
      },
    },
    errors: {
      ...state.errors,
      [relatedTo]: {
        ...(state.errors[relatedTo] || {}),
        [cacheKey]: undefined,
      },
    },
    datas: {
      ...state.datas,
      [relatedTo]: {
        ...(state.datas[relatedTo] || {}),
        [cacheKey]: data,
      },
    },
    cacheTimestamps: {
      ...state.cacheTimestamps,
      [relatedTo]: {
        ...(state.cacheTimestamps[relatedTo] || {}),
        [cacheKey]: Date.now(),
      },
    },
  } as Partial<T>;
}

/**
 * Handle a failed API response.
 * - Stores error in `errors[relatedTo][cacheKey]`
 * - Sets `loadeds[relatedTo][cacheKey] = true`
 * - Sets `loadedLatest[relatedTo] = true`
 * - Sets `cacheKeyLatest[relatedTo] = cacheKey` (needed for mutations that
 *   skip `v1BaseReducerSetLoading`)
 *
 * NOTE: `cacheTimestamps` is intentionally NOT set here, so that a failed
 * cache key stays expired and always refetches on the next request.
 *
 * @param state       Current state or entity object
 * @param relatedTo   The data-key
 * @param cacheKey    The cache key
 * @param error       The error string
 * @returns Partial state to spread
 */
export function v1BaseReducerOnFailure<T extends V1Base_One>(
  state: T,
  relatedTo: string,
  cacheKey: string,
  error: string,
): Partial<T> {
  return {
    loadedLatest: { [relatedTo]: true },
    cacheKeyLatest: { ...state.cacheKeyLatest, [relatedTo]: cacheKey },
    loadeds: {
      ...state.loadeds,
      [relatedTo]: {
        ...(state.loadeds[relatedTo] || {}),
        [cacheKey]: true,
      },
    },
    errors: {
      ...state.errors,
      [relatedTo]: {
        ...(state.errors[relatedTo] || {}),
        [cacheKey]: error,
      },
    },
  } as Partial<T>;
}

/**
 * Handle a cache hit (data already in store and still valid).
 * - Sets `loadedLatest[relatedTo] = true`
 * - Sets `cacheKeyLatest[relatedTo] = cacheKey` — this mirrors
 *   `v1BaseReducerOnSuccess` so that selectors resolving via
 *   `cacheKeyLatest` see the correct cache key. This is critical
 *   when a consumer dispatches multiple calls for the same
 *   `relatedTo` key (e.g. two `getConsumption` calls with different
 *   date ranges): the effects fire `cacheHit` sequentially and each
 *   one must swing `cacheKeyLatest` to its own cache key — exactly
 *   like `success` actions do on a fresh load.
 * - Sets `loadeds[relatedTo][cacheKey] = true` — this is needed
 *   because `v1BaseReducerSetLoading` resets it to `false`, and on
 *   a cache hit we skip `v1BaseReducerOnSuccess`/
 *   `v1BaseReducerOnFailure` which would normally restore it.
 * - Does NOT change datas (data is already there)
 *
 * @param state       Current state or entity object
 * @param relatedTo   The data-key
 * @param cacheKey    The cache key from the action
 * @returns Partial state to spread
 */
export function v1BaseReducerOnCacheHit<T extends V1Base_One>(
  state: T,
  relatedTo: string,
  cacheKey: string,
): Partial<T> {
  return {
    loadedLatest: { [relatedTo]: true },
    cacheKeyLatest: { ...state.cacheKeyLatest, [relatedTo]: cacheKey },
    loadeds: {
      ...state.loadeds,
      [relatedTo]: {
        ...(state.loadeds[relatedTo] || {}),
        [cacheKey]: true,
      },
    },
  } as Partial<T>;
}

/**
 * Invalidate cache entries for specific data-keys (used by mutation actions).
 * - Wipes `cacheTimestamps[relatedTo]`, `datas[relatedTo]`,
 *   `errors[relatedTo]`, and `loadeds[relatedTo]` for each data-key in
 *   the provided list.
 *
 * NOTE: `errors` and `loadeds` are cleared so that `selectHasError`
 * toggles `false → true` when a subsequent failure arrives (ensures
 * error popups re-appear on every retry, not just the first failure).
 *
 * @param state         Current state or entity object
 * @param relatedToList List of data-keys to invalidate
 * @returns Partial state to spread
 */
export function v1BaseReducerInvalidate<T extends V1Base_One>(
  state: T,
  relatedToList: string[],
): Partial<T> {
  const cacheTimestamps = { ...state.cacheTimestamps };
  const datas = { ...state.datas };
  const errors = { ...state.errors };
  const loadeds = { ...state.loadeds };
  const cacheMaskedKeys = new Set(state.cacheMaskedKeys);

  for (const key of relatedToList) {
    cacheTimestamps[key] = {};
    datas[key] = {};
    errors[key] = {};
    loadeds[key] = {};
    cacheMaskedKeys.delete(key);
  }

  return {
    cacheTimestamps,
    datas,
    errors,
    loadeds,
    cacheMaskedKeys,
  } as Partial<T>;
}

/**
 * Merge new TTL values into the state.
 *
 * @param state  Current state or entity object
 * @param ttls   Partial TTL config to merge
 * @returns Partial state to spread
 */
export function v1BaseReducerConfigureTtl<T extends V1Base_One>(
  state: T,
  ttls: Partial<Record<string, number>>,
): Partial<T> {
  return {
    ttls: { ...state.ttls, ...ttls },
  } as Partial<T>;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Entity-level helpers (multi-instance data-access libs)                     */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Validate that an entity exists and return its ID.
 * Logs an error if the entity is missing (intentionally does NOT
 * fallback to 'g' — let the app break for easier debugging).
 *
 * NOTE: This function is useful for a multi-instance data-access lib.
 *
 * @param entities   The entities dictionary from EntityState
 * @param instanceId The entity id to validate
 * @param logPrefix  Prefix for the error message (e.g. 'insights.reducer')
 * @returns The instanceId as-is
 */
export function v1BaseReducerEntityValidateId(
  entities: Record<string, unknown>,
  instanceId: string,
  logPrefix = 'base.reducer',
): string {
  if (!entities[instanceId]) {
    console.error(
      `@${logPrefix}/getId: No entity found with id: ${instanceId}`,
    );
  }
  return instanceId;
}

/**
 * Set one property on a specific entity.
 * This is for properties that live on the entity itself (e.g., a custom
 * `status` or `selectedTab` field) — not for modifying cache records
 * inside `datas`, `loadeds`, or `errors`.
 *
 * NOTE: This function is useful for a multi-instance data-access lib.
 *
 * @param entity    The current entity object
 * @param propKey   The property key to set
 * @param propValue The property value
 * @returns A new entity with the property set
 *
 * @example
 * // In a reducer `on()` handler:
 * on(SomeActions.setStatus, (state, { id, status }) =>
 *   adapter.updateOne({
 *     id,
 *     changes: v1BaseReducerEntitySetProp(state.entities[id]!, 'status', status),
 *   }, { ...state }),
 * ),
 */
export function v1BaseReducerEntitySetProp<T extends V1Base_One>(
  entity: T,
  propKey: string,
  propValue: any,
): T {
  return { ...entity, [propKey]: propValue };
}

/**
 * Reset all V1Base_One cache fields on a specific entity, preserving `ttls`.
 * The caller is responsible for setting the entity `id` (since it is
 * not part of V1Base_One).
 *
 * Uses `Object.keys(entity.ttls)` to discover all data-keys, since `ttls`
 * always has an entry for every data-key. The `ttls` themselves are preserved
 * so cache configuration survives a reset.
 *
 * NOTE: This function is useful for a multi-instance data-access lib.
 *
 * @param entity The current entity object
 * @returns Partial entity with all cache fields reset
 *
 * @example
 * // In a reducer `on()` handler:
 * on(SomeActions.reset, (state, { id }) =>
 *   adapter.updateOne({
 *     id,
 *     changes: { id, ...v1BaseReducerEntityReset(state.entities[id]!) },
 *   }, { ...state }),
 * ),
 */
export function v1BaseReducerEntityReset<T extends V1Base_One>(
  entity: T,
): Partial<T> {
  const cacheTimestamps: Record<string, Record<string, number>> = {};
  const loadeds: Record<string, Record<string, boolean>> = {};
  const errors: Record<string, Record<string, string>> = {};
  const datas: Record<string, Record<string, any>> = {};

  for (const key of Object.keys(entity.ttls)) {
    cacheTimestamps[key] = {};
    loadeds[key] = {};
    errors[key] = {};
    datas[key] = {};
  }

  return {
    cacheKeyLatest: {},
    cacheTimestamps,
    loadedLatest: {},
    loadeds,
    errors,
    datas,
    cacheMaskedKeys: new Set<string>(),
  } as Partial<T>;
}
