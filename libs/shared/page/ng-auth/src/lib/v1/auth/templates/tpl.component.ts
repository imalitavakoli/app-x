import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { exhaustMap, Subscription, take } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { V1CommunicationService } from '@x/shared-util-ng-services';
import {
  V1CapacitorCoreService,
  V1CapacitorCore_AppInfo,
} from '@x/shared-util-ng-capacitor';

import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';
import { V1TranslationsFacade } from '@x/shared-data-access-ng-translations';

import {
  V1AuthPageTplEvent,
  V1AuthPageTplError,
  V1AuthPageContentWaiting,
} from './tpl.interfaces';

/**
 * Base template of the authentication page.
 * Other templates will be extending this class.
 *
 * Here we do the following:
 * 1. Get the required data from DEP config.
 * 2. Listen to the following events that are emitted by the child templates via
 *    `V1CommunicationService`: `error`, `changeByUser`, `changeByLogic`. By
 *    listening to these events, we're actually handling the HTML views.
 * 3. Listen to the authentication state changes. We're only interested in
 *    `getToken`.
 * 4. As soon as we have the authentication token, we call `_initAfterAuth` to
 *    to set the app's language and redirect the user to the Dashboard page.
 *
 * @export
 * @class AuthTplComponent
 * @typedef {AuthTplComponent}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'x-auth-page-tpl-v1',
  standalone: true,
  template: '',
})
export class V1AuthPageTplComponent implements OnInit, OnDestroy {
  protected readonly _router = inject(Router);
  protected readonly _route = inject(ActivatedRoute);
  private readonly _langService = inject(TranslocoService);
  protected readonly _communicationService = inject(V1CommunicationService);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);

  readonly configFacade = inject(V2ConfigFacade);
  readonly authFacade = inject(V1AuthFacade);
  private readonly _translationsFacade = inject(V1TranslationsFacade);

  private _communicationSub!: Subscription;
  private _authSub01!: Subscription;
  private _translationsSub!: Subscription;
  tplErrors: V1AuthPageTplError[] = [];

  authenticated = false; // Defines whether the user is authenticated or not.

  nativeAppInfo: V1CapacitorCore_AppInfo | null = null;
  appVersion!: string;
  protected _baseUrl!: string;
  protected _protectedInitialPath!: string;
  protected _lang!: string;
  protected _userId!: number;

  hasAuthMagic = false;
  hasAuthBankid = false;

  contentCurrIndex = 0;
  readonly content = ['welcome', 'waiting', 'contact', 'secret'];
  contentWaitingType?: V1AuthPageContentWaiting;
  whatUserEntered?: string;
  whatUrlToRedirect?: string;
  platform!: 'ios' | 'android' | 'desktop';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    // Get the app version from the route snapshot! It is provided by
    // `app.routes.ts` file of the app.
    this._route.data.pipe(take(1)).subscribe((data) => {
      this.appVersion = data['appVersion'] || '';
    });

    // Listen to some Observables to get the required data.
    this.configFacade.dataConfigDep$
      .pipe(
        take(1),
        exhaustMap((data) => {
          data = data as V2Config_MapDep;

          // Save required data.
          this._baseUrl = data.general.baseUrl;
          this.hasAuthMagic = !!data.fun.auth.hasAuthMagic;
          this.hasAuthBankid = !!data.fun.auth.hasAuthBankid;

          // Switch to the `authState$` Observable.
          return this.authFacade.authState$;
        }),
        take(1),
        exhaustMap((state) => {
          // Save required data.
          this._protectedInitialPath = state.protectedInitialPath;

          // Switch to the `lastLoadedLangCultureCode$` Observable.
          return this._translationsFacade.lastLoadedLangCultureCode$;
        }),
        take(1),
      )
      .subscribe((lang) => {
        // Save required data.
        this._lang = lang as string;

        // Init the component.
        this._initPre();
        this._init();
      });
  }

  /**
   * Here we can initialize a service or something (e.g., keep listenting to the
   * page URL query params ) or something that we need to do before doing
   * anything else.
   *
   * @protected
   */
  protected _initPre(): void {
    // Listen to the events that templates may emit.
    this._communicationSub =
      this._communicationService.changeEmitted$.subscribe(
        (action: V1AuthPageTplEvent) => {
          // `error` events.
          if (action.eventType === 'error') {
            const eValue = action.eventValue as V1AuthPageTplError;
            this.onError(
              eValue.lib,
              { key: eValue.key, value: eValue.value },
              eValue.template,
            );
          }

          // `changeByUser` events.
          if (action.eventType === 'changeByUser') {
            // Clicking the login button event.
            if (action.eventName === 'onSubmitLogin') {
              if (action.eventValue.input) {
                this.whatUserEntered = action.eventValue.input;
              }
              if (action.eventValue.url) {
                this.whatUrlToRedirect = action.eventValue.url;
              }
              const eValue = action.eventValue
                .loginType as V1AuthPageContentWaiting;
              if (eValue === 'email') this.contentWaitingType = 'email';
              else if (eValue === 'bankid') this.contentWaitingType = 'bankid';
              else this.contentWaitingType = undefined;
              this.contentToNext();
            }
            // Clicking the back button event.
            if (action.eventName === 'onClickBack') {
              // NOTE: When this event is emitted (from HTML), ONE of the
              // following functions will be called with it to navigate the view
              // to the previous content: `contentTo`, `contentToPrev`.
              const currIndex = action.eventValue as number;
              if (currIndex === 0) {
                this.contentWaitingType = undefined;
              }
            }
          }

          // `changeByLogic` events.
          if (action.eventType === 'changeByLogic') {
            // Auth error event.
            if (action.eventName === 'onAuthError') {
              this.contentWaitingType = undefined;
              this.contentTo(0);
            }
          }
        },
      );

    // Save the required data to `communicationService` for templates.
    this._communicationService.storedData = {
      ...this._communicationService.storedData,
      appVersion: this.appVersion,
    };

    // Listen to the authentication state changes.
    this._authSub01 = this.authFacade.authState$.subscribe((state) => {
      // If the user is authenticated.
      if (state.loadedLatest.getToken && state.datas.getToken) {
        this._userId = state.datas.getToken.userId;
        this.authenticated = true;
        this._initAfterAuth();
        this._authSub01.unsubscribe(); // Unsubscribe after the user is authenticated, because we don't need this anymore.
      }
    });

    // Get the platform type.
    this.platform = this._capacitorCoreService.getPlatform();

    // Get the native app info.
    this._capacitorCoreService.appGetInfo().then((info) => {
      this.nativeAppInfo = info;
    });
  }

  /**
   * Let's do some stuff EVEN BEFORE the user is logged in.
   *
   * @protected
   */
  protected _init(): void {
    // ...
  }

  /**
   * Let's do some stuff after the user is logged in.
   *
   * @protected
   */
  protected _initAfterAuth() {
    this._setAppLang();
  }

  ngOnDestroy(): void {
    if (this._communicationSub) this._communicationSub.unsubscribe();
    if (this._authSub01) this._authSub01.unsubscribe();
    if (this._translationsSub) this._translationsSub.unsubscribe();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  private async _setAppLang() {
    // Now that she is logged in, we can fetch what was her already desired
    // language from server, and load that language's translations for the app.
    // NOTE: Why the function should be `async`? Maybe there's a bug in NgRx!
    // Because the Reducer sets `loadeds` properties to `undefined`, and as we
    // know, Reducers are synchronous! ONLY after calling the below methods,
    // we're subscribing to the state changes... But the Reducer is not doing
    // its job synchronously! That's why we need to wait here, and then when
    // Action is dispatched and Reducer modified the state object, only then
    // we continue the function to subscribe...
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
            this._lang = state.datas.selectedLang.id;
            this._langService.setAvailableLangs(state.datas.allLangs.codes);
            this._langService.setActiveLang(this._lang);
            this._langService.load(this._lang).pipe(take(1)).subscribe();
          }

          // If there was an error, just log it... It doesn't stop the app.
          if (state.errors.selectedLang || state.errors.allLangs) {
            console.warn(
              '@V1AuthPageTplComponent/_setAppLang: Translations could not get loaded successfully.',
            );
          }

          // redirect the user to the dashboard page.
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

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  onError(
    lib: string,
    err: { key: string; value: string },
    template: V1AuthPageTplError['template'] = 'classic',
  ) {
    const error: V1AuthPageTplError = {
      template: template,
      lib: lib,
      key: err.key,
      value: err.value,
    };
    this.tplErrors.push(error);
  }
}
