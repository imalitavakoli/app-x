/* ////////////////////////////////////////////////////////////////////////// */
/* Base effect class for data-access libs                                     */
/* ////////////////////////////////////////////////////////////////////////// */

import { inject } from '@angular/core';
import { Observable, asapScheduler, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { take, concatMap, map, catchError, observeOn } from 'rxjs/operators';

import { V1Base_EffectConfig } from '@x/shared-util-ng-bases-model';

import {
  v1BaseCacheFilterParams,
  v1BaseCacheCreateKey,
  v1BaseCacheIsValid,
} from './base.cache';

/**
 * Base class for 'data-access' lib's effects.
 *
 * @export
 * @class V1BaseEffects
 * @typedef {V1BaseEffects}
 */
export abstract class V1BaseEffects {
  protected readonly _store = inject(Store);

  /**
   * Run a cache-aware effect. This is the core helper that all GET effects use.
   * Works for BOTH single-instance and multi-instance data-access libs because
   * `getCacheTimestamps` and `getTtl` are callback functions that abstract away
   * the state shape differences.
   *
   * NOTE: This cache-aware effect method should ONLY be used for GET API
   * endpoint requests. For POST/PUT/PATCH/DELETE requests (mutations), you
   * should call the API endpoint directly (without cache logic), and define
   * the mutation action in the `CACHE_INVALIDATION_MAP` const in the
   * Reducer file of the data-access lib so that it clears all old cached
   * data of the affected properties in the State object.
   *
   * ## Flattening operator: `mergeMap` vs `concatMap`
   *
   * Always use **`mergeMap`** when calling `_runEffectByCache` (i.e. for
   * GET effects). GET calls are idempotent reads — the server doesn't care
   * about the order in which they arrive, and each request is independent.
   * `mergeMap` lets multiple HTTP requests run **in parallel**, so one
   * component's data fetch never blocks another component's data fetch.
   *
   * **Do NOT use `concatMap`** for GET effects. `concatMap` serialises
   * actions into a queue — the next action only starts after the previous
   * one completes. This is harmless when only one action is in-flight, but
   * when multiple components (or entity instances) dispatch the same action
   * type, their HTTP requests are forced to wait in line. This causes
   * noticeable UI stalls.
   *
   * Reserve `concatMap` (or `switchMap`) for **mutation effects**
   * (POST/PUT/PATCH/DELETE) where the server may depend on receiving
   * requests in a specific order to process them correctly.
   *
   * ## Steps
   *
   * 1. Compute the cache key from the action params (excluding url, lib, + extras).
   * 2. Read the current state from the store (one-shot via take(1)).
   * 3. Look up the cache timestamp for the computed cache key.
   * 4. Check if the cache entry is still valid (within TTL).
   *    - If YES (cache HIT): dispatch `cacheHit` action. No API call.
   *    - If NO (cache MISS): call the Map lib's API method, then dispatch
   *      `success` or `failure` action with the cache key included.
   *
   * NOTE: On cache HIT, the `cacheHit` action is deferred to the next
   * microtask via `asapScheduler`. This is critical when a consumer
   * dispatches multiple calls for the same `relatedTo` key (e.g. two
   * `getConsumption` calls with different date ranges). Without the
   * deferral, all cache-hit actions would fire synchronously during the
   * dispatch phase — before any consumer `combineLatest` has subscribed —
   * so intermediate `cacheKeyLatest` swings would be invisible. The async
   * deferral mirrors the natural async behaviour of cache-miss API calls,
   * giving store subscribers a chance to observe each state transition.
   *
   * @param config  The effect configuration
   * @returns An Observable that emits a single action (cacheHit, success, or failure)
   *
   * @example
   * // Single-instance usage (e.g., ng-translations, ng-auth):
   * getTranslations$ = createEffect(() =>
   *   this.actions$.pipe(
   *     ofType(TranslationsActions.getTranslations),
   *     mergeMap((action) =>
   *       this._runEffectByCache<V1Translations_State, any>({
   *         relatedTo: 'translations',
   *         cacheKeyPrefix: 'translations',
   *         cacheKeyParams: { ...action },
   *         stateSelector: translationsFeature.selectV1TranslationsState,
   *         getCacheTimestamps: (s) => s.cacheTimestamps.translations,
   *         getTtl: (s) => s.ttls.translations,
   *         apiFn: () =>
   *           this._map.getTranslations(
   *             action.url, action.clientId, action.cultureCode,
   *             action.modules, action.lib,
   *           ),
   *         onSuccess: (data, cacheKey) =>
   *           TranslationsActions.success({
   *             relatedTo: 'translations',
   *             cacheKey,
   *             data,
   *           }),
   *         onFailure: (error, cacheKey) =>
   *           TranslationsActions.failure({
   *             relatedTo: 'translations',
   *             cacheKey,
   *             error,
   *           }),
   *         onCacheHit: (relatedTo, cacheKey) =>
   *           TranslationsActions.cacheHit({
   *             relatedTo,
   *             cacheKey,
   *           }),
   *       }),
   *     ),
   *   ),
   * );
   *
   * @example
   * // Multi-instance usage (e.g., ng-insights):
   * // The callbacks drill into the entity sub-state via `action.id`.
   * // NOTE: `cacheKeyExcludes: ['id']` excludes the entity `id` from the
   * // cache key — the same API params called from different entity
   * // instances should produce the same cache key per-entity.
   * getConsumption$ = createEffect(() =>
   *   this.actions$.pipe(
   *     ofType(InsightsActions.getConsumption),
   *     mergeMap((action) =>
   *       this._runEffectByCache<V3Insights_State, any>({
   *         relatedTo: 'consumption',
   *         cacheKeyPrefix: 'consumption',
   *         cacheKeyParams: { ...action },
   *         cacheKeyExcludes: ['id'],
   *         stateSelector: selectors.selectState,
   *         getCacheTimestamps: (s) =>
   *           s.entities[action.id]?.cacheTimestamps?.consumption ?? {},
   *         getTtl: (s) =>
   *           s.entities[action.id]?.ttls?.consumption ?? 900000,
   *         apiFn: () =>
   *           this._map.getConsumption(action.url, action.locationId, ...),
   *         onSuccess: (data, cacheKey) =>
   *           InsightsActions.success({
   *             id: action.id,
   *             props: { relatedTo: 'consumption', cacheKey, data },
   *           }),
   *         onFailure: (error, cacheKey) =>
   *           InsightsActions.failure({
   *             id: action.id,
   *             props: { relatedTo: 'consumption', cacheKey, error },
   *           }),
   *         onCacheHit: (relatedTo, cacheKey) =>
   *           InsightsActions.cacheHit({
   *             id: action.id,
   *             props: { relatedTo, cacheKey },
   *           }),
   *       }),
   *     ),
   *   ),
   * );
   */
  protected _runEffectByCache<TState, TData>(
    config: V1Base_EffectConfig<TState, TData>,
  ): Observable<any> {
    // Step 1: Compute the cache key from the action params.
    const filteredParams = v1BaseCacheFilterParams(
      config.cacheKeyParams,
      config.cacheKeyExcludes,
    );
    const cacheKey = v1BaseCacheCreateKey(
      config.cacheKeyPrefix,
      filteredParams,
    );

    // Step 2: Read the current state from the store (one-shot).
    return this._store.pipe(
      select(config.stateSelector),
      take(1),
      concatMap((state: TState) => {
        // Step 3: Look up the cache timestamp for the computed cache key.
        const timestamps = config.getCacheTimestamps(state);
        const cachedAt = timestamps[cacheKey];
        const ttl = config.getTtl(state);

        // Step 4: Check if the cache entry is still valid (within TTL).
        if (v1BaseCacheIsValid(cachedAt, ttl)) {
          // Cache HIT — no API call needed.
          // Defer to the next microtask so that consecutive cache-hit
          // actions for the same `relatedTo` key each trigger a separate
          // store notification cycle (mirroring cache-miss async behaviour).
          return of(config.onCacheHit(config.relatedTo, cacheKey)).pipe(
            observeOn(asapScheduler),
          );
        }

        // Cache MISS — call the Map lib's API method.
        return config.apiFn().pipe(
          map((data: TData) => config.onSuccess(data, cacheKey)),
          catchError((error: any) => of(config.onFailure(error, cacheKey))),
        );
      }),
    );
  }
}
