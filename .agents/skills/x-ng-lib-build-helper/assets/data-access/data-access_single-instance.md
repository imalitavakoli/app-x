# 'ng-x-profile-info' functionality 'data-access' lib samples

Here are sample files from the 'data-access' library of the 'ng-x-profile-info' functionality. Use them as inspiration when creating your own 'data-access' libraries.

This 'data-access' library follows the 'single-instance' object structure.

```
libs/shared/data-access/ng-x-profile-info/
├── src/
│   ├── lib/v2/
│   │   ├── +state/
│   │   │   ├── x-profile-info.actions.ts
│   │   │   ├── x-profile-info.effects.ts
│   │   │   ├── x-profile-info.facade.ts
│   │   │   ├── x-profile-info.interfaces.ts
│   │   │   ├── x-profile-info.reducer.ts
│   │   │   └── x-profile-info.selectors.ts
│   │   └── README.md (inner)
│   ├── index.ts
│   └── test-setup.ts
├── .eslintrc.json
├── jest.config.ts
├── project.json
├── README.md (outer)
├── tsconfig.json
├── tsconfig.lib.json
└── tsconfig.spec.json
```

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

x-profile-info v2.

**Note!** This version of the library is **cache-aware**. Every `get*()` call is de-duplicated by a cache key derived from its params. If a previous identical call is still within its TTL (Time-To-Live), the effect serves the cached data (a "cache hit") instead of hitting the API again. The default TTL is configurable via `configureTtl()`.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/{app-name}/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V2XProfileInfo_State,
  v2XProfileInfoReducer,
  V2XProfileInfoEffects,
} from '@x/shared-data-access-ng-x-profile-info';

export interface State {
  v2XProfileInfo: V2XProfileInfo_State;
}

