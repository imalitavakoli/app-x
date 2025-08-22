import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromTranslations from './translations.reducer';

/**
 * Compute to see if there are any `errors` in the state.
 * Returns `true` if there's at least one error, otherwise `false`.
 *
 * @type {boolean}
 */
export const selectHasError = createSelector(
  fromTranslations.translationsFeature.selectV1TranslationsState,
  (state: fromTranslations.V1Translations_State) => {
    return Object.values(state.errors).some((error) => error !== undefined);
  },
);
