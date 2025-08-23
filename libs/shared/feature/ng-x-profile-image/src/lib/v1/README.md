# shared-feature-ng-x-profile-image

x-profile-image v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1XProfileImageFeaComponent } from '@x/shared-feature-ng-x-profile-image';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1XProfileImageFeaComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V1TestPageComponent {
  readonly configFacade = inject(V2ConfigFacade);

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
}
```

```html
<x-x-profile-image-fea-v1
  [userId]="123"
  [showErrors]="false"
  (ready)="onReady()"
  (hasError)="onError($event)"
></x-x-profile-image-fea-v1>
```

## More

**Considerations before implementing this lib:**

You should NOT initialize this lib at all, if:

- User is NOT authenticated in the app (logged in).

## Important requirements

_None._

## Running unit tests

Run `nx test shared-feature-ng-x-profile-image` to execute the unit tests.
