import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit {

  firstTime: boolean = true;
  account: any = {};
  errorMessage: string = "";
  loading: boolean = false;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.account = {
      username: "",
      password: "",
      passwordConfirm: ""
    }
  }

  register() {
    this.firstTime = false;
    if (this.account.password != this.account.passwordConfirm) {
      this.errorMessage = "Las contraseñas no coinciden";
    }
    else if (this.account.username != "" && this.account.password != "" && this.account.passwordConfirm != "") {
      this.loading = true;
      this.account.id = Math.floor(Math.random() * 100000);
      this.httpService.post('/account/create', this.account).subscribe((response: any) => {
        if (response.success) {
          this.router.navigateByUrl('/login');
        }
        else {
          this.errorMessage = response.message;
        }
        this.loading = false;
      })
    }
    else {
      this.errorMessage = "Faltan campos a introducir";
    }
  }
}
