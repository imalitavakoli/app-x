import * as fromXProfileInfo from './x-profile-info.reducer';
import { selectHasError } from './x-profile-info.selectors';

describe('V2XProfileInfo Selectors', () => {
  it('should select the feature state', () => {
    const result =
      fromXProfileInfo.v2XProfileInfoFeature.selectV2XProfileInfoState({
        [fromXProfileInfo.v2XProfileInfoFeatureKey]: {},
      });

    expect(result).toEqual({});
  });
});
