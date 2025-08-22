import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { v1AuthActivateIfNotLoggedin } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      v1AuthActivateIfNotLoggedin(...guardParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
