/**
 * @file This is our app's global store.
 */

import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  V2Config_State,
  v2ConfigReducer,
  V2ConfigEffects,
} from '@x/shared-data-access-ng-config';
import {
  V1Auth_State,
  V1AuthEffects,
  v1AuthReducer,
} from '@x/shared-data-access-ng-auth';
import {
  V1Translations_State,
  v1TranslationsReducer,
  V1TranslationsEffects,
} from '@x/shared-data-access-ng-translations';
import {
  V1XCredit_State,
  v1XCreditReducer,
  V1XCreditEffects,
} from '@x/shared-data-access-ng-x-credit';
import {
  V1XProfileInfo_State,
  v1XProfileInfoReducer,
  V1XProfileInfoEffects,
} from '@x/shared-data-access-ng-x-profile-info';
import {
  V1XUsers_State,
  v1XUsersReducer,
  V1XUsersEffects,
} from '@x/shared-data-access-ng-x-users';

/* ////////////////////////////////////////////////////////////////////////// */
/* App State Interface                                                        */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * The interface of our whole app state.
 *
 * @export
 * @interface State
 */
export interface State {
  v2Config: V2Config_State;
  v1Auth: V1Auth_State;
  v1Translations: V1Translations_State;
  v1XCredit: V1XCredit_State;
  v1XProfileInfo: V1XProfileInfo_State;
  v1XUsers: V1XUsers_State;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* App Reducer Object                                                         */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * our whole app's reducer object
 *
 * @export
 * @type {ActionReducerMap<State>}
 */
export const reducers: ActionReducerMap<State> = {
  v2Config: v2ConfigReducer,
  v1Auth: v1AuthReducer,
  v1Translations: v1TranslationsReducer,
  v1XCredit: v1XCreditReducer,
  v1XProfileInfo: v1XProfileInfoReducer,
  v1XUsers: v1XUsersReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];

/* ////////////////////////////////////////////////////////////////////////// */
/* App Effect Array                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

export const effects = [
  V2ConfigEffects,
  V1AuthEffects,
  V1TranslationsEffects,
  V1XCreditEffects,
  V1XProfileInfoEffects,
  V1XUsersEffects,
];
