import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromXProfileInfo from './x-profile-info.reducer';

/**
 * Compute to see if there are any `errors` in the state.
 * Returns `true` if there's at least one error, otherwise `false`.
 *
 * @type {boolean}
 */
export const selectHasError = createSelector(
  fromXProfileInfo.xProfileInfoFeature.selectV1XProfileInfoState,
  (state: fromXProfileInfo.V1XProfileInfo_State) => {
    return Object.values(state.errors).some((error) => error !== undefined);
  },
);
