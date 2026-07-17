import { v1XCreditReducer, v1XCreditInitialState } from './x-credit.reducer';

describe('V1XCredit Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = v1XCreditReducer(v1XCreditInitialState, action);

      expect(result).toBe(v1XCreditInitialState);
    });
  });
});
