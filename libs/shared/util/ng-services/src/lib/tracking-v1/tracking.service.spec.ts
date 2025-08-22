import { TestBed } from '@angular/core/testing';

import { V1ApptentiveService } from './apptentive.service';

describe('V1ApptentiveService', () => {
  let service: V1ApptentiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V1ApptentiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
