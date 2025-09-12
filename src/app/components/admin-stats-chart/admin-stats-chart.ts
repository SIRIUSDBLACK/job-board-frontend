import { Component, signal } from '@angular/core';
import { AdminService } from '../../services/admin/admin-service';
import { Chart, registerables } from 'chart.js';
import { IncomingTotalStats } from '../../models/admin.model';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-stats-chart.html',
  styleUrl: './admin-stats-chart.scss',
})
export class AdminStatsChart {
  stats = signal<IncomingTotalStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    jobsPerEmployer : [], 
    applicationsPerJob : []
  });

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.adminService.getDashboardStats().subscribe((data) => {
      this.stats.set(data)
      console.log(this.stats);

      new Chart('jobsPerEmployerChart', {
        type: 'bar',
        data: {
          labels: data.jobsPerEmployer.map((j: any) => j.employer_name),
          datasets: [
            {
              label: 'Jobs Posted',
              data: data.jobsPerEmployer.map((j: any) => j.total_jobs),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        },
      });

      new Chart('applicationsPerJobChart', {
        type: 'doughnut',
        data: {
          labels: data.applicationsPerJob.map((a: any) => a.job_title),
          datasets: [
            {
              label: 'Applications',
              data: data.applicationsPerJob.map((a: any) => a.total_applications),
              backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
          ],
        },
      });
    });
  }
}
