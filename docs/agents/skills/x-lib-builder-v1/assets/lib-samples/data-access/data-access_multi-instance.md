# 'ng-x-credit' functionality 'data-access' lib samples

Here we share the sample files of a functionality called 'ng-x-credit', just for you as a source of inspiration.  
This lib has 'multi-instance' object structure.

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
# shared-data-access-ng-x-credit

Holds Angular apps' x-credit NgRx state management codes for controlling x-credit state of the app.  
In simple terms, what this lib exports, will be used in the app's `src/app/+state/index.ts` file.  
i.e., exports will be the app's global provided store & effects.

**For what functionality this lib is for?**
ng-x-credit.
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
# shared-data-access-ng-x-credit

x-credit v1.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/{app-name}/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V1XCredit_State,
  v1XCreditReducer,
  V1XCreditEffects,
} from '@x/shared-data-access-ng-x-credit';

export interface State {
  v1XCredit: V1XCredit_State;
}

export const reducers: ActionReducerMap<State> = {
  v1XCredit: v1XCreditReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
export const effects = [V3XCreditEffects];
```

2. Import the facade in the components where you want to use it.

```ts
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V3XCreditFacade } from '@x/shared-data-access-ng-x-credit';

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
export class V1TestPageComponent implements OnInit, OnDestroy {
  readonly configFacade = inject(V2ConfigFacade);
  readonly xCreditFacade = inject(V3XCreditFacade);
  private _xCreditEntitySub!: Subscription;

  private readonly _baseUrl = '/v1/';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    // Before subscribing to the state changes, create the entity
    // `V1TestPageComponent` if it doesn't exist.
    this.xCreditFacade.createIfNotExists('V1TestPageComponent');

    // Check if the user has already set a preferred style (in her last app visit).
    this.xCreditFacade.checkIfAlreadySetStyle();

    // Set the user's set preferred style in the state object
    this.xCreditFacade.setStyle('sharp');

    // Get the last preferred style.
    this.xCreditFacade.lastSetStyle$.pipe(take(1)).subscribe((style) => {
      console.log('lastSetStyle:', style);
    });

    // Get the current status of the whole state.
    this.xCreditFacade.state$.pipe(take(1)).subscribe((state) => {
      console.log('state:', state);
    });

    // Start listening to the state changes of `V1TestPageComponent` entity.
    this._xCreditEntitySub = this.xCreditFacade
      .entity$('V1TestPageComponent')
      .subscribe((state) => {
        if (state.loadedLatest.summary && state.datas.summary) {
          console.log('summary:', state.datas.summary);
        }
        if (state.loadedLatest.detail && state.datas.detail) {
          console.log('detail:', state.datas.detail);
        }
      });

    // Get summary
    this.xCreditFacade.getSummary(this._baseUrl, 123, 'V1TestPageComponent');

    // Get detail
    this.xCreditFacade.getDetail(this._baseUrl, 123, 'V1TestPageComponent');

    // Reset the state after 5 seconds.
    setTimeout(() => {
      this._xCreditEntitySub.unsubscribe();
      this.xCreditFacade.reset('V1TestPageComponent'); // Reset only the entity object itself.
      this.xCreditFacade.resetAll(); // Reset the whole state.
      console.log('State reset');
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this._xCreditEntitySub) this._xCreditEntitySub.unsubscribe();
  }
}
```

And here's how to show probable errors that may happen while fetching data from server.

```html
@if (xCreditFacade.entityHasError$('V1TestPageComponent') | async) {
<ng-container>
  <div class="text-center">
    <h1 class="h1 text-lg">Oops! Something went wrong.</h1>
    <p class="p">
      Data could not be loaded

      <!-- xCreditFacade/summary /////////////////////////////////////////// -->

      @if ((xCreditFacade.entityErrors$('V1TestPageComponent') |
      async)?.summary) {
      <small class="e-ecode">
        V1XCreditFacade({{ 'V1TestPageComponent' }})/summary
      </small>
      }

      <!-- xCreditFacade/detail //////////////////////////////////////////// -->

      @if ((xCreditFacade.entityErrors$('V1TestPageComponent') | async)?.detail)
      {
      <small class="e-ecode">
        V1XCreditFacade({{ 'V1TestPageComponent' }})/detail
      </small>
      }
    </p>
  </div>
</ng-container>
}
```

## More

_Optional!_ Instead of registering the data-access state in the app, you can register it right in the page itself.

```ts
// lib.routes.ts

import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { V1TestPageComponent } from './test/test.component';
import {
  xCreditFeatureKey,
  v1XCreditReducer,
  V1XCreditEffects,
} from '@x/shared-data-access-ng-x-credit';

