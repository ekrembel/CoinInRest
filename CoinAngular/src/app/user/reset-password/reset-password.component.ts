import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  init: boolean = true;
  reset: boolean = false;
  token;
  email;
  constructor(private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.resetPasswordModel.reset();
  }

  onClick(email) {
    if (email == '') {
      this.toastr.warning("Please enter a valid email address!");
    }
    else {
      this.init = false;
      this.reset = true;
      let data = {
        "Email": email
      }
      this.service.getResetToken(data).subscribe(
        res => {
          this.email = res["data"][0];
          this.token = res["data"][1];
        },
        err => {}
      );
    }
  }

  onReset(password) {
    let data = {
      "Email": this.email,
      "Token": this.token,
      "Password": password
    }
    this.service.resetPassword(data).subscribe(
      res => {
        this.service.resetPasswordModel.reset();
        this.toastr.success("Your password has been reset.", "Successful!");
      },
      err => {
        this.toastr.error("Please try again.", "Failed!");
      }
    );
  }
}
