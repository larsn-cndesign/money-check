import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppUser } from 'src/app/core/models/app-user.model';
import { UserCredential } from 'src/app/core/models/user-credential.model';
import { ErrorService } from './error.service';
import { UserService } from './user.service';

/**
 * Class representing a service for managing authentication of users.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Initialize services.
   * @param router Navigation service.
   * @param http Http request service.
   * @param userService A service manage users.
   * @param errorService Application error service
   */
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private errorService: ErrorService
  ) {}

  /**
   * Log in user if credentials is valid and token is present in header.
   * @param credentials User credentials for logging in.
   * @returns An Observable of boolean.
   * True if login was successful, false if token is not valid or a server error 404 occured.
   */
  login(credentials: UserCredential): Observable<boolean> {
    return this.http.post<AppUser>('/api/authenticate', credentials, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        const token = this.getToken(response.headers);
        if (token && response.body) {
          this.userService.storeUser(token, response.body as AppUser);
          return true;
        }
        return false;
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Checking if token is set.
   * @returns True if token item is found in localStorage.
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') != null;
  }

  /**
   * Logout user.
   * @description Clear localStorage and user object in store and redirect user to login page.
   */
  logout(): void {
    this.userService.clearStoredUser();
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  /**
   * Get token from Authorization header.
   * @param headers Headers in Http response.
   * @returns Token if found, otherwise null.
   */
  private getToken(headers: HttpHeaders): string | null {
    const auth = headers.get('authorization');
    if (!auth) {
      return null;
    }

    return auth.toLowerCase().startsWith('bearer') ? auth.substring(6).trim() : null;
  }
}
