import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentsListComponent } from './components/assignments-list/assignments-list.component';
import {SharedModule} from "../shared/shared.module";
import {AssignmentRoutingModule} from "./assignment-routing.module";
import {AssignmentService} from "./services/assignment.service";
import { SingleAssignmentComponent } from './components/single-assignment/single-assignment.component';
import { AssignmentFormComponent } from './components/assignment-form/assignment-form.component';
import {AssignmentFormService} from "./services/assignment-form.service";



@NgModule({
  declarations: [
    AssignmentsListComponent,
    SingleAssignmentComponent,
    AssignmentFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssignmentRoutingModule
  ],
  providers: [
    AssignmentService,
    AssignmentFormService
  ]
})
export class AssignmentsModule { }
