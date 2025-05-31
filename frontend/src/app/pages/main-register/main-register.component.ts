// register.component.ts
import { Component } from '@angular/core';
import { CodeVerificationComponent } from '../../components/code-verification/code-verification.component';
import { RegistrationFormComponent } from '../../components/registration-form/registration-form.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './main-register.component.html',
  styleUrls: ['./main-register.component.css'],
  standalone: true,
  imports: [
    CodeVerificationComponent,
    RegistrationFormComponent,
    RouterModule,
    CommonModule
  ]
})
export class RegisterComponent {
  currentStep: 'code-verification' | 'registration' = 'code-verification';
  verificationCode: string = '';
  userRole: string = '';

  onCodeVerified(event: {code: string, role: string}) {
    this.verificationCode = event.code;
    this.userRole = event.role;
    this.currentStep = 'registration';
  }

  onBackToCodeVerification() {
    this.currentStep = 'code-verification';
    this.verificationCode = '';
    this.userRole = '';
  }
}