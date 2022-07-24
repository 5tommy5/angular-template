import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared-module/shared.module';
import { ConfirmationComponent } from './confirm-email/confirmation.component';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login'; 
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { JwtModule } from '@auth0/angular-jwt';
import { ForgotComponent } from './forgot-password/forgot.component';


export function tokenGetter() {
  return sessionStorage.getItem("token");
}


@NgModule({
  declarations: [
    RegistrationComponent,
    LoginComponent,
    ConfirmationComponent,
    ForgotComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    SocialLoginModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: []
      }
    })
  ],
  providers:[
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1035178665133-piftrpk618n3k1d5rbuifc5clp7rftb7.apps.googleusercontent.com', {
                scope: 'email',
                plugin_name: 'CryptoFork'
              }
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    }
  ],
  exports: [
    RegistrationComponent,
    LoginComponent,
    ConfirmationComponent,
    ForgotComponent
  ]
})
export class UserModule { }