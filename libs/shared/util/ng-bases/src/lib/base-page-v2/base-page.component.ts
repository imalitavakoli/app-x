import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { exhaustMap, skip, Subscription, take } from 'rxjs';

import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-api-data-access-ng-config';
import { V1TranslationsFacade } from '@x/shared-api-data-access-ng-translations';
import { V1AuthFacade } from '@x/shared-api-data-access-ng-auth';

import { V1BaseFunComponent } from '../base-fun-v1/base-fun.component';

/**
 * Base class for 'page' components.
 *
 * Here's how the inherited classes use this (in most cases):
 * 01. Override `_xInitPreBeforeDom` (with super call right at the beginning).
 * 02. Override `_xHasRequiredInputs`.
 * 03. Override `_xInitPre` (with super call right at the beginning).
 * 04. Override `_xInit` (with super call right at the beginning).
 * 05. Override `_xUpdate` (with super call right at the beginning).
 * 06. Optional! In HTML, you can use `hasRequiredInputs`.
 * 07. Optional! In HTML, you can use `appVersion`.
 *
 * @export
 * @class V2BasePageComponent
 * @typedef {V2BasePageComponent}
 */
@Component({
  selector: 'x-page-base-v2',
  standalone: true,
  template: '',
})
export class V2BasePageComponent extends V1BaseFunComponent {
  /* General //////////////////////////////////////////////////////////////// */

  protected readonly _route = inject(ActivatedRoute);
  protected readonly _router = inject(Router);

  // 'data-access' libs
  readonly configFacade = inject(V2ConfigFacade);
  protected readonly _translationsFacade = inject(V1TranslationsFacade);
  protected readonly _authFacade = inject(V1AuthFacade);

  // Flags
  hasRequiredInputs = false;

  // Fetched data from route
  appVersion?: string;

  // Fetched data from 'data-access' libs
  protected _configDep!: V2Config_MapDep;
  protected _baseUrl!: string;
  protected _lastLoadedLang!: string;
  protected _userId!: number;
  protected _protectedInitialPath!: string;

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Take care of fetching some data such as `_baseUrl`, `_lastLoadedLang`,
   * `_userId`, and etc. Also subscribe to the route query params to understand
   * when all required URL Query Params (inputs) are defined...
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInitPre(): void {
    super._xInitPre();

    // NOTE: Rxjs take(1) and first() operators are synchronous, so we can
    // immediatly use the extracted data from the subscription right after it.

    // Get the app version from the route snapshot (if it's already provided)!
    // NOTE: It can provided by `app.routes.ts` file of the app.
    this._route.data.pipe(take(1)).subscribe((data) => {
      if (data['appVersion']) this.appVersion = data['appVersion'];
    });

    // Get all initial required data from 'data-access' libs.
    this.configFacade.configState$
      .pipe(
        take(1),
        exhaustMap((state) => {
          // Save required data.
          this._configDep = state.dataConfigDep as V2Config_MapDep;
          this._baseUrl = state.dataConfigDep?.general.baseUrl as string;

          // Switch to the `translationsState$` Observable.
          return this._translationsFacade.translationsState$;
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
        this._protectedInitialPath = state.protectedInitialPath;
      });

    // Subscribe to the route query params to understand when all required
    // URL Query Params (inputs) are defined...
    this._route.queryParams
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params) => {
        // Continue ONLY IF all required URL Query Params are defined.
        if (!this._xHasRequiredInputs()) return;

        // Now that all required inputs are already defined, init, if we didn't before!
        if (!this._isXInit) this._xInit();

        // Now that all required inputs are already defined, update.
        this._xUpdate();
      });
  }

  /**
   * Set the `hasRequiredInputs` flag to true. This flag can be useful in HTML
   * to determine if all required URL Query Params (inputs) for the page to
   * function correctly are already available or not, so the page can initialize
   * its libs (even the starter libs) and start showing its content.
   *
   * @inheritdoc
   * @protected
   */
  protected override _xInit(): void {
    super._xInit();

    // If we're here, it means that `_xHasRequiredInputs` returned true, and all
    // required URL Query Params for the page to show its content are available.
    // NOTE: As this flag determines that everything is ready for the page to
    // start initializing its libs (even the starter libs), maybe it can be
    // useful in HTML.
    this.hasRequiredInputs = true;
  }

  /**
   * A callback method that is invoked once ALL required inputs are defined
   * (i.e., when `_xHasRequiredInputs` returns true) & each time an inputs is
   * changed.
   *
   * **Who calls it?** `_xInitPre` when route params change.
   *
   * **Useful for?** Updating... i.e., reacting based on each input change with
   * the help of `_xIsInputChanged`.
   *
   * @protected
   */
  protected override _xUpdate(): void {
    super._xUpdate();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Check if ALL required URL Query Params (inputs) for the page to function
   * correctly are already available or not (by checking route snapshot). This
   * function is called at the initialization phase, and each time a URL Query
   * Param (input) changes.
   *
   * NOTE: In this Base class, we're just simply returning true. But child
   * classes should override this function according to their own inputs. Don't
   * have any required inputs? Then you don't need to override this function!
   *
   * @protected
   * @returns {boolean}
   */
  protected override _xHasRequiredInputs(): boolean {
    return true;
  }
}
