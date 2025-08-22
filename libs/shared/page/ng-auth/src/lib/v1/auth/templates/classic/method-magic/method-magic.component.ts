import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { V1CommunicationService } from '@x/shared-util-ng-services';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1PreloadersComponent } from '@x/shared-ui-ng-preloaders';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AuthFacade, V1Auth_Errors } from '@x/shared-data-access-ng-auth';

import {
  V1AuthPageTplEvent,
  V1AuthPageTplError,
  V1AuthPageContentWaiting,
} from '../../tpl.interfaces';

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
export class MethodMagicComponent implements OnInit, OnDestroy, OnChanges {
  private readonly _translocoService = inject(TranslocoService);
  private readonly _communicationService = inject(V1CommunicationService);
  readonly configFacade = inject(V2ConfigFacade);
  readonly authFacade = inject(V1AuthFacade);

  private _communicationSub!: Subscription;
  private _authSub!: Subscription;
  private _authCanceled = false;
  private _authEmailTimeout!: ReturnType<typeof setTimeout>;

  private _isNgOnInit = false;
  showPopup = false;
  isFormSubmittedOnce = false;

  private _baseUrl!: string;
  private _clientId!: number;
  private _ticketId!: string;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() hasAuthMagic = false;
  @Input() hasAuthMagicAndCustomerNum = false;
  @Input() hasAuthMagicAndSms = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    this._isNgOnInit = true; // Set `ngOnInit` flag to true.

