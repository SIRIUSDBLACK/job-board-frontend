import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  constructor(private authService : AuthService , private router : Router){}

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  logout(){
    this.authService.logout()
  }
}
