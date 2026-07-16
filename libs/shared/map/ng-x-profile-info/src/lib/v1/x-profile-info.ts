import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { V1BaseMap } from '@x/shared-util-ng-bases';

import {
  V1XProfileInfo_ApiData,
  V1XProfileInfo_MapData,
} from './x-profile-info.interfaces';

/**
 * Here we interact with the XProfileInfo related API endpoint.
 *
 * @export
 * @class V1XProfileInfo
 * @typedef {V1XProfileInfo}
 */
@Injectable({
  providedIn: 'root',
})
export class V1XProfileInfo extends V1BaseMap {
  // protected readonly _http = inject(HttpClient); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get data                                                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get user profile-info data.
   * GET {url}/users/{userId}/profile-info
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1XProfileInfo_MapData>}
   */
  getData(
    url: string,
    userId: number,
    lib = 'any',
  ): Observable<V1XProfileInfo_MapData> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}/profile-info`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<HttpResponse<V1XProfileInfo_ApiData>> = of(
      new HttpResponse<V1XProfileInfo_ApiData>({
        body: {
          user_id: userId,
          full_name: 'John Doe',
          date_of_birth: '1991-05-01T00:00:00',
          bio: 'Software Developer',
          country: 'USA',
        },
        status: 200,
        statusText: 'OK',
        url: endPoint,
      }),
    );
    // const observable = this._http.get<V1XProfileInfo_ApiData>(endPoint, { observe: 'response' });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, 'GET', undefined, lib);
        return this._mapData(res.body as V1XProfileInfo_ApiData);
      }),
      catchError((err) => {
        const errParsed = this._parsedError(err); // Try parsing the error to see if it's a custom (expected) server error.
        let errToLog = err.message || undefined;
        if (errParsed && errParsed['code']) errToLog = errParsed['code'];
        this._logFailure(errToLog, err, 'GET', undefined, lib);
        console.error('@V1XProfileInfo/getData:', err.message || err); // NOTE: Log the error message (when available) to keep 'WebNative' logs easier to read.
        return throwError(() => errToLog || err.message || err);
      }),
    );
  }

  private _mapData(data: V1XProfileInfo_ApiData): V1XProfileInfo_MapData {
    // Let's save the response in the way we like it to be
    const map: V1XProfileInfo_MapData = {
      userId: data.user_id,
      fullName: data.full_name,
      dateOfBirth: data.date_of_birth,
      bio: data.bio || undefined,
      country: data.country || undefined,
    };

    // Let's return the final result
    return map;
  }
}
