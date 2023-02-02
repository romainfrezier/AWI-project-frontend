import { Component, OnInit } from '@angular/core';
import {Volunteer} from "../../models/volunteer.model";
import {combineLatest, map, Observable, startWith} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {VolunteerSearchType} from "../../enums/volunteers-search-type.enum";
import { Router } from '@angular/router';
import {VolunteersService} from "../../services/volunteer.service";

@Component({
  selector: 'app-volunteers-list',
  templateUrl: './volunteers-list.component.html',
  styleUrls: ['./volunteers-list.component.scss']
})
export class VolunteersListComponent implements OnInit {
  volunteer!:Volunteer;
  loading$!: Observable<boolean>;
  volunteers$!: Observable<Volunteer[]>
  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: VolunteerSearchType,
    label: string
  }[];

  constructor(private volunteersService: VolunteersService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.volunteersService.getVolunteersFromServer();
    this.initObservables();
    this.searchTypeOptions = [
      { value: VolunteerSearchType.FIRST_NAME, label: 'Prénom' },
      { value: VolunteerSearchType.LAST_NAME, label: 'Nom' },
      { value: VolunteerSearchType.EMAIL, label: 'Email' },
    ]
    this.volunteersService.volunteers$.subscribe();

  }

  private initObservables() {
    this.loading$ = this.volunteersService.loading$;
    this.volunteers$ = this.volunteersService.volunteers$;
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<VolunteerSearchType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    );
    this.volunteers$ = combineLatest([
        search$,
        searchType$,
        this.volunteersService.volunteers$
      ]
    ).pipe(
      map(([search, searchType, volunteers]) => volunteers.filter(volunteer => volunteer[searchType]
        .toLowerCase()
        .includes(search as string))
      )
    );
  }
  private initForm() {
    this.searchCtrl = this.formBuilder.control((''));
    this.searchTypeCtrl = this.formBuilder.control(VolunteerSearchType.LAST_NAME);
  }

  onNewVolunteer() {
    this.router.navigateByUrl("/volunteers/add")
  }



}
