/* ////////////////////////////////////////////////////////////////////////// */
/* Base data-access interfaces for state sub-shapes                           */
/* ////////////////////////////////////////////////////////////////////////// */

/** Base for cache timestamps per data-key. */
export interface V1Base_CacheTimestamps {
  [key: string]: Record<string, number>;
}

/** Base for TTL config per data-key. */
export interface V1Base_Ttls {
  [key: string]: number;
}

/** Base for loaded-latest flags per data-key. */
export interface V1Base_LoadedLatest {
  [key: string]: any;
}

/** Base for loaded records per data-key. */
export interface V1Base_Loadeds {
  [key: string]: Record<string, boolean>;
}

/** Base for error records per data-key. */
export interface V1Base_Errors {
  [key: string]: Record<string, string>;
}

/** Base for data records per data-key. */
export interface V1Base_Datas {
  [key: string]: Record<string, any>;
}
