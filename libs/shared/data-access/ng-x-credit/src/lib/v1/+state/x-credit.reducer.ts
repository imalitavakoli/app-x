import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  v1BaseReducerSetLoading,
  v1BaseReducerOnSuccess,
  v1BaseReducerOnFailure,
  v1BaseReducerOnCacheHit,
  v1BaseReducerInvalidate,
  v1BaseReducerConfigureTtl,
  v1BaseReducerEntityValidateId,
  v1BaseReducerEntityReset,
} from '@x/shared-util-ng-bases';
import { V1Base_One } from '@x/shared-util-ng-bases-model';

import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';

import {
  V1XCredit_RawErrors,
  V1XCredit_RawLoadeds,
  V1XCredit_RawDatas,
  V1XCredit_LoadedLatest,
  V1XCredit_CacheTimestamps,
  V1XCredit_Ttls,
  V1XCredit_ResponseIsRelatedTo,
} from './x-credit.interfaces';
import { XCreditActions } from './x-credit.actions';

/* ////////////////////////////////////////////////////////////////////////// */
/* Basic Constants                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

/** Default TTL (ms) applied to every data-key. 5 minutes. */
export const V1_X_CREDIT_DEFAULT_TTL = 300000;

/** All data keys — used by `cacheMask` to mask everything. */
const ALL_DATA_KEYS: V1XCredit_ResponseIsRelatedTo[] = ['summary', 'detail'];

/**
 * Define which actions cause cache invalidation for specific data-keys.
 * When a mutation action (PATCH/PUT/POST/DELETE) is dispatched, the cache
 * entries for the listed data-keys are wiped so the next GET refetches.
 *
 * NOTE: This lib has no data-mutation actions (`setStyle` only persists a UI
 * preference and does not affect `summary`/`detail`), so the map is empty.
 */
const CACHE_INVALIDATION_MAP: Record<string, V1XCredit_ResponseIsRelatedTo[]> =
  {};

/** Prefix for error logging in this reducer. */
const LOG_PREFIX = 'x-credit.reducer';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

export const v1XCreditFeatureKey = 'v1XCredit';

/**
 * This is our one single instance interface.
 *
 * It extends `V1Base_One` (the cache-aware base shape), so it carries
 * `cacheKeyLatest`, `cacheTimestamps`, `ttls`, `cacheMaskedKeys`, and the
 * cache-keyed `loadeds`/`errors`/`datas` records.
 *
 * @export
 * @interface V1XCredit_Entity
 * @typedef {V1XCredit_Entity}
 */
export interface V1XCredit_Entity extends V1Base_One {
  id: 'g' | string; // Unique identifier for this instance

  /** Timestamps of when each cache entry was stored. */
  cacheTimestamps: V1XCredit_CacheTimestamps;
  /** TTL config (ms) per data-key. */
  ttls: V1XCredit_Ttls;

