import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, CreateUserRequest, CreateUserResponse, UserForAdmin, UserProfile, VerificationCodeResponse } from '../model/auth-types';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = 'http://localhost:8080/api/user';


  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<(UserProfile)>(`${this.API_URL}/profile`, { withCredentials: true }).pipe(
      tap(user => {
        //console.log('User profile loaded:', user);
      }),
      catchError(this.handleError)
    );
  }

  updateUser(user: UserProfile): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.API_URL}/update`, user, { withCredentials: true }).pipe(
      //tap((updatedUser) => console.log('Utente aggiornato:', updatedUser)),
      catchError(this.handleError)
    );
  }
  





  private handleError(error: any): Observable<never> {
    let errorMessage = 'Errore sconosciuto';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Errore ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
