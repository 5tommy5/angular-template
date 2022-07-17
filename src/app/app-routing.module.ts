import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationComponent } from './user-module/confirm-email/confirmation.component';
import { LoginComponent } from './user-module/login/login.component';
import { RegistrationComponent } from './user-module/registration/registration.component';

const routes: Routes = [
  {path: "registration", component : RegistrationComponent},
  {path: "login", component : LoginComponent},
  {path: "confirmation/:email", component: ConfirmationComponent},
  {path: "confirmation", component: ConfirmationComponent},
  {path: "**", component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
