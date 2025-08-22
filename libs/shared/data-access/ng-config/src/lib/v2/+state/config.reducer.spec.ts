import { v2ConfigReducer, initialState } from './config.reducer';

describe('Config Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = v2ConfigReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
