// registration-form.component.ts
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finishRegistrationUserRequest } from '../../services/types';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class RegistrationFormComponent {
  @Input() userRole: string = '';
  @Input() email: string = ''; // Email ricevuta dal server dopo verifica codice
  
  registrationForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formData:finishRegistrationUserRequest = {
        name: this.registrationForm.value.firstName,
        surname: this.registrationForm.value.lastName,
        dateOfBirth: this.registrationForm.value.birthDate,
        password: this.registrationForm.value.password,
      };
      
      // Simulazione chiamata API
      /*setTimeout(() => {
        this.isLoading = false;
        console.log('Registration data:', formData);
        // Qui gestirai la risposta del server
        // this.router.navigate(['/login'], { queryParams: { registered: true } });
      }, 2000);*/
      this.authService.finishUserCreation(formData).subscribe({
        next: (response) => {
          this.isLoading=false;
          console.log('Registration data:', formData);
          this.router.navigate(['/home']);
        },error: (error) => {
          this.isLoading = false;
          console.error('Errore durante la registrazione', error);
          this.errorMessage = 'Errore nella fase di registrazione';
        }
      })
      

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

  getRoleDisplayName(): string {
    const roleNames = {
      'client': 'Cliente',
      'trainer': 'Personal Trainer'
    };
    return roleNames[this.userRole as keyof typeof roleNames] || this.userRole;
  }

  // Getters per template
  get firstName() { return this.registrationForm.get('firstName'); }
  get lastName() { return this.registrationForm.get('lastName'); }
  get birthDate() { return this.registrationForm.get('birthDate'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get acceptTerms() { return this.registrationForm.get('acceptTerms'); }
}