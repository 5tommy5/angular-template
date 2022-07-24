import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { JwtHelperService } from '@auth0/angular-jwt';
import { RegistrationModel } from '../models/user/registration.model';
import { ResponseModel } from '../models/user/response.model';
import { LoginModel } from '../models/user/login.model';
import { LoginInfoModel } from '../models/user/loginInfo.model';
import { ForgetPasswordModel } from '../models/user/forgetPassword.model';
import { RecoverPasswordModel } from '../models/user/recoverPassword.model';
import { ExternalLoginModel } from '../models/user/externalLogin.model';
import { ResendConfirmationCodeModel } from '../models/user/resendConfirmationCode.model';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authChangeSub = new Subject<boolean>();
  private extAuthChangeSub = new Subject<SocialUser>();
  public authChanged = this.authChangeSub.asObservable();
  public extAuthChanged = this.extAuthChangeSub.asObservable();
  public isExternalAuth: boolean;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private externalAuthService: SocialAuthService) { 
      this.externalAuthService.authState.subscribe((user) => {
        console.log(user);
        this.extAuthChangeSub.next(user);
        this.isExternalAuth = true;
      })
    }

  public registerUser = (body: RegistrationModel) => {
    body.clientUri = "http://localhost:4200/confirmation";
    return this.http.post<ResponseModel> (this.createCompleteRoute("api/auth/register"), body);
  }

  public loginUser = (body: LoginModel) => {
    return this.http.post<LoginInfoModel>(this.createCompleteRoute("api/auth/login"), body);
  }

  public forgotPassword = (body: ForgetPasswordModel) => {
    body.clientUri = "http://localhost:4200/forgot"
    return this.http.post(this.createCompleteRoute("api/auth/forgetpassword"), body);
  }

  public resetPassword = (body: RecoverPasswordModel) => {
    return this.http.post<ResponseModel>(this.createCompleteRoute("api/auth/recoverpassword"), body);
  }

  public confirmEmail = (token: string) => {
    let params = new HttpParams();
    params = params.append('confirmationToken', token);
    
    return this.http.get<ResponseModel>(this.createCompleteRoute("api/auth/confirmemail"), { params: params });
  }

  public refreshToken = () => {
    let params = new HttpParams();
    params = params.append('refreshToken', sessionStorage.getItem("refreshToken"));
    this.http.get<LoginInfoModel>(this.createCompleteRoute("api/auth/RevokeRefreshToken"), { params: params }).subscribe((res)=>{
      sessionStorage.setItem("token", res.tokens.accessToken);
      sessionStorage.setItem("refreshToken", res.tokens.refreshToken);
    })
  }

  public resendConfirmationEmail = (body: ResendConfirmationCodeModel)=>{
    body.clientUri = "http://localhost:4200/confirmation";
    console.log(body);
    return this.http.post(this.createCompleteRoute("api/auth/ResendConfirmationCode"), body);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  }

  public logout = () => {
    sessionStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }

  public isUserAuthenticated = (): boolean => {
    const token = sessionStorage.getItem("token");
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  public isUserAdmin = (): boolean => {
    const token = sessionStorage.getItem("token");
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
   
    return role === 'Administrator';
  }

  public isUserSubscriber = (): boolean => {
    const token = sessionStorage.getItem("token");
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    
    return role === 'Subscriber';
  }

  public signInWithGoogle = ()=> {
    this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  public signOutExternal = () => {
    this.externalAuthService.signOut();
  }

  public externalLogin = (body: ExternalLoginModel) => {
    return this.http.post<LoginInfoModel>(this.createCompleteRoute("api/auth/externallogin"), body);
  }

  private createCompleteRoute = (route: string) => {
    return `https://localhost:7293/${route}`;
  }
}
