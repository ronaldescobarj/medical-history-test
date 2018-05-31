import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-medical-consultation-edit',
  templateUrl: './medical-consultation-edit.component.html',
  styleUrls: ['./medical-consultation-edit.component.css']
})
export class MedicalConsultationEditComponent implements OnInit {

  medicalConsultation: any;
  id: any;
  show: boolean = false;

  diagnosticError: boolean;
  doctorError: boolean;
  dateError: boolean;
  diagnosticValidator: boolean;
  doctorValidator: boolean;
  firstTime: boolean;
  error: string;
  userId: any;

  constructor(private httpService: HttpService, private route: ActivatedRoute, private location: Location, private router: Router) { }

  ngOnInit() {
    this.diagnosticError = false;
    this.doctorError = false;
    this.diagnosticValidator = true;
    this.doctorValidator = true;
    this.firstTime = true;
    this.dateError = false;

    this.id = this.route.snapshot.paramMap.get('id');
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.httpService.get('/consultation/get?id=' + this.id + '&userId=' + this.userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.medicalConsultation = response.response;
          }
          else {
            this.error = "La observacion propia solicitada no existe, o pertenece a otro usuario";
          }
          this.show = true;
        }
      })
  }
  saveChanges() {
    this.httpService.post('/consultation/update', this.medicalConsultation).subscribe((response: any) => {
      if (response.success)
        this.router.navigateByUrl('/registers');
    })
  }

  goBack() {
    this.router.navigateByUrl('/registers');
  }

  validate() {
    let res = true;
    this.firstTime = false;
    if (this.medicalConsultation.diagnostic == "") {
      this.diagnosticError = true;
      this.diagnosticValidator = false;
      res = false;
    } else {
      this.diagnosticError = false;
      this.diagnosticValidator = true;
    }

    if (this.medicalConsultation.doctor == "") {
      this.doctorError = true;
      this.doctorValidator = false;
      res = false;
    } else {
      this.doctorError = false;
      this.doctorValidator = true;
    }

    if (this.medicalConsultation.date == "") {
      this.dateError = true;
      res = false;
    } else {
      this.dateError = false;
    }
    return res;
  }

  borderColor(isDoctor: boolean) {
    if (isDoctor) {
      if (!this.firstTime && (!this.doctorValidator || this.doctorError))
        return 'tomato'
    }
    else {
      if (!this.firstTime && (!this.diagnosticValidator || this.diagnosticError))
        return 'tomato'
    }
    return "";
  }

}
