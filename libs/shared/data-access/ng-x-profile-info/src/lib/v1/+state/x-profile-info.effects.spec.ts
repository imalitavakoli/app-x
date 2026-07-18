import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { V1XProfileInfoEffects } from './x-profile-info.effects';

describe('V1XProfileInfoEffects', () => {
  let actions$: Observable<any>;
  let effects: V1XProfileInfoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        V1XProfileInfoEffects,
        provideMockActions(() => actions$),
        provideHttpClient(),
      ],
    });

    effects = TestBed.inject(V1XProfileInfoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
