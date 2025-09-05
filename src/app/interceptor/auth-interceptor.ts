// src/app/auth/auth.interceptor.ts
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

// You will also need a simple service to handle logout logic
// e.g.,
// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   logout() { localStorage.removeItem('token'); }
// }

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // You can define this more robustly as needed
  const apiBaseUrl = 'http://localhost:5000/api';
  const protectedApiUrl = `${apiBaseUrl}/job`;

  let newReq = req;

  // Check if a token exists AND the request is to a protected job API endpoint
  if (isPlatformBrowser(platformId) && req.url.startsWith(protectedApiUrl)) {
    const token = localStorage.getItem('token');
    if (token) {
      newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  // Pass the (potentially cloned) request to the next handler
  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check for a 401 error
      if (error.status === 401) {
        console.error('Authentication failed (401 Unauthorized). This error showing cuz we send the request without token before we even get the chance to get token cause ngONinit or something');
        // Optionally, you could also clear the token here
        // localStorage.removeItem('token'); 
        // router.navigate(['/login']); // Navigate to your login route
      }
      // Re-throw the error so that other services/components can also handle it
      return throwError(() => error);
    })
  );
};