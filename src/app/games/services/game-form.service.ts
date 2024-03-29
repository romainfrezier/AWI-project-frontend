import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, mapTo, Observable, of} from "rxjs";
import {Game} from "../models/game.model";
import {environment} from "../../../environments/environment.prod";

@Injectable()
export class GameFormService {

  constructor(private http: HttpClient) {}

  saveGame(formValue: Game): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/games`, formValue).pipe(
      mapTo(true),
      catchError(() => of(false).pipe())
    );
  }
}
