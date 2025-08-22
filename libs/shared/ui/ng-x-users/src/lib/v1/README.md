# shared-ui-ng-x-users

v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1BaseUi_State } from '@x/shared-util-ng-bases-model';
import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';
import { V1XUsersComponent, V1_X_USERS_ALL } from '@x/shared-ui-ng-x-users';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoDirective, V1XUsersComponent],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);
  @ViewChild('xUsers') xUsersCom!: V1XUsersComponent;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Inputs                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  users: V1XUsers_MapUser[] = V1_X_USERS_ALL;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Outputs                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  onSelectedUser(user: V1XUsers_MapUser) {
    console.log('onSelectedUser:', user);
  }

  onStateChange(state: V1BaseUi_State) {
    console.log('onStateChange:', state);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  getSelectedUserId() {
    console.log('getSelectedUserId:', this.xUsersCom.getSelectedUserId());
  }
  getSelectedUser() {
    console.log('getSelectedUser:', this.xUsersCom.getSelectedUser());
  }
}
```

```html
<x-x-users-v1
  #xUsers
  [defaultSelectedUser]="users[0]"
  [users]="users"
  (selectedUser)="onSelectedUser($event)"
  (state)="onStateChange($event)"
></x-x-users-v1>

------------------------------------------------------------------------------

<button class="e-btn block" (click)="getSelectedUserId()">
  getSelectedUserId
</button>
<button class="e-btn block" (click)="getSelectedUser()">getSelectedUser</button>
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-ui-ng-x-users` to execute the unit tests.
