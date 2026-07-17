/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@x/shared-util-ng-bases';
import {
  V1XCredit_Style,
  V1XCredit_MapSummary,
  V1XCredit_MapDetail,
} from '@x/shared-map-ng-x-credit';

import { XCreditActions } from './x-credit.actions';
import * as selectors from './x-credit.selectors';
import * as reducer from './x-credit.reducer';
import {
  V1XCredit_Loadeds,
  V1XCredit_Errors,
  V1XCredit_Datas,
  V1XCredit_RawLoadeds,
  V1XCredit_RawErrors,
  V1XCredit_RawDatas,
  V1XCredit_Ttls,
  V1XCredit_ResponseIsRelatedTo,
} from './x-credit.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1XCreditFacade extends V1BaseFacade {
  // protected readonly _store = inject(Store); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Others                                                        */
  /* //////////////////////////////////////////////////////////////////////// */

  lastSetStyle$ = this._store.pipe(select(selectors.selectLastSetStyle));

  entityLoadedLatest$(id = 'g'): Observable<V1XCredit_Loadeds> {
    return this._store.pipe(select(selectors.selectEntityLoadedLatest(id)));
  }
  entityHasError$(id = 'g'): Observable<boolean> {
    return this._store.pipe(select(selectors.selectEntityHasError(id)));
  }
  hasEntity$(id = 'g'): Observable<boolean> {
    return this._store.pipe(select(selectors.selectHasEntity(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Raw (cache-keyed state slices)                                */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(select(selectors.selectState));
  allEntities$ = this._store.pipe(select(selectors.selectAllEntities));

  entity$(id = 'g'): Observable<reducer.V1XCredit_Entity> {
    return this._store.pipe(select(selectors.selectEntity(id)));
  }

  rawEntityLoadeds$(id = 'g'): Observable<V1XCredit_RawLoadeds> {
    return this._store.pipe(select(selectors.selectEntityLoadeds(id)));
  }
  rawEntityErrors$(id = 'g'): Observable<V1XCredit_RawErrors> {
    return this._store.pipe(select(selectors.selectEntityErrors(id)));
  }
  rawEntityDatas$(id = 'g'): Observable<V1XCredit_RawDatas> {
    return this._store.pipe(select(selectors.selectEntityDatas(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Resolved (flat, via cacheKeyLatest)                           */
  /* //////////////////////////////////////////////////////////////////////// */

  entityLoadeds$(id = 'g'): Observable<V1XCredit_Loadeds> {
    return this._store.pipe(select(selectors.selectEntityResolvedLoadeds(id)));
  }
  entityErrors$(id = 'g'): Observable<V1XCredit_Errors> {
    return this._store.pipe(select(selectors.selectEntityResolvedErrors(id)));
  }
  entityDatas$(id = 'g'): Observable<V1XCredit_Datas> {
    return this._store.pipe(select(selectors.selectEntityResolvedDatas(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Datas): Resolved (flat, via cacheKeyLatest)            */
  /* //////////////////////////////////////////////////////////////////////// */

  entitySummaryData$(id = 'g'): Observable<V1XCredit_MapSummary | undefined> {
    return this._store.pipe(select(selectors.selectEntitySummaryData(id)));
  }
  entityDetailData$(id = 'g'): Observable<V1XCredit_MapDetail | undefined> {
    return this._store.pipe(select(selectors.selectEntityDetailData(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Loadeds): Resolved (flat, via cacheKeyLatest)          */
  /* //////////////////////////////////////////////////////////////////////// */

  entitySummaryLoaded$(id = 'g'): Observable<boolean | undefined> {
    return this._store.pipe(select(selectors.selectEntitySummaryLoaded(id)));
  }
  entityDetailLoaded$(id = 'g'): Observable<boolean | undefined> {
    return this._store.pipe(select(selectors.selectEntityDetailLoaded(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Errors): Resolved (flat, via cacheKeyLatest)           */
  /* //////////////////////////////////////////////////////////////////////// */

  entitySummaryError$(id = 'g'): Observable<string | undefined> {
    return this._store.pipe(select(selectors.selectEntitySummaryError(id)));
  }
  entityDetailError$(id = 'g'): Observable<string | undefined> {
    return this._store.pipe(select(selectors.selectEntityDetailError(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions: Let's modify the state by dispatching actions.                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Set the user's set preferred style in the state object
   *
   * @param {V1XCredit_Style} style
   */
  setStyle(style: V1XCredit_Style) {
    this._store.dispatch(XCreditActions.setStyle({ style }));
  }

  /**
   * Check if the user has already set a preferred style (in her last app visit).
   */
  checkIfAlreadySetStyle() {
    this._store.dispatch(XCreditActions.checkIfAlreadySetStyle());
  }

  /**
   * Get summary data
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [id='g']
   * @param {string} [lib='any']
   */
  getSummary(url: string, userId: number, id = 'g', lib = 'any') {
    this._store.dispatch(
      XCreditActions.getSummary({
        lib,
        id,
        url,
        userId,
      }),
    );
  }

  /**
   * Get detail data
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [id='g']
   * @param {string} [lib='any']
   */
  getDetail(url: string, userId: number, id = 'g', lib = 'any') {
    this._store.dispatch(
      XCreditActions.getDetail({
        lib,
        id,
        url,
        userId,
      }),
    );
  }

  /**
   * Create a new instance if it doesn't exist. This is useful when you want to
   * use this 'data-access' lib in multiple 'feature' libs and you don't like
   * the stored data for each lib to interfere with each other.
   *
   * NOTE: There's always a default instance with id 'g' which stands for 'global'.
   *
   * NOTE: This method always MUST be used before subscribing to any entity
   * related Observables such as `entity$`, `entityLoadedLatest$`, etc.
   *
   * @param {string} id The entity id
   */
  createIfNotExists(id: string) {
    this._store.dispatch(XCreditActions.createIfNotExists({ id }));
  }

  /**
   * Configure TTL (Time-To-Live) in milliseconds for each data-key of a
   * specific entity. Pass 0 for a key to disable caching for it (always
   * refetch).
   *
   * @param {string} id The entity id
   * @param {Partial<V1XCredit_Ttls>} ttls TTL values to merge
   */
  configureTtl(id: string, ttls: Partial<V1XCredit_Ttls>) {
    this._store.dispatch(XCreditActions.configureTtl({ id, ttls }));
  }

  /**
   * Invalidate (wipe) cached data for specific data-keys of a specific entity.
   * This clears `datas`, `loadeds`, `errors`, and `cacheTimestamps` for the
   * listed keys. The next `get*()` call for those keys will always refetch.
   *
   * @param {string} id The entity id
   * @param {V1XCredit_ResponseIsRelatedTo[]} keys Data-keys to invalidate
   */
  cacheInvalidate(id: string, keys: V1XCredit_ResponseIsRelatedTo[]) {
    this._store.dispatch(XCreditActions.cacheInvalidate({ id, keys }));
  }

  /**
   * Mask all data keys for a specific entity. Once masked, resolved selectors
   * (e.g. `entityDatas$`, `entityLoadeds$`) will return `undefined` for every
   * key — the UI sees a "loading" state.
   *
   * Each subsequent `get*()` call automatically unmasks its own key, so only
   * the keys that are actively re-fetched become visible again. Keys that are
   * NOT re-fetched after `cacheMask` stay hidden.
   *
   * NOTE: Unlike `cacheInvalidate`, this does NOT delete the cached data. The
   * data remains in the store and becomes visible as soon as the corresponding
   * `get*()` is called.
   *
   * @param {string} id The entity id
   */
  cacheMask(id: string) {
    this._store.dispatch(XCreditActions.cacheMask({ id }));
  }

  /**
   * Reset one instance object to its initial state. This is useful when you
   * want to reset the state of a specific entity.
   *
   * @param {string} id The entity id
   */
  reset(id: string) {
    this._store.dispatch(XCreditActions.reset({ id }));
  }

  /**
   * Reset the state. This is useful mostly for the times that user logs out of
   * the app... In such cases, you may want to reset the state to the initial state.
   *
   * NOTE: This will reset the state to the initial state. This process includes
   * removing all the entities but keeping the default entity with id 'g'.
   */
  resetAll() {
    this._store.dispatch(XCreditActions.resetAll());
  }
}
