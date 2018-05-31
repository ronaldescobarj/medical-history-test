import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalAnalysisCreateComponent } from './medical-analysis-create.component';

describe('MedicalAnalysisCreateComponent', () => {
  let component: MedicalAnalysisCreateComponent;
  let fixture: ComponentFixture<MedicalAnalysisCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalAnalysisCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalAnalysisCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
