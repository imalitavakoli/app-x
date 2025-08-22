/**
 * @file Here's a facade (proxy layer) that lets other libs to work with this
 * lib! Actually, here our facade class itself straightly uses the NgRx Store,
 * so other libs don't have to!
 */

import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { RoutePaths } from '@x/ng-x-boilerplate-desktop-map-native-bridge';
import { DepFacade } from '@x/ng-x-boilerplate-desktop-util-facade';

import {
  NativeBridge_State,
  nativeBridgeFeature,
  nativeBridgeFeatureKey,
} from './native-bridge.reducer';
import * as nativeBridgeSelectors from './native-bridge.selectors';
import { NativeBridgeActions } from './native-bridge.actions';

@Injectable({
  providedIn: 'root',
})
export class NativeBridgeFacade extends DepFacade {
  protected featureKey = nativeBridgeFeatureKey;

  protected handleMainProcessStateUpdate(
    updatedState: NativeBridge_State,
  ): void {
    this._store.dispatch(
      NativeBridgeActions.updateStateFromMainProcess({
        updatedState: updatedState,
      }),
    );
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Selectors: Let's select one option from our feature state object.        */
  /* //////////////////////////////////////////////////////////////////////// */

  state$ = this._store.pipe(
    select(nativeBridgeFeature.selectNativeBridgeState),
  );

  loadedLatest$ = this._store.pipe(
    select(nativeBridgeFeature.selectLoadedLatest),
  );
  loadeds$ = this._store.pipe(select(nativeBridgeFeature.selectLoadeds));
  errors$ = this._store.pipe(select(nativeBridgeFeature.selectErrors));
  datas$ = this._store.pipe(select(nativeBridgeFeature.selectDatas));

  hasError$ = this._store.pipe(select(nativeBridgeSelectors.selectHasError));

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions related to native windows                                        */
  /* //////////////////////////////////////////////////////////////////////// */

  doCloseWindow(winId: string) {
    this._store.dispatch(
      NativeBridgeActions.doCloseWindow({ stateId: ++this._stateId, winId }),
    );
    return this._stateId;
  }

  doOpenWindow(winId: string, windowConfigs: object, route: RoutePaths) {
    this._store.dispatch(
      NativeBridgeActions.doOpenWindow({
        stateId: ++this._stateId,
        winId,
        windowConfigs,
        route,
      }),
    );
    return this._stateId;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Actions related to File browser dialog                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  getFileDialog(
    fileTypes: { name: string; extensions: string[] }[],
    folderPath?: string,
  ) {
    this._store.dispatch(
      NativeBridgeActions.getFileDialog({
        stateId: ++this._stateId,
        fileTypes,
        folderPath,
      }),
    );
    return this._stateId;
  }

  putFileDialog(
    defaultPath?: string,
    filterGroups?: { name: string; extensions: string[] }[],
    title?: string,
  ) {
    this._store.dispatch(
      NativeBridgeActions.putFileDialog({
        stateId: ++this._stateId,
        defaultPath,
        filterGroups,
        title,
      }),
    );
    return this._stateId;
  }
}
