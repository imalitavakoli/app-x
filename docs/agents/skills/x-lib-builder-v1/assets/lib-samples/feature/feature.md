# 'ng-x-profile-info' functionality 'feature' lib samples

Here we share the sample files of a functionality called 'ng-x-profile-info', just for you as a source of inspiration.

**Note!**  
Based on what the functionality (lib) must do as a whole, one or more than one component should be exported out of the lib. For this functionality here are the exported components:

- `V1XProfileInfoFeaComponent`

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
# shared-feature-ng-x-profile-info

This lib is the last piece of the puzzle for the functionality to get fully implemented.

- It initializes the required '_data-access_' lib(s) to call their actions and update their state object.
- It initializes the required '_ui_' lib(s) to provide the updated state object properties as input values for the lib(s).

By initializing this lib in a '_page_', we will have a real-world working UI which also deals with API for our functionality. Cheers 🍺

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

## `V1XProfileInfoFeaComponent` exported component files

Files related to `V1XProfileInfoFeaComponent` exported component.

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `README.md` (inner) file

Inner `README.md` file of a lib is the one which rests inside of the `src` folder and for 'feature' libs, it is specific to a component.  
It MUST include a ready-to-use code for copy-paste in the Test page of the Boilerplate app(s) to demonstrate how the component works.

````md
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

/**
 * NOTE: When calling the lib's methods, we assume the following:
 *
 * The following properties are defined as the following for the app that is being served:
 * - In `apps/{app-name}/src/proxy.conf.json`:
 *   - For all API calls, `target = https://client-x-api.x.com`.
 * - In `apps/{app-name}/{assets-folder}/DEP_config.development.json`:
 *   - `general.environment.environment.items.base_url = /v1`.
 *   - `general.environment.environment.items.client_id = 1234567890`.
 *
 * For authenticated API requests, we assume that the following user is already logged in:
 * - https://admin.x.com/admin/users/123456
 *
 * @export
 * @class V1TestPageComponent
 * @typedef {V1TestPageComponent}
 */
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
````

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-profile-info.component.ts` file

It's the component file which gets exported.

```ts
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  exhaustMap,
  map,
  take,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

import { V1BaseFeatureExtComponent } from '@x/shared-util-ng-bases';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1XCredit_Style } from '@x/shared-map-ng-x-credit';
import { V1XProfileInfo_MapData } from '@x/shared-map-ng-x-profile-info';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1XProfileInfoComponent } from '@x/shared-ui-ng-x-profile-info';
import {
  V1XCredit_Datas,
  V1XCredit_Loadeds,
  V1XCreditFacade,
} from '@x/shared-data-access-ng-x-credit';
import {
  V1XProfileInfo_Datas,
  V1XProfileInfo_Loadeds,
  V1XProfileInfoFacade,
} from '@x/shared-data-access-ng-x-profile-info';

@Component({
  selector: 'x-x-profile-info-fea-v1',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    V1PopupComponent,
    LottieComponent,
    V1XProfileInfoComponent,
  ],
  templateUrl: './x-profile-info.component.html',
  styleUrl: './x-profile-info.component.scss',
})
export class V1XProfileInfoFeaComponent extends V1BaseFeatureExtComponent {
  readonly xCreditFacade = inject(V1XCreditFacade);
  readonly xProfileInfoFacade = inject(V1XProfileInfoFacade);

  protected _xCreditRequestedData_main: (keyof V1XCredit_Datas)[] = [];
  protected _xProfileInfoRequestedData: (keyof V1XProfileInfo_Datas)[] = [];

  readonly nameThis: string = 'V1XProfileInfoFeaComponent'; // Name of this component
  readonly nameInstance_main: string = 'V1XProfileInfoFeaComponent_main'; // Name of the 'main' instance for multi-instance 'data-access' libs based on this component.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  userId = input.required<number>();

  showBtnReadMore = input(true);

  clickedReadMore = output<void>();
  clickedStyle = output<V1XCredit_Style>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPreBeforeDom(): void {
    // LIB: XCredit (main)
    this.xCreditFacade.createIfNotExists(this.nameInstance_main);
  }

