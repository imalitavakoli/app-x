import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  V2XProfileInfo_SuccessAction,
  V2XProfileInfo_FailureAction,
  V2XProfileInfo_CacheHitAction,
  V2XProfileInfo_Ttls,
  V2XProfileInfo_ResponseIsRelatedTo,
} from './x-profile-info.interfaces';

export const XProfileInfoActions = createActionGroup({
  source: 'V2XProfileInfo',
  events: {
    /* Get data ///////////////////////////////////////////////////////////// */

    getData: props<{
      lib: string;
      url: string;
      userId: number;
    }>(),

    /* Cache actions //////////////////////////////////////////////////////// */

    /** Dispatched when a cache hit is detected — no API call needed. */
    cacheHit: props<V2XProfileInfo_CacheHitAction>(),

    /** Configure TTL (in ms) for specific data-keys. */
    configureTtl: props<Partial<V2XProfileInfo_Ttls>>(),

    /** Invalidate (wipe) cached data for specific data-keys. */
    cacheInvalidate: props<{ keys: V2XProfileInfo_ResponseIsRelatedTo[] }>(),

    /**
     * Mask all data keys. Resolved selectors return `undefined` for masked
     * keys until the next `get*` action unmasks them automatically.
     */
    cacheMask: emptyProps(),

    /* Other actions //////////////////////////////////////////////////////// */

    /** Reset the state to initial. Clears all cached data. */
    reset: emptyProps(),

    /** Successfull HTTP call. */
    success: props<V2XProfileInfo_SuccessAction>(),

    /** Unsuccessfull HTTP call. */
    failure: props<V2XProfileInfo_FailureAction>(),
  },
});
