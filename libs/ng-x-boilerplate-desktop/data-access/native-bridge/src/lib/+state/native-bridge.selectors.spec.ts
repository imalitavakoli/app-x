import * as fromTranslations from './native-bridge.reducer';
import { selectHasError } from './native-bridge.selectors';

describe('Translations Selectors', () => {
  it('should select the feature state', () => {
    const result =
      fromTranslations.translationsFeature.selectV1TranslationsState({
        [fromTranslations.translationsFeatureKey]: {},
      });

    expect(result).toEqual({});
  });
});
