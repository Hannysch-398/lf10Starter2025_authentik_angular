import { TestBed } from '@angular/core/testing';

import { QualificationsStoreService } from './qualifications-store.service';

describe('QualificationsStoreService', () => {
  let service: QualificationsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualificationsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
