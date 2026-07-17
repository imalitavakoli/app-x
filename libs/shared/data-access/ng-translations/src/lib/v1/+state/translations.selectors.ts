import { createSelector } from '@ngrx/store';

import * as fromTranslations from './translations.reducer';
import {
  V1Translations_Loadeds,
  V1Translations_Errors,
  V1Translations_Datas,
} from './translations.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Datas                                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select only the `translations` data from the state.
 * Uses `cacheKeyLatest` to return data for the most recently dispatched call.
 * Only re-emits when the resolved data actually changes.
 */
export const selectTranslationsData = createSelector(
  fromTranslations.translationsFeature.selectDatas,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (datas, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('translations')) return undefined;
    const key = latestKeys['translations'];
    return key ? datas.translations[key] : undefined;
  },
);

/**
 * Select only the `allLangs` data from the state.
 * Uses `cacheKeyLatest` to return data for the most recently dispatched call.
 * Only re-emits when the resolved data actually changes.
 */
export const selectAllLangsData = createSelector(
  fromTranslations.translationsFeature.selectDatas,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (datas, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('allLangs')) return undefined;
    const key = latestKeys['allLangs'];
    return key ? datas.allLangs[key] : undefined;
  },
);

/**
 * Select only the `selectedLang` data from the state.
 * Uses `cacheKeyLatest` to return data for the most recently dispatched call.
 * Only re-emits when the resolved data actually changes.
 */
export const selectSelectedLangData = createSelector(
  fromTranslations.translationsFeature.selectDatas,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (datas, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('selectedLang')) return undefined;
    const key = latestKeys['selectedLang'];
    return key ? datas.selectedLang[key] : undefined;
  },
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Loadeds                                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select only the `translations` loaded status.
 * Uses `cacheKeyLatest` to return the loaded status for the most recently
 * dispatched call.
 */
export const selectTranslationsLoaded = createSelector(
  fromTranslations.translationsFeature.selectLoadeds,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (loadeds, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('translations')) return undefined;
    const key = latestKeys['translations'];
    return key ? loadeds.translations[key] : undefined;
  },
);

/**
 * Select only the `allLangs` loaded status.
 * Uses `cacheKeyLatest` to return the loaded status for the most recently
 * dispatched call.
 */
export const selectAllLangsLoaded = createSelector(
  fromTranslations.translationsFeature.selectLoadeds,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (loadeds, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('allLangs')) return undefined;
    const key = latestKeys['allLangs'];
    return key ? loadeds.allLangs[key] : undefined;
  },
);

/**
 * Select only the `selectedLang` loaded status.
 * Uses `cacheKeyLatest` to return the loaded status for the most recently
 * dispatched call.
 */
export const selectSelectedLangLoaded = createSelector(
  fromTranslations.translationsFeature.selectLoadeds,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (loadeds, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('selectedLang')) return undefined;
    const key = latestKeys['selectedLang'];
    return key ? loadeds.selectedLang[key] : undefined;
  },
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Errors                                                                     */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select only the `translations` error from the state.
 * Uses `cacheKeyLatest` to return the error for the most recently
 * dispatched call.
 */
export const selectTranslationsError = createSelector(
  fromTranslations.translationsFeature.selectErrors,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (errors, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('translations')) return undefined;
    const key = latestKeys['translations'];
    return key ? errors.translations[key] : undefined;
  },
);

/**
 * Select only the `allLangs` error from the state.
 * Uses `cacheKeyLatest` to return the error for the most recently
 * dispatched call.
 */
export const selectAllLangsError = createSelector(
  fromTranslations.translationsFeature.selectErrors,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (errors, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('allLangs')) return undefined;
    const key = latestKeys['allLangs'];
    return key ? errors.allLangs[key] : undefined;
  },
);

/**
 * Select only the `selectedLang` error from the state.
 * Uses `cacheKeyLatest` to return the error for the most recently
 * dispatched call.
 */
export const selectSelectedLangError = createSelector(
  fromTranslations.translationsFeature.selectErrors,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (errors, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('selectedLang')) return undefined;
    const key = latestKeys['selectedLang'];
    return key ? errors.selectedLang[key] : undefined;
  },
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Resolved (flat via cacheKeyLatest)                                         */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select all loadeds resolved to flat `{ [dataKey]?: boolean }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectResolvedLoadeds` (not `selectLoadeds`)
 * because `selectLoadeds` is auto-generated by `createFeature()` and returns
 * the raw cache-keyed structure. The corresponding facade observable is named
 * `loadeds$` (not `resolvedLoadeds$`) for consumer convenience.
 */
export const selectResolvedLoadeds = createSelector(
  fromTranslations.translationsFeature.selectLoadeds,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (loadeds, latestKeys, maskedKeys): V1Translations_Loadeds => {
    const result: V1Translations_Loadeds = {};
    for (const key of Object.keys(latestKeys)) {
      if (maskedKeys?.has(key)) continue;
      const ck = latestKeys[key];
      (result as any)[key] = ck ? loadeds[key]?.[ck] : undefined;
    }
    return result;
  },
);

/**
 * Select all errors resolved to flat `{ [dataKey]?: string }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectResolvedErrors` (not `selectErrors`)
 * because `selectErrors` is auto-generated by `createFeature()` and returns
 * the raw cache-keyed structure. The corresponding facade observable is named
 * `errors$` (not `resolvedErrors$`) for consumer convenience.
 */
export const selectResolvedErrors = createSelector(
  fromTranslations.translationsFeature.selectErrors,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (errors, latestKeys, maskedKeys): V1Translations_Errors => {
    const result: V1Translations_Errors = {};
    for (const key of Object.keys(latestKeys)) {
      if (maskedKeys?.has(key)) continue;
      const ck = latestKeys[key];
      (result as any)[key] = ck ? errors[key]?.[ck] : undefined;
    }
    return result;
  },
);

/**
 * Select all datas resolved to flat `{ [dataKey]?: Type }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectResolvedDatas` (not `selectDatas`)
 * because `selectDatas` is auto-generated by `createFeature()` and returns
 * the raw cache-keyed structure. The corresponding facade observable is named
 * `datas$` (not `resolvedDatas$`) for consumer convenience.
 */
export const selectResolvedDatas = createSelector(
  fromTranslations.translationsFeature.selectDatas,
  fromTranslations.translationsFeature.selectCacheKeyLatest,
  fromTranslations.translationsFeature.selectCacheMaskedKeys,
  (datas, latestKeys, maskedKeys): V1Translations_Datas => {
    const result: V1Translations_Datas = {};
    for (const key of Object.keys(latestKeys)) {
      if (maskedKeys?.has(key)) continue;
      const ck = latestKeys[key];
      (result as any)[key] = ck ? datas[key]?.[ck] : undefined;
    }
    return result;
  },
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Computed                                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Compute to see if there are any `errors` in the state.
 * Returns `true` if there's at least one error across all cache entries,
 * otherwise `false`.
 *
 * @type {boolean}
 */
export const selectHasError = createSelector(
  fromTranslations.translationsFeature.selectErrors,
  (errors) => {
    return Object.values(errors).some((errorRecord) =>
      Object.values(errorRecord).some((e) => e !== undefined),
    );
  },
);
