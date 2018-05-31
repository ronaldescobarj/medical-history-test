import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalAnalysisViewComponent } from './medical-analysis-view.component';

describe('MedicalAnalysisViewComponent', () => {
  let component: MedicalAnalysisViewComponent;
  let fixture: ComponentFixture<MedicalAnalysisViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalAnalysisViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalAnalysisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
