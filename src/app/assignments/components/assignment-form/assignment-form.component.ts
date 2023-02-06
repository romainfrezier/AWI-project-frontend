import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

  hoursOptions!: Hours[];
  selectedHours!: Hours;

  volunteersOptions!: Volunteer[];
  selectedVolunteer!: Volunteer;

  areasOptions!: Area[];
  selectedArea!: Area;

  gamesOptions!: Game[];
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
  }

  private initMainForm(): void {
    if (this.router.url === "/games/add") {
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
  }

  private initOptions() {
    this.loading$ = this.formService.loading$;
    this.hoursOptions = getHours();
    this.formService.getVolunteersFromServer();
    this.formService.getAreasFromServer();
    this.formService.getGamesFromServer();
    let volunteersOptions$ = this.formService.volunteers$;
    let areasOptions$ = this.formService.areas$;
    let gamesOptions$ = this.formService.games$;
    volunteersOptions$.pipe(
      tap((volunteers) => {
        this.volunteersOptions = volunteers;
        this.volunteersOptions.sort((a, b) => a.nom.localeCompare(b.nom));
      })
    ).subscribe();
    areasOptions$.pipe(
      tap((areas) => {
        this.areasOptions = areas;
        this.areasOptions.sort((a, b) => a.nom.localeCompare(b.nom));
      })
    ).subscribe();
    gamesOptions$.pipe(
      tap((games) => {
        this.gamesOptions = games;
        this.gamesOptions.sort((a, b) => a.nom.localeCompare(b.nom));
      })
    ).subscribe();
  }

  private initAddForm() {
    this.mainForm = this.formBuilder.group({
      zone: [this.selectedArea, Validators.required],
      date_deb: ['', Validators.required],
      heure_deb: ['', Validators.required],
      heure_fin: ['', Validators.required],
      jeu: [this.selectedGame, Validators.required],
      benevole: [this.selectedVolunteer, Validators.required],
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
    this.assignment$.pipe(
      tap((game) => {
        this.mainForm = this.formBuilder.group({
          zone: [this.selectedArea, Validators.required],
          date_deb: ['', Validators.required],
          heure_deb: ['', Validators.required],
          heure_fin: ['', Validators.required],
          jeu: [this.selectedGame, Validators.required],
          benevole: [this.selectedVolunteer, Validators.required],
        });
      })
    ).subscribe();
  }

  private saveAssignment() {
    let buildDate_deb : Date = this.buildDate(this.mainForm.value.date_deb, this.mainForm.value.heure_deb);
    let buildDate_fin : Date = this.buildDate(this.mainForm.value.date_deb, this.mainForm.value.heure_fin);
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
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  private updateAssignment() {
    let buildDate_deb : Date = this.buildDate(this.mainForm.value.date_deb, this.mainForm.value.heure_deb);
    let buildDate_fin : Date = this.buildDate(this.mainForm.value.date_fin, this.mainForm.value.heure_fin);
    let updatedAssignment : Assignment = {
      ...this.mainForm.value,
      date_deb: buildDate_deb,
      date_fin: buildDate_fin
    }
    this.assignmentService.updateAssignment(this.currentAssignmentId, updatedAssignment).pipe(
      tap(saved => {
        if (saved) {
          this.resetForm();
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  updateArea(area: Area) {
    this.selectedArea = area;
  }

  updateGame(game : Game) {
    this.selectedGame = game;
  }

  updateVolunteer(volunteer : Volunteer) {
    this.selectedVolunteer = volunteer;
  }

  private buildDate(date_deb : Date, heure_deb: string) : Date {
    let date_deb_split = new Date(date_deb).toLocaleDateString().split("/");
    let heure_deb_split = heure_deb.split("h");
    return new Date(parseInt(date_deb_split[2]), parseInt(date_deb_split[1]), parseInt(date_deb_split[0]), parseInt(heure_deb_split[0]), parseInt(heure_deb_split[1]) ? parseInt(heure_deb_split[1]) : 0);
  }

  onGoBack() {
    if (this.router.url === "/assignments/add") {
      this.router.navigateByUrl('/assignments')
    } else {
      this.router.navigateByUrl(`/assignments/${this.currentAssignmentId}`)
    }
  }

}