  protected override _xInitOrUpdateAfterAllDataReady() {
    super._xInitOrUpdateAfterAllDataReady();

    // Check if the user has already set a preferred style (in her last app visit).
    this.xCreditFacade.checkIfAlreadySetStyle();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    // Read optional inputs to track them.
    this.showBtnReadMore();

    // Check for required inputs (which also leads to tracking them).
    if (!this.userId()) return false;
    return true;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X facades functions                                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xFacadesPre(): Observable<{ [key: string]: boolean }>[] {
    const observables = [];

    // LIB: XCredit (main)
    observables.push(this.xCreditFacade.entityLoadeds$(this.nameInstance_main));

    // LIB: XProfileInfo
    observables.push(this.xProfileInfoFacade.loadeds$);

    return observables as Observable<{ [key: string]: boolean }>[];
  }

  protected override _xFacadesLoadesValidation(
    loadedsArr: { [key: string]: boolean }[],
  ): boolean {
    let isAllDataReady = false;

    // LIB: XCredit (main)
    let isXCreditAllDataReady_main = false;
    const xCredit_main = loadedsArr[0] as V1XCredit_Loadeds;
    isXCreditAllDataReady_main = this._xCreditRequestedData_main.every(
      (key) => !!xCredit_main[key],
    );
    if (this._xCreditRequestedData_main.length === 0) {
      isXCreditAllDataReady_main = false;
    }

    // LIB: XProfileInfo
    let isXProfileInfoAllDataReady = false;
    const xProfileInfo = loadedsArr[1] as V1XProfileInfo_Loadeds;
    isXProfileInfoAllDataReady = this._xProfileInfoRequestedData.every(
      (key) => !!xProfileInfo[key],
    );
    if (this._xProfileInfoRequestedData.length === 0) {
      isXProfileInfoAllDataReady = false;
    }

    // Check if all data is ready.
    if (isXCreditAllDataReady_main && isXProfileInfoAllDataReady) {
      isAllDataReady = true;
    }
    return isAllDataReady;
  }

  protected override _xFacadesAddErrorListeners(): void {
    // LIB: XCredit (main)
    this.xCreditFacade
      .entity$(this.nameInstance_main)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((state) => {
        // Emit the error messages if any.
        const emitError = (key: keyof V1XCredit_Datas) => {
          if (state.loadedLatest[key] && state.errors[key]) {
            // Don't emit the following errors (they are exceptions).
            if (state.errors[key] === 'USER_MISSING_DETAIL_DATA') {
              return;
            }

            // We're here? Then it means that we should emit the error!
            this.xOnError(
              {
                key: key,
                value: state.errors[key] as string,
              },
              'V1XCreditFacade',
              this.nameInstance_main,
            );
          }
        };

        // Loop through `_xCreditRequestedData_main` array to emit the error messages.
        this._xCreditRequestedData_main.forEach((key) => {
          emitError(key as keyof V1XCredit_Datas);
        });
      });

    // LIB: XProfileInfo
    this.xProfileInfoFacade.state$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((state) => {
        // Emit the error messages if any.
        const emitError = (key: keyof V1XProfileInfo_Datas) => {
          if (state.loadedLatest[key] && state.errors[key]) {
            // Don't emit the following errors (they are exceptions).
            if (state.errors[key] === 'BLAHBLAH') {
              return;
            }

            // We're here? Then it means that we should emit the error!
            this.xOnError(
              {
                key: key,
                value: state.errors[key] as string,
              },
              'V1XProfileInfoFacade',
            );
          }
        };

        // Loop through `_xProfileInfoRequestedData` array to emit the error messages.
        this._xProfileInfoRequestedData.forEach((key) => {
          emitError(key as keyof V1XProfileInfo_Datas);
        });
      });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Prepare & reset & fetch data functions                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xDataReset(): void {
    // LIB: XCredit (main)
    this._xCreditRequestedData_main = [];
    this.xCreditFacade.reset(this.nameInstance_main);

    // LIB: XProfileInfo
    this._xProfileInfoRequestedData = [];
    this.xProfileInfoFacade.reset();
  }

  protected override _xDataFetch(): void {
    // LIB: XCredit (main)
    this._xCreditRequestedData_main.push('detail');
    this.xCreditFacade.getDetail(
      this._baseUrl,
      this.userId(),
      this.nameInstance_main,
      this.nameThis,
    );

    // LIB: XProfileInfo
    this._xProfileInfoRequestedData.push('data');
    this.xProfileInfoFacade.getData(
      this._baseUrl,
      this.userId(),
      this.nameThis,
    );
  }
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

### `x-profile-info.component.html` file

`x-profile-info.component.ts` component's HTML template.

```html
<x-x-profile-info-v1
  [data]="$any((xProfileInfoFacade.datas$ | async)?.data)"
  [creditDetail]="
    $any((xCreditFacade.entityDatas$(nameInstance_main) | async)?.detail)
  "
  [icoInfo]="$any($dataConfigDep()?.assets?.libXprofileInfoIcoInfo)"
  [langCultureCode]="
    $any(translationsFacade.lastLoadedLangCultureCode$ | async)
  "
  [defaultStyle]="$any(xCreditFacade.lastSetStyle$ | async)"
  [showIcoInfo]="$any($dataConfigDep()?.libs?.xProfileInfoV1?.hasInfoIcon)"
  [showBg]="$any($dataConfigDep()?.libs?.xProfileInfoV1?.hasBg)"
  [showBtnReadMore]="showBtnReadMore()"
  (clickedReadMore)="clickedReadMore.emit()"
  (clickedStyle)="xCreditFacade.setStyle($event); clickedStyle.emit($event)"
></x-x-profile-info-v1>

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- Show an error if something happens in the 'data-access' lib             -->
<!-- /////////////////////////////////////////////////////////////////////// -->

@if ( showErrors() && ((xCreditFacade.entityHasError$(nameInstance_main) |
async) || (xProfileInfoFacade.hasError$ | async)) ) {
<x-popup-v1 *transloco="let t" [isHeadEnable]="true" [isOpen]="true">
  <div slot="head">
    <i class="bi bi-exclamation-triangle-fill mr-2"></i>
    <span class="font-semibold">{{ t('common.error') }}</span>
  </div>

  <div slot="body">
    <ng-lottie
      width="100%"
      height="180px"
      containerClass="e-ani"
      [options]="{
          path: (configFacade.dataConfigDep$ | async)?.assets?.gfxError,
          loop: false,
        }"
    ></ng-lottie>
    <p class="p m-6 text-center">
      {{ t('common.error_desc') }}

      <!-- xCreditFacade ///////////////////////////////////////////////// -->

      @if ((xCreditFacade.entityErrors$(nameInstance_main) | async)?.detail) {
      <small class="e-ecode">
        V1XCreditFacade({{ nameInstance_main }})/detail
      </small>
      }

      <!-- xProfileInfoFacade //////////////////////////////////////////// -->

      @if ((xProfileInfoFacade.errors$ | async)?.data) {
      <small class="e-ecode"> V1XProfileInfoFacade/data </small>
      }
    </p>
  </div>
</x-popup-v1>
}
```
