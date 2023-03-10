import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';

/**
 * Class representing a responsible `toolbar` with `sidenav` for mobile devices.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  /**
   * An observer of a `BudgetState` object.
   * @public
   */
  budgetState$: Observable<BudgetState>;

  /**
   * A Subject that emits values to subscribers.
   * @private
   * @default new Subject<void>() A new subject.
   */
  private notifier$ = new Subject<void>();

  /**
   * A boolean flag that indicates if the screen size matches a mobile device.
   * @public
   * @default false Not a mobile device.
   */
  isMobileDevice = false;

  /**
   * A boolean flag that indicates if the `sidenav` menu is open or not.
   * @public
   * @default false SideNav is not open.
   */
  isSideNavOpen = false;

  /**
   * A boolean flag that indicates if the budget select should be displayed or not.
   * @public
   * @default false Budget select is not visible.
   */
  showBudget = false;

  /**
   * Initializes services and listen to screen size changes.
   * @param breakpointObserver Media query matching utility.
   */
  constructor(
    breakpointObserver: BreakpointObserver,
    private budgetStateService: BudgetStateService,
    private router: Router
  ) {
    breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntil(this.notifier$))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          this.isMobileDevice = result.breakpoints[query];
          this.isSideNavOpen = !this.isMobileDevice;
        }
      });

    this.budgetState$ = this.budgetStateService.item$;
  }

  /**
   * @description Get budget state and listen for navigation changes to show/hide budget select.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.getBudgetState(), this.notifier$).subscribe();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showBudget = false;

        if (this.router.url.indexOf('/feature') !== -1) {
          if (this.router.url.indexOf('/home') === -1 && !this.router.url.endsWith('/create-budget')) {
            this.showBudget = true;
          }
        }
      }
    });

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  /**
   * @description Unsubscribe from all observables and complete the notifier$ subject.
   */
  ngOnDestroy(): void {
    BudgetState.remove();
    this.notifier$.next();
    this.notifier$.complete();
  }

  /**
   * Show or hide `sidenav` menu.
   */
  onToggleSidenav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  /**
   * A method that listens to the event emitted by MenuComponent.
   * Event is emitted when a navigation link is clicked.
   */
  onNavigate(): void {
    this.isSideNavOpen = false;
  }

  /**
   * Handles selection change event on the select.
   * @description Update budget state in localStorage and in memory store.
   * @param e The event object emitted by the select.
   */
  onChangeBudget(e: MatSelectChange): void {
    this.budgetStateService.changeBudget(+e.value);
  }
}
