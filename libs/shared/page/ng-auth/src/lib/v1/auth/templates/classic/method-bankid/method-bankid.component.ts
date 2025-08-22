import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  V1CapacitorCoreService,
  V1CapacitorCore_AppInfo,
  V1CapacitorBrowserService,
  V1CapacitorBrowser_OpenOptions,
} from '@x/shared-util-ng-capacitor';
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
export class MethodBankidComponent implements OnInit, OnDestroy {
  private readonly _communicationService = inject(V1CommunicationService);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);
  readonly configFacade = inject(V2ConfigFacade);
  readonly authFacade = inject(V1AuthFacade);

  private _communicationSub!: Subscription;
  private _authSub!: Subscription;
  private _authCanceled = false;
  private _authBankidTimeout!: ReturnType<typeof setTimeout>;

  private _baseUrl!: string;
  private _clientId!: number;
  private _bToken!: string;
  private _bRef!: string;
  private _appInfo!: V1CapacitorCore_AppInfo | null;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() isSecondaryAuth = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    this.configFacade.dataConfigDep$.pipe(take(1)).subscribe((data) => {
      data = data as V2Config_MapDep;

      // Save required data.
      this._baseUrl = data.general.baseUrl;
      this._clientId = data.general.clientId;

      // Init the component.
      this._init();
    });
  }

  private async _init() {
    // First get native app's bundle ID (included in app info).
    this._appInfo = await this._capacitorCoreService.appGetInfo();

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
      emitError('bankidGetRequiredData');
      emitError('bankidCheckIfAuthenticated');
      emitError('getToken');

      // Check `bankidGetRequiredData` action call results.
      if (
        state.loadedLatest.bankidGetRequiredData &&
        state.datas.bankidGetRequiredData
      ) {
        this._bToken = state.datas.bankidGetRequiredData.autoStartToken;
        this._bRef = state.datas.bankidGetRequiredData.orderRef;
        this.authFacade.bankidCheckIfAuthenticated(
          this._baseUrl,
          this._bRef,
          this._clientId,
        );
        this._openSite();

        // Emit the event to the parent component.
        this._communicationService.emitChange({
          template: 'classic',
          eventType: 'changeByUser',
          eventName: 'onSubmitLogin',
          eventValue: { loginType: 'bankid', url: this._getBankidFinUrl() },
        } as V1AuthPageTplEvent);
      }

      // Check `bankidCheckIfAuthenticated` action call results.
      // NOTE: If user has authenticated in BankID site, then fetch the token,
      // otherwise repeat the check. What should happen after fetching the
      // token? Well, we do nothing here! The parent component is already
      // listening to `getTokenViaTicket` action call and will take care of the
      // rest.
      if (
        state.loadedLatest.bankidCheckIfAuthenticated &&
        state.datas.bankidCheckIfAuthenticated
      ) {
        if (
          state.datas.bankidCheckIfAuthenticated.ticketStatus === 'complete'
        ) {
          const ticketId = state.datas.bankidCheckIfAuthenticated
            .ticketId as string;
          this.authFacade.getTokenViaTicket(
            this._baseUrl,
            this._clientId,
            ticketId,
          );
          this._closeSite();
        } else if (
          state.datas.bankidCheckIfAuthenticated.ticketStatus === 'failed'
        ) {
          this._closeSite();
          this._emitCancel();
          this.onLibError('auth', {
            key: 'bankidCheckIfAuthenticated_ticket',
            value: 'BankID authentication failed.',
          });
        } else {
          this._repeatBankidCheckIfAuthenticated();
        }
      }

      // If an error happens during the repeated check, then cancel the check.
      // NOTE: We also emit that we've canceled the process to the parent, so it
      // can control the UI.
      if (state.errors.bankidCheckIfAuthenticated) {
        this._emitCancel();
      }
    });

    // Listen to the error events that parent component (template) may emit.
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
                this._authCanceled = true;
                this._cancelBankidCheckIfAuthenticated();
              }
            }
          }
        },
      );
  }

  ngOnDestroy(): void {
    if (this._authSub) this._authSub.unsubscribe();
    if (this._communicationSub) this._communicationSub.unsubscribe();
    if (this._authBankidTimeout) clearTimeout(this._authBankidTimeout);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Call the `authFacade` method to get required data for opening BankID site.
   */
  onClickLogin() {
    this.authFacade.bankidGetRequiredData(this._baseUrl, this._clientId);

    // If `state.datas.checkIfLinkSeen.ticketStatus === 'error'` happens, while
    // we're listening to Auth state changes... Then we cancel the process and
    // return the user to the first view (in the parent). So if she clicks Login
    // button to try again, we must reset the `_authCanceled` flag.
    this._authCanceled = false;
  }

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

  private _openSite() {
    window.open(this._getBankidFinUrl(), '_blank');
    // this._capacitorBrowserService.open({ url: this._getBankidFinUrl() });
  }

  private _closeSite() {
    // this._capacitorBrowserService.close();
  }

  // Helper function to emit the cancel event to the parent component.
  private _emitCancel() {
    if (this._authCanceled) return;
    this._communicationService.emitChange({
      template: 'classic',
      eventType: 'changeByLogic',
      eventName: 'onAuthError',
      eventValue: null,
    } as V1AuthPageTplEvent);
    this._cancelBankidCheckIfAuthenticated();
    this._authCanceled = true;
  }

  /* `bankidGetRequiredData` related methods //////////////////////////////// */

  private _repeatBankidCheckIfAuthenticated() {
    this._authBankidTimeout = setTimeout(() => {
      this.authFacade.bankidCheckIfAuthenticated(
        this._baseUrl,
        this._bRef,
        this._clientId,
      );
    }, 2000);
  }

  private _cancelBankidCheckIfAuthenticated() {
    if (this._authBankidTimeout) clearTimeout(this._authBankidTimeout);
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
