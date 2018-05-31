import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalConsultationCreateComponent } from './medical-consultation-create.component';

describe('MedicalConsultationCreateComponent', () => {
  let component: MedicalConsultationCreateComponent;
  let fixture: ComponentFixture<MedicalConsultationCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalConsultationCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalConsultationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
