import { Injectable } from '@angular/core';
import { AppUser } from 'src/app/core/models/app-user.model';
import { StoreItem } from '../classes/store';
import { LS_ACCESS_TOKEN } from '../classes/constants';

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
    this.item = new AppUser();
  }

  /**
   * Store user in localStorage. Separate token from other user info to simplify jwt handling.
   * @param token The jwt token to be stored.
   * @param user The user of the application.
   */
  storeUser(token: string, user: AppUser): void {
    localStorage.setItem(LS_ACCESS_TOKEN, token);
    localStorage.setItem('user', JSON.stringify(user));
    this.store.item = user;
    this.updateStore();
  }

  /**
   * Get user object from localStorage and save it in store.
   */
  getStoredUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.store.item = JSON.parse(user) as AppUser;
      this.updateStore();
    }
  }
}
