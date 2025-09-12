// src/app/services/job.store.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JobService } from '../job/job';
import { IncomingJobPayload, OutgoingJobPayload } from '../../models/job.model';
import { filter, take } from 'rxjs/operators'; // <-- Import these RxJS operators
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class JobStore {
  // Private BehaviorSubject to hold the current state
  private jobsSubject = new BehaviorSubject<IncomingJobPayload[]>([]);

  // Public observable for components to subscribe to
  public jobs$ = this.jobsSubject.asObservable();

  constructor(
    private jobService: JobService,
    private authService: AuthService // <-- Inject AuthService
  ) {
    // Automatically load all jobs when the store is instantiated
    this.loadJobs();
  }

  // Method to fetch all jobs from the API and update the local state
  loadJobs(): void {
    // THIS IS THE KEY FIX: Wait for the authentication state to be true
    this.authService.isAuthenticated$
      .pipe(
        // The filter operator will hold the stream until isAuthenticated is true
        filter((isAuthenticated) => isAuthenticated === true),
        // The take(1) operator will complete the stream after the first true value, preventing multiple API calls
        take(1)
      )
      .subscribe(() => {
        // Now that we are authenticated, make the HTTP call
        this.jobService.getMyJobs().subscribe((jobs) => this.jobsSubject.next(jobs));
      });
  }

  // Method to create a new job via the API and then update the local state
  createJob(job: OutgoingJobPayload): Observable<IncomingJobPayload> {
    return this.jobService.createJob(job).pipe(
      tap((createdJob) => {
        const currentJobs = this.jobsSubject.getValue();
        this.jobsSubject.next([...currentJobs, createdJob]);
      })
    );
  }

  // Method to update a job via the API and then update the local state
  updateJob(id: number, job: OutgoingJobPayload): Observable<IncomingJobPayload> {
    return this.jobService.updateJob(id, job).pipe(
      tap((updatedJob) => {
        const currentJobs = this.jobsSubject.getValue();
        const updatedJobs = currentJobs.map((j) => (j.id === id ? updatedJob : j));
        this.jobsSubject.next(updatedJobs);
      })
    );
  }

  // Method to delete a job via the API and then update the local state
  deleteJob(id: number): Observable<any> {
    return this.jobService.deleteExistingJob(id).pipe(
      tap(() => {
        const currentJobs = this.jobsSubject.getValue();
        const updatedJobs = currentJobs.filter((j) => j.id !== id);
        this.jobsSubject.next(updatedJobs);
      })
    );
  }
}
