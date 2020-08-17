import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-fund',
  templateUrl: './add-fund.component.html',
  styleUrls: ['./add-fund.component.css']
})
export class AddFundComponent implements OnInit {
  amountForm: boolean = true;
  addForm: boolean = false;
  amount;
  userDetails;
  constructor(private service: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.userProfile();
  }

  userProfile() {
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  onAmount(num) {
    if (num > 0) {
      this.amount = Number(num);
      this.amountForm = false;
      this.addForm = true;
    }
    else {
      this.toastr.warning('Please enter a valid amount!')
    }
    
  }

  onAdd(amount) {
    if (confirm("$"+amount/5000 + " will be charged from your card.")) {
      let data = {
        "Fund": Number(amount)
      }
      this.amountForm = true;
      this.addForm = false;
      this.service.addFund(data).subscribe(
        res => {
          this.toastr.success("The amount has been added to your fund", "Successful!");
          this.userProfile();
          this.amount = 0;
        },
        err => {
          this.toastr.error("Please try again.", "Failed.")
        }
      );
    }

  }
}
