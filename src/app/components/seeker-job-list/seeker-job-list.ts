import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription, combineLatest, BehaviorSubject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  catchError,
  tap,
  filter,
  take,
} from 'rxjs/operators';
import { JobService } from '../../services/job/job';
import { AuthService } from '../../services/auth/auth';
import { IncomingJobPayload } from '../../models/job.model';
import { ApplicationService } from '../../services/application/application';
import { IncomingCreateApplicationResponse, IncomingSeekerApplicationPayload } from '../../models/application.model';

@Component({
  selector: 'app-seeker-job-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './seeker-job-list.html',
  styleUrls: ['./seeker-job-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeekerJobList implements OnInit, OnDestroy {
  // Form Controls for the search inputs
  titleFilter = new FormControl('');
  locationFilter = new FormControl('');
  salaryMinFilter = new FormControl('');
  salaryMaxFilter = new FormControl('');

  // State for job data
  jobs: IncomingJobPayload[] = [];
  applicationData : IncomingSeekerApplicationPayload[] =[]
  isLoading = true;
  noJobsFound = false;

  // Pagination state
  page = 1;
  limit = 10;
  totalJobs = 0;
  totalPages = 0;
  private pageSubject = new BehaviorSubject<number>(this.page);

  private jobSubscription: Subscription | null = null;

  // Modal and application state
  private userId: number | null = null; // Stored for the applyForJob method
  private appliedJobsId: Set<number> = new Set();

  isModalOpen = false;
  selectedJobId: number | null = null;
  cvFile: File | null = null;
  isApplcationSubmitted : 'not-applied' | 'pending' | 'success' | 'error' = 'not-applied';
  

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private ngZone : NgZone,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    console.log('[Init] Component loaded');

    // Stream for user-driven filter changes with debounce
    const filterChanges$ = combineLatest([
      this.titleFilter.valueChanges.pipe(debounceTime(400), distinctUntilChanged(), startWith('')),
      this.locationFilter.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        startWith('')
      ),
      this.salaryMinFilter.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        startWith('')
      ),
      this.salaryMaxFilter.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        startWith('')
      ),
    ]).pipe(
      tap(() => {
        console.log('[Filters] Changed → reset to page 1');
        this.pageSubject.next(1);
      })
    );

    // Get the user's ID and fetch applied jobs on authentication
    this.authService.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => {
          console.log('[Auth] isAuthenticated$', isAuthenticated);
          return isAuthenticated;
        }),
        tap(() => {
          console.log('[Auth] Fetching user...');
          this.authService.user.pipe(take(1)).subscribe((user) => {
            console.log('[Auth] User value:', user);
            const userID = Number(localStorage.getItem('userId'));
            console.log(user);
            if (user) {
              this.userId = userID;
              console.log(this.userId);
            }
          });
        }),
        switchMap(() => {
          console.log('[Applications] Fetching applications...');
          return this.applicationService.getApplicationsBySeekerId();
        }),
        tap((applications) => {
          console.log('[Applications] Received applications:', applications);
          this.applicationData = applications
          this.appliedJobsId = new Set(applications.map((app)=>app.job_id));
          // applications.map((app)=> {
          //   this.isApplcationSubmitted = app.status
          // })
          console.log(this.appliedJobsId);
          this.cd.detectChanges();
        })
      )
      .subscribe({
        error: (err) => console.error('[Applications] Stream error:', err),
        complete: () => console.log('[Applications] Stream completed'),
      });

    // Combine all data sources: authentication, filters, and pagination
    const jobStream$ = combineLatest([
      this.authService.isAuthenticated$.pipe(
        filter((isAuthenticated) => {
          console.log('[Jobs] isAuthenticated$', isAuthenticated);
          return isAuthenticated;
        })
      ),
      filterChanges$,
      this.pageSubject.asObservable(),
    ]).pipe(
      tap(() => {
        console.log('[Jobs] Starting fetch...');
        this.isLoading = true;
        this.noJobsFound = false;
        this.cd.detectChanges();
      }),
      switchMap(([, [title, location, salaryMin, salaryMax], page]) => {
        const filters = {
          title: title as string,
          location: location as string,
          salaryMin: Number(salaryMin),
          salaryMax: Number(salaryMax),
        };
        console.log('[Jobs] Fetching with filters:', filters, 'page:', page);
        return this.jobService.getJobs(filters, page, this.limit).pipe(
          catchError((err) => {
            console.error('[Jobs] Error fetching jobs:', err);
            this.isLoading = false;
            this.cd.detectChanges();
            return of({ jobs: [], total: 0 });
          })
        );
      })
    );

    this.jobSubscription = jobStream$.subscribe((data) => {
      this.ngZone.run(() => {
        console.log('[Jobs] Response received:', data);
      this.jobs = data.jobs;
      this.totalJobs = data.total;
      this.totalPages = Math.ceil(this.totalJobs / this.limit);
      this.noJobsFound = this.jobs.length === 0 && !this.isLoading;
      console.log('[Jobs] Jobs count:', this.jobs.length, 'Total:', this.totalJobs);
      this.isLoading = false
      console.log(this.isLoading);
      this.cd.detectChanges();
      })
    });
  }

  // --- Pagination Methods ---
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.pageSubject.next(page);
    }
  }

  nextPage() {
    this.goToPage(this.page + 1);
  }

  prevPage() {
    this.goToPage(this.page - 1);
  }

  ngOnDestroy(): void {
    if (this.jobSubscription) {
      this.jobSubscription.unsubscribe();
    }
  }

  // --- Application Modal Methods ---
  openApplyModal(jobId: number) {
    this.selectedJobId = jobId;
    console.log(this.selectedJobId);
    this.isModalOpen = true;
    this.cvFile = null;
    this.isApplcationSubmitted = 'not-applied';
    console.log(this.isApplcationSubmitted);
  }

  closeApplyModal() {
    this.isModalOpen = false;
    this.selectedJobId = null;
    this.cvFile = null;
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.cvFile = fileList[0];
    }
    console.log(this.cvFile);
  }

  submitApplication() {
    console.log('user start clicked');
    console.log(this.cvFile);
    if (!this.selectedJobId || !this.cvFile || !this.userId) {
      this.isApplcationSubmitted = 'error';
      return;
    }
    console.log(this.selectedJobId, this.cvFile, this.userId, ' yse they exist');
    this.isApplcationSubmitted = 'pending';

    // Convert the file to a Base64 string before sending
        
        this.applicationService.applyForJob(this.selectedJobId!, this.userId!, this.cvFile).subscribe({
          next: (response: IncomingCreateApplicationResponse) => {
            console.log(response);
            this.isApplcationSubmitted = 'success';
            this.appliedJobsId.add(this.selectedJobId!);
            this.closeApplyModal()
            this.cd.markForCheck();

          },
          error: (error: any) => {
            console.error('Application failed:', error.error.message);
            this.isApplcationSubmitted = 'error';
            this.cd.markForCheck();
          },
        });
  }

  hasApplied(jobId: number): boolean {
    if(this.appliedJobsId.has(jobId)){
      console.log("true");
    }else{
      console.log("false");
    }
    return this.appliedJobsId.has(jobId);
  }

  getApplicationStatus(jobId: number): string | null {
  const app = this.applicationData.find(a => a.job_id === jobId);
  return app ? app.status : null; 
}

getApplicationStatusClass(jobId: number): string {
  const status = this.getApplicationStatus(jobId);

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


}
