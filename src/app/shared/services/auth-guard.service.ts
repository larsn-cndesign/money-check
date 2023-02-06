import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Class representing a guard to prevent unauthorized users to navigate to restriced pages.
 * @implements CanActivate.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * Create a navigation guard.
   * @param authService Service for managing user authentication.
   * @param router Navigation service.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Method to check if a route can be activated based a user's login state.
   * @param _route The active route (not used).
   * @param state Current stat of the router i.e. current url.
   * @returns True if a user is logged in.
   */
  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  /**
   * Method to check if a child route can be loaded based a user's login state.
   * @param _route The active route (not used).
   * @param segments Current stat of the router i.e. current url.
   * @returns True if a user is logged in.
   */
  canLoad(_route: Route, segments: UrlSegment[]): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    const stateUrl = segments.reduce((path, currentSegment) => {
      return `${path}/${currentSegment.path}`;
    }, '');

    this.router.navigate(['/login'], { queryParams: { returnUrl: stateUrl } });
    return false;
  }
}
