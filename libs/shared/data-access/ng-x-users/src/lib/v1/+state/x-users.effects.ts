import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of, concatMap, map, mergeMap } from 'rxjs';

import { V1XUsers } from '@x/shared-map-ng-x-users';

import { XUsersActions } from './x-users.actions';
import * as reducer from './x-users.reducer';

@Injectable()
export class V1XUsersEffects {
  private actions$ = inject(Actions);
  private _map = inject(V1XUsers);

  /* //////////////////////////////////////////////////////////////////////// */
  /* set/Update/Delete entities                                               */
  /* //////////////////////////////////////////////////////////////////////// */

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XUsersActions.getAll),
      concatMap(({ url }) => {
        return this._map.getAll(url).pipe(
          map((users) => XUsersActions.getAllSuccess({ users })),
          catchError((error) => of(XUsersActions.failure({ error }))),
        );
      }),
    ),
  );

  addOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XUsersActions.addOne),
      concatMap(({ url, user }) => {
        return this._map.addOne(url, user).pipe(
          map((user) => XUsersActions.addOneSuccess({ user })),
          catchError((error) => of(XUsersActions.failure({ error }))),
        );
      }),
    ),
  );

  updateOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XUsersActions.updateOne),
      concatMap(({ url, user }) => {
        return this._map.updateOne(url, user).pipe(
          map((user) =>
            XUsersActions.updateOneSuccess({
              user: { id: user.id as number, changes: user }, // To satisfy NgRx updateOne argument type.
            }),
          ),
          catchError((error) => of(XUsersActions.failure({ error }))),
        );
      }),
    ),
  );

  removeOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XUsersActions.removeOne),
      concatMap(({ url, id }) => {
        return this._map.removeOne(url, id).pipe(
          map((id) => XUsersActions.removeOneSuccess({ id })),
          catchError((error) => of(XUsersActions.failure({ error }))),
        );
      }),
    ),
  );
}
