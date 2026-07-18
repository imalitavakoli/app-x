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

/**
 * NOTE: When calling the lib's methods, we assume the following:
 *
 * The following properties are defined as the following for the app that is being served:
 * - In `apps/{app-name}/src/proxy.conf.json`:
 *   - For all API calls, `target = https://client-x-api.x.com`.
 * - In `apps/{app-name}/{assets-folder}/DEP_config.development.json`:
 *   - `general.environment.environment.items.base_url = /v2`.
 *   - `general.environment.environment.items.client_id = 1234567890`.
 *
 * For authenticated API requests, we assume that the following user is already logged in:
 * - https://admin.x.com/admin/users/123456
 *
 * @export
 * @class V2TestPageComponent
 * @typedef {V2TestPageComponent}
 */
@Component({
  selector: 'x-test-page-v2',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V2TestPageComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  readonly xProfileInfoFacade = inject(V2XProfileInfoFacade);
  private _xProfileInfoSub!: Subscription;

  private readonly _baseUrl = '/v2/';

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
