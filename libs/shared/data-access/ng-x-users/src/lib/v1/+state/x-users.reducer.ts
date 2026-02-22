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
