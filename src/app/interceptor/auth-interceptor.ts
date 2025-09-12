// src/app/auth/auth.interceptor.ts
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  const apiBaseUrl = 'http://localhost:5000/api';
  const protectedApiUrl = `${apiBaseUrl}/job`;
  const protectedApiUrl2 = `${apiBaseUrl}/application`;
  const protectedApiUrl3 = `${apiBaseUrl}/admin`;

  if (
    isPlatformBrowser(platformId) &&
    (req.url.startsWith(protectedApiUrl) || req.url.startsWith(protectedApiUrl2) || req.url.startsWith(protectedApiUrl3))
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });

      return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('401 Unauthorized → redirecting to login');
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    } else {
      console.warn('No token → redirecting to login');
      router.navigate(['/login']);
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            error: { message: 'Authentication failed. No token provided.' },
          })
      );
    }
  }

  return next(req);
};
