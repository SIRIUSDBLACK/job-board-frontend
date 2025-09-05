import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employer-dashboard',
  imports: [],
  templateUrl: './employer-dashboard.html',
  styleUrl: './employer-dashboard.scss',
})
export class EmployerDashboard {
  constructor(private router: Router) {}

  goToJobForm() {
    this.router.navigate(['/employer-dashboard/create-job']);
  }
  goToJobTable() {
    this.router.navigate(['/employer-dashboard/job-table']);
  }
}
