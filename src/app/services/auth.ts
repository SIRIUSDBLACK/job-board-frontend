import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginPayload, RegisterPayload, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user = this.userSubject.asObservable();

  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient ,private router : Router) {}

  register(payload : RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.userSubject.next(res.user);
      })
    );
  }

  login(payload : LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.userSubject.next(res.user);
      })
    );
  }

  logout(){
    localStorage.removeItem("token");
    this.userSubject.next(null)
    this.router.navigate(["/login"])
  }
}
