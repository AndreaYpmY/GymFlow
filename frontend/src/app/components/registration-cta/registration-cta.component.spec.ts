import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCtaComponent } from './registration-cta.component';

describe('RegistrationCtaComponent', () => {
  let component: RegistrationCtaComponent;
  let fixture: ComponentFixture<RegistrationCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
