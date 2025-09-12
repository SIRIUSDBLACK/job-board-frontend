// src/app/components/job-detail/job-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { JobService } from '../../services/job/job';
import { IncomingJobPayload } from './../../models/job.model';
import { filter, switchMap, take, tap } from 'rxjs/operators'; // <-- Import the required operators
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-job-detail',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.scss',
})
export class JobDetail implements OnInit {
   private jobSubject = new Subject<IncomingJobPayload | null>();
  job$ = this.jobSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private authService: AuthService // <-- Inject the AuthService here
  ) {}


  ngOnInit(): void {
    // Manually subscribe to the authentication state once
    this.authService.isAuthenticated$.pipe(
      filter((isAuthenticated) => isAuthenticated),
      take(1),
      tap(() => {
        // Once authenticated, get the ID from the URL and fetch the job
        this.route.paramMap.pipe(
          take(1),
          switchMap((params) => {
            const id = Number(params.get('id'));
            if (id) {
              console.log(id);
              return this.jobService.jobDetail(id);
            } else {
              return of(null);
            }
          })
        ).subscribe((job) => {
          console.log(job);
          this.jobSubject.next(job);
        });
      })
    ).subscribe();
  }
}