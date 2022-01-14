import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  isLogin: boolean = false;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem('user')) {
      if (localStorage.getItem('userRo') == '1' || localStorage.getItem('userRo') == '2'||localStorage.getItem('userRo') == '7'||localStorage.getItem('userRo') == '8'||localStorage.getItem('userRo') == '15') {
        return true;
      }
      else {
        this.router.navigate(['/admin']);
        return false;
      }
    } else {
      this.router.navigate(['/admin']);
      return false;
    }

  }
}
