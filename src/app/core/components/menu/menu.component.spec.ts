import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgZone, signal } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BudgetVarianceComponent } from 'src/app/feature/budget-variance/budget-variance.component';
import { click, findEl, findEls } from 'src/app/mock-backend/element.spec-helper';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppUser } from '../../models/app-user.model';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authService: AuthService;
  let router: Router;
  let ngZone: NgZone;

  const loggedInUser: AppUser = { name: 'test@test.com', isAdmin: false };
  const loggedInAdminUser: AppUser = { name: 'test@test.com', isAdmin: true };
  const notLoggedInUser = new AppUser();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuModule, MenuComponent, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([{ path: 'feature/budget-variance', component: BudgetVarianceComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('redirect user to login pagen when logging out', () => {
    const logoutSpy = spyOn(authService, 'logout');

    component.user = signal(loggedInUser);
    fixture.detectChanges();

    click(fixture, 'person');
    fixture.detectChanges();

    click(fixture, 'logout');

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('finds no logout button if user is not loged in', async () => {
    component.user = signal(notLoggedInUser);
    fixture.detectChanges();

    expect(() => {
      findEl(fixture, 'logout');
    }).toThrowError(/not found/);
  });

  it('finds no buttons marked with testid admin if user is not an admin user', () => {
    component.user = signal(loggedInUser);
    fixture.detectChanges();

    expect(findEls(fixture, 'admin').length).toBe(0);
  });

  it('finds all buttons marked with testid admin if user is an admin user', () => {
    const expectedButtonCount = 2;

    component.user = signal(loggedInAdminUser);
    fixture.detectChanges();

    expect(findEls(fixture, 'admin').length).toBe(expectedButtonCount);
  });

  it('emits navigated events when the user clicks a navigation link in the menu', waitForAsync(() => {
    component.user = signal(loggedInAdminUser);
    fixture.detectChanges();

    component.navigated.subscribe(() => {
      expect(); // Event is emitted
    });

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        expect(event).toBeDefined();
      }
    });

    ngZone.run(() => {
      click(fixture, 'budget-variance');
    });
  }));
});
