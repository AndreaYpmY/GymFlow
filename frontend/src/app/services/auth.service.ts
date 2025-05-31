import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'Client' | 'Trainer' | 'Admin' | null;

interface User {
    id: string; // ID utente (es. dal backend)
    role: UserRole; // Ruolo dell'utente
}

@Injectable({ 
  providedIn: 'root'
})

export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // Stato di autenticazione
    private userSubject = new BehaviorSubject<User | null>(null); // Utente corrente
    
    isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
    user$: Observable<User | null> = this.userSubject.asObservable();
  
    // todo: Simula il login con un ID utente e un ruolo
    login(userId: string, role: UserRole) {
      this.isAuthenticatedSubject.next(true);
      this.userSubject.next({ id: userId, role });
    }
  
    // todo: Simula il logout
    logout() {
      this.isAuthenticatedSubject.next(false);
      this.userSubject.next(null);
    }
  
    // Verifica se l'utente è autenticato
    isAuthenticated(): boolean {
      return this.isAuthenticatedSubject.value;
    }
  
    // Ottieni il ruolo corrente
    getUserRole(): UserRole {
      return this.userSubject.value?.role || null;
    }
  
    // Ottieni l'utente corrente
    getCurrentUser(): User | null {
      return this.userSubject.value;
    }
  }