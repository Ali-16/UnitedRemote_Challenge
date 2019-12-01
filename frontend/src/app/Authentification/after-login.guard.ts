import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

import { TokenService } from 'src/app/shared/token.service';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})

/**
 * The guard manages authorization of some actions depending on the authentication status of the user
 */
export class AfterLoginGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private tokenService: TokenService,
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.tokenService.loggedIn();
  }
}
