/**
 * @file Effects let us do some side effect tasks when an action occurs.
 * Effects will be called by NgRx automatically when action occurs.
 * In our effects we can do asynchronous tasks. Like connecting to API.
 * Generally speaking, effects are here to do any other thing rather than
 * updating our feature state object... Such as logging some messages, or
 * storing some data in localStorage.
 */

import { Injectable, inject } from '@angular/core';
import {
  Actions,
  EffectNotification,
  OnRunEffects,
  createEffect,
  ofType,
} from '@ngrx/effects';
import {
  catchError,
  map,
  concatMap,
  exhaustMap,
  takeUntil,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { V2Config } from '@x/shared-map-ng-config';

import { ConfigActions } from './config.actions';

/**
 * This effect is ONLY available (enabled) at app initialization.
 * Its job is to load the DEP config json file, as our app deeply depends on
 * that.
 *
 * @export
 * @class V2ConfigEffects
 * @typedef {V2ConfigEffects}
 * @implements {OnRunEffects}
 */
@Injectable()
export class V2ConfigEffects implements OnRunEffects {
  private actions$ = inject(Actions);
  private _map = inject(V2Config);

  /* Enable/Disable the effects ///////////////////////////////////////////// */

  /**
   * Enable this effect class ONLY when `ConfigActions.appInitStart` is
   * dispatched, and disable it as soon as `ConfigActions.appInitFinish` is
   * dispatched.
   *
   * @param {Observable<EffectNotification>} resolvedEffects$
   * @returns {Observable<EffectNotification>}
   */
  ngrxOnRunEffects(
    resolvedEffects$: Observable<EffectNotification>,
  ): Observable<EffectNotification> {
    return this.actions$.pipe(
      ofType(ConfigActions.appInitStart),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.actions$.pipe(ofType(ConfigActions.appInitFinish))),
        ),
      ),
    );
  }

  /* Load Config: DEP /////////////////////////////////////////////////////// */

  loadConfigDep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadConfigDep),
      concatMap(({ url, extraMapFun, assetsFolderName }) => {
        return this._map.loadConfigDep(url, extraMapFun, assetsFolderName).pipe(
          map((data) => ConfigActions.loadConfigDepSuccess({ data })),
          catchError((error) =>
            of(ConfigActions.loadConfigDepFailure({ error })),
          ),
        );
      }),
    ),
  );

  /* Load Config: Firebase ////////////////////////////////////////////////// */

  loadConfigFirebase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadConfigFirebase),
      concatMap(({ url }) => {
        return this._map.loadConfigFirebase(url).pipe(
          map((data) => ConfigActions.loadConfigFirebaseSuccess({ data })),
          catchError((error) =>
            of(ConfigActions.loadConfigFirebaseFailure({ error })),
          ),
        );
      }),
    ),
  );

  /* Load Data: Build /////////////////////////////////////////////////////// */

  loadDataBuild$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadDataBuild),
      concatMap(({ url }) => {
        return this._map.loadDataBuild(url).pipe(
          map((data) => ConfigActions.loadDataBuildSuccess({ data })),
          catchError((error) =>
            of(ConfigActions.loadDataBuildFailure({ error })),
          ),
        );
      }),
    ),
  );
}
