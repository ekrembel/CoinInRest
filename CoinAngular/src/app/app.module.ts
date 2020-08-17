import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { CreateAccountComponent } from './user/create-account/create-account.component';
import { UserService } from './shared/user.service';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './user/login/login.component';
import { MySharesComponent } from './my-shares/my-shares.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BuyComponent } from './user/buy/buy.component';
import { CompaniesComponent } from './user/companies/companies.component';
import { QuotedComponent } from './user/quoted/quoted.component';
import { SoldSharesComponent } from './sold-shares/sold-shares.component';
import { AddFundComponent } from './add-fund/add-fund.component';
import { UpdatePasswordComponent } from './user/update-password/update-password.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    CreateAccountComponent,
    HomepageComponent,
    LoginComponent,
    MySharesComponent,
    BuyComponent,
    CompaniesComponent,
    QuotedComponent,
    SoldSharesComponent,
    AddFundComponent,
    UpdatePasswordComponent,
    ResetPasswordComponent,
    DeleteAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true
    }),
    FormsModule,
    HttpClientJsonpModule
  ],
  providers: [UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
