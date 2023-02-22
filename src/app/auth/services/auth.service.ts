import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {User} from "../models/user";
import {BehaviorSubject, Observable} from "rxjs";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  userData: any;

  private _isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  get isUserLoggedIn$(): Observable<boolean> {
    return this._isUserLoggedIn$.asObservable();
  }
  private setIsUserLoggedIn$(value: boolean) {
    this._isUserLoggedIn$.next(value);
  }

  constructor(public afs: AngularFirestore,
              public afAuth: AngularFireAuth,
              public router: Router,
              ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then((result) => {
      this.router.navigateByUrl("/volunteers");
      this.setIsUserLoggedIn$(true);
      this.setUserData(result.user);
    }).catch((error) => {
      if (error.message === "Firebase: The email address is badly formatted. (auth/invalid-email)."){
        Notify.failure("L'adresse email n'est pas au bon format");
      } else if (error.message === "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)."){
        Notify.failure("L'utilisateur n'existe pas");
      } else if (error.message === "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)."){
        Notify.failure("Le mot de passe est incorrect");
      } else {
        Notify.failure("Erreur d'authentification, vérifiez votre email et votre mot de passe");
      }
    });
  }

  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then((result) => {
        this.sendVerificationMail();
        this.setUserData(result.user);
      })
      .catch((error) => {
        if (error.message === "Firebase: The email address is badly formatted. (auth/invalid-email)."){
          Notify.failure("L'adresse email n'est pas au bon format");
        } else if (error.message === "Firebase: The email address is already in use by another account. (auth/email-already-in-use)."){
          Notify.failure("L'adresse email est déjà utilisée");
        } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
          Notify.failure("Le mot de passe doit contenir au moins 6 caractères");
        } else {
          Notify.failure("Erreur d'inscription, vérifiez votre email et votre mot de passe");
        }
      });
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigateByUrl("/auth/verify-email");
      });
  }

  forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        Notify.success('Un email de réinitialisation de mot de passe vous a été envoyé');
      })
      .catch((error) => {
        if (error.message === "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)."){
          Notify.failure("L'utilisateur n'existe pas");
        } else if (error.message === "Firebase: The email address is badly formatted. (auth/invalid-email)."){
          Notify.failure("L'adresse email n'est pas au bon format");
        } else {
          Notify.failure("Erreur d'envoi de l'email de réinitialisation de mot de passe");
        }
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user !== null && user.emailVerified !== false){
      this.setIsUserLoggedIn$(true);
    } else {
      this.setIsUserLoggedIn$(false);
    }
    return this._isUserLoggedIn$.value;
  }

  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      if (res) {
        this.router.navigateByUrl("/volunteers");
        this.setIsUserLoggedIn$(true);
      }
    });
  }

  authLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider).then((result) => {
        this.router.navigateByUrl("/volunteers");
        this.setIsUserLoggedIn$(true);
        this.setUserData(result.user);
      })
      .catch(() => {
        Notify.failure("Erreur d'authentification, vérifiez votre email et votre mot de passe");
      });
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigateByUrl("/auth/login");
      this.setIsUserLoggedIn$(false);
    });
  }
}
