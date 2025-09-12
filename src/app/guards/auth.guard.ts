// src/app/guards/auth.guard.ts

import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    // On the browser, we have access to localStorage
    const token = localStorage.getItem('token');
    if (token) {
      return true; // Allow navigation if a token exists
    } else {
      router.navigate(['/login']);
      return false; // Block navigation if no token
    }
  }

  // On the server, we assume the user is authenticated for rendering purposes
  // The client-side code will handle the redirection after hydration
  return true;
};