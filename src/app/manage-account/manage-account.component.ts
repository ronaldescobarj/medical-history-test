import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {

  accountId: any;
  account: any = {};
  passwords: any = {};
  changePassword: boolean = false;
  errorMessage: string = "";
  show: boolean = false;
  successMessage: string;

  constructor(private httpService: HttpService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.accountId = JSON.parse(localStorage.getItem('currentAccount')).id;
    this.passwords = {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: ""
    }
    this.httpService.get('/account/get?id=' + this.accountId).subscribe((response: any) => {
      if (response.success) {
        this.account = response.response;
        this.show = true;
      }
    })
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
      this.httpService.post('/account/update', this.account).subscribe((response: any) => {
        if (response.success) {
          /*           if (localStorage.getItem('currentUser'))
                      this.router.navigateByUrl('/registers');
                    else
                      this.router.navigateByUrl('/users');*/
          this.successMessage = "exito";
        }
      })
    }
  }

  goBack() {
    this.location.back();
  }

}
