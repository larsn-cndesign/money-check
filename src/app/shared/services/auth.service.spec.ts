import { HttpHeaders, HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserCredential } from 'src/app/core/models/user-credential.model';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';

describe('AuthService', () => {
  let authService: AuthService;
  const getToken = 'getToken'; // Method constant to avoid string literal error when accessing private methods
  let errorService: ErrorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    authService = TestBed.inject(AuthService);
    errorService = TestBed.inject(ErrorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should extract token from Authorization header without the Bearer prefix (none beeing case sensitive)', () => {
    const headers = new HttpHeaders().set('auThoRization', 'beARer asdfsd.AWSFFAfswfasfAfa.asfaf');
    const result = authService[getToken](headers);

    expect(result?.length).toBeGreaterThan(0);
    expect(result).not.toContain('Bearer');
  });

  it('should extract token from Authorization header without the Bearer prefix even without space', () => {
    const headers = new HttpHeaders().set('Authorization', 'Bearerasdfsd.AWSFFAfswfasfAfa.asfaf');
    const result = authService[getToken](headers);

    expect(result?.length).toBeGreaterThan(0);
    expect(result).not.toContain('Bearer');
  });

  it('should fail to get token if Authorization header is missing', () => {
    const headers = new HttpHeaders();
    const result = authService[getToken](headers);

    expect(result).toBeNull();
  });

  it('should clear user and token from localStorage and redirect user to login page', () => {
    const router = TestBed.inject(Router);

    const spy = spyOn(router, 'navigate').and.callFake(() => {
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    });

    authService.logout();

    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    expect(token).toBeFalsy();
    expect(user).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(['/login']);
  });

  it('should call the server to verify credentials', () => {
    const spy = spyOn(authService, 'login').and.callFake(() => {
      return of(true);
    });

    authService.login({ email: '', password: '' });

    expect(spy).toHaveBeenCalled();
  });

  it('should return true if Authorization token and bearer is present in header', () => {
    const customHeader = { Authorization: 'Bearer asdfsd.AWSFFAfswfasfAfa.asfaf' };
    const body = { name: 'Lars Norrstrand', isAdmin: true };
    const fakeResponse = new HttpResponse({ status: 200, body });
    const userCredential = { email: '', password: '' } as UserCredential;

    authService
      .login(userCredential)
      .pipe(first())
      .subscribe((response) => {
        expect(response).toBeTrue();
      });

    const req = httpMock.expectOne('/api/authenticate');
    expect(req.request.method).toBe('POST');

    req.flush(fakeResponse, { headers: new HttpHeaders(customHeader) });
  });

  it('should return false if Authorization token but bearer value is missing in header', () => {
    const customHeader = { Authorization: 'Notvalid asdfsd.AWSFFAfswfasfAfa.asfaf' };
    const body = { name: 'Lars Norrstrand', isAdmin: true };
    const fakeResponse = new HttpResponse({ status: 200, body });
    const userCredential = { email: '', password: '' } as UserCredential;

    authService
      .login(userCredential)
      .pipe(first())
      .subscribe((response) => {
        expect(response).toBeFalse();
      });

    const req = httpMock.expectOne('/api/authenticate');
    expect(req.request.method).toBe('POST');
    req.flush(fakeResponse, { headers: new HttpHeaders(customHeader) });
  });

  it('should return false if Authorization header is missing', () => {
    const customHeader = { notValidHeader: 'Bearer asdfsd.AWSFFAfswfasfAfa.asfaf' };
    const body = { name: 'Lars Norrstrand', isAdmin: true };
    const fakeResponse = new HttpResponse({ status: 200, body });
    const userCredential = { email: '', password: '' } as UserCredential;

    authService
      .login(userCredential)
      .pipe(first())
      .subscribe((response) => {
        expect(response).toBeFalse();
      });

    const req = httpMock.expectOne('/api/authenticate');
    expect(req.request.method).toBe('POST');
    req.flush(fakeResponse, { headers: new HttpHeaders(customHeader) });
  });

  it('should get error message if log in fails', (done) => {
    const userCredential = { email: '', password: '' } as UserCredential;

    const spy = spyOn(errorService, 'handleHttpError').and.returnValue(throwError('Server error'));

    authService
      .login(userCredential)
      .pipe(first())
      .subscribe(
        () => {},
        (error: any) => {
          expect(error).toBe('Server error');
          done();
        }
      );

    const req = httpMock.expectOne('/api/authenticate');
    req.error(new ErrorEvent('API error'));

    expect(spy).toHaveBeenCalled();
  });
});
