/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

import { XUsersActions } from './x-users.actions';
import * as reducer from './x-users.reducer';
import * as selectors from './x-users.selectors';

@Injectable()
export class V1XUsersFacade {
  private readonly _store = inject(Store);

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

  getAll(url: string) {
    this._store.dispatch(XUsersActions.getAll({ url }));
  }

  setSelectedId(id: number) {
    this._store.dispatch(XUsersActions.setSelectedId({ id }));
  }

  addOne(url: string, user: V1XUsers_MapUser) {
    this._store.dispatch(XUsersActions.addOne({ url, user }));
  }

  addMany(url: string, users: V1XUsers_MapUser[]) {
    this._store.dispatch(XUsersActions.addMany({ url, users }));
  }

  updateOne(url: string, user: V1XUsers_MapUser) {
    this._store.dispatch(XUsersActions.updateOne({ url, user }));
  }

  updateMany(url: string, users: V1XUsers_MapUser[]) {
    this._store.dispatch(XUsersActions.updateMany({ url, users }));
  }

  removeOne(url: string, id: number) {
    this._store.dispatch(XUsersActions.removeOne({ url, id }));
  }

  removeMany(url: string, ids: number[]) {
    this._store.dispatch(XUsersActions.removeMany({ url, ids }));
  }

  removeAll(url: string) {
    this._store.dispatch(XUsersActions.removeAll({ url }));
  }
}
