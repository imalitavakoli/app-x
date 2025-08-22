/**
 * @file Selectors select part of our app (feature) state object.
 * They will be used in our components, to show part of our feature state
 * whenever it changes. e.g., `selectLoaded` selector is simply selecting the
 * `loaded` option in our state object.
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromConfig from './config.reducer';

// We can create more selectors by the help of `createFeature()` function
// export const selectErrorPlus = createSelector(
//   fromConfig.configFeature.selectV2ConfigState,
//   (state: fromConfig.V2Config_State) =>
//     state.errorConfigDep ? `ERROR: ${state.errorConfigDep}` : 'ERROR!',
// );
