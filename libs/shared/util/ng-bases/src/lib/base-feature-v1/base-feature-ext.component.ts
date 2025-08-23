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
import {
  combineLatest,
  exhaustMap,
  map,
  Observable,
  of,
  Subscription,
  take,
} from 'rxjs';

import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-api-data-access-ng-config';
import { V1TranslationsFacade } from '@x/shared-api-data-access-ng-translations';
import { V1AuthFacade } from '@x/shared-api-data-access-ng-auth';

import { V1BaseFeatureComponent } from './base-feature.component';

/**
 * Base class for all 'feature' components (extended version which takes care of
 * fetching some data in `_xDataPre` function).
 *
 * NOTE: This Base class is useful for the times that we wanna deal with
 * multiple 'data-access' libs. As it already takes care of fetching some
 * required data that almost all 'data-access' libs need (such as BaseURL), this
 * Base class is an easier choice compared to `V1BaseFeatureComponent` Base.
 *
 * Here's how the inherited classes use this (in most cases):
 * 01. Override `_xInitPreBeforeDom` (with super call right at the beginning).
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `_xFacadesPre`.
 * 04. Override `_xFacadesLoadesValidation`.
 * 05. Override `_xFacadesAddErrorListeners`. You may use `_xOnError` inside of
 *     this function. And you may save your subscriptions (listeners) in
 *     private variables, so you can unsubscribe from them in `ngOnDestroy`.
 * 06. Override `_xDataReset`. Here's the place, where You may set the 'ui'
 *     lib's `state` input to 'loading'.
 * 07. Override `_xDataFetch`.
 * 08. Override `_xInitOrUpdateAfterAllDataReady` (with super call right at the
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
 * @class V1BaseFeatureExtComponent
 * @typedef {V1BaseFeatureExtComponent}
 */
@Component({
  selector: 'x-feature-base-ext-v1',
  standalone: true,
  template: '',
})
export class V1BaseFeatureExtComponent extends V1BaseFeatureComponent {
  /* General //////////////////////////////////////////////////////////////// */

  // 'data-access' libs
  readonly configFacade = inject(V2ConfigFacade);
  readonly translationsFacade = inject(V1TranslationsFacade);
  protected readonly _authFacade = inject(V1AuthFacade);

  // Fetched data from 'data-access' libs
  protected _configDep!: V2Config_MapDep;
  protected _baseUrl!: string;
  protected _lastLoadedLang!: string;
  protected _userId!: number;

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Prepare & reset & fetch data functions                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Take care of fetching some data such as `_baseUrl`, `_lastLoadedLang`,
   * `_userId`, and etc.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xDataPre(): void {
    // NOTE: Rxjs take(1) and first() operators are synchronous, so we can
    // immediatly use the extracted data from the subscription right after it.
    this.configFacade.configState$
      .pipe(
        take(1),
        exhaustMap((state) => {
          // Save required data.
          this._configDep = state.dataConfigDep as V2Config_MapDep;
          this._baseUrl = state.dataConfigDep?.general.baseUrl as string;

          // Switch to the `translationsState$` Observable.
          return this.translationsFacade.translationsState$;
        }),
        take(1),
        exhaustMap((state) => {
          // Save required data.
          this._lastLoadedLang = state.lastLoadedLangCultureCode as string;

          // Switch to the `authState$` Observable.
          return this._authFacade.authState$;
        }),
        take(1),
      )
      .subscribe((state) => {
        // Save required data.
        this._userId = state.datas.getToken?.userId as number;
      });
  }
}
