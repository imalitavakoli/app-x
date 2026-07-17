import { createFeature, createReducer, on } from '@ngrx/store';

import { XProfileInfoActions } from './x-profile-info.actions';
import {
  V2XProfileInfo_Errors,
  V2XProfileInfo_Loadeds,
  V2XProfileInfo_Datas,
  V2XProfileInfo_SuccessAction,
  V2XProfileInfo_FailureAction,
} from './x-profile-info.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const v2XProfileInfoFeatureKey = 'v2XProfileInfo';

export interface V2XProfileInfo_State {
  // blahblah: string | undefined;

  loadedLatest: V2XProfileInfo_Loadeds;
  loadeds: V2XProfileInfo_Loadeds;
  errors: V2XProfileInfo_Errors;
  datas: V2XProfileInfo_Datas;
}

// NOTE: Exported ONLY for test codes.
export const v2XProfileInfoInitialState: V2XProfileInfo_State = {
  // blahblah: undefined,

  loadedLatest: {} as V2XProfileInfo_Loadeds,
  loadeds: {} as V2XProfileInfo_Loadeds,
  errors: {} as V2XProfileInfo_Errors,
  datas: {} as V2XProfileInfo_Datas,
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

export const v2XProfileInfoReducer = createReducer(
  v2XProfileInfoInitialState,

  /* Get data /////////////////////////////////////////////////////////////// */

  on(
    XProfileInfoActions.getData,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      loadedLatest: { data: false },
      loadeds: { ...state.loadeds, data: undefined },
      errors: { ...state.errors, data: undefined },
      datas: { ...state.datas, data: undefined },
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(XProfileInfoActions.reset, (state) => v2XProfileInfoInitialState),

  on(
    XProfileInfoActions.success,
    (state, action): V2XProfileInfo_State => ({
      ...state,
      // ...setMorePropsBasedOnActSuccess(action),
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      datas: { ...state.datas, [action.relatedTo]: action.data },
    }),
  ),

  on(
    XProfileInfoActions.failure,
    (state, action): V2XProfileInfo_State => ({
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

export const v2XProfileInfoFeature = createFeature({
  name: v2XProfileInfoFeatureKey,
  reducer: v2XProfileInfoReducer,
});

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful functions                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// function setMorePropsBasedOnActSuccess(
//   action: V2XProfileInfo_SuccessAction,
// ): Partial<V2XProfileInfo_State> {
//   switch (action.relatedTo) {
//     case 'data':
//       return {
//         blahblah: action.extra?.['blahblah'],
//       };
//     default:
//       return {};
//   }
// }
