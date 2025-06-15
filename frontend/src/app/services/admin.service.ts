import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, PaginatedResponse, CreateUserRequest, CreateUserResponse, UserForAdmin, UserProfile, VerificationCodeResponse, UserFormData } from './types';


@Injectable({
    providedIn: 'root'
  })
export class AdminService{
    private API_URL = 'http://localhost:8080/api/admin';
    constructor(private http: HttpClient) {}


    getUsers(params: any): Observable<PaginatedResponse> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => { // itero su tutte le chiavi dell'oggetto params
          if (params[key] !== undefined && params[key] !== null) {
            httpParams = httpParams.set(key, params[key].toString()); // converto il valore in stringa per evitare errori con HttpParams
          }
        });
        return this.http.get<PaginatedResponse>(`${this.API_URL}/users`, { params: httpParams, withCredentials: true }).pipe(
          catchError(this.handleError)
        );
      }

      createUser(userData: UserFormData): Observable<CreateUserResponse> {
        return this.http.post<CreateUserResponse>(`${this.API_URL}/register`, userData, { withCredentials: true }).pipe(
          tap((response) => console.log('Utente creato:', response)),
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