export const V1TestRoutes: Route[] = [
  {
    path: '',
    component: V1TestPageComponent,
    providers: [
      provideState(xCreditFeatureKey, v1XCreditReducer),
      provideEffects(V1XCreditEffects),
    ],
  },
];
```
````

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-credit.facade.ts` file

It's the main file of a 'data-access' lib.

```ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@x/shared-util-ng-bases';
import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';

import { XCreditActions } from './x-credit.actions';
import * as selectors from './x-credit.selectors';
import * as reducer from './x-credit.reducer';
import {
  V1XCredit_Loadeds,
  V1XCredit_Errors,
  V1XCredit_Datas,
} from './x-credit.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V1XCreditFacade extends V1BaseFacade {
  // protected readonly _store = inject(Store); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Let's select one option from our feature state object.        */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(select(selectors.selectState));
  allEntities$ = this._store.pipe(select(selectors.selectAllEntities));

  lastSetStyle$ = this._store.pipe(select(selectors.selectLastSetStyle));

  entity$(id = 'g'): Observable<reducer.V1XCredit_Entity> {
    return this._store.pipe(select(selectors.selectEntity(id)));
  }
  entityLoadedLatest$(id = 'g'): Observable<V1XCredit_Loadeds> {
    return this._store.pipe(select(selectors.selectEntityLoadedLatest(id)));
  }
  entityLoadeds$(id = 'g'): Observable<V1XCredit_Loadeds> {
    return this._store.pipe(select(selectors.selectEntityLoadeds(id)));
  }
  entityErrors$(id = 'g'): Observable<V1XCredit_Errors> {
    return this._store.pipe(select(selectors.selectEntityErrors(id)));
  }
  entityDatas$(id = 'g'): Observable<V1XCredit_Datas> {
    return this._store.pipe(select(selectors.selectEntityDatas(id)));
  }
  entityHasError$(id = 'g'): Observable<boolean> {
    return this._store.pipe(select(selectors.selectEntityHasError(id)));
  }

  hasEntity$(id = 'g'): Observable<boolean> {
    return this._store.pipe(select(selectors.selectHasEntity(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions: Let's modify the state by dispatching actions.                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Set the user's set preferred style in the state object
   *
   * @param {V1XCredit_Style} style
   */
  setStyle(style: V1XCredit_Style) {
    this._store.dispatch(XCreditActions.setStyle({ style }));
  }

  /**
   * Check if the user has already set a preferred style (in her last app visit).
   */
  checkIfAlreadySetStyle() {
    this._store.dispatch(XCreditActions.checkIfAlreadySetStyle());
  }

  /**
   * Get summary data
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [id='g']
   * @param {string} [lib='any']
   */
  getSummary(url: string, userId: number, id = 'g', lib = 'any') {
    this._store.dispatch(
      XCreditActions.getSummary({
        lib,
        id,
        url,
        userId,
      }),
    );
  }

  /**
   * Get detail data
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [id='g']
   * @param {string} [lib='any']
   */
  getDetail(url: string, userId: number, id = 'g', lib = 'any') {
    this._store.dispatch(
      XCreditActions.getDetail({
        lib,
        id,
        url,
        userId,
      }),
    );
  }

  /**
   * Create a new instance if it doesn't exist. This is useful when you want to
   * use this 'data-access' lib in multiple 'feature' libs and you don't like
   * the stored data for each lib to interfere with each other.
   *
   * NOTE: There's always a default instance with id 'g' which stands for 'global'.
   *
   * NOTE: This method always MUST be used before subscribing to any entity
   * related Observables such as `entity$`, `entityLoadedLatest$`, etc.
   *
   * @param {string} id
   */
  createIfNotExists(id: string) {
    this._store.dispatch(XCreditActions.createIfNotExists({ id }));
  }

  /**
   * Reset one instance object to its initial state. This is useful when you
   * want to reset the state of a specific entity.
   *
   * @param {string} id
   */
  reset(id: string) {
    this._store.dispatch(XCreditActions.reset({ id }));
  }

  /**
   * Reset the state. This is useful mostly for the times that user logs out of
   * the app... In such cases, you may want to reset the state to the initial state.
   *
   * NOTE: This will reset the state to the initial state. This process includes
   * removing all the entities but keeping the default entity with id 'g'.
   */
  resetAll() {
    this._store.dispatch(XCreditActions.resetAll());
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

## `x-credit.interfaces.ts` file

```ts
import {
  V1XCredit_MapSummary,
  V1XCredit_MapDetail,
} from '@x/shared-map-ng-x-credit';

