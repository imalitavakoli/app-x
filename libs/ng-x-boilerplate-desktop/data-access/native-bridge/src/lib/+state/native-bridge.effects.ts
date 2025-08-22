import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { NativeBridge } from '@x/ng-x-boilerplate-desktop-map-native-bridge';

import { NativeBridgeActions } from './native-bridge.actions';

@Injectable()
export class NativeBridgeEffects {
  private actions$ = inject(Actions);
  private _nativeBridge = inject(NativeBridge);

  getTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NativeBridgeActions.getTest),
      concatMap(({ url }) => {
        return this._nativeBridge.getTest(url).pipe(
          map((data) =>
            NativeBridgeActions.success({
              relatedTo: 'test',
              data,
            }),
          ),
          catchError((error) =>
            of(
              NativeBridgeActions.failure({
                relatedTo: 'test',
                error,
              }),
            ),
          ),
        );
      }),
    ),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Native window                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  doCloseWindow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NativeBridgeActions.doCloseWindow),
      concatMap(({ stateId, winId }) =>
        this._nativeBridge.closeNativeWindow(stateId, winId).pipe(
          map((data) =>
            NativeBridgeActions.success({
              relatedTo: 'closeWindow',
              data,
            }),
          ),
          catchError((error) =>
            of(
              NativeBridgeActions.failure({
                relatedTo: 'closeWindow',
                error,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  doOpenWindow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NativeBridgeActions.doOpenWindow),
      concatMap(({ stateId, winId, windowConfigs, route }) =>
        this._nativeBridge
          .openNativeWindow(stateId, winId, windowConfigs, route)
          .pipe(
            map((data) =>
              NativeBridgeActions.success({
                relatedTo: 'openWindow',
                data,
              }),
            ),
            catchError((error) =>
              of(
                NativeBridgeActions.failure({
                  relatedTo: 'openWindow',
                  error,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* File dialog                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  getFileDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NativeBridgeActions.getFileDialog),
      concatMap(({ stateId, fileTypes, folderPath }) =>
        this._nativeBridge.getFileDialog(stateId, fileTypes, folderPath).pipe(
          map((data) =>
            NativeBridgeActions.success({
              relatedTo: 'getFileDialog',
              data,
            }),
          ),
          catchError((error) =>
            of(
              NativeBridgeActions.failure({
                relatedTo: 'getFileDialog',
                error,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  putFileDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NativeBridgeActions.putFileDialog),
      concatMap(({ stateId, defaultPath, filterGroups, title }) =>
        this._nativeBridge
          .putFileDialog(stateId, defaultPath, filterGroups, title)
          .pipe(
            map((data) =>
              NativeBridgeActions.success({
                relatedTo: 'putFileDialog',
                data,
              }),
            ),
            catchError((error) =>
              of(
                NativeBridgeActions.failure({
                  relatedTo: 'putFileDialog',
                  error,
                }),
              ),
            ),
          ),
      ),
    ),
  );
}
