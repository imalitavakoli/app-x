/* ////////////////////////////////////////////////////////////////////////// */
/* Base data-access interfaces for cache-aware state management               */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Configuration for a single cache-aware effect.
 *
 * NOTE: Some properties (`stateSelector`, `apiFn`, `onSuccess`, `onFailure`,
 * `onCacheHit`) are intentionally typed as `any`. Strictly typing them would
 * require importing framework types (`MemoizedSelector` from `@ngrx/store`,
 * `Observable` from `rxjs`, `Action` from `@ngrx/store`) into this model lib,
 * is already enforced in each data-access lib's effect file by NgRx action
 * creators and the typed Map lib methods. The `TState` generic provides the
 * real value — it types the `getCacheTimestamps` and `getTtl` callbacks so
 * the state shape is checked.
 */
export interface V1Base_EffectConfig<TState, TData> {
  /** The data-key this effect is related to (e.g. 'translations', 'allLangs'). */
  relatedTo: string;

  /** The prefix for the cache key (typically same as relatedTo). */
  cacheKeyPrefix: string;

  /** The action params used to build the cache key (filtered by v1BaseCacheFilterParams). */
  cacheKeyParams: Record<string, unknown>;

  /** Additional keys to exclude from cache key generation (beyond url, lib). */
  cacheKeyExcludes?: string[];

  /** Selector to read the full feature state. */
  stateSelector: any;

  /** Extract cacheTimestamps record for this relatedTo from the state. */
  getCacheTimestamps: (state: TState) => Record<string, number>;

  /** Extract TTL value for this relatedTo from the state. */
  getTtl: (state: TState) => number;

  /** The Observable that calls the Map lib's API method. */
  apiFn: () => any;

  /** Factory to create a success action. */
  onSuccess: (data: TData, cacheKey: string) => any;

  /** Factory to create a failure action. */
  onFailure: (error: string, cacheKey: string) => any;

  /** Factory to create a cacheHit action. */
  onCacheHit: (relatedTo: string, cacheKey: string) => any;
}
