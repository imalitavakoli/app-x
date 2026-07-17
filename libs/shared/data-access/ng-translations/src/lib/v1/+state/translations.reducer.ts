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

import { TranslationsActions } from './translations.actions';
import {
  V1Translations_RawErrors,
  V1Translations_RawLoadeds,
  V1Translations_LoadedLatest,
  V1Translations_RawDatas,
  V1Translations_SuccessAction,
  V1Translations_CacheTimestamps,
  V1Translations_Ttls,
  V1Translations_ResponseIsRelatedTo,
} from './translations.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Basic Constants                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

const V1_TRANSLATIONS_DEFAULT_TTL = 300000; // 5 minutes

/** All data keys — used by `cacheMask` to mask everything. */
const ALL_DATA_KEYS: V1Translations_ResponseIsRelatedTo[] = [
  'translations',
  'allLangs',
  'selectedLang',
];

/**
 * Define which actions cause cache invalidation for specific data-keys.
 * When a mutation action (PATCH/PUT/POST/DELETE) is dispatched, the cache
 * entries for the listed data-keys are wiped so the next GET refetches.
 */
const CACHE_INVALIDATION_MAP: Record<
  string,
  V1Translations_ResponseIsRelatedTo[]
> = {
  patchSelectedLang: ['selectedLang'],
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const v1TranslationsFeatureKey = 'v1Translations';

export interface V1Translations_State extends V1Base_One {
  lastLoadedLangCultureCode: string | undefined;

  /** Timestamps of when each cache entry was stored. */
  cacheTimestamps: V1Translations_CacheTimestamps;
  /** TTL config (ms) per data-key. */
  ttls: V1Translations_Ttls;

  loadedLatest: V1Translations_LoadedLatest;
  loadeds: V1Translations_RawLoadeds;
  errors: V1Translations_RawErrors;
  datas: V1Translations_RawDatas;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Initial shape                                                              */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const v1TranslationsInitialState: V1Translations_State = {
  lastLoadedLangCultureCode: undefined,

  cacheKeyLatest: {},
  cacheTimestamps: { translations: {}, allLangs: {}, selectedLang: {} },
  ttls: {
    translations: V1_TRANSLATIONS_DEFAULT_TTL,
    allLangs: V1_TRANSLATIONS_DEFAULT_TTL,
    selectedLang: V1_TRANSLATIONS_DEFAULT_TTL,
  },
  cacheMaskedKeys: new Set<string>(),

  loadedLatest: {} as V1Translations_LoadedLatest,
  loadeds: { translations: {}, allLangs: {}, selectedLang: {} },
  errors: { translations: {}, allLangs: {}, selectedLang: {} },
  datas: { translations: {}, allLangs: {}, selectedLang: {} },
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
 * @type {ActionReducer<V1Translations_State>}
 */
export const v1TranslationsReducer = createReducer(
  v1TranslationsInitialState,

  /* Get translations in a specific language //////////////////////////////// */

  on(
    TranslationsActions.getTranslations,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerSetLoading(
        state,
        'translations',
        { ...action },
        'translations',
      ),
    }),
  ),

  /* Get client all available langs & user selected lang //////////////////// */

  on(
    TranslationsActions.getAllLangs,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerSetLoading(state, 'allLangs', { ...action }, 'allLangs'),
    }),
  ),

  on(
    TranslationsActions.getSelectedLang,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerSetLoading(
        state,
        'selectedLang',
        { ...action },
        'selectedLang',
      ),
    }),
  ),

  /* Set user selected lang ///////////////////////////////////////////////// */

  on(
    TranslationsActions.patchSelectedLang,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerInvalidate(
        state,
        CACHE_INVALIDATION_MAP['patchSelectedLang'],
      ),
      loadedLatest: { selectedLang: false },
    }),
  ),

  /* Cache actions ////////////////////////////////////////////////////////// */

  on(
    TranslationsActions.cacheHit,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerOnCacheHit(state, action.relatedTo, action.cacheKey),
    }),
  ),

  on(
    TranslationsActions.configureTtl,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerConfigureTtl(state, action),
    }),
  ),

  on(
    TranslationsActions.cacheInvalidate,
    (state, { keys }): V1Translations_State => ({
      ...state,
      ...v1BaseReducerInvalidate(state, keys),
    }),
  ),

  on(
    TranslationsActions.cacheMask,
    (state): V1Translations_State => ({
      ...state,
      cacheMaskedKeys: new Set<string>(ALL_DATA_KEYS),
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(
    TranslationsActions.reset,
    (): V1Translations_State => v1TranslationsInitialState,
  ),

  on(
    TranslationsActions.success,
    (state, action): V1Translations_State => ({
      ...state,
      ...setMorePropsBasedOnActSuccess(action),
      ...v1BaseReducerOnSuccess(
        state,
        action.relatedTo,
        action.cacheKey,
        action.data,
      ),
    }),
  ),

  on(
    TranslationsActions.failure,
    (state, action): V1Translations_State => ({
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

export const v1TranslationsFeature = createFeature({
  name: v1TranslationsFeatureKey,
  reducer: v1TranslationsReducer,
});

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful functions                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

function setMorePropsBasedOnActSuccess(
  action: V1Translations_SuccessAction,
): Partial<V1Translations_State> {
  switch (action.relatedTo) {
    case 'translations':
      return {
        lastLoadedLangCultureCode: action.extra?.['cultureCode'],
      };
    case 'selectedLang':
      return {
        lastLoadedLangCultureCode: action.extra?.['cultureCode'],
      };
    default:
      return {};
  }
}
