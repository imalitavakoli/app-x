/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';

import { XCreditActions } from './x-credit.actions';
import * as selectors from './x-credit.selectors';
import * as reducer from './x-credit.reducer';
import {
  V1XCredit_Loadeds,
  V1XCredit_Errors,
  V1XCredit_Datas,
} from './x-credit.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1XCreditFacade {
  private readonly _store = inject(Store);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Let's select one option from our feature state object.        */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(select(selectors.selectState));
  allEntities$ = this._store.pipe(select(selectors.selectAllEntities));

  lastSetStyle$ = this._store.pipe(select(selectors.selectLastSetStyle));

  entity$(id = 'g'): Observable<reducer.V1XCredit_Entity> {
    return this._store.pipe(select(selectors.selectEntity(id)));
  }
  entityLoadedLatest$(id = 'g'): Observable<V1XCredit_Loadeds> {
    return this._store.pipe(select(selectors.selectEntityLoadedLatest(id)));
  }
  entityLoadeds$(id = 'g'): Observable<V1XCredit_Loadeds> {
    return this._store.pipe(select(selectors.selectEntityLoadeds(id)));
  }
  entityErrors$(id = 'g'): Observable<V1XCredit_Errors> {
    return this._store.pipe(select(selectors.selectEntityErrors(id)));
  }
  entityDatas$(id = 'g'): Observable<V1XCredit_Datas> {
    return this._store.pipe(select(selectors.selectEntityDatas(id)));
  }
  entityHasError$(id = 'g'): Observable<boolean> {
    return this._store.pipe(select(selectors.selectEntityHasError(id)));
  }

  hasEntity$(id = 'g'): Observable<boolean> {
    return this._store.pipe(select(selectors.selectHasEntity(id)));
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
   */
  getSummary(url: string, userId: number, id = 'g') {
    this._store.dispatch(
      XCreditActions.getSummary({
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
   */
  getDetail(url: string, userId: number, id = 'g') {
    this._store.dispatch(
      XCreditActions.getDetail({
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
   * @param {string} id
   */
  createIfNotExists(id: string) {
    this._store.dispatch(XCreditActions.createIfNotExists({ id }));
  }

  /**
   * Reset one instance object to its initial state. This is useful when you
   * want to reset the state of a specific entity.
   *
   * @param {string} id
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
