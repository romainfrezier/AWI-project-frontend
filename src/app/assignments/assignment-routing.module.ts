import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AssignmentsListComponent} from "./components/assignments-list/assignments-list.component";
import {SingleAssignmentComponent} from "./components/single-assignment/single-assignment.component";
import {AssignmentFormComponent} from "./components/assignment-form/assignment-form.component";
import {VolunteersListComponent} from "../volunteers/components/volunteers-list/volunteers-list.component";
import {SingleVolunteerComponent} from "../volunteers/components/single-volunteer/single-volunteer.component";

const routes: Routes = [
  { path: '', component: AssignmentsListComponent },
  { path: 'add', component: AssignmentFormComponent},
  { path: 'update/:id', component: AssignmentFormComponent},
  { path: 'area/:id', component: VolunteersListComponent},
  { path: 'hour/:date_deb/:date_fin', component: VolunteersListComponent},
  { path: 'area/:id/:id', component: SingleVolunteerComponent},
  { path: 'hour/:date_deb/:date_fin/:id', component: SingleVolunteerComponent},
  { path: ':id', component: SingleAssignmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentRoutingModule { }
