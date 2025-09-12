import { BanDeleteRoleResponse, IncomingAdminStatsResponse, IncomingTotalStats, IncomingUsersData } from './../../models/admin.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth';
import { catchError, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { User, UserRole } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient , private authService: AuthService){}
  
  getDashboardStats():Observable<IncomingTotalStats>{
    return this.authService.isAuthenticated$.pipe(
      filter((isAuthnticated)=>isAuthnticated),
      take(1),
      switchMap(() => {
        return this.http.get<IncomingAdminStatsResponse>(`${this.apiUrl}/get-stats`).pipe(
          map((response) => {
            console.log(response);
            const stats = response.TotalStats
            return stats
          }),
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status !== 401) {
              console.error('An error occurred during application fetch:', error);
            }
            // Always return empty array on error
            return of<any>({});
          })
        )
      })
    )

  }

    getUsers():Observable<User[]>{

    return this.authService.isAuthenticated$.pipe(
      filter((isAuthnticated)=>isAuthnticated),
      take(1),
      switchMap(() => {
        return this.http.get<IncomingUsersData>(`${this.apiUrl}/get-users`).pipe(
          map((response) => {
            console.log(response);
            const users = response.users
            return users
          }),
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status !== 401) {
              console.error('An error occurred during application fetch:', error);
            }
            // Always return empty array on error
            return of<any>([]);
          })
        )
      })
    )
  }

  banUser(id: number, isBanned: boolean) {
    return this.http.put(`${this.apiUrl}/user/ban/${id}`, { isBanned });
  }

  updateRole(id: number, role : UserRole): Observable<BanDeleteRoleResponse> {
      return this.http.put<BanDeleteRoleResponse>(`${this.apiUrl}/user/update/${id}`, {role});
    }
  
    // API call to delete a job
    deleteUser(id: number): Observable<BanDeleteRoleResponse> {
      return this.http.delete<BanDeleteRoleResponse>(`${this.apiUrl}/user/delete/${id}`);
    }



}
