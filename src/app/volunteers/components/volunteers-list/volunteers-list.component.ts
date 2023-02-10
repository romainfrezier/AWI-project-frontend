import { Component, OnInit } from '@angular/core';
import {Volunteer} from "../../models/volunteer.model";
import {combineLatest, map, Observable, startWith} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {VolunteerSearchType} from "../../enums/volunteers-search-type.enum";
import {ActivatedRoute, Router} from '@angular/router';
import {VolunteersService} from "../../services/volunteer.service";
import {VolunteerFilteredByDate} from "../../models/volunteer-filtered-by-date";
import {VolunteerFilteredByArea} from "../../models/volunteer-filtered-by-area";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {Confirm} from "notiflix";

@Component({
  selector: 'app-volunteers-list',
  templateUrl: './volunteers-list.component.html',
  styleUrls: ['./volunteers-list.component.scss']
})
export class VolunteersListComponent implements OnInit {

  loading$!: Observable<boolean>;
  volunteers$!: Observable<Volunteer[]>
  volunteersFilteredByDate$!: Observable<VolunteerFilteredByDate[]>;
  volunteersFilteredByArea$!: Observable<VolunteerFilteredByArea[]>;
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
  chosenDateStart!: string;
  chosenDateEnd!: string;
  chosenArea!: string;

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
    this.volunteersService.volunteersFilteredByDate$.subscribe();
    Confirm.init({
      cancelButtonBackground: '#d33',
      okButtonBackground: 'rgb(65,83,175)',
      titleColor: 'rgb(65,83,175)',
    });
    Notify.init({
      position: 'right-bottom',
    });
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
      let url = this.router.url.split("/");
      this.chosenDateStart = url[url.length - 2];
      this.chosenDateEnd = url[url.length - 1];
    } else if (url.includes("area")) {
      this.whichInit = {
        noFilter: false,
        dates: false,
        areas: true
      }
      this.chosenArea = this.route.snapshot.params['id'];
    }
  }

  private initObservables() {
    this.loading$ = this.volunteersService.loading$;
    this.volunteers$ = this.volunteersService.volunteers$;
    this.volunteersFilteredByDate$ = this.volunteersService.volunteersFilteredByDate$;
    this.volunteersFilteredByArea$ = this.volunteersService.volunteersFilteredByArea$;
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
      this.volunteersService.getVolunteersFromServerByDate(encodeURIComponent(this.route.snapshot.params['date_deb']), encodeURIComponent(this.route.snapshot.params['date_fin']));
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
    console.log(this.router.url + "/" + id)
    this.router.navigateByUrl(this.router.url + "/" + id)
  }

  onEditVolunteer(id: string) {
    this.router.navigateByUrl(`volunteers/update/${id}`)
  }

  onDeleteVolunteer(id: string) {
    Confirm.show(
      "Suppression d'un bénévole",
      'Voulez vous vraiment supprimer ce bénévole ?',
      'Oui',
      'Non',
      () => {
          this.volunteers$.subscribe(
          (volunteers: Volunteer[]) => {
            let volunteer = volunteers.find(volunteer => volunteer._id === id);
            if (volunteer) {
              this.volunteersService.removeVolunteer(volunteer._id);
              Notify.success('Bénévole supprimé avec succès !')
            }
          });
      },
      () => {
        Notify.info('Suppression annulée !')
      },
    );
  }
}
