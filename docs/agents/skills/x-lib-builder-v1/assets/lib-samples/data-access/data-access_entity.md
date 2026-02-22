# 'ng-x-users' functionality 'data-access' lib samples

Here we share the sample files of a functionality called 'ng-x-users', just for you as a source of inspiration.  
This lib has 'entity' object structure.

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
# shared-data-access-ng-x-users

Holds Angular apps' x-users NgRx state management codes for controlling x-users state of the app.  
In simple terms, what this lib exports, will be used in the app's `src/app/+state/index.ts` file.  
i.e., exports will be the app's global provided store & effects.

**For what functionality this lib is for?**
ng-x-users.
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
# shared-data-access-ng-x-users

x-users v1.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/{app-name}/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V1XUsers_State,
  v1XUsersReducer,
  V1XUsersEffects,
} from '@x/shared-data-access-ng-x-users';

export interface State {
  v1XUsers: V1XUsers_State;
}

export const reducers: ActionReducerMap<State> = {
  v1XUsers: v1XUsersReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
export const effects = [V1XUsersEffects];
```

2. Import the facade in the components where you want to use it.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1XUsersFacade } from '@x/shared-data-access-ng-x-users';

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
  readonly xUsersFacade = inject(V1XUsersFacade);

  private readonly _baseUrl = '/v1/';
  private readonly _user: V1XUsers_MapUser = {
    id: 123,
    name: 'John Doe',
    username: 'joe',
    email: 'joe@x.com',
  };

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    // Get the current status of the whole state.
    this.xUsersFacade.state$.pipe(take(1)).subscribe((state) => {
      console.log('state:', state);

      if (state.loaded && !state.error && state.crudActionLatest === 'getAll') {
        // ...
      }
    });

    // Get all entities.
    this.xUsersFacade.getAll(this._baseUrl);

    // After having all entities in the state object, select one of them.
    this.itemsFacade.setSelectedId(123);

    // Get the current data of the previously selected entity.
    this.xUsersFacade.selectedEntity$.pipe(take(1)).subscribe((entity) => {
      console.log('entity:', entity);
    });

    // Add new entity.
    this.xUsersFacade.addOne(this._baseUrl, this._user);

    // Update an entity that we already had its `id`.
    this.xUsersFacade.updateOne(this._baseUrl, this._user);

    // Remove an entity that we already had its `id`.
    this.xUsersFacade.removeOne(this._baseUrl, this._user);
  }
}
```

After setting all entities in TS, here's how to show them in 'all' page:

```html
<main>
  <!-- Loading -->
  @if ((xUsersFacade.loaded$ | async) === false) { Loading entities... }

  <!-- Loaded -->
  @if (xUsersFacade.loaded$ | async) {
  <section>
    @for (entity of xUsersFacade.allEntities$ | async; track $index) {
    <div>{{ entity.id }}</div>
    }
  </section>
  }
</main>
```

After setting all entities, and selecting one in TS, here's how to show it in 'one' page:

```html
<main>{{ (xUsersFacade.selectedEntity$ | async)?.id }}</main>
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-data-access-ng-x-users` to execute the unit tests.
````

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-users.facade.ts` file

It's the main file of a 'data-access' lib.

```ts
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
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-users.interfaces.ts` file

```ts
export type V1XUsers_CrudAction =
  | 'getAll'
  | 'addOne'
  | 'addMany'
  | 'updateOne'
  | 'updateMany'
  | 'removeOne'
  | 'removeMany'
  | 'removeAll';
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-users.effects.ts` file

```ts
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
      concatMap(({ lib, url }) => {
        return this._map.getAll(url, lib).pipe(
          map((users) => XUsersActions.getAllSuccess({ users })),
          catchError((error) => of(XUsersActions.failure({ error }))),
        );
      }),
    ),
  );

  addOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XUsersActions.addOne),
      concatMap(({ lib, url, user }) => {
        return this._map.addOne(url, user, lib).pipe(
          map((user) => XUsersActions.addOneSuccess({ user })),
          catchError((error) => of(XUsersActions.failure({ error }))),
        );
      }),
    ),
  );

  updateOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(XUsersActions.updateOne),
      concatMap(({ lib, url, user }) => {
        return this._map.updateOne(url, user, lib).pipe(
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
      concatMap(({ lib, url, id }) => {
        return this._map.removeOne(url, id, lib).pipe(
          map((id) => XUsersActions.removeOneSuccess({ id })),
          catchError((error) => of(XUsersActions.failure({ error }))),
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

## `x-users.reducer.ts` file

```ts
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action, createFeature } from '@ngrx/store';

import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

import { XUsersActions } from './x-users.actions';
import { V1XUsers_CrudAction } from './x-users.interfaces';

export const xUsersFeatureKey = 'v1XUsers';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * This is our whole feature state interface.
 * We are extending from EntityState of NgRx, which means whatever option we add
 * to our state here, is actually sitting beside some other options that are
 * added by EntityState already. So our state has a special notation. `ids` and
 * `entities` options are already available! So our state object can look
 * something like this:
 * `{ ids:[1,2,...], entities: { 1: {...} }, loaded: false }`
 *
 * @export
 * @interface V1XUsers_State
 * @typedef {V1XUsers_State}
 * @extends {EntityState<V1XUsers_MapUser>}
 */
export interface V1XUsers_State extends EntityState<V1XUsers_MapUser> {
  selectedId?: string | number; // which Items record has been selected
  crudActionLatest?: V1XUsers_CrudAction; // The last CRUD operation
  loaded: boolean; // has the last CRUD operation completed (loaded its result)
  error?: string; // last known error (if any)
}

interface V1XUsers_PartialState {
  readonly [xUsersFeatureKey]: V1XUsers_State;
}

/**
 * What `createEntityAdapter()` method returns?
 * It's just an object with some helper functions, that can help us to update
 * the entities option in our feature state, easier.
 * Read more: https://ngrx.io/guide/entity/adapter
 *
 * @type {EntityAdapter<V1XUsers_MapUser>}
 */
export const v1XUsersAdapter: EntityAdapter<V1XUsers_MapUser> =
  createEntityAdapter<V1XUsers_MapUser>();

/**
 * This is our whole feature state object.
 * By the help of `getInitialState()` method, we create a initial state options
 * values... The `v1XUsersAdapter` itself has our entities, now we just add the
 * initial state of other options that it doesn't have.
 *
 * @type {V1XUsers_State}
 */
export const initialState: V1XUsers_State = v1XUsersAdapter.getInitialState({
  loaded: false,
});

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * `createReducer()` method?
 * It creates our feature state mechanism. When we like to create it, we provide
 * it the initial values of our feature state options, and set on (via `on()`
 * method) what action, update what option. And that's how our feature state
 * object, gets updated when an action occurs.
 *
 * NOTE: ONLY whenever we like to update our entities option in our feature
 * state object, we use `v1XUsersAdapter` to take advantage of its helper
 * functions. So obviously, updating other options (such as `loaded`) won't need
 * us to use `v1XUsersAdapter` at all.
 */
const reducer = createReducer(
  initialState,

  /* Set/Update/Delete entities ///////////////////////////////////////////// */

  on(XUsersActions.getAll, (state) => ({
    ...state,
    crudActionLatest: 'getAll' as const,
    loaded: false,
    error: undefined,
  })),
  on(XUsersActions.getAllSuccess, (state, { users }) =>
    v1XUsersAdapter.setAll(users, { ...state, loaded: true }),
  ),

  on(XUsersActions.addOne, (state) => ({
    ...state,
    crudActionLatest: 'addOne' as const,
    loaded: false,
    error: undefined,
  })),
  on(XUsersActions.addOneSuccess, (state, { user }) =>
    v1XUsersAdapter.addOne(user, { ...state, loaded: true }),
  ),

  on(XUsersActions.addMany, (state) => ({
    ...state,
    crudActionLatest: 'addMany' as const,
    loaded: false,
    error: undefined,
  })),
  on(XUsersActions.addManySuccess, (state, { users }) =>
    v1XUsersAdapter.addMany(users, { ...state, loaded: true }),
  ),

  on(XUsersActions.updateOne, (state) => ({
    ...state,
    crudActionLatest: 'updateOne' as const,
    loaded: false,
    error: undefined,
  })),
  on(XUsersActions.updateOneSuccess, (state, { user }) =>
    v1XUsersAdapter.updateOne(user, { ...state, loaded: true }),
  ),

  on(XUsersActions.updateMany, (state) => ({
    ...state,
    crudActionLatest: 'updateMany' as const,
    loaded: false,
    error: undefined,
  })),
  on(XUsersActions.updateManySuccess, (state, { users }) =>
    v1XUsersAdapter.updateMany(users, { ...state, loaded: true }),
  ),

  on(XUsersActions.removeOne, (state) => ({
    ...state,
    crudActionLatest: 'removeOne' as const,
    loaded: false,
    error: undefined,
  })),
  on(XUsersActions.removeOneSuccess, (state, { id }) =>
    v1XUsersAdapter.removeOne(id, { ...state, loaded: true }),
  ),

  on(XUsersActions.removeMany, (state) => ({
    ...state,
    crudActionLatest: 'removeMany' as const,
    loaded: false,
    error: undefined,
  })),
  on(XUsersActions.removeManySuccess, (state, { ids }) =>
    v1XUsersAdapter.removeMany(ids, { ...state, loaded: true }),
  ),

  on(XUsersActions.removeAll, (state) => ({
    ...state,
    crudActionLatest: 'removeAll' as const,
    loaded: false,
    error: undefined,
  })),
  on(XUsersActions.removeAllSuccess, (state) =>
    v1XUsersAdapter.removeAll({
      ...state,
      loaded: true,
      selectedId: undefined,
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(XUsersActions.setSelectedId, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),

  on(XUsersActions.failure, (state, { error }) => ({
    ...state,
    loaded: true,
    error,
  })),
);

export function v1XUsersReducer(
  state: V1XUsers_State | undefined,
  action: Action,
) {
  return reducer(state, action);
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-users.actions.ts` file

```ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

export const XUsersActions = createActionGroup({
  source: 'V1XUsers',

  events: {
    /* Set/Update/Delete entities /////////////////////////////////////////// */

    getAll: props<{ lib: string; url: string }>(),
    getAllSuccess: props<{ users: V1XUsers_MapUser[] }>(),

    addOne: props<{ lib: string; url: string; user: V1XUsers_MapUser }>(),
    addOneSuccess: props<{ user: V1XUsers_MapUser }>(),

    addMany: props<{ lib: string; url: string; users: V1XUsers_MapUser[] }>(),
    addManySuccess: props<{ users: V1XUsers_MapUser[] }>(),

    updateOne: props<{ lib: string; url: string; user: V1XUsers_MapUser }>(),
    updateOneSuccess: props<{ user: Update<V1XUsers_MapUser> }>(),

    updateMany: props<{
      lib: string;
      url: string;
      users: V1XUsers_MapUser[];
    }>(),
    updateManySuccess: props<{ users: Update<V1XUsers_MapUser>[] }>(),

    removeOne: props<{ lib: string; url: string; id: number }>(),
    removeOneSuccess: props<{ id: number }>(),

    removeMany: props<{ lib: string; url: string; ids: number[] }>(),
    removeManySuccess: props<{ ids: number[] }>(),

    removeAll: props<{ lib: string; url: string }>(),
    removeAllSuccess: emptyProps(),

    failure: props<{ error: string }>(),

    /* Other actions //////////////////////////////////////////////////////// */

    setSelectedId: props<{ id: number }>(),
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

## `x-users.selectors.ts` file

```ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  xUsersFeatureKey,
  V1XUsers_State,
  v1XUsersAdapter,
} from './x-users.reducer';

/**
 * `createFeatureSelector()` method?
 * In simple terms, it selects our whole feature state:
 * e.g., `{ ids: [1,2,...], entities: { 1: { ... } }, loaded: false }`
 * NOTE: We don't need it in our components most of the times.
 */
export const selectState =
  createFeatureSelector<V1XUsers_State>(xUsersFeatureKey);

/**
 * `createSelector()` method?
 * In simple terms, it selects ONLY part of our feature state.
 * e.g., here the `loaded` option of our state object is selected.
 */
export const selectLoaded = createSelector(
  selectState,
  (state: V1XUsers_State) => state.loaded,
);

export const selectError = createSelector(
  selectState,
  (state: V1XUsers_State) => state.error,
);

export const selectCrudActionLatest = createSelector(
  selectState,
  (state: V1XUsers_State) => state.crudActionLatest,
);

export const selectSelectedId = createSelector(
  selectState,
  (state: V1XUsers_State) => state.selectedId,
);

/**
 * What `getSelectors()` method returns?
 * Some helper fucntions that help us to select our entities inside of our
 * feature state object. Why we need such helpers? Because remember? It was NOT
 * us who added the entities, but it was `v1XUsersAdapter` which added our entities
 * into our feature object.
 */
const { selectAll, selectEntities } = v1XUsersAdapter.getSelectors();

/**
 * An array with all of our entities inside of it.
 */
export const selectAllEntities = createSelector(
  selectState,
  (state: V1XUsers_State) => selectAll(state),
);

/**
 * On object with all of our entities inside of it.
 */
export const selectAllEntitiesObj = createSelector(
  selectState,
  (state: V1XUsers_State) => selectEntities(state),
);

export const selectSelectedEntity = createSelector(
  selectAllEntitiesObj,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
```
