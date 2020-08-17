import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  constructor(private service: UserService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  onDelete(password, reason) {
    if (confirm("You will lose all your data permanently. Are you sure to delete?")) {
      let data = {
        "Password": password,
        "Feedback": reason
      }
      this.service.deleteAccount(data).subscribe(
        res => {
          localStorage.removeItem('token');
          this.router.navigate(["/"]);
          this.toastr.success("Your account has been deleted.", "Sorry to see you go!");
        },
        err => {
          this.toastr.error("Please try again", "Failed!");
        }
      );
    }

  }

}
