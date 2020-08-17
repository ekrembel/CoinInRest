import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quoted',
  templateUrl: './quoted.component.html',
  styleUrls: ['./quoted.component.css']
})
export class QuotedComponent implements OnInit {
  message;
  public Symbol: string;
  public Company: string;
  public Price: string;
  constructor(private route: ActivatedRoute, private service: UserService, private toastr: ToastrService, private router: Router) { 
    this.route.queryParams.subscribe(params => {
      this.Symbol = params["Symbol"];
      this.Company = params["Company"];
      this.Price = params["Price"];
    });
  }

  ngOnInit(): void {
  }

  onBuy() {
    if (confirm("Are you sure to buy this share?")) {
      this.service.buy().subscribe(
        (res:any) => {
          this.toastr.success("You have successfully bought it!", "Great!");
          this.service.buyModel.reset();
          this.router.navigateByUrl('/myshares');
        },
        err => {
          this.toastr.error("Total cost exceeds your available cash.", "Failed!");
        }
      );
    }
  }

}
