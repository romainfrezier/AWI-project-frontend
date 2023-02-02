import { NgModule } from '@angular/core';
import { GamesListComponent } from './components/games-list/games-list.component';
import { GameFormComponent } from './components/game-form/game-form.component';
import {GamesService} from "./services/game.service";
import {GameFormService} from "./services/game-form.service";
import {SharedModule} from "../shared/shared.module";
import {GamesRoutingModule} from "./games-routing.module";
import { SingleGameComponent } from './components/single-game/single-game.component';
import {CommonModule} from "@angular/common";



@NgModule({
  declarations: [
    GamesListComponent,
    GameFormComponent,
    SingleGameComponent
  ],
  imports: [
    SharedModule,
    GamesRoutingModule,
    CommonModule
  ],
  providers: [
    GamesService,
    GameFormService
  ]
})
export class GamesModule { }
