import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  constructor(private router: Router) {}

  goToChart() {
    this.router.navigate(['/admin-dashboard/stats-chart']);
  }
  goToAdminUsersTable() {
    this.router.navigate(['/admin-dashboard/admin-users-table']);
  }
}
