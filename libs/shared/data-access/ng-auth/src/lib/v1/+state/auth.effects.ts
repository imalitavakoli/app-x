import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {
  v1LocalStorageSet,
  v1LocalStorageGet,
  v1LocalStorageRemove,
} from '@x/shared-util-local-storage';
import { V1Auth, V1Auth_MapGetToken } from '@x/shared-map-ng-auth';

import { AuthActions } from './auth.actions';

@Injectable()
export class V1AuthEffects {
  private actions$ = inject(Actions);
  private _map = inject(V1Auth);

  /* Auth by: Magic ///////////////////////////////////////////////////////// */

  magicSendLoginLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.magicSendLoginLink),
      concatMap(({ url, payload }) => {
        return this._map.magicSendLoginLink(url, payload).pipe(
          map((data) =>
            AuthActions.success({ relatedTo: 'magicSendLoginLink', data }),
          ),
          catchError((error) =>
            of(AuthActions.failure({ relatedTo: 'magicSendLoginLink', error })),
          ),
        );
      }),
    ),
  );

  checkIfLinkSeen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkIfLinkSeen),
      concatMap(({ url, ticketId }) => {
        return this._map.checkIfLinkSeen(url, ticketId).pipe(
          map((data) =>
            AuthActions.success({ relatedTo: 'checkIfLinkSeen', data }),
          ),
          catchError((error) =>
            of(
              AuthActions.failure({
                relatedTo: 'checkIfLinkSeen',
                error,
              }),
            ),
          ),
        );
      }),
    ),
  );

  /* Auth by: Bankid //////////////////////////////////////////////////////// */

  bankidGetRequiredData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.bankidGetRequiredData),
      concatMap(({ url, clientId }) => {
        return this._map.bankidGetRequiredData(url, clientId).pipe(
          map((data) =>
            AuthActions.success({ relatedTo: 'bankidGetRequiredData', data }),
          ),
          catchError((error) =>
            of(
              AuthActions.failure({
                relatedTo: 'bankidGetRequiredData',
                error,
              }),
            ),
          ),
        );
      }),
    ),
  );

  bankidCheckIfAuthenticated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.bankidCheckIfAuthenticated),
      concatMap(({ url, orderRef, clientId }) => {
        return this._map
          .bankidCheckIfAuthenticated(url, orderRef, clientId)
          .pipe(
            map((data) =>
              AuthActions.success({
                relatedTo: 'bankidCheckIfAuthenticated',
                data,
              }),
            ),
            catchError((error) =>
              of(
                AuthActions.failure({
                  relatedTo: 'bankidCheckIfAuthenticated',
                  error,
                }),
              ),
            ),
          );
      }),
    ),
  );

  /* Auth by: Magic, Bankid ///////////////////////////////////////////////// */

  getTokenViaTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getTokenViaTicket),
      concatMap(({ url, clientId, ticketId }) => {
        return this._map.getTokenViaTicket(url, clientId, ticketId).pipe(
          map((data) => {
            // v1LocalStorageRemove('eAuth_token');
            // Save token details.
            v1LocalStorageSet('eAuth_token', data);

            return AuthActions.success({
              relatedTo: 'getToken',
              data,
            });
          }),
          catchError((error) =>
            of(AuthActions.failure({ relatedTo: 'getToken', error })),
          ),
        );
      }),
    ),
  );

  getTokenViaRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getTokenViaRefresh),
      concatMap(({ url, clientId, userId, refreshToken }) => {
        return this._map
          .getTokenViaRefresh(url, clientId, userId, refreshToken)
          .pipe(
            map((data) => {
              // Save token details.
              v1LocalStorageSet('eAuth_token', data);

              return AuthActions.success({
                relatedTo: 'getToken',
                data,
              });
            }),
            catchError((error) => {
              return of(AuthActions.failure({ relatedTo: 'getToken', error }));
            }),
          );
      }),
    ),
  );

  /* Auth by: SSO (auto-login) ////////////////////////////////////////////// */

  autoGetTicketId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoGetTicketId),
      concatMap(({ url }) => {
        return this._map.autoGetTicketId(url).pipe(
          map((data) =>
            AuthActions.success({ relatedTo: 'autoGetTicketId', data }),
          ),
          catchError((error) =>
            of(AuthActions.failure({ relatedTo: 'autoGetTicketId', error })),
          ),
        );
      }),
    ),
  );

  /* Other actions ////////////////////////////////////////////////////////// */

  checkIfAlreadyLoggedin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkIfAlreadyLoggedin),
      switchMap(() => {
        let isTokenValid = false;

        // First get the token from LocalStorage.
        const tokenObj = v1LocalStorageGet('eAuth_token') as V1Auth_MapGetToken;

        // Then, if token data was truthy, also check if it has the required
        // properties.
        if (tokenObj && tokenObj.userId && tokenObj.accessToken) {
          isTokenValid = true;
        }

        // If token is NOT valid, just dispatch logout.
        if (!isTokenValid) {
          return of(AuthActions.logout());
        }

        // If we're here, it means token is valid, so dispatch success.
        return of(
          AuthActions.success({ relatedTo: 'getToken', data: tokenObj }),
        );
      }),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          // Simply remove token data from LocalStorage, if it's available.
          v1LocalStorageRemove('eAuth_token');
        }),
      ),
    { dispatch: false },
  );
}
