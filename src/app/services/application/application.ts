import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, filter, map, Observable, of, switchMap, take } from 'rxjs';
import {
  IncomingApplicationPayload,
  IncomingApplicationResponse,
  IncomingApplicationsResponse,
} from '../../models/application.model';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api/application';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // This function now takes a Base64 string and sends it in a JSON object
  applyForJob(
    jobId: number,
    seekerId: number,
    cvFile: File
  ): Observable<IncomingApplicationResponse> {
    const stringSelectedId = JSON.stringify(jobId);
    const stringSeekerId = JSON.stringify(seekerId);
    const formData = new FormData();
    formData.append('job_id', stringSelectedId);
    formData.append('seeker_id', stringSeekerId);
    formData.append('cv_file', cvFile);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log(formData);

    // The HttpClient automatically serializes the object to JSON
    return this.http.post<IncomingApplicationResponse>(`${this.apiUrl}/apply`, formData);
  }

  getApplicationsBySeekerId(): Observable<IncomingApplicationPayload[]> {
    return this.authService.isAuthenticated$.pipe(
      filter((isAuthenticated) => isAuthenticated),
      take(1),
      switchMap(() =>
        this.http.get<IncomingApplicationsResponse>(`${this.apiUrl}/get-applications`).pipe(
          map((response) => {
            console.log(response);
            // Ensure applications is always an array
            const apps = response.applications;
            console.log(apps);
            return Array.isArray(apps) ? apps : [apps];
          }),
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status !== 401) {
              console.error('An error occurred during application fetch:', error);
            }
            // Always return empty array on error
            return of<IncomingApplicationPayload[]>([]);
          })
        )
      )
    );
  }
}
