import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formModel = {
    UserName: '',
    Password: ''
  }
  signedIn = false;
  constructor(private service: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') != null) {
      this.signedIn = true;
      this.router.navigateByUrl('/myshares');
    }
  }

  onSubmit(form: NgForm) {
    this.service.login(form.value).subscribe(
      (res:any) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl("/myshares");
      },
      err => {
        if(err.status == 400) {
          this.toastr.error('Incorrect username or password!', 'Authentication Failed!');
        }
        else {
          console.log(err);
        }
      }
    );
  }
}
