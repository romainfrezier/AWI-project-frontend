import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emailCtrl!: FormControl;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  }

}
