import { Component, inject, signal } from '@angular/core';
import { exhaustMap, take } from 'rxjs';

import { V2BaseFeature_ExtHasIt } from '@x/shared-util-ng-bases-model';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-api-data-access-ng-config';
import { V1TranslationsFacade } from '@x/shared-api-data-access-ng-translations';
import { V1AuthFacade } from '@x/shared-api-data-access-ng-auth';
import { Router } from '@angular/router';

import { V2BaseFeatureComponent } from '@x/shared-util-ng-bases';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Base class for all 'feature' components (the extended version which takes
 * care of fetching common prerequisite data in `_xDataPre`).
 *
 * This extends `V2BaseFeatureComponent` to add automatic pre-fetching of
 * BaseURL, language, and userId so that child classes don't need to do it
 * themselves.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHEN TO USE THIS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Use this base when your 'feature' component needs to interact with
 * one or more 'data-access' libs that require `_baseUrl`, `_userId`,
 * or `_configDep`. This class fetches all of them automatically in
 * `_xDataPre`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO INHERIT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 01. Override `_xInitPreBeforeDom` (with super call).
 *     → Config TTLs (for cache-aware data-access libs) AND create instances
 *       (for multi-instance data-access libs) BEFORE the DOM is initialized.
 *
 * 02. Override `_xHasRequiredInputs` (with super call).
 *     → Read ALL signal inputs (for tracking) and return `false` if
 *       any required input is missing.
 *
 * 03. Override `_xFacadesPre`.
 *     → Return an array of facade `loadeds$` Observables.
 *       If you have dependent data, return ONLY the independent
 *       facade Observables here.
 *
 * 04. Override `_xFacadesLoadesValidation`.
 *     → Check `loadedsArr` to determine if all requested independent
 *       API calls have completed.
 *
 * 05. Override `_xFacadesAddErrorListeners`.
 *     → Subscribe to facade state to detect errors and emit them via
 *       `xOnError`.
 *
 * 06. Override `_xDataReset`.
 *     → Reset 'requested API calls arrays' and facade state.
 *
 * 07. Override `_xDataFetch`.
 *     → Fetch independent data only.
 *
 * 08. Override `_xBuildDependencyChain$` (only if you have dependent
 *     API calls).
 *     → Return an Observable that chains dependent API calls.
 *
 * 09. Override `_xInitOrUpdateAfterAllDataReady` (with super call).
 *     → Called once ALL data (independent AND dependent) is ready.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS CLASS PROVIDES AUTOMATICALLY
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The following are fetched in `_xDataPre` (called before
 * `_xDataFetch`), so they are available in all subsequent methods:
 *
 * - `_configDep`         — DEP configuration object
 * - `_baseUrl`           — API base URL from DEP config
 * - `$lastLoadedLang`    — Language culture code signal
 * - `_userId`            — User ID from Auth 'data-access' lib
 * - `configFacade`       — Config facade instance
 * - `translationsFacade` — Translations facade instance
 * - `_authFacade`        — Auth facade instance
 * - `_router`            — Angular Router (optional injection)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW THE 'PAGE' LIB INTERACTS WITH THIS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 01. The lib initializes this component in its HTML.
 * 02. The lib provides this component's required inputs.
 * 03. The lib listens to `hasError` output to see if any error occurs
 *     in this component while fetching data from a 'data-access' lib,
 *     and it can show the error message to the user.
 * 04. Optional! The lib listens to `ready` or `allDataIsReady`
 *     outputs.
 *
 * @export
 * @class V2BaseFeatureExtComponent
 * @typedef {V2BaseFeatureExtComponent}
 */
@Component({
  selector: 'x-feature-base-ext-v2',
  standalone: true,
  template: '',
})
export abstract class V2BaseFeatureExtComponent
  extends V2BaseFeatureComponent
  implements V2BaseFeature_ExtHasIt
{
  /* General //////////////////////////////////////////////////////////////// */

  protected readonly _router = inject(Router);

  // 'data-access' libs
  readonly configFacade = inject(V2ConfigFacade);
  /** DEP config. */
  $dataConfigDep = toSignal(this.configFacade.dataConfigDep$);
  readonly translationsFacade = inject(V1TranslationsFacade);
  protected readonly _authFacade = inject(V1AuthFacade);

  // Fetched data from 'data-access' libs
  $lastLoadedLang = signal<string>(null as unknown as string);
  protected _configDep!: V2Config_MapDep;
  protected _baseUrl!: string;
  protected _userId!: number;

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Helper to resolve the active route path for Firebase/GA4 analytics.
   * e.g., returns 'topup', 'home', 'settings'.
   *
   * @protected
   */
  protected _xGetEntryPoint(): string {
    if (!this._router) return '';
    return this._router.url.split('?')[0].replace(/^\//, '');
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Prepare & reset & fetch data functions                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   *
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
          this.$lastLoadedLang.set(state.lastLoadedLangCultureCode as string);

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
