import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/components/home/home.component";
import {ErrorComponent} from "./core/components/error/error.component";
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'volunteers', loadChildren: () => import('./volunteers/volunteers.module').then(m => m.VolunteersModule), canActivate: [AuthGuard] },
  { path: 'games', loadChildren: () => import('./games/games.module').then(m => m.GamesModule), canActivate: [AuthGuard]  },
  { path: 'assignments', loadChildren: () => import('./assignments/assignments.module').then(m => m.AssignmentsModule), canActivate: [AuthGuard]  },
  { path: '', component: HomeComponent },
  { path: 'error404', component: ErrorComponent},
  { path: '**', redirectTo: 'error404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
