import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSelfObservationCreateComponent } from './medical-self-observation-create.component';

describe('MedicalSelfObservationCreateComponent', () => {
  let component: MedicalSelfObservationCreateComponent;
  let fixture: ComponentFixture<MedicalSelfObservationCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalSelfObservationCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSelfObservationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
