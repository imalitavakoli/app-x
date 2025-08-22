import { createFeature, createReducer, on } from '@ngrx/store';

import { AuthActions } from './auth.actions';
import { V1Auth_Errors, V1Auth_Loadeds, V1Auth_Datas } from './auth.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const authFeatureKey = 'v1Auth';

export interface V1Auth_State {
  publicUrls: string[];
  protectedInitialPath: string;

  loadedLatest: V1Auth_Loadeds;
  loadeds: V1Auth_Loadeds;
  errors: V1Auth_Errors;
  datas: V1Auth_Datas;
}

// NOTE: Exported ONLY for test codes.
export const initialState: V1Auth_State = {
  publicUrls: [],
  protectedInitialPath: '/dashboard',

  loadedLatest: {} as V1Auth_Loadeds,
  loadeds: {} as V1Auth_Loadeds,
  errors: {} as V1Auth_Errors,
  datas: {} as V1Auth_Datas,
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

export const v1AuthReducer = createReducer(
  initialState,

  /* Auth by: Magic ///////////////////////////////////////////////////////// */

  on(
    AuthActions.magicSendLoginLink,
    (state, action): V1Auth_State => ({
      ...state,

      // Whenever an action specific to one data is called, we set the
      // `loadedLatest` object all over again, with holding ONLY that data's
      // related property (in this case `magicSendLoginLink`), and we equal it
      // to false. Why? Because of 2 reasons:
      // 1. In component's logic: When we subscribe to `authState$`, we
      // can easily check logics for each data, each time the state changes for
      // any reasons... In our case we can define
      // `state.loadedLatest.magicSendLoginLink && state.datas.magicSendLoginLink`
      // if statment, and only get into the if block, when `magicSendLoginLink`
      // is going to change, not anything else... So when another action is
      // called, `state.loadedLatest.magicSendLoginLink` will no longer be truthy.
      // 2. In component's template: We can easily use if block to show a
      // loading graphic when needed. In our case, we can define
      // `@if ( (authFacade.loadedLatest$| async)?.magicSendLoginLink === false )`
      // to show a loading graphic, ONLY IF `magicSendLoginLink` is equal to
      // `false`! i.e., if it's `true` or `undefined`, it won't be shown...
      // Distinguishing `undefined` and `false` is specifically useful, for
      // deciding when to show a loading graphic! Because at the begining, no
      // data is loaded (so `magicSendLoginLink` is `undefined`), but when we call
      // the action, it's `false` (because it's loading), and when it's loaded,
      // it's `true`!
      loadedLatest: { magicSendLoginLink: false },

      loadeds: { ...state.loadeds, magicSendLoginLink: undefined },
      errors: { ...state.errors, magicSendLoginLink: undefined },
      datas: { ...state.datas, magicSendLoginLink: undefined },
    }),
  ),

  on(
    AuthActions.checkIfLinkSeen,
    (state, action): V1Auth_State => ({
      ...state,
      loadedLatest: { checkIfLinkSeen: false },
      loadeds: { ...state.loadeds, checkIfLinkSeen: undefined },
      errors: { ...state.errors, checkIfLinkSeen: undefined },
      datas: { ...state.datas, checkIfLinkSeen: undefined },
    }),
  ),

  /* Auth by: Bankid //////////////////////////////////////////////////////// */

  on(
    AuthActions.bankidGetRequiredData,
    (state, action): V1Auth_State => ({
      ...state,
      loadedLatest: { bankidGetRequiredData: false },
      loadeds: { ...state.loadeds, bankidGetRequiredData: undefined },
      errors: { ...state.errors, bankidGetRequiredData: undefined },
      datas: { ...state.datas, bankidGetRequiredData: undefined },
    }),
  ),

  on(
    AuthActions.bankidCheckIfAuthenticated,
    (state, action): V1Auth_State => ({
      ...state,
      loadedLatest: { bankidCheckIfAuthenticated: false },
      loadeds: { ...state.loadeds, bankidCheckIfAuthenticated: undefined },
      errors: { ...state.errors, bankidCheckIfAuthenticated: undefined },
      datas: { ...state.datas, bankidCheckIfAuthenticated: undefined },
    }),
  ),

  /* Auth by: Magic, Bankid ///////////////////////////////////////////////// */

  on(
    AuthActions.getTokenViaTicket,
    (state, action): V1Auth_State => ({
      ...state,
      loadedLatest: { getToken: false },
      loadeds: { ...state.loadeds, getToken: undefined },
      errors: { ...state.errors, getToken: undefined },
      datas: { ...state.datas, getToken: undefined },
    }),
  ),

  on(
    AuthActions.getTokenViaRefresh,
    (state, action): V1Auth_State => ({
      ...state,
      loadedLatest: { getToken: false },
      loadeds: { ...state.loadeds, getToken: undefined },
      errors: { ...state.errors, getToken: undefined },
      datas: { ...state.datas, getToken: undefined },
    }),
  ),

  /* Auth by: SSO (auto-login) ////////////////////////////////////////////// */

  on(
    AuthActions.autoGetTicketId,
    (state, action): V1Auth_State => ({
      ...state,
      loadedLatest: { getToken: false },
      loadeds: { ...state.loadeds, getToken: undefined },
      errors: { ...state.errors, getToken: undefined },
      datas: { ...state.datas, autoGetTicketId: undefined },
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(
    AuthActions.setPublicUrls,
    (state, action): V1Auth_State => ({
      ...state,
      publicUrls: action.urls,
    }),
  ),

  on(
    AuthActions.setProtectedInitialPath,
    (state, action): V1Auth_State => ({
      ...state,
      protectedInitialPath: action.path,
    }),
  ),

  // Reset everything to its initial state, EXCEPT `publicUrls` and `protectedInitialPath`.
  on(
    AuthActions.logout,
    (state, action): V1Auth_State => ({
      ...state,
      loadedLatest: {},
      loadeds: {},
      errors: {},
      datas: {},
    }),
  ),

  on(
    AuthActions.success,
    (state, action): V1Auth_State => ({
      ...state,
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      datas: { ...state.datas, [action.relatedTo]: action.data },
    }),
  ),

  on(
    AuthActions.failure,
    (state, action): V1Auth_State => ({
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

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer: v1AuthReducer,
});
