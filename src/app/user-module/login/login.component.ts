import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalLoginModel } from 'src/app/shared-module/models/user/externalLogin.model';
import { LoginModel } from 'src/app/shared-module/models/user/login.model';
import { AuthenticationService } from 'src/app/shared-module/services/authentication.service';



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loading : boolean = false;
  private returnUrl: string;

  user : LoginModel = new LoginModel();
  error : string = "";
  isError : boolean = false;

  isSendedValidateRequest : boolean = false;

  constructor(private _service : AuthenticationService, private router: Router, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  externalLogin(){
    this.loading = true;

    this._service.signInWithGoogle();

    this._service.extAuthChanged.subscribe( user => {
      const externalAuth: ExternalLoginModel = {
        provider: user.provider,
        token: user.idToken
      }
      if(!this.isSendedValidateRequest){
        this.isSendedValidateRequest = true;
        this.validateExternalAuth(externalAuth);

      }
    })
  }

  private validateExternalAuth(externalAuth: ExternalLoginModel) {
    this._service.externalLogin(externalAuth)
      .subscribe({
        next: (res) => {
            this.loading = false;
            console.log(res);
            if(res.response.success){
              sessionStorage.setItem("token", res.tokens.accessToken);
              sessionStorage.setItem("refreshToken", res.tokens.refreshToken);
              this._service.sendAuthStateChangeNotification(res.response.success);
              this.router.navigate([this.returnUrl]);
            }else{
              this.handleError(res.response.errors);
            }

      },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.handleEr(err.message);

          this._service.signOutExternal();
        }
      });
  }

  login(){
    let time = setTimeout(x=> {
      this.loading = true;
    }, 400);
    console.log(this.user);

    this._service.loginUser(this.user).subscribe((res)=>{
      clearTimeout(time);
      this.loading = false;
      console.log(res);
      if(!res.response.success){
        this.handleError(res.response.errors);
      }
      else{
        sessionStorage.setItem("token", res.tokens.accessToken);
        sessionStorage.setItem("refreshToken", res.tokens.refreshToken);
      }
    })
  }

  handleError(errors : Array<string>){
    this.isError = true;

    if(errors.length > 0){
      this.error = errors[0];
    }
    else{
      this.error = "Unpredictable error";
    }

    setTimeout(()=>{
      this.isError = false;
    }, 4000);
  }

  handleEr(errors : string){
    this.isError = true;

    this.error = errors;

    setTimeout(()=>{
      this.isError = false;
    }, 4000);
  }

}
