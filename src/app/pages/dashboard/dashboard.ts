import { AuthService } from './../../services/auth';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  constructor(private authService : AuthService ){}
  logout(){
    this.authService.logout()
  }
}
