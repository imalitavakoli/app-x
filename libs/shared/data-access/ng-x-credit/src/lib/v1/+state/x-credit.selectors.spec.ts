import * as fromXCredit from './x-credit.reducer';
import { selectEntityHasError } from './x-credit.selectors';

describe('V1XCredit Selectors', () => {
  it('should select the feature state', () => {
    const state = {
      [fromXCredit.v1XCreditFeatureKey]: {},
    };

    const result = selectEntityHasError('g')(state);

    expect(result).toEqual({});
  });
});
