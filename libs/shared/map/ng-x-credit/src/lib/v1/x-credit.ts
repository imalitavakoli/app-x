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

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<HttpResponse<V1XCredit_ApiSummary>> = of(
      new HttpResponse<V1XCredit_ApiSummary>({
        body: {
          user_id: userId,
          status: 'active',
          created_at: '2023-10-01T00:00:00',
        },
        status: 200,
        statusText: 'OK',
        url: endPoint,
      }),
    );
    // const observable = this._http.get<V1XCredit_ApiSummary>(endPoint, { observe: 'response' });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, 'GET', undefined, lib);
        return this._mapSummary(res.body as V1XCredit_ApiSummary);
      }),
      catchError((err) => {
        // NOTE: In this `catchError` we don't have any error exceptions for the
        // already called API endpoint.

        const errParsed = this._parsedError(err); // Try parsing the error to see if it's a custom (expected) server error.
        let errToLog = err.message || undefined;
        if (errParsed && errParsed['code']) errToLog = errParsed['code'];
        this._logFailure(errToLog, err, 'GET', undefined, lib);
        console.error('@V1XCredit/getSummary:', err.message || err); // NOTE: Log the error message (when available) to keep 'WebNative' logs easier to read.
        return throwError(() => errToLog || err.message || err);
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

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<HttpResponse<V1XCredit_ApiDetail>> = of(
      new HttpResponse<V1XCredit_ApiDetail>({
        body: {
          user_id: userId,
          balance: 1000,
          balance_currency: 'USD',
          updated_at: '2023-10-01T00:00:00',
          expired_at: '2024-10-01T00:00:00',
        },
        status: 200,
        statusText: 'OK',
        url: endPoint,
      }),
    );
    // const observable = this._http.get<V1XCredit_ApiDetail>(endPoint, { observe: 'response' });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, 'GET', undefined, lib);
        return this._mapDetail(res.body as V1XCredit_ApiDetail);
      }),
      catchError((err) => {
        // NOTE: In this `catchError` we have some error exceptions for the
        // already called API endpoint. So we shold parse the error to see if
        // it's a custom (expected) server error! And if it is, let's see if we
        // can identify its `code` property or not! To see if it should be
        // considered as an exception or not.

        const errParsed = this._parsedError(err); // Try parsing the error to see if it's a custom (expected) server error.
        let errToLog = err.message || undefined;
        if (errParsed && errParsed['code']) errToLog = errParsed['code']; // As `V1XCredit_ApiErrorDetail`.
        this._logFailure(errToLog, err, 'GET', undefined, lib);

        // Do `console.error` for non-custom errors OR custom ones which are NOT known as exceptions.
        // NOTE: Log the error message (when available) to keep 'WebNative' logs easier to read.
        if (!errParsed || !errParsed['code']) {
          console.error('@V1XCredit/getDetail:', err.message || err);
        } else {
          if (errParsed['code'] !== 'USER_MISSING_DETAIL_DATA') {
            console.error('@V1XCredit/getDetail:', err.message || err);
          }
        }

        return throwError(() => errToLog || err.message || err);
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
