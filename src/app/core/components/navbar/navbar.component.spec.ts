import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';
import { click, findComponent, findEl } from 'src/app/mock-backend/element.spec-helper';
import { BUDGET_STATE, OmitAllFromStore } from 'src/app/mock-backend/spec-constants';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { deepCoyp } from 'src/app/shared/classes/common.fn';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MenuComponent } from '../menu/menu.component';
import { NavbarComponent } from './navbar.component';

type OmitFromBudgetState = OmitAllFromStore | 'getBudgetStateInStore' | 'setBudgetSate';

const budgetStateService: Omit<BudgetStateService, OmitFromBudgetState> = {
  getBudgetState(): Observable<BudgetState> {
    return of(BUDGET_STATE);
  },
  changeBudget(budgetId: number): void {
    // this.item.budgetId = budgetId;
    // const budget = this.item.budgets.find((x) => x.id === budgetId);
    // this.item.budgetName = budget ? budget.budgetName : '';
    // this.storeBudgetState();
  },
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let ngZone: NgZone;
  let budgetState: BudgetState;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent, MenuComponent],
      imports: [
        NoopAnimationsModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatSelectModule,
      ],
      providers: [
        { provide: BudgetStateService, useValue: budgetStateService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter(APP_ROUTES),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    userService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    budgetState = deepCoyp(BUDGET_STATE) as BudgetState;
    component.budgetState$ = of(budgetState);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('toggles sidenav when user click on the hamburger menu icon on mobile devices', () => {
    fixture.detectChanges();

    const sideNavOpen = component.isSideNavOpen;

    click(fixture, 'toggle-sidenav');
    expect(component.isSideNavOpen).not.toBe(sideNavOpen);

    click(fixture, 'toggle-sidenav');
    expect(component.isSideNavOpen).toBe(sideNavOpen);
  });

  it('renders an independent menu', () => {
    fixture.detectChanges();

    const menu = findComponent(fixture, 'app-menu');
    expect(menu).toBeTruthy();
  });

  it('hides the sidenav menu when user clicks on a link in it', () => {
    fixture.detectChanges();

    const menu = findComponent(fixture, 'app-menu');
    menu.triggerEventHandler('navigated');

    expect(component.isSideNavOpen).not.toBeTrue();
  });

  xit('listen to budget selection change', () => {
    const budgetId = 1;
    component.showBudget = true;
    fixture.detectChanges();

    const spy = spyOn(budgetStateService, 'changeBudget');

    const element = findEl(fixture, 'change-budget');
    element.triggerEventHandler('selectionChange', { value: budgetId });
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(budgetId);
  });

  xit('hides the budget select when navigating to the home page', waitForAsync(() => {
    // toggleShowBudgetOnNavigation('/feature/home', false);
  }));
  xit('hides the budget select when navigating to the create-budget page', waitForAsync(() => {
    // toggleShowBudgetOnNavigation('/feature/create-budget', false);
  }));
  xit('hides the budget select when navigating to an invalid url', waitForAsync(() => {
    // toggleShowBudgetOnNavigation('', false);
  }));
  xit('shows the budget select when navigating to any valid url that is not home or create budget page', () => {
    // let showBudget = false;

    // TODO Not stable, it sometimes returns returnUrl!

    fixture.detectChanges();

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // showBudget = true;
        console.log(router.url);
      }
    });

    // router.navigate(['/feature/budget-item']);

    ngZone.run(() => {
      router.navigate(['/feature/budget-item']);
    });
    expect(component.showBudget).toBe(true);
  });
});
