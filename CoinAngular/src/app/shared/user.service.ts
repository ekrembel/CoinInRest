import { Injectable } from '@angular/core';

import { FormBuilder, Validators, FormGroup, FormControl, EmailValidator } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb: FormBuilder, private http: HttpClient) {}
  
  readonly BaseURI = "https://localhost:5001/api";
  readonly BaseURI2 = "https://cloud-sse.iexapis.com/stable/stock/";
  

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', Validators.required]
    }, {validators: this.comparePasswords})
  });

  companyModel = this.fb.group({
    Name: ['', Validators.required]
  });

  buyModel = this.fb.group({
    Symbol: ['', Validators.required],
    Share: ['', Validators.required]
  });

  symbolModel = this.fb.group({
    Symbol: ['', Validators.required],
  });

  deleteAccountModel = this.fb.group({
    Password: ['', Validators.required]
  });

  addCompanyModel = this.fb.group({
    Symbol: ['', Validators.required],
    Name: ['', Validators.required]
  });

  updatePasswordModel = this.fb.group({
    OldPassword: ['', Validators.required],
    NewPasswords: this.fb.group({
      NewPassword: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmNewPassword: ['', Validators.required]
    }, {validators: this.compareNewPasswords})
  });

  resetPasswordModel = this.fb.group({
    NewPasswords: this.fb.group({
      NewPassword: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmNewPassword: ['', Validators.required]
    }, {validators: this.compareNewPasswords})
  });

  comparePasswords(fb: FormGroup) {
    let confirmPasswordControl = fb.get('ConfirmPassword');
    if(confirmPasswordControl.errors == null || "passwordMismatch" in confirmPasswordControl.errors) {
      if(fb.get('Password').value != fb.get('ConfirmPassword').value) {
        confirmPasswordControl.setErrors({passwordMismatch: true});
      }
      else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  compareNewPasswords(fb: FormGroup) {
    let confirmPasswordControl = fb.get('ConfirmNewPassword');
    if(confirmPasswordControl.errors == null || "passwordMismatch" in confirmPasswordControl.errors) {
      if(fb.get('NewPassword').value != fb.get('ConfirmNewPassword').value) {
        confirmPasswordControl.setErrors({passwordMismatch: true});
      }
      else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  create() {
    let body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      Password: this.formModel.value.Passwords.Password
    };
    return this.http.post(this.BaseURI + "/User/Create", body);
  }

  login(formData) {
    return this.http.post(this.BaseURI + "/User/Login", formData);
  }

  getUserProfile() {
    
    return this.http.get(this.BaseURI + '/UserProfile');
  }

  getShareDetails() {
    return this.http.get(this.BaseURI + '/Bought');
  }

  

  quoted() {  
    return this.http.jsonp(this.BaseURI2 + this.symbolModel.value.Symbol + "/quote?token=pk_f7b30f305a8c4aef8eaec49711a8344e", 'callback')  
  } 
  quoted2(symbol) {  
    return this.http.jsonp(this.BaseURI2 + symbol + "/quote?token=pk_f7b30f305a8c4aef8eaec49711a8344e", 'callback')  
  }   

  getCompanies() {
    return this.http.get(this.BaseURI + '/Transaction/Companies');
  }

  search() {
    return this.http.get(this.BaseURI + '/Transaction/Search', { params: { Name : this.companyModel.value.Name } });
  }

  buy() {
    let data = {
      "Symbol": this.buyModel.value.Symbol,
      "Share": this.buyModel.value.Share 
    }
    return this.http.post(this.BaseURI + '/Transaction/Buy', data);
  }

  sell(data) {
    return this.http.post(this.BaseURI + '/Transaction/Sell', data);
  }

  addCompany() {
    let newCompany = {
      "Symbol": this.addCompanyModel.value.Symbol,
      "Name": this.addCompanyModel.value.Name
    }
    return this.http.post(this.BaseURI + '/Transaction/addcompany', newCompany);
  }

  getSoldShares() {
    return this.http.get(this.BaseURI + '/Transaction/SoldShares');
  }

  addFund(data) {
    return this.http.post(this.BaseURI + '/UserProfile/AddFund', data);
  }

  updatePassword() {
    let data = {
      "Password": this.updatePasswordModel.value.OldPassword,
      "NewPassword": this.updatePasswordModel.value.NewPasswords.NewPassword
    }
    return this.http.post(this.BaseURI + '/UserProfile/UpdatePassword', data);
  }

  getResetToken(data) {
    return this.http.post(this.BaseURI + '/UserProfile/ForgotPassword', data);
  }

  resetPassword(data) {
    let resetData = {
      "Email": data.Email,
      "Token": data.Token,
      "NewPassword": data.Password
    }
    return this.http.post(this.BaseURI + '/UserProfile/ResetPassword', resetData);
  }

  deleteAccount(data) {
    let deleteData = {
      "Password": data.Password,
      "Feedback": data.Feedback
    }
    return this.http.post(this.BaseURI + '/UserProfile/DeleteAccount', deleteData);
  }

}  
