import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth-services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = sessionStorage.getItem('accessToken');

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
          return this.handleError(req, next);
     
      })
    );
  }

  private handleError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = sessionStorage.getItem('refreshToken');
console.log(refreshToken);

    if (!refreshToken) {
      this.authService.clearTokens();
      this.router.navigate(['/']);
      return throwError('Please log in again.');
    }

    return this.authService.refreshToken(refreshToken).pipe(
      switchMap((token) => {
        this.authService.saveNewAccessToken(token);
        console.log("new token");
        
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq);
      }),
      catchError((error) => {
        this.authService.clearTokens();
        return throwError(error);
      })
    );
  }
}