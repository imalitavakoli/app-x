# 'ng-x-profile-info' functionality 'feature' lib samples

Here we share the sample files of a functionality called 'ng-x-profile-info', just for you as a source of inspiration.

## `x-profile-info.component.ts` file

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
