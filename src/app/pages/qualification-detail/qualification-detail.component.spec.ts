import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationDetailComponent } from './qualification-detail.component';

describe('QualificationDetailComponent', () => {
  let component: QualificationDetailComponent;
  let fixture: ComponentFixture<QualificationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualificationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualificationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
