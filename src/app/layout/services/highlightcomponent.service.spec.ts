import { TestBed } from '@angular/core/testing';

import { HighlightcomponentService } from './highlightcomponent.service';

describe('HighlightcomponentService', () => {
  let service: HighlightcomponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighlightcomponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
