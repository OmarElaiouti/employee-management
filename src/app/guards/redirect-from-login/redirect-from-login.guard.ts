import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedirectFromLoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate():boolean{
    const isLoggedIn = !!sessionStorage.getItem('accessToken');
    if (isLoggedIn) {
      this.router.navigate(['/management']);
      return false;
    } else {
      return true;
    }
  }
  }
  

