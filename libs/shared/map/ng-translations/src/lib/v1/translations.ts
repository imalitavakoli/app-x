import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

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
export class V1Translations {
  private readonly _http = inject(HttpClient);

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
   * @returns {Observable<V1Translations_MapTrans>}
   */
  getTranslations(
    url: string,
    clientId: number,
    cultureCode = 'en-GB',
    modules: string[] = [],
  ): Observable<V1Translations_MapTrans> {
    // Here's the endpoint
    const modulesStr = modules.join(',');
    const endPoint = `${url}/translations?client_id=${clientId}&language_code=${cultureCode}&modules=${modulesStr}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable = this._http.get<V1Translations_ApiTrans>(url);
    // const observable = this._http.get<V1Translations_ApiTrans>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapTranslations(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Translations/getTranslations:', error);
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
   * @returns {Observable<V1Translations_MapAllLangs>}
   */
  getAllLangs(url: string): Observable<V1Translations_MapAllLangs> {
    // Here's the endpoint
    const endPoint = `${url}/clients/info`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Translations_ApiAllLangs> = of({
      language_codes: ['en-GB', 'sv-SE'],
    });
    // const observable = this._http.get<V1Translations_ApiAllLangs>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapAllLangs(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Translations/getAllLangs:', error);
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
   * @returns {Observable<V1Translations_MapSelectedLang>}
   */
  getSelectedLang(
    url: string,
    userId: number,
  ): Observable<V1Translations_MapSelectedLang> {
    // Here's the endpoint
    const endPoint = `${url}/users/${userId}`;

    // MOCK TEMP CODE: Replace this with the actual HTTP request.
    const observable: Observable<V1Translations_ApiSelectedLang> = of({
      id: 123,
      client_id: 1234567890,
      ext_ref: 'external_reference',
      language_code: 'en-GB',
      is_integrationless_user: false,
    });
    // const observable = this._http.get<V1Translations_ApiSelectedLang>(endPoint);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapSelectedLang(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Translations/getSelectedLang:', error);
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
   * @returns {Observable<V1Translations_MapSelectedLang>}
   */
  patchSelectedLang(
    url: string,
    userId: number,
    cultureCode = 'en-GB',
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
    const observable: Observable<V1Translations_ApiSelectedLang> = of({
      id: 123,
      client_id: 1234567890,
      ext_ref: 'external_reference',
      language_code: cultureCode,
      is_integrationless_user: false,
    });
    // const observable = this._http.patch<V1Translations_ApiSelectedLang>(endPoint, payload);

    // Let's send the request
    return observable.pipe(
      map((data) => {
        return this._mapSelectedLang(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@V1Translations/patchSelectedLang:', error);
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
