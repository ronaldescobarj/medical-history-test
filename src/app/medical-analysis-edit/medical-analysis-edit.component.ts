import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-medical-analysis-edit',
  templateUrl: './medical-analysis-edit.component.html',
  styleUrls: ['./medical-analysis-edit.component.css']
})
export class MedicalAnalysisEditComponent implements OnInit {

  medicalAnalysis: any;
  id;
  show: boolean = false;
  images: any[];
  imagesDecoded: any[];
  error: string;

  typeError: boolean;
  dateError: boolean;
  typeValidator: boolean;
  firstTime: boolean;
  userId: any;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.typeError = false;
    this.dateError = false;
    this.typeValidator = true;
    this.firstTime = true;
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.id = this.route.snapshot.paramMap.get('id');
    this.httpService.get('/analysis/get?id=' + this.id + '&userId=' + this.userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.medicalAnalysis = response.response;
            this.httpService.get('/image/get?analysisId=' + this.medicalAnalysis.id).subscribe((res: any) => {
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

  saveChanges() {
    if (this.validate()) {
      var imagesObj = { images: [] };
      this.httpService.post('/analysis/update', this.medicalAnalysis).subscribe((response: any) => {
        if (response.success) {
          for (let i = 0; i < this.images.length; i++) {
            let imageObj = {
              id: Math.floor(Math.random() * 100000),
              base_64_image: this.images[i].value,
              file_name: this.images[i].filename,
              file_type: this.images[i].filetype,
              analysis_id: this.medicalAnalysis.id
            };
            imagesObj.images.push(imageObj);
          }
          if (this.images.length) {
            this.httpService.post('/image/add', imagesObj).subscribe((res: any) => {
              if (res.success) {
                this.router.navigateByUrl('/registers');
              }
            })
          }
          else
            this.router.navigateByUrl('/registers');
        }
      })
    }
  }

  goBack() {
    this.router.navigateByUrl('/registers');
  }

  deleteImage(id: any) {
    this.httpService.post('/image/delete', { id: id }).subscribe((response: any) => {
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


}
