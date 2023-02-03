import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleVolunteerComponent } from './single-volunteer.component';

describe('SingleVolunteerComponent', () => {
  let component: SingleVolunteerComponent;
  let fixture: ComponentFixture<SingleVolunteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleVolunteerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleVolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
