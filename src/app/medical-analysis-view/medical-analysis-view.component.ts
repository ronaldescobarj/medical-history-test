import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-medical-analysis-view',
  templateUrl: './medical-analysis-view.component.html',
  styleUrls: ['./medical-analysis-view.component.css']
})
export class MedicalAnalysisViewComponent implements OnInit, OnDestroy {

  analysis: any;
  id: String;
  show: boolean = false;
  images: any[];
  error: string;
  userId: any;

  showImage: boolean;
  imgModal: any;
  testImage: any;

  subscription: Subscription;
  nestedSubscription: Subscription;
  // imageDecoded: any;
  imagesDecoded: any[];

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit() {
    this.showImage = false;
    this.id = this.route.snapshot.paramMap.get('id');
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.nestedSubscription)
      this.nestedSubscription.unsubscribe();

    this.subscription = this.httpService.get('/analysis/get?id=' + this.id + '&userId=' + this.userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.analysis = response.response;
            this.nestedSubscription = this.httpService.get('/analysisImage/get?analysisId=' + this.analysis.id).subscribe((res: any) => {
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

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.nestedSubscription)
      this.nestedSubscription.unsubscribe();
  }

  goBack() {
    this.router.navigateByUrl('/registers');
  }

  openImageModal(img: any) {
    this.imgModal = img;
    this.showImage = true;
  }
}
