// features-section.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth.service';
import { OnInit } from '@angular/core';
import { UserRole } from '../../model/auth-types';
import { Router, RouterModule, NavigationEnd, Route } from '@angular/router';




interface Feature {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  action: string;
  pageLink?: string;
}

@Component({
  selector: 'app-features-section',
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.css'],
  standalone: true
  , imports: [CommonModule, RouterModule] 
})
export class FeaturesSectionComponent implements OnInit {

  constructor(private router: Router ,private authService: AuthService) {}
  isAuthenticated = false;
  ngOnInit() {
    this.authService.isAuthenticated().subscribe(authenticated => {
      this.isAuthenticated = authenticated;
    }
    );
  }
  
  features: Feature[] = [
    {
      icon: '📅',
      title: 'Prenota Sessione',
      description: 'Prenota il tuo slot in sala pesi e evita le code. Disponibilità in tempo reale.',
      badge: 'Disponibile',
      action: 'Prenota ora',
      pageLink: '/booking'
    },
    {
      icon: '💪',
      title: 'Schede Allenamento',
      description: 'Richiedi schede personalizzate dai nostri istruttori qualificati.',
      badge: 'Nuove Schede',
      action: 'Esplora schede'
    },
    {
      icon: '📢',
      title: 'Avvisi',
      description: 'Rimani sempre aggiornato su eventi, chiusure e novità della palestra.',
      badge: 'Nuovi Avvisi',
      action: 'Leggi avvisi',
      pageLink: '/notices'
    }
  ];

  onFeatureClick(feature: Feature) {
    if (feature.title === 'Prenota Sessione' && this.isAuthenticated) {
      this.router.navigate(['/booking']);
    }
    else if (feature.title === 'Schede Allenamento' && this.isAuthenticated) {
      // Logica per visualizzare le schede di allenamento
      console.log('Visualizzazione schede di allenamento...');
    }
    else if (feature.title === 'Avvisi' && this.isAuthenticated) {
      this.router.navigate(['/notices']);
    }else{
      alert('Devi essere autenticato per accedere a questa funzionalità.');
      this.router.navigate(['/login']);
    }

    
  }
}