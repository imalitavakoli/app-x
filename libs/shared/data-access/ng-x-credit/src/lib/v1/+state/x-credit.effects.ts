import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';

import { V1XCredit, V1XCredit_Style } from '@x/shared-map-ng-x-credit';
import { v1LocalPrefGet, v1LocalPrefSet } from '@x/shared-util-local-storage';

import { XCreditActions } from './x-credit.actions';

@Injectable()
export class V1XCreditEffects {
  private actions$ = inject(Actions);
  private _map = inject(V1XCredit);
  private _store = inject(Store);

  /* //////////////////////////////////////////////////////////////////////// */
  /*  Select a style                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  setStyle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(XCreditActions.setStyle),
        tap(({ style }) => {
          v1LocalPrefSet('xCredit_lastSetStyle', style);
        }),
      ),
    { dispatch: false },
  );

  checkIfAlreadySetStyle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XCreditActions.checkIfAlreadySetStyle),
      switchMap(() => {
        // Get the last stored param from local storage.
        const storedParam = v1LocalPrefGet('xCredit_lastSetStyle');

        // If `storedParam` is truthy, dispatch the action to set it in our state.
        if (storedParam) {
          return of(XCreditActions.setStyle({ style: storedParam }));
        }
        // If `storedParam` is falsy, do not dispatch any action.
        return EMPTY;
      }),
    ),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get summary data                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  getSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XCreditActions.getSummary),
      concatMap(({ lib, id, url, userId }) => {
        return this._map.getSummary(url, userId, lib).pipe(
          map((data) =>
            XCreditActions.success({
              id,
              props: {
                relatedTo: 'summary',
                data,
              },
            }),
          ),
          catchError((error) =>
            of(
              XCreditActions.failure({
                id,
                props: {
                  relatedTo: 'summary',
                  error,
                },
              }),
            ),
          ),
        );
      }),
    ),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get detail data                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  getDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XCreditActions.getDetail),
      concatMap(({ lib, id, url, userId }) => {
        return this._map.getDetail(url, userId, lib).pipe(
          map((data) =>
            XCreditActions.success({
              id,
              props: {
                relatedTo: 'detail',
                data,
              },
            }),
          ),
          catchError((error) =>
            of(
              XCreditActions.failure({
                id,
                props: {
                  relatedTo: 'detail',
                  error,
                },
              }),
            ),
          ),
        );
      }),
    ),
  );
}
