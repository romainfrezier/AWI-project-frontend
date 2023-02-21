import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './components/signin/signin.component';
import {SharedModule} from "../shared/shared.module";
import {AuthRoutingModule} from "./auth-routing.module";
import {AuthService} from "./services/auth.service";
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';



@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    SharedModule,
  ],
  providers: [
    AuthService
]

})
export class AuthModule { }
