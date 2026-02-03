# shared-feature-ng-x-profile-info

x-profile-info v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1XProfileInfoFeaComponent } from '@x/shared-feature-ng-x-profile-info';

@Component({
  selector: 'x-test-page-v1',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1XProfileInfoFeaComponent,
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

  onClickedReadMore() {
    console.log('onClickedReadMore');
  }

  onClickedStyle(style: V1XCredit_Style) {
    console.log('onClickedStyle:', style);
  }
}
```

```html
<x-x-profile-info-fea-v1
  [userId]="123"
  [showErrors]="false"
  (ready)="onReady()"
  (hasError)="onError($event)"
  [showBtnReadMore]="true"
  (clickedReadMore)="onClickedReadMore()"
  (clickedStyle)="onClickedStyle($event)"
></x-x-profile-info-fea-v1>
```

## More

**Considerations before implementing this lib:**

You should NOT initialize this lib at all, if:

- User is NOT authenticated in the app (logged in).

## Important requirements

_None._

## Running unit tests

Run `nx test shared-feature-ng-x-profile-info` to execute the unit tests.
