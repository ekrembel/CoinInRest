import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-shares',
  templateUrl: './my-shares.component.html',
  styleUrls: ['./my-shares.component.css']
})
export class MySharesComponent implements OnInit {
  userDetails;
  totalCost: number = 0;
  shares;
  checkedShare;
  checker: number = 0;
  colorValue: string;
  spinnerCheck: boolean = false;

  constructor(private router: Router, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.shareDetails();
  }


  shareDetails() {
    this.totalCost = 0;
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      }
    );

    this.service.getShareDetails().subscribe(
      res => {
        this.shares = res;
        var length = this.shares.length;
        for (var i = 0; i < length; i++ ) {
          this.totalCost += this.shares[i].latestPrice;
        }
      },
      err => {
        this.toastr.show("Go to quote to buy some shares.");
        console.log(err);
      }
    );

  }

  onSell(symbol, share) {
    if (confirm("Are you sure to sell this share?")) {
      var item = [{
        "Symbol": symbol,
        "NumOfShare": Number(share)
      }
       
    ]
      this.service.sell(item[0]).subscribe(
        res => {
          this.checkedShare = null;
          this.toastr.success("You share has been sold.", "Great news!");
          this.shareDetails();
  
        },
        err => {
          this.toastr.error("Please try again.","Failed!")
        }
      );
    }
  }

  onCheck(symbol) {
    this.spinnerCheck = true;
    this.service.quoted2(symbol).subscribe(
      (res:any) => {
        let element = document.querySelector("#check");
        if ( element ) {
          element.scrollIntoView();
        } 
        this.spinnerCheck = false;
        this.service.getShareDetails().subscribe(
          resOld => {
            this.shares = resOld;
            var length = this.shares.length;
            for (var i = 0; i < length; i++) {
              if (this.shares[i].symbol == symbol) {
                if (this.shares[i].latestPrice > res.latestPrice) {
                  this.colorValue = "red";
                }
                else if (this.shares[i].latestPrice < res.latestPrice) {
                  this.colorValue = "green";
                }
              }
            }
            this.shareDetails();
          },
          errOld => {
            console.log(errOld);
          }
        );
        
        this.checkedShare = res;

      },
      err => {
        this.toastr.warning("Failed", "Please try again");
      }
    );
  }

}
