import { Component, OnInit } from '@angular/core';
import {Confirm} from "notiflix";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'awi-frontend';

  ngOnInit(): void {
    Confirm.init({
      cancelButtonBackground: '#d33',
      okButtonBackground: 'rgb(65,83,175)',
      titleColor: 'rgb(65,83,175)',
    });
    Notify.init({
      position: 'right-bottom',
    });
  }
}
