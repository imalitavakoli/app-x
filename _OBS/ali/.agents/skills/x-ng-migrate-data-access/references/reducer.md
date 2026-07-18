# Reducer Migration Reference

This reference shows the before/after for `*.reducer.ts` for both lib types.

---

## Single-Instance Example: `ng-translations`

### BEFORE (legacy)

```ts
import { createFeature, createReducer, on } from '@ngrx/store';

import { TranslationsActions } from './translations.actions';
import {
  V1Translations_Errors,
  V1Translations_Loadeds,
  V1Translations_Datas,
  V1Translations_SuccessAction,
} from './translations.interfaces';

export const translationsFeatureKey = 'v1Translations';

export interface V1Translations_State {
  lastLoadedLangCultureCode: string | undefined;
  loadedLatest: V1Translations_Loadeds;
  loadeds: V1Translations_Loadeds;
  errors: V1Translations_Errors;
  datas: V1Translations_Datas;
}

export const initialState: V1Translations_State = {
  lastLoadedLangCultureCode: undefined,
  loadedLatest: {} as V1Translations_Loadeds,
  loadeds: {} as V1Translations_Loadeds,
  errors: {} as V1Translations_Errors,
  datas: {} as V1Translations_Datas,
};

export const v1TranslationsReducer = createReducer(
  initialState,

  on(TranslationsActions.getTranslations,
    (state, action): V1Translations_State => ({
      ...state,
      loadedLatest: { translations: false },
      loadeds: { ...state.loadeds, translations: undefined },
      errors: { ...state.errors, translations: undefined },
      datas: { ...state.datas, translations: undefined },
    }),
  ),

  // ... similar for other get actions ...

  on(TranslationsActions.patchSelectedLang,
    (state, action): V1Translations_State => ({
      ...state,
      loadedLatest: { selectedLang: false },
      loadeds: { ...state.loadeds, selectedLang: undefined },
      errors: { ...state.errors, selectedLang: undefined },
      datas: { ...state.datas, selectedLang: undefined },
    }),
  ),

  on(TranslationsActions.success,
    (state, action): V1Translations_State => ({
      ...state,
      ...setMorePropsBasedOnActSuccess(action),
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      datas: { ...state.datas, [action.relatedTo]: action.data },
    }),
  ),

  on(TranslationsActions.failure,
    (state, action): V1Translations_State => ({
      ...state,
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      errors: { ...state.errors, [action.relatedTo]: action.error },
    }),
  ),
);

export const translationsFeature = createFeature({
  name: translationsFeatureKey,
  reducer: v1TranslationsReducer,
});
```

### AFTER (cache-aware)

```ts
import { createFeature, createReducer, on } from '@ngrx/store';

import {
  v1BaseReducerSetLoading,
  v1BaseReducerOnSuccess,
  v1BaseReducerOnFailure,
  v1BaseReducerOnCacheHit,
  v1BaseReducerInvalidate,
  v1BaseReducerConfigureTtl,
} from '@eliq/shared-util-ng-bases';
import { V1Base_One } from '@eliq/shared-util-ng-bases-model';

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

const DEFAULT_TTL = 300000; // 5 minutes

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

export const translationsFeatureKey = 'v1Translations';

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

export const initialState: V1Translations_State = {
  lastLoadedLangCultureCode: undefined,

  cacheKeyLatest: {},
  cacheTimestamps: { translations: {}, allLangs: {}, selectedLang: {} },
  ttls: {
    translations: DEFAULT_TTL,
    allLangs: DEFAULT_TTL,
    selectedLang: DEFAULT_TTL,
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

export const v1TranslationsReducer = createReducer(
  initialState,

  on(TranslationsActions.getTranslations,
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

  on(TranslationsActions.getAllLangs,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerSetLoading(state, 'allLangs', { ...action }, 'allLangs'),
    }),
  ),

  on(TranslationsActions.getSelectedLang,
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

  /* Mutation action — invalidate cache for affected keys */

  on(TranslationsActions.patchSelectedLang,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerInvalidate(
        state,
        CACHE_INVALIDATION_MAP['patchSelectedLang'],
      ),
      loadedLatest: { selectedLang: false },
    }),
  ),

  /* Cache actions */

  on(TranslationsActions.cacheHit,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerOnCacheHit(state, action.relatedTo, action.cacheKey),
    }),
  ),

  on(TranslationsActions.configureTtl,
    (state, action): V1Translations_State => ({
      ...state,
      ...v1BaseReducerConfigureTtl(state, action),
    }),
  ),

  on(TranslationsActions.cacheInvalidate,
    (state, { keys }): V1Translations_State => ({
      ...state,
      ...v1BaseReducerInvalidate(state, keys),
    }),
  ),

  on(TranslationsActions.cacheMask,
    (state): V1Translations_State => ({
      ...state,
      cacheMaskedKeys: new Set<string>(ALL_DATA_KEYS),
    }),
  ),

  /* Other actions */

  on(TranslationsActions.reset, (): V1Translations_State => initialState),

  on(TranslationsActions.success,
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

  on(TranslationsActions.failure,
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

export const translationsFeature = createFeature({
  name: translationsFeatureKey,
  reducer: v1TranslationsReducer,
});
```

---

## Multi-Instance Example: `ng-insights`

For multi-instance, the key differences are:

1. State uses `EntityState<Entity>` with `EntityAdapter`.
2. Entity extends `V1Base_One` and includes `id`.
3. A `createInitialEntity(id)` function initializes all `Record<string, T>` fields as `{}`.
4. Loading/success/failure use `adapter.updateOne()` wrapping the base helpers:

```ts
on(InsightsActions.getConsumption, (state, { id, ...rest }) =>
  v3InsightsAdapter.updateOne(
    {
      id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
      changes: v1BaseReducerSetLoading(
        state.entities[id]!,
        'consumption',
        { ...rest },
        'consumption',
      ),
    },
    { ...state },
  ),
),

on(InsightsActions.success, (state, { id, props }) =>
  v3InsightsAdapter.updateOne(
    {
      id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
      changes: {
        ...setMorePropsBasedOnActSuccess(props),
        ...v1BaseReducerOnSuccess(
          state.entities[id]!,
          props.relatedTo,
          props.cacheKey,
          props.data,
        ),
      },
    },
    { ...state },
  ),
),
```

### Key additions vs legacy

1. **New imports**: All `v1BaseReducer*` helpers from `@eliq/shared-util-ng-bases`, `V1Base_One` from `@eliq/shared-util-ng-bases-model`.
2. **New "Basic Constants" section** at the top (right after imports): `DEFAULT_TTL`, `ALL_DATA_KEYS` array, `CACHE_INVALIDATION_MAP`, and `LOG_PREFIX` (multi-instance only).
3. **State extends** `V1Base_One` (single) or entity extends `V1Base_One` (multi).
4. **TTL values** use `DEFAULT_TTL` constant (not hardcoded numbers).
5. **loadeds/errors/datas** change from flat `{}` to `{ dataKey1: {}, dataKey2: {} }`.
6. **New initial state fields**: `cacheKeyLatest: {}`, `cacheTimestamps: { ... }`, `ttls: { ... }`, `cacheMaskedKeys: new Set<string>()`.
7. **Replaced** inline loading/success/failure with `v1BaseReducerSetLoading`, `v1BaseReducerOnSuccess`, `v1BaseReducerOnFailure`.
8. **New handlers** for `cacheHit`, `configureTtl`, `cacheInvalidate`, `cacheMask`.
9. **Mutation actions** use `v1BaseReducerInvalidate` with `CACHE_INVALIDATION_MAP`.

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
