# 'ng-x-credit' functionality 'map' lib samples

Here we share the sample files of a functionality called 'ng-x-credit', just for you as a source of inspiration.

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `README.md` (outer) file

Outer `README.md` file of a lib is the one which rests outside of the `src` folder.
It just mentions a high-level explanation of what the lib holds and does.

```md
# shared-map-ng-x-credit

Holds Angular apps' x-credit http loader.  
We receive JSON responses, modify them (if needed), and return an Observable which holds the results.

**For what functionality this lib is for?**
ng-x-credit.

**What data this lib fetches?**
User's credit summary/detailed data.
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `README.md` (inner) file

Inner `README.md` file of a lib is the one which rests inside of the `src` folder.  
It MUST include a ready-to-use code for copy-paste in the Test page of the Boilerplate app(s).

````md
# shared-map-ng-x-credit

x-credit v1.

## Implementation guide

We use it in the effects of 'shared-data-access-ng-x-credit' lib.

Here's an example of how to test the lib:

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1XCredit } from '@x/shared-map-ng-x-credit';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

/**
 * NOTE: When calling the lib's methods, we assume the following:
 *
 * The following properties are defined as the following for the app that is being served:
 * - In `apps/{app-name}/src/proxy.conf.json`:
 *   - For all API calls, `target = https://client-x-api.x.com`.
 * - In `apps/{app-name}/{assets-folder}/DEP_config.development.json`:
 *   - `general.environment.environment.items.base_url = /v1`.
 *   - `general.environment.environment.items.client_id = 1234567890`.
 *
 * For authenticated API requests, we assume that the following user is already logged in:
 * - https://admin.x.com/admin/users/123456
 *
 * @export
 * @class V1TestPageComponent
 * @typedef {V1TestPageComponent}
 */
