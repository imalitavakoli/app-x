import { createFeature, createReducer, on } from '@ngrx/store';

import {
  v1BaseReducerSetLoading,
  v1BaseReducerOnSuccess,
  v1BaseReducerOnFailure,
  v1BaseReducerOnCacheHit,
  v1BaseReducerInvalidate,
  v1BaseReducerConfigureTtl,
} from '@x/shared-util-ng-bases';
import { V1Base_One } from '@x/shared-util-ng-bases-model';

import { XProfileInfoActions } from './x-profile-info.actions';
import {
  V2XProfileInfo_RawErrors,
  V2XProfileInfo_RawLoadeds,
  V2XProfileInfo_LoadedLatest,
  V2XProfileInfo_RawDatas,
  V2XProfileInfo_CacheTimestamps,
  V2XProfileInfo_Ttls,
  V2XProfileInfo_ResponseIsRelatedTo,
} from './x-profile-info.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Basic Constants                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

const V2_X_PROFILE_INFO_DEFAULT_TTL = 300000; // 5 minutes

/** All data keys — used by `cacheMask` to mask everything. */
const ALL_DATA_KEYS: V2XProfileInfo_ResponseIsRelatedTo[] = ['data'];

/**
 * Define which actions cause cache invalidation for specific data-keys.
 * When a mutation action (PATCH/PUT/POST/DELETE) is dispatched, the cache
 * entries for the listed data-keys are wiped so the next GET refetches.
 *
 * NOTE: This lib has no data-mutation actions (only `getData`), so the map is
 * empty.
 */
const CACHE_INVALIDATION_MAP: Record<
  string,
  V2XProfileInfo_ResponseIsRelatedTo[]
> = {};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const v2XProfileInfoFeatureKey = 'v2XProfileInfo';

export interface V2XProfileInfo_State extends V1Base_One {
  // blahblah: string | undefined;

  /** Timestamps of when each cache entry was stored. */
  cacheTimestamps: V2XProfileInfo_CacheTimestamps;
  /** TTL config (ms) per data-key. */
  ttls: V2XProfileInfo_Ttls;

  loadedLatest: V2XProfileInfo_LoadedLatest;
  loadeds: V2XProfileInfo_RawLoadeds;
  errors: V2XProfileInfo_RawErrors;
  datas: V2XProfileInfo_RawDatas;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Initial shape                                                              */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const v2XProfileInfoInitialState: V2XProfileInfo_State = {
  // blahblah: undefined,

  cacheKeyLatest: {},
  cacheTimestamps: { data: {} },
  ttls: { data: V2_X_PROFILE_INFO_DEFAULT_TTL },
  cacheMaskedKeys: new Set<string>(),

  loadedLatest: {} as V2XProfileInfo_LoadedLatest,
  loadeds: { data: {} },
  errors: { data: {} },
  datas: { data: {} },
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * The cache-aware feature reducer.
 *
 * Each handler just calls the matching `v1BaseReducer*` helper — the base does
 * all the cache bookkeeping. Reads (GET) use `v1BaseReducerSetLoading`; then
 * `success`/`failure`/`cacheHit` store the result.
 *
 * Writes (PATCH/PUT/POST/DELETE) are different: instead of set-loading, they
 * call `v1BaseReducerInvalidate` to clear the cached data-keys they change (as
 * declared in `CACHE_INVALIDATION_MAP`), so the next read fetches fresh data.
 *
 * @example
 * // Data-mutation action (single-instance): invalidate, don't set-loading.
 * // CACHE_INVALIDATION_MAP = { patchSelectedLang: ['selectedLang'] };
 * on(TranslationsActions.patchSelectedLang, (state): V1Translations_State => ({
 *   ...state,
 *   ...v1BaseReducerInvalidate(state, CACHE_INVALIDATION_MAP['patchSelectedLang']),
 *   loadedLatest: { selectedLang: false },
 * })),
 *
 * @type {ActionReducer<V2XProfileInfo_State>}
 */
export const v2XProfileInfoReducer = createReducer(
  v2XProfileInfoInitialState,

  /* Get data /////////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.getData,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerSetLoading(state, 'data', { ...action }, 'data'),
    }),
  ),

  /* Cache actions ////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.cacheHit,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerOnCacheHit(state, action.relatedTo, action.cacheKey),
    }),
  ),

  on(
    XProfileInfoActions.configureTtl,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerConfigureTtl(state, action),
    }),
  ),

  on(
    XProfileInfoActions.cacheInvalidate,
    (state, { keys }): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerInvalidate(state, keys),
    }),
  ),

  on(
    XProfileInfoActions.cacheMask,
    (state): V2XProfileInfo_State => ({
      ...state,
      cacheMaskedKeys: new Set<string>(ALL_DATA_KEYS),
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.reset,
    (): V2XProfileInfo_State => v2XProfileInfoInitialState,
  ),

  on(
    XProfileInfoActions.success,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      // ...setMorePropsBasedOnActSuccess(action),
      ...v1BaseReducerOnSuccess(
        state,
        action.relatedTo,
        action.cacheKey,
        action.data,
      ),
    }),
  ),

  on(
    XProfileInfoActions.failure,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerOnFailure(
        state,
        action.relatedTo,
        action.cacheKey,
        action.error,
      ),
    }),
  ),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Selectors (auto generated via `createFeature()`)             */
/* ////////////////////////////////////////////////////////////////////////// */

export const v2XProfileInfoFeature = createFeature({
  name: v2XProfileInfoFeatureKey,
  reducer: v2XProfileInfoReducer,
});

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful functions                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// function setMorePropsBasedOnActSuccess(
//   action: V2XProfileInfo_SuccessAction,
// ): Partial<V2XProfileInfo_State> {
//   switch (action.relatedTo) {
//     case 'data':
//       return {
//         blahblah: action.extra?.['blahblah'],
//       };
//     default:
//       return {};
//   }
// }
