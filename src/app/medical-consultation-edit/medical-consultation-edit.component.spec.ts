import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalConsultationEditComponent } from './medical-consultation-edit.component';

describe('MedicalConsultationEditComponent', () => {
  let component: MedicalConsultationEditComponent;
  let fixture: ComponentFixture<MedicalConsultationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalConsultationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalConsultationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
