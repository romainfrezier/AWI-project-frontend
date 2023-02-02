import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {

  loading = false;

  mainForm!: FormGroup;
  contactTypeOptions!: ContactTypeEnum[];
  sectorTypeOptions!: SectorTypeEnum[];

  application$!: Observable<Application>;
  currentGameId!: number;
  currentApplicationCompany!: string;

  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private applicationsService: ApplicationsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initMainForm();
    this.initOptions();
  }

  private initMainForm(): void {
    if (this.router.url === "/applications/add") {
      this.initAddForm();
    } else {
      this.initUpdateForm();
    }
  }

  onSubmitForm() {
    this.loading = true;
    if (this.router.url === "/applications/add") {
      this.saveApplication();
    } else {
      this.updateApplication();
    }
    this.router.navigateByUrl('/applications')
  }

  private resetForm(){
    this.mainForm.reset();
  }

  private initOptions() {
    this.contactTypeOptions = [
      ContactTypeEnum.LINKEDIN,
      ContactTypeEnum.EMAIL_PERSO,
      ContactTypeEnum.EMAIL_SUPPORT,
      ContactTypeEnum.FORMULAIRE_CONTACT,
      ContactTypeEnum.FORMULAIRE_CANDIDATURE_SPON,
      ContactTypeEnum.OFFRE_STAGE
    ];
    this.sectorTypeOptions = [
      SectorTypeEnum.AI,
      SectorTypeEnum.RECRUITER,
      SectorTypeEnum.B2B,
      SectorTypeEnum.SECURTY,
      SectorTypeEnum.VIDEO_GAMES,
      SectorTypeEnum.FINANCE,
      SectorTypeEnum.WEB
    ];
  }

  private initAddForm() {
    this.mainForm = this.formBuilder.group({
      company: ['', Validators.required],
      address: ['', Validators.required],
      contactType: ['', Validators.required],
      contact: ['', Validators.required],
      message: ['', Validators.required],
      sector: ['', Validators.required],
      commentary: ['']
    });
  }

  private initUpdateForm() {
    this.application$ = this.route.params.pipe(
      tap(params => {
          this.currentGameId = +params['id'];
        }
      ),
      switchMap(params => this.applicationsService.getApplicationById(+params['id']))
    );
    this.application$.pipe(
      tap((application) => {
        this.mainForm = this.formBuilder.group({
          company: [application.company, Validators.required],
          address: [application.address, Validators.required],
          contactType: [application.contactType, Validators.required],
          contact: [application.contact, Validators.required],
          message: [application.message, Validators.required],
          sector: [application.sector, Validators.required],
          commentary: [application.commentary === undefined ? '' : application.commentary],
          answer: [application.answer, Validators.required]
        });
        this.currentApplicationCompany = application.company;
      })
    ).subscribe();
  }

  private saveApplication() {
    let newApplication : Application = {
      ...this.mainForm.value,
      id: this.applicationsService.maxId+1,
      answer: 'Aucune'
    }
    this.formService.saveApplication(newApplication).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  private updateApplication() {
    let updatedModel : Application = {
      ...this.mainForm.value,
      id: this.currentGameId,
    }
    this.applicationsService.updateApplication(this.currentGameId, updatedModel).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl(`/games/${this.currentGameId}`)
  }

}
