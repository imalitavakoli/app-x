# Facade Migration Reference

This reference shows the before/after for `*.facade.ts` for both lib types.

---

## Single-Instance Example: `ng-translations`

### BEFORE (legacy)

```ts
import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@eliq/shared-util-ng-bases';

import { TranslationsActions } from './translations.actions';
import { translationsFeature } from './translations.reducer';
import * as selectors from './translations.selectors';

@Injectable({ providedIn: 'root' })
export class V1TranslationsFacade extends V1BaseFacade {

  /* Selectors */

  translationsState$ = this._store.pipe(
    select(translationsFeature.selectV1TranslationsState),
  );

  lastLoadedLangCultureCode$ = this._store.pipe(
    select(translationsFeature.selectLastLoadedLangCultureCode),
  );
  loadedLatest$ = this._store.pipe(
    select(translationsFeature.selectLoadedLatest),
  );
  loadeds$ = this._store.pipe(select(translationsFeature.selectLoadeds));
  errors$ = this._store.pipe(select(translationsFeature.selectErrors));
  datas$ = this._store.pipe(select(translationsFeature.selectDatas));
  hasError$ = this._store.pipe(select(selectors.selectHasError));

  /* Actions */

  getTranslations(url: string, clientId: number, cultureCode = 'en-GB', modules: string[] = [], lib = 'any') {
    this._store.dispatch(TranslationsActions.getTranslations({ lib, url, clientId, cultureCode, modules }));
  }
  // ... other actions ...
}
```

### AFTER (cache-aware)

```ts
import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@eliq/shared-util-ng-bases';

import { TranslationsActions } from './translations.actions';
import { translationsFeature } from './translations.reducer';
import {
  V1Translations_Ttls,
  V1Translations_ResponseIsRelatedTo,
} from './translations.interfaces';
import * as selectors from './translations.selectors';

@Injectable({ providedIn: 'root' })
export class V1TranslationsFacade extends V1BaseFacade {

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Others                                                        */
  /* //////////////////////////////////////////////////////////////////////// */

  lastLoadedLangCultureCode$ = this._store.pipe(
    select(translationsFeature.selectLastLoadedLangCultureCode),
  );

  loadedLatest$ = this._store.pipe(
    select(translationsFeature.selectLoadedLatest),
  );

  hasError$ = this._store.pipe(select(selectors.selectHasError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Raw (cache-keyed state slices)                                */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsState$ = this._store.pipe(
    select(translationsFeature.selectV1TranslationsState),
  );

  rawLoadeds$ = this._store.pipe(select(translationsFeature.selectLoadeds));
  rawErrors$ = this._store.pipe(select(translationsFeature.selectErrors));
  rawDatas$ = this._store.pipe(select(translationsFeature.selectDatas));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Resolved (Flat, via cacheKeyLatest)                           */
  /* //////////////////////////////////////////////////////////////////////// */

  loadeds$ = this._store.pipe(select(selectors.selectResolvedLoadeds));
  errors$ = this._store.pipe(select(selectors.selectResolvedErrors));
  datas$ = this._store.pipe(select(selectors.selectResolvedDatas));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Datas): Resolved (Flat, via cacheKeyLatest)            */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsData$ = this._store.pipe(select(selectors.selectTranslationsData));
  allLangsData$ = this._store.pipe(select(selectors.selectAllLangsData));
  selectedLangData$ = this._store.pipe(select(selectors.selectSelectedLangData));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Loadeds): Resolved (Flat, via cacheKeyLatest)          */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsLoaded$ = this._store.pipe(select(selectors.selectTranslationsLoaded));
  allLangsLoaded$ = this._store.pipe(select(selectors.selectAllLangsLoaded));
  selectedLangLoaded$ = this._store.pipe(select(selectors.selectSelectedLangLoaded));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Errors): Resolved (Flat, via cacheKeyLatest)           */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsError$ = this._store.pipe(select(selectors.selectTranslationsError));
  allLangsError$ = this._store.pipe(select(selectors.selectAllLangsError));
  selectedLangError$ = this._store.pipe(select(selectors.selectSelectedLangError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  getTranslations(url: string, clientId: number, cultureCode = 'en-GB', modules: string[] = [], lib = 'any') {
    this._store.dispatch(TranslationsActions.getTranslations({ lib, url, clientId, cultureCode, modules }));
  }

  // ... other get actions (unchanged) ...

  /**
   * Configure TTL (Time-To-Live) in milliseconds for each data-key.
   * Pass 0 for a key to disable caching for it (always refetch).
   */
  configureTtl(ttls: Partial<V1Translations_Ttls>) {
    this._store.dispatch(TranslationsActions.configureTtl(ttls));
  }

  /**
   * Invalidate (wipe) cached data for specific data-keys.
   */
  cacheInvalidate(keys: V1Translations_ResponseIsRelatedTo[]) {
    this._store.dispatch(TranslationsActions.cacheInvalidate({ keys }));
  }

  /**
   * Mask all data keys. Resolved selectors will return `undefined` for every
   * key until the next get*() call unmasks them automatically.
   */
  cacheMask() {
    this._store.dispatch(TranslationsActions.cacheMask());
  }

  /**
   * Reset the state to initial. Clears all cached data.
   */
  reset() {
    this._store.dispatch(TranslationsActions.reset());
  }
}
```

---

## Multi-Instance Example: `ng-insights`

For multi-instance, selectors are methods (not properties) taking `id = 'g'`:

```ts
/* Narrow Selectors (Datas) */

entityLocationsData$(id = 'g') {
  return this._store.pipe(select(selectors.selectEntityLocationsData(id)));
}
entityConsumptionData$(id = 'g') {
  return this._store.pipe(select(selectors.selectEntityConsumptionData(id)));
}

/* Narrow Selectors (Loadeds) */

entityLocationsLoaded$(id = 'g') {
  return this._store.pipe(select(selectors.selectEntityLocationsLoaded(id)));
}

/* Narrow Selectors (Errors) */

entityLocationsError$(id = 'g') {
  return this._store.pipe(select(selectors.selectEntityLocationsError(id)));
}

/* Cache action methods */

configureTtl(id: string, ttls: Partial<V3Insights_Ttls>) {
  this._store.dispatch(InsightsActions.configureTtl({ id, ttls }));
}

cacheInvalidate(id: string, keys: V3Insights_ResponseIsRelatedTo[]) {
  this._store.dispatch(InsightsActions.cacheInvalidate({ id, keys }));
}

cacheMask(id: string) {
  this._store.dispatch(InsightsActions.cacheMask({ id }));
}
```

### Key additions vs legacy

1. **Reorganized sections**: Others → Raw → Resolved → Narrow (Datas) → Narrow (Loadeds) → Narrow (Errors) → Actions.
2. **Renamed**: Old `loadeds$`/`errors$`/`datas$` become `rawLoadeds$`/`rawErrors$`/`rawDatas$`.
3. **New resolved**: `loadeds$`/`errors$`/`datas$` now point to resolved selectors.
4. **New narrow**: One observable per data-key × three groups.
5. **New cache actions**: `configureTtl`, `cacheInvalidate`, `cacheMask`.
6. **New other actions**: `reset` (single-instance), `reset(id)` + `resetAll()` (multi-instance).
7. Single-instance uses class properties; multi-instance uses methods with `id` param.
