import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';

import {
  V1XCredit_InstancePropsSuccess,
  V1XCredit_InstancePropsFailure,
  V1XCredit_InstancePropsCacheHit,
  V1XCredit_Ttls,
  V1XCredit_ResponseIsRelatedTo,
} from './x-credit.interfaces';

export const XCreditActions = createActionGroup({
  source: 'V1XCredit',
  events: {
    /* ////////////////////////////////////////////////////////////////////// */
    /* Select a style                                                         */
    /* ////////////////////////////////////////////////////////////////////// */

    setStyle: props<{
      style: V1XCredit_Style;
    }>(),

    checkIfAlreadySetStyle: emptyProps(), // Check if the user has already set a preferred style (in her last app visit).

    /* ////////////////////////////////////////////////////////////////////// */
    /* Get summary data                                                       */
    /* ////////////////////////////////////////////////////////////////////// */

    getSummary: props<{
      lib: string;
      id: string;
      url: string;
      userId: number;
    }>(),

    /* ////////////////////////////////////////////////////////////////////// */
    /* Get detail data                                                        */
    /* ////////////////////////////////////////////////////////////////////// */

    getDetail: props<{
      lib: string;
      id: string;
      url: string;
      userId: number;
    }>(),

    /* ////////////////////////////////////////////////////////////////////// */
    /* Cache actions                                                          */
    /* ////////////////////////////////////////////////////////////////////// */

    /** Dispatched when a cache hit is detected — no API call needed. */
    cacheHit: props<{ id: string; props: V1XCredit_InstancePropsCacheHit }>(),

    /** Configure TTL (in ms) for specific data-keys of an instance. */
    configureTtl: props<{ id: string; ttls: Partial<V1XCredit_Ttls> }>(),

    /** Invalidate (wipe) cached data for specific data-keys of an instance. */
    cacheInvalidate: props<{
      id: string;
      keys: V1XCredit_ResponseIsRelatedTo[];
    }>(),

    /**
     * Mask all data keys of an instance. Resolved selectors return `undefined`
     * for masked keys until the next `get*` action unmasks them automatically.
     */
    cacheMask: props<{ id: string }>(),

    /* ////////////////////////////////////////////////////////////////////// */
    /* Other actions                                                          */
    /* ////////////////////////////////////////////////////////////////////// */

    /** Create the state of an instance if not exists. */
    createIfNotExists: props<{ id: string }>(),

    /** Reset the state of a specific instance. */
    reset: props<{ id: string }>(),

    /** Reset the state to initial. Clears all cached data. */
    resetAll: emptyProps(),

    /** Successfull HTTP call. */
    success: props<{ id: string; props: V1XCredit_InstancePropsSuccess }>(),

    /** Unsuccessfull HTTP call. */
    failure: props<{ id: string; props: V1XCredit_InstancePropsFailure }>(),
  },
});
