import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, delay, map, mapTo, Observable, of, tap} from "rxjs";
import {environment} from "../../../environments/environment.prod";
import {Assignment} from "../models/assignment.model";
import {Volunteer} from "../../volunteers/models/volunteer.model";
import {Area} from "../models/area.model";
import {Game} from "../../games/models/game.model";

@Injectable()
export class AssignmentFormService {

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    private _volunteers$ = new BehaviorSubject<Volunteer[]>([]);
    get volunteers$(): Observable<Volunteer[]> {
        return this._volunteers$.asObservable();
    }

    private _areas$ = new BehaviorSubject<Area[]>([]);
    get areas$(): Observable<Area[]> {
      return this._areas$.asObservable();
    }

    private _games$ = new BehaviorSubject<Game[]>([]);
    get games$(): Observable<Game[]> {
      return this._games$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    constructor(private http: HttpClient) { }

    saveAssignment(formValue: Assignment): Observable<boolean> {
        this.setLoadingStatus(true);
        return this.http.post(`${environment.apiUrl}/assignments`, formValue).pipe(
            mapTo(true),
            tap(() => this.setLoadingStatus(false)),
            catchError(() => of(false).pipe())
        );
    }

    getAreasFromServer() {
        this.setLoadingStatus(true);
        this.http.get<Area[]>(`${environment.apiUrl}/areas`).pipe(
            tap(areas => {
                this._areas$.next(areas);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getVolunteersFromServer() {
        this.setLoadingStatus(true);
        this.http.get<Volunteer[]>(`${environment.apiUrl}/volunteers`).pipe(
            tap(volunteers => {
                this._volunteers$.next(volunteers);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getGamesFromServer() {
        this.setLoadingStatus(true);
        this.http.get<Game[]>(`${environment.apiUrl}/games`).pipe(
          tap(games => {
            this._games$.next(games);
            this.setLoadingStatus(false);
          })
        ).subscribe();
    }
}
