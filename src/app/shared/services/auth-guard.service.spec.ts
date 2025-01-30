import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { canActivate, canMatch } from './auth-guard.service';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  describe('canActivate', () => {
    it('should allow navigation if the user is logged in', () => {
      authServiceSpy.isLoggedIn.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() =>
        canActivate({} as ActivatedRouteSnapshot, { url: '/login' } as RouterStateSnapshot)
      );

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to login if the user is not logged in', () => {
      authServiceSpy.isLoggedIn.and.returnValue(false);
      routerSpy.navigate.and.returnValue(Promise.resolve(true)); // Mock navigate returning an observable

      TestBed.runInInjectionContext(() =>
        canActivate({} as ActivatedRouteSnapshot, { url: '/feature/home' } as RouterStateSnapshot)
      );

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/feature/home' } });
    });
  });

  describe('canMatch', () => {
    it('should allow matching if the user is logged in', () => {
      authServiceSpy.isLoggedIn.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => canMatch({} as Route, [{ path: 'login' }] as UrlSegment[]));

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to login if the user is not logged in', () => {
      authServiceSpy.isLoggedIn.and.returnValue(false);
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      TestBed.runInInjectionContext(() => canMatch({} as Route, [{ path: 'feature/home' }] as UrlSegment[]));

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/feature/home' } });
    });
  });
});
