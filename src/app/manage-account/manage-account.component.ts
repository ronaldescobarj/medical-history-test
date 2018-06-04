import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit, OnDestroy {

  accountId: any;
  account: any = {};
  passwords: any = {};
  changePassword: boolean = false;
  errorMessage: string = "";
  show: boolean = false;
  successMessage: string;
  loading: boolean = false;

  deleteSubscription: Subscription;
  subscription: Subscription;

  constructor(private httpService: HttpService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.accountId = JSON.parse(localStorage.getItem('currentAccount')).id;
    this.passwords = {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: ""
    }
    if (this.subscription)
      this.subscription.unsubscribe();
    this.subscription = this.httpService.get('/account/get?id=' + this.accountId).subscribe((response: any) => {
      if (response.success) {
        this.account = response.response;
        this.show = true;
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.deleteSubscription)
      this.deleteSubscription.unsubscribe();
  }

  resetNewPassword() {
    this.passwords = {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: ""
    };
    this.changePassword = false;
  }

  saveChanges() {
    if (this.subscription)
      this.subscription.unsubscribe();
    let condition = true;
    if (this.changePassword) {
      if (this.passwords.newPassword != this.passwords.newPasswordConfirm) {
        this.errorMessage = "Las contraseñas no coinciden";
        condition = false;
      }
      if (this.passwords.currentPassword != this.account.password) {
        this.errorMessage = "La contraseña actual es incorrecta";
        condition = false;
      }
      if (this.passwords.currentPassword == "" || this.passwords.newPassword == ""
        || this.passwords.newPasswordConfirm == "" || this.account.username == "") {
        this.errorMessage = "Faltan campos a introducir";
        condition = false;
      }
      if (condition)
        this.account.password = this.passwords.newPassword;

    }
    else {
      if (this.account.username == "") {
        this.errorMessage = "Faltan campos a introducir";
        condition = false;
      }
    }
    if (condition) {
      this.loading = true;
      this.subscription = this.httpService.post('/account/update', this.account).subscribe((response: any) => {
        if (response.success) {
          this.successMessage = "exito";
          this.router.navigateByUrl('/registers');
        }
        this.loading = false;
      })
    }
  }

  goBack() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigateByUrl('/registers');
    }
    else {
      if (localStorage.getItem('currentAccount')) {
        this.router.navigateByUrl('/users');
      }
    }
  }

  deleteAccount() {
    if (this.deleteSubscription)
      this.deleteSubscription.unsubscribe();
    this.deleteSubscription = this.httpService.post('/account/delete', this.account)
      .subscribe((response: any) => {
        if (response.success) {
          this.router.navigateByUrl('/login');
          this.refresh();
        }
      })
  }

  refresh() {
    location.reload();
  }
}
