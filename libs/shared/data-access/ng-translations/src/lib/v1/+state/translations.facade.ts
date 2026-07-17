/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@x/shared-util-ng-bases';

import { TranslationsActions } from './translations.actions';
import { v1TranslationsFeature } from './translations.reducer';
import {
  V1Translations_Ttls,
  V1Translations_ResponseIsRelatedTo,
} from './translations.interfaces';
import * as selectors from './translations.selectors';

@Injectable({
  providedIn: 'root',
})
export class V1TranslationsFacade extends V1BaseFacade {
  // protected readonly _store = inject(Store); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Others                                                        */
  /* //////////////////////////////////////////////////////////////////////// */

  lastLoadedLangCultureCode$ = this._store.pipe(
    select(v1TranslationsFeature.selectLastLoadedLangCultureCode),
  );

  loadedLatest$ = this._store.pipe(
    select(v1TranslationsFeature.selectLoadedLatest),
  );

  hasError$ = this._store.pipe(select(selectors.selectHasError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Raw (cache-keyed state slices)                                */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsState$ = this._store.pipe(
    select(v1TranslationsFeature.selectV1TranslationsState),
  );

  rawLoadeds$ = this._store.pipe(select(v1TranslationsFeature.selectLoadeds));
  rawErrors$ = this._store.pipe(select(v1TranslationsFeature.selectErrors));
  rawDatas$ = this._store.pipe(select(v1TranslationsFeature.selectDatas));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Resolved (Flat, via cacheKeyLatest)                           */
  /* //////////////////////////////////////////////////////////////////////// */

  loadeds$ = this._store.pipe(select(selectors.selectResolvedLoadeds));
  errors$ = this._store.pipe(select(selectors.selectResolvedErrors));
  datas$ = this._store.pipe(select(selectors.selectResolvedDatas));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Datas): Resolved (Flat, via cacheKeyLatest)            */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsData$ = this._store.pipe(
    select(selectors.selectTranslationsData),
  );
  allLangsData$ = this._store.pipe(select(selectors.selectAllLangsData));
  selectedLangData$ = this._store.pipe(
    select(selectors.selectSelectedLangData),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Loadeds): Resolved (Flat, via cacheKeyLatest)          */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsLoaded$ = this._store.pipe(
    select(selectors.selectTranslationsLoaded),
  );
  allLangsLoaded$ = this._store.pipe(select(selectors.selectAllLangsLoaded));
  selectedLangLoaded$ = this._store.pipe(
    select(selectors.selectSelectedLangLoaded),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Errors): Resolved (Flat, via cacheKeyLatest)           */
  /* //////////////////////////////////////////////////////////////////////// */

  translationsError$ = this._store.pipe(
    select(selectors.selectTranslationsError),
  );
  allLangsError$ = this._store.pipe(select(selectors.selectAllLangsError));
  selectedLangError$ = this._store.pipe(
    select(selectors.selectSelectedLangError),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions: Let's modify the state by dispatching actions.                  */
  /* //////////////////////////////////////////////////////////////////////// */

  getTranslations(
    url: string,
    clientId: number,
    cultureCode = 'en-GB',
    modules: string[] = [],
    lib = 'any',
  ) {
    this._store.dispatch(
      TranslationsActions.getTranslations({
        lib,
        url,
        clientId,
        cultureCode,
        modules,
      }),
    );
  }

  getAllLangs(url: string, lib = 'any') {
    this._store.dispatch(TranslationsActions.getAllLangs({ lib, url }));
  }

  getSelectedLang(url: string, userId: number, lib = 'any') {
    this._store.dispatch(
      TranslationsActions.getSelectedLang({ lib, url, userId }),
    );
  }

  patchSelectedLang(
    url: string,
    userId: number,
    cultureCode: string,
    lib = 'any',
  ) {
    this._store.dispatch(
      TranslationsActions.patchSelectedLang({ lib, url, userId, cultureCode }),
    );
  }

  /**
   * Configure TTL (Time-To-Live) in milliseconds for each data-key.
   * Pass 0 for a key to disable caching for it (always refetch).
   * Default TTL is 300000ms (1000 * 60 * 5 ms = 5 minutes) for all data-keys.
   *
   * @param ttls  Partial TTL config. Only provided keys are updated.
   */
  configureTtl(ttls: Partial<V1Translations_Ttls>) {
    this._store.dispatch(TranslationsActions.configureTtl(ttls));
  }

  /**
   * Invalidate (wipe) cached data for specific data-keys.
   * This clears `datas`, `loadeds`, `errors`, and `cacheTimestamps` for the
   * listed keys. The next `get*()` call for those keys will always refetch.
   *
   * @param {V1Translations_ResponseIsRelatedTo[]} keys  Data-keys to invalidate
   */
  cacheInvalidate(keys: V1Translations_ResponseIsRelatedTo[]) {
    this._store.dispatch(TranslationsActions.cacheInvalidate({ keys }));
  }

  /**
   * Mask all data keys. Once masked, resolved selectors (e.g. `datas$`,
   * `loadeds$`) will return `undefined` for every key — the UI sees a
   * "loading" state.
   *
   * Each subsequent `get*()` call automatically unmasks its own key, so only
   * the keys that are actively re-fetched become visible again. Keys that are
   * NOT re-fetched after `cacheMask` stay hidden.
   *
   * NOTE: Unlike `cacheInvalidate`, this does NOT delete the cached data. The
   * data remains in the store and becomes visible as soon as the corresponding
   * `get*()` is called.
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
