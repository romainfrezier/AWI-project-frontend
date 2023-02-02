import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GamesListComponent} from "./components/games-list/games-list.component";
import {GameFormComponent} from "./components/game-form/game-form.component";
import {SingleGameComponent} from "./components/single-game/single-game.component";

const routes: Routes = [
  { path: '', component: GamesListComponent },
  { path: 'add', component: GameFormComponent},
  { path: 'update/:id', component: GameFormComponent},
  { path: ':id', component: SingleGameComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
