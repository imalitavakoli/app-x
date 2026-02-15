# 'ng-x-profile-info' functionality 'ui' lib samples

Here we share the sample files of a functionality called 'ng-x-profile-info', just for you as a source of inspiration.

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `README.md` (outer) file

Outer `README.md` file of a lib is the one which rests outside of the `src` folder.
It just mentions a high-level explanation of what the lib holds and does.

```md
# shared-ui-ng-x-profile-info

UI of the functionality.

**For what functionality this lib is for?**
ng-x-profile-info.
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `README.md` (inner) file

Inner `README.md` file of a lib is the one which rests inside of the `src` folder.
It MUST include a ready-to-use code for copy-paste in the Test page of the Boilerplate app(s).

````md
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
  selector: 'x-test-page-v1',
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
````

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-profile-info.component.ts` file

It's the component file which gets exported.

```ts
import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { V1BaseUi_DataType } from '@x/shared-util-ng-bases-model';
import { V1BaseUiComponent } from '@x/shared-util-ng-bases';
import {
  V1XCredit_MapDetail,
  V1XCredit_Style,
} from '@x/shared-map-ng-x-credit';
import { V1XProfileInfo_MapData } from '@x/shared-map-ng-x-profile-info';
import { V1CurrencyPipe } from '@x/shared-ui-ng-pipes';

/**
 * X Profile-Info sample 'ui' lib.
 *
 * @export
 * @class V1XProfileInfoComponent
 * @typedef {V1XProfileInfoComponent}
 */
@Component({
  selector: 'x-x-profile-info-v1',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule, V1CurrencyPipe],
  templateUrl: './x-profile-info.component.html',
  styleUrl: './x-profile-info.component.scss',
})
export class V1XProfileInfoComponent extends V1BaseUiComponent {
  style = signal<V1XCredit_Style>('rounded');

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  // state = model<V1BaseUi_State>('loading'); // Introduced in base class
  override dataType = model<V1BaseUi_DataType>('one');

  data = input.required<V1XProfileInfo_MapData>();
  creditDetail = input.required<V1XCredit_MapDetail>();

  icoInfo = input('./assets/images/libs/shared/icon-info.svg');
  langCultureCode = input('en-GB');
  defaultStyle = input<V1XCredit_Style | undefined>(undefined);
  showIcoInfo = input(true);
  showBg = input(true);
  showBtnReadMore = input(true);

  clickedReadMore = output<void>();
  clickedStyle = output<V1XCredit_Style>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  onClickedStyle() {
    if (this.style() === 'rounded') this.style.set('sharp');
    else this.style.set('rounded');
    this.clickedStyle.emit(this.style());
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    super._xHasRequiredInputs();

    // Read optional inputs to track them.
    this.icoInfo();
    this.langCultureCode();
    this.defaultStyle();
    this.showIcoInfo();
    this.showBg();
    this.showBtnReadMore();

    // Check for required inputs (which also leads to tracking them).
    if (!this.data() || !this.creditDetail()) return false;
    return true;
  }

  protected override _xSetState(): void {
    super._xSetState();

    // Set default style.
    if (!this.defaultStyle()) this.style.set('rounded');
    else this.style.set(this.defaultStyle() as V1XCredit_Style);

    // Set state.
    this.state.set('data');
  }
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-profile-info.component.html` file

`x-profile-info.component.ts` component's HTML template.

```html
@if (state() === 'data') {
<!-- ///////////////////////////////////////////////////////////////////// -->
<!-- Data                                                                  -->
<!-- ///////////////////////////////////////////////////////////////////// -->
<section
  [ngClass]="{
      'rounded-3xl': style() === 'rounded',
      'rounded-none': style() === 'sharp',
      'bg-einformative bg-opacity-40': showBg(),
    }"
  class="p-4"
>
  <div class="flex items-center justify-start gap-4">
    @if (showIcoInfo()) {
    <svg-icon
      class="e-svg fill-eprimary text-eprimary block h-5 w-5"
      [src]="icoInfo()"
    ></svg-icon>
    }
    <div>
      <h2 class="text-lg">{{ data().fullName }}</h2>
      <span class="text-sm opacity-50">{{ data().dateOfBirth }}</span>
    </div>
  </div>

  <hr class="opacity-25" />

  <!-- country -->
  @if (data().country) { Country: <span> {{ data().country }} </span>
  }
  <!-- Bio -->
  @if (data().bio) {
  <p>{{ data().bio }}</p>
  }

  <hr class="opacity-25" />

  <div class="my-2">
    Balance: {{ creditDetail().balance | currencyV1:
    creditDetail().balanceCurrency : langCultureCode() }}
  </div>

  <div class="flex justify-stretch gap-4">
    <button
      title="Change style"
      (click)="onClickedStyle()"
      class="e-btn bg-eprimary hover:bg-eprimary-lighter w-full p-2"
    >
      <i class="bi bi-circle-square"></i>
    </button>

    @if (showBtnReadMore()) {
    <button
      title="Read more"
      (click)="clickedReadMore.emit()"
      class="e-btn bg-eprimary hover:bg-eprimary-lighter w-full p-2"
    >
      <i class="bi bi-book"></i>
    </button>
    }
  </div>
</section>
} @else if (state() === 'loading') {
<!-- ///////////////////////////////////////////////////////////////////// -->
<!-- Loading                                                               -->
<!-- ///////////////////////////////////////////////////////////////////// -->
<div class="skeleton h-52"></div>
}
```
