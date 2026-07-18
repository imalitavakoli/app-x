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

x-credit v2.

**Note!** This version of the library is **cache-aware**. Every `get*()` call is de-duplicated by a cache key derived from its params. If a previous identical call is still within its TTL (Time-To-Live), the effect serves the cached data (a "cache hit") instead of hitting the API again. The default TTL is configurable via `configureTtl()`.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/{app-name}/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V2XCredit_State,
  v2XCreditReducer,
  V2XCreditEffects,
} from '@x/shared-data-access-ng-x-credit';

export interface State {
  v2XCredit: V2XCredit_State;
}

export const reducers: ActionReducerMap<State> = {
  v2XCredit: v2XCreditReducer,
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

import { v2BaseCacheGetData } from '@x/shared-util-ng-bases';
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
    // `V2TestPageComponent` if it doesn't exist.
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

    /* Caching methods ////////////////////////////////////////////////////// */

    // Configure TTL (ms) per data-key for an instance. 0 disables caching for a
    // key (always refetch).
    this.xCreditFacade.configureTtl('V1TestPageComponent', {
      summary: 60000, // 1 min
      detail: 0, // never cache — always refetch
    });

    // Invalidate (wipe) cached data for specific data-keys so the next get*()
    // refetches from the API.
    this.xCreditFacade.cacheInvalidate('V1TestPageComponent', ['summary']);

    // Mask all data-keys — resolved/narrow selectors emit `undefined` until the
    // next get*() call unmasks the requested key automatically.
    this.xCreditFacade.cacheMask('V1TestPageComponent');

    /* Subscription (RECOMMENDED) /////////////////////////////////////////// */

    // Listen to ONLY one slice of the data in the entity.
    // This takes advantage of NgRx memoized selectors and only re-emits
    // when the specific data actually changes.

    this.xCreditFacade
      .entitySummaryData$('V1TestPageComponent')
      .subscribe((summary) => {
        if (summary) console.log('summary:', summary);
      });

    this.xCreditFacade
      .entityDetailData$('V1TestPageComponent')
      .subscribe((detail) => {
        if (detail) console.log('detail:', detail);
      });

    /* Subscription (ALTERNATIVE) /////////////////////////////////////////// */

    // Listen to all the state changes via `entity$`.
    // You can have one single subscription and take advantage of
    // `loadedLatest` to discriminate which property just changed.
    //
    // NOTE: The entity contains cache records for each key.
    // Use `v2BaseCacheGetData` with the entity object to get
    // the data for the most recently dispatched call.

    this._xCreditEntitySub = this.xCreditFacade
      .entity$('V1TestPageComponent')
      .pipe(take(1))
      .subscribe((state) => {
        const summary = v2BaseCacheGetData(state, 'summary');
        if (state.loadedLatest.summary && summary) {
          console.log('summary:', summary);
        }

        const detail = v2BaseCacheGetData(state, 'detail');
        if (state.loadedLatest.detail && detail) {
          console.log('detail:', detail);
        }
      });

    /* Calling APIs ///////////////////////////////////////////////////////// */

    // Get summary
    this.xCreditFacade.getSummary(this._baseUrl, 123, 'V1TestPageComponent');

    // Get detail
    this.xCreditFacade.getDetail(this._baseUrl, 123, 'V1TestPageComponent');

    /* Reset //////////////////////////////////////////////////////////////// */

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

      @if (xCreditFacade.entitySummaryError$('V1TestPageComponent') | async) {
      <small class="e-ecode">
        V2XCreditFacade({{ 'V1TestPageComponent' }})/summary
      </small>
      }

      <!-- xCreditFacade/detail //////////////////////////////////////////// -->

      @if (xCreditFacade.entityDetailError$('V1TestPageComponent') | async) {
      <small class="e-ecode">
        V2XCreditFacade({{ 'V1TestPageComponent' }})/detail
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
  v2XCreditFeatureKey,
  v2XCreditReducer,
  V2XCreditEffects,
} from '@x/shared-data-access-ng-x-credit';

export const V1TestRoutes: Route[] = [
  {
    path: '',
    component: V1TestPageComponent,
    providers: [
      provideState(v2XCreditFeatureKey, v2XCreditReducer),
      provideEffects(V2XCreditEffects),
    ],
  },
];
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-data-access-ng-x-credit` to execute the unit tests.
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
/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { V1BaseFacade } from '@x/shared-util-ng-bases';
import {
  V1XCredit_Style,
  V1XCredit_MapSummary,
  V1XCredit_MapDetail,
} from '@x/shared-map-ng-x-credit';

import { XCreditActions } from './x-credit.actions';
import * as selectors from './x-credit.selectors';
import * as reducer from './x-credit.reducer';
import {
  V2XCredit_Loadeds,
  V2XCredit_Errors,
  V2XCredit_Datas,
  V2XCredit_RawLoadeds,
  V2XCredit_RawErrors,
  V2XCredit_RawDatas,
  V2XCredit_Ttls,
  V2XCredit_ResponseIsRelatedTo,
} from './x-credit.interfaces';

@Injectable({
  providedIn: 'root',
})
export class V2XCreditFacade extends V1BaseFacade {
  // protected readonly _store = inject(Store); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Others                                                        */
  /* //////////////////////////////////////////////////////////////////////// */

  lastSetStyle$ = this._store.pipe(select(selectors.selectLastSetStyle));

  entityLoadedLatest$(id = 'g'): Observable<V2XCredit_Loadeds> {
    return this._store.pipe(select(selectors.selectEntityLoadedLatest(id)));
  }
  entityHasError$(id = 'g'): Observable<boolean> {
    return this._store.pipe(select(selectors.selectEntityHasError(id)));
  }
  hasEntity$(id = 'g'): Observable<boolean> {
    return this._store.pipe(select(selectors.selectHasEntity(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Raw (cache-keyed state slices)                                */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(select(selectors.selectState));
  allEntities$ = this._store.pipe(select(selectors.selectAllEntities));

  entity$(id = 'g'): Observable<reducer.V2XCredit_Entity> {
    return this._store.pipe(select(selectors.selectEntity(id)));
  }

  rawEntityLoadeds$(id = 'g'): Observable<V2XCredit_RawLoadeds> {
    return this._store.pipe(select(selectors.selectEntityLoadeds(id)));
  }
  rawEntityErrors$(id = 'g'): Observable<V2XCredit_RawErrors> {
    return this._store.pipe(select(selectors.selectEntityErrors(id)));
  }
  rawEntityDatas$(id = 'g'): Observable<V2XCredit_RawDatas> {
    return this._store.pipe(select(selectors.selectEntityDatas(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Resolved (flat, via cacheKeyLatest)                           */
  /* //////////////////////////////////////////////////////////////////////// */

  entityLoadeds$(id = 'g'): Observable<V2XCredit_Loadeds> {
    return this._store.pipe(select(selectors.selectEntityResolvedLoadeds(id)));
  }
  entityErrors$(id = 'g'): Observable<V2XCredit_Errors> {
    return this._store.pipe(select(selectors.selectEntityResolvedErrors(id)));
  }
  entityDatas$(id = 'g'): Observable<V2XCredit_Datas> {
    return this._store.pipe(select(selectors.selectEntityResolvedDatas(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Datas): Resolved (flat, via cacheKeyLatest)            */
  /* //////////////////////////////////////////////////////////////////////// */

  entitySummaryData$(id = 'g'): Observable<V1XCredit_MapSummary | undefined> {
    return this._store.pipe(select(selectors.selectEntitySummaryData(id)));
  }
  entityDetailData$(id = 'g'): Observable<V1XCredit_MapDetail | undefined> {
    return this._store.pipe(select(selectors.selectEntityDetailData(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Loadeds): Resolved (flat, via cacheKeyLatest)          */
  /* //////////////////////////////////////////////////////////////////////// */

  entitySummaryLoaded$(id = 'g'): Observable<boolean | undefined> {
    return this._store.pipe(select(selectors.selectEntitySummaryLoaded(id)));
  }
  entityDetailLoaded$(id = 'g'): Observable<boolean | undefined> {
    return this._store.pipe(select(selectors.selectEntityDetailLoaded(id)));
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Narrow Selectors (Errors): Resolved (flat, via cacheKeyLatest)           */
  /* //////////////////////////////////////////////////////////////////////// */

  entitySummaryError$(id = 'g'): Observable<string | undefined> {
    return this._store.pipe(select(selectors.selectEntitySummaryError(id)));
  }
  entityDetailError$(id = 'g'): Observable<string | undefined> {
    return this._store.pipe(select(selectors.selectEntityDetailError(id)));
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
   * @param {string} id The entity id
   */
  createIfNotExists(id: string) {
    this._store.dispatch(XCreditActions.createIfNotExists({ id }));
  }

  /**
   * Configure TTL (Time-To-Live) in milliseconds for each data-key of a
   * specific entity. Pass 0 for a key to disable caching for it (always
   * refetch).
   *
   * @param {string} id The entity id
   * @param {Partial<V2XCredit_Ttls>} ttls TTL values to merge
   */
  configureTtl(id: string, ttls: Partial<V2XCredit_Ttls>) {
    this._store.dispatch(XCreditActions.configureTtl({ id, ttls }));
  }

  /**
   * Invalidate (wipe) cached data for specific data-keys of a specific entity.
   * This clears `datas`, `loadeds`, `errors`, and `cacheTimestamps` for the
   * listed keys. The next `get*()` call for those keys will always refetch.
   *
   * @param {string} id The entity id
   * @param {V2XCredit_ResponseIsRelatedTo[]} keys Data-keys to invalidate
   */
  cacheInvalidate(id: string, keys: V2XCredit_ResponseIsRelatedTo[]) {
    this._store.dispatch(XCreditActions.cacheInvalidate({ id, keys }));
  }

  /**
   * Mask all data keys for a specific entity. Once masked, resolved selectors
   * (e.g. `entityDatas$`, `entityLoadeds$`) will return `undefined` for every
   * key — the UI sees a "loading" state.
   *
   * Each subsequent `get*()` call automatically unmasks its own key, so only
   * the keys that are actively re-fetched become visible again. Keys that are
   * NOT re-fetched after `cacheMask` stay hidden.
   *
   * NOTE: Unlike `cacheInvalidate`, this does NOT delete the cached data. The
   * data remains in the store and becomes visible as soon as the corresponding
   * `get*()` is called.
   *
   * @param {string} id The entity id
   */
  cacheMask(id: string) {
    this._store.dispatch(XCreditActions.cacheMask({ id }));
  }

  /**
   * Reset one instance object to its initial state. This is useful when you
   * want to reset the state of a specific entity.
   *
   * @param {string} id The entity id
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
export interface V2XCredit_CacheTimestamps extends V1Base_CacheTimestamps {
  summary: Record<string, number>;
  detail: Record<string, number>;
}

/** TTL config (in ms) per data-key. 0 = never cache (always refetch). */
export interface V2XCredit_Ttls extends V1Base_Ttls {
  summary: number;
  detail: number;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (raw, cache-keyed — used by reducer entity)           */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XCredit_LoadedLatest extends V1Base_LoadedLatest {
  summary?: boolean;
  detail?: boolean;
}

export interface V2XCredit_RawLoadeds extends V1Base_Loadeds {
  summary: Record<string, boolean>;
  detail: Record<string, boolean>;
}

export interface V2XCredit_RawErrors extends V1Base_Errors {
  summary: Record<string, string>;
  detail: Record<string, string>;
}

export interface V2XCredit_RawDatas extends V1Base_Datas {
  summary: Record<string, V1XCredit_MapSummary>;
  detail: Record<string, V1XCredit_MapDetail>;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* State sub-interfaces (resolved, flat — used by consumers)                  */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XCredit_Loadeds {
  summary?: boolean;
  detail?: boolean;
}

export interface V2XCredit_Errors {
  summary?: string;
  detail?: string;
}

export interface V2XCredit_Datas {
  summary?: V1XCredit_MapSummary;
  detail?: V1XCredit_MapDetail;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure/cacheHit Actions                              */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XCredit_InstancePropsSuccess {
  relatedTo: V2XCredit_ResponseIsRelatedTo;
  cacheKey: string;
  data: V2XCredit_ResponseData;
  extra?: { [key: string]: any };
}

export interface V2XCredit_InstancePropsFailure {
  relatedTo: V2XCredit_ResponseIsRelatedTo;
  cacheKey: string;
  error: string;
  extra?: { [key: string]: any };
}

export interface V2XCredit_InstancePropsCacheHit {
  relatedTo: V2XCredit_ResponseIsRelatedTo;
  cacheKey: string;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

export type V2XCredit_ResponseIsRelatedTo = 'summary' | 'detail';

type V2XCredit_ResponseData = V1XCredit_MapSummary | V1XCredit_MapDetail;
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
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, tap, mergeMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import { V1BaseEffects } from '@x/shared-util-ng-bases';
import { v1LocalPrefGet, v1LocalPrefSet } from '@x/shared-util-local-storage';
import { V1XCredit } from '@x/shared-map-ng-x-credit';

import { XCreditActions } from './x-credit.actions';
import * as selectors from './x-credit.selectors';
import { V2XCredit_State, V2_X_CREDIT_DEFAULT_TTL } from './x-credit.reducer';
import { V2XCredit_ResponseIsRelatedTo } from './x-credit.interfaces';

@Injectable()
export class V2XCreditEffects extends V1BaseEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _map = inject(V1XCredit);

  /* //////////////////////////////////////////////////////////////////////// */
  /*  Select a style                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  setStyle$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(XCreditActions.setStyle),
        tap(({ style }) => {
          v1LocalPrefSet('xCredit_lastSetStyle', style);
        }),
      ),
    { dispatch: false },
  );

  checkIfAlreadySetStyle$ = createEffect(() =>
    this._actions$.pipe(
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
    this._actions$.pipe(
      ofType(XCreditActions.getSummary),
      mergeMap((action) =>
        this._runEffectByCache<V2XCredit_State, any>({
          relatedTo: 'summary',
          cacheKeyPrefix: 'summary',
          cacheKeyParams: { ...action },
          cacheKeyExcludes: ['id'],
          stateSelector: selectors.selectState,
          getCacheTimestamps: (s) =>
            s.entities[action.id]?.cacheTimestamps?.summary ?? {},
          getTtl: (s) =>
            s.entities[action.id]?.ttls?.summary ?? V2_X_CREDIT_DEFAULT_TTL,
          apiFn: () =>
            this._map.getSummary(action.url, action.userId, action.lib),
          onSuccess: (data, cacheKey) =>
            XCreditActions.success({
              id: action.id,
              props: { relatedTo: 'summary', cacheKey, data },
            }),
          onFailure: (error, cacheKey) =>
            XCreditActions.failure({
              id: action.id,
              props: { relatedTo: 'summary', cacheKey, error },
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            XCreditActions.cacheHit({
              id: action.id,
              props: {
                relatedTo: relatedTo as V2XCredit_ResponseIsRelatedTo,
                cacheKey,
              },
            }),
        }),
      ),
    ),
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get detail data                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  getDetail$ = createEffect(() =>
    this._actions$.pipe(
      ofType(XCreditActions.getDetail),
      mergeMap((action) =>
        this._runEffectByCache<V2XCredit_State, any>({
          relatedTo: 'detail',
          cacheKeyPrefix: 'detail',
          cacheKeyParams: { ...action },
          cacheKeyExcludes: ['id'],
          stateSelector: selectors.selectState,
          getCacheTimestamps: (s) =>
            s.entities[action.id]?.cacheTimestamps?.detail ?? {},
          getTtl: (s) =>
            s.entities[action.id]?.ttls?.detail ?? V2_X_CREDIT_DEFAULT_TTL,
          apiFn: () =>
            this._map.getDetail(action.url, action.userId, action.lib),
          onSuccess: (data, cacheKey) =>
            XCreditActions.success({
              id: action.id,
              props: { relatedTo: 'detail', cacheKey, data },
            }),
          onFailure: (error, cacheKey) =>
            XCreditActions.failure({
              id: action.id,
              props: { relatedTo: 'detail', cacheKey, error },
            }),
          onCacheHit: (relatedTo, cacheKey) =>
            XCreditActions.cacheHit({
              id: action.id,
              props: {
                relatedTo: relatedTo as V2XCredit_ResponseIsRelatedTo,
                cacheKey,
              },
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

## `x-credit.reducer.ts` file

```ts
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
  V2XCredit_RawErrors,
  V2XCredit_RawLoadeds,
  V2XCredit_RawDatas,
  V2XCredit_LoadedLatest,
  V2XCredit_CacheTimestamps,
  V2XCredit_Ttls,
  V2XCredit_ResponseIsRelatedTo,
} from './x-credit.interfaces';
import { XCreditActions } from './x-credit.actions';

