import { Component, OnInit } from '@angular/core';
import {combineLatest, map, Observable, startWith} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Assignment} from "../../models/assignment.model";
import {AssignmentService} from "../../services/assignment.service";
import {AssignmentSearchType} from "../../enums/assignment-search-type.enum";
import {Area} from "../../models/area.model";
import {TimeSlot} from "../../../volunteers/models/time-slot";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {Confirm} from "notiflix";

@Component({
  selector: 'app-assignments-list',
  templateUrl: './assignments-list.component.html',
  styleUrls: ['./assignments-list.component.scss']
})
export class AssignmentsListComponent implements OnInit {
  loading$!: Observable<boolean>;

  assignments$!: Observable<Assignment[]>
  areas$!: Observable<Area[]>;
  hours$!: Observable<TimeSlot[]>;

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: AssignmentSearchType,
    label: string
  }[];

  filter!: {
    noFilter: boolean,
    areas: boolean,
    hours: boolean,
  }

  constructor(private assignmentsService: AssignmentService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.filter = {
      noFilter: true,
      areas: false,
      hours: false,
    }
    this.initForm();
    this.assignmentsService.getAssignmentsFromServer();
    this.initObservables();
    this.searchTypeOptions = [
      { value: AssignmentSearchType.AREA, label: 'Zone' },
      { value: AssignmentSearchType.VOLUNTEER, label: 'Bénévole' },
      { value: AssignmentSearchType.GAME, label: 'Jeu' },
    ]
    this.assignmentsService.assignments$.subscribe();
  }

  private initObservables() {
    this.loading$ = this.assignmentsService.loading$;
    this.assignments$ = this.assignmentsService.assignments$;
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<AssignmentSearchType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    );
    this.assignments$ = combineLatest([
        search$,
        searchType$,
        this.assignmentsService.assignments$
      ]
    ).pipe(
      map(([search, searchType, assignments]) => assignments.filter(assignment => {
        if (searchType === AssignmentSearchType.VOLUNTEER) {
          return assignment[searchType].prenom.toLowerCase().includes(search as string) || assignment[searchType].nom.toLowerCase().includes(search as string) || (assignment[searchType].prenom.toLowerCase() + " " + assignment[searchType].nom.toLowerCase()).includes(search as string)
        } else {
          return assignment[searchType].nom
            .toLowerCase()
            .includes(search as string)
        }
      })),
    );
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control((''));
    this.searchTypeCtrl = this.formBuilder.control(AssignmentSearchType.AREA);
  }

  onNewAssignment() {
    this.router.navigateByUrl("/assignments/add")
  }

  onNoFilter() {
    this.filter.noFilter = true;
    this.filter.areas = false;
    this.filter.hours = false;
    this.searchCtrl.enable();
    this.searchTypeCtrl.enable();
  }

  goToArea(name: string) {
    this.router.navigateByUrl("/assignments/area/" + name)
  }

  goToHour(date_deb: string, date_fin: string) {
    let urlDateDeb : string = encodeURIComponent(date_deb);
    let urlDateFin : string = encodeURIComponent(date_fin);
    this.router.navigateByUrl("/assignments/hour/" + urlDateDeb + "/" + urlDateFin)
  }

  onHoursFilter() {
    this.filter.noFilter = false;
    this.filter.areas = false;
    this.filter.hours = true;
    this.searchCtrl.disable();
    this.searchTypeCtrl.disable();
    this.assignmentsService.getHoursFromServer();
    this.hours$ = this.assignmentsService.hours$;
  }

  onAreasFilter() {
    this.filter.noFilter = false;
    this.filter.areas = true;
    this.filter.hours = false;
    this.searchCtrl.disable();
    this.searchTypeCtrl.disable();
    this.assignmentsService.getAreasFromServer();
    this.areas$ = this.assignmentsService.areas$;
  }

  onDeleteAssignment(id: string) {
    Confirm.show(
      "Suppression d'une affectation",
      'Voulez vous vraiment supprimer cette affectation ?',
      'Oui',
      'Non',
      () => {
        this.assignments$.subscribe(
          (assignments : Assignment[]) => {
            const assignment = assignments.find(assignment => assignment._id === id);
            if (assignment) {
              this.assignmentsService.removeAssigment(assignment._id);
              Notify.success('Affectation supprimée avec succès !')
            }
          }
        );
      },
      () => {
        Notify.info('Suppression annulée !')
      },
    );
  }

  onEditAssignment(id: string) {
    this.router.navigateByUrl("/assignments/update/" + id)
  }
}
