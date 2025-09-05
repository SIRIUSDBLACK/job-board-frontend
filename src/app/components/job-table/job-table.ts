import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobStore } from '../../services/job-store/job-store';
import { IncomingJobPayload } from '../../models/job.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-job-table',
  imports: [CommonModule],
  templateUrl: './job-table.html',
  styleUrl: './job-table.scss',
})
export class JobTable {
  // This is your data source
  jobs$!: Observable<IncomingJobPayload[]>;

  constructor(private jobStore: JobStore) {}

  ngOnInit(): void {
    this.jobStore.loadJobs();
    this.jobs$ = this.jobStore.jobs$;
    console.log('Observable assigned to jobs$', this.jobs$);
  }

  onUpdate(job: any) {
    console.log('Update button clicked for job:', job);
    // Add your logic for updating a job here, e.g., navigate to an edit form
  }

  onDetail(job: any) {
    console.log('Detail button clicked for job:', job);
    // Add your logic for showing job details, e.g., open a modal or navigate to a new page
  }

  onDelete(job: any) {
    console.log('Delete button clicked for job:', job);
    // Add your logic for deleting a job here, e.g., show a confirmation dialog and then remove from the array
  }
}
