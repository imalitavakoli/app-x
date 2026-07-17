import { v1XCreditReducer, initialState } from './x-credit.reducer';

describe('V1XCredit Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = v1XCreditReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
