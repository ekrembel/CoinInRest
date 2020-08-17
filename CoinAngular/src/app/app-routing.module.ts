import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { CreateAccountComponent } from './user/create-account/create-account.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './user/login/login.component';
import { MySharesComponent } from './my-shares/my-shares.component';
import { AuthGuard } from './auth/auth.guard';
import { BuyComponent } from './user/buy/buy.component';
import { CompaniesComponent } from './user/companies/companies.component';
import { QuotedComponent } from './user/quoted/quoted.component';
import { SoldSharesComponent } from './sold-shares/sold-shares.component';
import { AddFundComponent } from './add-fund/add-fund.component';
import { UpdatePasswordComponent } from './user/update-password/update-password.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';


const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'user', component: UserComponent, 
    children: [
      {path: 'createaccount', component: CreateAccountComponent},
      {path: 'login', component: LoginComponent}
    ]
  },
  {path: 'myshares', component: MySharesComponent, canActivate:[AuthGuard]},
  {path: 'buy', component: BuyComponent, canActivate:[AuthGuard]},
  {path: 'companies', component: CompaniesComponent, canActivate: [AuthGuard]},
  {path: 'quoted', component: QuotedComponent, canActivate: [AuthGuard]},
  {path: 'soldshares', component: SoldSharesComponent, canActivate: [AuthGuard]},
  {path: 'addfund', component: AddFundComponent, canActivate: [AuthGuard]},
  {path: 'updatepassword', component: UpdatePasswordComponent, canActivate: [AuthGuard]},
  {path: 'resetpassword', component: ResetPasswordComponent},
  {path: 'deleteaccount', component: DeleteAccountComponent, canActivate: [AuthGuard]}
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
