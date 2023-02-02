import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './components/games-list/games-list.component';
import { GameFormComponent } from './components/game-form/game-form.component';
import {GamesService} from "./services/game.service";
import {GameFormService} from "./services/game-form.service";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLinkWithHref} from "@angular/router";
import {GamesRoutingModule} from "./games-routing.module";
import { SingleGameComponent } from './components/single-game/single-game.component';



@NgModule({
  declarations: [
    GamesListComponent,
    GameFormComponent,
    SingleGameComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GamesRoutingModule,
  ],
  providers: [
    GamesService,
    GameFormService
  ]
})
export class GamesModule { }
