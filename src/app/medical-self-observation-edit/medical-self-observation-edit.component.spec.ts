import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSelfObservationEditComponent } from './medical-self-observation-edit.component';

describe('MedicalSelfObservationEditComponent', () => {
  let component: MedicalSelfObservationEditComponent;
  let fixture: ComponentFixture<MedicalSelfObservationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalSelfObservationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSelfObservationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
