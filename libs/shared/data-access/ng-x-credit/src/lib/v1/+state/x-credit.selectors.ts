import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as reducer from './x-credit.reducer';
import {
  V1XCredit_Loadeds,
  V1XCredit_Errors,
  V1XCredit_Datas,
} from './x-credit.interfaces';

/**
 * `createFeatureSelector()` method?
 * In simple terms, it selects our whole feature state:
 * e.g., `{ ids: ['g','2',...], entities: { '2': { ... } }, selectedId: '2' }`
 * NOTE: We don't need it in our components most of the times.
 */
export const selectState = createFeatureSelector<reducer.V1XCredit_State>(
  reducer.v1XCreditFeatureKey,
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

/* ////////////////////////////////////////////////////////////////////////// */
/* Raw selectors (cache-keyed state slices)                                   */
/* ////////////////////////////////////////////////////////////////////////// */

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

/* ////////////////////////////////////////////////////////////////////////// */
/* Narrow selectors (Datas): Resolved (flat, via cacheKeyLatest)              */
/* ////////////////////////////////////////////////////////////////////////// */

export const selectEntitySummaryData = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V1XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('summary')) return undefined;
    const key = state.cacheKeyLatest['summary'];
    return key ? state.datas.summary[key] : undefined;
  });
};

export const selectEntityDetailData = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V1XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('detail')) return undefined;
    const key = state.cacheKeyLatest['detail'];
    return key ? state.datas.detail[key] : undefined;
  });
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Narrow selectors (Loadeds): Resolved (flat, via cacheKeyLatest)            */
/* ////////////////////////////////////////////////////////////////////////// */

export const selectEntitySummaryLoaded = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V1XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('summary')) return undefined;
    const key = state.cacheKeyLatest['summary'];
    return key ? state.loadeds.summary[key] : undefined;
  });
};

export const selectEntityDetailLoaded = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V1XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('detail')) return undefined;
    const key = state.cacheKeyLatest['detail'];
    return key ? state.loadeds.detail[key] : undefined;
  });
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Narrow selectors (Errors): Resolved (flat, via cacheKeyLatest)             */
/* ////////////////////////////////////////////////////////////////////////// */

export const selectEntitySummaryError = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V1XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('summary')) return undefined;
    const key = state.cacheKeyLatest['summary'];
    return key ? state.errors.summary[key] : undefined;
  });
};

export const selectEntityDetailError = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V1XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('detail')) return undefined;
    const key = state.cacheKeyLatest['detail'];
    return key ? state.errors.detail[key] : undefined;
  });
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Resolved selectors (flat, via cacheKeyLatest)                              */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select all entity loadeds resolved to flat `{ [dataKey]?: boolean }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectEntityResolvedLoadeds` (not
 * `selectEntityLoadeds`) because `selectEntityLoadeds` already returns
 * the raw cache-keyed structure. The `Resolved` keyword is used to
 * avoid naming collisions — especially if we ever adopt `createFeature()`
 * for this lib, which auto-generates selectors like `selectLoadeds`.
 * The corresponding facade observable is named `entityLoadeds$` (not
 * `entityResolvedLoadeds$`) for consumer convenience.
 */
export const selectEntityResolvedLoadeds = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity): V1XCredit_Loadeds => {
      const result: V1XCredit_Loadeds = {};
      for (const key of Object.keys(state.cacheKeyLatest)) {
        if (state.cacheMaskedKeys?.has(key)) continue;
        const ck = state.cacheKeyLatest[key];
        (result as any)[key] = ck ? state.loadeds[key]?.[ck] : undefined;
      }
      return result;
    },
  );
};

/**
 * Select all entity errors resolved to flat `{ [dataKey]?: string }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectEntityResolvedErrors` (not
 * `selectEntityErrors`) because `selectEntityErrors` already returns
 * the raw cache-keyed structure. The `Resolved` keyword is used to
 * avoid naming collisions — especially if we ever adopt `createFeature()`
 * for this lib, which auto-generates selectors like `selectErrors`.
 * The corresponding facade observable is named `entityErrors$` (not
 * `entityResolvedErrors$`) for consumer convenience.
 */
export const selectEntityResolvedErrors = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity): V1XCredit_Errors => {
      const result: V1XCredit_Errors = {};
      for (const key of Object.keys(state.cacheKeyLatest)) {
        if (state.cacheMaskedKeys?.has(key)) continue;
        const ck = state.cacheKeyLatest[key];
        (result as any)[key] = ck ? state.errors[key]?.[ck] : undefined;
      }
      return result;
    },
  );
};

/**
 * Select all entity datas resolved to flat `{ [dataKey]?: Type }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectEntityResolvedDatas` (not
 * `selectEntityDatas`) because `selectEntityDatas` already returns
 * the raw cache-keyed structure. The `Resolved` keyword is used to
 * avoid naming collisions — especially if we ever adopt `createFeature()`
 * for this lib, which auto-generates selectors like `selectDatas`.
 * The corresponding facade observable is named `entityDatas$` (not
 * `entityResolvedDatas$`) for consumer convenience.
 */
export const selectEntityResolvedDatas = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity): V1XCredit_Datas => {
      const result: V1XCredit_Datas = {};
      for (const key of Object.keys(state.cacheKeyLatest)) {
        if (state.cacheMaskedKeys?.has(key)) continue;
        const ck = state.cacheKeyLatest[key];
        (result as any)[key] = ck ? state.datas[key]?.[ck] : undefined;
      }
      return result;
    },
  );
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Computed                                                                   */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Factory function to create a selector that sees if there are any `errors` in
 * the target instace object or not.
 * @param id The entity object's id.
 * @returns A selector that returns `true` if there's at least one error, otherwise `false`.
 */
export const selectEntityHasError = (id = 'g') => {
  // Find the entity in the state object.
  const entity = selectEntity(id);

  // Check if there's any error in the (cache-keyed) error records.
  return createSelector(
    entity,
    (state: reducer.V1XCredit_Entity | undefined) => {
      return state
        ? Object.values(state.errors).some((errorRecord) =>
            Object.values(errorRecord).some((e) => e !== undefined),
          )
        : false;
    },
  );
};

/**
 * Factory function to create a selector that returns whether an instance
 * exists or not.
 * @param id The entity object's id.
 * @returns A selector that returns `true` if an instance with the provided id exists, otherwise `false`.
 */
export const selectHasEntity = (id = 'g') => {
  return createSelector(selectState, (state: reducer.V1XCredit_State) => {
    const entity = state.entities[id];
    if (!entity) return false;
    return true;
  });
};