  loadedLatest: V1XCredit_LoadedLatest;
  loadeds: V1XCredit_RawLoadeds;
  errors: V1XCredit_RawErrors;
  datas: V1XCredit_RawDatas;
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
export interface V1XCredit_State extends EntityState<V1XCredit_Entity> {
  // NOTE: We disabled `selectedId`, because we don't need it for this functionality.
  // selectedId?: 'g' | string; // Shows which record has been selected
  lastSetStyle: V1XCredit_Style | undefined;
}

interface V1XCredit_PartialState {
  readonly [v1XCreditFeatureKey]: V1XCredit_State;
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

/* ////////////////////////////////////////////////////////////////////////// */
/* Initial shape                                                              */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Create a fresh entity instance with all cache-aware fields initialized.
 * TTLs default to `*DEFAULT_TTL` for every data-key. All cache-keyed records
 * (`loadeds`, `errors`, `datas`, `cacheTimestamps`) start as empty `Record`s.
 *
 * @param {string} id The entity's unique id.
 * @returns {V1XCredit_Entity}
 */
function createInitialEntity(id: string): V1XCredit_Entity {
  return {
    id,

    cacheKeyLatest: {},
    cacheTimestamps: { summary: {}, detail: {} },
    ttls: { summary: V1_X_CREDIT_DEFAULT_TTL, detail: V1_X_CREDIT_DEFAULT_TTL },
    cacheMaskedKeys: new Set<string>(),

    loadedLatest: {} as V1XCredit_LoadedLatest,
    loadeds: { summary: {}, detail: {} },
    errors: { summary: {}, detail: {} },
    datas: { summary: {}, detail: {} },
  };
}

/**
 * This is our whole feature state object.
 * By the help of `getInitialState()` method, we create a initial state options
 * values... The `v1XCreditAdapter` itself has our entities, now we just add the
 * initial state of other options that it doesn't have.
 *
 * @type {V1XCredit_State}
 */
export const v1XCreditInitialState: V1XCredit_State = v1XCreditAdapter.addOne(
  createInitialEntity('g'),
  v1XCreditAdapter.getInitialState({
    lastSetStyle: undefined,
  }),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * The cache-aware feature reducer.
 *
 * Each handler just calls the matching `v1BaseReducer*` helper — the base does
 * all the cache bookkeeping. Reads (GET) use `v1BaseReducerSetLoading`; then
 * `success`/`failure`/`cacheHit` store the result.
 *
 * Writes (PATCH/PUT/POST/DELETE) are different: instead of set-loading, they
 * call `v1BaseReducerInvalidate` to clear the cached data-keys they change (as
 * declared in `CACHE_INVALIDATION_MAP`), so the next read fetches fresh data.
 *
 * @example
 * // Data-mutation action (multi-instance): invalidate, don't set-loading.
 * // CACHE_INVALIDATION_MAP = { patchSummary: ['summary'] };
 * on(XCreditActions.patchSummary, (state, { id }) =>
 *   v1XCreditAdapter.updateOne(
 *     {
 *       id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
 *       changes: {
 *         ...v1BaseReducerInvalidate(
 *           state.entities[id]!,
 *           CACHE_INVALIDATION_MAP['patchSummary'],
 *         ),
 *         loadedLatest: { summary: false },
 *       },
 *     },
 *     { ...state },
 *   ),
 * ),
 *
 * @type {ActionReducer<V1XCredit_State>}
 */
const reducer = createReducer(
  v1XCreditInitialState,

  /* Select a style ///////////////////////////////////////////////////////// */

  on(XCreditActions.setStyle, (state, { style }) => {
    return { ...state, lastSetStyle: style };
  }),

  /* Get summary data /////////////////////////////////////////////////////// */

  on(XCreditActions.getSummary, (state, { id, ...rest }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: v1BaseReducerSetLoading(
          state.entities[id]!,
          'summary',
          { ...rest },
          'summary',
        ),
      },
      { ...state },
    ),
  ),

  /* Get detail data /////////////////////////////////////////////////////// */

  on(XCreditActions.getDetail, (state, { id, ...rest }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: v1BaseReducerSetLoading(
          state.entities[id]!,
          'detail',
          { ...rest },
          'detail',
        ),
      },
      { ...state },
    ),
  ),

  /* Cache actions ////////////////////////////////////////////////////////// */

  on(XCreditActions.cacheHit, (state, { id, props }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: v1BaseReducerOnCacheHit(
          state.entities[id]!,
          props.relatedTo,
          props.cacheKey,
        ),
      },
      { ...state },
    ),
  ),

  on(XCreditActions.configureTtl, (state, { id, ttls }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: v1BaseReducerConfigureTtl(state.entities[id]!, ttls),
      },
      { ...state },
    ),
  ),

  on(XCreditActions.cacheInvalidate, (state, { id, keys }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: v1BaseReducerInvalidate(state.entities[id]!, keys),
      },
      { ...state },
    ),
  ),

  on(XCreditActions.cacheMask, (state, { id }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: { cacheMaskedKeys: new Set<string>(ALL_DATA_KEYS) },
      },
      { ...state },
    ),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(XCreditActions.createIfNotExists, (state, { id }) => {
    const hasInstance = !!state.entities[id];
    if (hasInstance) return { ...state };
    return v1XCreditAdapter.addOne(createInitialEntity(id), { ...state });
  }),

  on(XCreditActions.reset, (state, { id }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: { id, ...v1BaseReducerEntityReset(state.entities[id]!) },
      },
      { ...state },
    ),
  ),

  on(XCreditActions.resetAll, () => v1XCreditInitialState),

  on(XCreditActions.success, (state, { id, props }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: {
          // ...setMorePropsBasedOnActSuccess(props),
          ...v1BaseReducerOnSuccess(
            state.entities[id]!,
            props.relatedTo,
            props.cacheKey,
            props.data,
          ),
        },
      },
      { ...state },
    ),
  ),

  on(XCreditActions.failure, (state, { id, props }) =>
    v1XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: v1BaseReducerOnFailure(
          state.entities[id]!,
          props.relatedTo,
          props.cacheKey,
          props.error,
        ),
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

// function setMorePropsBasedOnActSuccess(
//   props: V1XCredit_InstancePropsSuccess,
// ): Partial<V1XCredit_Entity> {
//   switch (props.relatedTo) {
//     case 'summary':
//       return {
//         something: props.extra?.['something'],
//       };
//     default:
//       return {};
//   }
// }
