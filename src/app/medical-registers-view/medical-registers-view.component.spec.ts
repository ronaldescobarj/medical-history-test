import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRegistersViewComponent } from './medical-registers-view.component';

describe('MedicalRegistersViewComponent', () => {
  let component: MedicalRegistersViewComponent;
  let fixture: ComponentFixture<MedicalRegistersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalRegistersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRegistersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
