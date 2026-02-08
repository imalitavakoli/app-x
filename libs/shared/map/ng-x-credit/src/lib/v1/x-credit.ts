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
