import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-medical-self-observation-view',
  templateUrl: './medical-self-observation-view.component.html',
  styleUrls: ['./medical-self-observation-view.component.css']
})
export class MedicalSelfObservationViewComponent implements OnInit, OnDestroy {


  selfObservation: any;
  id: String;
  show: boolean = false;
  error: string;
  subscription: Subscription;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    let userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.selfObservation = { text: "" };

    if (this.subscription)
      this.subscription.unsubscribe();

    this.subscription = this.httpService.get('/selfObservation/get?id=' + this.id + '&userId=' + userId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.selfObservation = response.response;
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

  goBack() {
    this.router.navigateByUrl('/registers');
  }
}
