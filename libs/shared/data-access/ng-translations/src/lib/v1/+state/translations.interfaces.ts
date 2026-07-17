import {
  V1Translations_MapTrans,
  V1Translations_MapAllLangs,
  V1Translations_MapSelectedLang,
} from '@x/shared-map-ng-translations';

import {
  V1Base_CacheTimestamps,
  V1Base_Ttls,
  V1Base_LoadedLatest,
  V1Base_Loadeds,
  V1Base_Errors,
  V1Base_Datas,
} from '@x/shared-util-ng-bases-model';

/* ////////////////////////////////////////////////////////////////////////// */
/* Cache-related interfaces                                                   */
/* ////////////////////////////////////////////////////////////////////////// */

/** Timestamps for when each cache entry was fetched. */
export interface V1Translations_CacheTimestamps extends V1Base_CacheTimestamps {
  translations: Record<string, number>;
  allLangs: Record<string, number>;
  selectedLang: Record<string, number>;
}

/** TTL config (in ms) per data-key. 0 = never cache (always refetch). */
export interface V1Translations_Ttls extends V1Base_Ttls {
  translations: number;
  allLangs: number;
  selectedLang: number;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (raw, cache-keyed — used by reducer state)            */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Translations_LoadedLatest extends V1Base_LoadedLatest {
  translations?: boolean;
  allLangs?: boolean;
  selectedLang?: boolean;
}

export interface V1Translations_RawLoadeds extends V1Base_Loadeds {
  translations: Record<string, boolean>;
  allLangs: Record<string, boolean>;
  selectedLang: Record<string, boolean>;
}

export interface V1Translations_RawErrors extends V1Base_Errors {
  translations: Record<string, string>;
  allLangs: Record<string, string>;
  selectedLang: Record<string, string>;
}

export interface V1Translations_RawDatas extends V1Base_Datas {
  translations: Record<string, V1Translations_MapTrans>;
  allLangs: Record<string, V1Translations_MapAllLangs>;
  selectedLang: Record<string, V1Translations_MapSelectedLang>;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (resolved, flat — used by consumers)                  */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Translations_Loadeds {
  translations?: boolean;
  allLangs?: boolean;
  selectedLang?: boolean;
}

export interface V1Translations_Errors {
  translations?: string;
  allLangs?: string;
  selectedLang?: string;
}

export interface V1Translations_Datas {
  translations?: V1Translations_MapTrans;
  allLangs?: V1Translations_MapAllLangs;
  selectedLang?: V1Translations_MapSelectedLang;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure/cacheHit Actions                              */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Translations_SuccessAction {
  relatedTo: V1Translations_ResponseIsRelatedTo;
  cacheKey: string;
  data: V1Translations_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1Translations_FailureAction {
  relatedTo: V1Translations_ResponseIsRelatedTo;
  cacheKey: string;
  error: string;
  extra?: { [key: string]: any };
}

export interface V1Translations_CacheHitAction {
  relatedTo: V1Translations_ResponseIsRelatedTo;
  cacheKey: string;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

export type V1Translations_ResponseIsRelatedTo =
  | 'translations'
  | 'allLangs'
  | 'selectedLang';

type V1Translations_ResponseData =
  | V1Translations_MapTrans
  | V1Translations_MapAllLangs
  | V1Translations_MapSelectedLang;