export interface V1XCredit_Loadeds {
  summary?: boolean;
  detail?: boolean;
}

export interface V1XCredit_Errors {
  summary?: string;
  detail?: string;
}

export interface V1XCredit_Datas {
  summary?: V1XCredit_MapSummary;
  detail?: V1XCredit_MapDetail;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure Actions                                       */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_InstancePropsSuccess {
  relatedTo: V1XCredit_ResponseIsRelatedTo;
  data: V1XCredit_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1XCredit_InstancePropsFailure {
  relatedTo: V1XCredit_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

export type V1XCredit_ResponseIsRelatedTo = 'summary' | 'detail';

type V1XCredit_ResponseData = V1XCredit_MapSummary | V1XCredit_MapDetail;
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-credit.effects.ts` file

```ts
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
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-credit.reducer.ts` file

```ts
import { Action, createFeature, createReducer, on } from '@ngrx/store';
import {
  EntityState,
  EntityAdapter,
  createEntityAdapter,
  Update,
} from '@ngrx/entity';

import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';

import {
  V1XCredit_Errors,
  V1XCredit_Loadeds,
  V1XCredit_Datas,
  V1XCredit_InstancePropsSuccess,
  V1XCredit_InstancePropsFailure,
  V1XCredit_ResponseIsRelatedTo,
} from './x-credit.interfaces';
import { XCreditActions } from './x-credit.actions';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

export const xCreditFeatureKey = 'v1XCredit';

/**
 * This is our one single instance interface.
 *
 * @export
 * @interface V1XCredit_Entity
 * @typedef {V1XCredit_Entity}
 */
export interface V1XCredit_Entity {
  id: 'g' | string; // Unique identifier for this instance
  loadedLatest: V1XCredit_Loadeds;
  loadeds: V1XCredit_Loadeds;
  errors: V1XCredit_Errors;
  datas: V1XCredit_Datas;
}

/**
 * This is our whole feature state interface.
 * We are extending from EntityState of NgRx, which means whatever option we add
 * to our state here, is actually sitting beside some other options that are
 * added by EntityState already. So our state has a special notation. `ids` and
 * `entities` options are already available! So our state object can look
 * something like this:
 * `{ ids:['g','2',...], entities: { '2': {...} }, selectedId: '2' }`
 *
 * @export
 * @interface V1XCredit_State
 * @typedef {V1XCredit_State}
 * @extends {EntityState<V1XCredit_Entity>}
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V1XCredit_State extends EntityState<V1XCredit_Entity> {
  // NOTE: We disabled `selectedId`, because we don't need it for this functionality.
  // selectedId?: 'g' | string; // Shows which record has been selected
  lastSetStyle: V1XCredit_Style | undefined;
}

interface V1XCredit_PartialState {
  readonly [xCreditFeatureKey]: V1XCredit_State;
}

/**
 * What `createEntityAdapter()` method returns?
 * It's just an object with some helper functions, that can help us to update
 * the entities option in our feature state, easier. How it can do that? By the
 * unique identifier that we provide to it (in this case, `id`).
 * Read more: https://ngrx.io/guide/entity/adapter
 *
 * @type {EntityAdapter<V1XCredit_Entity>}
 */
export const v1XCreditAdapter: EntityAdapter<V1XCredit_Entity> =
  createEntityAdapter<V1XCredit_Entity>({
    selectId: (entity: V1XCredit_Entity) => entity.id,
  });

/**
 * This is our whole feature state object.
 * By the help of `getInitialState()` method, we create a initial state options
 * values... The `itemsAdapter` itself has our entities, now we just add the
 * initial state of other options that it doesn't have.
 *
 * @type {V1XCredit_State}
 */
export const initialState: V1XCredit_State = v1XCreditAdapter.addOne(
  {
    id: 'g',
    loadedLatest: {} as V1XCredit_Loadeds,
    loadeds: {} as V1XCredit_Loadeds,
    errors: {} as V1XCredit_Errors,
    datas: {} as V1XCredit_Datas,
  },
  v1XCreditAdapter.getInitialState({
    lastSetStyle: undefined,
  }),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

const reducer = createReducer(
  initialState,

  /* Select a style ///////////////////////////////////////////////////////// */

  on(XCreditActions.setStyle, (state, { style }) => {
    return { ...state, lastSetStyle: style };
  }),

  /* Get summary data /////////////////////////////////////////////////////// */

  on(XCreditActions.getSummary, (state, { id }) =>
    v1XCreditAdapter.updateOne(
      {
        id: getId(state, id),
        changes: entitySetToLoading(state, getId(state, id), 'summary'),
      },
      { ...state },
    ),
  ),

  /* Get detail data /////////////////////////////////////////////////////// */

  on(XCreditActions.getDetail, (state, { id }) =>
    v1XCreditAdapter.updateOne(
      {
        id: getId(state, id),
        changes: entitySetToLoading(state, getId(state, id), 'detail'),
      },
      { ...state },
    ),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(XCreditActions.createIfNotExists, (state, { id }) => {
    const hasInstance = !!state.entities[id];
    if (hasInstance) return { ...state };
    return v1XCreditAdapter.addOne(
      {
        id: id,
        loadedLatest: {},
        loadeds: {},
        errors: {},
        datas: {},
      },
      { ...state },
    );
  }),

  on(XCreditActions.reset, (state, { id }) =>
    v1XCreditAdapter.updateOne(
      {
        id: getId(state, id),
        changes: entityReset(state, getId(state, id)),
      },
      { ...state },
    ),
  ),

  on(XCreditActions.resetAll, (state) => initialState),

  on(XCreditActions.success, (state, { id, props }) =>
    v1XCreditAdapter.updateOne(
      {
        id: getId(state, id),
        changes: entityInjectData(state, getId(state, id), props),
      },
      { ...state },
    ),
  ),

  on(XCreditActions.failure, (state, { id, props }) =>
    v1XCreditAdapter.updateOne(
      {
        id: getId(state, id),
        changes: entityInjectError(state, getId(state, id), props),
      },
      { ...state },
    ),
  ),
);

export function v1XCreditReducer(
  state: V1XCredit_State | undefined,
  action: Action,
) {
  return reducer(state, action);
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful functions                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

function getId(state: V1XCredit_State, instanceId: string): 'g' | string {
  const hasInstance = !!state.entities[instanceId];
  if (!hasInstance) {
    console.error(
      `@x-credit.reducer/getId: No entity found with id: ${instanceId}`,
    );
  }

  // NOTE: We just log IF the instance (`id`) doesn't exist in the state
  // object, and we don't return `g` instance instead! Because we like the app
  // to break so that debugging becomes easier.
  // return hasInstance ? instanceId : 'g';
  return instanceId;
}

function entityReset(
  state: V1XCredit_State,
  instanceId: string,
): V1XCredit_Entity {
  return {
    id: instanceId,
    loadedLatest: {},
    loadeds: {},
    errors: {},
    datas: {},
  };
}

/**
 * It sets one property of the entity, rather than the other common properties,
 * such as `loadedLatest`, `loadeds`, `errors`, `datas`.
 *
 * @param {V1XCredit_State} state
 * @param {string} instanceId
 * @param {string} propKey
 * @param {*} propValue
 * @returns {V1XCredit_Entity}
 */
function entitySetOneProp(
  state: V1XCredit_State,
  instanceId: string,
  propKey: string,
  propValue: any,
): V1XCredit_Entity {
  const entity = state.entities[instanceId] as V1XCredit_Entity;
  return {
    ...entity,
    [propKey]: propValue,
  };
}

function entitySetToLoading(
  state: V1XCredit_State,
  instanceId: string,
  propKey: V1XCredit_ResponseIsRelatedTo,
): V1XCredit_Entity {
  const entity = state.entities[instanceId] as V1XCredit_Entity;
  return {
    ...entity,
    loadedLatest: { [propKey]: false },
    loadeds: { ...entity.loadeds, [propKey]: undefined },
    errors: { ...entity.errors, [propKey]: undefined },
    datas: { ...entity.datas, [propKey]: undefined },
  };
}

function entityInjectData(
  state: V1XCredit_State,
  instanceId: string,
  props: V1XCredit_InstancePropsSuccess,
): V1XCredit_Entity {
  const entity = state.entities[instanceId] as V1XCredit_Entity;
  return {
    ...entity,
    loadedLatest: { [props.relatedTo]: true },
    loadeds: { ...entity.loadeds, [props.relatedTo]: true },
    datas: { ...entity.datas, [props.relatedTo]: props.data },
  };
}

function entityInjectError(
  state: V1XCredit_State,
  instanceId: string,
  props: V1XCredit_InstancePropsFailure,
): V1XCredit_Entity {
  const entity = state.entities[instanceId] as V1XCredit_Entity;
  return {
    ...entity,
    loadedLatest: { [props.relatedTo]: true },
    loadeds: { ...entity.loadeds, [props.relatedTo]: true },
    errors: { ...entity.errors, [props.relatedTo]: props.error },
  };
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-credit.actions.ts` file

```ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';

import {
  V1XCredit_InstancePropsSuccess,
  V1XCredit_InstancePropsFailure,
} from './x-credit.interfaces';

export const XCreditActions = createActionGroup({
  source: 'V1XCredit',
  events: {
    /* ////////////////////////////////////////////////////////////////////// */
    /* Select a style                                                         */
    /* ////////////////////////////////////////////////////////////////////// */

    setStyle: props<{
      style: V1XCredit_Style;
    }>(),

    checkIfAlreadySetStyle: emptyProps(), // Check if the user has already set a preferred style (in her last app visit).

    /* ////////////////////////////////////////////////////////////////////// */
    /* Get summary data                                                       */
    /* ////////////////////////////////////////////////////////////////////// */

    getSummary: props<{
      lib: string;
      id: string;
      url: string;
      userId: number;
    }>(),

    /* ////////////////////////////////////////////////////////////////////// */
    /* Get detail data                                                        */
    /* ////////////////////////////////////////////////////////////////////// */

    getDetail: props<{
      lib: string;
      id: string;
      url: string;
      userId: number;
    }>(),

    /* ////////////////////////////////////////////////////////////////////// */
    /* Other actions                                                          */
    /* ////////////////////////////////////////////////////////////////////// */

    createIfNotExists: props<{ id: string }>(),
    reset: props<{ id: string }>(),
    resetAll: emptyProps(),
    success: props<{ id: string; props: V1XCredit_InstancePropsSuccess }>(),
    failure: props<{ id: string; props: V1XCredit_InstancePropsFailure }>(),
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

## `x-credit.selectors.ts` file

```ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as reducer from './x-credit.reducer';

/**
 * `createFeatureSelector()` method?
 * In simple terms, it selects our whole feature state:
 * e.g., `{ ids: ['g','2',...], entities: { '2': { ... } }, selectedId: '2' }`
 * NOTE: We don't need it in our components most of the times.
 */
export const selectState = createFeatureSelector<reducer.V1XCredit_State>(
  reducer.xCreditFeatureKey,
);

export const selectLastSetStyle = createSelector(
  selectState,
  (state: reducer.V1XCredit_State) => state.lastSetStyle,
);

/**
 * What `getSelectors()` method returns?
 * Some helper fucntions that help us to select our entities inside of our
 * feature state object. Why we need such helpers? Because remember? It was NOT
 * us who added the entities, but it was `itemsAdapter` which added our entities
 * into our feature object.
 */
const { selectAll, selectEntities } = reducer.v1XCreditAdapter.getSelectors();

/**
 * An array with all of our entities inside of it.
 */
export const selectAllEntities = createSelector(
  selectState,
  (state: reducer.V1XCredit_State) => selectAll(state),
);

/**
 * Factory function to create a selector that returns the entity object.
 * @param id The entity object's id.
 * @returns A selector that returns the entity object.
 */
export const selectEntity = (id = 'g') => {
  return createSelector(selectState, (state: reducer.V1XCredit_State) => {
    // NOTE: We just log IF the instance (`id`) doesn't exist in the state
    // object, and we don't return `g` instance instead! Because we like the app
    // to break so that debugging becomes easier.
    // const entity = state.entities[id] || state.entities['g'];
    const entity = state.entities[id];

    if (!state.entities[id]) {
      console.error(
        `@x-credit.selectors/selectEntity: No entity found with id: ${id}`,
      );
    }
    return entity as reducer.V1XCredit_Entity;
  });
};

export const selectEntityLoadedLatest = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity) => state.loadedLatest,
  );
};

export const selectEntityLoadeds = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity) => state.loadeds,
  );
};

export const selectEntityErrors = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity) => state.errors,
  );
};

export const selectEntityDatas = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity) => state.datas,
  );
};

/**
 * Factory function to create a selector that sees if there are any `errors` in
 * the target instace object or not.
 * @param id The entity object's id.
 * @returns A selector that returns `true` if there's at least one error, otherwise `false`.
 */
export const selectEntityHasError = (id = 'g') => {
  // Find the entity in the state object.
  const entity = selectEntity(id);

  // Check if there's any error in the entity object.
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity | undefined) => {
      return state
        ? Object.values(state.errors).some((error) => error !== undefined)
        : false;
    },
  );
};

/**
 * Factory function to create a selector that returns whether an instance
 * exists or not.
 * @param id The entity object's id.
 * @returns A selector that returns `true` if an instance with the provided is exists, otherwise `false`.
 */
export const selectHasEntity = (id = 'g') => {
  return createSelector(selectState, (state: reducer.V1XCredit_State) => {
    const entity = state.entities[id];
    if (!entity) return false;
    return true;
  });
};
```
