import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { IMyDpOptions } from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-medical-self-observation-create',
  templateUrl: './medical-self-observation-create.component.html',
  styleUrls: ['./medical-self-observation-create.component.css']
})
export class MedicalSelfObservationCreateComponent implements OnInit, OnDestroy {

  medicalSelfObservation: any = {};

  dateError: boolean;
  observationError: boolean;
  firstTime: boolean;
  observationValidator: boolean;
  loading: boolean = false;
  subscription: Subscription;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.dateError = false;
    this.observationError = false;
    this.firstTime = true;
    this.observationValidator = true;
    this.medicalSelfObservation = {
      id: "",
      summary: "",
      observation: "",
      date: "",
      user_id: "",
    }
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  createSelfObservation() {
    if (this.validate()) {
      this.medicalSelfObservation.id = Math.floor(Math.random() * 100000);
      this.medicalSelfObservation.user_id = JSON.parse(localStorage.getItem('currentUser')).id;
      this.medicalSelfObservation.date = this.medicalSelfObservation.date.date.year + '-' + this.medicalSelfObservation.date.date.month + '-' + this.medicalSelfObservation.date.date.day;
      this.loading = true;

      if (this.subscription)
        this.subscription.unsubscribe();

      this.subscription = this.httpService.post('/selfObservation/create', this.medicalSelfObservation).subscribe((response: any) => {
        if (response.success)
          this.router.navigateByUrl('/registers');
        this.loading = false;
      })
    }
  }

  goBack() {
    this.router.navigateByUrl('/registers');
  }

  validate() {
    let res = true;
    this.firstTime = false;
    if (this.medicalSelfObservation.observation == "") {
      this.observationError = true;
      this.observationValidator = false;
      res = false;
    } else {
      this.observationError = false;
      this.observationValidator = true;
    }

    if (this.medicalSelfObservation.date == "") {
      this.dateError = true;
      res = false;
    } else {
      this.dateError = false;
    }
    return res;
  }

  borderColor() {
    if (!this.firstTime && (!this.observationValidator || this.observationError))
      return 'tomato'
    return "";
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true,
    dayLabels: { su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab' },
    todayBtnTxt: "Hoy",
    monthLabels: { 1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre' },
    selectorHeight: "232px",
    selectorWidth: "350px"
  };

  // Initialized to specific date (09.10.2018).
  public model: any = { date: { year: 2018, month: 10, day: 9 } };
}
