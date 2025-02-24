import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1/auth';
  private tokenKey = 'authToken';
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  private authStateSubject = new BehaviorSubject<boolean>(false);
  authState: Observable<boolean> = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      this.loggedIn.next(!!token);
      this.authStateSubject.next(!!token);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signin`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
          this.loggedIn.next(true);
          this.authStateSubject.next(true);
        } else {
          console.error('Login response missing token');
        }
      })
    );
  }

  /*logout and remove token */
  logout(): void {
    this.removeToken();
    this.loggedIn.next(false);
    this.authStateSubject.next(false);
    this.router.navigate(['/login']);
  }

  /*check if user is authenticated*/
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== 'null' && token !== 'undefined';
  }

  /*get auth token */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      return token && token !== 'null' && token !== 'undefined' ? token : null;
    }
    return null;
  }
  
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) { }
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }
  
  /*store token*/
  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  /*remove token*/
  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  //auth state
  setAuthState(isAuthenticated: boolean): void {
    this.authStateSubject.next(isAuthenticated);
  }
}
