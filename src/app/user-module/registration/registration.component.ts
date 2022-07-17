import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalLoginModel } from 'src/app/shared-module/models/user/externalLogin.model';
import { RegistrationModel } from 'src/app/shared-module/models/user/registration.model';
import { AuthenticationService } from 'src/app/shared-module/services/authentication.service';



@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public loading : boolean = false;
  private returnUrl: string;
  isSendedValidateRequest : boolean = false;

  user : RegistrationModel = new RegistrationModel();
  secondPass : string ;
  error : string = "";
  isError : boolean = false;

  get identicalPasswords() : boolean{
    return this.user.password == this.secondPass;
  }

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
              this.handleError(res.response.errors[0]);
            }

      },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.handleError(err.message);

          this._service.signOutExternal();
        }
      });
  }

  register(){
    if(this.user.username == null || this.user.password == null || this.user.email == null){
      this.handleError("Enter your credentials");
      return;
    }
    if(!this.identicalPasswords){
      this.handleError("Passwords are not same");
      return;
    }

    let time = setTimeout(x=> {
      this.loading = true;
    }, 400);
    console.log(this.user);

    this._service.registerUser(this.user).subscribe((x)=>{
      clearTimeout(time);
      this.loading = false;
      console.log(x);
      if(!x.success){
        this.handleError(x.errors[0]);
      }
      else{
        this.router.navigate(["confirmation", this.user.email]);
      }
    }, error => {
      clearTimeout(time);
      this.loading = false;
      this.handleError("Something gone wrong");

    })
  }

  handleError(error : string){
    this.isError = true;

    if(error){
      this.error = error;
    }
    else{
      this.error = "Unpredictable error";
    }

    setTimeout(()=>{
      this.isError = false;
    }, 4000);
  }

}
