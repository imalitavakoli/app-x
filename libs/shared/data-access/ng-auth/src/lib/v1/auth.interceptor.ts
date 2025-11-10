import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  concatMap,
  exhaustMap,
  filter,
  skip,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import {
  V1CapacitorCoreService,
  V1CapacitorCore_AppInfo,
} from '@x/shared-util-ng-capacitor';
import { V1AuthFacade } from './+state/auth.facade';
import { Router, ActivatedRoute } from '@angular/router';
import { V1Auth_MapGetToken } from '@x/shared-map-ng-auth';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V2Config_MapDep } from '@x/shared-map-ng-config';

@Injectable()
export class V1AuthInterceptor implements HttpInterceptor {
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _configFacade = inject(V2ConfigFacade);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);

  private _tokenData: V1Auth_MapGetToken | null = null;
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  private _platform: 'ios' | 'android' | 'desktop' = 'desktop';
  private _isNative = false;
  private _deviceUuid?: string = undefined; // Desktop apps don't have a device UUID.
  private _nativeAppInfo: V1CapacitorCore_AppInfo | null = null; // Desktop apps don't have a device UUID.
  private _isRefreshing = false;
  private _refreshTokenSubj: BehaviorSubject<unknown> =
    new BehaviorSubject<unknown>(null);

  constructor() {
    // Here in Auth Interceptor we are going to call some protected API
    // endpoints which require the token to be present... So we should have
    // already called `checkIfAlreadyLoggedin` action of the Auth Facade to see
    // if the token is available in LocalStorage (i.e., see if user was already
    // logged in or not)... But we don't need to call it here! Why? Because we
    // already have called it in the app's initialization phase (to be able to
    // fetch user's preferred language) before calling any protected API
    // endpoints.
    // this._authFacade.checkIfAlreadyLoggedin();

    // Get platform.
    this._platform = this._capacitorCoreService.getPlatform();
    if (this._capacitorCoreService.isPlatformSim) this._platform = 'desktop';

    // Get isNative.
    this._isNative = this._capacitorCoreService.isNativePlatform();

    // Get device UUID (if available).
    this._capacitorCoreService.deviceGetId().then((deviceIdInfo) => {
      if (deviceIdInfo) this._deviceUuid = deviceIdInfo?.identifier;
    });

    // Get some app info.
    this._capacitorCoreService.appGetInfo().then((info) => {
      if (info) this._nativeAppInfo = info;
    });
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Attach some app-specific data to ALL requests that wanna leave our app.
    req = this._attachAppInfo(req);

    // If the request is already `authentication/oauth/token`, it means that
    // we've already tried to refresh the token once... So instead of continuing
    // the code in the function, let's return refresh token URL request itself...
    // Why? Because in such case, we have already subscribed to the auth state
    // change in `_handle401Error` function... So stop the request processing
    // here, and continue in there.
    //
    // NOTE: How the refresh token can be expired? Well, we cannot just rely on
    // what is stored in the LocalStorage! Maybe the user didn't visit the app
    // in months... And the days until expiration that we've stored in the
    // LocalStorage is out of date by now...
    if (req.url.includes('authentication/oauth/token')) {
      // Let's also check if `req` has 'refresh_token' URL Query Param that is
      // 'refresh_token'.
      const urlParams = new URLSearchParams(req.url.split('?')[1]);
      if (urlParams.get('grant_type') === 'refresh_token') {
        return next.handle(req);
      }
    }

    // Let's first start subscribing to our own `authState` observable
    // and then switch to the request handle observable via `exhaustMap`
    // operator. Why? Because we need some data before knowing what we should do
    // with the request URL.
    return this._authFacade.authState$.pipe(
      take(1),
      exhaustMap((state) => {
        // If request is public, let it just continue its journey...
        if (this._isReqPublic(req.url, state.publicUrls)) {
          return next.handle(req);
        }

        // If we're here, it means that the request MUST be authenticated... So
        // first check to make sure that we have the token available (as we MUST
        // have it). If we don't have it, Just redirect user to the default page
        // of the app.
        if (!state.datas.getToken) {
          this._redirectToDefaultPath();
          console.error(`
          @AuthInterceptor/intercept: Token is required for '${req.url}' request,
          but it was not available!
          `);
          return throwError(() => 'Error');
        }

        // If we're here, it means that the request MUST be authenticated and we
        // also have all of the required data... So let's attach the token to
        // the request and then let it leave our app.
        this._tokenData = state.datas.getToken;
        const newReq = this._attachToken(req, this._tokenData.accessToken);
        return next.handle(newReq);
      }),
      catchError((err) => {
        // We can always receive any probable errors from server... But we are
        // ONLY interested in 401 errors, as they are related to the token
        // expiration! So if it's a 401 one, let's handle it to see if we can
        // refresh the token, and then try sending the original request again...
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this._handle401Error(
            req,
            next,
            this._tokenData as V1Auth_MapGetToken,
            err,
          );
        }

        // If it's not a 401 error, just let the error continue its journey...
        return throwError(() => err);
      }),
    );
  }

  /**
   * Test the request URL to see if it's public or not.
   *
   * @private
   * @param {string} url
   * @param {string[]} publicUrls
   * @returns {boolean}
   */
  private _isReqPublic(url: string, publicUrls: string[]) {
    // Let's first combine `publicUrls` with the common public URLs array.
    const commonPublicUrls = [
      'authentication/login/magiclink',
      'authentication/login/sms',
      'authentication/login/oauth',
      'authentication/bankid',
      'authentication/tickets',
      'authentication/oauth/token',
      'assets',
      'translations',
      'maintenance',
    ];
    const combinedPublicUrls = [...publicUrls, ...commonPublicUrls];

    // Now let's test the URL against each URL inside `combinedPublicUrls`
    // array. If it matches any of them, it means that the request is public.
    for (const pattern of combinedPublicUrls) {
      const regex = new RegExp(pattern);
      if (regex.test(url)) return true;
    }

    // If we're here, it means that the URL didn't match any of the public URLs,
    // so it's not public.
    return false;
  }

  /**
   * Attach some app-specific data to the request (as 'X-Xapp' custom headers)
   * before it leaves our app.
   *
   * NOTE: The API that we're sending the request to, must allow such custom
   * header via CORS configuration, otherwise the browser will block the
   * custom header. Server can also accept such custom header from trusted
   * origins (via `Access-Control-Allow-Origin`) only to avoid giving arbitrary
   * sites/apps an API surface.
   *
   * NOTE: In this function we should also bear in mind that the custom data
   * that we're sending in the header, must not be too large in size! Because
   * different servers/proxies impose limits on header sizes (commonly 4–8 KB).
   * So size of this custom header shouldn't be more than 700-800 bytes at
   * maximum.
   *
   * @private
   * @param {HttpRequest<unknown>} req
   * @returns {*}
   */
  private _attachAppInfo(req: HttpRequest<unknown>) {
    // Get app version.
    let appVersion: string | undefined = undefined;
    this._authFacade.appVersion$.pipe(take(1)).subscribe((version) => {
      appVersion = version;
    });

    // If we're here, it means that we have at least one piece of app info to
    // attach to the request. So let's attach them all (if available).
    return req.clone({
      setHeaders: {
        'X-Xapp': JSON.stringify({
          platform: this._platform,
          isNative: this._isNative,
          ...(appVersion ? { xVersion: appVersion } : {}),
          ...(this._nativeAppInfo ? { id: this._nativeAppInfo.id } : {}),
          ...(this._nativeAppInfo ? { name: this._nativeAppInfo.name } : {}),
          ...(this._nativeAppInfo
            ? { version: this._nativeAppInfo.version }
            : {}),
          ...(this._nativeAppInfo ? { build: this._nativeAppInfo.build } : {}),
          ...(this._deviceUuid ? { uuid: this._deviceUuid } : {}),
        }),
      },
    });
  }

  /**
   * Attach the token to the request before it leaves our app.
   *
   * @private
   * @param {HttpRequest<unknown>} req
   * @param {string} token
   * @returns {*}
   */
  private _attachToken(req: HttpRequest<unknown>, token: string) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  /**
   * Logout and redirect user to the default page of the app.
   *
   * @private
   */
  private _redirectToDefaultPath() {
    const params = this._route.snapshot.queryParams;
    this._authFacade.logout();
    this._router.navigate(['/'], { queryParams: params });
  }

  /**
   * Handle the 401 error by trying to refresh the token for the first request,
   * and queueing up the rest of the probable next requests to be sent with the
   * new token.
   *
   * @private
   * @param {HttpRequest<unknown>} req
   * @param {HttpHandler} next
   * @param {V1Auth_MapGetToken} tokenData
   * @param {unknown} error
   * @returns {*}
   */
  private _handle401Error(
    req: HttpRequest<unknown>,
    next: HttpHandler,
    tokenData: V1Auth_MapGetToken,
    error: unknown,
  ) {
    let baseUrl!: string;
    let clientId!: number;

    // If there's no refresh token at all (some clients don't have it), just
    // redirect.
    if (!tokenData.refreshToken) {
      this._redirectToDefaultPath();
      return throwError(() => error);
    }

    // Let's try to refresh the token... But while we're refreshing it, other
    // requests may come immediately right after the first request which has
    // gotten 401 error... That's why we don't try refreshing the token for the
    // next requests, but we queue them up (via `_refreshTokenSubj`) to be sent
    // out of our app, ONLY after that we have the new token stored.
    if (!this._isRefreshing) {
      // Let probable next requests know that we're trying to refresh the token.
      this._isRefreshing = true;
      this._refreshTokenSubj.next(null);

      // Start the Observable from `_configFacade` to save required data for the
      // rest of our operations.
      // NOTE: We already know that DEP config `data` is definitely truthy. How?
      // Our apps won't get initialized, unless DEP config gets loaded
      // successfully.
      return this._configFacade.dataConfigDep$.pipe(
        take(1),
        exhaustMap((data) => {
          data = data as V2Config_MapDep;

          // Save the required data for later use.
          baseUrl = data.general.baseUrl;
          clientId = data.general.clientId;

          // Use auth to refresh the token.
          this._authFacade.getTokenViaRefresh(
            baseUrl,
            clientId,
            tokenData.userId,
            tokenData.refreshToken as string,
          );

          // Switch to the `authState$` Observable.
          return this._authFacade.authState$;
        }),
        skip(1),
        take(1),
        exhaustMap((state) => {
          // Let probable next requests know that we're done refreshing the token.
          this._isRefreshing = false;

          // If we have the new token data, let's attach the token to the
          // request before it leaves our app, and call `next` method of
          // `_refreshTokenSubj` to emit the new token value to all subscribers.
          if (state.datas.getToken) {
            this._tokenData = state.datas.getToken;
            this._refreshTokenSubj.next(this._tokenData);
            const newReq = this._attachToken(req, this._tokenData.accessToken);
            return next.handle(newReq);
          }

          // If we're here, it means that we couldn't get the new token data,
          // then notify all requests of about the failure, redirect the page,
          // and throw an error.
          this._refreshTokenSubj.error(
            '@AuthInterceptor/_handle401Error: Token fetch failed',
          );
          this._redirectToDefaultPath();
          return throwError(() => error);
        }),
      );
    } else {
      return this._refreshTokenSubj.pipe(
        filter((token) => {
          return token !== null;
        }),
        take(1),
        switchMap((token) => {
          const newReq = this._attachToken(
            req,
            (token as V1Auth_MapGetToken).accessToken,
          );
          return next.handle(newReq);
        }),
      );
    }
  }
}
