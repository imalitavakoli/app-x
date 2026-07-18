# Interfaces Migration Reference

This reference shows the before/after for `*.interfaces.ts` for both lib types.

---

## Single-Instance Example: `ng-translations`

### BEFORE (legacy)

```ts
import {
  V1Translations_MapTrans,
  V1Translations_MapAllLangs,
  V1Translations_MapSelectedLang,
} from '@eliq/shared-map-ng-translations';

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

/* Interface of success/failure Actions */

export interface V1Translations_SuccessAction {
  relatedTo: V1Translations_ResponseIsRelatedTo;
  data: V1Translations_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1Translations_FailureAction {
  relatedTo: V1Translations_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

type V1Translations_ResponseIsRelatedTo =
  | 'translations'
  | 'allLangs'
  | 'selectedLang';

type V1Translations_ResponseData =
  | V1Translations_MapTrans
  | V1Translations_MapAllLangs
  | V1Translations_MapSelectedLang;
```

### AFTER (cache-aware)

```ts
import {
  V1Translations_MapTrans,
  V1Translations_MapAllLangs,
  V1Translations_MapSelectedLang,
} from '@eliq/shared-map-ng-translations';

import {
  V1Base_CacheTimestamps,
  V1Base_Ttls,
  V1Base_LoadedLatest,
  V1Base_Loadeds,
  V1Base_Errors,
  V1Base_Datas,
} from '@eliq/shared-util-ng-bases-model';

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
```

---

## Multi-Instance Example: `ng-insights`

The pattern is identical except:
- `ResponseIsRelatedTo` has more keys.
- All `Raw*` interfaces have `Record<string, T>` for each data-key.
- Success/failure interfaces are named with `InstanceProps` prefix (e.g., `V3Insights_InstancePropsSuccess`).

### Key additions vs legacy

1. **New imports**: `V1Base_CacheTimestamps`, `V1Base_Ttls`, `V1Base_LoadedLatest`, `V1Base_Loadeds`, `V1Base_Errors`, `V1Base_Datas` from `@eliq/shared-util-ng-bases-model`.
2. **New interfaces**: `_CacheTimestamps`, `_Ttls`, `_LoadedLatest`.
3. **Renamed/split**: Old `_Loadeds` becomes consumer-facing (flat). New `_RawLoadeds` is cache-keyed.
4. **New field**: `cacheKey: string` added to success, failure, cacheHit action interfaces.
5. **New interface**: `_CacheHitAction`.
6. **Export**: `ResponseIsRelatedTo` type must be `export type` (was previously just `type`).
