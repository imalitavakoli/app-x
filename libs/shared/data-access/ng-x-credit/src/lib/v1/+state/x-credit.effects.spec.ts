import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';

import { V1XCreditEffects } from './x-credit.effects';

describe('V1XCreditEffects', () => {
  let actions$: Observable<any>;
  let effects: V1XCreditEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        V1XCreditEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        provideHttpClient(),
      ],
    });

    effects = TestBed.inject(V1XCreditEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
