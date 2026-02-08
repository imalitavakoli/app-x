# 'ng-x-profile-info' functionality 'data-access' lib samples

Here we share the sample files of a functionality called 'ng-x-profile-info', just for you as a source of inspiration.  
This lib has 'single-instance' object structure.

## `x-profile-info.facade.ts` file

It's the main file of a 'data-access' lib.

```ts
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
```

## `x-profile-info.interfaces.ts` file

```ts
import { V1XProfileInfo_MapData } from '@x/shared-map-ng-x-profile-info';

export interface V1XProfileInfo_Loadeds {
  data?: boolean;
}

export interface V1XProfileInfo_Errors {
  data?: string;
}

export interface V1XProfileInfo_Datas {
  data?: V1XProfileInfo_MapData;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure Actions                                       */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XProfileInfo_SuccessAction {
  relatedTo: V1XProfileInfo_ResponseIsRelatedTo;
  data: V1XProfileInfo_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1XProfileInfo_FailureAction {
  relatedTo: V1XProfileInfo_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

type V1XProfileInfo_ResponseIsRelatedTo = 'data';

type V1XProfileInfo_ResponseData = V1XProfileInfo_MapData;
```

## `x-profile-info.effects.ts` file

```ts
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
```

## `x-profile-info.reducer.ts` file

```ts
import { createFeature, createReducer, on } from '@ngrx/store';

import { XProfileInfoActions } from './x-profile-info.actions';
import {
  V1XProfileInfo_Errors,
  V1XProfileInfo_Loadeds,
  V1XProfileInfo_Datas,
  V1XProfileInfo_SuccessAction,
  V1XProfileInfo_FailureAction,
} from './x-profile-info.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const xProfileInfoFeatureKey = 'v1XProfileInfo';

export interface V1XProfileInfo_State {
  // blahblah: string | undefined;

  loadedLatest: V1XProfileInfo_Loadeds;
  loadeds: V1XProfileInfo_Loadeds;
  errors: V1XProfileInfo_Errors;
  datas: V1XProfileInfo_Datas;
}

// NOTE: Exported ONLY for test codes.
export const initialState: V1XProfileInfo_State = {
  // blahblah: undefined,

  loadedLatest: {} as V1XProfileInfo_Loadeds,
  loadeds: {} as V1XProfileInfo_Loadeds,
  errors: {} as V1XProfileInfo_Errors,
  datas: {} as V1XProfileInfo_Datas,
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

export const v1XProfileInfoReducer = createReducer(
  initialState,

  /* Get data /////////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.getData,
    (state, action): V1XProfileInfo_State => ({
      ...state,
      loadedLatest: { data: false },
      loadeds: { ...state.loadeds, data: undefined },
      errors: { ...state.errors, data: undefined },
      datas: { ...state.datas, data: undefined },
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(XProfileInfoActions.reset, (state) => initialState),

  on(
    XProfileInfoActions.success,
    (state, action): V1XProfileInfo_State => ({
      ...state,
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      datas: { ...state.datas, [action.relatedTo]: action.data },
    }),
  ),

  on(
    XProfileInfoActions.failure,
    (state, action): V1XProfileInfo_State => ({
      ...state,
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      errors: { ...state.errors, [action.relatedTo]: action.error },
    }),
  ),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Selectors (auto generated via `createFeature()`)             */
/* ////////////////////////////////////////////////////////////////////////// */

export const xProfileInfoFeature = createFeature({
  name: xProfileInfoFeatureKey,
  reducer: v1XProfileInfoReducer,
});
```

## `x-profile-info.actions.ts` file

```ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  V1XProfileInfo_SuccessAction,
  V1XProfileInfo_FailureAction,
} from './x-profile-info.interfaces';

export const XProfileInfoActions = createActionGroup({
  source: 'V1XProfileInfo',
  events: {
    /* Get data ///////////////////////////////////////////////////////////// */

    getData: props<{
      lib: string;
      url: string;
      userId: number;
    }>(),

    /* Other actions //////////////////////////////////////////////////////// */

    reset: emptyProps(),
    success: props<V1XProfileInfo_SuccessAction>(),
    failure: props<V1XProfileInfo_FailureAction>(),
  },
});
```

## `x-profile-info.selectors.ts` file

```ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromXProfileInfo from './x-profile-info.reducer';

/**
 * Compute to see if there are any `errors` in the state.
 * Returns `true` if there's at least one error, otherwise `false`.
 *
 * @type {boolean}
 */
export const selectHasError = createSelector(
  fromXProfileInfo.xProfileInfoFeature.selectV1XProfileInfoState,
  (state: fromXProfileInfo.V1XProfileInfo_State) => {
    return Object.values(state.errors).some((error) => error !== undefined);
  },
);
```
