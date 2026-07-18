# Actions Migration Reference

This reference shows the before/after for `*.actions.ts` for both lib types.

---

## Single-Instance Example: `ng-translations`

### BEFORE (legacy)

```ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  V1Translations_SuccessAction,
  V1Translations_FailureAction,
} from './translations.interfaces';

export const TranslationsActions = createActionGroup({
  source: 'V1Translations',
  events: {
    getTranslations: props<{
      lib: string;
      url: string;
      clientId: number;
      cultureCode: string;
      modules: string[];
    }>(),

    getAllLangs: props<{ lib: string; url: string }>(),

    getSelectedLang: props<{ lib: string; url: string; userId: number }>(),

    patchSelectedLang: props<{
      lib: string;
      url: string;
      userId: number;
      cultureCode: string;
    }>(),

    success: props<V1Translations_SuccessAction>(),
    failure: props<V1Translations_FailureAction>(),
  },
});
```

### AFTER (cache-aware)

```ts
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
```

---

## Multi-Instance Example: `ng-insights`

For multi-instance, the key difference is that most actions wrap props in `{ id: string; ... }`:

```ts
/* Cache actions */

cacheHit: props<{ id: string; props: V3Insights_CacheHitAction }>(),
configureTtl: props<{ id: string; ttls: Partial<V3Insights_Ttls> }>(),
cacheInvalidate: props<{ id: string; keys: V3Insights_ResponseIsRelatedTo[] }>(),
cacheMask: props<{ id: string }>(),

/* Other actions */

createIfNotExists: props<{ id: string }>(),
reset: props<{ id: string }>(),
resetAll: emptyProps(),

success: props<{ id: string; props: V3Insights_InstancePropsSuccess }>(),
failure: props<{ id: string; props: V3Insights_InstancePropsFailure }>(),
```

### Key additions vs legacy

1. **New imports**: `CacheHitAction`, `Ttls`, `ResponseIsRelatedTo` interfaces.
2. **New actions**: `cacheHit`, `configureTtl`, `cacheInvalidate`, `cacheMask`, `reset`.
3. **Updated actions**: `success` and `failure` now include `cacheKey` in their props (this comes from the interfaces change).
4. Single-instance uses `emptyProps()` for `cacheMask` and `reset`.
5. Multi-instance uses `props<{ id: string }>()` for `cacheMask` and `reset`.
