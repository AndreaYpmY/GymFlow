// registration-cta.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule


@Component({
  selector: 'app-registration-cta',
  templateUrl: './registration-cta.component.html',
  styleUrls: ['./registration-cta.component.css'],
  standalone: true,
  imports: [CommonModule] // Aggiungi CommonModule agli imports
})
export class RegistrationCtaComponent {

  constructor(private router: Router) {}

  onRegister(): void {
    this.router.navigate(['/register']);
  }
}
