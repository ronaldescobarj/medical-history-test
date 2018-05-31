import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalAnalysisEditComponent } from './medical-analysis-edit.component';

describe('MedicalAnalysisEditComponent', () => {
  let component: MedicalAnalysisEditComponent;
  let fixture: ComponentFixture<MedicalAnalysisEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalAnalysisEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalAnalysisEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
