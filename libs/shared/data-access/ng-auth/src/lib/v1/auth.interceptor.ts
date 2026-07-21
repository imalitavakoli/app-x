import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Observable,
  catchError,
  exhaustMap,
  filter,
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

import {
  V1CapacitorCoreService,
  V1CapacitorCore_AppInfo,
} from '@x/shared-util-ng-capacitor';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1Auth_MapGetToken } from '@x/shared-map-ng-auth';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

import { V1AuthFacade } from './+state/auth.facade';

@Injectable()
export class V1AuthInterceptor implements HttpInterceptor {
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _configFacade = inject(V2ConfigFacade);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);

  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  private _platform: 'ios' | 'android' | 'desktop' = 'desktop';
  private _isNative = false;
  private _deviceUuid?: string = undefined; // Desktop apps don't have a device UUID.
  private _nativeAppInfo: V1CapacitorCore_AppInfo | null = null; // Desktop apps don't have native app info.

  /**
   * The SINGLE in-flight refresh for the current expiry cycle.
   *
   * This one shared reference is what guarantees that
   * `GET .../authentication/oauth/token?grant_type=refresh_token` is called
   * EXACTLY ONCE per refresh cycle (i.e., a given refresh token is never spent
   * twice): the first 401 creates it and fires the request; every concurrent
   * 401 reuses the same observable instead of starting its own refresh. It is
   * reset back to `null` (via `finalize`) as soon as the cycle resolves, so a
   * later expiry (e.g. after re-login) can refresh again. See `_refreshToken`.
   */
  private _refresh$: Observable<V1Auth_MapGetToken> | null = null;

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

    // This IS the refresh-token call itself (grant_type=refresh_token). Let it
    // go straight to the backend, untouched:
    //   1. It authenticates via the `refresh_token` URL query param, NOT a
    //      Bearer access token — so we must not attach one.
    //   2. Its result must be handled ONLY by the auth effect (success/failure
    //      → store), never by this interceptor's 401 handler. Returning here
    //      keeps it out of the `catchError`/`_handle401Error` path, so a failed
    //      refresh can't recursively trigger another refresh — and it can't
    //      deadlock on the in-flight `_refresh$` guard below (it would end up
    //      waiting on itself).
    //
    // NOTE: `authentication/oauth/token` is also a public URL, so it would
    // bypass token attachment anyway; this early return is the explicit,
    // list-independent safeguard for the two guarantees above.
    if (req.url.includes('authentication/oauth/token')) {
      // Let's also check if `req` has 'refresh_token' URL Query Param that is
      // 'refresh_token'.
      const urlParams = new URLSearchParams(req.url.split('?')[1]);
      if (urlParams.get('grant_type') === 'refresh_token') {
        return next.handle(req);
      }
    }

    // Remember which token THIS request was sent with. If it later gets a 401,
    // we can compare it against the current token to detect a "stale" 401 (one
    // where a refresh has already happened in the meantime) and avoid kicking
    // off a redundant, racing refresh. See `_handle401Error`.
    let usedTokenData: V1Auth_MapGetToken | null = null;

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

        // If a token refresh is ALREADY in flight, do NOT send this request
        // with the token that's currently in the store — during the refresh
        // window that is the expiring token, so sending now would just earn a
        // guaranteed 401 (an extra, pointless round-trip). Instead, wait for the
        // in-flight refresh and send straight away with the NEW token. This is
        // what makes requests that START mid-refresh behave like the queued
        // ones: they leave the app only once, and only with a fresh token.
        if (this._refresh$) {
          return this._refresh$.pipe(
            switchMap((newToken) => {
              usedTokenData = newToken;
              return next.handle(this._attachToken(req, newToken.accessToken));
            }),
          );
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
        usedTokenData = state.datas.getToken;
        const newReq = this._attachToken(req, usedTokenData.accessToken);
        return next.handle(newReq);
      }),
      catchError((err) => {
        // We can always receive any probable errors from server... But we are
        // ONLY interested in 401 errors, as they are related to the token
        // expiration! So if it's a 401 one, let's handle it to see if we can
        // refresh the token, and then try sending the original request again...
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this._handle401Error(req, next, usedTokenData, err);
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
      'clients/signup/url',
      'assets',
      'translations',
      'maintenance',
      'updatePriority',
      'payment/paypoint/guest/',
      'payment/paypoint/token',
      'config/branding',
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

    // Attach every piece of app info we have. `platform` and `isNative` are
    // always present; the rest are included only when available.
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
   * Log the user out on the front-end and redirect to the default page.
   *
   * NOTE: Unlike elsewhere in the app, we do NOT call `postLogout` (the
   * server-side logout) here. By the time we reach this point, either the
   * refresh/access tokens are already invalid on the server (a failed refresh)
   * or we simply have no usable access token to begin with — and `postLogout`
   * itself requires a valid Access-Token. So a server-side logout is neither
   * possible nor needed; clearing the session on the front-end is enough.
   *
   * @private
   */
  private _redirectToDefaultPath() {
    const params = this._route.snapshot.queryParams;
    this._authFacade.logout();
    this._router.navigate(['/'], { queryParams: params });
  }

  /**
   * Handle a 401 by joining a single shared token refresh, then replaying the
   * request with the new token. The first 401 of a cycle starts the refresh;
   * every concurrent 401 reuses the SAME in-flight refresh (see `_refreshToken`)
   * and replays once it resolves. A "stale" 401 (a newer token already exists)
   * is replayed without refreshing, and when there is no refresh token / no
   * active session the user is redirected instead.
   *
   * @private
   * @param {HttpRequest<unknown>} req
   * @param {HttpHandler} next
   * @param {V1Auth_MapGetToken | null} tokenData The token THIS request was sent with.
   * @param {unknown} error The original 401 error.
   * @returns {Observable<HttpEvent<unknown>>}
   */
  private _handle401Error(
    req: HttpRequest<unknown>,
    next: HttpHandler,
    tokenData: V1Auth_MapGetToken | null,
    error: unknown,
  ): Observable<HttpEvent<unknown>> {
    // If there's no refresh token at all (some clients don't have it), just
    // redirect.
    if (!tokenData || !tokenData.refreshToken) {
      this._redirectToDefaultPath();
      return throwError(() => error);
    }

    // NOTE: `tokenData` is the token THIS request was actually sent with (see
    // `intercept`), NOT a shared field that other requests may have mutated.
    const usedToken = tokenData;

    // Before refreshing, look at the CURRENT token in the auth state. Why?
    // Several requests may have left our app carrying the same expired access
    // token; their 401 responses then trickle back over a short window. By the
    // time a "late" 401 arrives, an earlier 401 may have ALREADY refreshed the
    // token. In that case this 401 is stale: we must NOT refresh again (a
    // second refresh would spend the refresh token a second time, race the
    // first one, and log the user out). Instead we just replay the request with
    // the token that's already there.
    return this._authFacade.authState$.pipe(
      take(1),
      exhaustMap((current) => {
        const currentToken = current.datas.getToken;

        // If the store has NO token at all, the user was logged out while this
        // request was in flight (e.g. a `logout` elsewhere cleared the state).
        // Do NOT refresh — reviving the session with the old refresh token here
        // would silently undo that logout. Just redirect.
        if (!currentToken) {
          this._redirectToDefaultPath();
          return throwError(() => error);
        }

        // STALE 401: a newer token already exists (an earlier 401 already
        // refreshed). Replay with it instead of refreshing again.
        if (currentToken.accessToken !== usedToken.accessToken) {
          return next.handle(this._attachToken(req, currentToken.accessToken));
        }

        // The token really is expired and nobody has a fresh one yet. Join the
        // single shared refresh (`_refreshToken` starts it once and hands the
        // same in-flight observable to every concurrent 401), then replay THIS
        // request with whatever new access token it produces.
        return this._refreshToken(usedToken).pipe(
          switchMap((newToken) =>
            next.handle(this._attachToken(req, newToken.accessToken)),
          ),
          // The refresh failed (the redirect/logout is done once inside
          // `_refreshToken`). Propagate the ORIGINAL 401 for this request.
          catchError(() => throwError(() => error)),
        );
      }),
    );
  }

  /**
   * Refresh the access token EXACTLY ONCE per expiry cycle.
   *
   * The first 401 that reaches here creates `_refresh$`, dispatches the single
   * `getTokenViaRefresh` request, and multicasts the result (via `shareReplay`)
   * so every concurrent 401 that arrives while the refresh is in flight reuses
   * the SAME observable — nobody spends the refresh token a second time.
   *
   * Completion is detected from the SPECIFIC resolution of this refresh (a
   * genuinely new access token, or an error recorded for `getToken`), NOT from
   * "the next auth-state emission" — unrelated auth actions also emit, so
   * blindly taking the next emission could resolve the refresh against the
   * wrong state.
   *
   * @private
   * @param {V1Auth_MapGetToken} usedToken The (expired) token this cycle refreshes.
   * @returns {Observable<V1Auth_MapGetToken>} Emits the fresh token, or errors.
   */
  private _refreshToken(
    usedToken: V1Auth_MapGetToken,
  ): Observable<V1Auth_MapGetToken> {
    // A refresh is already underway for this cycle → reuse it. THIS is the
    // single-flight guard that prevents a duplicate refresh-token request.
    if (this._refresh$) return this._refresh$;

    this._refresh$ = this._configFacade.dataConfigDep$.pipe(
      take(1),
      // Kick off the one-and-only refresh request for this cycle.
      // NOTE: We already know that DEP config `data` is definitely truthy. How?
      // Our apps won't get initialized, unless DEP config gets loaded
      // successfully.
      tap((data) => {
        const dep = data as V2Config_MapDep;
        this._authFacade.getTokenViaRefresh(
          dep.general.baseUrl,
          dep.general.clientId,
          usedToken.userId,
          usedToken.refreshToken as string,
        );
      }),
      // Wait for THIS refresh to resolve: either a new access token appears
      // (success) or an error is recorded for `getToken` (failure).
      switchMap(() =>
        this._authFacade.authState$.pipe(
          filter(
            (state) =>
              !!state.errors.getToken ||
              (!!state.datas.getToken &&
                state.datas.getToken.accessToken !== usedToken.accessToken),
          ),
          take(1),
          map((state) => {
            if (
              !state.datas.getToken ||
              state.datas.getToken.accessToken === usedToken.accessToken
            ) {
              throw new Error(
                state.errors.getToken ??
                  '@AuthInterceptor/_refreshToken: Token refresh failed',
              );
            }
            return state.datas.getToken;
          }),
        ),
      ),
      catchError((err) => {
        // The refresh failed → the session is unrecoverable. Redirect ONCE
        // (this pipeline is shared across all queued requests) and propagate the
        // error so each queued request can fail out.
        this._redirectToDefaultPath();
        return throwError(() => err);
      }),
      // Release the cycle (on success, failure, or unsubscription) so a LATER
      // expiry — e.g. after the user logs back in — can refresh again. This also
      // replaces the old "swap in a fresh BehaviorSubject after an error" hack:
      // a brand-new observable is built for the next cycle.
      finalize(() => {
        this._refresh$ = null;
      }),
      // Multicast the single refresh to every concurrent 401. `refCount: false`
      // keeps the one refresh alive to completion even if some requests are
      // cancelled mid-flight, so we never fire a second refresh for this cycle.
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this._refresh$;
  }
}
