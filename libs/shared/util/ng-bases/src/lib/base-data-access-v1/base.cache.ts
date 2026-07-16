/* ////////////////////////////////////////////////////////////////////////// */
/* Cache helper functions for data-access libs                                */
/* ////////////////////////////////////////////////////////////////////////// */

import { V1Base_One } from '@x/shared-util-ng-bases-model';

/**
 * Filter out keys that should NOT be part of the cache key.
 * By default, `url`, `lib`, and `type` (NgRx action type string) are
 * excluded. Additional keys can be excluded via `cacheKeyExcludes`.
 *
 * @param params            The full action params object
 * @param cacheKeyExcludes  Additional keys to exclude
 * @returns A new object containing only the cache-relevant params
 *
 * @example
 * v1BaseCacheFilterParams(
 *   { url: 'https://...', lib: 'myLib', clientId: 1, cultureCode: 'en' },
 * );
 * // => { clientId: 1, cultureCode: 'en' }
 *
 * @example
 * v1BaseCacheFilterParams(
 *   { url: 'https://...', lib: 'myLib', clientId: 1, cultureCode: 'en' },
 *   ['cultureCode'],
 * );
 * // => { clientId: 1 }
 */
export function v1BaseCacheFilterParams(
  params: Record<string, unknown>,
  cacheKeyExcludes?: string[],
): Record<string, unknown> {
  const defaultExcludes = ['url', 'lib', 'type'];
  const allExcludes = new Set([
    ...defaultExcludes,
    ...(cacheKeyExcludes ?? []),
  ]);

  return Object.fromEntries(
    Object.entries(params).filter(([key]) => !allExcludes.has(key)),
  );
}

/**
 * Create a deterministic cache key from a prefix and a filtered params object.
 * Uses stable JSON stringify (sorted keys) + DJB2 hash for compactness.
 *
 * @param prefix  The prefix (typically the data-key, e.g. 'translations')
 * @param params  The filtered params object
 * @returns A string like `translations:a1b2c3d4`
 *
 * @example
 * v1BaseCacheCreateKey('translations', { clientId: 1, cultureCode: 'en' });
 * // => 'translations:a1b2c3d4'
 */
export function v1BaseCacheCreateKey(
  prefix: string,
  params: Record<string, unknown>,
): string {
  const serialized = _stableStringify(params);
  const hash = _djb2Hash(serialized);
  return `${prefix}:${hash}`;
}

/**
 * Check whether a cached entry is still valid (within TTL).
 *
 * @param cachedAt  The timestamp (ms) when the entry was cached
 * @param ttl       The TTL duration (ms). 0 means never cache.
 * @returns `true` if valid (skip API call), `false` if expired or missing
 *
 * @example
 * v1BaseCacheIsValid(Date.now() - 10000, 300000); // => true  (10s ago, TTL 5min)
 * v1BaseCacheIsValid(Date.now() - 400000, 300000); // => false (expired)
 * v1BaseCacheIsValid(undefined, 300000);            // => false (never cached)
 */
export function v1BaseCacheIsValid(
  cachedAt: number | undefined,
  ttl: number,
): boolean {
  if (!cachedAt || ttl === 0) return false;
  return Date.now() - cachedAt < ttl;
}

/**
 * Get the latest data for a given data-key from a cache-aware state.
 * Resolves `cacheKeyLatest[relatedTo]` → `datas[relatedTo][cacheKey]`.
 *
 * @param state       The state or entity object
 * @param relatedTo   The data-key (e.g. 'translations')
 * @returns The cached data, or `undefined` if no cache entry exists
 *
 * @example
 * const translations = v1BaseCacheGetData(translationsState, 'translations');
 */
export function v1BaseCacheGetData<T extends V1Base_One>(
  state: T,
  relatedTo: string,
): any {
  if (state.cacheMaskedKeys?.has(relatedTo)) return undefined;
  const cacheKey = state.cacheKeyLatest[relatedTo];
  if (cacheKey === undefined) return undefined;
  return state.datas[relatedTo]?.[cacheKey];
}

/**
 * Get the latest loaded flag for a given data-key from a cache-aware state.
 * Resolves `cacheKeyLatest[relatedTo]` → `loadeds[relatedTo][cacheKey]`.
 *
 * @param state       The state or entity object
 * @param relatedTo   The data-key (e.g. 'translations')
 * @returns The loaded flag, or `undefined` if no cache entry exists
 *
 * @example
 * const isLoaded = v1BaseCacheGetLoaded(translationsState, 'translations');
 */
export function v1BaseCacheGetLoaded<T extends V1Base_One>(
  state: T,
  relatedTo: string,
): boolean | undefined {
  if (state.cacheMaskedKeys?.has(relatedTo)) return undefined;
  const cacheKey = state.cacheKeyLatest[relatedTo];
  if (cacheKey === undefined) return undefined;
  return state.loadeds[relatedTo]?.[cacheKey];
}

/**
 * Get the latest error for a given data-key from a cache-aware state.
 * Resolves `cacheKeyLatest[relatedTo]` → `errors[relatedTo][cacheKey]`.
 *
 * @param state       The state or entity object
 * @param relatedTo   The data-key (e.g. 'translations')
 * @returns The error string, or `undefined` if no error exists
 *
 * @example
 * const error = v1BaseCacheGetError(translationsState, 'translations');
 */
export function v1BaseCacheGetError<T extends V1Base_One>(
  state: T,
  relatedTo: string,
): string | undefined {
  if (state.cacheMaskedKeys?.has(relatedTo)) return undefined;
  const cacheKey = state.cacheKeyLatest[relatedTo];
  if (cacheKey === undefined) return undefined;
  return state.errors[relatedTo]?.[cacheKey];
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Internal helpers                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Deterministic JSON serialization — sorts object keys recursively so that
 * `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` produce the same string.
 * @internal
 */
export function _stableStringify(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return '[' + value.map((v) => _stableStringify(v)).join(',') + ']';
  }
  const sorted = Object.keys(value as Record<string, unknown>).sort();
  const entries = sorted.map(
    (k) =>
      JSON.stringify(k) +
      ':' +
      _stableStringify((value as Record<string, unknown>)[k]),
  );
  return '{' + entries.join(',') + '}';
}

/**
 * DJB2 hash — produces a compact hex string from any input string.
 * @internal
 */
export function _djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}
