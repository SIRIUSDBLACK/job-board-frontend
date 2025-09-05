// src/app/services/job.store.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JobService } from '../job/job';
import { IncomingJobPayload, OutgoingJobPayload } from '../../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobStore {
  // Private BehaviorSubject to hold the current state
  // An empty array is the initial value
  private jobsSubject = new BehaviorSubject<IncomingJobPayload[]>([]);

  // Public observable for components to subscribe to
  // We use .asObservable() to prevent components from emitting new values
  public jobs$ = this.jobsSubject.asObservable();

  constructor(private jobService: JobService) {
    // Automatically load all jobs when the store is instantiated
    // this.loadJobs();
  }

  // Method to fetch all jobs from the API and update the local state
  loadJobs(): void {
    this.jobService.getMyJobs().subscribe(
      jobs => this.jobsSubject.next(jobs)
    );
  }

  // Method to create a new job via the API and then update the local state
  createJob(job: OutgoingJobPayload): Observable<IncomingJobPayload> {
    return this.jobService.createJob(job).pipe(
      tap(createdJob => {
        const currentJobs = this.jobsSubject.getValue();
        this.jobsSubject.next([...currentJobs, createdJob]);
      })
    );
  }

  // Method to update a job via the API and then update the local state
  updateJob(id: number, job: OutgoingJobPayload): Observable<IncomingJobPayload> {
    return this.jobService.updateJob(id, job).pipe(
      tap(updatedJob => {
        const currentJobs = this.jobsSubject.getValue();
        const updatedJobs = currentJobs.map(j => j.id === id ? updatedJob : j);
        this.jobsSubject.next(updatedJobs);
      })
    );
  }

  // Method to delete a job via the API and then update the local state
  deleteJob(id: number): Observable<any> {
    return this.jobService.deleteJob(id).pipe(
      tap(() => {
        const currentJobs = this.jobsSubject.getValue();
        const updatedJobs = currentJobs.filter(j => j.id !== id);
        this.jobsSubject.next(updatedJobs);
      })
    );
  }
}