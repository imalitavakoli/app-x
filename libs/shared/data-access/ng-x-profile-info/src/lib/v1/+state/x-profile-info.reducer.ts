import { createFeature, createReducer, on } from '@ngrx/store';

import { XProfileInfoActions } from './x-profile-info.actions';
import {
  V1XProfileInfo_Errors,
  V1XProfileInfo_Loadeds,
  V1XProfileInfo_Datas,
  V1XProfileInfo_SuccessAction,
  V1XProfileInfo_FailureAction,
} from './x-profile-info.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const xProfileInfoFeatureKey = 'v1XProfileInfo';

export interface V1XProfileInfo_State {
  // blahblah: string | undefined;

  loadedLatest: V1XProfileInfo_Loadeds;
  loadeds: V1XProfileInfo_Loadeds;
  errors: V1XProfileInfo_Errors;
  datas: V1XProfileInfo_Datas;
}

// NOTE: Exported ONLY for test codes.
export const initialState: V1XProfileInfo_State = {
  // blahblah: undefined,

  loadedLatest: {} as V1XProfileInfo_Loadeds,
  loadeds: {} as V1XProfileInfo_Loadeds,
  errors: {} as V1XProfileInfo_Errors,
  datas: {} as V1XProfileInfo_Datas,
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

export const v1XProfileInfoReducer = createReducer(
  initialState,

  /* Get data /////////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.getData,
    (state, action): V1XProfileInfo_State => ({
      ...state,
      loadedLatest: { data: false },
      loadeds: { ...state.loadeds, data: undefined },
      errors: { ...state.errors, data: undefined },
      datas: { ...state.datas, data: undefined },
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(XProfileInfoActions.reset, (state) => initialState),

  on(
    XProfileInfoActions.success,
    (state, action): V1XProfileInfo_State => ({
      ...state,
      // ...setMorePropsBasedOnActSuccess(action),
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      datas: { ...state.datas, [action.relatedTo]: action.data },
    }),
  ),

  on(
    XProfileInfoActions.failure,
    (state, action): V1XProfileInfo_State => ({
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

export const xProfileInfoFeature = createFeature({
  name: xProfileInfoFeatureKey,
  reducer: v1XProfileInfoReducer,
});

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful functions                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// function setMorePropsBasedOnActSuccess(
//   action: V1XProfileInfo_SuccessAction,
// ): Partial<V1XProfileInfo_State> {
//   switch (action.relatedTo) {
//     case 'data':
//       return {
//         blahblah: action.extra?.['blahblah'],
//       };
//     default:
//       return {};
//   }
// }
