import { TestBed } from '@angular/core/testing';

import { V1AuthAutoService } from './auth-auto.service';

describe('V1AuthAutoService', () => {
  let service: V1AuthAutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V1AuthAutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
