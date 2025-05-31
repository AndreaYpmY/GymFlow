import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

interface QuickLink {
  name: string;
  path: string;
}

interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [RouterModule, FontAwesomeModule], // Aggiungi RouterModule agli imports
  standalone: true

})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  contactInfo = {
    address: 'Via Roma 123, 87100 Cosenza',
    phone: '+39 02 1234567',
    email: 'info@gymflow.it',
    hours: {
      weekdays: 'Lun-Ven: 6:00 - 22:00',
      saturday: 'Sab: 8:00 - 20:00',
      sunday: 'Dom: Chiuso'
    }
  };


  quickLinks: QuickLink[] = [
    { name: 'Home', path: '/' },
    { name: 'Accedi', path: '/login' },
    { name: 'Registrati', path: '/register' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Termini di Servizio', path: '/terms' }
  ];

  socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: 'facebook-f', url: 'https://facebook.com' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
    { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
    { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com' }
  ];

  constructor(library: FaIconLibrary) {
    // Registra le icone
    library.addIcons(faFacebookF, faInstagram, faTwitter, faYoutube);
  }
}
