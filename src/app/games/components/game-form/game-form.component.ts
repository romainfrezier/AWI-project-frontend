import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GameTypeEnum} from "../../enums/gameType.enum";
import {Observable, switchMap, tap} from "rxjs";
import {Game} from "../../models/game.model";
import {GameFormService} from "../../services/game-form.service";
import {GamesService} from "../../services/game.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {

  loading = false;

  mainForm!: FormGroup;
  gameTypeOptions!: GameTypeEnum[];

  game$!: Observable<Game>;
  currentGameId!: string;

  constructor(private formBuilder: FormBuilder,
              private formService: GameFormService,
              private gamesService: GamesService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initMainForm();
    this.initOptions();
  }

  private initMainForm(): void {
    if (this.router.url === "/games/add") {
      this.initAddForm();
    } else {
      this.initUpdateForm();
    }
  }

  onSubmitForm() {
    this.loading = true;
    if (this.router.url === "/games/add") {
      this.saveGame();
    } else {
      this.updateGame();
    }
    this.router.navigateByUrl('/games')
  }

  private resetForm(){
    this.mainForm.reset();
  }

  private initOptions() {
    this.gameTypeOptions = [
      GameTypeEnum.CHILD,
      GameTypeEnum.FAMILY,
      GameTypeEnum.MOOD,
      GameTypeEnum.INSIDER,
      GameTypeEnum.EXPERT
    ];
  }

  private initAddForm() {
    this.mainForm = this.formBuilder.group({
      nom: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  private initUpdateForm() {
    this.game$ = this.route.params.pipe(
      tap(params => {
          this.currentGameId = params['id'];
        }
      ),
      switchMap(params => this.gamesService.getGameById(params['id']))
    );
    this.game$.pipe(
      tap((game) => {
        this.mainForm = this.formBuilder.group({
          nom: [game.nom, Validators.required],
          type: [game.type, Validators.required],
        });
      })
    ).subscribe();
  }

  private saveGame() {
    let newGame : Game = {
      ...this.mainForm.value,
    }
    this.formService.saveGame(newGame).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  private updateGame() {
    let updatedGame : Game = {
      ...this.mainForm.value,
    }
    this.gamesService.updateGame(this.currentGameId, updatedGame).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl(`/games/${this.currentGameId}`)
  }

}
