// admin-user-registration.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-registration',
  templateUrl: './admin-user-registration.component.html',
  styleUrls: ['./admin-user-registration.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AdminUserRegistrationComponent {
  registrationForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  userRoles = [
    { value: 'admin', display: 'Amministratore' },
    { value: 'trainer', display: 'Personal Trainer' },
    { value: 'client', display: 'Cliente' }
  ];

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fiscalCode: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]$/)]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const formData = this.registrationForm.value;
      
      // Simulazione chiamata API
      setTimeout(() => {
        this.isLoading = false;
        //console.log('Admin registration data:', formData);
        
        // Simulazione successo
        this.successMessage = 'Utente registrato con successo!';
        this.registrationForm.reset();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  onReset() {
    this.registrationForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Getters per template
  get email() { return this.registrationForm.get('email'); }
  get fiscalCode() { return this.registrationForm.get('fiscalCode'); }
  get role() { return this.registrationForm.get('role'); }
}