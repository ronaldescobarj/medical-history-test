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
  firstTime: boolean = true;
  errorMessage: string = "";
  loading = false;

  constructor(private httpService: HttpService, private loginService: LoginService) { }

  ngOnInit() {
    this.account = {
      username: "",
      password: ""
    }
  }

  login() {
    localStorage.removeItem('currentAccount');
    localStorage.removeItem('currentUser');
    this.firstTime = false;
    if (this.account.username != "" && this.account.password != "") {
      this.loading = true;
      this.loginService.login(this.account.username, this.account.password,
        (message: string) => {
          this.errorMessage = message;
          this.loading = false;
        });
    }
    else {
      this.errorMessage = "Faltan campos a introducir";
    }
  }
}