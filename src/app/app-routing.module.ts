import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'volunteers', loadChildren: () => import('./volunteers/volunteers.module').then(m => m.VolunteersModule) },
  { path: 'games', loadChildren: () => import('./games/games.module').then(m => m.GamesModule) },
  { path: 'assignments', loadChildren: () => import('./assignments/assignments.module').then(m => m.AssignmentsModule) },
  { path: '**', redirectTo: 'applications'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
