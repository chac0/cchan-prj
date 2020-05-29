import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService} from './auth.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  //--------------------------
  // CanActivateでログインデータがない状態でルーティングでAuthGurardを
  // 指定しているcomponentにアクセスすると、ルートに戻される
  //--------------------------
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.userData.pipe(
      take(1),
      map(userData => !!userData),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/']);
        }
      })
    )
  }

}
