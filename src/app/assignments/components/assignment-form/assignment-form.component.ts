import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, switchMap, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AssignmentFormService} from "../../services/assignment-form.service";
import {AssignmentService} from "../../services/assignment.service";
import {getHours, Hours} from "../../enums/hours.enum";
import {Assignment} from "../../models/assignment.model";
import {Volunteer} from "../../../volunteers/models/volunteer.model";
import {Area} from "../../models/area.model";
import {Game} from "../../../games/models/game.model";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {hoursValidator} from "../../validators/hours.validator";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD/MM/YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'DD/MM/YYYY',
  },
};

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AssignmentFormComponent implements OnInit {

  loading$! : Observable<boolean>;

  mainForm!: FormGroup;
  hoursForm!: FormGroup;
  startHourCtrl!: FormControl;
  endHourCtrl!: FormControl;
  gameCtrl!: FormControl;
  volunteerCtrl!: FormControl;
  areaCtrl!: FormControl;

  hoursOptions!: Hours[];
  selectedHours!: Hours;

  volunteersOptions$!: Observable<Volunteer[]>;
  selectedVolunteer!: Volunteer;

  areasOptions$!: Observable<Area[]>;
  selectedArea!: Area;

  gamesOptions$!: Observable<Game[]>;
  selectedGame!: Game;

  assignment$!: Observable<Assignment>;
  currentAssignmentId!: string;

  constructor(private formBuilder: FormBuilder,
              private formService: AssignmentFormService,
              private assignmentService: AssignmentService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initMainForm();
    this.initOptions();
    Notify.init({
      position: 'right-bottom',
    });
  }

  private initMainForm(): void {
    if (this.router.url === "/assignments/add") {
      this.initAddForm();
    } else {
      this.initUpdateForm();
    }
  }

  onSubmitForm() {
    if (this.router.url === "/assignments/add") {
      this.saveAssignment();
    } else {
      this.updateAssignment();
    }
    this.router.navigateByUrl('/assignments')
  }

  private resetForm(){
    this.mainForm.reset();
    this.hoursForm.reset();
  }

  private initOptions() {
    this.loading$ = this.formService.loading$;
    this.hoursOptions = getHours();
    this.formService.getVolunteersFromServer();
    this.formService.getAreasFromServer();
    this.formService.getGamesFromServer();
    this.volunteersOptions$ = this.formService.volunteers$;
    this.areasOptions$ = this.formService.areas$;
    this.gamesOptions$ = this.formService.games$;
  }

  private initAddForm() {
    this.gameCtrl = this.formBuilder.control(this.selectedGame, Validators.required);
    this.volunteerCtrl = this.formBuilder.control(this.selectedVolunteer, Validators.required);
    this.areaCtrl = this.formBuilder.control(this.selectedArea, Validators.required);
    this.mainForm = this.formBuilder.group({
      zone: this.areaCtrl,
      date: ['', Validators.required],
      jeu: this.gameCtrl,
      benevole: this.volunteerCtrl,
    });
    this.startHourCtrl = this.formBuilder.control('', Validators.required);
    this.endHourCtrl = this.formBuilder.control('', Validators.required);
    this.hoursForm = this.formBuilder.group({
      heure_deb: this.startHourCtrl,
      heure_fin: this.endHourCtrl,
    }, {
      validators: [hoursValidator('heure_deb', 'heure_fin')],
      updateOn: 'blur'
    });
  }

  private initUpdateForm() {
    this.assignment$ = this.route.params.pipe(
      tap(params => {
          this.currentAssignmentId = params['id'];
        }
      ),
      switchMap(params => this.assignmentService.getAssignmentById(params['id']))
    );
    this.assignment$.subscribe((assignment: Assignment) => {
      this.selectedArea = this.formService.getArea(assignment.zone._id);
      this.selectedGame = this.formService.getGame(assignment.jeu._id);
      this.selectedVolunteer = this.formService.getVolunteer(assignment.benevole._id);
      this.initAddForm();
      this.mainForm.patchValue({
        date: assignment.date_deb,
      });
      let date_deb = new Date(assignment.date_deb);
      let date_fin = new Date(assignment.date_fin);
      let h_deb : string;
      let h_fin : string;
      if (date_deb.getMinutes() != 0) {
        h_deb = date_deb.getHours().toString() + "h" + date_deb.getMinutes().toString();
      } else {
        h_deb = date_deb.getHours().toString() + "h";
      }
      if (date_fin.getMinutes() != 0) {
        h_fin = date_fin.getHours().toString() + "h" + date_fin.getMinutes().toString();
      } else {
        h_fin = date_fin.getHours().toString() + "h";
      }
      this.hoursForm.patchValue({
        heure_deb: h_deb,
        heure_fin: h_fin,
      });
      console.log(this.mainForm.value);
      console.log(this.hoursForm.value);
    });
  }

  getFormCtrlErrorText(ctrl: AbstractControl) : string {
    if (ctrl.hasError('required')){
      return "Ce champs est requis";
    } else if (ctrl.hasError('hoursValidator')) {
      return ctrl.getError('hoursValidator');
    } else {
      return "Il y a une erreur";
    }
  }

  private saveAssignment() {
    let buildDate_deb : Date = this.buildDate(this.mainForm.value.date, this.hoursForm.value.heure_deb);
    let buildDate_fin : Date = this.buildDate(this.mainForm.value.date, this.hoursForm.value.heure_fin);
    let newAssignment : Assignment = {
      ...this.mainForm.value,
      date_deb: buildDate_deb,
      date_fin: buildDate_fin
    }
    console.log(newAssignment);
    this.formService.saveAssignment(newAssignment).pipe(
      tap(saved => {
        if (saved) {
          this.resetForm();
          Notify.success("L'affectation a bien été enregistrée")
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  private updateAssignment() {
    let buildDate_deb : Date = this.buildDate(this.mainForm.value.date, this.hoursForm.value.heure_deb);
    let buildDate_fin : Date = this.buildDate(this.mainForm.value.date, this.hoursForm.value.heure_fin);
    let updatedAssignment : Assignment = {
      ...this.mainForm.value,
      date_deb: buildDate_deb,
      date_fin: buildDate_fin
    }
    this.assignmentService.updateAssignment(this.currentAssignmentId, updatedAssignment).pipe(
      tap(saved => {
        if (saved) {
          this.resetForm();
          Notify.success("L'affectation a bien été modifiée")
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  updateArea(area: Area) {
      this.selectedArea = area;
  }

  updateGame(game: Game) {
      this.selectedGame = game;
  }

  updateVolunteer(volunteer : Volunteer) {
      this.selectedVolunteer = volunteer;
  }

  private buildDate(date_deb : Date, heure_deb: string) : Date {
    let date_deb_split = new Date(date_deb).toLocaleDateString().split("/");
    let heure_deb_split = heure_deb.split("h");
    return new Date(parseInt(date_deb_split[2]), parseInt(date_deb_split[1]) - 1, parseInt(date_deb_split[0]), parseInt(heure_deb_split[0]), parseInt(heure_deb_split[1]) ? parseInt(heure_deb_split[1]) : 0);
  }

  onGoBack() {
    if (this.router.url === "/assignments/add") {
      this.router.navigateByUrl('/assignments')
    } else {
      this.router.navigateByUrl(`/assignments/${this.currentAssignmentId}`)
      Notify.info("Les modifications n'ont pas été enregistrées")
    }
  }

}
