import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormControl, Validators} from "@angular/forms";
import {Notify} from "notiflix/build/notiflix-notify-aio";


@Component({
  selector: 'app-auth',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.emailCtrl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
    Notify.init({
      position: 'right-bottom',
    });
  }
}
