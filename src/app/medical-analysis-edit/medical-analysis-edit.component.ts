import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-medical-analysis-edit',
  templateUrl: './medical-analysis-edit.component.html',
  styleUrls: ['./medical-analysis-edit.component.css']
})
export class MedicalAnalysisEditComponent implements OnInit, OnDestroy {

  medicalAnalysis: any;
  id;
  show: boolean = false;
  images: any[];
  imagesDecoded: any[];
  error: string;
  imgModal: any;
  showImage: boolean;

  typeError: boolean;
  dateError: boolean;
  typeValidator: boolean;
  firstTime: boolean;
  imagesError: boolean;
  userId: any;
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
    this.typeError = false;
    this.dateError = false;
    this.typeValidator = true;
    this.firstTime = true;
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.nestedSubscription)
      this.nestedSubscription.unsubscribe();

    this.subscription = this.httpService.get('/analysis/get?id=' + this.id + '&userId=' + this.userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.medicalAnalysis = response.response;
            this.medicalAnalysis.date = {
              date:
                {
                  year: parseInt(this.medicalAnalysis.date.slice(0, 4)),
                  month: parseInt(this.medicalAnalysis.date.slice(5, 7)),
                  day: parseInt(this.medicalAnalysis.date.slice(8, 10)),
                }
            };
            this.nestedSubscription = this.httpService.get('/analysisImage/get?analysisId=' + this.medicalAnalysis.id).subscribe((res: any) => {
              if (res.success) {
                this.images = res.response;
                this.imagesDecoded = [];
                for (let i = 0; i < this.images.length; i++) {
                  let imageDecoded = this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + this.images[i].file_type + ';base64,'
                    + this.images[i].base_64_image);
                  this.imagesDecoded.push({ img: imageDecoded, id: this.images[i].id });
                }
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
      this.medicalAnalysis.date = this.medicalAnalysis.date.date.year + '-' + this.medicalAnalysis.date.date.month + '-' + this.medicalAnalysis.date.date.day;
      this.loading = true;
      if (this.subscription)
        this.subscription.unsubscribe();
      if (this.nestedSubscription)
        this.nestedSubscription.unsubscribe();

      this.subscription = this.httpService.post('/analysis/update', this.medicalAnalysis).subscribe((response: any) => {
        if (response.success) {
          for (let i = 0; i < this.images.length; i++) {
            let imageObj = {
              id: Math.floor(Math.random() * 100000),
              base_64_image: this.images[i].value,
              file_name: this.images[i].file_name,
              file_type: this.images[i].file_type,
              analysis_id: this.medicalAnalysis.id
            };
            imagesObj.images.push(imageObj);
          }
          if (this.images.length) {
            this.nestedSubscription = this.httpService.post('/analysisImage/add', imagesObj).subscribe((res: any) => {
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
    this.subscription = this.httpService.post('/analysisImage/delete', { id: id }).subscribe((response: any) => {
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
    if (this.medicalAnalysis.type == "") {
      this.typeError = true;
      this.typeValidator = false;
      res = false;
    } else {
      this.typeError = false;
      this.typeValidator = true;
    }

    if (this.medicalAnalysis.date == "") {
      this.dateError = true;
      res = false;
    } else {
      this.dateError = false;
    }
    return res;
  }

  borderColor() {
    if (!this.firstTime && (!this.typeValidator || this.typeError))
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


  openImageModal(img: any) {
    this.imgModal = img;
    this.showImage = true;
  }
}
