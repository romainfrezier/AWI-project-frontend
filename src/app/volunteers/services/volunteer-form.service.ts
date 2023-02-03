import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, mapTo, Observable, of} from "rxjs";
import {Volunteer} from "../models/volunteer.model";
import {environment} from "../../../environments/environment.prod";

@Injectable()
export class VolunteerFormService {
  private _applications$ = new BehaviorSubject<Volunteer[]>([]);
  get applications$(): Observable<Volunteer[]> {
    return this._applications$.asObservable();
  }

  constructor(private http: HttpClient) {}

  saveVolunteer(formValue: Volunteer): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/volunteers`, formValue).pipe(
      mapTo(true),
      catchError(() => of(false).pipe())
    );
  }
}
