/* ////////////////////////////////////////////////////////////////////////// */
/* Base data-access interfaces for reducer state management                   */
/* ////////////////////////////////////////////////////////////////////////// */

import {
  V1Base_CacheTimestamps,
  V1Base_Ttls,
  V1Base_LoadedLatest,
  V1Base_Loadeds,
  V1Base_Errors,
  V1Base_Datas,
} from './base.selectors.interfaces';

/**
 * The cache-related portion of feature/entity interface. Both single-instance
 * (state interface) & multi-instance (entity interface) data-access libs's
 * Reducer feature/entity interfaces conform to this shape.
 *
 * NOTE: `loadedLatest` is intentionally RESET (not preserved) on each action
 * dispatch — e.g. `{ [relatedTo]: false }` wipes all other keys. This allows
 * `state$` subscribers to discriminate which facade method was called last and
 * react only to that data-key. Without this reset, multiple keys would remain
 * `true` simultaneously, breaking the filtering pattern.
 */
export interface V1Base_One {
  cacheKeyLatest: Record<string, string>;
  cacheTimestamps: V1Base_CacheTimestamps;
  ttls: V1Base_Ttls;
  loadedLatest: V1Base_LoadedLatest;
  loadeds: V1Base_Loadeds;
  errors: V1Base_Errors;
  datas: V1Base_Datas;
  /** Set of data-keys whose cached data should be hidden from consumers. */
  cacheMaskedKeys: Set<string>;
}
