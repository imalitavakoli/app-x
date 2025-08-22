import { TestBed } from '@angular/core/testing';

import { V1CommunicationService } from './communication.service';

describe('V1CommunicationService', () => {
  let service: V1CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V1CommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
