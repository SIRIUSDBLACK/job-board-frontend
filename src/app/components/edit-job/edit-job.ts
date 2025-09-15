import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job/job';
import { Observable, EMPTY, of } from 'rxjs';
import { catchError, map, take, switchMap } from 'rxjs/operators';
import { IncomingJobPayload } from '../../models/job.model';

@Component({
  selector: 'app-job-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-job.html',
  styleUrls: ['./edit-job.scss']
})
export class EditJob implements OnInit {
  jobForm!: FormGroup;
  job$!: Observable<IncomingJobPayload | null>;
  jobId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    // 1. Get the job ID from the URL
    this.route.paramMap.pipe(
      take(1), // We only need the ID once
      map(params => Number(params.get('id'))),
      switchMap(id => {
        if (!id) {
          console.error('Job ID not found in route parameters.');
          this.router.navigate(['/employer-dashboard/job-table']);
          return EMPTY; // Stop the stream
        }
        this.jobId = id;
        // 2. Fetch the job details from the server
        return this.jobService.jobDetail(id);
      })
    ).subscribe(job => {
      // 3. Pre-fill the form with the fetched data
      if (job) {
        this.jobForm.patchValue({
          title: job.title,
          description: job.description,
          salary: job.salary,
          location: job.location
        });
      } else {
        console.error('Job not found or could not be loaded.');
        this.router.navigate(['/employer-dashboard/job-table']);
      }
    });

    // Initialize the reactive form
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      // 4. Call the service to update the job
      this.jobService.updateJob(this.jobId, this.jobForm.value).pipe(
        catchError(error => {
          console.error('Error updating job:', error);
          return EMPTY;
        })
      ).subscribe(updatedJob => {
        if (updatedJob) {
          console.log('Job updated successfully:', updatedJob);
          // 5. Navigate back to the dashboard or job detail page
          this.router.navigate(['/employer-dashboard/job-table']);
        }
      });
    }
  }






}