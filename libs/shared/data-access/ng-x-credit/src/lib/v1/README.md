# shared-data-access-ng-x-credit

x-credit v1.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/{app-name}/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V1XCredit_State,
  v1XCreditReducer,
  V1XCreditEffects,
} from '@x/shared-data-access-ng-x-credit';

export interface State {
  v1XCredit: V1XCredit_State;
}

export const reducers: ActionReducerMap<State> = {
  v1XCredit: v1XCreditReducer,
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
    // `V1TestPageComponent` if it doesn't exist.
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

    // Start listening to the state changes of `V1TestPageComponent` entity.
    this._xCreditEntitySub = this.xCreditFacade
      .entity$('V1TestPageComponent')
      .subscribe((state) => {
        if (state.loadedLatest.summary && state.datas.summary) {
          console.log('summary:', state.datas.summary);
        }
        if (state.loadedLatest.detail && state.datas.detail) {
          console.log('detail:', state.datas.detail);
        }
      });

    // Get summary
    this.xCreditFacade.getSummary(this._baseUrl, 123, 'V1TestPageComponent');

    // Get detail
    this.xCreditFacade.getDetail(this._baseUrl, 123, 'V1TestPageComponent');

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

      @if ((xCreditFacade.entityErrors$('V1TestPageComponent') |
      async)?.summary) {
      <small class="e-ecode">
        V1XCreditFacade({{ 'V1TestPageComponent' }})/summary
      </small>
      }

      <!-- xCreditFacade/detail //////////////////////////////////////////// -->

      @if ((xCreditFacade.entityErrors$('V1TestPageComponent') | async)?.detail)
      {
      <small class="e-ecode">
        V1XCreditFacade({{ 'V1TestPageComponent' }})/detail
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
  xCreditFeatureKey,
  v1XCreditReducer,
  V1XCreditEffects,
} from '@x/shared-data-access-ng-x-credit';

export const V1TestRoutes: Route[] = [
  {
    path: '',
    component: V1TestPageComponent,
    providers: [
      provideState(xCreditFeatureKey, v1XCreditReducer),
      provideEffects(V1XCreditEffects),
    ],
  },
];
```
