import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { VXBlabblahEffects } from './blahblah.effects';

describe('VXBlabblahEffects', () => {
  let actions$: Observable<any>;
  let effects: VXBlabblahEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VXBlabblahEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(VXBlabblahEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
