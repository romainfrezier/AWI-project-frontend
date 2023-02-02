import { Component, OnInit } from '@angular/core';
import {Observable, switchMap, take, tap} from "rxjs";
import {Game} from "../../models/game.model";
import {GamesService} from "../../services/game.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.scss']
})
export class SingleGameComponent implements OnInit {

  game$!: Observable<Game>;

  constructor(private applicationsService: GamesService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.initObservables();
  }

  private initObservables() {
    this.game$ = this.route.params.pipe(
      switchMap(params => this.applicationsService.getGameById(params['id']))
    );
  }

  onRemove() {
    if (confirm("Voulez vous vraiment supprimer ce jeu ?")){
      this.game$.pipe(
        take(1),
        tap(game => {
          this.applicationsService.removeGame(game._id);
          this.onGoBack();
        })
      ).subscribe();
    }
  }

  onUpdate() {
    this.game$.pipe(
      take(1),
      tap(application => {
        this.router.navigateByUrl(`games/update/${application._id}`)
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl('/games');
  }

}
