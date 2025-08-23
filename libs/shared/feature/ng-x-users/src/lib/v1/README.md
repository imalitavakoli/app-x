# shared-feature-ng-x-users

x-users v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1XUsersFeaComponent } from '@x/shared-feature-ng-x-users';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1XUsersFeaComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V1TestPageComponent {
  readonly configFacade = inject(V2ConfigFacade);
  @ViewChild('xUsersFea') xUsersFeaCom!: V1XUsersFeaComponent;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Outputs                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * It will be emitted ONLY after all the lib's data is ready!
   *
   * NOTE: Only after this event, we can call the lib's methods successfully :)
   */
  onReady() {
    console.log('onReady');
  }

  /**
   * It will be emitted if there's any error.
   */
  onError(error: { key: string; value: string }) {
    console.log('onError:', error.key);
  }

  onSelectedUser(user: V1XUsers_MapUser) {
    console.log('onSelectedUser:', user);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  getSelectedUserId() {
    console.log('getSelectedUserId:', this.xUsersFeaCom.getSelectedUserId());
  }
  getSelectedUser() {
    console.log('getSelectedUser:', this.xUsersFeaCom.getSelectedUser());
  }
}
```

```html
<x-x-users-fea-v1
  #xUsersFea
  [showErrors]="false"
  (ready)="onReady()"
  (hasError)="onError($event)"
  (selectedUser)="onSelectedUser($event)"
></x-x-users-fea-v1>

--------------------------------------------------------------------------------

<button class="e-btn block" (click)="getSelectedUserId()">
  getSelectedUserId
</button>
<button class="e-btn block" (click)="getSelectedUser()">getSelectedUser</button>
```

## More

**Considerations before implementing this lib:**

You should NOT initialize this lib at all, if:

- User is NOT authenticated in the app (logged in).

## Important requirements

_None._

## Running unit tests

Run `nx test shared-feature-ng-x-users` to execute the unit tests.
