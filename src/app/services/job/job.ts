// src/app/services/job.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {
  IncomingCreateOrUpdateJobResult,
  IncomingGetJobsResult,
  IncomingJobPayload,
  OutgoingJobPayload,
} from '../../models/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = 'https://job-board-backend-is94.onrender.com/api/job';

  constructor(private http: HttpClient) {}

  //Employer

  // A read-only list of jobs for the store to pull from
  getMyJobs(): Observable<IncomingJobPayload[]> {
    return this.http.get<IncomingGetJobsResult>(`${this.apiUrl}/my-jobs`).pipe(
      // Use the map operator to extract the 'jobs' array
      map((response) => response.jobs),
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status !== 401) {
          console.error('An error occurred during job fetch:', error);
        }
        // console.error('Error fetching jobs:', error);
        // Return an empty array to prevent the app from breaking.
        // The type here matches the type of the Observable.
        return of([]);
      })
    );
  }

  // API call to create a new job
  createJob(job: OutgoingJobPayload): Observable<IncomingJobPayload> {
    return this.http.post<IncomingCreateOrUpdateJobResult>(`${this.apiUrl}/create`, job).pipe(
      // Use the map operator to extract the 'jobs' array
      map((response) => response.job)
    );
  }

  // API call to update a job
  updateJob(id: number, job: OutgoingJobPayload): Observable<IncomingJobPayload> {
    return this.http.put<IncomingCreateOrUpdateJobResult>(`${this.apiUrl}/update/${id}`, job).pipe(
      // Use the map operator to extract the 'jobs' array
      map((response) => response.job)
    );
  }

  // API call to delete a job
  deleteExistingJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  //Employer && Seeker

  jobDetail(id: number): Observable<IncomingJobPayload | null> {
    return this.http.get<IncomingCreateOrUpdateJobResult>(`${this.apiUrl}/job-detail/${id}`).pipe(
      // Log 1: See the raw response from the server
      tap((response) => console.log('Raw response:', response)),
      // Log 2: See the value of response.job
      tap((response) => console.log('Response.job value:', response?.job)),

      map((response) => (response ? response.job : null)),

      catchError((error: HttpErrorResponse) => {
        // Log 3: See if the catchError block is being triggered
        console.error('Error in catchError:', error);
        return of(null);
      })
    );
  }


// Seeker

  getJobs(filters: any = {}, page = 1, limit = 10): Observable<any> {
    

    console.log('--- getJobs() called ---');
    console.log('Filters:', filters);
    console.log('Page:', page);
    console.log('Limit:', limit);

    let params = new HttpParams().set('page', page).set('limit', limit);

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    console.log('Requesting URL:', `${this.apiUrl}/`);
    console.log('Requesting with params:', params.toString());

    return this.http.get(`${this.apiUrl}/`, { params });


  }

}
