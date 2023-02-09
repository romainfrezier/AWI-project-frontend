import { Component, OnInit } from '@angular/core';
import {Observable, switchMap, take, tap} from "rxjs";
import {Game} from "../../models/game.model";
import {GamesService} from "../../services/game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.scss']
})
export class SingleGameComponent implements OnInit {

  loading$!: Observable<boolean>;
  game$!: Observable<Game>;

  constructor(private gamesService: GamesService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.initObservables();
    Notify.init({
      position: 'right-bottom',
    });
  }

  private initObservables() {
    this.loading$ = this.gamesService.loading$;
    this.game$ = this.route.params.pipe(
      switchMap(params => this.gamesService.getGameById(params['id']))
    );
  }

  onRemove() {
    if (confirm("Voulez vous vraiment supprimer ce jeu ?")){
      this.game$.pipe(
        take(1),
        tap(game => {
          this.gamesService.removeGame(game._id);
          Notify.success('Jeu supprimé avec succès !')
          this.onGoBack();
        })
      ).subscribe();
    }
  }

  onUpdate() {
    this.game$.pipe(
      take(1),
      tap(game => {
        this.router.navigateByUrl(`games/update/${game._id}`)
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl('/games');
  }

}
