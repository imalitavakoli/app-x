import { TestBed } from '@angular/core/testing';

import { V1HtmlEditorService } from './html-editor.service';

describe('V1CommunicationService', () => {
  let service: V1HtmlEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V1HtmlEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
