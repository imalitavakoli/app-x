import * as fromXCredit from './x-credit.reducer';
import {
  selectEntityHasError,
  selectEntitySummaryData,
} from './x-credit.selectors';

describe('V2XCredit Selectors', () => {
  it('should select the feature state', () => {
    const state = {
      [fromXCredit.v2XCreditFeatureKey]: {},
    };

    const result = selectEntityHasError('g')(state);

    expect(result).toEqual({});
  });
});
