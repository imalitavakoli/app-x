import * as fromConfig from './config.reducer';
import { selectConfigState } from './config.selectors';

describe('Config Selectors', () => {
  it('should select the feature state', () => {
    const result = selectConfigState({
      [fromConfig.configFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
