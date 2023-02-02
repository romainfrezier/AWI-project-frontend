import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, startWith, tap} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Game} from "../../models/game.model";
import {GamesService} from "../../services/game.service";

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamesListComponent implements OnInit {

  loading$!: Observable<boolean>;
  games$!: Observable<Game[]>

  searchCtrl!: FormControl;

  constructor(private gamesService: GamesService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.gamesService.getGamesFromServer();
    this.initObservables();
    this.gamesService.games$.subscribe();
  }

  private initObservables() {
    this.loading$ = this.gamesService.loading$;
    this.games$ = this.gamesService.games$;
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    this.games$ = combineLatest([
        search$,
        this.gamesService.games$
      ]
    ).pipe(
      map(([search, games]) => games.filter(game => game.nom
        .toLowerCase()
        .includes(search as string))
      )
    );
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control((''));
  }

  onNewGame() {
    this.router.navigateByUrl("/games/add")
  }

}
