import { NgModule } from '@angular/core';
import { VolunteersListComponent } from './components/volunteers-list/volunteers-list.component';
import {VolunteersRoutingModule} from "./volunteers-routing.module";
import {SharedModule} from "../shared/shared.module";
import {CommonModule} from "@angular/common";
import {VolunteersService} from "./services/volunteer.service";



@NgModule({
  declarations: [
    VolunteersListComponent
  ],
  imports: [
    VolunteersRoutingModule,
    SharedModule,
    CommonModule
  ],
  providers: [
    VolunteersService
  ]
})
export class VolunteersModule { }
