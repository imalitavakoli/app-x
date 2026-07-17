import {
  V1XCredit_MapSummary,
  V1XCredit_MapDetail,
} from '@x/shared-map-ng-x-credit';

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
export interface V1XCredit_CacheTimestamps extends V1Base_CacheTimestamps {
  summary: Record<string, number>;
  detail: Record<string, number>;
}

/** TTL config (in ms) per data-key. 0 = never cache (always refetch). */
export interface V1XCredit_Ttls extends V1Base_Ttls {
  summary: number;
  detail: number;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (raw, cache-keyed — used by reducer entity)           */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_LoadedLatest extends V1Base_LoadedLatest {
  summary?: boolean;
  detail?: boolean;
}

export interface V1XCredit_RawLoadeds extends V1Base_Loadeds {
  summary: Record<string, boolean>;
  detail: Record<string, boolean>;
}

export interface V1XCredit_RawErrors extends V1Base_Errors {
  summary: Record<string, string>;
  detail: Record<string, string>;
}

export interface V1XCredit_RawDatas extends V1Base_Datas {
  summary: Record<string, V1XCredit_MapSummary>;
  detail: Record<string, V1XCredit_MapDetail>;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (resolved, flat — used by consumers)                  */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_Loadeds {
  summary?: boolean;
  detail?: boolean;
}

export interface V1XCredit_Errors {
  summary?: string;
  detail?: string;
}

export interface V1XCredit_Datas {
  summary?: V1XCredit_MapSummary;
  detail?: V1XCredit_MapDetail;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure/cacheHit Actions                              */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_InstancePropsSuccess {
  relatedTo: V1XCredit_ResponseIsRelatedTo;
  cacheKey: string;
  data: V1XCredit_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1XCredit_InstancePropsFailure {
  relatedTo: V1XCredit_ResponseIsRelatedTo;
  cacheKey: string;
  error: string;
  extra?: { [key: string]: any };
}

export interface V1XCredit_InstancePropsCacheHit {
  relatedTo: V1XCredit_ResponseIsRelatedTo;
  cacheKey: string;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

export type V1XCredit_ResponseIsRelatedTo = 'summary' | 'detail';

type V1XCredit_ResponseData = V1XCredit_MapSummary | V1XCredit_MapDetail;
