import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../services/application/application';
import { AuthService } from '../../services/auth/auth';
import { IncomingJobApplicationPayload } from '../../models/application.model';
import { CommonModule, DatePipe } from '@angular/common';
import { filter, of, switchMap, take, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applications-list-per-job',
  imports: [CommonModule, DatePipe , FormsModule],
  templateUrl: './applications-list-per-job.html',
  styleUrl: './applications-list-per-job.scss',
})
export class ApplicationsListPerJob {
  applications = signal<IncomingJobApplicationPayload[]>([]);
  isModalOpen = false;
  selectedApplication: any = null; // store clicked application
  selectedStatus: string = 'pending';
  selectedApplicationId : any = null;


  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private authService: AuthService // <-- Inject the AuthService here
  ) {}

  ngOnInit(): void {
    // Manually subscribe to the authentication state once
   this.loadApplications()
  }

  loadApplications(){
     this.authService.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => isAuthenticated),
        take(1),
        tap(() => {
          // Once authenticated, get the ID from the URL and fetch the job
          this.route.paramMap
            .pipe(
              take(1),
              switchMap((params) => {
                const id = Number(params.get('id'));
                if (id) {
                  console.log(id);
                  return this.applicationService.getApplicationsByJobId(id);
                } else {
                  return of(null);
                }
              })
            )
            .subscribe((applications) => {
              console.log(applications);
              this.applications.set(applications!);
              console.log(this.applications);
            });
        })
      )
      .subscribe();
  }

  downloadFile(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  statusColorClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 font-semibold'; // yellow for pending
      case 'shortlisted':
        return 'text-green-600 font-semibold'; // green for shortlisted
      case 'rejected':
        return 'text-red-600 font-semibold'; // red for rejected
      default:
        return '';
    }
  }

  openModal(application: any) {
    this.selectedApplication = application;
    this.selectedStatus = application.status; // default to current status
    this.selectedApplicationId = application.application_id
    console.log(this.selectedApplicationId);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedApplication = null;
    this.selectedApplicationId = null;
  }

  onChangeStatus() {
    // send PATCH request here
    this.applicationService.updateApplicationStatus( this.selectedApplicationId, this.selectedStatus).subscribe(msg => console.log(msg))

    console.log('Changing status to:', this.selectedStatus);
    this.closeModal();
    this.loadApplications();
  }


}
