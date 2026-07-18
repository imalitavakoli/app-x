/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@x/shared-util-ng-bases';

import { XProfileInfoActions } from './x-profile-info.actions';
import { v2XProfileInfoFeature } from './x-profile-info.reducer';
import {
  V2XProfileInfo_Ttls,
  V2XProfileInfo_ResponseIsRelatedTo,
} from './x-profile-info.interfaces';
import * as selectors from './x-profile-info.selectors';

@Injectable({
  providedIn: 'root',
})
export class V2XProfileInfoFacade extends V1BaseFacade {
  // protected readonly _store = inject(Store); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Others                                                        */
  /* //////////////////////////////////////////////////////////////////////// */

  loadedLatest$ = this._store.pipe(
    select(v2XProfileInfoFeature.selectLoadedLatest),
  );

  hasError$ = this._store.pipe(select(selectors.selectHasError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Raw (cache-keyed state slices)                                */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(
    select(v2XProfileInfoFeature.selectV2XProfileInfoState),
  );

  rawLoadeds$ = this._store.pipe(select(v2XProfileInfoFeature.selectLoadeds));
  rawErrors$ = this._store.pipe(select(v2XProfileInfoFeature.selectErrors));
  rawDatas$ = this._store.pipe(select(v2XProfileInfoFeature.selectDatas));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Resolved (Flat, via cacheKeyLatest)                           */
  /* //////////////////////////////////////////////////////////////////////// */

  loadeds$ = this._store.pipe(select(selectors.selectResolvedLoadeds));
  errors$ = this._store.pipe(select(selectors.selectResolvedErrors));
  datas$ = this._store.pipe(select(selectors.selectResolvedDatas));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Datas): Resolved (Flat, via cacheKeyLatest)            */
  /* //////////////////////////////////////////////////////////////////////// */

  dataData$ = this._store.pipe(select(selectors.selectDataData));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Loadeds): Resolved (Flat, via cacheKeyLatest)          */
  /* //////////////////////////////////////////////////////////////////////// */

  dataLoaded$ = this._store.pipe(select(selectors.selectDataLoaded));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Errors): Resolved (Flat, via cacheKeyLatest)           */
  /* //////////////////////////////////////////////////////////////////////// */

  dataError$ = this._store.pipe(select(selectors.selectDataError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions: Let's modify the state by dispatching actions.                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get data.
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [lib='any']
   */
  getData(url: string, userId: number, lib = 'any') {
    this._store.dispatch(
      XProfileInfoActions.getData({
        lib,
        url,
        userId,
      }),
    );
  }

  /**
   * Configure TTL (Time-To-Live) in milliseconds for each data-key.
   * Pass 0 for a key to disable caching for it (always refetch).
   * Default TTL is 300000ms (1000 * 60 * 5 ms = 5 minutes) for all data-keys.
   *
   * @param ttls  Partial TTL config. Only provided keys are updated.
   */
  configureTtl(ttls: Partial<V2XProfileInfo_Ttls>) {
    this._store.dispatch(XProfileInfoActions.configureTtl(ttls));
  }

  /**
   * Invalidate (wipe) cached data for specific data-keys.
   * This clears `datas`, `loadeds`, `errors`, and `cacheTimestamps` for the
   * listed keys. The next `get*()` call for those keys will always refetch.
   *
   * @param {V2XProfileInfo_ResponseIsRelatedTo[]} keys  Data-keys to invalidate
   */
  cacheInvalidate(keys: V2XProfileInfo_ResponseIsRelatedTo[]) {
    this._store.dispatch(XProfileInfoActions.cacheInvalidate({ keys }));
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
    this._store.dispatch(XProfileInfoActions.cacheMask());
  }

  /**
   * Reset the state. This is useful mostly for the times that user logs out of
   * the app... In such cases, you may want to reset the state to the initial state.
   */
  reset() {
    this._store.dispatch(XProfileInfoActions.reset());
  }
}
