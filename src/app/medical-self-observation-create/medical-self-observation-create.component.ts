import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-medical-self-observation-create',
  templateUrl: './medical-self-observation-create.component.html',
  styleUrls: ['./medical-self-observation-create.component.css']
})
export class MedicalSelfObservationCreateComponent implements OnInit {

  medicalSelfObservation: any = {};

  dateError: boolean;
  observationError: boolean;
  firstTime: boolean;
  observationValidator: boolean;
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

  createSelfObservation() {
    if (this.validate()) {
      this.medicalSelfObservation.id = Math.floor(Math.random() * 100000);
      this.medicalSelfObservation.user_id = JSON.parse(localStorage.getItem('currentUser')).id;
      this.httpService.post('/selfObservation/create', this.medicalSelfObservation).subscribe((response: any) => {
        if (response.success)
          this.router.navigateByUrl('/registers');
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
}
