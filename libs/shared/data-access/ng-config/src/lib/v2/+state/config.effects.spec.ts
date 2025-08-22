import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { V2ConfigEffects } from './config.effects';

describe('V2ConfigEffects', () => {
  let actions$: Observable<any>;
  let effects: V2ConfigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [V2ConfigEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(V2ConfigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
