import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError, from } from 'rxjs';

import {
  NativeBridge_ApiCloseWindow,
  NativeBridge_ApiGetFileDialog,
  NativeBridge_ApiOpenWindow,
  NativeBridge_ApiPutFileDialog,
  NativeBridge_ApiTest,
  NativeBridge_MapCloseWindow,
  NativeBridge_MapGetFileDialog,
  NativeBridge_MapOpenWindow,
  NativeBridge_MapPutFileDialog,
  NativeBridge_MapTest,
  RoutePaths,
} from './native-bridge.interfaces';

/**
 * Here we interact with the Translations (API).
 *
 * @export
 * @class NativeBridge
 * @typedef {NativeBridge}
 */
@Injectable({
  providedIn: 'root',
})
export class NativeBridge {
  private readonly _http = inject(HttpClient);

  getTest(url: string): Observable<NativeBridge_MapTest> {
    const endPoint = `https://jsonplaceholder.typicode.com/posts`; // Not using URL in our Boilerplate app

    // Let's send the request
    return this._http.get<NativeBridge_ApiTest>(endPoint).pipe(
      map((data) => {
        return this._mapTest(data);
      }),
      catchError((err) => {
        const error = err.message || err;
        console.error('@NativeBridge/getTest:', error);
        return throwError(() => error);
      }),
    );
  }

  private _mapTest(data: NativeBridge_ApiTest) {
    return data as NativeBridge_MapTest;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Native window                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  closeNativeWindow(
    stateId: number,
    winId: string,
  ): Observable<NativeBridge_MapCloseWindow> {
    return from(window?.electron_winManager.closeWindow(winId)).pipe(
      map((result: NativeBridge_ApiCloseWindow) =>
        this._mapCloseNativeWindow(stateId, result, winId),
      ),
      catchError((error) => {
        console.error('@NativeBridge/doCloseNativeWindow:', error);
        throw error;
      }),
    );
  }

  private _mapCloseNativeWindow(
    stateId: number,
    result: NativeBridge_ApiCloseWindow,
    winId: string,
  ) {
    return {
      stateId: stateId,
      status: result?.status || false,
      win_id: result?.win_id || winId,
      msg: result?.msg || 'No message provided',
    } as NativeBridge_MapCloseWindow;
  }

  openNativeWindow(
    stateId: number,
    winId: string,
    windowConfigs: object,
    route: RoutePaths,
  ): Observable<NativeBridge_MapOpenWindow> {
    return from(
      window?.electron_winManager.createWindow(winId, windowConfigs, route),
    ).pipe(
      map((result: NativeBridge_ApiOpenWindow) =>
        this._mapOpenNativeWindow(stateId, result),
      ),
      catchError((error) => {
        console.error('@NativeBridge/doOpenNativeWindow:', error);
        throw error;
      }),
    );
  }

  private _mapOpenNativeWindow(
    stateId: number,
    result: NativeBridge_ApiOpenWindow,
  ) {
    return {
      stateId: stateId,
      new_win_created: result?.new_win_created || false,
      existing_win_focused: result?.existing_win_focused || false,
      win_id: result?.win_id || undefined,
      native_id: result?.native_id || undefined,
    } as NativeBridge_MapOpenWindow;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* File dialog                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  getFileDialog(
    stateId: number,
    fileTypes: { name: string; extensions: string[] }[],
    folderPath?: string,
  ): Observable<NativeBridge_MapGetFileDialog> {
    return from(window?.electron_dialog.getFile(fileTypes, folderPath)).pipe(
      map((result: NativeBridge_ApiGetFileDialog) =>
        this._mapGetFileDialog(stateId, result),
      ),
      catchError((error) => {
        console.error('@NativeBridge/getFileDialog:', error);
        throw error;
      }),
    );
  }

  private _mapGetFileDialog(
    stateId: number,
    result: NativeBridge_ApiGetFileDialog,
  ) {
    return {
      stateId: stateId,
      status: result?.status || false,
      path: result?.path || undefined,
      msg: result?.msg || undefined,
    } as NativeBridge_MapGetFileDialog;
  }

  putFileDialog(
    stateId: number,
    defaultPath?: string,
    filterGroups?: { name: string; extensions: string[] }[],
    title?: string,
  ): Observable<NativeBridge_MapPutFileDialog> {
    return from(
      window?.electron_dialog.putFile(defaultPath, filterGroups, title),
    ).pipe(
      map((result: NativeBridge_ApiPutFileDialog) =>
        this._mapPutFileDialog(stateId, result),
      ),
      catchError((error) => {
        console.error('@NativeBridge/putFileDialog:', error);
        throw error;
      }),
    );
  }

  private _mapPutFileDialog(
    stateId: number,
    result: NativeBridge_ApiPutFileDialog,
  ) {
    return {
      stateId: stateId,
      status: result?.status || false,
      path: result?.path || undefined,
      msg: result?.msg || undefined,
    } as NativeBridge_MapPutFileDialog;
  }
}
