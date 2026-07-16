import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';

/**
 * Base class for 'map' lib.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO INHERIT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 01. Call `_logSuccess` whenever an API call succeeds.
 * 02. Call `_logFailure` whenever an API call fails.
 * 03. Optional! whenever an API call fails, call `_parsedError` to try to parse the error.
 *
 * Why `_logSuccess` & `_logFailure` functions accept a `lib` parameter, even
 * for the times that the 'map' lib belongs to a specific functionality and it's
 * NOT going to be used by other functionalities (i.e., it's not shared across
 * multiple functionalities)?
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
export abstract class V1BaseMap {
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
   * @param {string} reqMethod HTTP method used to request the API endpoint. e.g., 'GET', 'POST', etc.
   * @param {*} reqBody HTTP request body. Available for POST/PUT/PATCH requests, otherwise, it's undefined
   * @param {string} [lib] Lib's name that requested an API endpoint. e.g., 'V1XUsersFeaComponent'
   */
  protected _logSuccess(
    res: any,
    meta: HttpResponse<any>,
    reqMethod: string,
    reqBody?: any,
    lib?: string,
  ): void {
    // ...
  }

  /**
   * Callback to be called whenever a 'map' lib's method call an API endpoint
   * and receives an error.
   *
   * @protected
   * @param {string | undefined} msg Error message (body), if available
   * @param {HttpErrorResponse} meta Full HTTP error response
   * @param {string} reqMethod HTTP method used to request the API endpoint. e.g., 'GET', 'POST', etc.
   * @param {*} reqBody HTTP request body. Available for POST/PUT/PATCH requests, otherwise, it's undefined
   * @param {string} [lib] Lib's name that requested an API endpoint. e.g., 'V1XUsersFeaComponent'
   */
  protected _logFailure(
    msg: string | undefined,
    meta: HttpErrorResponse,
    reqMethod: string,
    reqBody?: any,
    lib?: string,
  ): void {
    // ...
  }

  /**
   * Attempts to extract a structured error object from an HTTP error response.
   *
   * Angular's `HttpErrorResponse.error` can be:
   * - A **parsed JSON object** (when the server returns `Content-Type: application/json`)
   * - A **string** (when the server returns plain text, HTML, or unparsed JSON)
   * - A **`ProgressEvent`** (on network-level failures: CORS, timeout, DNS, offline)
   * - **`null`** (e.g. empty 500 bodies, 204s that errored in interceptors)
   *
   * This method normalizes all those cases into either:
   * - A **plain object** (the parsed error body) — if the server sent structured JSON.
   * - **`false`** — if the error is not a structured server response.
   *
   * @protected
   * @param {*} error - Typically an `HttpErrorResponse`, but typed as `any` for
   *   flexibility since callers may not always guarantee the exact type.
   * @returns {(Record<string, any> | false)} A plain object with the parsed
   *   error body, or `false` if the error could not be parsed as a structured
   *   server response.
   */
  protected _parsedError(error: any): Record<string, any> | false {
    const body = error?.error;

    // 1. Nothing to parse.
    if (body == null) return false;

    // 2. Network-level failure (CORS, timeout, offline) — not a server response.
    if (typeof ProgressEvent !== 'undefined' && body instanceof ProgressEvent) {
      return false;
    }

    // 3. Already a parsed plain object (Angular auto-parsed JSON body).
    //    Excludes arrays, Blobs, ArrayBuffers, and other non-plain objects.
    if (
      typeof body === 'object' &&
      !Array.isArray(body) &&
      !(body instanceof Blob) &&
      !(body instanceof ArrayBuffer)
    ) {
      return body;
    }

    // 4. String body — could be a JSON string the server sent without the
    //    correct Content-Type, or plain text / HTML.
    if (typeof body === 'string') {
      // Only attempt parse if it looks like JSON (starts with `{`).
      const trimmed = body.trim();
      if (trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed);
          // Ensure the parsed result is actually a plain object.
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
          // Not valid JSON — fall through.
        }
      }
      return false;
    }

    // 5. Any other type (number, boolean, array, Blob, etc.) — not usable.
    return false;
  }
}
