import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { V1TranslationsEffects } from './translations.effects';

describe('V1TranslationsEffects', () => {
  let actions$: Observable<any>;
  let effects: V1TranslationsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [V1TranslationsEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(V1TranslationsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
