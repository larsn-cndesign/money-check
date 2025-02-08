import { TestBed } from '@angular/core/testing';
import { AppUser } from 'src/app/core/models/app-user.model';
import { LS_ACCESS_TOKEN } from '../classes/constants';
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

    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    expect(token).toBe('sadfadsfa.123.#eee');
  });

  it('should store user in localstorage', async () => {
    appUser.name = 'Lars N';
    appUser.isAdmin = true;
    service.storeUser('', appUser);

    service.getStoredUser();

    const user = service.getItemValue();

    expect(user.name).toBe('Lars N');
    expect(user.isAdmin).toBe(true);
  });

  it('should remove user and token from localstorage', () => {
    service.clearStoredUser();

    const user = localStorage.getItem('user');

    expect(user).toBeFalsy();
  });
});
