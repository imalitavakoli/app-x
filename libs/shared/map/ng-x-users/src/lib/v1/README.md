# shared-map-ng-x-users

x-users v1.

## Implementation guide

We use it in the effects of 'shared-data-access-ng-x-users' lib.

Here's an example of how to test the lib:

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1XUsers, V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _proxy = inject(V1XUsers);
  private readonly _baseUrl = '/v1';
  private readonly _user: V1XUsers_MapUser = {
    id: 123,
    name: 'John Doe',
    username: 'joe',
    email: 'joe@x.com',
  };

  ngOnInit() {
    // Set all entities
    this._proxy
      .getAll(this._baseUrl)
      .pipe(
        take(1),
        map((data) => {
          console.log('getAll:', data);
        }),
      )
      .subscribe();

    // Add one entity
    this._proxy
      .addOne(this._baseUrl, this._user)
      .pipe(
        take(1),
        map((data) => {
          console.log('addOne:', data);
        }),
      )
      .subscribe();

    // Update one entity
    this._proxy
      .updateOne(this._baseUrl, this._user)
      .pipe(
        take(1),
        map((data) => {
          console.log('updateOne:', data);
        }),
      )
      .subscribe();

    // Remove one entity
    this._proxy
      .removeOne(this._baseUrl, this._user.id)
      .pipe(
        take(1),
        map((data) => {
          console.log('removeOne:', data);
        }),
      )
      .subscribe();
  }
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-x-users` to execute the unit tests.
