import { TestBed } from '@angular/core/testing';

import { V1FirebaseService } from './firebase.service';

describe('V1FirebaseService', () => {
  let service: V1FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V1FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
