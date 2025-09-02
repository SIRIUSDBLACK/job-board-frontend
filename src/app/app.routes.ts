import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ErrorPage } from './pages/error-page/error-page';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: "" , component : Dashboard  , canActivate : [AuthGuard]},
    {path : "login",component : Login},
    {path : "register",component : Register},
    {path : "**",component : ErrorPage},
];
