import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';

import { V2XProfileInfoEffects } from './x-profile-info.effects';

describe('V2XProfileInfoEffects', () => {
  let actions$: Observable<any>;
  let effects: V2XProfileInfoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        V2XProfileInfoEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        provideHttpClient(),
      ],
    });

    effects = TestBed.inject(V2XProfileInfoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
