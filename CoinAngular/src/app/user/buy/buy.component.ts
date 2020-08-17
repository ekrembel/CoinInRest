import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  companies;
  companyList;
  share;
  name;
  addCompany: boolean = false;
  spinnerCompanyList: boolean = false;
  constructor(private route: ActivatedRoute, private service: UserService, private toastr: ToastrService, private router: Router ) { }
  
  

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params.name;
    })
  }

  onCancel() {
    this.addCompany = false;
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
        this.toastr.warning('Please double check the symbol');
        if(err.status == 404) {
          
        }
        else {
          console.log(err);
        }
      }
    );
  }
  onDisplay() {
    
    let element = document.querySelector("#add");
    if ( element ) {
      element.scrollIntoView();
    } 
    this.addCompany = true;
  }

  onClick(symbol) {
    this.service.quoted2(symbol).subscribe(
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
        this.toastr.warning("Please click the button again.");
      }
    );
  }

  onSearch() {
    this.companyList = null;
    this.service.search().subscribe(
      (res:any) => {
        if (res.length > 0) {
          this.companies = res;
        }
        else {
          this.toastr.error('', 'Company does not exist in our list!');
        }
        
      },
      err => {
        if(err.status == 400) {
          this.toastr.error('Bad Request', 'No result!');
        }
        else {
          console.log(err);
        }
      }
    );
  }

  onLoad() {
    this.companies = null;
    this.spinnerCompanyList = true;
    this.service.getCompanies().subscribe(
      (res:any) => {
        this.companyList = res;
        this.spinnerCompanyList = false;
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

  onAdd() {
    this.service.addCompany().subscribe(
      (res:any) => {
        this.toastr.success(res.message);
        this.addCompany = false;
      },
      err => {
        if (err.status == 400) {
          this.toastr.error("Company already exists in our list or does not exist in this stock market.", "Failed!");
        }
        else {
          console.log(err);
        }
        
        this.addCompany = false;
      }
    );
  }

  
  
}
