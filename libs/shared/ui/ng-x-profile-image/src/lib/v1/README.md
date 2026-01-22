# shared-ui-ng-x-profile-image

v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
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
  imports: [CommonModule, RouterModule, V1XProfileImageComponent],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V1TestPageComponent {
  readonly configFacade = inject(V2ConfigFacade);
  $dataConfigDep = toSignal(this.configFacade.dataConfigDep$);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Inputs                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  creditSummary = signal<V1XCredit_MapSummary>(
    V1_X_PROFILE_IMAGE_CREDIT_SUMMARY,
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* Outputs                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  // `state` input of the lib is a 2-way binding input. So we could actually
  // use the 'banana-in-a-box' syntax (`[(state)]="parentState"`) instead of
  // listening to `stateChange` output.
  // NOTE: Angular automatically wires `stateChange` whenever you use `[(state)]`.
  onStateChange(state: V1BaseUi_State) {
    console.log('onStateChange:', state);
  }
}
```

```html
<x-x-profile-image-v1
  [creditSummary]="creditSummary()"
  [imgAvatar]="$any($dataConfigDep()?.assets?.libXprofileImageImgAvatar)"
  (stateChange)="onStateChange($event)"
></x-x-profile-image-v1>
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-ui-ng-x-profile-image` to execute the unit tests.
