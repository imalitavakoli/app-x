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
export const initialState: V1XCredit_State = v1XCreditAdapter.getInitialState({
  lastSetStyle: undefined,
  ids: ['g'],
  entities: {
    g: {
      id: 'g',
      loadedLatest: {} as V1XCredit_Loadeds,
      loadeds: {} as V1XCredit_Loadeds,
      errors: {} as V1XCredit_Errors,
      datas: {} as V1XCredit_Datas,
    },
  },
});

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
    // ...setMorePropsBasedOnActSuccess(props),
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

// function setMorePropsBasedOnActSuccess(
//   props: V1XCredit_InstancePropsSuccess,
// ): Partial<V1XCredit_Entity> {
//   switch (props.relatedTo) {
//     case 'data1':
//       return {
//         something: props.extra?.['something'],
//       };
//     default:
//       return {};
//   }
// }
