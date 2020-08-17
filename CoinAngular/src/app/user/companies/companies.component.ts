import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationExtras } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  companies:any;
  symbol = new FormControl('');
  constructor(private service: UserService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.onLoad();
  }

  onSubmit() {
    this.service.quoted().subscribe(
      (res:any) => {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            "Symbol": res.symbol,
            "Company": res.companyName,
            "Price": res.latestPrice
          } 
        }
        this.router.navigate(['quoted'], navigationExtras);
        
      },
      err => {
        if(err.status == 400) {
          this.toastr.error('Failed', 'Quote Failed!');
        }
        else {
          console.log(err);
        }
      }
    );
  }

  onLoad() {
    this.service.getCompanies().subscribe(
      (res:any) => {
        this.companies = res.companies;
      },
      err => {
        if (err.status == 400) {
          this.toastr.error("Unable to load the list.");
        }
        else {
          console.log(err);
        }
      }
    );
  }

}
