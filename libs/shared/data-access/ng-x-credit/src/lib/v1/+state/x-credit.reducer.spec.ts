import { vXBlahblahReducer, initialState } from './blahblah.reducer';

describe('VXBlahblah Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = vXBlahblahReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
