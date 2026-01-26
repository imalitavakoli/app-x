import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { V1BaseMap } from '@x/shared-util-ng-bases';
import { v1LanguageGetCode } from '@x/shared-util-formatters';

import {
  V1Translations_ApiAllLangs,
  V1Translations_ApiSelectedLang,
  V1Translations_ApiTrans,
  V1Translations_MapAllLangs,
  V1Translations_MapSelectedLang,
  V1Translations_MapTrans,
  V1Translations_ApiPayloadSelectedLang,
} from './translations.interfaces';

/**
 * Here we interact with the Translations (API).
 *
 * @export
 * @class V1Translations
 * @typedef {V1Translations}
 */
@Injectable({
  providedIn: 'root',
})
export class V1Translations extends V1BaseMap {
  // protected readonly _http = inject(HttpClient); // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get translations in a specific language                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get translations.
   * GET {url}/translations?client_id={clientId}&language_code={cultureCode}
   *
   * @param {string} url
   * @param {number} clientId
   * @param {string} [cultureCode='en-GB']
   * @param {string} [modules='']
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1Translations_MapTrans>}
   */
  getTranslations(
    url: string,
    clientId: number,
    cultureCode = 'en-GB',
    modules: string[] = [],
    lib = 'any',
  ): Observable<V1Translations_MapTrans> {
    // Here's the endpoint
    const modulesStr = modules.join(',');
    const endPoint = `${url}/translations?client_id=${clientId}&language_code=${cultureCode}&modules=${modulesStr}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable = this._http.get<V1Translations_ApiTrans>(url, {
      observe: 'response',
    });
    // const observable = this._http.get<V1Translations_ApiTrans>(endPoint, { observe: 'response' });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, lib);
        return this._mapTranslations(res.body as V1Translations_ApiTrans);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Translations/getTranslations:', error);
        this._logFailure(error.message || undefined, err, lib);
        return throwError(() => error);
      }),
    );
  }

  private _mapTranslations(data: V1Translations_ApiTrans) {
    // We don't do any specific proxying for translations, so we just return the
    // data as it is.
    return data as V1Translations_MapTrans;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Get client all available langs & user selected lang                      */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Get client all available languages.
   * GET {url}/clients/info
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1Translations_MapAllLangs>}
   */
  getAllLangs(
    url: string,
    lib = 'any',
  ): Observable<V1Translations_MapAllLangs> {
    // Here's the endpoint
    const endPoint = `${url}/clients/info`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<HttpResponse<V1Translations_ApiAllLangs>> = of(
      new HttpResponse<V1Translations_ApiAllLangs>({
        body: {
          language_codes: ['en-GB', 'sv-SE'],
        },
        status: 200,
        statusText: 'OK',
        url: endPoint,
      }),
    );
    // const observable = this._http.get<V1Translations_ApiAllLangs>(endPoint, { observe: 'response' });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, lib);
        return this._mapAllLangs(res.body as V1Translations_ApiAllLangs);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Translations/getAllLangs:', error);
        this._logFailure(error.message || undefined, err, lib);
        return throwError(() => error);
      }),
    );
  }

  private _mapAllLangs(data: V1Translations_ApiAllLangs) {
    // Let's save the response in the way we like it to be
    const map: V1Translations_MapAllLangs = {
      codes: data.language_codes.map((code) => {
        return {
          id: code,
          label: v1LanguageGetCode(code),
        };
      }),
    };

    // Let's return the final object
    return map;
  }

  /**
   * Get user selected language.
   * GET {url}/users/{userId}
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1Translations_MapSelectedLang>}
   */
  getSelectedLang(
    url: string,
    userId: number,
    lib = 'any',
  ): Observable<V1Translations_MapSelectedLang> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<HttpResponse<V1Translations_ApiSelectedLang>> =
      of(
        new HttpResponse<V1Translations_ApiSelectedLang>({
          body: {
            id: 123,
            client_id: 1234567890,
            ext_ref: 'external_reference',
            language_code: 'en-GB',
            is_integrationless_user: false,
          },
          status: 200,
          statusText: 'OK',
          url: endPoint,
        }),
      );
    // const observable = this._http.get<V1Translations_ApiSelectedLang>(endPoint, { observe: 'response' });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, lib);
        return this._mapSelectedLang(
          res.body as V1Translations_ApiSelectedLang,
        );
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Translations/getSelectedLang:', error);
        this._logFailure(error.message || undefined, err, lib);
        return throwError(() => error);
      }),
    );
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Set user selected lang                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Set user selected language.
   * PATCH {url}/users/{userId}
   * Authenticated: Via 'shared-data-access-ng-auth' lib interceptor.
   *
   * @param {string} url
   * @param {number} userId
   * @param {string} [cultureCode='en-GB']
   * @param {string} [lib='any'] Lib's name that requested an API endpoint.
   * @returns {Observable<V1Translations_MapSelectedLang>}
   */
  patchSelectedLang(
    url: string,
    userId: number,
    cultureCode = 'en-GB',
    lib = 'any',
  ): Observable<V1Translations_MapSelectedLang> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}`;

    // Build the API required payload structure.
    const payload: V1Translations_ApiPayloadSelectedLang[] = [
      {
        op: 'replace',
        path: '/language_code',
        value: cultureCode,
      },
    ];

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<HttpResponse<V1Translations_ApiSelectedLang>> =
      of(
        new HttpResponse<V1Translations_ApiSelectedLang>({
          body: {
            id: 123,
            client_id: 1234567890,
            ext_ref: 'external_reference',
            language_code: cultureCode,
            is_integrationless_user: false,
          },
          status: 200,
          statusText: 'OK',
          url: endPoint,
        }),
      );
    // const observable = this._http.patch<V1Translations_ApiSelectedLang>(endPoint, payload, { observe: 'response' });

    // Let's send the request
    return observable.pipe(
      map((res) => {
        this._logSuccess(res.body, res, lib);
        return this._mapSelectedLang(
          res.body as V1Translations_ApiSelectedLang,
        );
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Translations/patchSelectedLang:', error);
        this._logFailure(error.message || undefined, err, lib);
        return throwError(() => error);
      }),
    );
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  private _mapSelectedLang(data: V1Translations_ApiSelectedLang) {
    // Let's save the response in the way we like it to be
    const map: V1Translations_MapSelectedLang = {
      id: data.language_code,
      label: v1LanguageGetCode(data.language_code),
    };

    // Let's return the final object
    return map;
  }
}
