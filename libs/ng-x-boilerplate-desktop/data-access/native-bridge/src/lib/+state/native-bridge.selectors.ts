import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNativeBridge from './native-bridge.reducer';

/**
 * Compute to see if there are any `errors` in the state.
 * Returns `true` if there's at least one error, otherwise `false`.
 *
 * @type {boolean}
 */
export const selectHasError = createSelector(
  fromNativeBridge.nativeBridgeFeature.selectNativeBridgeState,
  (state: fromNativeBridge.NativeBridge_State) => {
    return Object.values(state.errors).some((error) => error !== undefined);
  },
);
