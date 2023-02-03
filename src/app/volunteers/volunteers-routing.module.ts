import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VolunteersListComponent} from "./components/volunteers-list/volunteers-list.component";
import {VolunteerFormComponent} from "./components/volunteer-form/volunteer-form.component";
import {SingleVolunteerComponent} from "./components/single-volunteer/single-volunteer.component";

const routes: Routes = [
  { path: '', component: VolunteersListComponent },
  { path: 'add', component: VolunteerFormComponent},
  { path: 'update/:id', component: VolunteerFormComponent},
  { path: ':id', component: SingleVolunteerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolunteersRoutingModule { }
