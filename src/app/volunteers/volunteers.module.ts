import { NgModule } from '@angular/core';
import { VolunteersListComponent } from './components/volunteers-list/volunteers-list.component';
import {VolunteersRoutingModule} from "./volunteers-routing.module";
import {SharedModule} from "../shared/shared.module";
import {CommonModule} from "@angular/common";
import {VolunteersService} from "./services/volunteer.service";
import { VolunteerFormComponent } from './components/volunteer-form/volunteer-form.component';
import {VolunteerFormService} from "./services/volunteer-form.service";
import { SingleVolunteerComponent } from './components/single-volunteer/single-volunteer.component';



@NgModule({
  declarations: [
    VolunteersListComponent,
    VolunteerFormComponent,
    SingleVolunteerComponent
  ],
  imports: [
    VolunteersRoutingModule,
    SharedModule,
    CommonModule
  ],
  providers: [
    VolunteersService,
    VolunteerFormService
  ]
})
export class VolunteersModule { }
