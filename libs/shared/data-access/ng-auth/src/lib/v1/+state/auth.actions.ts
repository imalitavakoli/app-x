import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { V1Auth_ApiPayloadMagicSendLoginLink } from '@x/shared-map-ng-auth';

import { V1Auth_SuccessAction, V1Auth_FailureAction } from './auth.interfaces';

export const AuthActions = createActionGroup({
  source: 'V1Auth',
  events: {
    /* Auth by: Magic /////////////////////////////////////////////////////// */

    magicSendLoginLink: props<{
      url: string;
      payload: V1Auth_ApiPayloadMagicSendLoginLink;
    }>(),

    checkIfLinkSeen: props<{ url: string; ticketId: string }>(),

    /* Auth by: Bankid ////////////////////////////////////////////////////// */

    bankidGetRequiredData: props<{
      url: string;
      clientId: number;
    }>(),

    bankidCheckIfAuthenticated: props<{
      url: string;
      orderRef: string;
      clientId: number;
    }>(),

    /* Auth by: Magic, Bankid /////////////////////////////////////////////// */

    getTokenViaTicket: props<{
      url: string;
      clientId: number;
      ticketId: string;
    }>(),

    getTokenViaRefresh: props<{
      url: string;
      clientId: number;
      userId: number;
      refreshToken: string;
    }>(),

    /* Auth by: SSO (auto-login) //////////////////////////////////////////// */

    autoGetTicketId: props<{ url: string }>(),

    /* Other actions //////////////////////////////////////////////////////// */

    setPublicUrls: props<{ urls: string[] }>(),
    setProtectedInitialPath: props<{ path: string }>(),

    checkIfAlreadyLoggedin: emptyProps(), // Check if we should auto login the user next time she visits.
    logout: emptyProps(),

    success: props<V1Auth_SuccessAction>(),
    failure: props<V1Auth_FailureAction>(),
  },
});
