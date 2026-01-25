/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@x/shared-util-ng-bases';

import { XProfileInfoActions } from './x-profile-info.actions';
import * as selectors from './x-profile-info.selectors';
import { xProfileInfoFeature } from './x-profile-info.reducer';

@Injectable({
  providedIn: 'root',
})
export class V1XProfileInfoFacade extends V1BaseFacade {
  // protected readonly _store = inject(Store); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Let's select one option from our feature state object.        */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(
    select(xProfileInfoFeature.selectV1XProfileInfoState),
  );

  loadedLatest$ = this._store.pipe(
    select(xProfileInfoFeature.selectLoadedLatest),
  );
  loadeds$ = this._store.pipe(select(xProfileInfoFeature.selectLoadeds));
  errors$ = this._store.pipe(select(xProfileInfoFeature.selectErrors));
  datas$ = this._store.pipe(select(xProfileInfoFeature.selectDatas));

  hasError$ = this._store.pipe(select(selectors.selectHasError));

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
   * Reset the state. This is useful mostly for the times that user logs out of
   * the app... In such cases, you may want to reset the state to the initial state.
   */
  reset() {
    this._store.dispatch(XProfileInfoActions.reset());
  }
}
