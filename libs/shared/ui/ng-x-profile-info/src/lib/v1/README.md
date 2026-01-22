# shared-ui-ng-x-profile-info

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
import {
  V1XCredit_MapDetail,
  V1XCredit_Style,
} from '@x/shared-map-ng-x-credit';
import { V1XProfileInfo_MapData } from '@x/shared-map-ng-x-profile-info';
import {
  V1XProfileInfoComponent,
  V1_X_PROFILE_INFO_DATA,
  V1_X_PROFILE_INFO_CREDIT_DETAIL,
} from '@x/shared-ui-ng-x-profile-info';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, RouterModule, V1XProfileInfoComponent],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V1TestPageComponent {
  readonly configFacade = inject(V2ConfigFacade);
  $dataConfigDep = toSignal(this.configFacade.dataConfigDep$);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Inputs                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  data = signal<V1XProfileInfo_MapData>(V1_X_PROFILE_INFO_DATA);
  creditDetail = signal<V1XCredit_MapDetail>(V1_X_PROFILE_INFO_CREDIT_DETAIL);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Outputs                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  onClickedReadMore() {
    console.log('onClickedReadMore');
  }

  onClickedStyle(style: V1XCredit_Style) {
    console.log('onClickedStyle:', style);
  }

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
<!--
NOTE: Observables can also be used in no zone.js mode, but using signal is 
recemmended.
e.g., `$any((configFacade.dataConfigDep$ | async)?.libs?.xProfileInfoV1?.hasBg)`.
-->
<x-x-profile-info-v1
  [data]="data()"
  [creditDetail]="creditDetail()"
  [icoInfo]="$any($dataConfigDep()?.assets?.libXprofileInfoIcoInfo)"
  langCultureCode="en-GB"
  defaultStyle="rounded"
  [showIcoInfo]="$any($dataConfigDep()?.libs?.xProfileInfoV1?.hasInfoIcon)"
  [showBg]="$any($dataConfigDep()?.libs?.xProfileInfoV1?.hasBg)"
  [showBtnReadMore]="true"
  (clickedReadMore)="onClickedReadMore()"
  (clickedStyle)="onClickedStyle($event)"
  (stateChange)="onStateChange($event)"
></x-x-profile-info-v1>
```

## Important requirements

_NONE_

## Running unit tests

Run `nx test shared-ui-ng-x-profile-info` to execute the unit tests.