    this.configFacade.dataConfigDep$.pipe(take(1)).subscribe((data) => {
      data = data as V2Config_MapDep;

      // Save required data.
      this._baseUrl = data.general.baseUrl;
      this._clientId = data.general.clientId;

      // Init the component.
      this._init();
    });
  }

  private _init(): void {
    // Listen to the auth state changes.
    this._authSub = this.authFacade.authState$.subscribe((state) => {
      // Emit the error messages if any to the parent component.
      const emitError = (key: keyof V1Auth_Errors) => {
        if (state.loadedLatest[key] && state.errors[key]) {
          this.onLibError('auth', {
            key: key,
            value: state.errors[key] as string,
          });
        }
      };
      emitError('magicSendLoginLink');
      emitError('checkIfLinkSeen');
      emitError('getToken');

      // Check `magicSendLoginLink` action call results.
      if (
        state.loadedLatest.magicSendLoginLink &&
        state.datas.magicSendLoginLink
      ) {
        this._ticketId = state.datas.magicSendLoginLink.ticketId;
        this.authFacade.checkIfLinkSeen(this._baseUrl, this._ticketId);
      }

      // Check `checkIfLinkSeen` action call results.
      // NOTE: If user has seen her email, then fetch the token, otherwise
      // repeat the check. what should happen after fetching the token? Well,
      // we do nothing here! The parent component is already listening to
      // `getTokenViaTicket` action call and will take care of the rest.
      if (state.loadedLatest.checkIfLinkSeen && state.datas.checkIfLinkSeen) {
        if (state.datas.checkIfLinkSeen.ticketStatus === 'completed') {
          setTimeout(() => {
            this.authFacade.getTokenViaTicket(
              this._baseUrl,
              this._clientId,
              this._ticketId,
            );
          }, 1000);
        } else {
          this._repeatCheckIfLinkSeen();
        }
      }

      // If an error happens during the repeated check, then cancel the check.
      // NOTE: We also emit that we've canceled the process to the parent, so it
      // can control the UI.
      if (state.errors.checkIfLinkSeen) {
        if (this._authCanceled) return;
        this._communicationService.emitChange({
          template: 'classic',
          eventType: 'changeByLogic',
          eventName: 'onAuthError',
          eventValue: null,
        } as V1AuthPageTplEvent);
        this._cancelCheckIfLinkSeen();
      }
    });

    // Listen to the events that parent component (template) may emit.
    this._communicationSub =
      this._communicationService.changeEmitted$.subscribe(
        (action: V1AuthPageTplEvent) => {
          // `changeByUser` events.
          if (action.eventType === 'changeByUser') {
            // Clicking the back button event.
            if (action.eventName === 'onClickBack') {
              // If we're back to the 'welcome' content (the first step), then
              // cancel `authFacade` login process.
              const currIndex = action.eventValue as number;
              if (currIndex === 0) {
                this._cancelCheckIfLinkSeen();
              }
            }
          }
        },
      );
  }

  ngOnDestroy(): void {
    if (this._authSub) this._authSub.unsubscribe();
    if (this._communicationSub) this._communicationSub.unsubscribe();
    if (this._authEmailTimeout) clearTimeout(this._authEmailTimeout);
  }

  ngOnChanges(changes?: SimpleChanges): void {
    if (!this._isNgOnInit) return; // Don't continue if `ngOnInit` is NOT called yet.

    // Helper function to check if a specific input has changed.
    const isInputChanged = (param: string): boolean => {
      if (!changes) return false;
      if (!changes[param]) return false;
      const prevValue = changes[param].previousValue;
      const currValue = changes[param].currentValue;
      if (prevValue !== currValue) return true;
      return false;
    };
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Call the `authFacade` method to log in the user. And also emit the event to
   * the parent component, as it's listening to the events to control the HTML
   * content (UI).
   *
   * @param {NgForm} form
   */
  onSubmitLogin(form: NgForm) {
    // Helper function to validate the email address.
    const isEmail = (input: string) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(input);
    };

    // Let's see what the user has entered.
    let loginType: V1AuthPageContentWaiting;
    if (isEmail(form.value.input)) loginType = 'email';
    else loginType = 'email'; // Default is email

    // Emit the event to the parent component.
    this._communicationService.emitChange({
      template: 'classic',
      eventType: 'changeByUser',
      eventName: 'onSubmitLogin',
      eventValue: { loginType, input: form.value.input },
    } as V1AuthPageTplEvent);

    // Call the `authFacade` method to log in the user.
    this.dispatchActions(loginType, form);
    form.reset();

    // Reset the flag.
    this._authCanceled = false;

    // This is useful ONLY for the 'secret' login form in HTML template... To
    // let our own ACs that the form is submitted and they need to check their
    // email :)
    this.isFormSubmittedOnce = true;
  }

  /**
   * Dispatch `authFacade` actions based on the authentication methods.
   *
   * @param {V1AuthPageContentWaiting} loginType
   * @param {NgForm} form
   */
  dispatchActions(loginType: V1AuthPageContentWaiting, form: NgForm) {
    // Helper function to authenticate the user by email.
    const authByEmail = () => {
      if (!form.value.inputCusNum) {
        // If there's NO customer number input field.
        this.authFacade.magicSendLoginLink(this._baseUrl, {
          client_id: this._clientId,
          type: 'email',
          user_reference: form.value.input,
        });
      } else {
        // If there's a customer number input field (Jersey client).
        this.authFacade.magicSendLoginLink(this._baseUrl, {
          client_id: this._clientId,
          type: 'custom',
          custom: {
            email: form.value.input,
            customer_number: form.value.inputCusNum,
          },
        });
      }
    };

    // Check what user has entered and call the appropriate authentication method.
    if (loginType === 'email') {
      authByEmail();
    }
  }

  /* `magicSendLoginLink` related methods /////////////////////////////////// */

  private _repeatCheckIfLinkSeen() {
    this._authEmailTimeout = setTimeout(() => {
      this.authFacade.checkIfLinkSeen(this._baseUrl, this._ticketId);
    }, 5000);
  }

  private _cancelCheckIfLinkSeen() {
    if (this._authEmailTimeout) clearTimeout(this._authEmailTimeout);
    this._authCanceled = true;

    // Also reset the authentication state. Why? Because we may have tried to
    // login via the official login form, cancel, and then try to initialize
    // this component once again via the secret login form... And in there,
    // `_ticketId` is undefined... And because `state.datas.checkIfLinkSeen`
    // became truthy via the official login form, we will get into the IF
    // block (in `_init`) and try to call `authFacade.getTokenViaTicket` which
    // shouldn't happen.
    this.authFacade.logout();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * When an initialized 'feature' lib in the HTML template or a 'data-access'
   * lib that we're subscribing to it here in this file (e.g., `authFacade`),
   * emits an error, this method will be called to handover the error to the
   * parent component, which is listening to the events to show them to the user.
   *
   * @param {string} lib
   * @param {{ key: string; value: string }} err
   */
  onLibError(lib: string, err: { key: string; value: string }) {
    this._communicationService.emitChange({
      template: 'classic',
      eventType: 'error',
      eventName: `on${lib}Error`,
      eventValue: {
        template: 'classic',
        lib: lib, // The 'feature' or 'data-access' lib name which caused the error.
        key: err.key,
        value: err.value,
      } as V1AuthPageTplError,
    } as V1AuthPageTplEvent);
  }
}
