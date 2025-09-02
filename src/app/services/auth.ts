import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private userSubject = new BehaviorSubject<User | null>(null);
  user = this.userSubject.asObservable();

  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(name: string, email: string, role: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { name, email, password, role }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.userSubject.next(res.user);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.userSubject.next(res.user);
      })
    );
  }

  logout(){
    localStorage.removeItem("token");
    this.userSubject.next(null)
  }
}
