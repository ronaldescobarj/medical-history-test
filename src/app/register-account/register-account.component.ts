import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit, OnDestroy {

  firstTime: boolean;
  account: any = {};
  errorMessage: string;
  loading: boolean = false;

  usernameError: boolean;
  passwordError: boolean;
  passwordConfirmError: boolean;
  usernameValidator: boolean;
  passwordValidator: boolean;
  passwordConfirmValidator: boolean;
  subscription: Subscription;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.account = {
      username: "",
      password: "",
      passwordConfirm: ""
    }
    this.firstTime = true;
    this.loading = false;
    this.passwordConfirmError = false;
    this.passwordError = false;
    this.usernameError = false;
    this.passwordValidator = true;
    this.passwordConfirmValidator = true;
    this.usernameValidator = true;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  register() {
    if (this.subscription)
      this.subscription.unsubscribe();

    if (this.validate()) {
      this.loading = true;
      this.account.id = Math.floor(Math.random() * 100000);
      this.subscription = this.httpService.post('/account/create', this.account).subscribe((response: any) => {
        if (response.success) {
          this.router.navigateByUrl('/login');
        }
        else {
          this.errorMessage = response.message;
        }
        this.loading = false;
      })
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

    if (this.account.passwordConfirm == "") {
      this.passwordConfirmError = true;
      this.passwordConfirmValidator = false;
      res = false;
    } else {
      this.passwordConfirmError = false;
      this.passwordConfirmValidator = true;
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
    if (type == 'passwordConfirm') {
      if (!this.firstTime && (!this.passwordConfirmValidator || this.passwordConfirmError))
        return 'tomato'
    }
    return "";
  }

}
