import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ErrorPage } from './pages/error-page/error-page';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';
import { EmployerDashboard } from './pages/employer-dashboard/employer-dashboard';
import { JobTable } from './components/job-table/job-table';
import { JobForm } from './components/job-form/job-form';
import { JobDetail } from './components/job-detail/job-detail';
import { EditJob } from './components/edit-job/edit-job';
import { SeekerDashboard } from './pages/seeker-dashboard/seeker-dashboard';
import { AdminStatsChart } from './components/admin-stats-chart/admin-stats-chart';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminUsersTable } from './components/admin-users-table/admin-users-table';

export const routes: Routes = [
  { path: '', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [AuthGuard] },
  { path: 'admin-dashboard/admin-users-table', component: AdminUsersTable, canActivate: [AuthGuard] },
  { path: 'admin-dashboard/stats-chart', component: AdminStatsChart, canActivate: [AuthGuard] },
  { path: 'seeker-dashboard', component: SeekerDashboard, canActivate: [AuthGuard] },
  { path: 'employer-dashboard', component: EmployerDashboard, canActivate: [AuthGuard] },
  { path: 'employer-dashboard/create-job', component: JobForm, canActivate: [AuthGuard] },
  { path: 'employer-dashboard/job-table', component: JobTable, canActivate: [AuthGuard] },
  { path: 'employer-dashboard/job-table/job-detail/:id', component: JobDetail, canActivate: [AuthGuard] },
  { path: 'employer-dashboard/job-table/edit-job/:id', component: EditJob, canActivate: [AuthGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', component: ErrorPage },
];
