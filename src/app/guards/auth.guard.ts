// src/app/guards/auth.guard.ts

import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      // ✅ If token exists and user tries to access login/register → redirect
      if (state.url === '/login' || state.url === '/register') {
        const role = localStorage.getItem('role');

        switch (role) {
          case 'admin':
            return router.createUrlTree(['/dashboard']);
          case 'seeker':
            return router.createUrlTree(['/seeker-dashboard']);
          case 'employer':
            return router.createUrlTree(['/employer-dashboard']);
          default:
            return router.createUrlTree(['/']); // fallback
        }
      }
      return true; // token exists, allow access to protected route
    } else {
      // ❌ No token → allow only login/register
      if (state.url !== '/login' && state.url !== '/register') {
        return router.createUrlTree(['/login']);
      }
      return true;
    }
  }

  // ✅ SSR fallback (Angular Universal rendering)
  return true;
};