/* ////////////////////////////////////////////////////////////////////////// */
/* Basic Constants                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

/** Default TTL (ms) applied to every data-key. 5 minutes. */
export const V2_X_CREDIT_DEFAULT_TTL = 300000;

/** All data keys — used by `cacheMask` to mask everything. */
const ALL_DATA_KEYS: V2XCredit_ResponseIsRelatedTo[] = ['summary', 'detail'];

/**
 * Define which actions cause cache invalidation for specific data-keys.
 * When a mutation action (PATCH/PUT/POST/DELETE) is dispatched, the cache
 * entries for the listed data-keys are wiped so the next GET refetches.
 *
 * NOTE: This lib has no data-mutation actions (`setStyle` only persists a UI
 * preference and does not affect `summary`/`detail`), so the map is empty.
 */
const CACHE_INVALIDATION_MAP: Record<string, V2XCredit_ResponseIsRelatedTo[]> =
  {};

/** Prefix for error logging in this reducer. */
const LOG_PREFIX = 'x-credit.reducer';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

export const v2XCreditFeatureKey = 'v2XCredit';

/**
 * This is our one single instance interface.
 *
 * It extends `V1Base_One` (the cache-aware base shape), so it carries
 * `cacheKeyLatest`, `cacheTimestamps`, `ttls`, `cacheMaskedKeys`, and the
 * cache-keyed `loadeds`/`errors`/`datas` records.
 *
 * @export
 * @interface V2XCredit_Entity
 * @typedef {V2XCredit_Entity}
 */
