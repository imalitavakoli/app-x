import { TestBed } from '@angular/core/testing';

import { V1ServiceWorkerService } from './service-worker.service';

describe('V1ServiceWorkerService', () => {
  let service: V1ServiceWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V1ServiceWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
