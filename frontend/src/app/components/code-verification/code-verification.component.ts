// code-verification.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-code-verification',
  templateUrl: './code-verification.component.html',
  styleUrls: ['./code-verification.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CodeVerificationComponent {
  @Output() codeVerified = new EventEmitter<{code: string, role: string}>(); // Emette un evento con il codice e il ruolo
  
  codeForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.codeForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const code = this.codeForm.value.code;

      
      // Simulazione verifica codice
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
      }, 1000);
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

  get code() { return this.codeForm.get('code'); }
}