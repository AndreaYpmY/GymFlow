import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, PaginatedUsersResponse, CreateUserRequest, CreateUserResponse, UserForAdmin, UserProfile, VerificationCodeResponse, UserFormData, PaginatedClientsResponse, ClientForAdmin, TrainerForAdmin } from '../model/auth-types';


@Injectable({
    providedIn: 'root'
  })
export class AdminService{
    private API_URL = 'http://localhost:8080/api/admin';
    constructor(private http: HttpClient) {}


    getUsers(params: any): Observable<PaginatedUsersResponse> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => { // itero su tutte le chiavi dell'oggetto params
          if (params[key] !== undefined && params[key] !== null) {
            httpParams = httpParams.set(key, params[key].toString()); // converto il valore in stringa per evitare errori con HttpParams
          }
        });
        return this.http.get<PaginatedUsersResponse>(`${this.API_URL}/users`, { params: httpParams, withCredentials: true }).pipe(
          catchError(this.handleError)
        );
      }

    createUser(userData: UserFormData): Observable<CreateUserResponse> {
      return this.http.post<CreateUserResponse>(`${this.API_URL}/register`, userData, { withCredentials: true }).pipe(
        tap((response) => console.log('Utente creato:', response)),
        catchError(this.handleError)
      );
    }

    getClient(): Observable<ClientForAdmin[]> {
        return this.http.get<ClientForAdmin[]>(`${this.API_URL}/clients`, { withCredentials: true }).pipe(
          catchError(this.handleError)
        );
      }

    setNewSubscriptionEndDate(email: string, endDate: string): Observable<void> {
        const body = { email, endDate };
        return this.http.put<void>(`${this.API_URL}/clients/subscription`, body, { withCredentials: true }).pipe(
          tap(() => console.log(`Data di fine abbonamento aggiornata per ${email}`)),
          catchError(this.handleError)
        );
    }

    getTrainer(): Observable<TrainerForAdmin[]> {
        return this.http.get<TrainerForAdmin[]>(`${this.API_URL}/trainers`, { withCredentials: true }).pipe(
          catchError(this.handleError)
        );
      }

      updateTrainerSchedule(TrainerForAdmin: TrainerForAdmin): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/trainer/schedule`, TrainerForAdmin, { withCredentials: true }).pipe(
          tap(() => console.log(`Orario del trainer ${TrainerForAdmin.name} ${TrainerForAdmin.surname} aggiornato`)),
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