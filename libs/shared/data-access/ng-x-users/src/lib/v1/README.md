# shared-data-access-ng-x-users

x-users v1.

## Implementation guide

1. First, register the data-access state in the app.

```ts
// apps/appname/src/app/+state/index.ts

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V1XUsers_State,
  v1XUsersReducer,
  V1XUsersEffects,
} from '@x/shared-data-access-ng-x-users';

export interface State {
  v1XUsers: V1XUsers_State;
}

export const reducers: ActionReducerMap<State> = {
  v1XUsers: v1XUsersReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
export const effects = [V1XUsersEffects];
```

2. Import the facade in the components where you want to use it.

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

import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1XUsersFacade } from '@x/shared-data-access-ng-x-users';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoPipe, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  readonly xUsersFacade = inject(V1XUsersFacade);

  private readonly _baseUrl = '/v1/';
  private readonly _user: V1XUsers_MapUser = {
    id: 123,
    name: 'John Doe',
    username: 'joe',
    email: 'joe@x.com',
  };

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    // Get the current status of the whole state.
    this.xUsersFacade.state$.pipe(take(1)).subscribe((state) => {
      console.log('state:', state);

      if (state.loaded && !state.error && state.crudActionLatest === 'getAll') {
        // ...
      }
    });

    // Get all entities.
    this.xUsersFacade.getAll(this._baseUrl);

    // After having all entities in the state object, select one of them.
    this.itemsFacade.setSelectedId(123);

    // Get the current data of the previously selected entity.
    this.xUsersFacade.selectedEntity$.pipe(take(1)).subscribe((entity) => {
      console.log('entity:', entity);
    });

    // Add new entity.
    this.xUsersFacade.addOne(this._baseUrl, this._user);

    // Update an entity that we already had its `id`.
    this.xUsersFacade.updateOne(this._baseUrl, this._user);

    // Remove an entity that we already had its `id`.
    this.xUsersFacade.removeOne(this._baseUrl, this._user);
  }
}
```

After setting all entities in TS, here's how to show them in 'all' page:

```html
<main>
  <!-- Loading -->
  @if ((xUsersFacade.loaded$ | async) === false) { Loading entities... }

  <!-- Loaded -->
  @if (xUsersFacade.loaded$ | async) {
  <section>
    @for (entity of xUsersFacade.allEntities$ | async; track $index) {
    <div>{{ entity.id }}</div>
    }
  </section>
  }
</main>
```

After setting all entities, and selecting one in TS, here's how to show it in 'one' page:

```html
<main>{{ (xUsersFacade.selectedEntity$ | async)?.id }}</main>
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-data-access-ng-x-users` to execute the unit tests.
