# shared-ui-ng-x-profile-image

v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1BaseUi_State } from '@x/shared-util-ng-bases-model';
import { V1XCredit_MapSummary } from '@x/shared-map-ng-x-credit';
import {
  V1XProfileImageComponent,
  V1_X_PROFILE_IMAGE_CREDIT_SUMMARY,
} from '@x/shared-ui-ng-x-profile-image';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1XProfileImageComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Inputs                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  creditSummary: V1XCredit_MapSummary = V1_X_PROFILE_IMAGE_CREDIT_SUMMARY;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Outputs                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  onStateChange(state: V1BaseUi_State) {
    console.log('onStateChange:', state);
  }
}
```

```html
<x-x-profile-image-v1
  [creditSummary]="creditSummary"
  [imgAvatar]="
    $any((configFacade.dataConfigDep$ | async)?.assets?.libXprofileImageImgAvatar)
  "
  (state)="onStateChange($event)"
></x-x-profile-image-v1>
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-ui-ng-x-profile-image` to execute the unit tests.
