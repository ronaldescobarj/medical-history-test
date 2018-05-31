import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styleUrls: ['./create-edit-user.component.css']
})
export class CreateEditUserComponent implements OnInit {

  userId: any;
  action: any;
  user: any = {};
  show: boolean = false;
  errorMessage: string = "";
  firstTime: boolean = true;

  constructor(private httpService: HttpService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.action = this.route.snapshot.paramMap.get('action');
    if (this.action == "edit") {
      this.userId = this.route.snapshot.paramMap.get('id');
      this.httpService.get('/user/get?id=' + this.userId).subscribe((response: any) => {
        if (response.success) {
          this.user = response.response;
          this.show = true;
        }
      });
    }
    if (this.action == "create") {
      this.show = true;
      this.user = {
        name: "",
        last_name: "",
        account_id: JSON.parse(localStorage.getItem('currentAccount')).id
      }
    }
  }

  saveChanges() {
    this.firstTime = false;
    let apiRoute = "";
    if (this.user.name != "" && this.user.last_name != "") {
      if (this.action == "create") {
        apiRoute = "create";
        this.user.id = Math.floor(Math.random() * 100000);
      }
      if (this.action == "edit")
        apiRoute = "update";
      this.httpService.post('/user/' + apiRoute, this.user).subscribe((response: any) => {
        if (response.success) {
          this.goBack();
        }
      })
    }
    else {
      this.errorMessage = "Faltan campos a introducir";
    }
  }

  goBack() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigateByUrl('/viewUser/' + this.userId);
    }
    else {
      this.router.navigateByUrl('/users');
    }
  }

}
