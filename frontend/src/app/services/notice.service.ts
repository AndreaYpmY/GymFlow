  import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';
  import { Notice } from '../model/notice-types';
  import { HttpClient } from '@angular/common/http';
  import { catchError, tap } from 'rxjs/operators';
  import { throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { UserRole } from '../model/auth-types';
  
  
  @Injectable({
    providedIn: 'root'
  })
  export class NoticeService {
    private API_URL = 'http://localhost:8080/api/notices';
    constructor(private http: HttpClient, private authService:AuthService) {}

    isAuthenticated(): Observable<boolean> {
      return this.authService.isAuthenticated();
    }

    getUserRole(): Observable<UserRole> {
      return this.authService.role$;
    }
  
  
    getNotices(): Observable<Notice[]> {
      return this.http.get<Notice[]>(`${this.API_URL}/active`, { withCredentials: true }).pipe(
        catchError(this.handleError)
      );
    }

    getTopNotices(): Observable<Notice[]> {
      return this.http.get<Notice[]>(`${this.API_URL}/important/top`).pipe(
        catchError(this.handleError)
      );
    } 
  
    addNotice(notice: Omit<Notice, 'id' | 'createdAt' | 'likes' | 'likedByCurrentUser'>): Observable<void> {
      return this.http.post<void>(`${this.API_URL}/new`, notice, { withCredentials: true }).pipe(
        catchError(this.handleError)
      );
    }
  
    deleteNotice(noticeId: string): Observable<void> {
      return this.http.get<void>(`${this.API_URL}/delete?noticeId=${noticeId}`, { withCredentials: true }).pipe(
        catchError(this.handleError)
      );
    }
  
    likeNotice(noticeId: string): Observable<void> {
      return this.http.post<void>(`${this.API_URL}/${noticeId}/like`, {}, { withCredentials: true }).pipe(
        catchError(this.handleError)
      );
    }
  
    unlikeNotice(noticeId: string): Observable<void> {
      return this.http.post<void>(`${this.API_URL}/${noticeId}/unlike`, {}, { withCredentials: true }).pipe(
        catchError(this.handleError)
      );
    }
  
   


    private handleError(error: any): Observable<never> {
      console.error('An error occurred:', error);
      return throwError(() => new Error('Something went wrong; please try again later.'));
    }
  }