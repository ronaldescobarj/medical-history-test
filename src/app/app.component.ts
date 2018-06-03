import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Registro Medico';


  constructor(private loginService: LoginService, private router: Router) {
  }

  loggedIn() {
    return localStorage.getItem('currentAccount');
  }

  userLoggedIn() {
    return localStorage.getItem('currentUser');
  }

  changeUser() {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('/users');
  }

  viewUser() {
    let userId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.router.navigateByUrl('/viewUser/' + userId);
  }

  logout() {
    this.loginService.logout();
  }

}
