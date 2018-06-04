import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css']
})
export class UsersViewComponent implements OnInit, OnDestroy {

  users: any = [];
  show = false;
  accountId: any;
  subscription: Subscription;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('currentUser');
    this.accountId = JSON.parse(localStorage.getItem('currentAccount')).id;
    if (this.subscription)
      this.subscription.unsubscribe();

    this.subscription = this.httpService.get('/user/list?accountId=' + this.accountId).subscribe((response: any) => {
      if (response.success) {
        this.users = response.response;
        this.show = true;
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  selectUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.router.navigateByUrl('/registers');
  }

  addUser() {
    this.router.navigateByUrl('/user/create/#');
  }

  deleteUser(user: any) {
    if (this.subscription)
      this.subscription.unsubscribe();

    this.subscription = this.httpService.post('/user/delete', user).subscribe((response: any) => {
      if (response.success) {
        location.reload();
      }
    })
  }

  setDefault(newDefault: any) {
    let currentDefault = this.users.find((user: any) => {
      return user.default_user;
    });
    if (this.subscription)
      this.subscription.unsubscribe();

    this.subscription = this.httpService.post('/user/changeDefault', { currentDefault: currentDefault, newDefault: newDefault })
      .subscribe((response: any) => {
        if (response.success) {
          location.reload();
        }
      })
  }

  refresh() {
    location.reload();
  }

}