import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../services/types'
import { CommonModule } from '@angular/common';
import { PersonalDataComponent } from '../../components/personal-data/personal-data.component';
import { Subscription } from 'rxjs';
import { UserManagementComponent } from '../../components/user-management/user-management.component';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [ RouterModule, CommonModule, PersonalDataComponent, UserManagementComponent ]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: UserProfile | null = null;
  activeTab: string = 'personal-data';
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCurrentUser(): void {
    this.subscription.add(
      this.userService.getUserProfile().subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (error) => {
          console.error('Errore nel caricamento utente:', error);
        }
      })
    );
  }

  onUserUpdated(updatedUser: UserProfile): void {
    this.currentUser = updatedUser;
    //this.loadCurrentUser();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  isTrainer(): boolean {
    return this.currentUser?.role === 'TRAINER';
  }

  isClient(): boolean {
    return this.currentUser?.role === 'CLIENT';
  }
}