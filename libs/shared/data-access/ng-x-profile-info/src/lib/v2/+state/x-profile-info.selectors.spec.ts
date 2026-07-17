import * as fromBlahblah from './blahblah.reducer';
import { selectEntityHasError } from './blahblah.selectors';

describe('VXBlahblah Selectors', () => {
  it('should select the feature state', () => {
    const state = {
      [fromBlahblah.blahblahFeatureKey]: {},
    };

    const result = selectEntityHasError('g')(state);

    expect(result).toEqual({});
  });
});
