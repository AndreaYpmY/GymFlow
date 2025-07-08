import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerSchedulesComponent } from './trainer-schedules.component';

describe('TrainerSchedulesComponent', () => {
  let component: TrainerSchedulesComponent;
  let fixture: ComponentFixture<TrainerSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerSchedulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
