import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';
import { IMyDpOptions } from 'mydatepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-medical-consultation-edit',
  templateUrl: './medical-consultation-edit.component.html',
  styleUrls: ['./medical-consultation-edit.component.css']
})
export class MedicalConsultationEditComponent implements OnInit, OnDestroy {

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
  images: any[];
  imagesDecoded: any[];
  imagesError: boolean;
  imgModal: any;
  showImage: boolean;
  loading: boolean = false;
  subscription: Subscription;
  nestedSubscription: Subscription;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.showImage = false;
    this.diagnosticError = false;
    this.doctorError = false;
    this.diagnosticValidator = true;
    this.doctorValidator = true;
    this.firstTime = true;
    this.dateError = false;

    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.nestedSubscription)
      this.nestedSubscription.unsubscribe();

    this.subscription = this.httpService.get('/consultation/get?id=' + this.id + '&userId=' + this.userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.medicalConsultation = response.response;
            this.medicalConsultation.date = {
              date:
                {
                  year: parseInt(this.medicalConsultation.date.slice(0, 4)),
                  month: parseInt(this.medicalConsultation.date.slice(5, 7)),
                  day: parseInt(this.medicalConsultation.date.slice(8, 10)),
                }
            };
            this.nestedSubscription = this.httpService.get('/consultationImage/get?consultationId=' + this.medicalConsultation.id).subscribe((res: any) => {
              if (res.success) {
                this.images = res.response;
                this.imagesDecoded = [];
                for (let i = 0; i < this.images.length; i++) {
                  let imageDecoded = this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + this.images[i].file_type + ';base64,'
                    + this.images[i].base_64_image);
                  this.imagesDecoded.push({ img: imageDecoded, id: this.images[i].id });
                }
                this.images = [];
                this.show = true;
              }
            })
          }
          else {
            this.error = "La observacion propia solicitada no existe, o pertenece a otro usuario";
            this.show = true;
          }
        }
      });
  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.nestedSubscription)
      this.nestedSubscription.unsubscribe();
  }

  saveChanges() {
    if (this.validate()) {
      var imagesObj = { images: [] };
      this.medicalConsultation.date = this.medicalConsultation.date.date.year + '-' + this.medicalConsultation.date.date.month + '-' + this.medicalConsultation.date.date.day;
      this.loading = true;

      if (this.subscription)
        this.subscription.unsubscribe();
      if (this.nestedSubscription)
        this.nestedSubscription.unsubscribe();

      this.subscription = this.httpService.post('/consultation/update', this.medicalConsultation).subscribe((response: any) => {
        if (response.success) {
          for (let i = 0; i < this.images.length; i++) {
            let imageObj = {
              id: Math.floor(Math.random() * 100000),
              base_64_image: this.images[i].value,
              file_name: this.images[i].file_name,
              file_type: this.images[i].file_type,
              consultation_id: this.medicalConsultation.id
            };
            imagesObj.images.push(imageObj);
          }
          if (this.images.length) {
            this.nestedSubscription = this.httpService.post('/consultationImage/add', imagesObj).subscribe((res: any) => {
              if (res.success) {
                this.router.navigateByUrl('/registers');
              }
              this.loading = false;
            })
          }
          else {
            this.loading = false;
            this.router.navigateByUrl('/registers');
          }
        }
        else {
          this.loading = false;
        }
      })
    }
  }

  goBack() {
    this.router.navigateByUrl('/registers');
  }

  deleteImage(id: any) {
    if (this.subscription)
      this.subscription.unsubscribe();

    this.subscription = this.httpService.post('/consultationImage/delete', { id: id }).subscribe((response: any) => {
      if (response.success)
        location.reload();
    })
  }

  onFileChange(event) {
    let readers = [];
    this.images = [];
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        readers[i] = new FileReader();
        let file = event.target.files[i];
        readers[i].readAsDataURL(file);
        readers[i].onload = () => {
          this.images.push({
            file_name: file.name,
            file_type: file.type,
            value: readers[i].result.split(',')[1]
          });
        };
      }
    }
  }

  validate() {
    let res = true;
    this.firstTime = false;
    this.images.forEach(image => {
      if (image.file_type != "image/jpeg" && image.file_type != "image/png" && image.file_type != "image/jpg") {
        res = false;
        this.imagesError = true;
      }
    });
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

  openImageModal(img: any) {
    this.imgModal = img;
    this.showImage = true;
  }

}
