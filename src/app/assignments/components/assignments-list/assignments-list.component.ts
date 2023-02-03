import { Component, OnInit } from '@angular/core';
import {combineLatest, map, Observable, startWith, tap} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Assignment} from "../../models/assignment.model";
import {AssignmentService} from "../../services/assignment.service";
import {AssignmentSearchType} from "../../enums/assignment-search-type.enum";

@Component({
  selector: 'app-assignments-list',
  templateUrl: './assignments-list.component.html',
  styleUrls: ['./assignments-list.component.scss']
})
export class AssignmentsListComponent implements OnInit {
  loading$!: Observable<boolean>;
  assignments$!: Observable<Assignment[]>
  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: AssignmentSearchType,
    label: string
  }[];

  constructor(private assignmentsService: AssignmentService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
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
          return assignment[searchType].prenom.toLowerCase().includes(search as string) || assignment[searchType].nom.toLowerCase().includes(search as string)
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
    this.router.navigateByUrl("/assignment/add")
  }

}
