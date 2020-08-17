import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-sold-shares',
  templateUrl: './sold-shares.component.html',
  styleUrls: ['./sold-shares.component.css']
})
export class SoldSharesComponent implements OnInit {
  mySoldShares;
  totalProfit;
  colorValue: string;
  constructor(private service: UserService) { }

  ngOnInit() {
    this.soldShares();
  }

  soldShares() {
    this.totalProfit = 0;
    this.service.getSoldShares().subscribe(
      res => {
        this.mySoldShares = res;
        var length = this.mySoldShares.length;
        for (var i = 0; i < length; i++) {
          this.totalProfit += this.mySoldShares[i]["profit"];
        }
        if (this.totalProfit > 0) {
          this.colorValue = "green";
        }
        else if (this.totalProfit < 0) {
          this.colorValue = "red";
        }
      },
      err => {}
    );
  }

}
