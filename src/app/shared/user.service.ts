import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private http:HttpClient) { }

  readonly BaseURI = "https://localhost:5001/api";

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.fb.group(
      {
        Password: ['', [Validators.required, Validators.minLength(4)]],
        ConfirmPassword: ['', Validators.required],
      },
      {
        validator: this.comparePasswords
      })
    
  });

  comparePasswords(fb:FormGroup) {
    let confirmPswdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswdCtrl.errors={passwordMismatch:true}
    if(confirmPswdCtrl.errors == null || 'passwordMismatch' in confirmPswdCtrl.errors) {
      if(fb.get('Password').value != confirmPswdCtrl.value)
      {
        confirmPswdCtrl.setErrors({passwordMismatch: true});
      }
      else
      {
        confirmPswdCtrl.setErrors(null);
      }
    }
  }

  register() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    return this.http.post(this.BaseURI + '/ApplicationUser/Register', body);
  }
}
