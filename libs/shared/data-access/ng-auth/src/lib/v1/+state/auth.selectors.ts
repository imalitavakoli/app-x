import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from './auth.reducer';

// We can create more selectors by the help of `createFeature()` function
// export const selectErrorPlus = createSelector(
//   fromAuth.authFeature.selectAuthState,
//   (state: fromAuth.V1Auth_State) =>
//     state.errors ? `ERROR: ${state.errors}` : 'ERROR!',
// );

/**
 * Compute to see if there are any `errors` in the state.
 * Returns `true` if there's at least one error, otherwise `false`.
 *
 * @type {boolean}
 */
export const selectHasError = createSelector(
  fromAuth.authFeature.selectV1AuthState,
  (state: fromAuth.V1Auth_State) => {
    return Object.values(state.errors).some((error) => error !== undefined);
  },
);
