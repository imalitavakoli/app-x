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
