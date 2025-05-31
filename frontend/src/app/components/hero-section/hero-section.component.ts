import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule


@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
  standalone: true,
  imports: [CommonModule] // Aggiungi CommonModule agli imports
  
})
export class HeroSectionComponent {

  scrollToFeatures() { // Metodo per scorrere alla sezione delle funzionalità
    const element = document.querySelector('.features-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}