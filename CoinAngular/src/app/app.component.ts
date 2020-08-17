import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { UserService } from './shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterContentChecked {
  title = 'CoinAngular';
  signedIn = false;
  userDetails;
 
  constructor(private router: Router, private service: UserService) {}

  ngOnInit() {
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      }
    )
  }
  ngAfterContentChecked() {
    if(localStorage.getItem('token') != null) {
      this.signedIn = true;
    }
    else {
      this.signedIn = false;
    }
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(["/user/login"]);
  }
}
