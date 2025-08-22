import { Inject, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, delay, Observable, switchMap, take, tap } from 'rxjs';

import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-api-data-access-ng-config';
import { V1AuthFacade } from '@x/shared-api-data-access-ng-auth';

/**
 * Here we auto-login the user by using 'Auth' data-access lib.
 * We basically return `autoLogin` Observable (app's query params subscribtion) 
 * to let the class which is using this service (usually `AppComponent` class) 
 * to subscribe to it. Here's what we do in the Observable:
 * 1. We check route URL Query Params. If we don't have `ticket-id` param, we do
 *    nothing. If we had it, we continue to the next step.
 * 2. We log the user out (if she is already logged in).
 * 3. We log her in (with new received `ticket-id`).
 * 
 * NOTE: Here we just simply switch the access-token and that's it! So who's 
 * going to re-direct to the dashboard page? It's up to the Auth page (which is
 * already listening to Auth state object changes) and its `_redirect` function.
 * 
 * NOTE: How to test this service? We can simply call 
 * `{url}/v3/authentication/autologin/ticket` API endpoint (with a valid 
 * access-token that we already have), receive the ticket-id and then visit
 * the app like: `http://localhost:4200/#/auth?ticket-id=xxx`.
 * 
 * @example
 * ```ts
 * // app.component.ts
 * 
 * import { V1AuthAutoService } from '@x/shared-util-ng-services';
 * private readonly _authAutoService = inject(V1AuthAutoService);
 * this._authAutoService
    .autoLogin()
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe();
 * ```
 *
 * @export
 * @class V1AuthAutoService
 * @typedef {V1AuthAutoService}
 */
@Injectable({
  providedIn: 'root',
})
export class V1AuthAutoService {
  private readonly _configFacade = inject(V2ConfigFacade);
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _route = inject(ActivatedRoute);

  locationId$ = new BehaviorSubject<number | null>(null);

  /**
   * Initializes the auto-login observer.
   *
   * This method subscribes to the configuration data and route query parameters
   * to perform auto-login by retrieving an authentication token using a ticket ID
   * and updating the location selection if provided.
   *
   * @returns An observable of route query parameters.
   */
  public autoLogin(): Observable<Params> {
    return this._configFacade.dataConfigDep$.pipe(
      take(1),
      // delay(10000),
      switchMap((data) => {
        data = data as V2Config_MapDep; // We are already sure DEP config is loaded.

        return this._route.queryParams.pipe(
          tap((params) => {
            const ticketId = params['ticket-id'];
            if (ticketId) {
              // Let's immediatly logout the user if she is already logged in!
              // What happens when we do so? Well, as we are resetting the Auth
              // state object (by calling logout) here, when the app tries to
              // call any of our protected API endpoints (in any of our pages),
              // because the Auth state is empty, then the Auth interceptor will
              // understand this and redirects the user to the Auth page.
              this._authFacade.logout();

              // Now that the app is in the Auth page, as the Auth page is
              // already listening to the Auth state object changes... We are
              // confident that if we call `getTokenViaTicket` method to receive
              // a new access-token by the newly received `ticket-id`, the Auth
              // page will automatically redirect the user to the dashboard
              // page. So there's no need to do anything else here in this
              // service... Cheers!
              this._authFacade.getTokenViaTicket(
                data.general.baseUrl,
                data.general.clientId,
                ticketId,
              );
            }
          }),
        );
      }),
    );
  }
}