export interface V2XCredit_Entity extends V1Base_One {
  id: 'g' | string; // Unique identifier for this instance

  /** Timestamps of when each cache entry was stored. */
  cacheTimestamps: V2XCredit_CacheTimestamps;
  /** TTL config (ms) per data-key. */
  ttls: V2XCredit_Ttls;

  loadedLatest: V2XCredit_LoadedLatest;
  loadeds: V2XCredit_RawLoadeds;
  errors: V2XCredit_RawErrors;
  datas: V2XCredit_RawDatas;
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
 * @interface V2XCredit_State
 * @typedef {V2XCredit_State}
 * @extends {EntityState<V2XCredit_Entity>}
 */
export interface V2XCredit_State extends EntityState<V2XCredit_Entity> {
  // NOTE: We disabled `selectedId`, because we don't need it for this functionality.
  // selectedId?: 'g' | string; // Shows which record has been selected
  lastSetStyle: V1XCredit_Style | undefined;
}

interface V2XCredit_PartialState {
  readonly [v2XCreditFeatureKey]: V2XCredit_State;
}

/**
 * What `createEntityAdapter()` method returns?
 * It's just an object with some helper functions, that can help us to update
 * the entities option in our feature state, easier. How it can do that? By the
 * unique identifier that we provide to it (in this case, `id`).
 * Read more: https://ngrx.io/guide/entity/adapter
 *
 * @type {EntityAdapter<V2XCredit_Entity>}
 */
export const v2XCreditAdapter: EntityAdapter<V2XCredit_Entity> =
  createEntityAdapter<V2XCredit_Entity>({
    selectId: (entity: V2XCredit_Entity) => entity.id,
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
 * @returns {V2XCredit_Entity}
 */
function createInitialEntity(id: string): V2XCredit_Entity {
  return {
    id,

    cacheKeyLatest: {},
    cacheTimestamps: { summary: {}, detail: {} },
    ttls: { summary: V2_X_CREDIT_DEFAULT_TTL, detail: V2_X_CREDIT_DEFAULT_TTL },
    cacheMaskedKeys: new Set<string>(),

    loadedLatest: {} as V2XCredit_LoadedLatest,
    loadeds: { summary: {}, detail: {} },
    errors: { summary: {}, detail: {} },
    datas: { summary: {}, detail: {} },
  };
}

/**
 * This is our whole feature state object.
 * By the help of `getInitialState()` method, we create a initial state options
 * values... The `v2XCreditAdapter` itself has our entities, now we just add the
 * initial state of other options that it doesn't have.
 *
 * @type {V2XCredit_State}
 */
export const v2XCreditInitialState: V2XCredit_State = v2XCreditAdapter.addOne(
  createInitialEntity('g'),
  v2XCreditAdapter.getInitialState({
    lastSetStyle: undefined,
  }),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * The cache-aware feature reducer.
 *
 * Each handler just calls the matching `v2BaseReducer*` helper — the base does
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
 *   v2XCreditAdapter.updateOne(
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
 * @type {ActionReducer<V2XCredit_State>}
 */
const reducer = createReducer(
  v2XCreditInitialState,

  /* Select a style ///////////////////////////////////////////////////////// */

  on(XCreditActions.setStyle, (state, { style }) => {
    return { ...state, lastSetStyle: style };
  }),

  /* Get summary data /////////////////////////////////////////////////////// */

  on(XCreditActions.getSummary, (state, { id, ...rest }) =>
    v2XCreditAdapter.updateOne(
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
    v2XCreditAdapter.updateOne(
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
    v2XCreditAdapter.updateOne(
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
    v2XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: v1BaseReducerConfigureTtl(state.entities[id]!, ttls),
      },
      { ...state },
    ),
  ),

  on(XCreditActions.cacheInvalidate, (state, { id, keys }) =>
    v2XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: v1BaseReducerInvalidate(state.entities[id]!, keys),
      },
      { ...state },
    ),
  ),

  on(XCreditActions.cacheMask, (state, { id }) =>
    v2XCreditAdapter.updateOne(
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
    return v2XCreditAdapter.addOne(createInitialEntity(id), { ...state });
  }),

  on(XCreditActions.reset, (state, { id }) =>
    v2XCreditAdapter.updateOne(
      {
        id: v1BaseReducerEntityValidateId(state.entities, id, LOG_PREFIX),
        changes: { id, ...v1BaseReducerEntityReset(state.entities[id]!) },
      },
      { ...state },
    ),
  ),

  on(XCreditActions.resetAll, () => v2XCreditInitialState),

  on(XCreditActions.success, (state, { id, props }) =>
    v2XCreditAdapter.updateOne(
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
    v2XCreditAdapter.updateOne(
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

export function v2XCreditReducer(
  state: V2XCredit_State | undefined,
  action: Action,
) {
  return reducer(state, action);
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful functions                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// function setMorePropsBasedOnActSuccess(
//   props: V2XCredit_InstancePropsSuccess,
// ): Partial<V2XCredit_Entity> {
//   switch (props.relatedTo) {
//     case 'summary':
//       return {
//         something: props.extra?.['something'],
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

## `x-credit.actions.ts` file

```ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';

import {
  V2XCredit_InstancePropsSuccess,
  V2XCredit_InstancePropsFailure,
  V2XCredit_InstancePropsCacheHit,
  V2XCredit_Ttls,
  V2XCredit_ResponseIsRelatedTo,
} from './x-credit.interfaces';

export const XCreditActions = createActionGroup({
  source: 'V2XCredit',
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
    /* Cache actions                                                          */
    /* ////////////////////////////////////////////////////////////////////// */

    /** Dispatched when a cache hit is detected — no API call needed. */
    cacheHit: props<{ id: string; props: V2XCredit_InstancePropsCacheHit }>(),

    /** Configure TTL (in ms) for specific data-keys of an instance. */
    configureTtl: props<{ id: string; ttls: Partial<V2XCredit_Ttls> }>(),

    /** Invalidate (wipe) cached data for specific data-keys of an instance. */
    cacheInvalidate: props<{
      id: string;
      keys: V2XCredit_ResponseIsRelatedTo[];
    }>(),

    /**
     * Mask all data keys of an instance. Resolved selectors return `undefined`
     * for masked keys until the next `get*` action unmasks them automatically.
     */
    cacheMask: props<{ id: string }>(),

    /* ////////////////////////////////////////////////////////////////////// */
    /* Other actions                                                          */
    /* ////////////////////////////////////////////////////////////////////// */

    /** Create the state of an instance if not exists. */
    createIfNotExists: props<{ id: string }>(),

    /** Reset the state of a specific instance. */
    reset: props<{ id: string }>(),

    /** Reset the state to initial. Clears all cached data. */
    resetAll: emptyProps(),

    /** Successfull HTTP call. */
    success: props<{ id: string; props: V2XCredit_InstancePropsSuccess }>(),

    /** Unsuccessfull HTTP call. */
    failure: props<{ id: string; props: V2XCredit_InstancePropsFailure }>(),
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
import {
  V2XCredit_Loadeds,
  V2XCredit_Errors,
  V2XCredit_Datas,
} from './x-credit.interfaces';

/**
 * `createFeatureSelector()` method?
 * In simple terms, it selects our whole feature state:
 * e.g., `{ ids: ['g','2',...], entities: { '2': { ... } }, selectedId: '2' }`
 * NOTE: We don't need it in our components most of the times.
 */
export const selectState = createFeatureSelector<reducer.V2XCredit_State>(
  reducer.v2XCreditFeatureKey,
);

export const selectLastSetStyle = createSelector(
  selectState,
  (state: reducer.V2XCredit_State) => state.lastSetStyle,
);

/**
 * What `getSelectors()` method returns?
 * Some helper fucntions that help us to select our entities inside of our
 * feature state object. Why we need such helpers? Because remember? It was NOT
 * us who added the entities, but it was `itemsAdapter` which added our entities
 * into our feature object.
 */
const { selectAll, selectEntities } = reducer.v2XCreditAdapter.getSelectors();

/**
 * An array with all of our entities inside of it.
 */
export const selectAllEntities = createSelector(
  selectState,
  (state: reducer.V2XCredit_State) => selectAll(state),
);

/**
 * Factory function to create a selector that returns the entity object.
 * @param id The entity object's id.
 * @returns A selector that returns the entity object.
 */
export const selectEntity = (id = 'g') => {
  return createSelector(selectState, (state: reducer.V2XCredit_State) => {
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
    return entity as reducer.V2XCredit_Entity;
  });
};

export const selectEntityLoadedLatest = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V2XCredit_Entity) => state.loadedLatest,
  );
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Raw selectors (cache-keyed state slices)                                   */
/* ////////////////////////////////////////////////////////////////////////// */

export const selectEntityLoadeds = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V2XCredit_Entity) => state.loadeds,
  );
};

export const selectEntityErrors = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V2XCredit_Entity) => state.errors,
  );
};

export const selectEntityDatas = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(
    entity,
    (state: reducer.V2XCredit_Entity) => state.datas,
  );
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Narrow selectors (Datas): Resolved (flat, via cacheKeyLatest)              */
/* ////////////////////////////////////////////////////////////////////////// */

export const selectEntitySummaryData = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V2XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('summary')) return undefined;
    const key = state.cacheKeyLatest['summary'];
    return key ? state.datas.summary[key] : undefined;
  });
};

export const selectEntityDetailData = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V2XCredit_Entity) => {
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
  return createSelector(entity, (state: reducer.V2XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('summary')) return undefined;
    const key = state.cacheKeyLatest['summary'];
    return key ? state.loadeds.summary[key] : undefined;
  });
};

export const selectEntityDetailLoaded = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V2XCredit_Entity) => {
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
  return createSelector(entity, (state: reducer.V2XCredit_Entity) => {
    if (state.cacheMaskedKeys?.has('summary')) return undefined;
    const key = state.cacheKeyLatest['summary'];
    return key ? state.errors.summary[key] : undefined;
  });
};

export const selectEntityDetailError = (id = 'g') => {
  const entity = selectEntity(id);
  return createSelector(entity, (state: reducer.V2XCredit_Entity) => {
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
    (state: reducer.V2XCredit_Entity): V2XCredit_Loadeds => {
      const result: V2XCredit_Loadeds = {};
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
    (state: reducer.V2XCredit_Entity): V2XCredit_Errors => {
      const result: V2XCredit_Errors = {};
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
    (state: reducer.V2XCredit_Entity): V2XCredit_Datas => {
      const result: V2XCredit_Datas = {};
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
    (state: reducer.V2XCredit_Entity | undefined) => {
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
  return createSelector(selectState, (state: reducer.V2XCredit_State) => {
    const entity = state.entities[id];
    if (!entity) return false;
    return true;
  });
};
```
