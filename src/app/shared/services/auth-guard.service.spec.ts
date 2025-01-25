import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  // let guard: AuthGuard;
  let authService: AuthService;
  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: '/category' };
  const routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerMock }],
    });
    // guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  // it('should be created', () => {
  //   expect(guard).toBeTruthy();
  // });

  // it('should redirect an unauthenticated user to the login route', () => {
  //   spyOn(authService, 'isLoggedIn').and.returnValue(false);

  //   expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
  //   expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: routeStateMock.url } });
  // });

  // it('should allow the authenticated user to access path', () => {
  //   spyOn(authService, 'isLoggedIn').and.returnValue(true);
  //   expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
  // });
});
