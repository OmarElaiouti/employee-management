import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth-services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

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

    if (!refreshToken) {
      this.authService.clearTokens();
      this.router.navigate(['/']);
      return throwError('Please log in again.');
    }

    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        switchMap(token => {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authReq);
        })
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refreshToken(refreshToken).pipe(
      switchMap((newToken: string) => {
        this.authService.saveNewAccessToken(newToken);
        this.refreshTokenSubject.next(newToken);
        console.log('New token emitted:', newToken);
        this.isRefreshing = false;

        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next.handle(authReq);
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.authService.clearTokens();
        this.router.navigate(['/']);
        return throwError(error);
      })
    );
  }
}