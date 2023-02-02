import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, map, mapTo, Observable, of, switchMap, take, tap} from "rxjs";
import {Game} from "../models/game.model";
import {environment} from "../../../environments/environment.prod";

@Injectable()
export class GamesService {
  constructor(private http: HttpClient) {}

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _games$ = new BehaviorSubject<Game[]>([]);
  get games$(): Observable<Game[]> {
    return this._games$.asObservable();
  }

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getGamesFromServer() {
    this.setLoadingStatus(true);

    const compareFn = (a:Game, b:Game) => {
      if (a.nom < b.nom)
        return -1;
      if (a.nom > b.nom)
        return 1;
      return 0;
    };

    this.http.get<Game[]>(`${environment.apiUrl}/games`).pipe(
      map(games => games.sort(compareFn)),
      tap(games => {
        this._games$.next(games);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getGameById(id: string): Observable<Game> {
    return this.games$.pipe(
      map(games => games.filter(game => game._id === id)[0])
    );
  }

  removeGame(id: string) {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/games/${id}`).pipe(
      switchMap(() => this.games$),
      take(1),
      map(games => games.filter(game => game._id !== id)),
      tap(games => {
        this._games$.next(games);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  updateGame(id: string, updatedGame: Game) {
    return this.http.patch(`${environment.apiUrl}/games/${id}`, updatedGame).pipe(
      mapTo(true),
      catchError(() => of(false).pipe())
    );
  }
}
