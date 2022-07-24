import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app-component/app.component';

import { AppRoutingModule } from './app-routing.module';
import { UserModule } from './user-module/user.module';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login'; 
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { JwtModule } from '@auth0/angular-jwt';
import { ForksModule } from './fork-module/fork.module';

export function tokenGetter() {
  return sessionStorage.getItem("token");
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    ForksModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
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
  bootstrap: [AppComponent]
})
export class AppModule { }
