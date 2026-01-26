import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';

/**
 * Base class for 'map' lib.
 *
 * Here's how the inherited classes use this (in most cases):
 * 01. Call `_logSuccess` whenever an API call succeeds.
 * 02. Call `_logFailure` whenever an API call fails.
 * 03. Optional! whenever an API call fails, call `_parsedError` to try to parse the error.
 *
 * Why `_logSuccess` & `_logFailure` functions accept a `lib` parameter, even
 * for the times that the 'map' lib belongs to a specific functionality and it's
 * NOT going to be used by other functionalities (i.e., it's not shared)?
 * Because, although 'map' & 'data-access' libs may belong to a specific
 * functionality, but over time, the 'feature' lib which imports and use them,
 * may get updated, while these libs are not required to be updated... So in
 * such cases, having `lib` parameter here, helps us to always receive the
 * 'feature' lib's name which also helps us to identify the lib's version too!
 *
 * @export
 * @class V1BaseMap
 * @typedef {V1BaseMap}
 */
export class V1BaseMap {
  protected readonly _http = inject(HttpClient);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Callback to be called whenever a 'map' lib's method call an API endpoint
   * and receives a successful response.
   *
   * @protected
   * @param {*} res Response received (body)
   * @param {HttpResponse<any>} meta Full HTTP response
   * @param {string} [lib='any'] Lib's name that requested an API endpoint. e.g., 'V1XUsersFeaComponent'
   */
  protected _logSuccess(res: any, meta: HttpResponse<any>, lib = 'any'): void {
    // ...
  }

  /**
   * Callback to be called whenever a 'map' lib's method call an API endpoint
   * and receives an error.
   *
   * @protected
   * @param {string | undefined} msg Error message (body), if available
   * @param {HttpErrorResponse} meta Full HTTP error response
   * @param {string} [lib='any'] Lib's name that requested an API endpoint. e.g., 'V1XUsersFeaComponent'
   */
  protected _logFailure(
    msg: string | undefined,
    meta: HttpErrorResponse,
    lib = 'any',
  ): void {
    // ...
  }

  /**
   * After we catch an error from the API response, here we try to parse it to
   * see if it's a JSON or not! If it's a customized error from API, then we
   * must be able to parse it successfully! If we couldn't, it means that the
   * error is something else because of any other reason...
   * If we parse it, we return the parsed object, otherwise, we return false.
   *
   * @protected
   * @param {*} error
   * @returns {(any | boolean)}
   */
  protected _parsedError(error: any): any | boolean {
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
