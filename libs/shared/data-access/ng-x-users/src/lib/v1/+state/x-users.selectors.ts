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
