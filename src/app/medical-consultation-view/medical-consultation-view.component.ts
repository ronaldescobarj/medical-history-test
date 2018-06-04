import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-medical-consultation-view',
  templateUrl: './medical-consultation-view.component.html',
  styleUrls: ['./medical-consultation-view.component.css']
})
export class MedicalConsultationViewComponent implements OnInit, OnDestroy {

  consultation: any;
  id: string;
  show: boolean = false;
  error: string;
  userId: any;
  images: any[];
  imagesDecoded: any[];
  imgModal: any;
  showImage: boolean;
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
    this.id = this.route.snapshot.paramMap.get('id');
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;

    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.nestedSubscription)
      this.nestedSubscription.unsubscribe();

    this.subscription = this.httpService.get('/consultation/get?id=' + this.id + '&userId=' + this.userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.consultation = response.response;
            this.nestedSubscription = this.httpService.get('/consultationImage/get?consultationId=' + this.consultation.id).subscribe((res: any) => {
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
