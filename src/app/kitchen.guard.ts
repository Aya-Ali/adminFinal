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
  providedIn: 'root'
})
export class KitchenGuard implements CanActivate {
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
        if (localStorage.getItem('userRo') == '1' || localStorage.getItem('userRo') == '2' || localStorage.getItem('userRo') == '3'||localStorage.getItem('userRo') == '4'||localStorage.getItem('userRo') == '5'||localStorage.getItem('userRo') == '6'||localStorage.getItem('userRo') == '9'||localStorage.getItem('userRo') == '11'||localStorage.getItem('userRo') == '12'||localStorage.getItem('userRo') == '13'||localStorage.getItem('userRo') == '14') {
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
