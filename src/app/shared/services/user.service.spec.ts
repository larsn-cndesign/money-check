import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';
import { AppUser } from 'src/app/core/models/app-user.model';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const appUser = new AppUser();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token in localstorage', () => {
    service.storeUser('sadfadsfa.123.#eee', appUser);

    const token = localStorage.getItem('access_token');

    expect(token).toBe('sadfadsfa.123.#eee');
  });

  // it('should store user in localstorage', () => {
  //   appUser.name = 'Lars N';
  //   appUser.isAdmin = true;
  //   service.storeUser('', appUser);

  //   service.getStoredUser();

  //   service.user$.pipe(first()).subscribe((user: AppUser) => {
  //     expect(user.name).toBe('Lars N');
  //     expect(user.isAdmin).toBe(true);
  //   });
  // });

  // it('should not update user in store object', () => {
  //   localStorage.removeItem('user');

  //   service.getStoredUser();

  // eslint-disable-next-line
  //   expect(service['_store'].user.name).toBeFalsy();
  // });

  it('should remove user and token from localstorage', () => {
    service.clearStoredUser();

    const user = localStorage.getItem('user');

    expect(user).toBeFalsy();
  });
});
