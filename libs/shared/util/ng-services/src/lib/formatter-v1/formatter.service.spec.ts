import { TestBed } from '@angular/core/testing';

import { V1FormatterService } from './formatter.service';

describe('V1FormatterService', () => {
  let service: V1FormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V1FormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
