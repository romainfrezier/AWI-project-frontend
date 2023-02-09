import { Component, OnInit } from '@angular/core';
import {Volunteer} from "../../models/volunteer.model";
import {combineLatest, map, Observable, startWith} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {VolunteerSearchType} from "../../enums/volunteers-search-type.enum";
import {ActivatedRoute, Router} from '@angular/router';
import {VolunteersService} from "../../services/volunteer.service";
import {VolunteerFiltered} from "../../models/volunteer-filtered.enum";

@Component({
  selector: 'app-volunteers-list',
  templateUrl: './volunteers-list.component.html',
  styleUrls: ['./volunteers-list.component.scss']
})
export class VolunteersListComponent implements OnInit {

  loading$!: Observable<boolean>;
  volunteers$!: Observable<Volunteer[]>
  volunteersFiltered$!: Observable<VolunteerFiltered[]>;
  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: VolunteerSearchType,
    label: string
  }[];

  whichInit!: {
    noFilter: boolean,
    dates: boolean,
    areas: boolean
  }

  constructor(private volunteersService: VolunteersService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.whichInitToMake(this.router.url);
    this.initForm();
    this.getVolunteers();
    this.initObservables();
    this.initSearchTypeOptions();
    this.volunteersService.volunteers$.subscribe();
    this.volunteersService.volunteersFiltered$.subscribe();
  }

  private whichInitToMake(url: string) {
    if (url === "/volunteers") {
      this.whichInit = {
        noFilter: true,
        dates: false,
        areas: false
      }
    } else if (url.includes("hour")) {
      this.whichInit = {
        noFilter: false,
        dates: true,
        areas: false
      }
    } else if (url.includes("area")) {
      this.whichInit = {
        noFilter: false,
        dates: false,
        areas: true
      }
    }
  }

  private initObservables() {
    this.loading$ = this.volunteersService.loading$;
    this.volunteers$ = this.volunteersService.volunteers$;
    this.volunteersFiltered$ = this.volunteersService.volunteersFiltered$;
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


  onGoBack() {
    this.router.navigateByUrl("/assignments")
  }

  private getVolunteers() {
    if (this.whichInit.noFilter) {
      this.volunteersService.getVolunteersFromServer();
    } else if (this.whichInit.dates) {
      this.volunteersService.getVolunteersFromServerByDate(encodeURIComponent(this.route.snapshot.params['date']));
    } else if (this.whichInit.areas) {

      this.volunteersService.getVolunteersFromServerByArea(this.route.snapshot.params['id']);
    }
  }

  private initSearchTypeOptions() {
    if (this.router.url.includes("volunteers")){
      this.searchTypeOptions = [
        { value: VolunteerSearchType.FIRST_NAME, label: 'Prénom' },
        { value: VolunteerSearchType.LAST_NAME, label: 'Nom' },
        { value: VolunteerSearchType.EMAIL, label: 'Email' },
      ]
    } else {
      this.searchTypeOptions = [
        { value: VolunteerSearchType.FIRST_NAME, label: 'Prénom' },
        { value: VolunteerSearchType.LAST_NAME, label: 'Nom' },
      ]
    }
  }

  volunteerDetails(id: string) {
    this.router.navigateByUrl(this.router.url + "/" + id)
  }
}
