// src/app/services/auth.service.ts

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, tap, map } from 'rxjs'; // Import 'map'
import { LoginPayload, RegisterPayload, User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user = this.userSubject.asObservable();
  // Add a public observable to specifically track the authentication status
  public isAuthenticated$: Observable<boolean> = this.user.pipe(
    map((user) => !!user) // Emits true if a user exists, false otherwise
  );

  private baseUrl = 'http://localhost:5000/api/auth';
 
    constructor(
        private http: HttpClient, 
        private router: Router, 
        @Inject(PLATFORM_ID) private platformId: Object // <-- Inject PLATFORM_ID
    ) {
        // This is the key fix: only access localStorage if running in a browser
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            if (token) {
                const user = { name: 'Placeholder' }; // Replace with actual user info from token
                this.userSubject.next(user as User);
            }
        }
    }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId',res.user.id)
        this.userSubject.next(res.user);
      })
    );
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId',res.user.id)
        this.userSubject.next(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
