import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { User, UserRole, LoginResponse, RegisterResponse, UserProfile, VerificationCodeResponse, finishRegistrationUserRequest } from './types'; // Si poteva creare una cartella model

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8080/api/auth';
  private roleSubject = new BehaviorSubject<UserRole>(null);
  role$ = this.roleSubject.asObservable();
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();


  constructor(private http: HttpClient) {
    this.checkInitialAuthStatus(); // Verifico lo stato di autenticazione all'inizio
  }
   private checkInitialAuthStatus(): void {
    const roleCookie = this.getCookieValue('role'); // Cookie del ruolo
    if (roleCookie) {
      this.authenticatedSubject.next(true);
      this.roleSubject.next(roleCookie as UserRole);
    } else {
      this.roleSubject.next(null);
    }
  }

  isAuthenticated(): Observable<boolean> {
    const roleCookie = this.getCookieValue('role');
    console.log('Role cookie:', roleCookie);
    if (roleCookie) {
      this.roleSubject.next(roleCookie as UserRole); 
      return of(true); 
    }
    return of(false); // Se il cookie del ruolo non esiste, l'utente non è autenticato
  }


  getCookieValue(name: string): string | null {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  login(email: string, password: string): Observable<void> {
      //console.log('Sending login request:', { email, password });
      return this.http.post<void>(`${this.API_URL}/login`, { email, password }, {
          withCredentials: true
      }).pipe(tap(() => {
          this.authenticatedSubject.next(true);
          this.roleSubject.next(this.getCookieValue('role') as UserRole); // Aggiorna il ruolo dell'utente
      }),
          catchError(this.handleError)
      );
    }
    // Registrazione dell'utente dall'admin si trova nel user.service.ts


  verifyRegistrationCode(code: string): Observable<VerificationCodeResponse> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set("code",code);
    console.log(code);
    return this.http.get<VerificationCodeResponse>(`${this.API_URL}/verify-code`, { params: httpParams ,withCredentials: true }).pipe(
      tap((response) => console.log('Codice di verifica:', response)),
      catchError(this.handleError)
    );
  }

  //!! Per questione di comidità non messo nel user.service.ts !!
  finishUserCreation(finishRegistrationUserRequest: finishRegistrationUserRequest): Observable<void> {
    //console.log(finishRegistrationUserRequest.dateOfBirth)
    return this.http.post<void>(`http://localhost:8080/api/user/finish-register`, finishRegistrationUserRequest, { withCredentials: true }).pipe(
      tap(() => { console.log("Successo");  
        this.authenticatedSubject.next(true);
      }),
      catchError(this.handleError)
    );
  }


  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log('Logout successful');
        this.authenticatedSubject.next(false);
        this.roleSubject.next(null); // Resetta il ruolo dell'utente
        //this.userSubject.next(null); // Resetta i dati dell'utente
      }),
      catchError(this.handleError)
    );
  }

  updateUser(user: UserProfile): void {
    //this.userSubject.next(user);
    this.roleSubject.next(user.role);
  }

  /*getUser(): UserProfile | null {
    return this.userSubject.value;
  }*/

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Errore sconosciuto';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || `Errore ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}