export const reducers: ActionReducerMap<State> = {
  v2XProfileInfo: v2XProfileInfoReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
export const effects = [V2XProfileInfoEffects];
```

2. Import the facade in the components where you want to use it.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { v1BaseCacheGetData } from '@x/shared-util-ng-bases';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V2XProfileInfoFacade } from '@x/shared-data-access-ng-x-profile-info';
1;
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
  readonly xProfileInfoFacade = inject(V2XProfileInfoFacade);
  private _xProfileInfoSub!: Subscription;

  private readonly _baseUrl = '/v1/';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    /* Caching methods ////////////////////////////////////////////////////// */

    // Configure TTL (ms) per data-key for an instance. 0 disables caching for a
    // key (always refetch).
    this.xProfileInfoFacade.configureTtl({
      data: 60000, // 1 min
    });

    // Invalidate (wipe) cached data for specific data-keys so the next get*()
    // refetches from the API.
    this.xProfileInfoFacade.cacheInvalidate(['data']);

    // Mask all data-keys — resolved/narrow selectors emit `undefined` until the
    // next get*() call unmasks the requested key automatically.
    this.xProfileInfoFacade.cacheMask();

    /* Subscription (RECOMMENDED) /////////////////////////////////////////// */

    // Listen to ONLY one slice of the data in the state.
    // This takes advantage of NgRx memoized selectors and only re-emits
    // when the specific data actually changes.

    this.xProfileInfoFacade.dataData$
      .pipe(filter((data) => data !== undefined))
      .subscribe((data) => {
        console.log('data:', data);
      });

    /* Subscription (ALTERNATIVE) /////////////////////////////////////////// */

    // Listen to all the state changes via `translationsState$`.
    // You can have one single subscription and take advantage of
    // `loadedLatest` to discriminate which property just changed.
    //
    // NOTE: The state contains cache records for each key.
    // Use `v1BaseCacheGetData` with the state object to get the data for the
    // most recently dispatched call.

    this._xProfileInfoSub = this.xProfileInfoFacade.state$.subscribe(
      (state) => {
        const data = v1BaseCacheGetData(state, 'data');
        if (state.loadedLatest.data && data) {
          console.log('data:', data);
        }
      },
    );

    /* Calling APIs ///////////////////////////////////////////////////////// */

    // Get data
    this.xProfileInfoFacade.getData(this._baseUrl, 123);

    /* Reset /////////////////////////////////////////////////////////////// */

    // NOTE: In the cache-aware architecture, prefer `cacheMask()` when you just
    // want to hide the currently resolved data (e.g. on re-init) — it keeps the
    // cached entries so TTL checks still apply and the next `get*()` can serve
    // from cache. Use `cacheInvalidate([...])` to wipe specific keys, or
    // `reset()` (below) only when you truly need to discard the ENTIRE state.
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
@if (xProfileInfoFacade.dataError$ | async) {
<ng-container>
  <div class="text-center">
    <h1 class="h1 text-lg">Oops! Something went wrong.</h1>
    <p class="p">
      Data could not be loaded
      <small class="e-ecode">V2XProfileInfoFacade/data</small>
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
  v2XProfileInfoFeatureKey,
  v2XProfileInfoReducer,
  V2XProfileInfoEffects,
} from '@x/shared-data-access-ng-x-profile-info';

export const V1TestRoutes: Route[] = [
  {
    path: '',
    component: V1TestPageComponent,
    providers: [
      provideState(v2XProfileInfoFeatureKey, v2XProfileInfoReducer),
      provideEffects(V2XProfileInfoEffects),
    ],
  },
];
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
/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@x/shared-util-ng-bases';

import { XProfileInfoActions } from './x-profile-info.actions';
import { v2XProfileInfoFeature } from './x-profile-info.reducer';
import {
  V2XProfileInfo_Ttls,
  V2XProfileInfo_ResponseIsRelatedTo,
} from './x-profile-info.interfaces';
import * as selectors from './x-profile-info.selectors';

@Injectable({
  providedIn: 'root',
})
export class V2XProfileInfoFacade extends V1BaseFacade {
  // protected readonly _store = inject(Store); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Others                                                        */
  /* //////////////////////////////////////////////////////////////////////// */

  loadedLatest$ = this._store.pipe(
    select(v2XProfileInfoFeature.selectLoadedLatest),
  );

  hasError$ = this._store.pipe(select(selectors.selectHasError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Raw (cache-keyed state slices)                                */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(
    select(v2XProfileInfoFeature.selectV2XProfileInfoState),
  );

  rawLoadeds$ = this._store.pipe(select(v2XProfileInfoFeature.selectLoadeds));
  rawErrors$ = this._store.pipe(select(v2XProfileInfoFeature.selectErrors));
  rawDatas$ = this._store.pipe(select(v2XProfileInfoFeature.selectDatas));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Resolved (Flat, via cacheKeyLatest)                           */
  /* //////////////////////////////////////////////////////////////////////// */

  loadeds$ = this._store.pipe(select(selectors.selectResolvedLoadeds));
  errors$ = this._store.pipe(select(selectors.selectResolvedErrors));
  datas$ = this._store.pipe(select(selectors.selectResolvedDatas));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Datas): Resolved (Flat, via cacheKeyLatest)            */
  /* //////////////////////////////////////////////////////////////////////// */

  dataData$ = this._store.pipe(select(selectors.selectDataData));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Loadeds): Resolved (Flat, via cacheKeyLatest)          */
  /* //////////////////////////////////////////////////////////////////////// */

  dataLoaded$ = this._store.pipe(select(selectors.selectDataLoaded));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Errors): Resolved (Flat, via cacheKeyLatest)           */
  /* //////////////////////////////////////////////////////////////////////// */

  dataError$ = this._store.pipe(select(selectors.selectDataError));

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
   * Configure TTL (Time-To-Live) in milliseconds for each data-key.
   * Pass 0 for a key to disable caching for it (always refetch).
   * Default TTL is 300000ms (1000 * 60 * 5 ms = 5 minutes) for all data-keys.
   *
   * @param ttls  Partial TTL config. Only provided keys are updated.
   */
  configureTtl(ttls: Partial<V2XProfileInfo_Ttls>) {
    this._store.dispatch(XProfileInfoActions.configureTtl(ttls));
  }

  /**
   * Invalidate (wipe) cached data for specific data-keys.
   * This clears `datas`, `loadeds`, `errors`, and `cacheTimestamps` for the
   * listed keys. The next `get*()` call for those keys will always refetch.
   *
   * @param {V2XProfileInfo_ResponseIsRelatedTo[]} keys  Data-keys to invalidate
   */
  cacheInvalidate(keys: V2XProfileInfo_ResponseIsRelatedTo[]) {
    this._store.dispatch(XProfileInfoActions.cacheInvalidate({ keys }));
  }

  /**
   * Mask all data keys. Once masked, resolved selectors (e.g. `datas$`,
   * `loadeds$`) will return `undefined` for every key — the UI sees a
   * "loading" state.
   *
   * Each subsequent `get*()` call automatically unmasks its own key, so only
   * the keys that are actively re-fetched become visible again. Keys that are
   * NOT re-fetched after `cacheMask` stay hidden.
   *
   * NOTE: Unlike `cacheInvalidate`, this does NOT delete the cached data. The
   * data remains in the store and becomes visible as soon as the corresponding
   * `get*()` is called.
   */
  cacheMask() {
    this._store.dispatch(XProfileInfoActions.cacheMask());
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

import {
  V1Base_CacheTimestamps,
  V1Base_Ttls,
  V1Base_LoadedLatest,
  V1Base_Loadeds,
  V1Base_Errors,
  V1Base_Datas,
} from '@x/shared-util-ng-bases-model';

/* ////////////////////////////////////////////////////////////////////////// */
/* Cache-related interfaces                                                   */
/* ////////////////////////////////////////////////////////////////////////// */

/** Timestamps for when each cache entry was fetched. */
export interface V2XProfileInfo_CacheTimestamps extends V1Base_CacheTimestamps {
  data: Record<string, number>;
}

/** TTL config (in ms) per data-key. 0 = never cache (always refetch). */
export interface V2XProfileInfo_Ttls extends V1Base_Ttls {
  data: number;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (raw, cache-keyed — used by reducer state)            */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XProfileInfo_LoadedLatest extends V1Base_LoadedLatest {
  data?: boolean;
}

export interface V2XProfileInfo_RawLoadeds extends V1Base_Loadeds {
  data: Record<string, boolean>;
}

export interface V2XProfileInfo_RawErrors extends V1Base_Errors {
  data: Record<string, string>;
}

export interface V2XProfileInfo_RawDatas extends V1Base_Datas {
  data: Record<string, V1XProfileInfo_MapData>;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (resolved, flat — used by consumers)                  */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XProfileInfo_Loadeds {
  data?: boolean;
}

export interface V2XProfileInfo_Errors {
  data?: string;
}

export interface V2XProfileInfo_Datas {
  data?: V1XProfileInfo_MapData;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure/cacheHit Actions                              */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XProfileInfo_SuccessAction {
  relatedTo: V2XProfileInfo_ResponseIsRelatedTo;
  cacheKey: string;
  data: V2XProfileInfo_ResponseData;
  extra?: { [key: string]: any };
}

export interface V2XProfileInfo_FailureAction {
  relatedTo: V2XProfileInfo_ResponseIsRelatedTo;
  cacheKey: string;
  error: string;
  extra?: { [key: string]: any };
}

export interface V2XProfileInfo_CacheHitAction {
  relatedTo: V2XProfileInfo_ResponseIsRelatedTo;
  cacheKey: string;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

export type V2XProfileInfo_ResponseIsRelatedTo = 'data';

type V2XProfileInfo_ResponseData = V1XProfileInfo_MapData;
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
import { mergeMap } from 'rxjs/operators';

import { V1BaseEffects } from '@x/shared-util-ng-bases';
import { V1XProfileInfo } from '@x/shared-map-ng-x-profile-info';

import { XProfileInfoActions } from './x-profile-info.actions';
import {
  v2XProfileInfoFeature,
  V2XProfileInfo_State,
} from './x-profile-info.reducer';
import { V2XProfileInfo_ResponseIsRelatedTo } from './x-profile-info.interfaces';

@Injectable()
export class V2XProfileInfoEffects extends V1BaseEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _map = inject(V1XProfileInfo);

  /* Get data /////////////////////////////////////////////////////////////// */

  getData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(XProfileInfoActions.getData),
      mergeMap((action) =>
        this._runEffectByCache<V2XProfileInfo_State, any>({
          relatedTo: 'data',
          cacheKeyPrefix: 'data',
          cacheKeyParams: { ...action },
          stateSelector: v2XProfileInfoFeature.selectV2XProfileInfoState,
          getCacheTimestamps: (s) => s.cacheTimestamps.data,
          getTtl: (s) => s.ttls.data,
          apiFn: () => this._map.getData(action.url, action.userId, action.lib),
          onSuccess: (data, cacheKey) =>
            XProfileInfoActions.success({
              relatedTo: 'data',
              cacheKey,
              data,
              // extra: { blahblah },
            }),
          onFailure: (error, cacheKey) =>
            XProfileInfoActions.failure({
              relatedTo: 'data',
              cacheKey,
              error,
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            XProfileInfoActions.cacheHit({
              relatedTo: relatedTo as V2XProfileInfo_ResponseIsRelatedTo,
              cacheKey,
            }),
        }),
      ),
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

import {
  v1BaseReducerSetLoading,
  v1BaseReducerOnSuccess,
  v1BaseReducerOnFailure,
  v1BaseReducerOnCacheHit,
  v1BaseReducerInvalidate,
  v1BaseReducerConfigureTtl,
} from '@x/shared-util-ng-bases';
import { V1Base_One } from '@x/shared-util-ng-bases-model';

import { XProfileInfoActions } from './x-profile-info.actions';
import {
  V2XProfileInfo_RawErrors,
  V2XProfileInfo_RawLoadeds,
  V2XProfileInfo_LoadedLatest,
  V2XProfileInfo_RawDatas,
  V2XProfileInfo_CacheTimestamps,
  V2XProfileInfo_Ttls,
  V2XProfileInfo_ResponseIsRelatedTo,
} from './x-profile-info.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Basic Constants                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

const V2_X_PROFILE_INFO_DEFAULT_TTL = 300000; // 5 minutes

/** All data keys — used by `cacheMask` to mask everything. */
const ALL_DATA_KEYS: V2XProfileInfo_ResponseIsRelatedTo[] = ['data'];

/**
 * Define which actions cause cache invalidation for specific data-keys.
 * When a mutation action (PATCH/PUT/POST/DELETE) is dispatched, the cache
 * entries for the listed data-keys are wiped so the next GET refetches.
 *
 * NOTE: This lib has no data-mutation actions (only `getData`), so the map is
 * empty.
 */
const CACHE_INVALIDATION_MAP: Record<
  string,
  V2XProfileInfo_ResponseIsRelatedTo[]
> = {};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const v2XProfileInfoFeatureKey = 'v2XProfileInfo';

export interface V2XProfileInfo_State extends V1Base_One {
  // blahblah: string | undefined;

  /** Timestamps of when each cache entry was stored. */
  cacheTimestamps: V2XProfileInfo_CacheTimestamps;
  /** TTL config (ms) per data-key. */
  ttls: V2XProfileInfo_Ttls;

  loadedLatest: V2XProfileInfo_LoadedLatest;
  loadeds: V2XProfileInfo_RawLoadeds;
  errors: V2XProfileInfo_RawErrors;
  datas: V2XProfileInfo_RawDatas;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Initial shape                                                              */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const v2XProfileInfoInitialState: V2XProfileInfo_State = {
  // blahblah: undefined,

  cacheKeyLatest: {},
  cacheTimestamps: { data: {} },
  ttls: { data: V2_X_PROFILE_INFO_DEFAULT_TTL },
  cacheMaskedKeys: new Set<string>(),

  loadedLatest: {} as V2XProfileInfo_LoadedLatest,
  loadeds: { data: {} },
  errors: { data: {} },
  datas: { data: {} },
};

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
 * // Data-mutation action (single-instance): invalidate, don't set-loading.
 * // CACHE_INVALIDATION_MAP = { patchSelectedLang: ['selectedLang'] };
 * on(TranslationsActions.patchSelectedLang, (state): V1Translations_State => ({
 *   ...state,
 *   ...v1BaseReducerInvalidate(state, CACHE_INVALIDATION_MAP['patchSelectedLang']),
 *   loadedLatest: { selectedLang: false },
 * })),
 *
 * @type {ActionReducer<V2XProfileInfo_State>}
 */
export const v2XProfileInfoReducer = createReducer(
  v2XProfileInfoInitialState,

  /* Get data /////////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.getData,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerSetLoading(state, 'data', { ...action }, 'data'),
    }),
  ),

  /* Cache actions ////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.cacheHit,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerOnCacheHit(state, action.relatedTo, action.cacheKey),
    }),
  ),

  on(
    XProfileInfoActions.configureTtl,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerConfigureTtl(state, action),
    }),
  ),

  on(
    XProfileInfoActions.cacheInvalidate,
    (state, { keys }): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerInvalidate(state, keys),
    }),
  ),

  on(
    XProfileInfoActions.cacheMask,
    (state): V2XProfileInfo_State => ({
      ...state,
      cacheMaskedKeys: new Set<string>(ALL_DATA_KEYS),
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.reset,
    (): V2XProfileInfo_State => v2XProfileInfoInitialState,
  ),

  on(
    XProfileInfoActions.success,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      // ...setMorePropsBasedOnActSuccess(action),
      ...v1BaseReducerOnSuccess(
        state,
        action.relatedTo,
        action.cacheKey,
        action.data,
      ),
    }),
  ),

  on(
    XProfileInfoActions.failure,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      ...v1BaseReducerOnFailure(
        state,
        action.relatedTo,
        action.cacheKey,
        action.error,
      ),
    }),
  ),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Selectors (auto generated via `createFeature()`)             */
/* ////////////////////////////////////////////////////////////////////////// */

export const v2XProfileInfoFeature = createFeature({
  name: v2XProfileInfoFeatureKey,
  reducer: v2XProfileInfoReducer,
});

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful functions                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// function setMorePropsBasedOnActSuccess(
//   action: V2XProfileInfo_SuccessAction,
// ): Partial<V2XProfileInfo_State> {
//   switch (action.relatedTo) {
//     case 'data':
//       return {
//         blahblah: action.extra?.['blahblah'],
//       };
//     default:
//       return {};
//   }
// }
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
  V2XProfileInfo_SuccessAction,
  V2XProfileInfo_FailureAction,
  V2XProfileInfo_CacheHitAction,
  V2XProfileInfo_Ttls,
  V2XProfileInfo_ResponseIsRelatedTo,
} from './x-profile-info.interfaces';

export const XProfileInfoActions = createActionGroup({
  source: 'V2XProfileInfo',
  events: {
    /* Get data ///////////////////////////////////////////////////////////// */

    getData: props<{
      lib: string;
      url: string;
      userId: number;
    }>(),

    /* Cache actions //////////////////////////////////////////////////////// */

    /** Dispatched when a cache hit is detected — no API call needed. */
    cacheHit: props<V2XProfileInfo_CacheHitAction>(),

    /** Configure TTL (in ms) for specific data-keys. */
    configureTtl: props<Partial<V2XProfileInfo_Ttls>>(),

    /** Invalidate (wipe) cached data for specific data-keys. */
    cacheInvalidate: props<{ keys: V2XProfileInfo_ResponseIsRelatedTo[] }>(),

    /**
     * Mask all data keys. Resolved selectors return `undefined` for masked
     * keys until the next `get*` action unmasks them automatically.
     */
    cacheMask: emptyProps(),

    /* Other actions //////////////////////////////////////////////////////// */

    /** Reset the state to initial. Clears all cached data. */
    reset: emptyProps(),

    /** Successfull HTTP call. */
    success: props<V2XProfileInfo_SuccessAction>(),

    /** Unsuccessfull HTTP call. */
    failure: props<V2XProfileInfo_FailureAction>(),
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
import { createSelector } from '@ngrx/store';

import * as fromXProfileInfo from './x-profile-info.reducer';
import {
  V2XProfileInfo_Loadeds,
  V2XProfileInfo_Errors,
  V2XProfileInfo_Datas,
} from './x-profile-info.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Narrow selectors (Datas): Resolved (flat, via cacheKeyLatest)              */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select only the `data` data from the state.
 * Uses `cacheKeyLatest` to return data for the most recently dispatched call.
 * Only re-emits when the resolved data actually changes.
 */
export const selectDataData = createSelector(
  fromXProfileInfo.v2XProfileInfoFeature.selectDatas,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheKeyLatest,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheMaskedKeys,
  (datas, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('data')) return undefined;
    const key = latestKeys['data'];
    return key ? datas.data[key] : undefined;
  },
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Narrow selectors (Loadeds): Resolved (flat, via cacheKeyLatest)            */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select only the `data` loaded status.
 * Uses `cacheKeyLatest` to return the loaded status for the most recently
 * dispatched call.
 */
export const selectDataLoaded = createSelector(
  fromXProfileInfo.v2XProfileInfoFeature.selectLoadeds,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheKeyLatest,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheMaskedKeys,
  (loadeds, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('data')) return undefined;
    const key = latestKeys['data'];
    return key ? loadeds.data[key] : undefined;
  },
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Narrow selectors (Errors): Resolved (flat, via cacheKeyLatest)             */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select only the `data` error from the state.
 * Uses `cacheKeyLatest` to return the error for the most recently
 * dispatched call.
 */
export const selectDataError = createSelector(
  fromXProfileInfo.v2XProfileInfoFeature.selectErrors,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheKeyLatest,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheMaskedKeys,
  (errors, latestKeys, maskedKeys) => {
    if (maskedKeys?.has('data')) return undefined;
    const key = latestKeys['data'];
    return key ? errors.data[key] : undefined;
  },
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Resolved (flat via cacheKeyLatest)                                         */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Select all loadeds resolved to flat `{ [dataKey]?: boolean }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectResolvedLoadeds` (not `selectLoadeds`)
 * because `selectLoadeds` is auto-generated by `createFeature()` and returns
 * the raw cache-keyed structure. The corresponding facade observable is named
 * `loadeds$` (not `resolvedLoadeds$`) for consumer convenience.
 */
export const selectResolvedLoadeds = createSelector(
  fromXProfileInfo.v2XProfileInfoFeature.selectLoadeds,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheKeyLatest,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheMaskedKeys,
  (loadeds, latestKeys, maskedKeys): V2XProfileInfo_Loadeds => {
    const result: V2XProfileInfo_Loadeds = {};
    for (const key of Object.keys(latestKeys)) {
      if (maskedKeys?.has(key)) continue;
      const ck = latestKeys[key];
      (result as any)[key] = ck ? loadeds[key]?.[ck] : undefined;
    }
    return result;
  },
);

/**
 * Select all errors resolved to flat `{ [dataKey]?: string }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectResolvedErrors` (not `selectErrors`)
 * because `selectErrors` is auto-generated by `createFeature()` and returns
 * the raw cache-keyed structure. The corresponding facade observable is named
 * `errors$` (not `resolvedErrors$`) for consumer convenience.
 */
export const selectResolvedErrors = createSelector(
  fromXProfileInfo.v2XProfileInfoFeature.selectErrors,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheKeyLatest,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheMaskedKeys,
  (errors, latestKeys, maskedKeys): V2XProfileInfo_Errors => {
    const result: V2XProfileInfo_Errors = {};
    for (const key of Object.keys(latestKeys)) {
      if (maskedKeys?.has(key)) continue;
      const ck = latestKeys[key];
      (result as any)[key] = ck ? errors[key]?.[ck] : undefined;
    }
    return result;
  },
);

/**
 * Select all datas resolved to flat `{ [dataKey]?: Type }`.
 * Uses `cacheKeyLatest` to resolve each key to its latest cache entry.
 *
 * NOTE: This selector is named `selectResolvedDatas` (not `selectDatas`)
 * because `selectDatas` is auto-generated by `createFeature()` and returns
 * the raw cache-keyed structure. The corresponding facade observable is named
 * `datas$` (not `resolvedDatas$`) for consumer convenience.
 */
export const selectResolvedDatas = createSelector(
  fromXProfileInfo.v2XProfileInfoFeature.selectDatas,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheKeyLatest,
  fromXProfileInfo.v2XProfileInfoFeature.selectCacheMaskedKeys,
  (datas, latestKeys, maskedKeys): V2XProfileInfo_Datas => {
    const result: V2XProfileInfo_Datas = {};
    for (const key of Object.keys(latestKeys)) {
      if (maskedKeys?.has(key)) continue;
      const ck = latestKeys[key];
      (result as any)[key] = ck ? datas[key]?.[ck] : undefined;
    }
    return result;
  },
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Computed                                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Compute to see if there are any `errors` in the state.
 * Returns `true` if there's at least one error across all cache entries,
 * otherwise `false`.
 *
 * @type {boolean}
 */
export const selectHasError = createSelector(
  fromXProfileInfo.v2XProfileInfoFeature.selectErrors,
  (errors) => {
    return Object.values(errors).some((errorRecord) =>
      Object.values(errorRecord).some((e) => e !== undefined),
    );
  },
);
```
