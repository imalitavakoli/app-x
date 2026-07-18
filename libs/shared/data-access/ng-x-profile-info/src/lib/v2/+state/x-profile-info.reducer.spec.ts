import {
  v2XProfileInfoReducer,
  v2XProfileInfoInitialState,
} from './x-profile-info.reducer';

describe('V2XProfileInfo Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = v2XProfileInfoReducer(v2XProfileInfoInitialState, action);

      expect(result).toBe(v2XProfileInfoInitialState);
    });
  });
});
