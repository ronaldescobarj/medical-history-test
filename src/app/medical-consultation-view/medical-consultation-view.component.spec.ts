import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalConsultationViewComponent } from './medical-consultation-view.component';

describe('MedicalConsultationViewComponent', () => {
  let component: MedicalConsultationViewComponent;
  let fixture: ComponentFixture<MedicalConsultationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalConsultationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalConsultationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
