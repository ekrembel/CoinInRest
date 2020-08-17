import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  constructor(public service: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.service.formModel.reset();
  }

  onSubmit() {
    this.service.create().subscribe(
      (res:any) => {
        if(res.succeeded) {
          this.service.formModel.reset();
          this.toastr.success('Your account has been created!', 'Registration successful!')
        }
        else {
          res.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Username is already taken!', 'Registration failed!');
                
                break;
            
              default:
                this.toastr.error(element.description, 'Registration failed!');
                break;
            }
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
