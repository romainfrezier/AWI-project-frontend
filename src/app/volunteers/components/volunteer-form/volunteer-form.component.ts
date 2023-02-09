import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, switchMap, tap} from "rxjs";
import {Volunteer} from "../../models/volunteer.model";
import {VolunteerFormService} from "../../services/volunteer-form.service";
import {VolunteersService} from "../../services/volunteer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Component({
  selector: 'app-volunteer-form',
  templateUrl: './volunteer-form.component.html',
  styleUrls: ['./volunteer-form.component.scss']
})
export class VolunteerFormComponent implements OnInit {

  loading = false;

  mainForm!: FormGroup;

  volunteer$!: Observable<Volunteer>;
  currentVolunteerId!: string;

  constructor(private formBuilder: FormBuilder,
              private formService: VolunteerFormService,
              private volunteersService: VolunteersService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initMainForm();
    Notify.init({
      position: 'right-bottom',
    });
  }

  private initMainForm(): void {
    if (this.router.url === "/volunteers/add") {
      this.initAddForm();
    } else {
      this.initUpdateForm();
    }
  }

  onSubmitForm() {
    this.loading = true;
    if (this.router.url === "/volunteers/add") {
      this.saveVolunteer();
    } else {
      this.updateVolunteer();
    }
    this.router.navigateByUrl('/volunteers')
  }

  private resetForm(){
    this.mainForm.reset();
  }


  private initAddForm() {
    this.mainForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['',Validators.required],
      email: ['', Validators.required]
    });
  }

  private initUpdateForm() {
    this.volunteer$ = this.route.params.pipe(
      tap(params => {
          this.currentVolunteerId = params['id'];
        }
      ),
      switchMap(params => this.volunteersService.getVolunteerById(params['id']))
    );
    this.volunteer$.pipe(
      tap((volunteer) => {
        this.mainForm = this.formBuilder.group({
          nom: [volunteer.nom, Validators.required],
          prenom: [volunteer.prenom,Validators.required],
          email: [volunteer.email, Validators.required],
        });
      })
    ).subscribe();
  }

  private saveVolunteer() {
    let newVolunteer : Volunteer = {
      ...this.mainForm.value,
    }
    this.formService.saveVolunteer(newVolunteer).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
          Notify.success("Bénévole ajouté avec succès");
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  private updateVolunteer() {
    let updatedVolunteer : Volunteer = {
      ...this.mainForm.value,
    }
    this.volunteersService.updateVolunteer(this.currentVolunteerId, updatedVolunteer).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
          Notify.success("Bénévole modifié avec succès");
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  onGoBack() {
    if(this.router.url === "/volunteers/add"){
      this.router.navigateByUrl(`/volunteers`)
    }
    else{
      this.router.navigateByUrl(`/volunteers/${this.currentVolunteerId}`)
      Notify.info("Les modifications n'ont pas été enregistrées")
    }
  }

}
