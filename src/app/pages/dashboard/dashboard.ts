import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  constructor(private authService : AuthService ,private router : Router){}
  logout(){
    this.authService.logout()
  }
  goToEmpDashboard(){
    this.router.navigate(["/employer-dashboard"])
  }
  goToSeekerDashboard(){
    this.router.navigate(["/seeker-dashboard"])
  }
  goToAdminDashboard(){
    this.router.navigate(["/admin-dashboard"])
  }
}
