import { Component, OnInit } from '@angular/core';
import {Observable, switchMap, take, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Assignment} from "../../models/assignment.model";
import {AssignmentService} from "../../services/assignment.service";
import {Volunteer} from "../../../volunteers/models/volunteer.model";
import {Game} from "../../../games/models/game.model";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {Confirm} from "notiflix";

@Component({
  selector: 'app-single-assignment',
  templateUrl: './single-assignment.component.html',
  styleUrls: ['./single-assignment.component.scss']
})
export class SingleAssignmentComponent implements OnInit {

  loading$!: Observable<boolean>;
  assignment$!: Observable<Assignment>;
  volunteer$!: Observable<Volunteer>;
  game$!: Observable<Game>;

  constructor(private assignmentService: AssignmentService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.initObservables();
  }

  private initObservables() {
    this.loading$ = this.assignmentService.loading$;
    this.assignment$ = this.route.params.pipe(
      switchMap(params => this.assignmentService.getAssignmentById(params['id'])),
      tap(assignment => {
        this.volunteer$ = this.assignmentService.getAssignmentVolunteer(assignment.benevole._id);
        this.game$ = this.assignmentService.getAssignmentGame(assignment.jeu._id);
      })
    );
  }

  onRemove() {
    Confirm.show(
      "Suppression d'une affectation",
      'Voulez vous vraiment supprimer cette affectation ?',
      'Oui',
      'Non',
      () => {
        this.assignment$.pipe(
          take(1),
          tap(assignment => {
            this.assignmentService.removeAssigment(assignment._id);
            Notify.success('Affectation supprimé avec succès !')
            this.onGoBack();
          })
        ).subscribe();
      },
      () => {
        Notify.info('Suppression annulée !')
      },
    );
  }

  onUpdate() {
    this.assignment$.pipe(
      take(1),
      tap(assignment => {
        this.router.navigateByUrl(`assignments/update/${assignment._id}`)
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl('/assignments');
  }

}
