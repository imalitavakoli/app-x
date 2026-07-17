import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  V1Translations_SuccessAction,
  V1Translations_FailureAction,
  V1Translations_CacheHitAction,
  V1Translations_Ttls,
  V1Translations_ResponseIsRelatedTo,
} from './translations.interfaces';

export const TranslationsActions = createActionGroup({
  source: 'V1Translations',
  events: {
    /* Get translations in a specific language ////////////////////////////// */

    getTranslations: props<{
      lib: string;
      url: string;
      clientId: number;
      cultureCode: string;
      modules: string[];
    }>(),

    /* Get client all available langs & user selected lang ////////////////// */

    getAllLangs: props<{ lib: string; url: string }>(),

    getSelectedLang: props<{ lib: string; url: string; userId: number }>(),

    /* Set user selected lang /////////////////////////////////////////////// */

    patchSelectedLang: props<{
      lib: string;
      url: string;
      userId: number;
      cultureCode: string;
    }>(),

    /* Cache actions //////////////////////////////////////////////////////// */

    /** Dispatched when a cache hit is detected — no API call needed. */
    cacheHit: props<V1Translations_CacheHitAction>(),

    /** Configure TTL (in ms) for specific data-keys. */
    configureTtl: props<Partial<V1Translations_Ttls>>(),

    /** Invalidate (wipe) cached data for specific data-keys. */
    cacheInvalidate: props<{ keys: V1Translations_ResponseIsRelatedTo[] }>(),

    /**
     * Mask all data keys. Resolved selectors return `undefined` for masked
     * keys until the next `get*` action unmasks them automatically.
     */
    cacheMask: emptyProps(),

    /* Other actions //////////////////////////////////////////////////////// */

    /** Reset the state to initial. Clears all cached data. */
    reset: emptyProps(),

    /** Successfull HTTP call. */
    success: props<V1Translations_SuccessAction>(),

    /** Unsuccessfull HTTP call. */
    failure: props<V1Translations_FailureAction>(),
  },
});
