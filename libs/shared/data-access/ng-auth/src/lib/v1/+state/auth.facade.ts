/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { V1Auth_ApiPayloadMagicSendLoginLink } from '@x/shared-map-ng-auth';

import { AuthActions } from './auth.actions';
import { authFeature } from './auth.reducer';
import * as selectors from './auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class V1AuthFacade {
  private readonly _store = inject(Store);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Let's select one option from our feature state object.        */
  /* //////////////////////////////////////////////////////////////////////// */

  authState$ = this._store.pipe(select(authFeature.selectV1AuthState));

  publicUrls$ = this._store.pipe(select(authFeature.selectPublicUrls));
  protectedInitialPath$ = this._store.pipe(
    select(authFeature.selectProtectedInitialPath),
  );

  loadedLatest$ = this._store.pipe(select(authFeature.selectLoadedLatest));
  loadeds$ = this._store.pipe(select(authFeature.selectLoadeds));
  errors$ = this._store.pipe(select(authFeature.selectErrors));
  datas$ = this._store.pipe(select(authFeature.selectDatas));

  hasError$ = this._store.pipe(select(selectors.selectHasError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions: Let's modify the state by dispatching actions.                  */
  /* //////////////////////////////////////////////////////////////////////// */

  magicSendLoginLink(
    url: string,
    payload: V1Auth_ApiPayloadMagicSendLoginLink,
  ) {
    this._store.dispatch(AuthActions.magicSendLoginLink({ url, payload }));
  }

  checkIfLinkSeen(url: string, ticketId: string) {
    this._store.dispatch(AuthActions.checkIfLinkSeen({ url, ticketId }));
  }

  bankidGetRequiredData(url: string, clientId: number) {
    this._store.dispatch(AuthActions.bankidGetRequiredData({ url, clientId }));
  }

  bankidCheckIfAuthenticated(url: string, orderRef: string, clientId: number) {
    this._store.dispatch(
      AuthActions.bankidCheckIfAuthenticated({ url, orderRef, clientId }),
    );
  }

  getTokenViaTicket(url: string, clientId: number, ticketId: string) {
    this._store.dispatch(
      AuthActions.getTokenViaTicket({ url, clientId, ticketId }),
    );
  }

  /**
   * NOTE: This method will be called by the lib itself in the interceptor when
   * it's trying to handle a 401 error.
   */
  getTokenViaRefresh(
    url: string,
    clientId: number,
    userId: number,
    refreshToken: string,
  ) {
    this._store.dispatch(
      AuthActions.getTokenViaRefresh({
        url,
        clientId,
        userId,
        refreshToken,
      }),
    );
  }

  checkIfAlreadyLoggedin() {
    this._store.dispatch(AuthActions.checkIfAlreadyLoggedin());
  }

  logout() {
    this._store.dispatch(AuthActions.logout());
  }

  /**
   * Set public URLs of the app.
   * We won't attach the token to requests to these URLs in the interceptor.
   *
   * @param {string[]} urls
   */
  setPublicUrls(urls: string[]) {
    this._store.dispatch(AuthActions.setPublicUrls({ urls }));
  }

  /**
   * Set the default protected path of the app, where user should be redirected
   * to after successful login.
   * We'll use this path in the `activateIfNotLoggedin` function of our guard to
   * redirect the user to it, if she's already logged in.
   *
   * @param {string} path
   */
  setProtectedInitialPath(path: string) {
    this._store.dispatch(AuthActions.setProtectedInitialPath({ path }));
  }

  /**
   * Get ticket id via access token (useful for SSO auto-login).
   *
   * NOTE: We ourselves don't use this method in our apps! So it's just here for
   * reference to show what API endpoint our clients may need to call to do SSO
   * auto-login when they are using our web-component apps!
   *
   * @param {string} url
   */
  autoGetTicketId(url: string) {
    this._store.dispatch(AuthActions.autoGetTicketId({ url }));
  }
}
