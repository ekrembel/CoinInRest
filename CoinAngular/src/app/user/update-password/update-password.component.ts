import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  constructor(private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.updatePasswordModel.reset();
  }

  onUpdate() {
    this.service.updatePassword().subscribe(
      res => {
        this.service.updatePasswordModel.reset();
        this.toastr.success("Your password has been updated.", "Successful!")
      },
      err => {
        this.toastr.error("Please try again.", "Failed!")
      }
    );
  }

}
