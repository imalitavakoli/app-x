import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';

import { V2XCreditEffects } from './x-credit.effects';

describe('V2XCreditEffects', () => {
  let actions$: Observable<any>;
  let effects: V2XCreditEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        V2XCreditEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        provideHttpClient(),
      ],
    });

    effects = TestBed.inject(V2XCreditEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
