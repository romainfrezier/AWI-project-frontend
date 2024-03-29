import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, mapTo, Observable, of, switchMap, take, tap} from "rxjs";
import {environment} from "../../../environments/environment.prod";
import {Assignment} from "../models/assignment.model";
import {Volunteer} from "../../volunteers/models/volunteer.model";
import {Game} from "../../games/models/game.model";
import {Area} from "../models/area.model";
import {TimeSlot} from "../../volunteers/models/time-slot";

@Injectable()
export class AssignmentService {
  constructor(private http: HttpClient) {}

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _assignments$ = new BehaviorSubject<Assignment[]>([]);
  get assignments$(): Observable<Assignment[]> {
    return this._assignments$.asObservable();
  }

  private _volunteer$ = new BehaviorSubject<Volunteer[]>([]);
  get volunteer$(): Observable<Volunteer[]> {
    return this._volunteer$.asObservable();
  }

  private _game$ = new BehaviorSubject<Game[]>([]);
  get game$(): Observable<Game[]> {
    return this._game$.asObservable();
  }

  private _areas$ = new BehaviorSubject<Area[]>([]);
  get areas$(): Observable<Area[]> {
    return this._areas$.asObservable();
  }

  private _hours$ = new BehaviorSubject<TimeSlot[]>([]);
  get hours$(): Observable<TimeSlot[]> {
    return this._hours$.asObservable();
  }

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getAssignmentsFromServer() {
    this.setLoadingStatus(true);

    const compareFn = (a:Assignment, b:Assignment) => {
      if (a.date_deb < b.date_deb)
        return -1;
      if (a.date_deb > b.date_fin)
        return 1;
      return 0;
    };

    this.http.get<Assignment[]>(`${environment.apiUrl}/assignments`).pipe(
      map(assignments => assignments.sort(compareFn)),
      tap(assignments => {
        this._assignments$.next(assignments);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getAreasFromServer() {
    this.setLoadingStatus(true);

    const compareFn = (a:Area, b:Area) => {
      if (a.nom < b.nom)
        return -1;
      if (a.nom > b.nom)
        return 1;
      return 0;
    };

    this.http.get<Area[]>(`${environment.apiUrl}/assignments/areas`).pipe(
      map(areas => areas.sort(compareFn)),
      tap(areas => {
        this._areas$.next(areas);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getHoursFromServer() {
    this.setLoadingStatus(true);

    const compareFn = (a:TimeSlot, b:TimeSlot) => {
      if (a._id.date_deb < b._id.date_deb)
        return -1;
      if (a._id.date_deb > b._id.date_deb)
        return 1;
      return 0;
    }

    this.http.get<TimeSlot[]>(`${environment.apiUrl}/assignments/dates`).pipe(
      map(hours => hours.sort(compareFn)),
      tap(hours => {
        this._hours$.next(hours);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getAssignmentVolunteer(id: string): Observable<Volunteer> {
    return this.http.get<Volunteer>(`${environment.apiUrl}/volunteers/${id}`);
  }

  getAssignmentGame(id: string) {
    return this.http.get<Game>(`${environment.apiUrl}/games/${id}`);
  }

  getAssignmentById(id: string): Observable<Assignment> {
    if (!this._assignments$.value.length) {
      return this.http.get<Assignment>(`${environment.apiUrl}/assignments/${id}`);
    } else {
      return this.assignments$.pipe(
        map(assignments => assignments.filter(assignment => assignment._id === id)[0])
      );
    }
  }

  removeAssigment(id: string) {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/assignments/${id}`).pipe(
      switchMap(() => this.assignments$),
      take(1),
      map(assignments => assignments.filter(assignment => assignment._id !== id)),
      tap(assignments => {
        this._assignments$.next(assignments);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  updateAssignment(id: string, updatedAssignment: Assignment) {
    return this.http.put(`${environment.apiUrl}/assignments/${id}`, updatedAssignment).pipe(
      mapTo(true),
      tap(() => { this.setLoadingStatus(false); }),
      catchError(() => of(false).pipe())
    );
  }
}
