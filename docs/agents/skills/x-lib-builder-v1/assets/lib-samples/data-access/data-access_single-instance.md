# 'ng-x-profile-info' functionality 'data-access' lib samples

Here we share the sample files of a functionality called 'ng-x-profile-info', just for you as a source of inspiration.  
This lib has 'single-instance' object structure.

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `README.md` (outer) file

Outer `README.md` file of a lib is the one which rests outside of the `src` folder.
It just mentions a high-level explanation of what the lib holds and does.

```md
# shared-data-access-ng-x-profile-info

Holds Angular apps' x-profile-info NgRx state management codes for controlling x-profile-info state of the app.  
In simple terms, what this lib exports, will be used in the app's `src/app/+state/index.ts` file.  
i.e., exports will be the app's global provided store & effects.

**For what functionality this lib is for?**
ng-x-profile-info.
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `README.md` (inner) file

Inner `README.md` file of a lib is the one which rests inside of the `src` folder.
It MUST include a ready-to-use code for copy-paste in the Test page of the Boilerplate app(s).

````md
# shared-data-access-ng-x-profile-info

x-profile-info v1.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/{app-name}/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V1XProfileInfo_State,
  v1XProfileInfoReducer,
  V1XProfileInfoEffects,
} from '@x/shared-data-access-ng-x-profile-info';

export interface State {
  v1XProfileInfo: V1XProfileInfo_State;
}

export const reducers: ActionReducerMap<State> = {
  v1XProfileInfo: v1XProfileInfoReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
export const effects = [V1XProfileInfoEffects];
```

2. Import the facade in the components where you want to use it.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1XProfileInfoFacade } from '@x/shared-data-access-ng-x-profile-info';

/**
 * NOTE: When calling the lib's methods, we assume the following:
 *
 * The following properties are defined as the following for the app that is being served:
 * - In `apps/{app-name}/src/proxy.conf.json`:
 *   - For all API calls, `target = https://client-x-api.x.com`.
 * - In `apps/{app-name}/{assets-folder}/DEP_config.development.json`:
 *   - `general.environment.environment.items.base_url = /v1`.
 *   - `general.environment.environment.items.client_id = 1234567890`.
 *
 * For authenticated API requests, we assume that the following user is already logged in:
 * - https://admin.x.com/admin/users/123456
 *
 * @export
 * @class V1TestPageComponent
 * @typedef {V1TestPageComponent}
 */
@Component({
  selector: 'x-test-page-v1',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V1TestPageComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  readonly xProfileInfoFacade = inject(V1XProfileInfoFacade);
  private _xProfileInfoSub!: Subscription;

  private readonly _baseUrl = '/v1/';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    // Start listening to the state changes.
    this._xProfileInfoSub = this.xProfileInfoFacade.state$.subscribe(
      (state) => {
        if (state.loadedLatest.data && state.datas.data) {
          console.log('data:', state.datas.data);
        }
      },
    );

    // Get data
    this.xProfileInfoFacade.getData(this._baseUrl, 123);

    // Reset the state after 5 seconds.
    setTimeout(() => {
      this._xProfileInfoSub.unsubscribe();
      this.xProfileInfoFacade.reset(); // Reset the whole state.
      console.log('State reset');
    }, 5000);
  }
}
```

And here's how to show probable errors that may happen while fetching data from server.

```html
@if ((xProfileInfoFacade.errors$ | async)?.data) {
<ng-container>
  <div class="text-center">
    <h1 class="h1 text-lg">Oops! Something went wrong.</h1>
    <p class="p">
      Data could not be loaded
      <small class="e-ecode">V1XProfileInfoFacade/data</small>
    </p>
  </div>
</ng-container>
}
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-data-access-ng-x-profile-info` to execute the unit tests.
````

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

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

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

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

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

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

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

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

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

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

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

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
