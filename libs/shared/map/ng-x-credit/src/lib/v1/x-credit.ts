import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

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
export class V1XCredit {
  private readonly _http = inject(HttpClient);

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
   * @returns {Observable<V1XCredit_MapSummary>}
   */
  getSummary(url: string, userId: number): Observable<V1XCredit_MapSummary> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}/credit?type=summary`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1XCredit_ApiSummary> = of({
      user_id: userId,
      status: 'active',
      created_at: '2023-10-01T00:00:00',
    });
    // const observable = this._http.get<V1XCredit_ApiSummary>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapSummary(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1XCredit/getSummary:', error);
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
   * @returns {Observable<V1XCredit_MapDetail>}
   */
  getDetail(url: string, userId: number): Observable<V1XCredit_MapDetail> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}/credit?type=detail`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1XCredit_ApiDetail> = of({
      user_id: userId,
      balance: 1000,
      balance_currency: 'USD',
      updated_at: '2023-10-01T00:00:00',
      expired_at: '2024-10-01T00:00:00',
    });
    // const observable = this._http.get<V1XCredit_ApiDetail>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapDetail(data);
      }),
      catchError((err) => {
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
          return throwError(() => errorParsed.code as V1XCredit_ApiErrorDetail);
        }
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

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * After we catch an error from the API response, here we try to parse it to
   * see if it's a JSON or not! If it's a customized error from API, then we
   * must be able to parse it successfully! If we couldn't, it means that the
   * error is something else because of any other reason...
   * If we parse it, we return the parsed object, otherwise, we return false.
   *
   * @private
   * @param {*} error
   * @returns {(any | boolean)}
   */
  private _parsedError(error: any): any | boolean {
    // If `error.error` is already an object, just return itself.
    if (error['error'] && error['error'] instanceof Object) return error.error;

    // If `error.error` was NOT an object, we would be here. So try to parse it.
    let err;
    try {
      err = JSON.parse(error.error);
      return err;
    } catch (error) {
      return false;
    }
  }
}
