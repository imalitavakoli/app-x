/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import { V1BaseFacade } from '@x/shared-util-ng-bases';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

import { XUsersActions } from './x-users.actions';
import * as reducer from './x-users.reducer';
import * as selectors from './x-users.selectors';

@Injectable({
  providedIn: 'root',
})
export class V1XUsersFacade extends V1BaseFacade {
  // protected readonly _store = inject(Store); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Let's select one option from our feature state object.        */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(select(selectors.selectState));
  allEntities$ = this._store.pipe(select(selectors.selectAllEntities));
  selectedEntity$ = this._store.pipe(select(selectors.selectSelectedEntity));
  crudActionLatest$ = this._store.pipe(
    select(selectors.selectCrudActionLatest),
  );
  loaded$ = this._store.pipe(select(selectors.selectLoaded));
  error$ = this._store.pipe(select(selectors.selectError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions: Let's modify the state by dispatching actions.                  */
  /* //////////////////////////////////////////////////////////////////////// */

  getAll(url: string, lib = 'any') {
    this._store.dispatch(XUsersActions.getAll({ lib, url }));
  }

  setSelectedId(id: number) {
    this._store.dispatch(XUsersActions.setSelectedId({ id }));
  }

  addOne(url: string, user: V1XUsers_MapUser, lib = 'any') {
    this._store.dispatch(XUsersActions.addOne({ lib, url, user }));
  }

  addMany(url: string, users: V1XUsers_MapUser[], lib = 'any') {
    this._store.dispatch(XUsersActions.addMany({ lib, url, users }));
  }

  updateOne(url: string, user: V1XUsers_MapUser, lib = 'any') {
    this._store.dispatch(XUsersActions.updateOne({ lib, url, user }));
  }

  updateMany(url: string, users: V1XUsers_MapUser[], lib = 'any') {
    this._store.dispatch(XUsersActions.updateMany({ lib, url, users }));
  }

  removeOne(url: string, id: number, lib = 'any') {
    this._store.dispatch(XUsersActions.removeOne({ lib, url, id }));
  }

  removeMany(url: string, ids: number[], lib = 'any') {
    this._store.dispatch(XUsersActions.removeMany({ lib, url, ids }));
  }

  removeAll(url: string, lib = 'any') {
    this._store.dispatch(XUsersActions.removeAll({ lib, url }));
  }
}
