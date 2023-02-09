import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, startWith, tap} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Game} from "../../models/game.model";
import {GamesService} from "../../services/game.service";
import {GameSearchType} from "../../enums/game-search-type.enum";
import {VolunteerSearchType} from "../../../volunteers/enums/volunteers-search-type.enum";

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
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: GameSearchType,
    label: string
  }[];

  constructor(private gamesService: GamesService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.gamesService.getGamesFromServer();
    this.initObservables();
    this.gamesService.games$.subscribe();
    this.searchTypeOptions = [
      { value: GameSearchType.NAME, label: 'Nom' },
      { value: GameSearchType.TYPE, label: 'Type' }
    ]
  }

  private initObservables() {
    this.loading$ = this.gamesService.loading$;
    this.games$ = this.gamesService.games$;
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<GameSearchType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    );
    this.games$ = combineLatest([
        search$,
        searchType$,
        this.gamesService.games$
      ]
    ).pipe(
      map(([search, searchType, games]) => games.filter(game => game[searchType]
        .toLowerCase()
        .includes(search as string))
      )
    );
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control((''));
    this.searchTypeCtrl = this.formBuilder.control((GameSearchType.NAME));
  }

  onNewGame() {
    this.router.navigateByUrl("/games/add")
  }

}
