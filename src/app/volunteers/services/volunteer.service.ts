import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, delay, map, mapTo, Observable, of, switchMap, take, tap} from 'rxjs';
import {environment} from "../../../environments/environment.prod";
import {Volunteer} from "../models/volunteer.model";

@Injectable()
export class VolunteersService {
  constructor(private http: HttpClient) {}

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _volunteers$ = new BehaviorSubject<Volunteer[]>([]);
  get volunteers$(): Observable<Volunteer[]> {
    return this._volunteers$.asObservable();
  }

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getVolunteersFromServer() {
    this.setLoadingStatus(true);

    const compareFn = (a:Volunteer, b:Volunteer) => {
      if (a.nom < b.nom)
        return -1;
      if (a.nom > b.nom)
        return 1;
      return 0;
    };

    this.http.get<Volunteer[]>(`${environment.apiUrl}/volunteers`).pipe(
      map(volunteers => volunteers.sort(compareFn)),
      tap(volunteers => {
        this._volunteers$.next(volunteers);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getVolunteerById(id: string): Observable<Volunteer> {
    return this.volunteers$.pipe(
      map(volunteers => volunteers.filter(volunteer => volunteer._id === id)[0])
    );
  }


  removeVolunteer(id: string) {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/volunteers/${id}`).pipe(
      switchMap(() => this.volunteers$),
      take(1),
      map(volunteers => volunteers.filter(volunteer => volunteer._id !== id)),
      tap(volunteers => {
        this._volunteers$.next(volunteers);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  updateVolunteer(id: string, updatedVolunteer: Volunteer) {
    return this.http.patch(`${environment.apiUrl}/volunteers/${id}`, updatedVolunteer).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }
}
