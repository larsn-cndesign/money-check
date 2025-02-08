import { Injectable } from '@angular/core';
import { AppUser } from 'src/app/core/models/app-user.model';
import { LS_ACCESS_TOKEN } from '../classes/constants';
import { StoreItem } from '../classes/store';

/**
 * Class representing a service for managing a user.
 * @extends StoreItem.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService extends StoreItem<AppUser> {
  /**
   * Create a user service.
   */
  constructor() {
    super(new AppUser());
  }

  /**
   * Clear user from localStorage and reset user in store.
   */
  clearStoredUser(): void {
    localStorage.removeItem('user');
    this.setItem(new AppUser());
  }

  /**
   * Store user in localStorage. Separate token from other user info to simplify jwt handling.
   * @param token The jwt token to be stored.
   * @param user The user of the application.
   */
  storeUser(token: string, user: AppUser): void {
    localStorage.setItem(LS_ACCESS_TOKEN, token);
    localStorage.setItem('user', JSON.stringify(user));
    this.setItem(user);
  }

  /**
   * Get user object from localStorage and save it in store.
   */
  getStoredUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.setItem(JSON.parse(user) as AppUser);
    }
  }
}
