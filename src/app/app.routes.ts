import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ErrorPage } from './pages/error-page/error-page';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';
import { EmployerDashboard } from './pages/employer-dashboard/employer-dashboard';
import { JobTable } from './components/job-table/job-table';
import { JobForm } from './components/job-form/job-form';

export const routes: Routes = [
    {path: "" , component : Dashboard  , canActivate : [AuthGuard]},
    {path: "employer-dashboard" , component : EmployerDashboard  , canActivate : [AuthGuard]},
    {path: "employer-dashboard/create-job" , component : JobForm  , canActivate : [AuthGuard]},
    {path: "employer-dashboard/job-table" , component : JobTable  , canActivate : [AuthGuard]},
    {path : "login",component : Login},
    {path : "register",component : Register},
    {path : "**",component : ErrorPage},
];