@Component({
  selector: 'x-test-page-v1',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V1TestPageComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);

  // Note: When calling the lib's methods, we assume that
  private readonly _proxy = inject(V1XCredit);
  private readonly _baseUrl = '/v1';

  ngOnInit() {
    // Get Summary
    this._proxy
      .getSummary(this._baseUrl, 123)
      .pipe(
        take(1),
        map((data) => {
          console.log('getSummary:', data);
        }),
      )
      .subscribe();

    // Get Detail
    this._proxy
      .getDetail(this._baseUrl, 123)
      .pipe(
        take(1),
        map((data) => {
          console.log('getDetail:', data);
        }),
      )
      .subscribe();
  }
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-x-credit` to execute the unit tests.
````

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-credit.ts` file

It's the main file of a 'map' lib.

```ts
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { V1BaseMap } from '@x/shared-util-ng-bases';

import {
  V1XCredit_ApiSummary,
  V1XCredit_MapSummary,
} from './x-credit-summary.interfaces';
import {
  V1XCredit_ApiErrorDetail,
  V1XCredit_ApiDetail,
  V1XCredit_MapDetail,
} from './x-credit-detail.interfaces';

/**
 * Here we interact with the XCredit related API endpoint.
 *
 * @export
 * @class V1XCredit
 * @typedef {V1XCredit}
 */
@Injectable({
  providedIn: 'root',
})
export class V1XCredit extends V1BaseMap {
  // protected readonly _http = inject(HttpClient); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get summary data                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get user credit summary data.
   * GET {url}/users/{userId}/credit?type=summary
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1XCredit_MapSummary>}
   */
  getSummary(
    url: string,
    userId: number,
    lib = 'any',
  ): Observable<V1XCredit_MapSummary> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}/credit?type=summary`;

    const observable = this._http.get<V1XCredit_ApiSummary>(endPoint, {
      observe: 'response',
    });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, lib);
        return this._mapSummary(res.body as V1XCredit_ApiSummary);
      }),
      catchError((err) => {
        // NOTE: In this `catchError` we don't need to parse the errors, as we
        // don't have any error exceptions for the already called API endpoint.
        // So we just simply log the error.

        const error = err.message || err;
        console.error('@V1XCredit/getSummary:', error);
        this._logFailure(error.message || undefined, err, lib);
        return throwError(() => error);
      }),
    );
  }

  private _mapSummary(data: V1XCredit_ApiSummary): V1XCredit_MapSummary {
    // Let's save the response in the way we like it to be
    const map: V1XCredit_MapSummary = {
      userId: data.user_id,
      status: data.status,
      createdAt: data.created_at,
    };

    // Let's return the final result
    return map;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get detail data                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get user credit detail data.
   * GET {url}/users/{userId}/credit?type=detail
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1XCredit_MapDetail>}
   */
  getDetail(
    url: string,
    userId: number,
    lib = 'any',
  ): Observable<V1XCredit_MapDetail> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}/credit?type=detail`;

    const observable = this._http.get<V1XCredit_ApiDetail>(endPoint, {
      observe: 'response',
    });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, lib);
        return this._mapDetail(res.body as V1XCredit_ApiDetail);
      }),
      catchError((err) => {
        // NOTE: In this `catchError` we need to parse the errors, as we have
        // some error exceptions for the already called API endpoint. So parse
        // the error, and if it could get parsed via our Base class's function
        // `_parsedError`, it means that we've received an error which is
        // already handled by the server (i.e., it is an custom error), and we
        // can identify its `code` property to see if it should be considered as
        // an exception or not.

        const error = err.message || err;
        let errorParsed: any = false;

        // Try parsing the error (see if it's a custom server error or not).
        errorParsed = this._parsedError(err);

        // Log for non-custom errors, or custom ones which are NOT known as exceptions.
        if (!errorParsed || !errorParsed.code) {
          console.error('@V1XCredit/getDetail:', error);
        } else {
          if (errorParsed.code !== 'USER_MISSING_DETAIL_DATA') {
            console.error('@V1XCredit/getDetail:', error);
          }
        }

        // If parsed, return custom code. Otherwise, return generic error message.
        if (errorParsed && errorParsed.code) {
          this._logFailure(
            errorParsed.code as V1XCredit_ApiErrorDetail,
            err,
            lib,
          );
          return throwError(() => errorParsed.code as V1XCredit_ApiErrorDetail);
        }
        this._logFailure(error.message || undefined, err, lib);
        return throwError(() => error);
      }),
    );
  }

  private _mapDetail(data: V1XCredit_ApiDetail): V1XCredit_MapDetail {
    // Let's save the response in the way we like it to be
    const map: V1XCredit_MapDetail = {
      userId: data.user_id,
      balance: data.balance,
      balanceCurrency: data.balance_currency,
      updatedAt: data.updated_at,
      expiredAt: data.expired_at || undefined,
    };

    // Let's return the final result
    return map;
  }
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-credit-generic.interfaces.ts` file

One of the interface files that `x-credit.ts` imports.

```ts
export type V1XCredit_Style = 'rounded' | 'sharp';

export type V1XCredit_Status =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'failed';

export type V1XCredit_Currency = 'USD' | 'EUR' | 'GBP' | 'SEK';
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-credit-detail.interfaces.ts` file

One of the interface files that `x-credit.ts` imports.

```ts
import { V1XCredit_Currency } from './x-credit-generic.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* API: Payload, Error                                                        */
/* ////////////////////////////////////////////////////////////////////////// */

export type V1XCredit_ApiErrorDetail = 'USER_MISSING_DETAIL_DATA';

/* ////////////////////////////////////////////////////////////////////////// */
/* Get detail data                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_ApiDetail {
  user_id: number;
  balance: number;
  balance_currency: V1XCredit_Currency;
  updated_at: string; // '2022-05-01T00:00:00'
  expired_at?: string; // '2023-10-01T00:00:00'
}

export interface V1XCredit_MapDetail {
  userId: number;
  balance: number;
  balanceCurrency: V1XCredit_Currency;
  updatedAt: string; // '2022-05-01T00:00:00'
  expiredAt?: string; // '2023-10-01T00:00:00'
}
```

<!--
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
-->

&nbsp;

## `x-credit-summary.interfaces.ts` file

One of the interface files that `x-credit.ts` imports.

```ts
import { V1XCredit_Status } from './x-credit-generic.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Get summary data                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_ApiSummary {
  user_id: number;
  status: V1XCredit_Status;
  created_at: string; // '2022-05-01T00:00:00'
}

export interface V1XCredit_MapSummary {
  userId: number;
  status: V1XCredit_Status;
  createdAt: string; // '2022-05-01T00:00:00'
}
```
