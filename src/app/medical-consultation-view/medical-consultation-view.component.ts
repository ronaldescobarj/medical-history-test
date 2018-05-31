import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-medical-consultation-view',
  templateUrl: './medical-consultation-view.component.html',
  styleUrls: ['./medical-consultation-view.component.css']
})
export class MedicalConsultationViewComponent implements OnInit {

  consultation: any;
  id: string;
  show: boolean = false;
  error: string;
  userId: any;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.httpService.get('/consultation/get?id=' + this.id + '&userId=' + this.userId).
      subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.consultation = response.response;
          }
          else {
            this.error = "La observacion propia solicitada no existe, o pertenece a otro usuario";
          }
          this.show = true;
        }
      })
  }
  goBack() {
    this.router.navigateByUrl('/registers');
  }
}
