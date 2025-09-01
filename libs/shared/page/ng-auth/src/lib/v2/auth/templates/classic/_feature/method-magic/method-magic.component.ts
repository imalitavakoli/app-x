import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Input,
  OnChanges,
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
import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
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
  selector: 'x-method-magic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoDirective,
    V1PreloadersComponent,
  ],
  templateUrl: './method-magic.component.html',
  styleUrl: './method-magic.component.scss',
})
export class MethodMagicComponent
  extends V1BaseFunComponent
  implements OnDestroy
{
  private readonly _translocoService = inject(TranslocoService);
  readonly configFacade = inject(V2ConfigFacade);
  readonly authFacade = inject(V1AuthFacade);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);

  private _authSub!: Subscription;

  private _loginType: V2Auth_Submit['type'] = 'email';
  private _whatUserEntered?: string;

  isSubmitted = false;
  private _isTokenRequested = false;
  private _isAppPaused = false;

  private _authVerificationTimeout: ReturnType<typeof setTimeout>[] = [];

  private _baseUrl!: string;
  private _clientId!: number;
  private _deviceUuid?: string = undefined; // Desktop apps don't have it.
  private _ticketId!: string;

  private _checkIfLinkSeenErrorCount = 0; // Counter for repeated received errors
  private _CheckIfLinkSeenErrorMax = 3; // Max number of 'CheckIfLinkSeen' API errors tries before canceling

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

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

  ngOnDestroy() {
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

      // Check `magicSendLoginLink` action call results.
      if (
        state.loadedLatest.magicSendLoginLink &&
        state.datas.magicSendLoginLink
      ) {
        this._ticketId = state.datas.magicSendLoginLink.ticketId;

        // Now that the submitted data is successful, emit the event.
        this.submitted.emit({
          type: this._loginType,
          whatUserEntered: this._whatUserEntered,
        });

        this._callAuth_checkIfLinkSeen();
      }

      // Check `checkIfLinkSeen` action call results.
      // NOTE: If user has seen her email, then fetch the token, otherwise
      // repeat the check.
      if (state.loadedLatest.checkIfLinkSeen && state.datas.checkIfLinkSeen) {
        if (state.datas.checkIfLinkSeen.ticketStatus === 'completed') {
          this._callAuth_getTokenViaTicket();
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
        // (submitted), but not completed (token is not requested) yet, and
        // as long as the login type is 'email' (magic link), we need to repeat
        // the checking process.
        if (
          this.isSubmitted &&
          !this._isTokenRequested &&
          this._loginType === 'email'
        ) {
          this._callAuth_checkIfLinkSeen();
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
    this._checkIfLinkSeenErrorCount = 0; // Reset `checkIfLinkSeen` error count
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

  private _callAuth_magicSendLoginLink(value: string, cusNum?: string) {
    if (!cusNum) {
      this.authFacade.magicSendLoginLink(this._baseUrl, {
        client_id: this._clientId,
        type: 'email',
        user_reference: value,
      });
    } else {
      this.authFacade.magicSendLoginLink(this._baseUrl, {
        client_id: this._clientId,
        type: 'custom',
        custom: {
          email: value,
          customer_number: cusNum,
        },
      });
    }
  }

  private _callAuth_checkIfLinkSeen() {
    if (!this._ticketId) return;

    this.authFacade.checkIfLinkSeen(this._baseUrl, this._ticketId);
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

  authSubmitted(form: NgForm) {
    // Helper function to fetch data based on login type.
    const dataFetch = (loginType: V2Auth_Submit['type'], form: NgForm) => {
      // Fun to authenticate the user by email.
      const authByEmail = () => {
        if (!form.value.inputCusNum) {
          // If there's NO customer number input field.
          this._callAuth_magicSendLoginLink(form.value.input);
        } else {
          // If there's a customer number input field.
          this._callAuth_magicSendLoginLink(
            form.value.input,
            form.value.inputCusNum,
          );
        }
      };
      // Check what user has entered and call the appropriate authentication method.
      if (loginType === 'email') {
        authByEmail();
      }
    };

    // Helper function to validate the email address.
    const isEmail = (input: string) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(input);
    };

    // Let's see what the user has entered.
    let loginType: V2Auth_Submit['type'];
    if (isEmail(form.value.input)) loginType = 'email';
    else loginType = 'email'; // Default

    // Call the `authFacade` method to log in the user.
    dataFetch(loginType, form);
    form.reset();

    // Flags.
    this.isSubmitted = true;
    this._loginType = loginType; // Save to be used in resume/pause events & submitted output payload.
    this._whatUserEntered = form.value.input; // Save to be used in submitted output payload.
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
      this._callAuth_checkIfLinkSeen();
    }, 4000);

    this._authVerificationTimeout.push(id);
  }

  private _authCompleted() {
    // Immediately unsubscribe from the auth state, before emitting the ready
    // event... Why? Because in the parent component (which initialized this
    // 'method' component), before we destroy this whole Auth page , we are
    // already subscribing to Auth Facade state changes and taking one from it
    // to understand the User ID... So if we don't unsubscribe here, as we have
    // already fetched the token, and our Auth subscription is still active in
    // `_xInitPre` function of this component, then this function (and
    // eventually the ready event) will be called once again.
    if (this._authSub) this._authSub.unsubscribe();
    this.ready.emit();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

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

    // Also reset the authentication state. Why? Because we may have tried to
    // login via the official login form, cancel, and then try to initialize
    // this component once again via the secret login form... And in there,
    // `ticketId` is undefined... And because `state.datas.checkIfLinkSeen`
    // became truthy via the official login form, we will get into the IF
    // block (in `_init`) and try to call `authFacade.getTokenViaTicket` which
    // shouldn't happen.
    // NOTE: We don't need to do `postLogout` here...
    this.authFacade.logout();

    // Emit the error event.
    this.hasError.emit({
      key: key,
      value: error.value,
    });
  }

  private _errorCheck(state: V1Auth_State) {
    const emitError = (key: keyof V1Auth_Errors) => {
      if (state.loadedLatest[key] && state.errors[key]) {
        // If `key === 'checkIfLinkSeen'` don't call `_onError` until we
        // reach the max error count.
        // Why not to immediatly terminate in such case? Because we're
        // calling this API endpoint every 5 seconds, and it might be
        // normal that server may be busy for one or two times.
        if (key === 'checkIfLinkSeen') {
          if (this._checkIfLinkSeenErrorCount < this._CheckIfLinkSeenErrorMax) {
            this._checkIfLinkSeenErrorCount++;
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
    emitError('magicSendLoginLink');
    emitError('checkIfLinkSeen');
    emitError('getToken');
  }
}
