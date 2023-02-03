import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AssignmentsListComponent} from "./components/assignments-list/assignments-list.component";
import {SingleAssignmentComponent} from "./components/single-assignment/single-assignment.component";

const routes: Routes = [
  { path: '', component: AssignmentsListComponent },
  { path: 'add', component: AssignmentsListComponent},
  { path: 'update/:id', component: AssignmentsListComponent},
  { path: ':id', component: SingleAssignmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentRoutingModule { }
