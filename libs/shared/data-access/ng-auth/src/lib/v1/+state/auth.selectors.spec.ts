import * as fromAuth from './auth.reducer';
import { selectHasError } from './auth.selectors';

describe('Auth Selectors', () => {
  it('should select the feature state', () => {
    const result = fromAuth.authFeature.selectV1AuthState({
      [fromAuth.authFeatureKey]: {},
    });

    expect(result).toEqual({});
  });
});
