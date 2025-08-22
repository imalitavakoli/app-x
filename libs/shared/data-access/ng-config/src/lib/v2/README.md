# shared-data-access-ng-config

config v2.

## Implementation guide

Let's do some preparation to start using the lib.

### Preparation

1. First, register the data-access state in the app.

```ts
// apps/appname/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V2Config_State,
  v2ConfigReducer,
  V2ConfigEffects,
} from '@x/shared-data-access-ng-config';

export interface State {
  v2Config: V2Config_State;
}

export const reducers: ActionReducerMap<State> = {
  v2Config: v2ConfigReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
export const effects = [V2ConfigEffects];
```

2. Import the facade in an initializer service.

Use Angular's `APP_INITIALIZER` token in `app.config.ts` file to create a factory function to load the config before the app gets initialized.

```ts
// app.config.ts

import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { metaReducers, reducers, effects } from './+state';
import { AppInitializerService } from './app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    environment.providers,
    provideEffects(effects),
    provideStore(reducers, { metaReducers }),
    {
      provide: APP_INITIALIZER,
      useFactory: (service: AppInitializerService) => service.init(),
      deps: [AppInitializerService],
      multi: true,
    },
  ],
};
```

```ts
// app.interfaces.ts

export interface HaltedState {
  haltedStep: string;
}
```

```ts
// app-initializer.service.ts

import { Injectable, inject } from '@angular/core';
import { concatMap, exhaustMap, of, skip, take } from 'rxjs';
import { environment } from '../environments/environment';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { mapConfigExtra } from '@x/appname-map-config';
import { HaltedState } from './app.interfaces';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  private _configFacade = inject(V2ConfigFacade);

  init() {
    return () =>
      new Promise((resolve, reject) => {
        this._configFacade.appInitStart();
        this._configFacade.loadConfigDep(
          environment.dep_config,
          mapConfigExtra as <T, U, V>(d: T, a: U) => V,
        );

        let baseUrl!: string;
        let clientId!: number;

        this._configFacade.configState$
          .pipe(
            skip(1),
            take(1),
            exhaustMap((state) => {
              this._configFacade.appInitFinish();

              if (!state.dataConfigDep) {
                return of({ haltedStep: 'config' } as HaltedState);
              }

              baseUrl = state.dataConfigDep.general.baseUrl;
              clientId = state.dataConfigDep.general.clientId;
              this._moreConfigSettings(state.dataConfigDep);

              // Swtich to other Observables maybe...
              return this._configFacade.configState$;
            }),
            take(1),
            concatMap((state) => {
              if ('haltedStep' in state) return of(state);

              if (!state.data) {
                return of({ haltedStep: 'featureKeyName' } as HaltedState).pipe(
                  take(1),
                );
              }

              return this._configFacade.configState$.pipe(take(1));
            }),
          )
          .subscribe((state) => {
            if ('haltedStep' in state) {
              switch (state.haltedStep) {
                case 'config':
                  this._initFailed(resolve);
                  break;
                case 'featureKeyName':
                  // Do something...
                  break;
              }

              return;
            }

            // Load something else maybe...
            resolve(true);
          });
      });
  }

  private _initFailed(resolve: (value: unknown) => void) {
    resolve(true);
    // this._router.navigate(['/shell']);
  }

  private _moreConfigSettings(data: V2Config_MapDep) {
    // Do more settings now that config is loaded. e.g., edit the HTML page.
  }
}
```

3. Import the facade in the components where you want to use it.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  TranslocoPipe,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';

import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoPipe, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    // In our component initialization, subscribe to the lib's state to be
    // notified about each property change.
    this.configFacade.configState$.pipe(take(1)).subscribe((state) => {
      // We are already sure DEP config is loaded, so define the correct type of the
      // data to get helped by code auto-completion.
      state.dataConfigDep = state.dataConfigDep as V2Config_MapDep;
      const dextra = state.dataConfigDep.extra as ConfigWithExtra['extra'];

      console.log('configState$', state);
    });
  }
}
```

### Usage

- In our lib's state subscription in the factory function of `app.config.ts`, we should check if `data` option is truthy... If it is, do nothing special! But if it's NOT, then we can redirect the user to a page that shows an error message that the app couldn't get loaded! Because our app deeply depends on the DEP config.

- Simply use the lib's selectors in our component template to manage our content. e.g., `(configFacade.dataConfigDep$ | async)?.assets?.logo`.

## Important requirements

_None._

## Running unit tests

Run `nx test shared-data-access-ng-config` to execute the unit tests.
