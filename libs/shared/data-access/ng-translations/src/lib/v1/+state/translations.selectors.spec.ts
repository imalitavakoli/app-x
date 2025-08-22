import * as fromTranslations from './translations.reducer';
import { selectHasError } from './translations.selectors';

describe('Translations Selectors', () => {
  it('should select the feature state', () => {
    const result =
      fromTranslations.translationsFeature.selectV1TranslationsState({
        [fromTranslations.translationsFeatureKey]: {},
      });

    expect(result).toEqual({});
  });
});
