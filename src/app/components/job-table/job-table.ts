import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobStore } from '../../services/job-store/job-store';
import { IncomingJobPayload } from '../../models/job.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-table',
  imports: [CommonModule],
  templateUrl: './job-table.html',
  styleUrl: './job-table.scss',
})
export class JobTable {
  // This is your data source
  jobs$!: Observable<IncomingJobPayload[]>;
  isConfirmingDelete: boolean = false;
  jobToDelete: any = null;

  constructor(private jobStore: JobStore, private router: Router) {}

  ngOnInit(): void {
    this.jobStore.loadJobs();
    this.jobs$ = this.jobStore.jobs$;
    console.log('Observable assigned to jobs$', this.jobs$);
  }

  onUpdate(job: any) {
    this.router.navigate([`/employer-dashboard/job-table/edit-job/${job.id}`]);
    console.log('Update button clicked for job:', job);
    // Add your logic for updating a job here, e.g., navigate to an edit form
  }

  onDetail(job: any) {
    this.router.navigate([`/employer-dashboard/job-table/job-detail/${job.id}`]);
    console.log('Detail button clicked for job:', job);
    // Add your logic for showing job details, e.g., open a modal or navigate to a new page
  }

 onDelete(job: any) {
    console.log('Delete button clicked for job:', job);
    
    // Set the state to show the confirmation modal
    this.isConfirmingDelete = true;
    this.jobToDelete = job;
  }
  // New method to perform the deletion after confirmation
  confirmDelete() {
    if (this.jobToDelete) {
      console.log('User confirmed deletion for job:', this.jobToDelete);

      this.jobStore.deleteJob(this.jobToDelete.id).subscribe({
        next: () => {
          console.log('Job deleted and UI updated successfully!');
        },
        error: (err) => {
          console.error('Failed to delete job:', err);
        },
      });

      // Reset the modal state
      this.isConfirmingDelete = false;
      this.jobToDelete = null;
    }
  }

  // New method to cancel the deletion
  cancelDelete() {
    // Reset the modal state without deleting
    this.isConfirmingDelete = false;
    this.jobToDelete = null;
  }
}