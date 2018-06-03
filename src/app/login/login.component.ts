import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  account: any = {};
  firstTime: boolean;
  errorMessage: string;
  loading;

  usernameError: boolean;
  passwordError: boolean;
  usernameValidator: boolean;
  passwordValidator: boolean;

  constructor(private httpService: HttpService, private loginService: LoginService) { }

  ngOnInit() {
    this.account = {
      username: "",
      password: ""
    }
    this.firstTime = true;
    this.loading = false;
    this.passwordError = false;
    this.usernameError = false;
    this.passwordValidator = true;
    this.usernameValidator = true;
  }

  login() {
    localStorage.removeItem('currentAccount');
    localStorage.removeItem('currentUser');

    if (this.validate()) {
      this.loading = true;
      this.loginService.login(this.account.username, this.account.password,
        (message: string) => {
          this.errorMessage = message;
          this.loading = false;
        });
    }
  }

  validate() {
    let res = true;
    this.firstTime = false;
    if (this.account.password == "") {
      this.passwordError = true;
      this.passwordValidator = false;
      res = false;
    } else {
      this.passwordError = false;
      this.passwordValidator = true;
    }

    if (this.account.username == "") {
      this.usernameError = true;
      this.usernameValidator = false;
      res = false;
    } else {
      this.usernameError = false;
      this.usernameValidator = true;
    }
    return res;
  }

  borderColor(type: any) {
    if (type == 'password') {
      if (!this.firstTime && (!this.passwordValidator || this.passwordError))
        return 'tomato'
    }
    if (type == 'username') {
      if (!this.firstTime && (!this.usernameValidator || this.usernameError))
        return 'tomato'
    }
    return "";
  }

}