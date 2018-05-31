import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSelfObservationViewComponent } from './medical-self-observation-view.component';

describe('MedicalSelfObservationViewComponent', () => {
  let component: MedicalSelfObservationViewComponent;
  let fixture: ComponentFixture<MedicalSelfObservationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalSelfObservationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSelfObservationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
