// features-section.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule


interface Feature {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  action: string;
}

@Component({
  selector: 'app-features-section',
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.css'],
  standalone: true
  , imports: [CommonModule] 
})
export class FeaturesSectionComponent {
  
  features: Feature[] = [
    {
      icon: '📅',
      title: 'Prenota Sessione',
      description: 'Prenota il tuo slot in sala pesi e evita le code. Disponibilità in tempo reale.',
      badge: 'Disponibile ora',
      action: 'Prenota ora'
    },
    {
      icon: '💪',
      title: 'Schede Allenamento',
      description: 'Richiedi schede personalizzate dai nostri istruttori qualificati.',
      badge: '50+ Schede',
      action: 'Esplora schede'
    },
    {
      icon: '📢',
      title: 'Avvisi',
      description: 'Rimani sempre aggiornato su eventi, chiusure e novità della palestra.',
      badge: '3 Nuovi',
      action: 'Leggi avvisi'
    }
  ];

  onFeatureClick(feature: Feature) {
    console.log('Feature clicked:', feature.title);
    // Implementare la navigazione specifica per ogni feature
  }
}