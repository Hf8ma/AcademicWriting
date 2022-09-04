import { TestBed } from '@angular/core/testing';

import { DashboardFolderService } from './dashboard-folder.service';

describe('DashboardFolderService', () => {
  let service: DashboardFolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardFolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
