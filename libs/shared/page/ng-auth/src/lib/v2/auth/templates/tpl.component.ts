import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { exhaustMap, Subscription, take } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

import { V2BasePage_Error } from '@x/shared-util-ng-bases-model';
import { V2BasePageComponent } from '@x/shared-util-ng-bases';
import { V1CommunicationService } from '@x/shared-util-ng-services';
import {
  V1CapacitorCoreService,
  V1CapacitorCore_AppInfo,
} from '@x/shared-util-ng-capacitor';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';
import { V1TranslationsFacade } from '@x/shared-data-access-ng-translations';

import { V2Auth_Submit } from './tpl.interfaces';

/**
 * Base template of the authentication page.
 * Other templates will be extending this class.
 *
 * @export
 * @class V2AuthPageTplComponent
 * @typedef {V2AuthPageTplComponent}
 */
@Component({
  selector: 'x-auth-page-tpl-v2',
  standalone: true,
  template: '',
})
export class V2AuthPageTplComponent
  extends V2BasePageComponent
  implements OnDestroy
{
  /* General //////////////////////////////////////////////////////////////// */

  private readonly _langService = inject(TranslocoService);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);

  private _translationsSub!: Subscription;

  platform!: 'ios' | 'android' | 'desktop';
  nativeAppInfo: V1CapacitorCore_AppInfo | null = null;
  errors: V2BasePage_Error[] = [];
  private _hasRedirected = false;

  // The following is available when a 'method' component outputs `submitted`.
  whatUserEntered?: string;
  whatUrlToRedirect?: string;
  waitingType?: V2Auth_Submit['type'];

  // Content (screen) handling in HTML
  contentCurrIndex = 0;
  readonly content = ['welcome', 'waiting', 'contact'];
  isAuthCanceled = false; // Whenever `contentCurrIndex === 0`, it means that auth is canceled.

  hasAuthMagic = false;
  hasAuthBankid = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnDestroy(): void {
    if (this._translationsSub) this._translationsSub.unsubscribe();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPre(): void {
    super._xInitPre();

    // Understand what Auth methods are available from DEP config.
    this.hasAuthMagic = !!this._configDep.fun.auth.hasAuthMagic;
    this.hasAuthBankid = !!this._configDep.fun.auth.hasAuthBankid;

    // Get the platform type.
    this.platform = this._capacitorCoreService.getPlatform();

    // Get the native app info.
    this._capacitorCoreService.appGetInfo().then((info) => {
      this.nativeAppInfo = info;
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  private async _setAppLang() {
    // First fetch user ID. Why? Didn't we fetch in in the Base class in
    // `_xInitPre`? Nope! Because remember? We're in the Auth page, where user
    // is still not logged in to the app! So in the Base class, `_userId` is
    // still undefined... But now 'method' component `ready` output is emitted
    // and this function is called, we are sure that the user authentication is
    // completed successfully, so that we can fetch the user ID.
    this._authFacade.authState$.pipe(take(1)).subscribe((state) => {
      this._userId = state.datas.getToken?.userId as number;
    });

    await this._translationsFacade.getAllLangs(this._baseUrl);
    await this._translationsFacade.getSelectedLang(this._baseUrl, this._userId);

    // Listen for the translations state changes. And then redirect the user to
    // the dashboard page, whether the translations data is loaded successfully
    // or not.
    this._translationsSub =
      this._translationsFacade.translationsState$.subscribe((state) => {
        if (state.loadeds.selectedLang && state.loadeds.allLangs) {
          // If loaded successfully, set the language.
          if (state.datas.selectedLang && state.datas.allLangs) {
            this._lastLoadedLang = state.datas.selectedLang.id;
            this._langService.setAvailableLangs(state.datas.allLangs.codes);
            this._langService.setActiveLang(this._lastLoadedLang);
            this._langService
              .load(this._lastLoadedLang)
              .pipe(take(1))
              .subscribe();
          }

          // If there was an error, just log it... It doesn't stop the app.
          if (state.errors.selectedLang || state.errors.allLangs) {
            console.warn(
              '@V2AuthPageTplComponent/_setAppLang: Translations could not get loaded successfully.',
            );
          }

          // Now we're ready to redirect the user to the dashboard page.
          this._redirect();
          if (this._translationsSub) this._translationsSub.unsubscribe(); // Unsubscribe immediatly after redirecting... Because if we don't, then the next state changes call the redirect function multiple times...
        }
      });
  }

  private _redirect() {
    // get the routes URL Query Params.
    const params = this._route.snapshot.queryParams;
    const redirect = params['redirect'];

    // Understand where should we re-direct the user to.
    let page = this._protectedInitialPath; // Default page is the Dashboard page.
    if (redirect) page = redirect;

    // Now redirect.
    // NOTE: Why `replaceUrl: true`? Because in mobile, we're originally
    // redirecting via `ion-router-outlet` through pages.... And Ionic doesn't
    // kill pages (keeps pages in the DOM) when it's navigating between them
    // (to enable travel via the back/forward buttons). But here we wanna kill
    // the page.
    this._router.navigate([page], {
      queryParams: params,
      replaceUrl: true,
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Screen control                                                           */
  /* //////////////////////////////////////////////////////////////////////// */

  contentToNext() {
    if (this.contentCurrIndex < this.content.length - 1) {
      this.contentCurrIndex++;
    }
  }

  contentToPrev() {
    if (this.contentCurrIndex > 0) {
      this.contentCurrIndex--;
    }
  }

  contentTo(index: number) {
    if (index > this.content.length - 1) {
      this.contentCurrIndex = this.content.length - 1;
    } else if (index < 0) {
      this.contentCurrIndex = 0;
    } else {
      this.contentCurrIndex = index;
    }
  }

  onClickedBack(): void {
    this.contentToPrev(); // Switch to the previous content.

    if (this.contentCurrIndex === 0) {
      this.waitingType = undefined;
      this.isAuthCanceled = true;
    }
  }

  onCanceled(): void {
    // Go back to initial screen.
    this.waitingType = undefined;
    this.isAuthCanceled = true;
    this.contentTo(0);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Libs: Auth methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * When a 'feature' lib in this page throws an error (by its `hasError`
   * output), this function should be called (as the lib's output callback) to
   * save the error in the `errors` array to show it in HTML.
   *
   * @example
   * ```html
   * <!-- This is how we can call this function from the HTML of this page, when
   * a 'feature' lib throws an error. -->
   * <x-blahblah
   *   (hasError)="onError({page: 'parent', lib: 'blahblah', error: $event})"
   * ></x-blahblah>
   * ```
   *
   * @param {V2BasePage_Error} error
   */
  onError({
    page = 'parent',
    pageTemplate = 'classic',
    lib,
    libTemplate = undefined,
    error,
  }: V2BasePage_Error): void {
    // Go back to initial screen, because when a lib (one of the 'method'
    // components) throws an error, it cancels all of its operations and user
    // must start from the beginning.
    this.waitingType = undefined;
    this.isAuthCanceled = true;
    this.contentTo(0);

    // Add the error to the array to show in it HTML.
    this.errors.push({ page, pageTemplate, lib, libTemplate, error });
  }

  /**
   * When a 'method' component outputs `submitted`, this function should be
   * called (as the lib's output callback) to save the submitted data.
   *
   * @example
   * ```html
   * <x-method
   *   (submitted)="onSubmitted($event)"
   * ></x-method>
   * ```
   *
   * @param {V2BasePage_Error} error
   */
  onSubmitted(data: V2Auth_Submit): void {
    // Save what we received after user submit the login.
    this.waitingType = data.type;
    if (data.whatUserEntered) this.whatUserEntered = data.whatUserEntered;
    if (data.whatUrlToRedirect) this.whatUrlToRedirect = data.whatUrlToRedirect;

    // Change screen to waiting
    this.isAuthCanceled = false; // Now that login is submitted, reset this flag, if it was changed before.
    this.contentTo(1);
  }

  /**
   * When a 'method' component outputs `ready`, this function should be called
   * (as the lib's output callback).
   *
   * @example
   * ```html
   * <x-method
   *   (ready)="onReady()"
   * ></x-method>
   * ```
   */
  onReady(): void {
    this._setAppLang();
  }
}
