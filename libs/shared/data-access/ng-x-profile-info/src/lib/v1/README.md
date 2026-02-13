# shared-data-access-ng-x-profile-info

x-profile-info v1.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/{app-name}/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V1XProfileInfo_State,
  v1XProfileInfoReducer,
  V1XProfileInfoEffects,
} from '@x/shared-data-access-ng-x-profile-info';

export interface State {
  v1XProfileInfo: V1XProfileInfo_State;
}

export const reducers: ActionReducerMap<State> = {
  v1XProfileInfo: v1XProfileInfoReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
export const effects = [V1XProfileInfoEffects];
```

2. Import the facade in the components where you want to use it.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1XProfileInfoFacade } from '@x/shared-data-access-ng-x-profile-info';

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
  readonly xProfileInfoFacade = inject(V1XProfileInfoFacade);
  private _xProfileInfoSub!: Subscription;

  private readonly _baseUrl = '/v1/';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    // Start listening to the state changes.
    this._xProfileInfoSub = this.xProfileInfoFacade.state$.subscribe(
      (state) => {
        if (state.loadedLatest.data && state.datas.data) {
          console.log('data:', state.datas.data);
        }
      },
    );

    // Get data
    this.xProfileInfoFacade.getData(this._baseUrl, 123);

    // Reset the state after 5 seconds.
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
@if ((xProfileInfoFacade.errors$ | async)?.data) {
<ng-container>
  <div class="text-center">
    <h1 class="h1 text-lg">Oops! Something went wrong.</h1>
    <p class="p">
      Data could not be loaded
      <small class="e-ecode">V1XProfileInfoFacade/data</small>
    </p>
  </div>
</ng-container>
}
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-data-access-ng-x-profile-info` to execute the unit tests.
