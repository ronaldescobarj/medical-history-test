import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-medical-analysis-create',
  templateUrl: './medical-analysis-create.component.html',
  styleUrls: ['./medical-analysis-create.component.css']
})
export class MedicalAnalysisCreateComponent implements OnInit {

  medicalAnalysis: any = {};
  testImage: any;
  images: any = [];
  typeError: boolean;
  dateError: boolean;
  imagesError: boolean;
  firstTime: boolean;
  typeValidator: boolean;
  loading: boolean = false;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.dateError = false;
    this.typeError = false;
    this.firstTime = true;
    this.typeValidator = true;
    this.medicalAnalysis = {
      id: "",
      summary: "",
      type: "",
      description: "",
      hospital: "",
      commentary: "",
      date: "",
      user_id: "",
    }
  }

  createAnalysis() {
    if (this.validate()) {
      this.medicalAnalysis.id = Math.floor(Math.random() * 100000);
      this.medicalAnalysis.user_id = JSON.parse(localStorage.getItem('currentUser')).id;
      var imagesObj = { images: [] };
      this.medicalAnalysis.date = this.medicalAnalysis.date.date.year + '-' + this.medicalAnalysis.date.date.month + '-' + this.medicalAnalysis.date.date.day;
      this.loading = true;
      this.httpService.post('/analysis/create', this.medicalAnalysis).subscribe((response: any) => {
        if (response.success) {
          this.images.forEach((image: any) => {
            let imageObj = {
              id: Math.floor(Math.random() * 100000),
              base_64_image: image.value,
              file_name: image.filename,
              file_type: image.filetype,
              analysis_id: this.medicalAnalysis.id
            };
            imagesObj.images.push(imageObj);
          });
          if (this.images.length) {
            this.httpService.post('/analysisImage/add', imagesObj).subscribe((res: any) => {
              if (res.success) {
                this.router.navigateByUrl('/registers');
              }
              this.loading = false;
            })
          }
          else {
            this.router.navigateByUrl('/registers');
            this.loading = false;
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
            filename: file.name,
            filetype: file.type,
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
      if (image.filetype != "image/jpeg" && image.filetype != "image/png" && image.filetype != "image/jpg") {
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
}
