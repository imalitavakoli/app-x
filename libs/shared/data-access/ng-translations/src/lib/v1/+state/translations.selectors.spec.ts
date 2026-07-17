import * as fromTranslations from './translations.reducer';
import { selectHasError } from './translations.selectors';

describe('Translations Selectors', () => {
  it('should select the feature state', () => {
    const result =
      fromTranslations.v1TranslationsFeature.selectV1TranslationsState({
        [fromTranslations.v1TranslationsFeatureKey]: {},
      });

    expect(result).toEqual({});
  });
});
