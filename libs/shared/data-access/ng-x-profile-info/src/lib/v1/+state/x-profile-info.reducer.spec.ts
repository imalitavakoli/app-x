import {
  v1XProfileInfoReducer,
  v1XProfileInfoInitialState,
} from './x-profile-info.reducer';

describe('V1XProfileInfo Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = v1XProfileInfoReducer(v1XProfileInfoInitialState, action);

      expect(result).toBe(v1XProfileInfoInitialState);
    });
  });
});
