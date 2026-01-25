import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { V1XProfileInfo } from '@x/shared-map-ng-x-profile-info';

import { XProfileInfoActions } from './x-profile-info.actions';

@Injectable()
export class V1XProfileInfoEffects {
  private actions$ = inject(Actions);
  private _map = inject(V1XProfileInfo);

  /* Get data /////////////////////////////////////////////////////////////// */

  getData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XProfileInfoActions.getData),
      concatMap(({ lib, url, userId }) => {
        return this._map.getData(url, userId, lib).pipe(
          map((data) =>
            XProfileInfoActions.success({
              relatedTo: 'data',
              data,
              // extra: { blahblah },
            }),
          ),
          catchError((error) =>
            of(
              XProfileInfoActions.failure({
                relatedTo: 'data',
                error,
              }),
            ),
          ),
        );
      }),
    ),
  );
}
