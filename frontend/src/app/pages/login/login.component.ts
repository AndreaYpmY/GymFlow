import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
        
      // Qui implementerai la logica di autenticazione
      const { email, password } = this.loginForm.value;

      // Simulazione chiamata API
      /*setTimeout(() => {
        this.isLoading = false;
        // Qui gestirai la risposta del server
        console.log('Login attempt:', { email, password });
        // this.router.navigate(['/dashboard']);
      }, 1000);*/
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          //console.log('Login successful:', response);
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.isLoading = false;
          this.errorMessage = 'Email o password non validi';
        }
      });

    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() { // Funzione per marcare tutti i campi del form come "toccati"
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}