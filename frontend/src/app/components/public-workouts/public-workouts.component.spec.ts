import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicWorkoutsComponent } from './public-workouts.component';

describe('PublicWorkoutsComponent', () => {
  let component: PublicWorkoutsComponent;
  let fixture: ComponentFixture<PublicWorkoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicWorkoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicWorkoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
