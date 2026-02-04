import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationsOverviewComponent } from './qualifications-overview.component';

describe('QualificationsOverviewComponent', () => {
  let component: QualificationsOverviewComponent;
  let fixture: ComponentFixture<QualificationsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualificationsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualificationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
