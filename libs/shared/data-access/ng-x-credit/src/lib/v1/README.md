# shared-data-access-ng-x-credit

XCredit v1.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/appname/src/app/+state/index.ts

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
import { Subscription, take } from 'rxjs';
import { V1DaylightComponent } from '@x/shared-ui-ng-daylight';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V3XCreditFacade } from '@x/shared-data-access-ng-x-credit';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, V1DaylightComponent, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, OnDestroy {
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _xCreditFacade = inject(V3XCreditFacade);
  private _xCreditEntitySub!: Subscription;

  private readonly _baseUrl = '/v1/';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    // Before subscribing to the state changes, create the entity
    // `TestComponent` if it doesn't exist.
    this._xCreditFacade.createIfNotExists('TestComponent');

    // Check if the user has already set a preferred style (in her last app visit).
    this._xCreditFacade.checkIfAlreadySetStyle();

    // Set the user's set preferred style in the state object
    this._xCreditFacade.setStyle('sharp');

    // Get the last preferred style.
    this._xCreditFacade.lastSetStyle$.pipe(take(1)).subscribe((style) => {
      console.log('lastSetStyle:', style);
    });

    // Get the current status of the whole state.
    this._xCreditFacade.state$.pipe(take(1)).subscribe((state) => {
      console.log('state:', state);
    });

    // Start listening to the state changes of `TestComponent` entity.
    this._xCreditEntitySub = this._xCreditFacade
      .entity$('TestComponent')
      .subscribe((state) => {
        if (state.loadedLatest.summary && state.datas.summary) {
          console.log('summary:', state.datas.summary);
        }
        if (state.loadedLatest.detail && state.datas.detail) {
          console.log('detail:', state.datas.detail);
        }
      });

    // Get summary
    this._xCreditFacade.getSummary(this._baseUrl, 123, 'TestComponent');

    // Get detail
    this._xCreditFacade.getDetail(this._baseUrl, 123, 'TestComponent');

    // Reset the state after 5 seconds.
    setTimeout(() => {
      this._xCreditEntitySub.unsubscribe();
      this._xCreditFacade.reset('TestComponent'); // Reset only the entity object itself.
      this._xCreditFacade.resetAll(); // Reset the whole state.
      console.log('State reset');
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this._xCreditEntitySub) this._xCreditEntitySub.unsubscribe();
  }
}
```

## More

_Optional!_ Instead of registering the data-access state in the app, you can register it right in the page itself.

```ts
// lib.routes.ts

import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { TestComponent } from './test/test.component';
import {
  xCreditFeatureKey,
  v1XCreditReducer,
  V1XCreditEffects,
} from '@x/shared-data-access-ng-x-credit';

export const testRoutes: Route[] = [
  {
    path: '',
    component: TestComponent,
    providers: [
      provideState(xCreditFeatureKey, v1XCreditReducer),
      provideEffects(V1XCreditEffects),
    ],
  },
];
```
