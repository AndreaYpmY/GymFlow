import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserRole } from '../../model/auth-types';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule]
})



export class HeaderComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isScrolled = false;
  currentRoute = '';

  isAuthenticated = false;

  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.authenticated$.subscribe(authentication => {
        this.isAuthenticated = authentication;
      }
    ));

    // Verifica lo stato inizile
    this.currentRoute = this.router.url;
  }

  ngOnDestroy(): void { // Eliminazione subscription
    this.subscriptions.unsubscribe(); 
  }



  constructor(private router: Router, private authService: AuthService) {
    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => { // Quando la cambia la rotta: si aggiorna la rotta corrente
          this.currentRoute = event.url;
          this.closeMobileMenu();
        })
    );
  }

  

  // Listener per chiudere menu mobile quando si clicca fuori
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const headerElement = target.closest('.header');
    
    if (!headerElement && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Listener per gestire resize window
  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute === route || 
           (route !== '/' && this.currentRoute.startsWith(route));
  }

  onLogin(): void {
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  onRegister(): void {
    this.router.navigate(['/register']);
    this.closeMobileMenu();
  }

  navigateTo(route: string): void {
    //console.log('Navigating to:', route, 'Authenticated:', this.isAuthenticated);
    if (!this.isAuthenticated && (route === '/notices' || route === '/bookings')) {
      this.router.navigate(['/login']);
      this.closeMobileMenu();
      //console.log('User not authenticated, redirecting to login');
      return;
    }
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isAuthenticated = false;
        this.router.navigate(['/']);
        this.closeMobileMenu();
      },
      error: (error) => {
        console.error('Errore durante il logout:', error);
      }
    });
  }

  onPersonalArea(): void {
    this.router.navigate(['/personal']);
    this.closeMobileMenu();
  }
}