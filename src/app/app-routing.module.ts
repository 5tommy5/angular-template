import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForksComponent } from './fork-module/forks/forks.component';
import { ConfirmationComponent } from './user-module/confirm-email/confirmation.component';
import { ForgotComponent } from './user-module/forgot-password/forgot.component';
import { LoginComponent } from './user-module/login/login.component';
import { RegistrationComponent } from './user-module/registration/registration.component';

const routes: Routes = [
  {path: "registration", component : RegistrationComponent},
  {path: "login", component : LoginComponent},
  {path: "confirmation/:email", component: ConfirmationComponent},
  {path: "confirmation", component: ConfirmationComponent},
  {path: "forgot", component: ForgotComponent},
  {path: "**", component: ForksComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
