import { TestBed } from '@angular/core/testing';

 import { QualificationsStore } from './qualifications-store.service';

describe('QualificationsStore', () => {
  let service: QualificationsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualificationsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
