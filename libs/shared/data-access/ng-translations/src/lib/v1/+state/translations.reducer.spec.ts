import {
  v1TranslationsReducer,
  v1TranslationsInitialState,
} from './translations.reducer';

describe('Translations Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = v1TranslationsReducer(v1TranslationsInitialState, action);

      expect(result).toBe(v1TranslationsInitialState);
    });
  });
});
