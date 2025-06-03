import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserRegistrationComponent } from './admin-user-registration.component';

describe('AdminUserRegistrationComponent', () => {
  let component: AdminUserRegistrationComponent;
  let fixture: ComponentFixture<AdminUserRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
