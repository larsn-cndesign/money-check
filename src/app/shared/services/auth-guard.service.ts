import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Function to check if a route can be activated based a user's login state.
 * @param _route The active route (not used).
 * @param state Current stat of the router i.e. current url.
 * @returns True if a user is logged in.
 */
export const canActivate: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) return true;

  return router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
};

/**
 * Method to check if a if a Route can be matched based on a user's login state.
 * @param _route The active route (not used).
 * @param segments Current stat of the router i.e. current url.
 * @returns True if a user is logged in.
 */
export const canMatch: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const stateUrl = segments.reduce((path, currentSegment) => {
    return `${path}/${currentSegment.path}`;
  }, '');

  if (authService.isLoggedIn()) return true;

  return router.navigate(['/login'], { queryParams: { returnUrl: stateUrl } });
};
