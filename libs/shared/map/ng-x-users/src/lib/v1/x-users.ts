import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { V1BaseMap } from '@x/shared-util-ng-bases';

import { V1XUsers_ApiUser, V1XUsers_MapUser } from './x-users.interfaces';

/**
 * Here we interact with the XUsers API related endpoints and do CRUD operations.
 *
 * @export
 * @class V1XUsers
 * @typedef {V1XUsers}
 */
@Injectable({
  providedIn: 'root',
})
export class V1XUsers extends V1BaseMap {
  private readonly _http = inject(HttpClient);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Set/Update/Delete entities                                               */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get all users
   * GET {url}/users
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1XUsers_MapUser[]>}
   */
  getAll(url: string, lib = 'any'): Observable<V1XUsers_MapUser[]> {
    // Here's the endpoint
    const endPoint = `${url}/users`; // Not using URL in our Boilerplate app

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable = this._http.get<V1XUsers_ApiUser[]>(
      'https://jsonplaceholder.typicode.com/users',
    );
    // const observable = this._http.get<V1XUsers_ApiUser[]>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        this._logSuccess(data, lib);
        return this._mapAll(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1XUsers/getAll:', error);
        this._logFailure(error, lib);
        return throwError(() => error);
      }),
    );
  }

  private _mapAll(data: V1XUsers_ApiUser[]): V1XUsers_MapUser[] {
    // Loop through the data and map it to the desired format.
    const map: V1XUsers_MapUser[] = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        username: item.username,
        email: item.email,
        createdAt: item.created_at || undefined,
      };
    });

    // Let's return the final array
    return map;
  }

  /**
   * Add one user
   * POST {url}/users
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {V1XUsers_MapUser} user
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1XUsers_MapUser>}
   */
  addOne(
    url: string,
    user: V1XUsers_MapUser,
    lib = 'any',
  ): Observable<V1XUsers_MapUser> {
    // Here's the endpoint
    const endPoint = `${url}/users`; // Not using URL in our Boilerplate app

    // Here's the data we're going to send
    const payload: V1XUsers_ApiUser = {
      name: user.name,
      username: user.username,
      email: user.email,
    };

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable = this._http.post<V1XUsers_ApiUser>(
      'https://jsonplaceholder.typicode.com/users',
      payload,
    );
    // const observable = this._http.post<V1XUsers_ApiUser>(endPoint, payload);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        this._logSuccess(data, lib);
        return this._mapOne(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1XUsers/addOne:', error);
        this._logFailure(error, lib);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Update one user
   * PUT {url}/users/{userId}
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {V1XUsers_MapUser} user
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1XUsers_MapUser>}
   */
  updateOne(
    url: string,
    user: V1XUsers_MapUser,
    lib = 'any',
  ): Observable<V1XUsers_MapUser> {
    // Here's the endpoint
    const endPoint = `${url}/users/${user.id}`; // Not using URL in our Boilerplate app

    // Here's the data we're going to send
    const payload: V1XUsers_ApiUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable = this._http.put<V1XUsers_ApiUser>(
      `https://jsonplaceholder.typicode.com/users/${user.id}`,
      payload,
    );
    // const observable = this._http.put<V1XUsers_ApiUser>(endPoint, payload);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        this._logSuccess(data, lib);
        return this._mapOne(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1XUsers/updateOne:', error);
        this._logFailure(error, lib);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Remove one user
   * DELETE {url}/users/{userId}
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {number} id
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<number>}
   */
  removeOne(url: string, id: number, lib = 'any'): Observable<number> {
    // Here's the endpoint
    const endPoint = `${url}/users/${id}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable = this._http.delete<unknown>(
      `https://jsonplaceholder.typicode.com/users/${id}`,
    );
    // const observable = this._http.delete<unknown>(endPoint);

    // Let's send the request
    return observable.pipe(
      map(() => {
        this._logSuccess(id, lib);
        return id;
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1XUsers/removeOne:', error);
        this._logFailure(error, lib);
        return throwError(() => error);
      }),
    );
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  private _mapOne(data: V1XUsers_ApiUser): V1XUsers_MapUser {
    // Let's save the response in the way we like it to be
    const map = {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      createdAt: data.created_at || undefined,
    };

    // Let's return the final object
    return map;
  }
}
