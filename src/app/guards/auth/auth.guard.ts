import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!sessionStorage.getItem('accessToken');
    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }

  canNotActivate(): boolean {
    const isLoggedIn = !!sessionStorage.getItem('accessToken');
    if (isLoggedIn) {
      this.router.navigate(['/management']);
      return false;
    } else {
      return true;
    }
  }
}
