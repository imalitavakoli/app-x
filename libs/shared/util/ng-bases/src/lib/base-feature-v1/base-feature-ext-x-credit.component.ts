import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  combineLatest,
  exhaustMap,
  map,
  Observable,
  of,
  Subscription,
  take,
} from 'rxjs';

import {
  V1XCredit_Datas,
  V1XCredit_Loadeds,
  V1XCreditFacade,
} from '@x/shared-api-data-access-ng-x-credit';

import { V1BaseFeatureExtComponent } from './base-feature-ext.component';

/**
 * Base class for all 'feature' components (extended-x-credit version).
 *
 * NOTE: This Base class is useful for the times that we wanna deal ONLY with
 * XCredit 'data-access' lib and we ONLY need to create ONE instance inside of
 * its state object for our 'feature' lib. As it already takes care of
 * validating XCredit facade API calls and also emitting its probable errors,
 * this Base class is an easier choice compared to other 'feature' Bases. If you
 * need multiple instances, then `V1BaseFeatureExtComponent` Base is a better
 * choice.
 *
 * Here's how the inherited classes use this (in most cases):
 * 01. Override `nameInstance_main` and set it to your component's class name.
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `_xDataReset`. (with super call right at the beginning). Here's
 *     the place, where You may set the 'ui' lib's `state` input to 'loading'.
 * 04. Override `_xDataFetch`.
 * 05. Override `_xInitOrUpdateAfterAllDataReady` (with super call right at the
 *     beginning). Here's the place, where You may set the 'ui' lib's `state`
 *     input to to other states, according to the fetched data. You may also
 *     change its `dataType` input to the type that explains the fetched data
 *     the best.
 *
 * Here's how the 'page' lib interacts with this:
 * 01. The lib initializes this component in its HTML.
 * 02. The lib provides this component's required inputs.
 * 03. The lib listens to `hasError` output to see if any error occurs in this
 *     component while fetching data from a 'data-access' lib, and it can show
 *     the error message to the user.
 * 04. Optional! The lib listens to `ready` or `allDataIsReady` outputs.
 *
 * @export
 * @class V1BaseFeatureExtXCreditComponent
 * @typedef {V1BaseFeatureExtXCreditComponent}
 */
@Component({
  selector: 'x-feature-base-ext-x-credit-v1',
  standalone: true,
  template: '',
})
export class V1BaseFeatureExtXCreditComponent extends V1BaseFeatureExtComponent {
  /* General //////////////////////////////////////////////////////////////// */

  // 'data-access' libs
  readonly xCreditFacade = inject(V1XCreditFacade);
  // readonly configFacade = inject(V2ConfigFacade); // Introduced in the Base.
  // readonly translationsFacade = inject(V1TranslationsFacade); // Introduced in the Base.
  // protected readonly _authFacade = inject(V1AuthFacade); // Introduced in the Base.

  // Fetched data from 'data-access' libs
  // protected _configDep!: V2Config_MapDep; // Introduced in the Base.
  // protected _baseUrl!: string; // Introduced in the Base.
  // protected _lastLoadedLang!: string; // Introduced in the Base.
  // protected _userId!: number; // Introduced in the Base.

  // 'data-access' libs' requested data arrays
  protected _xCreditRequestedData_main: (keyof V1XCredit_Datas)[] = [];

  /* Inherited children components related ////////////////////////////////// */

  /**
   * The name of the component class.
   * NOTE: It will be used if we're initializing the 'data-access' XCredit
   * lib... In order to do that, we need to create a new instance of the state
   * object with the component name as its ID.
   */
  readonly nameInstance_main: string = 'V1BaseFeatureExtXCreditComponent_main';

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * @inheritdoc
   * @protected
   */
  protected override _xInitPreBeforeDom(): void {
    // LIB: XCredit (main)
    this.xCreditFacade.createIfNotExists(this.nameInstance_main);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X facades functions                                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * @inheritdoc
   * @protected
   * @returns {Observable<{ [key: string]: boolean }>[]}
   */
  protected override _xFacadesPre(): Observable<{ [key: string]: boolean }>[] {
    const observables = [];

    // LIB: XCredit (main)
    observables.push(this.xCreditFacade.entityLoadeds$(this.nameInstance_main));

    return observables as Observable<{ [key: string]: boolean }>[];
  }

  /**
   * @inheritdoc
   * @protected
   * @param {{ [key: string]: boolean }[]} loadedsArr
   * @returns {boolean}
   */
  protected override _xFacadesLoadesValidation(
    loadedsArr: { [key: string]: boolean }[],
  ): boolean {
    let isAllDataReady = false;

    // LIB: XCredit (main)
    let isXCreditAllDataReady_main = false;
    const xCredit_main = loadedsArr[0] as V1XCredit_Loadeds; // In `_xFacadesPre` we already defined the order of the observables in the array that it returns... So we know that `loadedsArr` is also in the same order.
    isXCreditAllDataReady_main = this._xCreditRequestedData_main.every(
      (key) => !!xCredit_main[key],
    );
    if (this._xCreditRequestedData_main.length === 0) {
      isXCreditAllDataReady_main = false;
    }

    // Check if all data is ready.
    if (isXCreditAllDataReady_main) {
      isAllDataReady = true;
    }
    return isAllDataReady;
  }

  /**
   * @inheritdoc
   * @protected
   */
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
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Prepare & reset & fetch data functions                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * @inheritdoc
   * @protected
   */
  protected override _xDataReset(): void {
    // LIB: XCredit (main)
    this._xCreditRequestedData_main = [];
    this.xCreditFacade.reset(this.nameInstance_main);
  }
}
