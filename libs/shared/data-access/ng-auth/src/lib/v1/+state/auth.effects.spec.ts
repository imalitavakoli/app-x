import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { V1AuthEffects } from './auth.effects';

describe('V1AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: V1AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [V1AuthEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(V1AuthEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
