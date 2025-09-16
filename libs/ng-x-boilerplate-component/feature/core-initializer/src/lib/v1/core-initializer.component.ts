import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import { Subscription, exhaustMap, filter, of, take } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1TrackingService } from '@x/shared-util-ng-services';
import {
  v1LocalWebcomSet,
  v1LocalWebcomGetAllErrors,
  v1LocalWebcomSetOneError,
  v1LocalWebcomClearAllErrors,
} from '@x/shared-util-local-storage';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import {
  V1Translations_State,
  V1TranslationsFacade,
  V1Translations_Errors,
} from '@x/shared-data-access-ng-translations';
import { V1Auth_State, V1AuthFacade } from '@x/shared-data-access-ng-auth';
import { WebcomErrorKey } from './core-initializer.interfaces';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/ng-x-boilerplate-component/src/environments/environment';

/**
 * This is the Core Initializer component.
 *
 * @export
 * @class V1CoreInitializerComponent
 * @typedef {V1CoreInitializerComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'x-core-initializer-v1',
  standalone: true,
  imports: [V1PopupComponent],
  templateUrl: './core-initializer.component.html',
  styleUrls: ['./core-initializer.component.scss'],
})
export class V1CoreInitializerComponent
  implements OnInit, OnChanges, OnDestroy
{
  private readonly _configFacade = inject(V2ConfigFacade);
  private readonly _translationsFacade = inject(V1TranslationsFacade);
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _langService = inject(TranslocoService);
  private readonly _trackingService = inject(V1TrackingService);

  private _authSub!: Subscription;
  private _translationsSub!: Subscription;
  private _readerInterval!: ReturnType<typeof setInterval>;

  /**
   * The API public URLs that we need to call to make our app work. Why this
   * variable is hard-coded? Because there's no need to set it as an input! The
   * public URLs that our app needs to deal with, are part of the main app's
   * functionality and cannot change... We actually use this variable for the
   * auth lib later in our codes here.
   *
   * @type {string[]}
   */
  private readonly _apiPublicUrls: string[] = [];

  private _baseUrl!: string;
  private _clientId!: number;
  private _userId?: number; // It will be `undefined` when user logs out.
  private _lastLoadedLang!: string;

  errors: { key: string; value: string }[] = [];

  private _appVersion = environment.version;
  private _isAuthInProgress = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * If 'true', then the web-com will handle showing error messages in the UI.
   * If 'false', then the web-com will NOT handle showing error messages in the
   * UI, and it's up to the app to take advantage of `hasError` output and show
   * error messages.
   *
   * @type {boolean}
   */
  @Input() showErrors: 'true' | 'false' = 'true';

  /**
   * If 'true', then all initialized web-coms will track the user's activities
   * (such as sending Firebase Analytics events).
   * If 'false', then no activity will be tracked.
   *
   * @type {boolean}
   */
  @Input() trackActivity: 'true' | 'false' = 'false';

  /**
   * If 'undefined' is provided, the initializer web-component logs the user
   * out.
   *
   * @type {?string}
   */
  @Input() ticketId?: string;

  @Input() lang?: string;

  @Output() hasError = new EventEmitter<{ key: string; value: string }>();
  @Output() authenticated = new EventEmitter<boolean>();
  @Output() langChanged = new EventEmitter<string>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    this._configFacade.configState$
      .pipe(
        take(1),
        exhaustMap((state) => {
          // If data was NOT truthy, just return.
          if (!state.dataConfigDep) {
            return of(false);
          }

          // Save required data.
          this._baseUrl = state.dataConfigDep.general.baseUrl;
          this._clientId = state.dataConfigDep.general.clientId;

          // Switch to the `translationsState$` Observable.
          return this._translationsFacade.translationsState$;
        }),
        take(1),
        filter((state) => {
          // Don't continue, if the above `exhaustMap` operation was halted.
          if (state === false) {
            this._dispatchError(
              'initializer-config',
              'Config could not be loaded!',
            );
            return false;
          }
          return true;
        }),
        exhaustMap((state) => {
          state = state as V1Translations_State;

          // If translations data was NOT truthy, just return.
          if (!state.datas.translations) {
            return of(false);
          }

          // Save required data.
          this._lastLoadedLang = state.lastLoadedLangCultureCode as string;

          // Define some initial config for the auth lib.
          this._authFacade.setPublicUrls(this._apiPublicUrls);
          this._authFacade.checkIfAlreadyLoggedin();

          // Switch to the `authState$` Observable.
          return this._authFacade.authState$;
        }),
        take(1),
        filter((state) => {
          // Don't continue, if the above `exhaustMap` operation was halted.
          if (state === false) {
            this._dispatchError(
              'initializer-translations',
              'Translations could not be loaded!',
            );
            return false;
          }
          return true;
        }),
      )
      .subscribe((state) => {
        state = state as V1Auth_State;

        // Save required data.
        if (state.datas?.getToken?.userId) {
          this._userId = state.datas.getToken.userId;
        }

        // If we're here, it means that DEP config & translations are already
        // loaded via `app-initializer.service.ts` file (whether this core
        // component is used as a web-component or not)! So, we can now start
        // the actual initialization of the core component.
        this._init();
      });

    // Start the component LocalStorage reader interval.
    this._startReaderInterval();
  }

  private _init() {
    // Helper function to continue the login process by defining the lang. If
    // `lang` input is defined right at the initialization, then let's
    // prioritize it over the user's desired lang on server.
    const getOrSetLang = () => {
      if (this.lang) {
        this._dispatchActionsForLang();
      } else {
        this._translationsFacade.getSelectedLang(
          this._baseUrl,
          this._userId as number,
        );
      }
    };

    // Helper function to change the lang.
    const changeLang = (cultureCode: string, cultureLabel: string) => {
      if (this._lastLoadedLang === cultureCode) return; // If the new lang is the same as the last loaded lang, then return.
      this._lastLoadedLang = cultureCode; // Save the new lang.

      // Change app lang.
      this._langService.setAvailableLangs([
        { id: cultureCode, label: cultureLabel },
      ]);
      this._langService.setActiveLang(cultureCode);
      this._langService.load(cultureCode).pipe(take(1)).subscribe();
    };

    // Helper function to emit the `authenticated` event.
    const emitAuthenticated = () => {
      this._initAfterAuth(); // Let's do more configs after the user is authenticated.

      this.authenticated.emit(true);
      v1LocalWebcomSet('initializer', 'authenticated', true);
      this._isAuthInProgress = false;
    };

    // Start listening to `authState$` changes.
    this._authSub = this._authFacade.authState$.subscribe((state) => {
      // Save required data & continue defining the lang.
      if (state.loadedLatest.getToken && state.datas.getToken) {
        this._userId = state.datas.getToken.userId;
        this._isAuthInProgress = true;
        getOrSetLang();
      }

      // When `ticketId === 'undefined'`, we log the user out, and then this IF
      // statment will happen.
      if (!state.datas.getToken) {
        this._userId = undefined;

        this.authenticated.emit(false);
        v1LocalWebcomSet('initializer', 'authenticated', false);
      }

      // Dispatch errors.
      if (state.loadedLatest.getToken && state.errors.getToken) {
        this._dispatchError('initializer-getToken', state.errors.getToken);
      }
    });

    // Start listening to `translationsState$` changes.
    this._translationsSub =
      this._translationsFacade.translationsState$.subscribe((state) => {
        // Dispatch actions & change lang.
        if (state.loadedLatest.selectedLang && state.datas.selectedLang) {
          const cultureCode = state.datas.selectedLang.id;
          const cultureLabel = state.datas.selectedLang.label;

          // Change the app lang.
          changeLang(cultureCode, cultureLabel);

          // NOTE: Emit the `langChanged` event ONLY IF the `lang` input is
          // already defined! Why? Because we will be here right after user's
          // authentication as well... But at that time, we're here because we
          // only wanted to GET the user's desired lang on server... NOT
          // SETTING it! We MUST only emit the `langChanged` event when the
          // `lang` input is defined.
          if (this.lang) {
            this.langChanged.emit(cultureCode);
            v1LocalWebcomSet('initializer', 'langChanged', cultureCode);

            // Reset the `lang` input. Why? Because if client log the user out
            // and want to log her in again... If we won't reset `lang` input
            // here, then the `langChanged` event will be emitted again, and
            // that's not what we want.
            this.lang = undefined;
          }

          // Emit the `authenticated` event IF auth is in progress.
          if (this._isAuthInProgress) emitAuthenticated();
        }

        // Dispatch errors.
        const emitError = (
          key: keyof V1Translations_Errors,
          keyWithPrefix: WebcomErrorKey,
        ) => {
          if (state.loadedLatest[key] && state.errors[key]) {
            this._dispatchError(keyWithPrefix, state.errors[key] as string);
          }
        };
        emitError('translations', 'initializer-translations');
        emitError('selectedLang', 'initializer-selectedLang');
      });

    // Startup the component by dispatching the actions that MUST be called
    // right after the initialization, ONLY IF all requirements are also defined.
    if (!this._isRequirementsDefined()) return;
    this._dispatchActionsForTicketId(); // If we already have the ticketId, then fetch the token (no matter user is already logged in or not).
  }

  /**
   * Let's do more configuration after the user is authenticated.
   *
   * @private
   */
  private _initAfterAuth() {
    // Let's initialize the Tracking Service if `trackActivity` input is defined.
    if (this.trackActivity === 'true') {
      this._trackingService.prepare(environment.version);
      this._trackingService.initOrUpdate(['feedbacks', 'analytics']);
    }
  }

  ngOnChanges(changes?: SimpleChanges): void {
    // Helper function to check if a specific input has changed.
    const isInputChanged = (param: string): boolean => {
      if (!changes) return false;
      if (!changes[param]) return false;
      const prevValue = changes[param].previousValue;
      const currValue = changes[param].currentValue;
      if (prevValue !== currValue) return true;
      return false;
    };

    // Continue ONLY IF all requirements are defined.
    if (!this._isRequirementsDefined()) return;

    // Dispatch the actions based on the changed inputs.
    if (isInputChanged('ticketId')) this._dispatchActionsForTicketId();
    if (isInputChanged('lang')) this._dispatchActionsForLang();
  }

  ngOnDestroy(): void {
    if (this._authSub) this._authSub.unsubscribe();
    if (this._translationsSub) this._translationsSub.unsubscribe();
    if (this._readerInterval) clearInterval(this._readerInterval);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  private _isRequirementsDefined(): boolean {
    // All of the following variables MUST be defined.
    // They will be defined in the `ngOnInit` function, but with delay, as that
    // function is dependent on the `configFacade.configState$` Observable.
    if (!this._baseUrl || !this._clientId) {
      return false;
    }

    // Eventually, if all required inputs are defined, then return true.
    return true;
  }

  private _dispatchActionsForTicketId() {
    // Check the requirments before dispatching actions for the specific input.
    if (!this.ticketId || this.ticketId === '') return;

    // If `ticketId === 'undefined'`, it means that client want her user to
    // logout from the web-components! So if that's the case, then we need to
    // use the `authFacade` to logout the user.
    if (this.ticketId === 'undefined') {
      this._authFacade.logout();
      return;
    }

    // Dispatch the actions for the specific input.
    this._authFacade.getTokenViaTicket(
      this._baseUrl,
      this._clientId,
      this.ticketId as string,
    );
  }

  private _dispatchActionsForLang() {
    // Check the requirments before dispatching actions for the specific input.
    if (!this._userId) return;
    if (!this.lang) return;

    // Dispatch the actions for the specific input.
    this._translationsFacade.patchSelectedLang(
      this._baseUrl,
      this._userId,
      this.lang,
    );
  }

  private _dispatchError(key: WebcomErrorKey, value: string) {
    this.hasError.emit({ key, value });
    v1LocalWebcomSetOneError({ key, value });
  }

  private _startReaderInterval() {
    // Helper function to set the errors array if there are any errors.
    const showErrorsIfAny = () => {
      if (this.showErrors === 'false') return;
      const errors = v1LocalWebcomGetAllErrors();
      if (errors) {
        this.errors = errors;
        v1LocalWebcomClearAllErrors(); // Clear the errors after showing them.
      }
    };

    // Start the interval reader.
    this._readerInterval = setInterval(() => {
      showErrorsIfAny();
    }, 1000);
  }
}
