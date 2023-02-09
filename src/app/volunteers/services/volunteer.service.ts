import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, map, mapTo, Observable, of, switchMap, take, tap} from 'rxjs';
import {environment} from "../../../environments/environment.prod";
import {Volunteer} from "../models/volunteer.model";
import {VolunteerFilteredByDate} from "../models/volunteer-filtered-by-date";
import {VolunteerFilteredByArea} from "../models/volunteer-filtered-by-area";

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

  private _volunteersFilteredByDate$ = new BehaviorSubject<VolunteerFilteredByDate[]>([]);
  get volunteersFilteredByDate$(): Observable<VolunteerFilteredByDate[]> {
    return this._volunteersFilteredByDate$.asObservable();
  }

  private _volunteersFilteredByArea$ = new BehaviorSubject<VolunteerFilteredByArea[]>([]);
  get volunteersFilteredByArea$(): Observable<VolunteerFilteredByArea[]> {
    return this._volunteersFilteredByArea$.asObservable();
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
    if (!this._volunteers$.value.length) {
      return this.http.get<Volunteer>(`${environment.apiUrl}/volunteers/${id}`);
    } else {
      return this.volunteers$.pipe(
        map(volunteers => volunteers.filter(volunteer => volunteer._id === id)[0])
      );
    }
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


  getVolunteersFromServerByDate(date_deb: string, date_fin: string) {
    this.setLoadingStatus(true);

    const compareFn = (a:VolunteerFilteredByDate, b:VolunteerFilteredByDate) => {
      if (a.benevole.nom < b.benevole.nom)
        return -1;
      if (a.benevole.nom > b.benevole.nom)
        return 1;
      return 0;
    };

    this.http.get<VolunteerFilteredByDate[]>(`${environment.apiUrl}/assignments/dates/${date_deb}/${date_fin}`).pipe(
      map(volunteers => volunteers.sort(compareFn)),
      tap(volunteers => {
        this._volunteersFilteredByDate$.next(volunteers);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }


  getVolunteersFromServerByArea(area: string) {
    this.setLoadingStatus(true);

    const compareFn = (a:VolunteerFilteredByArea, b:VolunteerFilteredByArea) => {
      if (a.benevole.nom < b.benevole.nom)
        return -1;
      if (a.benevole.nom > b.benevole.nom)
        return 1;
      return 0;
    };

    this.http.get<VolunteerFilteredByArea[]>(`${environment.apiUrl}/assignments/areas/${area}`).pipe(
      map(volunteers => volunteers.sort(compareFn)),
      tap(volunteers => {
        this._volunteersFilteredByArea$.next(volunteers);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }
}
