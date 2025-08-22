/**
 * @file Our feature state is actually a reducer. It's a function that accepts
 * our feature state object and will be called by NgRx automatically when an
 * action occurs.
 * In our reducer we can ONLY do synchronous tasks. Like updating the options of
 * our state object.
 * Generally speaking, reducer is here to do ONLY one task, and that's updating
 * our feature state object.
 */

import { createFeature, createReducer, on } from '@ngrx/store';

import {
  V2Config_MapDataBuild,
  V2Config_MapDep,
  V2Config_MapFirebase,
} from '@x/shared-map-ng-config';

import { ConfigActions } from './config.actions';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const configFeatureKey = 'v2Config';

export interface V2Config_State {
  loadedConfigDep: boolean;
  errorConfigDep: string | undefined;
  dataConfigDep: V2Config_MapDep | undefined;

  loadedConfigFirebase: boolean;
  errorConfigFirebase: string | undefined;
  dataConfigFirebase: V2Config_MapFirebase | undefined;

  loadedDataBuild: boolean;
  errorDataBuild: string | undefined;
  dataDataBuild: V2Config_MapDataBuild | undefined;
}

// NOTE: Exported ONLY for test codes.
export const initialState: V2Config_State = {
  loadedConfigDep: false,
  errorConfigDep: undefined,
  dataConfigDep: undefined,

  loadedConfigFirebase: false,
  errorConfigFirebase: undefined,
  dataConfigFirebase: undefined,

  loadedDataBuild: false,
  errorDataBuild: undefined,
  dataDataBuild: undefined,
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

export const v2ConfigReducer = createReducer(
  initialState,

  /* Load Config: DEP /////////////////////////////////////////////////////// */

  on(
    ConfigActions.loadConfigDepSuccess,
    (state, action): V2Config_State => ({
      ...state,
      loadedConfigDep: true,
      dataConfigDep: action.data,
    }),
  ),

  on(
    ConfigActions.loadConfigDepFailure,
    (state, action): V2Config_State => ({
      ...state,
      loadedConfigDep: true,
      errorConfigDep: action.error,
    }),
  ),

  /* Load Config: Firebase ////////////////////////////////////////////////// */

  on(
    ConfigActions.loadConfigFirebaseSuccess,
    (state, action): V2Config_State => ({
      ...state,
      loadedConfigFirebase: true,
      dataConfigFirebase: action.data,
    }),
  ),

  on(
    ConfigActions.loadConfigFirebaseFailure,
    (state, action): V2Config_State => ({
      ...state,
      loadedConfigFirebase: true,
      errorConfigFirebase: action.error,
    }),
  ),

  /* Load Data: Build /////////////////////////////////////////////////////// */

  on(
    ConfigActions.loadDataBuildSuccess,
    (state, action): V2Config_State => ({
      ...state,
      loadedDataBuild: true,
      dataDataBuild: action.data,
    }),
  ),

  on(
    ConfigActions.loadDataBuildFailure,
    (state, action): V2Config_State => ({
      ...state,
      loadedDataBuild: true,
      errorDataBuild: action.error,
    }),
  ),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Selectors (auto generated via `createFeature()`)             */
/* ////////////////////////////////////////////////////////////////////////// */

export const configFeature = createFeature({
  name: configFeatureKey,
  reducer: v2ConfigReducer,
});
