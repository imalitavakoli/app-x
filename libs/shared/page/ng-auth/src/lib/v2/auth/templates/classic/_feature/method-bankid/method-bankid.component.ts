import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { exhaustMap, from, Subscription, take, tap } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { V1BaseFunComponent } from '@x/shared-util-ng-bases';
import {
  V1CapacitorCoreService,
  V1CapacitorCore_AppInfo,
  V1CapacitorBrowserService,
  V1CapacitorBrowser_OpenOptions,
} from '@x/shared-util-ng-capacitor';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1PreloadersComponent } from '@x/shared-ui-ng-preloaders';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import {
  V1AuthFacade,
  V1Auth_Errors,
  V1Auth_State,
} from '@x/shared-data-access-ng-auth';

import { V2Auth_Submit } from '../../../tpl.interfaces';

@Component({
  selector: 'x-method-bankid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoDirective,
    V1PreloadersComponent,
  ],
  templateUrl: './method-bankid.component.html',
  styleUrl: './method-bankid.component.scss',
})
export class MethodBankidComponent
  extends V1BaseFunComponent
  implements OnDestroy
{
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
  readonly configFacade = inject(V2ConfigFacade);
  readonly authFacade = inject(V1AuthFacade);

  private _authSub!: Subscription;

  isSubmitted = false;
  private _isTokenRequested = false;
  private _isAppPaused = false;

  private _authVerificationTimeout: ReturnType<typeof setTimeout>[] = [];

  private _baseUrl!: string;
  private _clientId!: number;
  private _deviceUuid?: string = undefined; // Desktop apps don't have it.
  private _appInfo: V1CapacitorCore_AppInfo | null = null; // Desktop apps don't have it.
  private _bToken!: string;
  private _bRef!: string;
  private _ticketId!: string;

  private _bankidCheckIfAuthenticatedErrorCount = 0; // Counter for repeated received errors
  private _bankidCheckIfAuthenticatedErrorMax = 3; // Max number of 'bankidCheckIfAuthenticated' API errors tries before canceling

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() isSecondaryAuth = false;

  /** Whether the auth was canceled from outside (e.g. by clicking 'back' btn) */
  @Input() isAuthCanceledFromOutside = false;

  /** Emits when an error occurs while fetching data from a 'data-access' lib. */
  @Output() hasError = new EventEmitter<{ key: string; value: string }>();

  /** Emits when the access-token is fetched. */
  @Output() submitted = new EventEmitter<V2Auth_Submit>();

  /** Emits when the access-token is fetched. */
  @Output() ready = new EventEmitter<void>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnDestroy(): void {
    if (this._authSub) this._authSub.unsubscribe();
    this._destroy();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xInitPre(): void {
    super._xInitPre();

    this.configFacade.dataConfigDep$
      .pipe(
        take(1),
        tap((data) => {
          data = data as V2Config_MapDep;
          // Save required data.
          this._baseUrl = data.general.baseUrl;
          this._clientId = data.general.clientId;
        }),
        exhaustMap(() => from(this._capacitorCoreService.deviceGetId())),
        take(1),
        tap((deviceIdInfo) => {
          if (deviceIdInfo && deviceIdInfo.identifier) {
            // Save required data.
            this._deviceUuid = deviceIdInfo.identifier;
          }
        }),
        exhaustMap(() => from(this._capacitorCoreService.appGetInfo())),
        take(1),
        tap((appInfo) => {
          if (appInfo) {
            // Save required data.
            this._appInfo = appInfo;
          }
        }),
      )
      .subscribe(() => {
        this._init();
      });
  }

  private _init() {
    this._authSub = this.authFacade.authState$.subscribe((state) => {
      // If any error happens, call `_onError` to emit the error and
      // terminate everything.
      this._errorCheck(state);

      // Check `bankidGetRequiredData` action call results.
      if (
        state.loadedLatest.bankidGetRequiredData &&
        state.datas.bankidGetRequiredData
      ) {
        this._bToken = state.datas.bankidGetRequiredData.autoStartToken;
        this._bRef = state.datas.bankidGetRequiredData.orderRef;

        // Now that the submitted data is successful, emit the event.
        this.submitted.emit({
          type: 'bankid',
          whatUrlToRedirect: this._getBankidFinUrl(),
        });

        this._callAuth_bankidCheckIfAuthenticated();
        this._openSite(); // Open BankID site (app)
      }

      // Check `bankidCheckIfAuthenticated` action call results.
      // NOTE: If user has authenticated in BankID site, then fetch the token,
      // otherwise repeat the check.
      if (
        state.loadedLatest.bankidCheckIfAuthenticated &&
        state.datas.bankidCheckIfAuthenticated
      ) {
        if (
          state.datas.bankidCheckIfAuthenticated.ticketStatus === 'complete'
        ) {
          this._ticketId = state.datas.bankidCheckIfAuthenticated
            .ticketId as string;
          this._callAuth_getTokenViaTicket();
          this._closeSite();
        } else if (
          state.datas.bankidCheckIfAuthenticated.ticketStatus === 'failed'
        ) {
          this._closeSite();
          this._onError({
            key: 'bankidCheckIfAuthenticated_ticketStatus',
            value: 'Authentication failed',
          });
        } else {
          this._authRepeatChecking();
        }
      }

      // Check `getTokenViaTicket` action call results.
      if (state.loadedLatest.getToken && state.datas.getToken) {
        this._authCompleted();
      }
    });
  }

  protected override _xInit(): void {
    super._xInit();

    // Listen to the app pause event.
    this._capacitorCoreService.onPause
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._isAppPaused = true;
        // Clear all pending timers before scheduling a new one
        this._authVerificationTimeout.forEach((id) => clearTimeout(id));
        this._authVerificationTimeout = [];
      });

    // Listen to the app resume event.
    this._capacitorCoreService.onResume
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._isAppPaused = false;

        // If the app is resumed, we check if auth was already started
        // (submitted), but not completed (token is not requested) yet, we need
        // to repeat the checking process.
        if (this.isSubmitted && !this._isTokenRequested) {
          this._callAuth_bankidCheckIfAuthenticated();
        }
      });
  }

  protected override _xUpdate(changes?: SimpleChanges): void {
    super._xUpdate(changes);

    // If auth is canceled from outside, terminate everything.
    if (this._xIsInputChanged('isAuthCanceledFromOutside', changes)) {
      if (this.isAuthCanceledFromOutside) {
        this._destroy();
        this.authFacade.logout(); // To clear the Auth state object once again.
      }
    }
  }

  private _destroy() {
    // Clear all pending timers (if there's any).
    this._authVerificationTimeout.forEach((id) => clearTimeout(id));
    this._authVerificationTimeout = [];

    // Reset flags.
    this.isSubmitted = false;
    this._isTokenRequested = false;
    this._bankidCheckIfAuthenticatedErrorCount = 0; // Reset `bankidCheckIfAuthenticated` error count
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    return true;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Fetch data functions                                                     */
  /* //////////////////////////////////////////////////////////////////////// */

  private _callAuth_bankidGetRequiredData() {
    this.authFacade.bankidGetRequiredData(this._baseUrl, this._clientId);
  }

  private _callAuth_bankidCheckIfAuthenticated() {
    if (this._isTokenRequested) return;
    if (!this._bRef) return;

    this.authFacade.bankidCheckIfAuthenticated(
      this._baseUrl,
      this._bRef,
      this._clientId,
    );
  }

  private _callAuth_getTokenViaTicket() {
    if (this._isTokenRequested) return;
    if (!this._ticketId) return;

    this.authFacade.getTokenViaTicket(
      this._baseUrl,
      this._clientId,
      this._ticketId,
    );
    this._isTokenRequested = true; // Set the auth completed flag to true.
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Auth handling                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  private _openSite() {
    window.open(this._getBankidFinUrl(), '_blank');
    // this._capacitorBrowserService.open({ url: this._getBankidFinUrl() });
  }

  private _closeSite() {
    // this._capacitorBrowserService.close();
  }

  authSubmitted() {
    this._callAuth_bankidGetRequiredData();

    // Flags.
    this.isSubmitted = true;
  }

  private _authRepeatChecking() {
    // If we already requested a token, and this function is called (maybe
    // because of a timeout leftover), then just return here.
    if (this._isTokenRequested) return;

    // Check if app is paused... In such case, there's no need to repeat.
    if (this._isAppPaused) return;

    // Clear all pending timers before scheduling a new one
    this._authVerificationTimeout.forEach((id) => clearTimeout(id));
    this._authVerificationTimeout = [];

    const id = setTimeout(() => {
      this._callAuth_bankidCheckIfAuthenticated();
    }, 2000);

    this._authVerificationTimeout.push(id);
  }

  private _authCompleted() {
    // Immediately unsubscribe from the auth state, before emitting.
    if (this._authSub) this._authSub.unsubscribe();
    this.ready.emit();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * We need to open the BankID site in a new tab... But in order to do that,
   * we must build its URL with 'autoStartToken' and 'appBundleID'.
   * This method does that.
   *
   * @private
   * @returns {string}
   */
  private _getBankidFinUrl(): string {
    const appBundleId = this._appInfo?.id;
    const redirect = appBundleId ? `${appBundleId}://` : 'null';
    return `https://app.bankid.com/?autostarttoken=${this._bToken}&redirect=${redirect}`;
  }

  /**
   * Dispatches the error event (`hasError`) when an error occurs while
   * fetching data from a 'data-access' lib.
   *
   * @param {{ key: string; value: string }} error
   */
  private _onError(error: { key: string; value: string }): void {
    // Make up the error key.
    const key = `V1AuthFacade/${error.key}`; // e.g., 'V1AuthFacade/magicSendLoginLink'

    // Terminate everything.
    this._destroy();
    this.authFacade.logout(); // To clear the Auth state object once again.

    // Emit the error event.
    this.hasError.emit({
      key: key,
      value: error.value,
    });
  }

  private _errorCheck(state: V1Auth_State) {
    const emitError = (key: keyof V1Auth_Errors) => {
      if (state.loadedLatest[key] && state.errors[key]) {
        // If `key === 'bankidCheckIfAuthenticated'` don't call `_onError`
        // until we reach the max error count.
        // Why not to immediatly terminate in such case? Because we're
        // calling this API endpoint every 5 seconds, and it might be
        // normal that server may be busy for one or two times.
        if (key === 'bankidCheckIfAuthenticated') {
          if (
            this._bankidCheckIfAuthenticatedErrorCount <
            this._bankidCheckIfAuthenticatedErrorMax
          ) {
            this._bankidCheckIfAuthenticatedErrorCount++;
            this._authRepeatChecking(); // try again.
            return;
          }
        }

        this._onError({
          key: key,
          value: state.errors[key],
        });
      }
    };
    emitError('bankidGetRequiredData');
    emitError('bankidCheckIfAuthenticated');
    emitError('getToken');
  }
}
