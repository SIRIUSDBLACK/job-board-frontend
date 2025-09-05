// src/app/services/job.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
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
  private apiUrl = 'http://localhost:5000/api/job';

  constructor(private http: HttpClient) {}

  // A read-only list of jobs for the store to pull from
  getMyJobs(): Observable<IncomingJobPayload[]> {
    return this.http.get<IncomingGetJobsResult>(`${this.apiUrl}/myjobs`).pipe(
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
}
