import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  userId: any;
  show = false;
  user: any = {};
  notAllowed: boolean = false;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    let accountId = JSON.parse(localStorage.getItem('currentAccount')).id;
    if (this.subscription)
      this.subscription.unsubscribe();

    this.subscription = this.httpService.get('/user/get?id=' + this.userId + '&accountId=' + accountId)
      .subscribe((response: any) => {
        if (response.success) {
          if (response.response.id) {
            this.user = response.response;
          }
          else {
            this.notAllowed = true;
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
    if (localStorage.getItem('currentUser')) {
      this.router.navigateByUrl('/registers');
    }
    else {
      this.router.navigateByUrl('/users');
    }
  }

}
