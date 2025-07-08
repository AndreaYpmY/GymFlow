// code-verification.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../model/auth-types';



@Component({
  selector: 'app-code-verification',
  templateUrl: './code-verification.component.html',
  styleUrls: ['./code-verification.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CodeVerificationComponent {
  @Output() codeVerified = new EventEmitter<{email: string, role: string}>(); // Emette un evento con il codice e il ruolo
  
  codeForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.codeForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const code = this.codeForm.value.code;
      
      this.authService.verifyRegistrationCode(code).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Codice verificato con successo:', response);
          if(response.role != null){
            this.codeVerified.emit({ email: response.email, role: response.role });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Errore durante la verifica del codice:', error);
          this.errorMessage = 'Codice non valido. Contatta l\'amministratore.';
        }
      });
      
      
      /*Simulazione verifica codice
      setTimeout(() => {
        this.isLoading = false;
        
        // Simulazione risposta server con diversi codici per diversi ruoli
        const mockCodes = {
          '000000': 'client',
          '111111': 'trainer'
        };
        
        const role = mockCodes[code as keyof typeof mockCodes];
        console.log(`Codice inserito: ${code}, Ruolo: ${role}`);
        
        if (role) {
          this.codeVerified.emit({ code, role });
        } else {
          this.errorMessage = 'Codice non valido. Contatta l\'amministratore.';
        }
      }, 1000);*/
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.codeForm.controls).forEach(key => {
      const control = this.codeForm.get(key);
      control?.markAsTouched();
    });
  }

  get getCode() { return this.codeForm.get('code'); }
  get getEmail() { return this.codeForm.get('email');}
}