import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import {
  V1Auth_ApiPayloadMagicSendLoginLink,
  V1Auth_ApiMagicSendLoginLink,
  V1Auth_MapMagicSendLoginLink,
  V1Auth_ApiCheckIfLinkSeen,
  V1Auth_MapCheckIfLinkSeen,
  V1Auth_ApiBankidGetRequiredData,
  V1Auth_MapBankidGetRequiredData,
  V1Auth_ApiBankidCheckIfAuthenticated,
  V1Auth_MapBankidCheckIfAuthenticated,
  V1Auth_ApiGetToken,
  V1Auth_MapGetToken,
  V1Auth_ApiAutoGetTicketId,
  V1Auth_MapAutoGetTicketId,
} from './auth.interfaces';

/**
 * Here we interact with the Magic Link Serive (API).
 *
 * @export
 * @class V1Auth
 * @typedef {V1Auth}
 */
@Injectable({
  providedIn: 'root',
})
export class V1Auth {
  private readonly _http = inject(HttpClient);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Auth by: Magic                                                           */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Use Magic Link (API) to send the login link to get ticket id
   * POST {url}/authentication/login/magiclink
   *
   * @param {string} url
   * @param {V1Auth_ApiPayloadMagicSendLoginLink} payload
   * @returns {Observable<V1Auth_MapMagicSendLoginLink>}
   */
  magicSendLoginLink(
    url: string,
    payload: V1Auth_ApiPayloadMagicSendLoginLink,
  ): Observable<V1Auth_MapMagicSendLoginLink> {
    // Here's the endpoint
    const endPoint = `${url}/authentication/login/magiclink`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Auth_ApiMagicSendLoginLink> = of({
      email: 'ali@x.com',
      ticket: {
        id: '123abc-456def',
        status: 'initiated',
      },
    });
    // const observable = this._http.post<V1Auth_ApiMagicSendLoginLink>(endPoint, payload);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapMagicSendLoginLink(data);
      }),
      catchError((err) => {
        let error = err.error || err;

        // NOTE: This API endpoint's data is very important... We parse its
        // error in a different way to see almost all of the returned error's
        // available properties.
        if (typeof error === 'object') {
          error.xUrl = endPoint; // Add URL property
          error = JSON.stringify(error);
        }

        console.error('@V1Auth/magicSendLoginLink:', error);
        return throwError(() => error);
      }),
    );
  }

  private _mapMagicSendLoginLink(data: V1Auth_ApiMagicSendLoginLink) {
    // Let's save the response in the way we like it to be
    const map: V1Auth_MapMagicSendLoginLink = {
      email: data.email,
      ticketId: data.ticket.id,
    };

    // Let's return the final object
    return map;
  }

  /**
   * Check the ticket id status.
   * NOTE: App should call this method every 5 seconds until the status is 'completed'.
   * GET {url}/authentication/tickets/{ticketId}
   *
   * @param {string} url
   * @param {string} ticketId
   * @returns {Observable<V1Auth_MapCheckIfLinkSeen>}
   */
  checkIfLinkSeen(
    url: string,
    ticketId: string,
  ): Observable<V1Auth_MapCheckIfLinkSeen> {
    // Here's the endpoint
    const endPoint = `${url}/authentication/tickets/${ticketId}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Auth_ApiCheckIfLinkSeen> = of({
      id: ticketId,
      status: 'completed',
    });
    // const observable = this._http.get<V1Auth_ApiCheckIfLinkSeen>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapCheckIfLinkSeen(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Auth/checkIfLinkSeen:', error);
        return throwError(() => error);
      }),
    );
  }

  private _mapCheckIfLinkSeen(data: V1Auth_ApiCheckIfLinkSeen) {
    // Let's save the response in the way we like it to be
    const map: V1Auth_MapCheckIfLinkSeen = {
      ticketId: data.id,
      ticketStatus: data.status,
    };

    // Let's return the final object
    return map;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Auth by: Bankid                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Use Bankid to get the required data (`order_ref` & `auto_start_token`) for
   * BankID website visiting.
   * NOTE: `auto_start_token` will be used when app wants to open the BankID website.
   * POST {url}/authentication/bankid?client_id={client_id}
   *
   * @param {string} url
   * @param {number} clientId
   * @returns {Observable<V1Auth_MapBankidGetRequiredData>}
   */
  bankidGetRequiredData(
    url: string,
    clientId: number,
  ): Observable<V1Auth_MapBankidGetRequiredData> {
    // Here's the endpoint
    const endPoint = `${url}/authentication/bankid?client_id=${clientId}`;

    // Here's the data we're going to send
    const payload = {
      auto_start: 'true',
    };

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Auth_ApiBankidGetRequiredData> = of({
      order_ref: '123abc-456def',
      auto_start_token: 'xyz-789',
      status: 'pending',
    });
    // const observable = this._http.post<V1Auth_ApiBankidGetRequiredData>(endPoint, payload);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapBankidGetRequiredData(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Auth/bankidGetRequiredData:', error);
        return throwError(() => error);
      }),
    );
  }

  private _mapBankidGetRequiredData(data: V1Auth_ApiBankidGetRequiredData) {
    // Let's save the response in the way we like it to be
    const map: V1Auth_MapBankidGetRequiredData = {
      orderRef: data.order_ref,
      autoStartToken: data.auto_start_token,
    };

    // Let's return the final object
    return map;
  }

  /**
   * Check the ticket id status.
   * NOTE: App should call this method every 2 seconds until the status is 'complete'.
   * POST {url}/authentication/bankid/{order_ref}?client_id={cliend_id}
   *
   * @param {string} url
   * @param {number} clientId
   * @returns {Observable<V1Auth_MapBankidCheckIfAuthenticated>}
   */
  bankidCheckIfAuthenticated(
    url: string,
    orderRef: string,
    clientId: number,
  ): Observable<V1Auth_MapBankidCheckIfAuthenticated> {
    // Here's the endpoint
    const endPoint = `${url}/authentication/bankid/${orderRef}?client_id=${clientId}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Auth_ApiBankidCheckIfAuthenticated> = of({
      order_ref: orderRef,
      ticket_id: '123abc-456def',
      bankid_status: 'outstanding_transaction',
      status: 'complete',
    });
    // const observable = this._http.get<V1Auth_ApiBankidCheckIfAuthenticated>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapBankidCheckIfAuthenticated(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Auth/bankidCheckIfAuthenticated:', error);
        return throwError(() => error);
      }),
    );
  }

  private _mapBankidCheckIfAuthenticated(
    data: V1Auth_ApiBankidCheckIfAuthenticated,
  ) {
    // Let's save the response in the way we like it to be
    const map: V1Auth_MapBankidCheckIfAuthenticated = {
      ticketStatus: data.status,
    };
    if (data.ticket_id) map.ticketId = data.ticket_id;

    // Let's return the final object
    return map;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Auth by: Magic, Bankid                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get access & refresh tokens via ticket id.
   * GET {url}/authentication/oauth/token?grant_type=ticket&client_id={clientId}&ticket_id={ticketId}
   *
   * @param {string} url
   * @param {number} clientId
   * @param {string} ticketId
   * @returns {Observable<V1Auth_MapGetToken>}
   */
  getTokenViaTicket(
    url: string,
    clientId: number,
    ticketId: string,
  ): Observable<V1Auth_MapGetToken> {
    // Here's the endpoint
    const endPoint = `${url}/authentication/oauth/token?grant_type=ticket&client_id=${clientId}&ticket_id=${ticketId}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Auth_ApiGetToken> = of({
      user_id: 123,
      token: {
        token_type: 'bearer',
        access_token: 'abc123',
        expires_in: 30 * 24 * 60 * 60, // 30 days
        refresh_token: 'xyz789',
        refresh_token_expires_in: 10 * 60, // 10 mins
      },
    });
    // const observable = this._http.get<V1Auth_ApiGetToken>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapGetToken(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Auth/getTokenViaTicket:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Get access & refresh tokens again, via the refresh token that we already have.
   * GET {url}/authentication/oauth/token?grant_type=refresh_token&client_id={clientId}&user_id={userId}&refresh_token={refreshToken}
   *
   * @param {string} url
   * @param {number} clientId
   * @param {number} userId
   * @param {string} refreshToken
   * @returns {Observable<V1Auth_MapGetToken>}
   */
  getTokenViaRefresh(
    url: string,
    clientId: number,
    userId: number,
    refreshToken: string,
  ): Observable<V1Auth_MapGetToken> {
    // Here's the endpoint
    const endPoint = `${url}/authentication/oauth/token?grant_type=refresh_token&client_id=${clientId}&user_id=${userId}&refresh_token=${refreshToken}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Auth_ApiGetToken> = of({
      user_id: 123,
      token: {
        token_type: 'bearer',
        access_token: 'abc123',
        expires_in: 30 * 24 * 60 * 60, // 30 days
        refresh_token: 'xyz789',
        refresh_token_expires_in: 10 * 60, // 10 mins
      },
    });
    // const observable = this._http.get<V1Auth_ApiGetToken>(endPoint);
    //
    // Let's send the request
    return this._http.get<V1Auth_ApiGetToken>(endPoint).pipe(
      map((data) => {
        return this._mapGetToken(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Auth/getTokenViaRefresh:', error);
        return throwError(() => error);
      }),
    );
  }

  private _mapGetToken(data: V1Auth_ApiGetToken) {
    // Let's save the response in the way we like it to be
    const map: V1Auth_MapGetToken = {
      userId: data.user_id,
      accessToken: data.token.access_token,
    };
    if (data.token.refresh_token) map.refreshToken = data.token.refresh_token;

    // Let's return the final object
    return map;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Auth by: SSO (auto-login)                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get ticket id via access token (useful for SSO auto-login).
   * GET {url}/authentication/autologin/ticket
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * NOTE: We ourselves don't use this method in our apps! So it's just here for
   * reference to show what API endpoint our clients may need to call to do SSO
   * auto-login when they are using our web-component apps! Because in such
   * apps, client herself needs to get the ticket ID from the API first, and
   * then load our web-component in her own site/app, while providing the ticket
   * id to our web-component.
   *
   * @param {string} url
   * @returns {Observable<V1Auth_MapAutoGetTicketId>}
   */
  autoGetTicketId(url: string): Observable<V1Auth_MapAutoGetTicketId> {
    // Here's the endpoint
    const endPoint = `${url}/authentication/autologin/ticket`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Auth_ApiAutoGetTicketId> = of({
      ticket_id: '123abc-456def',
    });
    // const observable = this._http.get<V1Auth_ApiAutoGetTicketId>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapAutoGetTicketId(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Auth/autoGetTicketId:', error);
        return throwError(() => error);
      }),
    );
  }

  private _mapAutoGetTicketId(data: V1Auth_ApiAutoGetTicketId) {
    // Let's save the response in the way we like it to be
    const map: V1Auth_MapAutoGetTicketId = {
      ticketId: data.ticket_id,
    };

    // Let's return the final object
    return map;
  }
}
