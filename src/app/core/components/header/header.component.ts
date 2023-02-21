import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isUserLoggedIn : boolean = false;

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn
    this.authService.isUserLoggedIn$.subscribe((value) => {
      this.isUserLoggedIn = value;
      console.log("isUserLoggedIn", this.isUserLoggedIn);
    });
  }

  logout() {
    this.authService.signOut().then(() => {
      this.isUserLoggedIn = false;
      this.router.navigateByUrl("/")
    }
    );
  }



}
