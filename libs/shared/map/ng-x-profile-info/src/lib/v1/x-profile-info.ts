import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

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
export class V1XProfileInfo {
  private readonly _http = inject(HttpClient);

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
   * @returns {Observable<V1XProfileInfo_MapData>}
   */
  getData(url: string, userId: number): Observable<V1XProfileInfo_MapData> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}/profile-info`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1XProfileInfo_ApiData> = of({
      user_id: userId,
      full_name: 'John Doe',
      date_of_birth: '1991-05-01T00:00:00',
      bio: 'Software Developer',
      country: 'USA',
    });
    // const observable = this._http.get<V1XProfileInfo_ApiData>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapData(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1XProfileInfo/getData:', error);
        return throwError(() => error);
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
