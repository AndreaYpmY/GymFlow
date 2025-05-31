import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService, UserRole } from '../../services/auth.service';


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
  userRole: UserRole = null;

  private routerSubscription: Subscription; // Subscription per gli eventi di navigazione
  private authSubscription: Subscription; // Subscription per lo stato di autenticazione

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  ngOnDestroy(): void { // Pulizia delle subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  constructor(private router: Router, private authService: AuthService) {
    // Sottoscrizione agli eventi di navigazione
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.closeMobileMenu(); 
      });

    // Sottoscrizione allo stato di autenticazione
    this.authSubscription = this.authService.user$.subscribe(user => {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.userRole = user?.role || null;
    });
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
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  navigateToDashboard(): void {
    const role = this.userRole;
    if (role === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'Trainer') {
      this.router.navigate(['/trainer-dashboard']);
    } else if (role === 'Client') {
      this.router.navigate(['/client-dashboard']);
    }
    this.closeMobileMenu();
  }
}