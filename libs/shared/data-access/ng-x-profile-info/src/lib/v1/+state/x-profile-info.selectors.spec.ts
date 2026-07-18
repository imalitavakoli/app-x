import * as fromXProfileInfo from './x-profile-info.reducer';

describe('V1XProfileInfo Selectors', () => {
  it('should select the feature state', () => {
    const result =
      fromXProfileInfo.v1XProfileInfoFeature.selectV1XProfileInfoState({
        [fromXProfileInfo.v1XProfileInfoFeatureKey]: {},
      });

    expect(result).toEqual({});
  });
});
