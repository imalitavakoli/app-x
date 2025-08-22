import { createFeature, createReducer, on } from '@ngrx/store';
import { NativeBridgeActions } from './native-bridge.actions';
import {
  NativeBridge_Errors,
  NativeBridge_Loadeds,
  NativeBridge_Datas,
  NativeBridge_SuccessAction,
  NativeBridge_FailureAction,
} from './native-bridge.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

export const nativeBridgeFeatureKey = 'nativeBridge';

export interface NativeBridge_State {
  loadedLatest: NativeBridge_Loadeds;
  loadeds: NativeBridge_Loadeds;
  errors: NativeBridge_Errors;
  datas: NativeBridge_Datas;
}

export const initialState: NativeBridge_State = {
  loadedLatest: {} as NativeBridge_Loadeds,
  loadeds: {} as NativeBridge_Loadeds,
  errors: {} as NativeBridge_Errors,
  datas: {} as NativeBridge_Datas,
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

export const nativeBridgeReducer = createReducer(
  initialState,

  /* test /////////////////////////////////////////////////////////////////// */

  on(
    NativeBridgeActions.getTest,
    (state, action): NativeBridge_State => ({
      ...state,
      loadedLatest: { test: false },
      loadeds: { ...state.loadeds, test: undefined },
      errors: { ...state.errors, test: undefined },
      datas: { ...state.datas, test: undefined },
    }),
  ),

  /* //////////////////////////////////////////////////////////////////////// */
  /* Native window                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  on(
    NativeBridgeActions.doCloseWindow,
    (state, action): NativeBridge_State => ({
      ...state,
      loadedLatest: { closeWindow: undefined },
      loadeds: { ...state.loadeds, closeWindow: undefined },
      errors: { ...state.errors, closeWindow: undefined },
      datas: { ...state.datas, closeWindow: undefined },
    }),
  ),

  on(
    NativeBridgeActions.doOpenWindow,
    (state, action): NativeBridge_State => ({
      ...state,
      loadedLatest: { openWindow: undefined },
      loadeds: { ...state.loadeds, openWindow: undefined },
      errors: { ...state.errors, openWindow: undefined },
      datas: { ...state.datas, openWindow: undefined },
    }),
  ),

  /* //////////////////////////////////////////////////////////////////////// */
  /* File dialog                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  on(
    NativeBridgeActions.getFileDialog,
    (state, action): NativeBridge_State => ({
      ...state,
      loadedLatest: { getFileDialog: undefined },
      loadeds: { ...state.loadeds, getFileDialog: undefined },
      errors: { ...state.errors, getFileDialog: undefined },
      datas: { ...state.datas, getFileDialog: undefined },
    }),
  ),

  on(
    NativeBridgeActions.putFileDialog,
    (state, action): NativeBridge_State => ({
      ...state,
      loadedLatest: { putFileDialog: undefined },
      loadeds: { ...state.loadeds, putFileDialog: undefined },
      errors: { ...state.errors, putFileDialog: undefined },
      datas: { ...state.datas, putFileDialog: undefined },
    }),
  ),

  /* //////////////////////////////////////////////////////////////////////// */
  /* Handle state update from main process                                    */
  /* //////////////////////////////////////////////////////////////////////// */

  on(
    NativeBridgeActions.updateStateFromMainProcess,
    (state, { updatedState: updatedState }): NativeBridge_State => ({
      loadedLatest: updatedState.loadedLatest,
      loadeds: { ...state.loadeds, ...updatedState.loadeds },
      errors: { ...state.errors, ...updatedState.errors },
      datas: { ...state.datas, ...updatedState.datas },
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(
    NativeBridgeActions.success,
    (state, action): NativeBridge_State => ({
      ...state,
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      datas: { ...state.datas, [action.relatedTo]: action.data },
    }),
  ),

  on(
    NativeBridgeActions.failure,
    (state, action): NativeBridge_State => ({
      ...state,
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      errors: { ...state.errors, [action.relatedTo]: action.error },
    }),
  ),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Selectors (auto generated via `createFeature()`)             */
/* ////////////////////////////////////////////////////////////////////////// */

export const nativeBridgeFeature = createFeature({
  name: nativeBridgeFeatureKey,
  reducer: nativeBridgeReducer,
});
