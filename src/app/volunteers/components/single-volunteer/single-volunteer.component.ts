import { Component, OnInit } from '@angular/core';
import {Observable, switchMap, take, tap} from "rxjs";
import {Volunteer} from "../../models/volunteer.model";
import {VolunteersService} from "../../services/volunteer.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-single-volunteer',
  templateUrl: './single-volunteer.component.html',
  styleUrls: ['./single-volunteer.component.scss']
})
export class SingleVolunteerComponent implements OnInit {

  loading$!: Observable<boolean>;
  volunteer$!: Observable<Volunteer>;

  constructor(private volunteersService: VolunteersService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.initObservables();
  }

  private initObservables() {
    this.loading$ = this.volunteersService.loading$;
    this.volunteer$ = this.route.params.pipe(
      switchMap(params => this.volunteersService.getVolunteerById(params['id']))
    );
  }

  onRemove() {
    if (confirm("Voulez vous vraiment supprimer ce bénévole ?")){
      this.volunteer$.pipe(
        take(1),
        tap(volunteer => {
          this.volunteersService.removeVolunteer(volunteer._id);
          this.onGoBack();
        })
      ).subscribe();
    }
  }

  onUpdate() {
    this.volunteer$.pipe(
      take(1),
      tap(volunteer => {
        this.router.navigateByUrl(`volunteers/update/${volunteer._id}`)
      })
    ).subscribe();
  }

  onGoBack() {
    console.log(this.router.url);
    if (this.router.url.includes('volunteers')){
      this.router.navigateByUrl('/volunteers');
    } else {
      let url = this.router.url.split('/');
      url.pop();
      this.router.navigateByUrl(url.join('/'));
    }
  }

}
