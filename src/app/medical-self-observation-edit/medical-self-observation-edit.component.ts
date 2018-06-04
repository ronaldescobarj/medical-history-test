import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Location } from '@angular/common';
import { IMyDpOptions } from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-medical-self-observation-edit',
  templateUrl: './medical-self-observation-edit.component.html',
  styleUrls: ['./medical-self-observation-edit.component.css']
})
export class MedicalSelfObservationEditComponent implements OnInit, OnDestroy {

  medicalSelfObservation: any;
  id: any;
  show: boolean = false;
  error: string;
  userId: any;
  loading: boolean = false;

  dateError: boolean;
  observationError: boolean;
  firstTime: boolean;
  observationValidator: boolean;

  subscription: Subscription;
  constructor(private httpService: HttpService, private route: ActivatedRoute, private location: Location, private router: Router) { }

  ngOnInit() {
    this.dateError = false;
    this.observationError = false;
    this.firstTime = true;
    this.observationValidator = true;
    this.id = this.route.snapshot.paramMap.get('id');
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.httpService.get('/selfObservation/get?id=' + this.id + '&userId=' + this.userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.medicalSelfObservation = response.response;
            this.medicalSelfObservation.date = {
              date:
                {
                  year: parseInt(this.medicalSelfObservation.date.slice(0, 4)),
                  month: parseInt(this.medicalSelfObservation.date.slice(5, 7)),
                  day: parseInt(this.medicalSelfObservation.date.slice(8, 10)),
                }
            };
          }
          else {
            this.error = "La observacion propia solicitada no existe, o pertenece a otro usuario";
          }
          this.show = true;
        }
      })
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  saveChanges() {
    if (this.subscription)
      this.subscription.unsubscribe();

    if (this.validate()) {
      this.medicalSelfObservation.date = this.medicalSelfObservation.date.date.year + '-' + this.medicalSelfObservation.date.date.month + '-' + this.medicalSelfObservation.date.date.day;
      this.loading = true;
      this.subscription = this.httpService.post('/selfObservation/update', this.medicalSelfObservation).subscribe((response: any) => {
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
