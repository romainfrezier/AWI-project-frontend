import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/components/home/home.component";
import {ErrorComponent} from "./core/components/error/error.component";

const routes: Routes = [
  { path: 'volunteers', loadChildren: () => import('./volunteers/volunteers.module').then(m => m.VolunteersModule) },
  { path: 'games', loadChildren: () => import('./games/games.module').then(m => m.GamesModule) },
  { path: 'assignments', loadChildren: () => import('./assignments/assignments.module').then(m => m.AssignmentsModule) },
  { path: '', component: HomeComponent },
  { path: 'error404', component: ErrorComponent},
  { path: '**', redirectTo: 'error404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
