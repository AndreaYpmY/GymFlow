import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymBookingComponent } from './gym-booking.component';

describe('GymBookingComponent', () => {
  let component: GymBookingComponent;
  let fixture: ComponentFixture<GymBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
