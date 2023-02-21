import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerForm!: FormGroup;
  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmCtrl!: FormControl;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.emailCtrl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.confirmCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.registerForm = new FormGroup({
      emailCtrl: this.emailCtrl,
      passwordCtrl: this.passwordCtrl,
      confirmCtrl: this.confirmCtrl
    }, {validators: this.matchValuesValidator('passwordCtrl', 'confirmCtrl'),updateOn: 'blur'});
    Notify.init({
      position: 'right-bottom',
    });
  }

  matchValuesValidator(main: string, confirm: string): ValidatorFn {
    return (ctrl: AbstractControl): null | ValidationErrors => {
      if (!ctrl.get(main) || !ctrl.get(confirm)) {
        return {
          confirmEqual: 'Invalid control names'
        };
      }
      const mainValue = ctrl.get(main)!.value;
      const confirmValue = ctrl.get(confirm)!.value;

      return mainValue === confirmValue ? null : {
        confirmEqual: {
          main: mainValue,
          confirm: confirmValue
        }
      };
    };
  }

  getFormCtrlErrorText(ctrl: AbstractControl) : string {
    if (ctrl.hasError('required')){
      return "Ce champ est requis"
    } else if (ctrl.hasError('email')) {
      return "Ceci n'est pas une adresse email valide"
    } else if (ctrl.hasError('minlength ')) {
      return "Ce champ doit contenir au moins 6 caractères"
    } else if (ctrl.hasError('confirmEqual')) {
      return "Les mots de passe ne correspondent pas"
    } else {
      return "Ce champ est invalide"
    }
  }

}
