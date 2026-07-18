import { V1XProfileInfo_MapData } from '@x/shared-map-ng-x-profile-info';

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
export interface V2XProfileInfo_CacheTimestamps extends V1Base_CacheTimestamps {
  data: Record<string, number>;
}

/** TTL config (in ms) per data-key. 0 = never cache (always refetch). */
export interface V2XProfileInfo_Ttls extends V1Base_Ttls {
  data: number;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (raw, cache-keyed — used by reducer state)            */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XProfileInfo_LoadedLatest extends V1Base_LoadedLatest {
  data?: boolean;
}

export interface V2XProfileInfo_RawLoadeds extends V1Base_Loadeds {
  data: Record<string, boolean>;
}

export interface V2XProfileInfo_RawErrors extends V1Base_Errors {
  data: Record<string, string>;
}

export interface V2XProfileInfo_RawDatas extends V1Base_Datas {
  data: Record<string, V1XProfileInfo_MapData>;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (resolved, flat — used by consumers)                  */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XProfileInfo_Loadeds {
  data?: boolean;
}

export interface V2XProfileInfo_Errors {
  data?: string;
}

export interface V2XProfileInfo_Datas {
  data?: V1XProfileInfo_MapData;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure/cacheHit Actions                              */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XProfileInfo_SuccessAction {
  relatedTo: V2XProfileInfo_ResponseIsRelatedTo;
  cacheKey: string;
  data: V2XProfileInfo_ResponseData;
  extra?: { [key: string]: any };
}

export interface V2XProfileInfo_FailureAction {
  relatedTo: V2XProfileInfo_ResponseIsRelatedTo;
  cacheKey: string;
  error: string;
  extra?: { [key: string]: any };
}

export interface V2XProfileInfo_CacheHitAction {
  relatedTo: V2XProfileInfo_ResponseIsRelatedTo;
  cacheKey: string;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

export type V2XProfileInfo_ResponseIsRelatedTo = 'data';

type V2XProfileInfo_ResponseData = V1XProfileInfo_MapData;
