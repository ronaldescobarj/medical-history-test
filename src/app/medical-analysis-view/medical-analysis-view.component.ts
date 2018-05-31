import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-medical-analysis-view',
  templateUrl: './medical-analysis-view.component.html',
  styleUrls: ['./medical-analysis-view.component.css']
})
export class MedicalAnalysisViewComponent implements OnInit {

  analysis: any;
  id: String;
  show: boolean = false;
  images: any[];
  error: string;
  userId: any;

  testImage: any;

  imagesDecoded: any[];

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.httpService.get('/analysis/get?id=' + this.id + '&userId=' + this.userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.analysis = response.response;
            this.httpService.get('/image/get?analysisId=' + this.analysis.id).subscribe((res: any) => {
              if (response.success) {
                this.images = res.response;
                this.imagesDecoded = [];
                for (let i = 0; i < this.images.length; i++) {
                  let imageDecoded = this.domSanitizer.bypassSecurityTrustResourceUrl('data:' + this.images[i].file_type + ';base64,'
                    + this.images[i].base_64_image);
                  this.imagesDecoded.push(imageDecoded);
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
      })
  }
  goBack() {
    this.router.navigateByUrl('/registers');
  }

}
