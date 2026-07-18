import { v2XCreditReducer, v2XCreditInitialState } from './x-credit.reducer';

describe('V2XCredit Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = v2XCreditReducer(v2XCreditInitialState, action);

      expect(result).toBe(v2XCreditInitialState);
    });
  });
});
